import { useMemo } from 'react';
import { useAppContext } from '../context/AppContext';
import { FiTrendingUp, FiTrendingDown, FiDollarSign, FiActivity } from 'react-icons/fi';
import './SummaryCards.css';

function SummaryCards() {
  const { transactions } = useAppContext();

  const stats = useMemo(() => {
    const totalIncome = transactions
      .filter(t => t.type === 'income')
      .reduce((sum, t) => sum + t.amount, 0);

    const totalExpense = transactions
      .filter(t => t.type === 'expense')
      .reduce((sum, t) => sum + t.amount, 0);

    const balance = totalIncome - totalExpense;

    // this month's transactions
    const now = new Date();
    const thisMonth = transactions.filter(t => {
      const d = new Date(t.date);
      return d.getMonth() === now.getMonth() && d.getFullYear() === now.getFullYear();
    });

    const monthlyIncome = thisMonth.filter(t => t.type === 'income').reduce((s, t) => s + t.amount, 0);
    const monthlyExpense = thisMonth.filter(t => t.type === 'expense').reduce((s, t) => s + t.amount, 0);

    return {
      balance,
      totalIncome,
      totalExpense,
      monthlyIncome,
      monthlyExpense,
      savingsRate: totalIncome > 0 ? ((totalIncome - totalExpense) / totalIncome * 100).toFixed(1) : 0
    };
  }, [transactions]);

  // format currency - using INR since the mock data has indian style amounts
  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0
    }).format(amount);
  };

  const cards = [
    {
      title: 'Total Balance',
      value: formatCurrency(stats.balance),
      icon: <FiDollarSign />,
      color: 'blue',
      subtitle: `Savings Rate: ${stats.savingsRate}%`
    },
    {
      title: 'Total Income',
      value: formatCurrency(stats.totalIncome),
      icon: <FiTrendingUp />,
      color: 'green',
      subtitle: `This month: ${formatCurrency(stats.monthlyIncome)}`
    },
    {
      title: 'Total Expenses',
      value: formatCurrency(stats.totalExpense),
      icon: <FiTrendingDown />,
      color: 'red',
      subtitle: `This month: ${formatCurrency(stats.monthlyExpense)}`
    },
    {
      title: 'Transactions',
      value: transactions.length,
      icon: <FiActivity />,
      color: 'purple',
      subtitle: `${transactions.filter(t => t.type === 'income').length} income, ${transactions.filter(t => t.type === 'expense').length} expense`
    }
  ];

  return (
    <div className="summary-cards">
      {cards.map((card, idx) => (
        <div key={idx} className={`summary-card ${card.color}`}>
          <div className="card-header">
            <span className="card-title">{card.title}</span>
            <div className={`card-icon ${card.color}`}>
              {card.icon}
            </div>
          </div>
          <div className="card-value">{card.value}</div>
          <div className="card-subtitle">{card.subtitle}</div>
        </div>
      ))}
    </div>
  );
}

export default SummaryCards;
