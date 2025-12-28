import { useState, useEffect } from 'react'
import { useLocation } from 'react-router-dom'
import { Plus, Menu, TrendingUp, TrendingDown, Target } from 'lucide-react'
import TransactionCard from '../components/TransactionCard'
import TransactionModal from '../components/TransactionModal'
import MenuModal from '../components/MenuModal'
import { BudgetTransaction, TransactionType } from '../types'
import { getTransactions, createTransaction, updateTransaction, deleteTransaction } from '../services/api'
import './BudgetPage.css'

export default function BudgetPage() {
  const location = useLocation()
  const [transactions, setTransactions] = useState<BudgetTransaction[]>([])
  const [isTransactionModalOpen, setIsTransactionModalOpen] = useState(false)
  const [isMenuModalOpen, setIsMenuModalOpen] = useState(false)
  const [selectedTransaction, setSelectedTransaction] = useState<BudgetTransaction | null>(null)
  const [transactionType, setTransactionType] = useState<TransactionType>('income')

  useEffect(() => {
    loadTransactions()
  }, [])

  const loadTransactions = async () => {
    try {
      const data = await getTransactions()
      setTransactions(data || [])
    } catch (error) {
      console.error('Ошибка загрузки транзакций:', error)
      setTransactions([])
    }
  }

  const handleCreateTransaction = (type: TransactionType) => {
    setTransactionType(type)
    setSelectedTransaction(null)
    setIsTransactionModalOpen(true)
  }

  const handleEditTransaction = (transaction: BudgetTransaction) => {
    setSelectedTransaction(transaction)
    setTransactionType(transaction.type)
    setIsTransactionModalOpen(true)
  }

  const handleSaveTransaction = async (transactionData: Partial<BudgetTransaction>) => {
    try {
      if (selectedTransaction) {
        await updateTransaction(selectedTransaction.id, transactionData)
      } else {
        await createTransaction({ ...transactionData, type: transactionType } as BudgetTransaction)
      }
      setIsTransactionModalOpen(false)
      setSelectedTransaction(null)
      loadTransactions()
    } catch (error) {
      console.error('Ошибка сохранения транзакции:', error)
    }
  }

  const handleDeleteTransaction = async (id: string) => {
    try {
      await deleteTransaction(id)
      loadTransactions()
    } catch (error) {
      console.error('Ошибка удаления транзакции:', error)
    }
  }

  const income = transactions
    .filter(t => t.type === 'income')
    .reduce((sum, t) => sum + t.amount, 0)

  const expenses = transactions
    .filter(t => t.type === 'expense')
    .reduce((sum, t) => sum + t.amount, 0)

  const fundraising = transactions
    .filter(t => t.type === 'fundraising')
    .reduce((sum, t) => sum + t.amount, 0)

  const balance = income - expenses

  const recentTransactions = transactions
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
    .slice(0, 10)

  return (
    <div className="budget-page">
      <div className="page-header">
        <button
          className="menu-btn glass-light"
          onClick={() => setIsMenuModalOpen(true)}
        >
          <Menu size={24} />
        </button>
        <h1 className="page-title">Бюджет</h1>
        <div style={{ width: '40px' }}></div>
      </div>

      <div className="budget-stats-grid">
        <div className="budget-stat-card glass">
          <div className="budget-stat-icon income">
            <TrendingUp size={24} />
          </div>
          <div className="budget-stat-content">
            <div className="budget-stat-label">Доходы</div>
            <div className="budget-stat-value income">{income.toLocaleString()} ₽</div>
          </div>
        </div>

        <div className="budget-stat-card glass">
          <div className="budget-stat-icon expense">
            <TrendingDown size={24} />
          </div>
          <div className="budget-stat-content">
            <div className="budget-stat-label">Расходы</div>
            <div className="budget-stat-value expense">{expenses.toLocaleString()} ₽</div>
          </div>
        </div>

        <div className="budget-stat-card glass">
          <div className="budget-stat-icon balance">
            <Target size={24} />
          </div>
          <div className="budget-stat-content">
            <div className="budget-stat-label">Баланс</div>
            <div className={`budget-stat-value ${balance >= 0 ? 'income' : 'expense'}`}>
              {balance.toLocaleString()} ₽
            </div>
          </div>
        </div>

        {fundraising > 0 && (
          <div className="budget-stat-card glass">
            <div className="budget-stat-icon fundraising">
              <Target size={24} />
            </div>
            <div className="budget-stat-content">
              <div className="budget-stat-label">Сбор средств</div>
              <div className="budget-stat-value fundraising">{fundraising.toLocaleString()} ₽</div>
            </div>
          </div>
        )}
      </div>

      <div className="transaction-actions glass">
        <button
          className="transaction-btn income-btn"
          onClick={() => handleCreateTransaction('income')}
        >
          <TrendingUp size={20} />
          <span>Доход</span>
        </button>
        <button
          className="transaction-btn expense-btn"
          onClick={() => handleCreateTransaction('expense')}
        >
          <TrendingDown size={20} />
          <span>Расход</span>
        </button>
        <button
          className="transaction-btn fundraising-btn"
          onClick={() => handleCreateTransaction('fundraising')}
        >
          <Target size={20} />
          <span>Сбор средств</span>
        </button>
      </div>

      <div className="transactions-list">
        <h3 className="section-title">Последние транзакции</h3>
        {recentTransactions.map(transaction => (
          <TransactionCard
            key={transaction.id}
            transaction={transaction}
            onEdit={handleEditTransaction}
            onDelete={handleDeleteTransaction}
          />
        ))}
        {recentTransactions.length === 0 && (
          <div className="empty-state glass">
            <p>Нет транзакций</p>
            <p className="empty-hint">Добавьте доход или расход</p>
          </div>
        )}
      </div>

      {isTransactionModalOpen && (
        <TransactionModal
          transaction={selectedTransaction}
          type={transactionType}
          onClose={() => {
            setIsTransactionModalOpen(false)
            setSelectedTransaction(null)
          }}
          onSave={handleSaveTransaction}
        />
      )}

      {isMenuModalOpen && (
        <MenuModal
          isOpen={isMenuModalOpen}
          onClose={() => setIsMenuModalOpen(false)}
          currentPath={location.pathname}
        />
      )}
    </div>
  )
}

