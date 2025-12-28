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

// Get all meetings
router.get('/', async (req, res) => {
  try {
    const db = getDBAsync()
    const meetings = await db.all('SELECT * FROM meetings ORDER BY date ASC')
    
    const parsedMeetings = meetings.map(meeting => ({
      id: meeting.id,
      title: meeting.title,
      description: meeting.description,
      date: meeting.date,
      duration: meeting.duration,
      platform: meeting.platform,
      link: meeting.link,
      participants: meeting.participants ? JSON.parse(meeting.participants) : null,
      reminder24h: meeting.reminder_24h === 1,
      createdAt: meeting.created_at,
      updatedAt: meeting.updated_at
    }))
    
    res.json(parsedMeetings)
    db.close()
  } catch (error) {
    console.error('Error fetching meetings:', error)
    res.status(500).json({ error: 'Failed to fetch meetings' })
  }
})

// Create meeting
router.post('/', async (req, res) => {
  try {
    const { title, description, date, duration, platform, link, participants, reminder24h } = req.body
    
    const id = randomUUID()
    const now = new Date().toISOString()
    
    const db = getDBAsync()
    await db.run(
      `INSERT INTO meetings (id, title, description, date, duration, platform, link, participants, reminder_24h, created_at, updated_at)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        id,
        title,
        description || null,
        date,
        duration,
        platform,
        link || null,
        participants ? JSON.stringify(participants) : null,
        reminder24h ? 1 : 0,
        now,
        now
      ]
    )
    
    const meeting = await db.get('SELECT * FROM meetings WHERE id = ?', [id])
    
    res.status(201).json({
      id: meeting.id,
      title: meeting.title,
      description: meeting.description,
      date: meeting.date,
      duration: meeting.duration,
      platform: meeting.platform,
      link: meeting.link,
      participants: meeting.participants ? JSON.parse(meeting.participants) : null,
      reminder24h: meeting.reminder_24h === 1,
      createdAt: meeting.created_at,
      updatedAt: meeting.updated_at
    })
    
    db.close()
  } catch (error) {
    console.error('Error creating meeting:', error)
    res.status(500).json({ error: 'Failed to create meeting' })
  }
})

// Update meeting
router.put('/:id', async (req, res) => {
  try {
    const { id } = req.params
    const { title, description, date, duration, platform, link, participants, reminder24h } = req.body
    
    const db = getDBAsync()
    const now = new Date().toISOString()
    
    await db.run(
      `UPDATE meetings 
       SET title = ?, description = ?, date = ?, duration = ?, platform = ?, 
           link = ?, participants = ?, reminder_24h = ?, updated_at = ?
       WHERE id = ?`,
      [
        title,
        description || null,
        date,
        duration,
        platform,
        link || null,
        participants ? JSON.stringify(participants) : null,
        reminder24h ? 1 : 0,
        now,
        id
      ]
    )
    
    const meeting = await db.get('SELECT * FROM meetings WHERE id = ?', [id])
    
    if (!meeting) {
      return res.status(404).json({ error: 'Meeting not found' })
    }
    
    res.json({
      id: meeting.id,
      title: meeting.title,
      description: meeting.description,
      date: meeting.date,
      duration: meeting.duration,
      platform: meeting.platform,
      link: meeting.link,
      participants: meeting.participants ? JSON.parse(meeting.participants) : null,
      reminder24h: meeting.reminder_24h === 1,
      createdAt: meeting.created_at,
      updatedAt: meeting.updated_at
    })
    
    db.close()
  } catch (error) {
    console.error('Error updating meeting:', error)
    res.status(500).json({ error: 'Failed to update meeting' })
  }
})

// Delete meeting
router.delete('/:id', async (req, res) => {
  try {
    const { id } = req.params
    const db = getDBAsync()
    
    await db.run('DELETE FROM meetings WHERE id = ?', [id])
    
    res.status(204).send()
    db.close()
  } catch (error) {
    console.error('Error deleting meeting:', error)
    res.status(500).json({ error: 'Failed to delete meeting' })
  }
})

export default router

