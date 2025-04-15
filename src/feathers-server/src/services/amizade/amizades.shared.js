export const amizadePath = 'amizades'
export const amizadeMethods = ['find', 'get', 'create', 'update', 'patch', 'remove']

export const amizadeClient = (client) => {
  const connection = client.get('connection')
  client.use(amizadePath, connection.service(amizadePath), {
    methods: amizadeMethods
  })
}
