import knex from 'knex';
import config from '../knexfile';

const db = knex(config.development);

// TYPE: Thunk Entry (components/Log ln7)
export interface Thunk {
  id: number;
  user_id: string;
  title: string;
  text: string;
  created_at: string; // can be converted to Date
}

// GET: Saved Thunks for a User (server/server.ts ln 18) (components/Log ln25)
export async function getThunksByUserId(userId: string): Promise<Thunk[]> {
  return db('thunks')
    .where('user_id', userId)
    .orderBy('created_at', 'desc') // Most recent first
    .select('id', 'title', 'text', 'created_at');
}

// POST: Save a Thunk (server/server.ts ln29)
export async function addThunk(thunk: Omit<Thunk, 'id' | 'created_at'>): Promise<Thunk> {
  const [newThunk] = await db('thunks')
    .insert({
      user_id: thunk.user_id,
      title: thunk.title,
      text: thunk.text,
      created_at: db.fn.now(), // Timestamp
    })
    .returning(['id', 'user_id', 'title', 'text', 'created_at']);

  return newThunk;
}

// GET: A Thunk by ID (server/server.ts ln58)
export async function getThunkById(id: number, userId: string): Promise<Thunk> {
  return db('thunks')
    .where('id', id)
    .andWhere('user_id', userId) // Makes sure the ID belongs to a user
    .first();
}

// PATCH: A Thunk (Update) (server/server.ts ln108)
export async function updateThunk(
  id: number,
  userId: string,
  newTitle: string,
  newText: string
): Promise<number> {
  return db('thunks')
    .where('id', id)
    .andWhere('user_id', userId) // Only updates if it belongs to a user
    .update({
      title: newTitle,
      text: newText,
    });
}

// DELETE: A Thunk by ID (server/server.ts ln138)
export async function deleteThunk(id: number, userId: string): Promise<number> {
  return db('thunks')
    .where('id', id)
    .andWhere('user_id', userId) // Only deletes if it belongs to the user
    .del()
}
