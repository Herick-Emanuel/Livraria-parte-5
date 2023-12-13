/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
export function up(knex) {
  return knex.schema.table('livros', function (table) {
    table.integer('publicar').alter()
    table
      .enum('status', ['Aprovado', 'Reprovado', 'Em análise', 'Esgotado', 'Revisão'])
      .defaultTo('Em análise')
  })
}

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
export function down(knex) {
  return knex.schema.table('livros', function (table) {
    table.boolean('publicar').alter()
    table.dropColumn('status')
  })
}
