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
      find: [],
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
      all: []
    },
    error: {
      all: []
    }
  }

  app.service(amizadePath).hooks(hooks)
}
