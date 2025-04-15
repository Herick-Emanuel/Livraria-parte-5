export const mensagemPath = 'mensagens'
export const mensagemMethods = ['find', 'get', 'create', 'update', 'patch', 'remove']

export const mensagemClient = (client) => {
  const connection = client.get('connection')
  client.use(mensagemPath, connection.service(mensagemPath), {
    methods: mensagemMethods
  })
}
