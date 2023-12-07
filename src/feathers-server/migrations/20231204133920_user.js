export async function up(knex) {
  await knex.schema.createTable('usuario', (table) => {
    table.increments('id')
    table.string('email').unique()
    table.string('password')
    table.string('googleId')
    table.string('facebookId')
    table.string('twitterId')
    table.string('githubId')
    table.string('auth0Id')
  })
}

export async function down(knex) {
  await knex.schema.dropTable('usuario')
}
