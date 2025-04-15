// For more information about this file see https://dove.feathersjs.com/guides/cli/service.schemas.html
import { resolve, getValidator, querySyntax } from '@feathersjs/schema'
import { passwordHash } from '@feathersjs/authentication-local'
import { dataValidator, queryValidator } from '../../validators.js'

export const userSchema = {
  $id: 'User',
  type: 'object',
  additionalProperties: false,
  required: ['id', 'email', 'apelido', 'cargo', 'perfil'],
  properties: {
    id: { type: 'number' },
    apelido: { type: 'string' },
    email: { type: 'string' },
    password: { type: 'string' },
    cargo: { type: 'string' },
    googleId: { type: 'string' },
    facebookId: { type: 'string' },
    twitterId: { type: 'string' },
    githubId: { type: 'string' },
    auth0Id: { type: 'string' },
    perfil: { type: 'string' },
    biografia: { type: 'string' },
    imagemPerfil: { type: 'string' }
  }
}

export const userValidator = getValidator(userSchema, dataValidator)
export const userResolver = resolve({})

export const userExternalResolver = resolve({
  password: async (value, user, context) => {
    if (context.params.provider) {
      return undefined
    }

    return value
  }
})

export const userDataSchema = {
  $id: 'UserData',
  type: 'object',
  additionalProperties: false,
  required: ['apelido', 'email'],
  properties: {
    ...userSchema.properties
  }
}
export const userDataValidator = getValidator(userDataSchema, dataValidator)
export const userDataResolver = resolve({
  password: passwordHash({ strategy: 'local' })
})

export const userPatchSchema = {
  $id: 'UserPatch',
  type: 'object',
  additionalProperties: false,
  required: [],
  properties: {
    ...userSchema.properties
  }
}
export const userPatchValidator = getValidator(userPatchSchema, dataValidator)
export const userPatchResolver = resolve({
  password: passwordHash({ strategy: 'local' })
})

export const userQuerySchema = {
  $id: 'UserQuery',
  type: 'object',
  additionalProperties: false,
  properties: {
    ...querySyntax(userSchema.properties),
    apelido: {
      anyOf: [
        { type: 'string' },
        {
          type: 'object',
          properties: {
            $like: { type: 'string' }
          },
          additionalProperties: true
        }
      ]
    }
  }
}

export const userQueryValidator = getValidator(userQuerySchema, queryValidator)
export const userQueryResolver = resolve({
  id: async (value, user, context) => {
    if (context.method !== 'find' && context.method !== 'get' && context.params.user) {
      return context.params.user.id
    }
    return value
  },
  isPrivate: async (value, user, context) => {
    if (context.params.user && context.params.provider) {
      return value
    }

    return undefined
  }
})
