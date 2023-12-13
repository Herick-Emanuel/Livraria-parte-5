/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
export function up(knex) {
    return knex.schema
      .alterTable('livros', (table) => {
        table.integer('estoque').defaultTo(0);
      })
      .alterTable('usuario', (table) => {
        table.string('imagem');
        table.string('biografia');
        table.enu('perfil', ['Publico', 'Privado', 'Premium', 'Verificado', 'Administrador']).defaultTo('Publico');
      })
      .alterTable('textos', (table) => {
        table.string('titulo');
        table.string('autor');
        table.enu('status', ['Aprovado', 'Reprovado', 'Em análise', 'Revisão', 'Excluido']).defaultTo('Em análise');
      });
  }
  
  /**
   * @param { import("knex").Knex } knex
   * @returns { Promise<void> }
   */
  export function down(knex) {
    return knex.schema
      .alterTable('livros', (table) => {
        table.dropColumn('estoque');
      })
      .alterTable('usuario', (table) => {
        table.dropColumns('imagem', 'biografia', 'perfil');
      })
      .dropTableIfExists('textos');
  }  
