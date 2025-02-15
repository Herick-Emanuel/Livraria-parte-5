// For more information about this file see https://dove.feathersjs.com/guides/cli/service.schemas.html
import { resolve, getValidator, querySyntax } from '@feathersjs/schema'
import { dataValidator, queryValidator } from '../../validators.js'

export const livrosSchema = {
  $id: 'Livros',
  type: 'object',
  additionalProperties: false,
  required: ['id', 'titulo', 'autor', 'editora', 'anoPublicacao', 'preco', 'descricao', 'publicar'],
  properties: {
    id: { type: 'number' },
    titulo: { type: 'string' },
    autor: { type: 'string' },
    editora: { type: 'string' },
    genero: { type: 'string' },
    anoPublicacao: { type: 'number' },
    preco: { type: 'number' },
    descricao: { type: 'string' },
    publicar: { type: 'number' },
    status: { type: 'string' },
    avaliacao: { type: 'number' },
    comentario: { type: 'string' },
    imagem: { type: 'string' }
  }
}
export const livrosValidator = getValidator(livrosSchema, dataValidator)
export const livrosResolver = resolve({})

export const livrosExternalResolver = resolve({})

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

export const livrosPatchSchema = {
  $id: 'LivrosPatch',
  type: 'object',
  additionalProperties: false,
  required: [],
  properties: {
    ...livrosSchema.properties,
    status: { type: 'string', enum: ['Aprovado', 'Reprovado', 'Em análise', 'Esgotado', 'Revisão'] },
    genero: {
      type: 'string',
      enum: [
        'Fantasia',
        'Romance',
        'Ficcao',
        'Distopia',
        'Acao',
        'Aventura',
        'Ficcao Cientifica',
        'Cientifico',
        'Historia',
        'Suspense',
        'Terror'
      ]
    }
  }
}
export const livrosPatchValidator = getValidator(livrosPatchSchema, dataValidator)
export const livrosPatchResolver = resolve({})

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
