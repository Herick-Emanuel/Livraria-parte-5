import { resolve, getValidator } from '@feathersjs/schema'
import { dataValidator } from '../../validators.js'

export const mensagemSchema = {
  $id: 'Mensagem',
  type: 'object',
  additionalProperties: false,
  required: ['remetente_id', 'destinatario_id', 'mensagem'],
  properties: {
    id: { type: 'number' },
    remetente_id: { type: 'number' },
    destinatario_id: { type: 'number' },
    mensagem: { type: 'string' },
    lida_em: { type: ['string', 'null'], format: 'date-time' }
  }
}

export const mensagemValidator = getValidator(mensagemSchema, dataValidator)
export const mensagemResolver = resolve({})

export const mensagemDataSchema = {
  $id: 'MensagemData',
  type: 'object',
  additionalProperties: false,
  required: ['remetente_id', 'destinatario_id', 'mensagem'],
  properties: {
    ...mensagemSchema.properties
  }
}
export const mensagemDataValidator = getValidator(mensagemDataSchema, dataValidator)
export const mensagemDataResolver = resolve({})

export const mensagemPatchSchema = {
  $id: 'MensagemPatch',
  type: 'object',
  additionalProperties: false,
  required: [],
  properties: {
    lida_em: { type: ['string', 'null'], format: 'date-time' }
  }
}
export const mensagemPatchValidator = getValidator(mensagemPatchSchema, dataValidator)
export const mensagemPatchResolver = resolve({})
