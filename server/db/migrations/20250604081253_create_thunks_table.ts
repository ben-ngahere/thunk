import { Knex } from 'knex';

export async function up(knex: Knex): Promise<void> {
  return knex.schema.createTable('thunks', (table) => {
    table.increments('id').primary();
    table.string('user_id').notNullable(); // mock_user_ben
    table.string('title').notNullable();
    table.text('text').notNullable();
    table.timestamp('created_at').defaultTo(knex.fn.now()); // timestamp
  });
}

export async function down(knex: Knex): Promise<void> {
  return knex.schema.dropTable('thunks');
}
