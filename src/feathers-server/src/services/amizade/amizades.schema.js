import { resolve, getValidator } from '@feathersjs/schema'
import { dataValidator } from '../../validators.js'

export const amizadeSchema = {
  $id: 'Amizade',
  type: 'object',
  additionalProperties: false,
  required: ['usuario_id', 'amigo_id', 'status'],
  properties: {
    id: { type: 'number' },
    usuario_id: { type: 'number' },
    amigo_id: { type: 'number' },
    status: { type: 'string', enum: ['pendente', 'aceito', 'rejeitado'] }
  }
}

export const amizadeValidator = getValidator(amizadeSchema, dataValidator)
export const amizadeResolver = resolve({})

export const amizadeDataSchema = {
  $id: 'AmizadeData',
  type: 'object',
  additionalProperties: false,
  required: ['usuario_id', 'amigo_id'],
  properties: {
    ...amizadeSchema.properties
  }
}
export const amizadeDataValidator = getValidator(amizadeDataSchema, dataValidator)
export const amizadeDataResolver = resolve({})

export const amizadePatchSchema = {
  $id: 'AmizadePatch',
  type: 'object',
  additionalProperties: false,
  required: [],
  properties: {
    status: { type: 'string', enum: ['pendente', 'aceito', 'rejeitado'] }
  }
}
export const amizadePatchValidator = getValidator(amizadePatchSchema, dataValidator)
export const amizadePatchResolver = resolve({})
