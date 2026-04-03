// mock data for the dashboard
// i generated most of this by hand, some random amounts

const categories = [
  'Food & Dining',
  'Shopping',
  'Transport',
  'Entertainment',
  'Bills & Utilities',
  'Health',
  'Education',
  'Salary',
  'Freelance',
  'Investment',
  'Other'
];

const incomeCategories = ['Salary', 'Freelance', 'Investment'];

// generate transactions for past 6 months
function generateTransactions() {
  const transactions = [];
  const now = new Date();

  const descriptions = {
    'Food & Dining': ['Swiggy Order', 'Zomato', 'Dominos Pizza', 'Starbucks', 'Chai Point', 'Local Restaurant', 'Grocery Store'],
    'Shopping': ['Amazon Purchase', 'Flipkart Order', 'Myntra', 'Nike Store', 'Local Market'],
    'Transport': ['Uber Ride', 'Ola Cab', 'Metro Card Recharge', 'Petrol', 'Rapido'],
    'Entertainment': ['Netflix Subscription', 'Spotify', 'Movie Tickets', 'Gaming', 'Books'],
    'Bills & Utilities': ['Electricity Bill', 'Internet Bill', 'Phone Recharge', 'Water Bill', 'Gas Bill'],
    'Health': ['Pharmacy', 'Doctor Visit', 'Gym Membership', 'Lab Tests'],
    'Education': ['Udemy Course', 'Books', 'Coursera Subscription', 'College Fee'],
    'Salary': ['Monthly Salary', 'Salary Credit'],
    'Freelance': ['Project Payment', 'Client Payment', 'Consulting Fee'],
    'Investment': ['Dividend', 'Mutual Fund Returns', 'Stock Profit'],
    'Other': ['ATM Withdrawal', 'Transfer', 'Miscellaneous']
  };

  let id = 1;

  // go backward 6 months
  for (let m = 5; m >= 0; m--) {
    const month = new Date(now.getFullYear(), now.getMonth() - m, 1);
    
    // add 1-2 income transactions per month
    const numIncome = Math.floor(Math.random() * 2) + 1;
    for (let i = 0; i < numIncome; i++) {
      const cat = incomeCategories[Math.floor(Math.random() * incomeCategories.length)];
      const descs = descriptions[cat];
      const day = Math.floor(Math.random() * 28) + 1;
      
      let amount;
      if (cat === 'Salary') {
        amount = 45000 + Math.floor(Math.random() * 10000);
      } else if (cat === 'Freelance') {
        amount = 5000 + Math.floor(Math.random() * 15000);
      } else {
        amount = 1000 + Math.floor(Math.random() * 5000);
      }

      transactions.push({
        id: id++,
        date: new Date(month.getFullYear(), month.getMonth(), day).toISOString().split('T')[0],
        description: descs[Math.floor(Math.random() * descs.length)],
        amount: amount,
        category: cat,
        type: 'income'
      });
    }

    // add 8-15 expense transactions per month
    const numExpense = Math.floor(Math.random() * 8) + 8;
    for (let i = 0; i < numExpense; i++) {
      const expCats = categories.filter(c => !incomeCategories.includes(c));
      const cat = expCats[Math.floor(Math.random() * expCats.length)];
      const descs = descriptions[cat];
      const day = Math.floor(Math.random() * 28) + 1;
      
      let amount;
      if (cat === 'Bills & Utilities') {
        amount = 500 + Math.floor(Math.random() * 3000);
      } else if (cat === 'Shopping') {
        amount = 200 + Math.floor(Math.random() * 5000);
      } else {
        amount = 50 + Math.floor(Math.random() * 2000);
      }

      transactions.push({
        id: id++,
        date: new Date(month.getFullYear(), month.getMonth(), day).toISOString().split('T')[0],
        description: descs[Math.floor(Math.random() * descs.length)],
        amount: amount,
        category: cat,
        type: 'expense'
      });
    }
  }

  // sort by date descending
  transactions.sort((a, b) => new Date(b.date) - new Date(a.date));
  return transactions;
}

// using a seeded approach so data stays consistent during the session
// just generate once and export
const transactions = generateTransactions();

export { transactions, categories, incomeCategories };
