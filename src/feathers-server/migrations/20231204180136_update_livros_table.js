/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
export const up = async (knex) => {
  await knex.schema.table('livros', function(table) {
    table.string('titulo');
    table.string('autor');
    table.string('editora');
    table.integer('anoPublicacao');
    table.decimal('preco');
    table.string('descricao');
  });
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
export const down = async (knex) => {
  await knex.schema.table('livros', function(table) {
    table.dropColumn('titulo');
    table.dropColumn('autor');
    table.dropColumn('editora');
    table.dropColumn('anoPublicacao');
    table.dropColumn('preco');
    table.dropColumn('descricao');
  });
};