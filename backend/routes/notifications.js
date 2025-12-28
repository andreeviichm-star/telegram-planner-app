import express from 'express'
import { getDB } from '../db.js'
import { promisify } from 'util'
import { randomUUID } from 'crypto'

const router = express.Router()

function getDBAsync() {
  const db = getDB()
  return {
    all: promisify(db.all.bind(db)),
    get: promisify(db.get.bind(db)),
    run: promisify(db.run.bind(db)),
    close: () => db.close()
  }
}

// Get notifications
router.get('/', async (req, res) => {
  try {
    const { userId } = req.query
    const db = getDBAsync()
    
    const notifications = await db.all(
      'SELECT * FROM notifications WHERE user_id = ? ORDER BY scheduled_at DESC',
      [userId || '']
    )
    
    res.json(notifications)
    db.close()
  } catch (error) {
    console.error('Error fetching notifications:', error)
    res.status(500).json({ error: 'Failed to fetch notifications' })
  }
})

// Create notification
router.post('/', async (req, res) => {
  try {
    const { userId, type, title, message, taskId, eventId, meetingId, scheduledAt } = req.body
    
    const id = randomUUID()
    const now = new Date().toISOString()
    
    const db = getDBAsync()
    await db.run(
      `INSERT INTO notifications (id, user_id, type, title, message, task_id, event_id, meeting_id, scheduled_at, created_at)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [id, userId, type, title, message || null, taskId || null, eventId || null, meetingId || null, scheduledAt, now]
    )
    
    const notification = await db.get('SELECT * FROM notifications WHERE id = ?', [id])
    
    res.status(201).json(notification)
    db.close()
  } catch (error) {
    console.error('Error creating notification:', error)
    res.status(500).json({ error: 'Failed to create notification' })
  }
})

// Mark notification as sent
router.post('/:id/sent', async (req, res) => {
  try {
    const { id } = req.params
    const db = getDBAsync()
    const now = new Date().toISOString()
    
    await db.run('UPDATE notifications SET sent_at = ? WHERE id = ?', [now, id])
    
    res.json({ success: true })
    db.close()
  } catch (error) {
    console.error('Error updating notification:', error)
    res.status(500).json({ error: 'Failed to update notification' })
  }
})

export default router

