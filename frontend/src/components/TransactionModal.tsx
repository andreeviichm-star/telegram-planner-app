import { useState, useEffect } from 'react'
import { Calendar, DollarSign } from 'lucide-react'
import { BudgetTransaction, TransactionType } from '../types'
import './TransactionModal.css'

interface TransactionModalProps {
  transaction: BudgetTransaction | null
  type: TransactionType
  onClose: () => void
  onSave: (transactionData: Partial<BudgetTransaction>) => void
}

const categories = [
  'Продукты',
  'Транспорт',
  'Развлечения',
  'Здоровье',
  'Образование',
  'Работа',
  'Подарки',
  'Другое'
]

export default function TransactionModal({ transaction, type, onSave, onClose }: TransactionModalProps) {
  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')
  const [amount, setAmount] = useState('')
  const [category, setCategory] = useState('')
  const [date, setDate] = useState('')

  useEffect(() => {
    if (transaction) {
      setTitle(transaction.title)
      setDescription(transaction.description || '')
      setAmount(transaction.amount.toString())
      setCategory(transaction.category || '')
      setDate(transaction.date.split('T')[0])
    } else {
      setDate(new Date().toISOString().split('T')[0])
    }
  }, [transaction])

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    onSave({
      title,
      description: description || undefined,
      amount: parseFloat(amount),
      category: category || undefined,
      date: new Date(date).toISOString()
    })
  }

  const typeLabels = {
    income: 'Доход',
    expense: 'Расход',
    fundraising: 'Сбор средств'
  }

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content glass slide-up" onClick={e => e.stopPropagation()}>
        <div className="modal-header">
          <h2>{transaction ? 'Редактировать транзакцию' : `Новый ${typeLabels[type]}`}</h2>
          <button className="close-btn" onClick={onClose}>
            ✕
          </button>
        </div>

        <form onSubmit={handleSubmit} className="transaction-form">
          <div className="form-group">
            <label>Название *</label>
            <input
              type="text"
              value={title}
              onChange={e => setTitle(e.target.value)}
              required
              className="form-input"
            />
          </div>

          <div className="form-group">
            <label>Описание</label>
            <textarea
              value={description}
              onChange={e => setDescription(e.target.value)}
              rows={3}
              className="form-input"
            />
          </div>

          <div className="form-row">
            <div className="form-group">
              <label>
                <DollarSign size={14} /> Сумма (₽) *
              </label>
              <input
                type="number"
                value={amount}
                onChange={e => setAmount(e.target.value)}
                min="0"
                step="0.01"
                required
                className="form-input"
              />
            </div>

            <div className="form-group">
              <label>
                <Calendar size={14} /> Дата
              </label>
              <input
                type="date"
                value={date}
                onChange={e => setDate(e.target.value)}
                required
                className="form-input"
              />
            </div>
          </div>

          <div className="form-group">
            <label>Категория</label>
            <select
              value={category}
              onChange={e => setCategory(e.target.value)}
              className="form-input"
            >
              <option value="">Выберите категорию</option>
              {categories.map(cat => (
                <option key={cat} value={cat}>
                  {cat}
                </option>
              ))}
            </select>
          </div>

          <div className="modal-actions">
            <button type="button" className="btn-secondary" onClick={onClose}>
              Отмена
            </button>
            <button type="submit" className="btn-primary">
              Сохранить
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

