import knex from 'knex';
import config from '../knexfile';

const db = knex(config.development);

// TYPE: Thunk Entry
export interface Thunk {
  id: number;
  user_id: string;
  title: string;
  text: string;
  created_at: string; // can be converted to Date
}

// GET: Saved Thunks for a User (server/server.ts ln 18)
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
