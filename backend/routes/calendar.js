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

// Get calendar events
router.get('/events', async (req, res) => {
  try {
    const { start, end } = req.query
    const db = getDBAsync()
    
    const events = await db.all(
      'SELECT * FROM calendar_events WHERE date >= ? AND date <= ? ORDER BY date ASC',
      [start, end]
    )
    
    res.json(events.map(event => ({
      id: event.id,
      date: event.date,
      type: event.type,
      notes: event.notes,
      createdAt: event.created_at,
      updatedAt: event.updated_at
    })))
    
    db.close()
  } catch (error) {
    console.error('Error fetching calendar events:', error)
    res.status(500).json({ error: 'Failed to fetch calendar events' })
  }
})

// Create calendar event
router.post('/events', async (req, res) => {
  try {
    const { date, type, notes } = req.body
    
    const id = randomUUID()
    const now = new Date().toISOString()
    
    const db = getDBAsync()
    await db.run(
      `INSERT INTO calendar_events (id, date, type, notes, created_at, updated_at)
       VALUES (?, ?, ?, ?, ?, ?)`,
      [id, date, type, notes || null, now, now]
    )
    
    const event = await db.get('SELECT * FROM calendar_events WHERE id = ?', [id])
    
    res.status(201).json({
      id: event.id,
      date: event.date,
      type: event.type,
      notes: event.notes,
      createdAt: event.created_at,
      updatedAt: event.updated_at
    })
    
    db.close()
  } catch (error) {
    console.error('Error creating calendar event:', error)
    res.status(500).json({ error: 'Failed to create calendar event' })
  }
})

// Update calendar event
router.post('/events/:id', async (req, res) => {
  try {
    const { id } = req.params
    const { type, notes } = req.body
    
    const db = getDBAsync()
    const now = new Date().toISOString()
    
    await db.run(
      'UPDATE calendar_events SET type = ?, notes = ?, updated_at = ? WHERE id = ?',
      [type, notes || null, now, id]
    )
    
    const event = await db.get('SELECT * FROM calendar_events WHERE id = ?', [id])
    
    if (!event) {
      return res.status(404).json({ error: 'Event not found' })
    }
    
    res.json({
      id: event.id,
      date: event.date,
      type: event.type,
      notes: event.notes,
      createdAt: event.created_at,
      updatedAt: event.updated_at
    })
    
    db.close()
  } catch (error) {
    console.error('Error updating calendar event:', error)
    res.status(500).json({ error: 'Failed to update calendar event' })
  }
})

// Delete calendar event
router.delete('/events/:id', async (req, res) => {
  try {
    const { id } = req.params
    const db = getDBAsync()
    
    await db.run('DELETE FROM calendar_events WHERE id = ?', [id])
    
    res.status(204).send()
    db.close()
  } catch (error) {
    console.error('Error deleting calendar event:', error)
    res.status(500).json({ error: 'Failed to delete calendar event' })
  }
})

export default router

