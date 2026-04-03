import { useMemo } from 'react';
import { useAppContext } from '../context/AppContext';
import { Line } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler
} from 'chart.js';
import './Charts.css';

// register chart.js components
ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend, Filler);

function BalanceChart() {
  const { transactions, darkMode } = useAppContext();

  const chartData = useMemo(() => {
    // group by month
    const monthlyData = {};
    const now = new Date();

    // init last 6 months
    for (let i = 5; i >= 0; i--) {
      const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
      const key = d.toLocaleDateString('en-US', { month: 'short', year: 'numeric' });
      monthlyData[key] = { income: 0, expense: 0 };
    }

    transactions.forEach(t => {
      const d = new Date(t.date);
      const key = d.toLocaleDateString('en-US', { month: 'short', year: 'numeric' });
      if (monthlyData[key]) {
        if (t.type === 'income') {
          monthlyData[key].income += t.amount;
        } else {
          monthlyData[key].expense += t.amount;
        }
      }
    });

    const labels = Object.keys(monthlyData);
    const incomeData = labels.map(l => monthlyData[l].income);
    const expenseData = labels.map(l => monthlyData[l].expense);

    // cumulative balance
    let runningBalance = 0;
    const balanceData = labels.map(l => {
      runningBalance += monthlyData[l].income - monthlyData[l].expense;
      return runningBalance;
    });

    return {
      labels,
      datasets: [
        {
          label: 'Balance',
          data: balanceData,
          borderColor: '#3b82f6',
          backgroundColor: 'rgba(59, 130, 246, 0.08)',
          fill: true,
          tension: 0.4,
          pointRadius: 4,
          pointHoverRadius: 6,
          borderWidth: 2.5,
        },
        {
          label: 'Income',
          data: incomeData,
          borderColor: '#22c55e',
          backgroundColor: 'transparent',
          tension: 0.4,
          pointRadius: 3,
          borderWidth: 2,
          borderDash: [5, 5],
        },
        {
          label: 'Expenses',
          data: expenseData,
          borderColor: '#ef4444',
          backgroundColor: 'transparent',
          tension: 0.4,
          pointRadius: 3,
          borderWidth: 2,
          borderDash: [5, 5],
        }
      ]
    };
  }, [transactions]);

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    interaction: {
      intersect: false,
      mode: 'index',
    },
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
        displayColors: true,
        callbacks: {
          label: function (context) {
            return `${context.dataset.label}: ₹${context.parsed.y.toLocaleString('en-IN')}`;
          }
        }
      }
    },
    scales: {
      x: {
        grid: { display: false },
        ticks: {
          color: darkMode ? '#64748b' : '#94a3b8',
          font: { size: 11 }
        }
      },
      y: {
        grid: {
          color: darkMode ? 'rgba(148, 163, 184, 0.08)' : 'rgba(0, 0, 0, 0.04)'
        },
        ticks: {
          color: darkMode ? '#64748b' : '#94a3b8',
          font: { size: 11 },
          callback: (value) => '₹' + (value / 1000).toFixed(0) + 'k'
        }
      }
    }
  };

  return (
    <div className="chart-container">
      <h3 className="chart-title">Balance Trend</h3>
      <p className="chart-subtitle">Income, expenses and cumulative balance over 6 months</p>
      <div className="chart-wrapper">
        <Line data={chartData} options={options} />
      </div>
    </div>
  );
}

export default BalanceChart;
