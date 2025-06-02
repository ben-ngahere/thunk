import * as Path from 'node:path'
import express from 'express'
import cors from 'cors'
import { fileURLToPath } from 'node:url'

const __filename = fileURLToPath(import.meta.url)
const __dirname = Path.dirname(__filename)

const server = express()

server.use(express.json())
server.use(cors())

server.use(express.static(Path.join(__dirname, '../client/public')))
server.use('/assets', express.static(Path.join(__dirname, '../client/dist/assets')))

server.get('*', (req, res) => {
  res.sendFile(Path.join(__dirname, '../client/dist/index.html'))
})


export default server
