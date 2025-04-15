import { amizade } from './amizade/amizades.js'
import { livros } from './livros/livros.js'
import { mensagem } from './mensagens/mensagens.js'
import { user } from './usuario/usuario.js'

export const services = (app) => {
  app.configure(livros)

  app.configure(user)

  app.configure(amizade)

  app.configure(mensagem)
  // All services will be registered here
}
