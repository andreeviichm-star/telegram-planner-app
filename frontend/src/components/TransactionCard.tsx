import { Edit, Trash2, TrendingUp, TrendingDown, Target } from 'lucide-react'
import { BudgetTransaction } from '../types'
import { format } from 'date-fns'
import { ru } from 'date-fns/locale'
import './TransactionCard.css'

interface TransactionCardProps {
  transaction: BudgetTransaction
  onEdit: (transaction: BudgetTransaction) => void
  onDelete: (id: string) => void
}

const typeIcons = {
  income: TrendingUp,
  expense: TrendingDown,
  fundraising: Target
}

const typeLabels = {
  income: 'Доход',
  expense: 'Расход',
  fundraising: 'Сбор средств'
}

const typeColors = {
  income: '#22c55e',
  expense: '#ef4444',
  fundraising: '#fbbf24'
}

export default function TransactionCard({ transaction, onEdit, onDelete }: TransactionCardProps) {
  const Icon = typeIcons[transaction.type]
  const color = typeColors[transaction.type]

  return (
    <div className="transaction-card glass fade-in">
      <div className="transaction-header">
        <div className="transaction-title-row">
          <div className="transaction-icon" style={{ backgroundColor: `${color}20`, color }}>
            <Icon size={18} />
          </div>
          <div className="transaction-info">
            <h3 className="transaction-title">{transaction.title}</h3>
            {transaction.category && (
              <span className="transaction-category">{transaction.category}</span>
            )}
          </div>
        </div>
        <div className="transaction-actions">
          <button className="icon-btn" onClick={() => onEdit(transaction)}>
            <Edit size={16} />
          </button>
          <button className="icon-btn" onClick={() => onDelete(transaction.id)}>
            <Trash2 size={16} />
          </button>
        </div>
      </div>

      {transaction.description && (
        <p className="transaction-description">{transaction.description}</p>
      )}

      <div className="transaction-meta">
        <div className="transaction-amount" style={{ color }}>
          {transaction.type === 'expense' ? '-' : '+'}
          {transaction.amount.toLocaleString()} ₽
        </div>
        <div className="transaction-date">
          {format(new Date(transaction.date), 'd MMM yyyy', { locale: ru })}
        </div>
      </div>
    </div>
  )
}

