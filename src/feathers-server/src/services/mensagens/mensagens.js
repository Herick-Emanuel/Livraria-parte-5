import { authenticate } from '@feathersjs/authentication'
import { hooks as schemaHooks } from '@feathersjs/schema'
import {
  mensagemValidator,
  mensagemDataValidator,
  mensagemPatchValidator,
  mensagemResolver,
  mensagemDataResolver,
  mensagemPatchResolver
} from './mensagens.schema.js'
import { mensagemMethods, mensagemPath } from './mensagens.shared.js'
import { getOptions, MensagemService } from './mensagens.class.js'

const ensureSenderMatchesUser = async (context) => {
  const { data, params } = context
  if (params.user && data.remetente_id !== params.user.id) {
    throw new Error('Você só pode enviar mensagens como o remetente autenticado.')
  }
  return context
}

const restrictMessageAccess = async (context) => {
  const { params } = context
  const userId = params.user.id
  params.query = {
    ...params.query,
    $or: [{ remetente_id: userId }, { destinatario_id: userId }]
  }
  return context
}

const setReadTimestamp = async (context) => {
  const { data } = context
  if (data.lida_em === true) {
    data.lida_em = new Date().toISOString()
  }
  return context
}

const populateUserDataMensagens = async (context) => {
  const { result } = context
  if (!result) return context

  const populateData = async (mensagem) => {
    // Buscar dados do remetente
    if (mensagem.remetente_id) {
      try {
        const usuarioService = context.app.service('usuario')
        mensagem.remetente = await usuarioService.get(mensagem.remetente_id)
      } catch (error) {
        console.warn(`Erro ao carregar remetente ${mensagem.remetente_id}:`, error.message)
      }
    }
    // Buscar dados do destinatário
    if (mensagem.destinatario_id) {
      try {
        const usuarioService = context.app.service('usuario')
        mensagem.destinatario = await usuarioService.get(mensagem.destinatario_id)
      } catch (error) {
        console.warn(`Erro ao carregar destinatário ${mensagem.destinatario_id}:`, error.message)
      }
    }
    return mensagem
  }

  // Determinar se é paginado (com total, skip, limit) ou array simples
  if (result.total !== undefined && result.data) {
    // Resposta paginada do Feathers
    result.data = await Promise.all(result.data.map(populateData))
  } else if (Array.isArray(result)) {
    // Array simples (não paginado)
    const updated = await Promise.all(result.map(populateData))
    context.result = updated
    return context
  } else if (result && typeof result === 'object' && !Array.isArray(result)) {
    // Único objeto (get)
    await populateData(result)
  }
  
  return context
}

export const mensagem = (app) => {
  app.use(mensagemPath, new MensagemService(getOptions(app)), {
    methods: mensagemMethods,
    events: []
  })

  const hooks = {
    around: {
      all: [schemaHooks.resolveExternal(mensagemResolver), schemaHooks.resolveResult(mensagemResolver)]
    },
    before: {
      all: [authenticate('jwt'), restrictMessageAccess],
      find: [],
      get: [],
      create: [
        ensureSenderMatchesUser,
        schemaHooks.validateData(mensagemDataValidator),
        schemaHooks.resolveData(mensagemDataResolver)
      ],
      patch: [
        setReadTimestamp,
        schemaHooks.validateData(mensagemPatchValidator),
        schemaHooks.resolveData(mensagemPatchResolver)
      ],
      remove: []
    },
    after: {
      all: [],
      find: [populateUserDataMensagens],
      get: [populateUserDataMensagens]
    },
    error: {
      all: []
    }
  }

  app.service(mensagemPath).hooks(hooks)
}
