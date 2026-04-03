import { createContext, useContext, useState, useEffect, useMemo } from 'react';
import { transactions as initialTransactions } from '../data/mockData';

const AppContext = createContext();

// this hook makes it easier to use the context anywhere
export function useAppContext() {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useAppContext must be used within AppProvider');
  }
  return context;
}

export function AppProvider({ children }) {
  // load from localStorage if available
  const [transactions, setTransactions] = useState(() => {
    const saved = localStorage.getItem('finance_transactions');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch {
        return initialTransactions;
      }
    }
    return initialTransactions;
  });

  const [role, setRole] = useState(() => {
    return localStorage.getItem('finance_role') || 'admin';
  });

  const [darkMode, setDarkMode] = useState(() => {
    return localStorage.getItem('finance_darkmode') === 'true';
  });

  const [filters, setFilters] = useState({
    search: '',
    type: 'all',
    category: 'all',
    sortBy: 'date',
    sortOrder: 'desc'
  });

  // persist stuff to localStorage
  useEffect(() => {
    localStorage.setItem('finance_transactions', JSON.stringify(transactions));
  }, [transactions]);

  useEffect(() => {
    localStorage.setItem('finance_role', role);
  }, [role]);

  useEffect(() => {
    localStorage.setItem('finance_darkmode', String(darkMode));
  }, [darkMode]);

  // toggle dark mode class on body
  useEffect(() => {
    if (darkMode) {
      document.body.classList.add('dark');
    } else {
      document.body.classList.remove('dark');
    }
  }, [darkMode]);

  // add a new transaction
  const addTransaction = (transaction) => {
    const newTransaction = {
      ...transaction,
      id: Math.max(...transactions.map(t => t.id), 0) + 1
    };
    setTransactions(prev => [newTransaction, ...prev]);
  };

  // edit existing transaction
  const editTransaction = (id, updatedData) => {
    setTransactions(prev =>
      prev.map(t => t.id === id ? { ...t, ...updatedData } : t)
    );
  };

  // delete transaction
  const deleteTransaction = (id) => {
    setTransactions(prev => prev.filter(t => t.id !== id));
  };

  // filtered and sorted transactions - memoized for perf
  const filteredTransactions = useMemo(() => {
    let result = [...transactions];

    // search filter
    if (filters.search) {
      const query = filters.search.toLowerCase();
      result = result.filter(t =>
        t.description.toLowerCase().includes(query) ||
        t.category.toLowerCase().includes(query) ||
        String(t.amount).includes(query)
      );
    }

    // type filter
    if (filters.type !== 'all') {
      result = result.filter(t => t.type === filters.type);
    }

    // category filter
    if (filters.category !== 'all') {
      result = result.filter(t => t.category === filters.category);
    }

    // sorting
    result.sort((a, b) => {
      let comparison = 0;
      if (filters.sortBy === 'date') {
        comparison = new Date(a.date) - new Date(b.date);
      } else if (filters.sortBy === 'amount') {
        comparison = a.amount - b.amount;
      } else if (filters.sortBy === 'category') {
        comparison = a.category.localeCompare(b.category);
      }
      return filters.sortOrder === 'asc' ? comparison : -comparison;
    });

    return result;
  }, [transactions, filters]);

  const value = {
    transactions,
    filteredTransactions,
    role,
    setRole,
    darkMode,
    setDarkMode,
    filters,
    setFilters,
    addTransaction,
    editTransaction,
    deleteTransaction
  };

  return (
    <AppContext.Provider value={value}>
      {children}
    </AppContext.Provider>
  );
}
