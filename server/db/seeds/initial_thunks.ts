import { Knex } from 'knex';

export async function seed(knex: Knex): Promise<void> {
  await knex('thunks').del();

  await knex('thunks').insert([
    {
      user_id: 'github|204113180',
      title: 'My First Seeded Thunk',
      text: 'This is a sample thunk added during the database seeding process',
      created_at: knex.fn.now(),
    },
  ]);
}
