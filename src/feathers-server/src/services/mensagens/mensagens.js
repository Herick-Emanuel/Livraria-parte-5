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
import { app } from '../../app.js'

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

export const mensagem = (app) => ({
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
    all: []
  },
  error: {
    all: []
  }
})
