export async function up(knex) {
  await knex.raw(`
      ALTER TABLE usuario 
      MODIFY biografia TEXT 
      CHARACTER SET utf8mb4 
      COLLATE utf8mb4_unicode_ci;
    `)
}

export async function down(knex) {
  await knex.raw(`
      ALTER TABLE usuario 
      MODIFY biografia TEXT 
      CHARACTER SET utf8 
      COLLATE utf8_unicode_ci;
    `)
}
