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

// Get all transactions
router.get('/transactions', async (req, res) => {
  try {
    const db = getDBAsync()
    const transactions = await db.all('SELECT * FROM budget_transactions ORDER BY date DESC, created_at DESC')
    
    res.json(transactions.map(t => ({
      id: t.id,
      type: t.type,
      title: t.title,
      description: t.description,
      amount: t.amount,
      category: t.category,
      date: t.date,
      createdAt: t.created_at,
      updatedAt: t.updated_at
    })))
    
    db.close()
  } catch (error) {
    console.error('Error fetching transactions:', error)
    res.status(500).json({ error: 'Failed to fetch transactions' })
  }
})

// Create transaction
router.post('/transactions', async (req, res) => {
  try {
    const { type, title, description, amount, category, date } = req.body
    
    const id = randomUUID()
    const now = new Date().toISOString()
    
    const db = getDBAsync()
    await db.run(
      `INSERT INTO budget_transactions (id, type, title, description, amount, category, date, created_at, updated_at)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [id, type, title, description || null, amount, category || null, date, now, now]
    )
    
    const transaction = await db.get('SELECT * FROM budget_transactions WHERE id = ?', [id])
    
    res.status(201).json({
      id: transaction.id,
      type: transaction.type,
      title: transaction.title,
      description: transaction.description,
      amount: transaction.amount,
      category: transaction.category,
      date: transaction.date,
      createdAt: transaction.created_at,
      updatedAt: transaction.updated_at
    })
    
    db.close()
  } catch (error) {
    console.error('Error creating transaction:', error)
    res.status(500).json({ error: 'Failed to create transaction' })
  }
})

// Update transaction
router.put('/transactions/:id', async (req, res) => {
  try {
    const { id } = req.params
    const { title, description, amount, category, date } = req.body
    
    const db = getDBAsync()
    const now = new Date().toISOString()
    
    await db.run(
      `UPDATE budget_transactions 
       SET title = ?, description = ?, amount = ?, category = ?, date = ?, updated_at = ?
       WHERE id = ?`,
      [title, description || null, amount, category || null, date, now, id]
    )
    
    const transaction = await db.get('SELECT * FROM budget_transactions WHERE id = ?', [id])
    
    if (!transaction) {
      return res.status(404).json({ error: 'Transaction not found' })
    }
    
    res.json({
      id: transaction.id,
      type: transaction.type,
      title: transaction.title,
      description: transaction.description,
      amount: transaction.amount,
      category: transaction.category,
      date: transaction.date,
      createdAt: transaction.created_at,
      updatedAt: transaction.updated_at
    })
    
    db.close()
  } catch (error) {
    console.error('Error updating transaction:', error)
    res.status(500).json({ error: 'Failed to update transaction' })
  }
})

// Delete transaction
router.delete('/transactions/:id', async (req, res) => {
  try {
    const { id } = req.params
    const db = getDBAsync()
    
    await db.run('DELETE FROM budget_transactions WHERE id = ?', [id])
    
    res.status(204).send()
    db.close()
  } catch (error) {
    console.error('Error deleting transaction:', error)
    res.status(500).json({ error: 'Failed to delete transaction' })
  }
})

export default router

