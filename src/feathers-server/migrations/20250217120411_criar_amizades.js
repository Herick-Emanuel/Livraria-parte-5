export async function up(knex) {
  const exists = await knex.schema.hasTable('amizades')
  if (!exists) {
    return knex.schema.createTable('amizades', function (table) {
      table.increments('id').primary()
      table
        .integer('usuario_id')
        .unsigned()
        .notNullable()
        .references('id')
        .inTable('usuario')
        .onDelete('CASCADE')
      table
        .integer('amigo_id')
        .unsigned()
        .notNullable()
        .references('id')
        .inTable('usuario')
        .onDelete('CASCADE')
      table.enu('status', ['pendente', 'aceito', 'rejeitado']).defaultTo('pendente')
      table.timestamps(true, true)
    })
  }
}

export async function down(knex) {
  return knex.schema.dropTableIfExists('amizades')
}
