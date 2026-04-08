import { useMemo } from 'react';
import { useAppContext } from '../context/AppContext';
import { Bar } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
} from 'chart.js';
import { FiTrendingUp, FiTrendingDown, FiAlertCircle, FiAward } from 'react-icons/fi';
import './Insights.css';
import './Charts.css';

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

function Insights() {
  const { transactions, darkMode } = useAppContext();

  const insights = useMemo(() => {
    const now = new Date();

    // highest spending category
    const categorySpending = {};
    transactions.filter(t => t.type === 'expense').forEach(t => {
      categorySpending[t.category] = (categorySpending[t.category] || 0) + t.amount;
    });
    const topCategory = Object.entries(categorySpending).sort((a, b) => b[1] - a[1])[0];

    // monthly data for comparison
    const monthlyData = {};
    for (let i = 5; i >= 0; i--) {
      const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
      const key = d.toLocaleDateString('en-US', { month: 'short' });
      monthlyData[key] = { income: 0, expense: 0 };
    }

    transactions.forEach(t => {
      const d = new Date(t.date);
      const key = d.toLocaleDateString('en-US', { month: 'short' });
      if (monthlyData[key]) {
        if (t.type === 'income') monthlyData[key].income += t.amount;
        else monthlyData[key].expense += t.amount;
      }
    });

    // average monthly expense
    const months = Object.keys(monthlyData);
    const totalExpenseAll = Object.values(monthlyData).reduce((s, v) => s + v.expense, 0);
    const avgMonthlyExpense = months.length > 0 ? totalExpenseAll / months.length : 0;

    // current month vs last month
    const currentMonthKey = now.toLocaleDateString('en-US', { month: 'short' });
    const lastMonth = new Date(now.getFullYear(), now.getMonth() - 1, 1);
    const lastMonthKey = lastMonth.toLocaleDateString('en-US', { month: 'short' });

    const currentExpense = monthlyData[currentMonthKey]?.expense || 0;
    const lastExpense = monthlyData[lastMonthKey]?.expense || 0;
    const expenseChange = lastExpense > 0 ? ((currentExpense - lastExpense) / lastExpense * 100).toFixed(1) : 0;

    // most frequent transaction
    const descCount = {};
    transactions.forEach(t => {
      descCount[t.description] = (descCount[t.description] || 0) + 1;
    });
    const mostFrequent = Object.entries(descCount).sort((a, b) => b[1] - a[1])[0];

    // biggest single transaction
    const biggestExpense = transactions
      .filter(t => t.type === 'expense')
      .sort((a, b) => b.amount - a.amount)[0];

    // savings rate per month
    const savingsPerMonth = months.map(m => {
      const inc = monthlyData[m].income;
      const exp = monthlyData[m].expense;
      return inc > 0 ? ((inc - exp) / inc * 100) : 0;
    });

    return {
      topCategory,
      avgMonthlyExpense,
      currentExpense,
      lastExpense,
      expenseChange,
      mostFrequent,
      biggestExpense,
      monthlyData,
      months,
      savingsPerMonth,
      categorySpending
    };
  }, [transactions]);

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0
    }).format(amount);
  };

  // monthly comparison bar chart
  const barChartData = {
    labels: insights.months,
    datasets: [
      {
        label: 'Income',
        data: insights.months.map(m => insights.monthlyData[m].income),
        backgroundColor: 'rgba(34, 197, 94, 0.7)',
        borderRadius: 6,
        borderSkipped: false,
      },
      {
        label: 'Expenses',
        data: insights.months.map(m => insights.monthlyData[m].expense),
        backgroundColor: 'rgba(239, 68, 68, 0.7)',
        borderRadius: 6,
        borderSkipped: false,
      }
    ]
  };

  const barOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'top',
        labels: {
          usePointStyle: true,
          pointStyle: 'circle',
          padding: 20,
          font: { size: 12, family: "'Inter', sans-serif" },
          color: darkMode ? '#94a3b8' : '#64748b'
        }
      },
      tooltip: {
        backgroundColor: darkMode ? '#1e293b' : '#fff',
        titleColor: darkMode ? '#e2e8f0' : '#1e293b',
        bodyColor: darkMode ? '#94a3b8' : '#64748b',
        borderColor: darkMode ? '#334155' : '#e2e8f0',
        borderWidth: 1,
        padding: 12,
        callbacks: {
          label: function(context) {
            return `${context.dataset.label}: ₹${context.parsed.y.toLocaleString('en-IN')}`;
          }
        }
      }
    },
    scales: {
      x: {
        grid: { display: false },
        ticks: { color: darkMode ? '#64748b' : '#94a3b8' }
      },
      y: {
        grid: { color: darkMode ? 'rgba(148, 163, 184, 0.08)' : 'rgba(0, 0, 0, 0.04)' },
        ticks: {
          color: darkMode ? '#64748b' : '#94a3b8',
          callback: (val) => '₹' + (val / 1000).toFixed(0) + 'k'
        }
      }
    }
  };

  return (
    <div className="insights-section">
      <div className="insights-header">
        <h2>Financial Insights</h2>
        <p>Key observations from your financial data</p>
      </div>

      {/* insight cards */}
      <div className="insight-cards">
        <div className="insight-card highlight">
          <div className="insight-icon red">
            <FiTrendingDown />
          </div>
          <div className="insight-body">
            <h4>Highest Spending</h4>
            <p className="insight-value">{insights.topCategory ? insights.topCategory[0] : 'N/A'}</p>
            <p className="insight-detail">
              {insights.topCategory ? formatCurrency(insights.topCategory[1]) : '₹0'} total spent
            </p>
          </div>
        </div>

        <div className="insight-card">
          <div className="insight-icon blue">
            <FiAlertCircle />
          </div>
          <div className="insight-body">
            <h4>Monthly Avg Expense</h4>
            <p className="insight-value">{formatCurrency(insights.avgMonthlyExpense)}</p>
            <p className="insight-detail">across 6 months of data</p>
          </div>
        </div>

        <div className="insight-card">
          <div className={`insight-icon ${Number(insights.expenseChange) > 0 ? 'red' : 'green'}`}>
            {Number(insights.expenseChange) > 0 ? <FiTrendingUp /> : <FiTrendingDown />}
          </div>
          <div className="insight-body">
            <h4>Month over Month</h4>
            <p className="insight-value">
              {Number(insights.expenseChange) > 0 ? '+' : ''}{insights.expenseChange}%
            </p>
            <p className="insight-detail">
              expense change vs last month
            </p>
          </div>
        </div>

        <div className="insight-card">
          <div className="insight-icon purple">
            <FiAward />
          </div>
          <div className="insight-body">
            <h4>Most Frequent</h4>
            <p className="insight-value">{insights.mostFrequent ? insights.mostFrequent[0] : 'N/A'}</p>
            <p className="insight-detail">
              {insights.mostFrequent ? `${insights.mostFrequent[1]} transactions` : '0 transactions'}
            </p>
          </div>
        </div>
      </div>

      {/* monthly comparison chart */}
      <div className="insight-chart-section">
        <div className="chart-container">
          <h3 className="chart-title">Monthly Comparison</h3>
          <p className="chart-subtitle">Income vs Expenses breakdown by month</p>
          <div className="chart-wrapper">
            <Bar data={barChartData} options={barOptions} />
          </div>
        </div>

        {/* spending breakdown list */}
        <div className="spending-list-card">
          <h3>Spending by Category</h3>
          <div className="spending-list">
            {Object.entries(insights.categorySpending)
              .sort((a, b) => b[1] - a[1])
              .map(([cat, amount]) => {
                const total = Object.values(insights.categorySpending).reduce((s, v) => s + v, 0);
                const pct = total > 0 ? (amount / total * 100) : 0;
                return (
                  <div key={cat} className="spending-item">
                    <div className="spending-info">
                      <span className="spending-name">{cat}</span>
                      <span className="spending-amount">{formatCurrency(amount)}</span>
                    </div>
                    <div className="spending-bar-track">
                      <div
                        className="spending-bar-fill"
                        style={{ width: `${pct}%` }}
                      ></div>
                    </div>
                    <span className="spending-pct">{pct.toFixed(1)}%</span>
                  </div>
                );
              })}
          </div>
        </div>
      </div>

      {/* additional insights */}
      {insights.biggestExpense && (
        <div className="extra-insight">
          <span className="extra-label">💡 Biggest single expense:</span>
          <span className="extra-value">
            {insights.biggestExpense.description} — {formatCurrency(insights.biggestExpense.amount)}
            {' '}on {new Date(insights.biggestExpense.date).toLocaleDateString('en-IN', { day: 'numeric', month: 'short' })}
          </span>
        </div>
      )}
    </div>
  );
}

export default Insights;
