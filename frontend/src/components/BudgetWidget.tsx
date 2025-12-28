import { useState, useEffect, useCallback } from 'react'
import { TrendingUp, TrendingDown, Wallet } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import { getTransactions } from '../services/api'
import { BudgetTransaction } from '../types'
import './BudgetWidget.css'

export default function BudgetWidget() {
  const navigate = useNavigate()
  const [transactions, setTransactions] = useState<BudgetTransaction[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    loadTransactions()
  }, [loadTransactions])

  const loadTransactions = useCallback(async () => {
    try {
      const data = await getTransactions()
      setTransactions(data || [])
    } catch (error) {
      if (import.meta.env.DEV) {
        console.error('Failed to load transactions:', error)
      }
      setTransactions([])
    } finally {
      setLoading(false)
    }
  }, [])

  if (loading) {
    return (
      <div className="budget-widget glass">
        <div className="budget-widget-header">
          <Wallet size={20} />
          <span>Бюджет</span>
        </div>
        <div className="budget-widget-loading">Загрузка...</div>
      </div>
    )
  }

  const income = transactions
    .filter(t => t.type === 'income')
    .reduce((sum, t) => sum + t.amount, 0)

  const expenses = transactions
    .filter(t => t.type === 'expense')
    .reduce((sum, t) => sum + t.amount, 0)

  const balance = income - expenses

  return (
    <div className="budget-widget glass" onClick={() => navigate('/budget')}>
      <div className="budget-widget-header">
        <Wallet size={20} />
        <span>Бюджет</span>
      </div>
      <div className="budget-widget-content">
        <div className="budget-widget-row">
          <div className="budget-widget-item">
            <TrendingUp size={16} className="income-icon" />
            <div className="budget-widget-info">
              <div className="budget-widget-label">Доходы</div>
              <div className="budget-widget-value income">{income.toLocaleString()} ₽</div>
            </div>
          </div>
          <div className="budget-widget-item">
            <TrendingDown size={16} className="expense-icon" />
            <div className="budget-widget-info">
              <div className="budget-widget-label">Расходы</div>
              <div className="budget-widget-value expense">{expenses.toLocaleString()} ₽</div>
            </div>
          </div>
        </div>
        <div className="budget-widget-balance">
          <span className="budget-widget-balance-label">Баланс:</span>
          <span className={`budget-widget-balance-value ${balance >= 0 ? 'positive' : 'negative'}`}>
            {balance >= 0 ? '+' : ''}{balance.toLocaleString()} ₽
          </span>
        </div>
      </div>
    </div>
  )
}

