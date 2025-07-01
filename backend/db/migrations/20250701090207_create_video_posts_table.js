/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
export async function up(knex) {
  await knex.schema.createTable('video_posts', (table) => {
    table.increments('id').primary();
    table.integer('user_id').references('user_id').inTable('users');
    table.integer('room_id').references('id').inTable('theme_rooms');
    table.string('video_path').notNullable();
    table.text('description');
    table.text('text_content'); // <--- HIER ergänzen
    table.timestamp('created_at').defaultTo(knex.fn.now());
  });
}

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
export async function down(knex) {
  await knex.schema.dropTableIfExists('video_posts');
}
