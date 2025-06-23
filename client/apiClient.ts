import request from 'superagent'

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || '/api/v1'

export async function getGreeting() {
  const res = await request.get(`${API_BASE_URL}/greeting`)
  return res.body.greeting as string
}

export async function getMovies() {
  const res = await request.get(`${API_BASE_URL}/movies`)
  return res.body.movies
}