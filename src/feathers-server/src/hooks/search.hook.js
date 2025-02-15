const searchHook = async (context) => {
  if (context.method === 'find') {
    const { query } = context.params
    if (query.search) {
      const searchTerm = query.search
      delete query.search
      query.apelido = { $like: `%${searchTerm}%` }
      query.perfil = 'Publico'
    }
  }
  return context
}

export default searchHook
