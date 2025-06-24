import request from 'superagent'

const API_BASE_URL = 'https://thunk-backend.onrender.com'

export async function getGreeting() {
  const res = await request.get(`${API_BASE_URL}/api/greeting`)
  return res.body.greeting as string
}

interface Thunk {
  id: number;
  user_id: string;
  title: string;
  text: string;
}

interface NewThunk {
  title: string;
  text: string;
}

// GET all thunks for the authenticated user
export async function getThunks(accessToken: string): Promise<Thunk[]> {
  const res = await request.get(`${API_BASE_URL}/api/thunks`)
    .set('Authorization', `Bearer ${accessToken}`)
  return res.body as Thunk[]
}

// ADD
export async function addThunk(newThunk: NewThunk, accessToken: string): Promise<Thunk> {
  const res = await request.post(`${API_BASE_URL}/api/thunks`)
    .set('Authorization', `Bearer ${accessToken}`)
    .send(newThunk)
  return res.body.thunk as Thunk
}

// GET a single thunk by ID
export async function getThunkById(id: number, accessToken: string): Promise<Thunk> {
  const res = await request.get(`${API_BASE_URL}/api/thunks/${id}`)
    .set('Authorization', `Bearer ${accessToken}`)
  return res.body as Thunk
}

// UPDATE
export async function updateThunk(id: number, updatedFields: Partial<NewThunk>, accessToken: string): Promise<void> {
  await request.put(`${API_BASE_URL}/api/thunks/${id}`)
    .set('Authorization', `Bearer ${accessToken}`)
    .send(updatedFields)
}

// DELETE
export async function deleteThunk(id: number, accessToken: string): Promise<void> {
  await request.delete(`${API_BASE_URL}/api/thunks/${id}`)
    .set('Authorization', `Bearer ${accessToken}`)
}