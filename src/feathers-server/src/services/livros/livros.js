// For more information about this file see https://dove.feathersjs.com/guides/cli/service.html
import { authenticate } from '@feathersjs/authentication'

import { hooks as schemaHooks } from '@feathersjs/schema'
import {
  livrosDataValidator,
  livrosPatchValidator,
  livrosQueryValidator,
  livrosResolver,
  livrosExternalResolver,
  livrosDataResolver,
  livrosPatchResolver,
  livrosQueryResolver
} from './livros.schema.js'
import { LivrosService, getOptions } from './livros.class.js'
import { livrosPath, livrosMethods } from './livros.shared.js'

export * from './livros.class.js'
export * from './livros.schema.js'

// A configure function that registers the service and its hooks via `app.configure`
export const livros = (app) => {
  // Register our service on the Feathers application
  app.use(livrosPath, new LivrosService(getOptions(app)), {
    // A list of all methods this service exposes externally
    methods: livrosMethods,
    // You can add additional custom events to be sent to clients here
    events: []
  })
  // Initialize hooks
  app.service(livrosPath).hooks({
    around: {
      all: [
        authenticate('jwt'),
        schemaHooks.resolveExternal(livrosExternalResolver),
        schemaHooks.resolveResult(livrosResolver)
      ]
    },
    before: {
      all: [schemaHooks.validateQuery(livrosQueryValidator), schemaHooks.resolveQuery(livrosQueryResolver)],
      find: [],
      get: [schemaHooks.validateQuery(livrosQueryValidator), schemaHooks.resolveQuery(livrosQueryResolver)],
      create: [schemaHooks.validateData(livrosDataValidator), schemaHooks.resolveData(livrosDataResolver)],
      patch: [schemaHooks.validateData(livrosPatchValidator), schemaHooks.resolveData(livrosPatchResolver)],
      remove: []
    },
    after: {
      all: []
    },
    error: {
      all: []
    }
  })
}