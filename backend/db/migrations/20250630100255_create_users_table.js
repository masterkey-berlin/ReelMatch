export async function up(knex) {
  return knex.schema.createTable('users', (table) => {
    table.increments('user_id').primary();
    table.string('username', 255).notNullable().unique();
    table.string('profile_video_path');
    table.text('short_bio');
    table.timestamp('created_at').defaultTo(knex.fn.now());
  });
}

export async function down(knex) {
  return knex.schema.dropTable('users');
}
