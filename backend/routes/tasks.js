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

// Get all tasks
router.get('/', async (req, res) => {
  try {
    const { priority, status } = req.query
    const db = getDBAsync()
    
    let query = 'SELECT * FROM tasks WHERE 1=1'
    const params = []
    
    if (priority) {
      query += ' AND priority = ?'
      params.push(priority)
    }
    
    if (status) {
      query += ' AND status = ?'
      params.push(status)
    }
    
    query += ' ORDER BY created_at DESC'
    
    const tasks = await db.all(query, params)
    
    // Parse documents JSON
    const parsedTasks = tasks.map(task => ({
      ...task,
      documents: task.documents ? JSON.parse(task.documents) : null,
      estimatedTime: task.estimated_time,
      delegatedTo: task.delegated_to,
      dueDate: task.due_date,
      createdAt: task.created_at,
      updatedAt: task.updated_at
    }))
    
    res.json(parsedTasks)
    db.close()
  } catch (error) {
    console.error('Error fetching tasks:', error)
    res.status(500).json({ error: 'Failed to fetch tasks' })
  }
})

// Create task
router.post('/', async (req, res) => {
  try {
    const {
      title,
      description,
      priority,
      status,
      estimatedTime,
      delegatedTo,
      dueDate,
      documents
    } = req.body
    
    const id = randomUUID()
    const now = new Date().toISOString()
    
    const db = getDBAsync()
    await db.run(
      `INSERT INTO tasks (id, title, description, priority, status, estimated_time, delegated_to, due_date, documents, created_at, updated_at)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        id,
        title,
        description || null,
        priority || 'medium',
        status || 'pending',
        estimatedTime || null,
        delegatedTo || null,
        dueDate || null,
        documents ? JSON.stringify(documents) : null,
        now,
        now
      ]
    )
    
    const task = await db.get('SELECT * FROM tasks WHERE id = ?', [id])
    
    res.status(201).json({
      ...task,
      documents: task.documents ? JSON.parse(task.documents) : null,
      estimatedTime: task.estimated_time,
      delegatedTo: task.delegated_to,
      dueDate: task.due_date,
      createdAt: task.created_at,
      updatedAt: task.updated_at
    })
    
    db.close()
  } catch (error) {
    console.error('Error creating task:', error)
    res.status(500).json({ error: 'Failed to create task' })
  }
})

// Update task
router.put('/:id', async (req, res) => {
  try {
    const { id } = req.params
    const {
      title,
      description,
      priority,
      status,
      estimatedTime,
      delegatedTo,
      dueDate,
      documents
    } = req.body
    
    const db = getDBAsync()
    const now = new Date().toISOString()
    
    await db.run(
      `UPDATE tasks 
       SET title = ?, description = ?, priority = ?, status = ?, estimated_time = ?, 
           delegated_to = ?, due_date = ?, documents = ?, updated_at = ?
       WHERE id = ?`,
      [
        title,
        description || null,
        priority,
        status,
        estimatedTime || null,
        delegatedTo || null,
        dueDate || null,
        documents ? JSON.stringify(documents) : null,
        now,
        id
      ]
    )
    
    const task = await db.get('SELECT * FROM tasks WHERE id = ?', [id])
    
    if (!task) {
      return res.status(404).json({ error: 'Task not found' })
    }
    
    res.json({
      ...task,
      documents: task.documents ? JSON.parse(task.documents) : null,
      estimatedTime: task.estimated_time,
      delegatedTo: task.delegated_to,
      dueDate: task.due_date,
      createdAt: task.created_at,
      updatedAt: task.updated_at
    })
    
    db.close()
  } catch (error) {
    console.error('Error updating task:', error)
    res.status(500).json({ error: 'Failed to update task' })
  }
})

// Delete task
router.delete('/:id', async (req, res) => {
  try {
    const { id } = req.params
    const db = getDBAsync()
    
    await db.run('DELETE FROM tasks WHERE id = ?', [id])
    
    res.status(204).send()
    db.close()
  } catch (error) {
    console.error('Error deleting task:', error)
    res.status(500).json({ error: 'Failed to delete task' })
  }
})

export default router

