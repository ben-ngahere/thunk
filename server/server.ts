import * as Path from 'node:path'
import express from 'express'
import cors from 'cors'
import { fileURLToPath } from 'node:url'
import { getThunksByUserId, addThunk, getThunkById, updateThunk, deleteThunk } from './db'
import 'dotenv/config'
import { auth as jwtAuth }  from 'express-oauth2-jwt-bearer'

const __filename = fileURLToPath(import.meta.url)
const __dirname = Path.dirname(__filename)

const server = express()

server.use((req, res, next) => {
  res.setHeader('Cross-Origin-Opener-Policy', 'same-origin');
  res.setHeader('Cross-Origin-Embedder-Policy', 'require-corp');
  next();
});

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

// GET: A Thunk by ID (server/db.ts ln37)
server.get('/api/thunks/:id', async (req, res) => {
  try {
    const thunkId = Number(req.params.id);
    const auth0Id = req.auth?.payload?.sub;

    if (!auth0Id) {
      return res.status(401).send('User ID not found');
    }
    if (isNaN(thunkId)) {
      return res.status(400).send('Invalid ID');
    }

    const thunk = await getThunkById(thunkId, auth0Id);

    if (!thunk) {
      return res.status(404).send('Thunk not found or not owned by user');
    }

    res.json(thunk);
  } catch (error) {
    console.error('Error getting single thunk:', error);
    res.status(500).send('Error getting thunk');
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

// PATCH: A Thunk (Update) (server/db.ts ln45)
server.put('/api/thunks/:id', async (req, res) => {
  try {
    const thunkId = Number(req.params.id);
    const auth0Id = req.auth?.payload?.sub;
    const { title, text } = req.body;

    if (!auth0Id) {
      return res.status(401).send('User ID not found');
    }
    if (isNaN(thunkId)) {
      return res.status(400).send('Invalid ID');
    }
    if (!title || !text) {
      return res.status(400).send('Title and text are required for update');
    }

    const updatedRows = await updateThunk(thunkId, auth0Id, title, text);

    if (updatedRows === 0) {
      return res.status(404).send('Thunk not found or not owned by user');
    }

    res.status(200).json({ message: 'Thunk updated successfully' });
  } catch (error) {
    console.error('Error updating thunk:', error);
    res.status(500).send('Error updating thunk');
  }
});

// DELETE; A Thunk by ID (server/db.ts ln61)
server.delete('/api/thunks/:id', async (req, res) => {
  try {
    const thunkId = Number(req.params.id);
    const auth0Id = req.auth?.payload?.sub;

    if (!auth0Id) {
      return res.status(401).send('User ID not found');
    }
    if (isNaN(thunkId)) {
      return res.status(400).send('Invalid ID');
    }

    const deletedRows = await deleteThunk(thunkId, auth0Id);

    if (deletedRows === 0) {
      return res.status(404).send('Thunk not found or not owned by user');
    }

    res.status(200).json({ message: 'Thunk deleted successfully' });
  } catch (error) {
    console.error('Error deleting thunk:', error);
    res.status(500).send('Error deleting thunk');
  }
});


server.use(express.static(Path.join(__dirname, '../client/public')))
server.use('/assets', express.static(Path.join(__dirname, '../client/dist/assets')))

server.get('*', (req, res) => {
  res.sendFile(Path.join(__dirname, '../client/dist/index.html'))
})


export default server
