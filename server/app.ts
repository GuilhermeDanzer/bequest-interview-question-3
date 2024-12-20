import express from 'express'
import cors from 'cors'
import crypto from 'crypto'
import fs from 'fs'

const SECRET_KEY = 'Bequest_secret_key'
const BACKUP_FILE = './backup.json'
const PORT = 8080
const app = express()
const database = { data: 'Hello World', hash: '' }

app.use(cors())
app.use(express.json())
const createHash = (data: string) =>
  crypto.createHmac('sha256', SECRET_KEY).update(data).digest('hex')

const saveBackup = () => {
  fs.writeFileSync(BACKUP_FILE, JSON.stringify(database), 'utf8')
}

const loadBackup = () => {
  if (fs.existsSync(BACKUP_FILE)) {
    return JSON.parse(fs.readFileSync(BACKUP_FILE, 'utf8'))
  }
  return null
}

database.hash = createHash(database.data)
saveBackup()

// Routes
app.get('/', (req, res) => {
  const expectedHash = createHash(database.data)

  if (expectedHash !== database.hash) {
    return res.status(400).json({ error: 'Data integrity check failed' })
  }

  res.json({ data: database.data })
})

app.post('/', (req, res) => {
  const newData = req.body.data
  if (!newData) return res.status(400).send('No data provided')

  database.data = newData
  database.hash = createHash(newData)

  saveBackup()

  res.sendStatus(200)
})

app.post('/recover', (req, res) => {
  const backup = loadBackup()

  if (!backup) {
    return res.status(404).json({ error: 'No backup available' })
  }

  database.data = backup.data
  database.hash = createHash(backup.data)

  res.status(200).json({ message: 'Data restored', data: database.data })
})
app.post('/corrupt', (req, res) => {
  database.data = 'Corrupted Data'
  res.status(200).json({ message: 'Data corrupted successfully' })
})
app.listen(PORT, () => {
  console.log('Server running on port ' + PORT)
})
