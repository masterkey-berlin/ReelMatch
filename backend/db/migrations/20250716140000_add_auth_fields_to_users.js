export async function up(knex) {
  return knex.schema.alterTable('users', (table) => {
    table.string('email').unique();
    table.string('password');
    table.index('email');
  });
}

export async function down(knex) {
  return knex.schema.alterTable('users', (table) => {
    table.dropColumn('email');
    table.dropColumn('password');
  });
}
