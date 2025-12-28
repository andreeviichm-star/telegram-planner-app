import 'dotenv/config'
import express from 'express'
import cors from 'cors'
import { fileURLToPath } from 'url'
import { dirname } from 'path'
import { initDB } from './db.js'
import tasksRoutes from './routes/tasks.js'
import calendarRoutes from './routes/calendar.js'
import notificationsRoutes from './routes/notifications.js'

const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)

const app = express()
const PORT = process.env.PORT || 3001

// Middleware
app.use(cors())
app.use(express.json())

// Initialize database
await initDB()

// Routes
app.use('/api/tasks', tasksRoutes)
app.use('/api/calendar', calendarRoutes)
app.use('/api/notifications', notificationsRoutes)

// Health check
app.get('/health', (req, res) => {
  res.json({ status: 'ok' })
})

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})

