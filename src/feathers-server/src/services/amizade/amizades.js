import { authenticate } from '@feathersjs/authentication'
import { hooks as schemaHooks } from '@feathersjs/schema'
import {
  amizadeValidator,
  amizadeDataValidator,
  amizadePatchValidator,
  amizadeResolver,
  amizadeDataResolver,
  amizadePatchResolver
} from './amizades.schema.js'
import { amizadeMethods, amizadePath } from './amizades.shared.js'
import { getOptions, AmizadeService } from './amizades.class.js'
import { app as feathersApp } from '../../app.js'

const preprocessOrQuery = async (context) => {
  const { params, app } = context
  
  // Se há uma query com $or e usuario_id/amigo_id
  if (params.query && params.query.$or && Array.isArray(params.query.$or)) {
    const orConditions = params.query.$or
    const baseQuery = { ...params.query }
    delete baseQuery.$or
    
    // Se temos condições tipo [{ usuario_id: X }, { amigo_id: X }]
    if (orConditions.length === 2 && 
        orConditions[0].usuario_id !== undefined && 
        orConditions[1].amigo_id !== undefined &&
        orConditions[0].usuario_id === orConditions[1].amigo_id) {
      
      const userId = orConditions[0].usuario_id
      
      // Buscar amizades onde sou usuario_id
      const query1 = { usuario_id: userId, ...baseQuery }
      // Buscar amizades onde sou amigo_id
      const query2 = { amigo_id: userId, ...baseQuery }
      
      const results1 = await context.service.find({ query: query1 })
      const results2 = await context.service.find({ query: query2 })
      
      // Combinar resultados
      const allAmizades = [
        ...(results1.data || results1 || []),
        ...(results2.data || results2 || [])
      ]
      
      // Remover duplicatas
      const uniqueAmizades = Array.from(
        new Map(allAmizades.map(a => [a.id, a])).values()
      )
      
      // Retornar no mesmo formato que o find retornaria
      if (results1.total !== undefined) {
        context.result = {
          total: uniqueAmizades.length,
          skip: params.query.$skip || 0,
          limit: params.query.$limit || 50,
          data: uniqueAmizades
        }
      } else {
        context.result = uniqueAmizades
      }
      
      return context
    }
  }
  
  return context
}

const preventSelfFriendship = async (context) => {
  const { data } = context
  if (data.usuario_id === data.amigo_id) {
    throw new Error('Você não pode enviar uma solicitação de amizade para si mesmo.')
  }
  return context
}

const checkDuplicateFriendship = async (context) => {
  const { app, data } = context
  const { usuario_id, amigo_id } = data

  const result = await app.service('amizades').find({
    query: {
      $or: [
        { usuario_id, amigo_id },

        { usuario_id: amigo_id, amigo_id: usuario_id }
      ],
      status: { $in: ['pendente', 'aceito'] }
    }
  })

  if (result.data && result.data.length > 0) {
    throw new Error('Já existe uma solicitação ou amizade ativa entre esses usuários.')
  }
  return context
}

const ensureOnlyRecipientCanUpdateStatus = async (context) => {
  const { data, params, id, service } = context

  if (data.status) {
    const amizade = await service.get(id)
    if (params.user && params.user.id !== amizade.amigo_id) {
      throw new Error('Apenas o destinatário da solicitação pode alterar o status.')
    }
  }
  return context
}

const populateUserData = async (context) => {
  const { app: contextApp, result } = context
  if (!result) return context

  // Usar o app do contexto ou o importado
  const appToUse = contextApp || feathersApp

  const populateData = async (amizade) => {
    console.log('Populando amizade:', amizade.id)
    // Buscar dados do usuario
    if (amizade.usuario_id) {
      try {
        const usuarioData = await appToUse.service('usuario').get(amizade.usuario_id)
        amizade.usuario = usuarioData
        console.log('Usuário carregado:', usuarioData.apelido)
      } catch (error) {
        console.warn(`Erro ao carregar usuário ${amizade.usuario_id}:`, error.message)
      }
    }
    // Buscar dados do amigo
    if (amizade.amigo_id) {
      try {
        const amigoData = await appToUse.service('usuario').get(amizade.amigo_id)
        amizade.amigo = amigoData
        console.log('Amigo carregado:', amigoData.apelido)
      } catch (error) {
        console.warn(`Erro ao carregar amigo ${amizade.amigo_id}:`, error.message)
      }
    }
    return amizade
  }

  // Determinar se é paginado (com total, skip, limit) ou array simples
  if (result.total !== undefined && result.data) {
    // Resposta paginada do Feathers
    result.data = await Promise.all(result.data.map(populateData))
  } else if (Array.isArray(result)) {
    // Array simples (não paginado)
    const updated = await Promise.all(result.map(populateData))
    // Retornar como está (pode ser atribuído de volta)
    context.result = updated
    return context
  } else if (result && typeof result === 'object' && !Array.isArray(result)) {
    // Único objeto (get)
    await populateData(result)
  }
  
  return context
}

export const amizade = (app) => {
  app.use(amizadePath, new AmizadeService(getOptions(app)), {
    methods: amizadeMethods,
    events: []
  })

  const hooks = {
    around: {
      all: [schemaHooks.resolveExternal(amizadeResolver), schemaHooks.resolveResult(amizadeResolver)]
    },
    before: {
      all: [authenticate('jwt')],
      find: [preprocessOrQuery],
      get: [],
      create: [
        preventSelfFriendship,
        checkDuplicateFriendship,
        schemaHooks.validateData(amizadeDataValidator),
        schemaHooks.resolveData(amizadeDataResolver)
      ],
      patch: [
        ensureOnlyRecipientCanUpdateStatus,
        schemaHooks.validateData(amizadePatchValidator),
        schemaHooks.resolveData(amizadePatchResolver)
      ],
      remove: []
    },
    after: {
      all: [],
      find: [populateUserData],
      get: [populateUserData]
    },
    error: {
      all: []
    }
  }

  app.service(amizadePath).hooks(hooks)
}
