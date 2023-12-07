export const userPath = 'usuario'

export const userMethods = ['find', 'get', 'create', 'patch', 'remove']

export const userClient = (client) => {
  const connection = client.get('connection')

  client.use(userPath, connection.service(userPath), {
    methods: userMethods
  })
}