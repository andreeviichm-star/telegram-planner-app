import sqlite3 from 'sqlite3'
import { promisify } from 'util'
import { fileURLToPath } from 'url'
import { dirname, join } from 'path'

const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)

const dbPath = join(__dirname, 'database.sqlite')

export function getDB() {
  return new sqlite3.Database(dbPath)
}

export async function initDB() {
  const db = getDB()
  const run = promisify(db.run.bind(db))

  // Tasks table
  await run(`
    CREATE TABLE IF NOT EXISTS tasks (
      id TEXT PRIMARY KEY,
      title TEXT NOT NULL,
      description TEXT,
      priority TEXT NOT NULL,
      status TEXT NOT NULL,
      estimated_time INTEGER,
      delegated_to TEXT,
      due_date TEXT,
      documents TEXT,
      user_id TEXT,
      created_at TEXT NOT NULL,
      updated_at TEXT NOT NULL
    )
  `)

  // Calendar events table
  await run(`
    CREATE TABLE IF NOT EXISTS calendar_events (
      id TEXT PRIMARY KEY,
      date TEXT NOT NULL,
      type TEXT NOT NULL,
      notes TEXT,
      user_id TEXT,
      created_at TEXT NOT NULL,
      updated_at TEXT NOT NULL
    )
  `)

  // Notifications table
  await run(`
    CREATE TABLE IF NOT EXISTS notifications (
      id TEXT PRIMARY KEY,
      user_id TEXT NOT NULL,
      type TEXT NOT NULL,
      title TEXT NOT NULL,
      message TEXT,
      task_id TEXT,
      event_id TEXT,
      scheduled_at TEXT NOT NULL,
      sent_at TEXT,
      created_at TEXT NOT NULL
    )
  `)

  db.close()
  console.log('Database initialized')
}

