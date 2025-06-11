import * as Path from 'node:path'
import express from 'express'
import cors from 'cors'
import { fileURLToPath } from 'node:url'
import { getThunksByUserId, addThunk } from './db'
import 'dotenv/config'
import { auth as jwtAuth }  from 'express-oauth2-jwt-bearer'

const __filename = fileURLToPath(import.meta.url)
const __dirname = Path.dirname(__filename)

const server = express()

server.use(express.json())
server.use(cors())

// const MOCK_USER_ID = 'mock_user_ben';

// Middleware Config
const checkJwt = jwtAuth ({
  audience: process.env.AUTH0_AUDIENCE,
  issuerBaseURL: process.env.AUTH0_ISSUER_BASE_URL,
  tokenSigningAlg: 'RS256'
})

// Middleware Error Handling
server.use('/api/*', (error, req, res, next) => { //Typescript Issue
  if (error.name === 'UnauthorizedError') {
    return res.status(error.status).send({ message: error.message})
  }
  next()
})

// Apply Middleware
server.use('/api/thunks', checkJwt)

// GET: Saved Thunks for a User (server/db.ts ln16)
server.get('/api/thunks', async (req, res) => {
  try {
    const auth0Id = req.auth?.payload?.sub
    if (!auth0Id){
      return res.status(401).send('User ID not found')
    }
    const thunks = await getThunksByUserId(auth0Id);
    res.json(thunks);
  } catch (error) {
    console.error('Error fetching thunks:', error);
    res.status(500).send('Error fetching thunks');
  }
});

// POST: Save a Thunk (server/db.ts ln24)
server.post('/api/thunks', async (req, res) => {
  try {
    const auth0Id = req.auth?.payload?.sub
    if (!auth0Id){
      return res.status(401).send('User ID not found')
    }

    const { title, text } = req.body;

  if (!title || !text) {
    return res.status(400).send('Title and text are required');
  }
    const newThunk = await addThunk({ user_id: auth0Id, title, text });
    res.status(201).json({
      message: 'Thunk saved successfully',
      thunk: newThunk,
    });
  } catch (error) {
    console.error('Error saving thunk:', error);
    res.status(500).send('Error saving thunk');
  }
});


server.use(express.static(Path.join(__dirname, '../client/public')))
server.use('/assets', express.static(Path.join(__dirname, '../client/dist/assets')))

server.get('*', (req, res) => {
  res.sendFile(Path.join(__dirname, '../client/dist/index.html'))
})


export default server
