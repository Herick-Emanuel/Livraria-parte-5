export const livrosPath = 'livros'

export const livrosMethods = ['find', 'get', 'create', 'patch', 'remove']

export const livrosClient = (client) => {
  const connection = client.get('connection')

  client.use(livrosPath, connection.service(livrosPath), {
    methods: livrosMethods
  })
}
