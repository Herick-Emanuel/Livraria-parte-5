// For more information about this file see https://dove.feathersjs.com/guides/cli/service.schemas.html
import { resolve, getValidator, querySyntax } from '@feathersjs/schema'
import { passwordHash } from '@feathersjs/authentication-local'
import { dataValidator, queryValidator } from '../../validators.js'

// Main data model schema
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
    perfil: {type: 'string'}
  }
}

export const userValidator = getValidator(userSchema, dataValidator)
export const userResolver = resolve({})

export const userExternalResolver = resolve({
  // O password nunca deve ser visível externamente
  password: async (value, user, context) => {
    if (context.params.provider) {
      return undefined; // Oculta externamente
    }

    return value; // Mantém internamente
  }
});

// Schema para criar novos dados
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

// Schema para atualizar dados existentes
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

// Schema para propriedades permitidas na consulta
export const userQuerySchema = {
  $id: 'UserQuery',
  type: 'object',
  additionalProperties: false,
  properties: {
    ...querySyntax(userSchema.properties)
  }
}
export const userQueryValidator = getValidator(userQuerySchema, queryValidator)
export const userQueryResolver = resolve({
  // Se houver um usuário (por exemplo, com autenticação), ele só pode ver seus próprios dados
  id: async (value, user, context) => {
    if (context.params.user) {
      return context.params.user.id;
    }

    return value;
  },
  // Adicione a lógica para manter a visibilidade interna mesmo se o perfil for privado
  isPrivate: async (value, user, context) => {
    if (context.params.user && context.params.provider) {
      return value; // Mantém visibilidade interna se o usuário estiver autenticado e a solicitação for externa
    }

    return undefined; // Oculta externamente se não for uma solicitação autenticada ou se for interna
  }
});