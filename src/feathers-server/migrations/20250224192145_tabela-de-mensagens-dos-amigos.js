export async function up(knex) {
  const exists = await knex.schema.hasTable('mensagens')
  if (!exists) {
    return knex.schema.createTable('mensagens', function (table) {
      table.increments('id').primary()
      table
        .integer('remetente_id')
        .unsigned()
        .notNullable()
        .references('id')
        .inTable('usuario')
        .onDelete('CASCADE')
      table
        .integer('destinatario_id')
        .unsigned()
        .notNullable()
        .references('id')
        .inTable('usuario')
        .onDelete('CASCADE')
      table.text('mensagem').notNullable()
      table.timestamp('lida_em').nullable()
      table.timestamps(true, true)
    })
  }
}

export async function down(knex) {
  return knex.schema.dropTableIfExists('mensagens')
}
