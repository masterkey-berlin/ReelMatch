export async function up(knex) {
  await knex.schema.createTable('interests', (table) => {
    table.increments('interest_id').primary();
    table.integer('initiator_user_id').unsigned().notNullable().references('user_id').inTable('users').onDelete('CASCADE');
    table.integer('target_user_id').unsigned().notNullable().references('user_id').inTable('users').onDelete('CASCADE');
    table.timestamp('created_at').defaultTo(knex.fn.now());
    table.unique(['initiator_user_id', 'target_user_id']); // Verhindert doppelte Interessenbekundungen
  });

  await knex.schema.createTable('matches', (table) => {
    table.increments('match_id').primary();
    table.integer('user1_id').unsigned().notNullable().references('user_id').inTable('users').onDelete('CASCADE');
    table.integer('user2_id').unsigned().notNullable().references('user_id').inTable('users').onDelete('CASCADE');
    table.timestamp('created_at').defaultTo(knex.fn.now());
    table.unique(['user1_id', 'user2_id']);
  });

  await knex.schema.createTable('messages', (table) => {
    table.increments('message_id').primary();
    table.integer('match_id').unsigned().notNullable().references('match_id').inTable('matches').onDelete('CASCADE');
    table.integer('sender_id').unsigned().notNullable().references('user_id').inTable('users').onDelete('CASCADE');
    table.text('content').notNullable();
    table.timestamp('sent_at').defaultTo(knex.fn.now());
  });
}

export async function down(knex) {
  await knex.schema.dropTableIfExists('messages');
  await knex.schema.dropTableIfExists('matches');
  await knex.schema.dropTableIfExists('interests');
}
