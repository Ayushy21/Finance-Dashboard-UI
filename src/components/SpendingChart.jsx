import { useMemo } from 'react';
import { useAppContext } from '../context/AppContext';
import { Doughnut } from 'react-chartjs-2';
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';
import './Charts.css';

ChartJS.register(ArcElement, Tooltip, Legend);

function SpendingChart() {
  const { transactions, darkMode } = useAppContext();

  const chartData = useMemo(() => {
    // group expenses by category
    const categoryTotals = {};
    transactions
      .filter(t => t.type === 'expense')
      .forEach(t => {
        categoryTotals[t.category] = (categoryTotals[t.category] || 0) + t.amount;
      });

    // sort by amount and take top 6, group rest as "Other"
    const sorted = Object.entries(categoryTotals).sort((a, b) => b[1] - a[1]);
    const top = sorted.slice(0, 6);
    const rest = sorted.slice(6);
    
    if (rest.length > 0) {
      const otherTotal = rest.reduce((sum, [, val]) => sum + val, 0);
      top.push(['Other', otherTotal]);
    }

    const colors = [
      '#3b82f6', '#ef4444', '#22c55e', '#f59e0b',
      '#8b5cf6', '#ec4899', '#64748b'
    ];

    return {
      labels: top.map(([cat]) => cat),
      datasets: [{
        data: top.map(([, amount]) => amount),
        backgroundColor: colors.slice(0, top.length),
        borderWidth: 0,
        hoverOffset: 8,
      }]
    };
  }, [transactions]);

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    cutout: '65%',
    plugins: {
      legend: {
        position: 'right',
        labels: {
          usePointStyle: true,
          pointStyle: 'circle',
          padding: 16,
          font: { size: 12, family: "'Inter', sans-serif" },
          color: darkMode ? '#94a3b8' : '#64748b',
          generateLabels: function(chart) {
            const data = chart.data;
            const total = data.datasets[0].data.reduce((a, b) => a + b, 0);
            return data.labels.map((label, i) => ({
              text: `${label} (${((data.datasets[0].data[i] / total) * 100).toFixed(1)}%)`,
              fillStyle: data.datasets[0].backgroundColor[i],
              strokeStyle: 'transparent',
              pointStyle: 'circle',
              index: i
            }));
          }
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
            const total = context.dataset.data.reduce((a, b) => a + b, 0);
            const pct = ((context.parsed / total) * 100).toFixed(1);
            return `₹${context.parsed.toLocaleString('en-IN')} (${pct}%)`;
          }
        }
      }
    }
  };

  // check if there's no expense data
  const hasData = chartData.datasets[0].data.length > 0;

  return (
    <div className="chart-container">
      <h3 className="chart-title">Spending Breakdown</h3>
      <p className="chart-subtitle">Where your money goes by category</p>
      {hasData ? (
        <div className="chart-wrapper doughnut">
          <Doughnut data={chartData} options={options} />
        </div>
      ) : (
        <div className="no-data">
          <p>No expense data available</p>
        </div>
      )}
    </div>
  );
}

export default SpendingChart;
