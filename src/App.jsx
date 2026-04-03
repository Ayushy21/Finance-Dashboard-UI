import { useState } from 'react';
import { useAppContext } from './context/AppContext';
import Navbar from './components/Navbar';
import SummaryCards from './components/SummaryCards';
import BalanceChart from './components/BalanceChart';
import SpendingChart from './components/SpendingChart';
import TransactionList from './components/TransactionList';
import Insights from './components/Insights';

function App() {
  const [activeTab, setActiveTab] = useState('dashboard');
  const { transactions } = useAppContext();

  // format currency helper
  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0
    }).format(amount);
  };

  // recent transactions for dashboard view (last 5)
  const recentTransactions = [...transactions]
    .sort((a, b) => new Date(b.date) - new Date(a.date))
    .slice(0, 5);

  return (
    <div className="app-container">
      <Navbar activeTab={activeTab} setActiveTab={setActiveTab} />

      <main className="main-content">
        {/* Dashboard Tab */}
        {activeTab === 'dashboard' && (
          <div className="page-enter">
            <SummaryCards />

            <div className="charts-grid">
              <BalanceChart />
              <SpendingChart />
            </div>

            {/* Recent Transactions */}
            <div className="recent-transactions">
              <div className="recent-header">
                <h3>Recent Transactions</h3>
                <button onClick={() => setActiveTab('transactions')}>
                  View All →
                </button>
              </div>
              {recentTransactions.length > 0 ? (
                <div className="recent-list">
                  {recentTransactions.map(t => (
                    <div key={t.id} className="recent-item">
                      <div className="recent-left">
                        <span className="recent-desc">{t.description}</span>
                        <span className="recent-meta">
                          {new Date(t.date).toLocaleDateString('en-IN', { day: 'numeric', month: 'short' })} · {t.category}
                        </span>
                      </div>
                      <span className={`recent-amount ${t.type}`}>
                        {t.type === 'income' ? '+' : '-'}{formatCurrency(t.amount)}
                      </span>
                    </div>
                  ))}
                </div>
              ) : (
                <p style={{ color: 'var(--text-secondary)', textAlign: 'center', padding: '2rem' }}>
                  No transactions yet. Add one to get started!
                </p>
              )}
            </div>
          </div>
        )}

        {/* Transactions Tab */}
        {activeTab === 'transactions' && (
          <div className="page-enter">
            <TransactionList />
          </div>
        )}

        {/* Insights Tab */}
        {activeTab === 'insights' && (
          <div className="page-enter">
            <Insights />
          </div>
        )}
      </main>

      <footer className="app-footer">
        <p>FinTrack Dashboard — Built for learning purposes</p>
      </footer>
    </div>
  );
}

export default App;
