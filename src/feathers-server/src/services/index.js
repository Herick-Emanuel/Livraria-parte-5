import { livros } from './livros/livros.js'

import { user } from './usuario/usuario.js'

export const services = (app) => {
  app.configure(livros)

  app.configure(user)

  // All services will be registered here
}
