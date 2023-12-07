// For more information about this file see https://dove.feathersjs.com/guides/cli/service.schemas.html
import { resolve, getValidator, querySyntax } from '@feathersjs/schema'
import { dataValidator, queryValidator } from '../../validators.js'

// Main data model schema
export const livrosSchema = {
  $id: 'Livros',
  type: 'object',
  additionalProperties: false,
  required: ['id', 'titulo', 'autor', 'editora', 'anoPublicacao', 'preco', 'descricao'],
  properties: {
    id: { type: 'number' },
    titulo: { type: 'string' },
    autor: { type: 'string' },
    editora: { type: 'string' },
    anoPublicacao: { type: 'number' },
    preco: { type: 'number' },
    descricao: { type: 'string' },
  }
}
export const livrosValidator = getValidator(livrosSchema, dataValidator)
export const livrosResolver = resolve({})

export const livrosExternalResolver = resolve({})

// Schema for creating new data
export const livrosDataSchema = {
  $id: 'LivrosData',
  type: 'object',
  additionalProperties: false,
  required: ['titulo', 'autor', 'editora', 'anoPublicacao', 'preco', 'descricao'],
  properties: {
    ...livrosSchema.properties
  }
}
export const livrosDataValidator = getValidator(livrosDataSchema, dataValidator)
export const livrosDataResolver = resolve({})

// Schema for updating existing data
export const livrosPatchSchema = {
  $id: 'LivrosPatch',
  type: 'object',
  additionalProperties: false,
  required: [],
  properties: {
    ...livrosSchema.properties
  }
}
export const livrosPatchValidator = getValidator(livrosPatchSchema, dataValidator)
export const livrosPatchResolver = resolve({})

// Schema for allowed query properties
export const livrosQuerySchema = {
  $id: 'LivrosQuery',
  type: 'object',
  additionalProperties: false,
  properties: {
    ...querySyntax(livrosSchema.properties)
  }
}
export const livrosQueryValidator = getValidator(livrosQuerySchema, queryValidator)
export const livrosQueryResolver = resolve({})