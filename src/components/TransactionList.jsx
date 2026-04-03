import { useState } from 'react';
import { useAppContext } from '../context/AppContext';
import { categories } from '../data/mockData';
import { FiSearch, FiPlus, FiEdit2, FiTrash2, FiChevronDown, FiDownload, FiArrowUp, FiArrowDown } from 'react-icons/fi';
import TransactionModal from './TransactionModal';
import './Transactions.css';

function TransactionList() {
  const { filteredTransactions, filters, setFilters, role, deleteTransaction } = useAppContext();
  const [showModal, setShowModal] = useState(false);
  const [editingTransaction, setEditingTransaction] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const perPage = 10;

  // format currency
  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0
    }).format(amount);
  };

  // format date to readable string
  const formatDate = (dateStr) => {
    return new Date(dateStr).toLocaleDateString('en-IN', {
      day: 'numeric',
      month: 'short',
      year: 'numeric'
    });
  };

  // pagination
  const totalPages = Math.ceil(filteredTransactions.length / perPage);
  const paginatedData = filteredTransactions.slice(
    (currentPage - 1) * perPage,
    currentPage * perPage
  );

  const handleSort = (field) => {
    if (filters.sortBy === field) {
      setFilters(prev => ({ ...prev, sortOrder: prev.sortOrder === 'asc' ? 'desc' : 'asc' }));
    } else {
      setFilters(prev => ({ ...prev, sortBy: field, sortOrder: 'desc' }));
    }
  };

  // export to CSV
  const handleExport = () => {
    const headers = ['Date', 'Description', 'Category', 'Type', 'Amount'];
    const csvData = filteredTransactions.map(t =>
      [t.date, t.description, t.category, t.type, t.amount].join(',')
    );
    const csv = [headers.join(','), ...csvData].join('\n');
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'transactions.csv';
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleEdit = (transaction) => {
    setEditingTransaction(transaction);
    setShowModal(true);
  };

  const handleDelete = (id) => {
    if (window.confirm('Delete this transaction?')) {
      deleteTransaction(id);
    }
  };

  const getSortIcon = (field) => {
    if (filters.sortBy !== field) return <FiChevronDown className="sort-icon muted" />;
    return filters.sortOrder === 'asc' ? 
      <FiArrowUp className="sort-icon active" /> : 
      <FiArrowDown className="sort-icon active" />;
  };

  return (
    <div className="transactions-section">
      {/* filters bar */}
      <div className="filters-bar">
        <div className="search-box">
          <FiSearch className="search-icon" />
          <input
            type="text"
            placeholder="Search transactions..."
            value={filters.search}
            onChange={(e) => {
              setFilters(prev => ({ ...prev, search: e.target.value }));
              setCurrentPage(1);
            }}
          />
        </div>

        <div className="filter-group">
          <select
            value={filters.type}
            onChange={(e) => {
              setFilters(prev => ({ ...prev, type: e.target.value }));
              setCurrentPage(1);
            }}
          >
            <option value="all">All Types</option>
            <option value="income">Income</option>
            <option value="expense">Expense</option>
          </select>

          <select
            value={filters.category}
            onChange={(e) => {
              setFilters(prev => ({ ...prev, category: e.target.value }));
              setCurrentPage(1);
            }}
          >
            <option value="all">All Categories</option>
            {categories.map(cat => (
              <option key={cat} value={cat}>{cat}</option>
            ))}
          </select>
        </div>

        <div className="filter-actions">
          <button className="btn-export" onClick={handleExport} title="Export CSV">
            <FiDownload /> <span>Export</span>
          </button>
          {role === 'admin' && (
            <button
              className="btn-add"
              onClick={() => { setEditingTransaction(null); setShowModal(true); }}
            >
              <FiPlus /> <span>Add Transaction</span>
            </button>
          )}
        </div>
      </div>

      {/* transactions table */}
      {filteredTransactions.length === 0 ? (
        <div className="empty-state">
          <div className="empty-icon">📭</div>
          <h3>No transactions found</h3>
          <p>Try adjusting your filters or add a new transaction</p>
        </div>
      ) : (
        <>
          {/* desktop table */}
          <div className="table-wrapper">
            <table className="transactions-table">
              <thead>
                <tr>
                  <th onClick={() => handleSort('date')}>
                    Date {getSortIcon('date')}
                  </th>
                  <th>Description</th>
                  <th onClick={() => handleSort('category')}>
                    Category {getSortIcon('category')}
                  </th>
                  <th>Type</th>
                  <th onClick={() => handleSort('amount')}>
                    Amount {getSortIcon('amount')}
                  </th>
                  {role === 'admin' && <th>Actions</th>}
                </tr>
              </thead>
              <tbody>
                {paginatedData.map(t => (
                  <tr key={t.id}>
                    <td className="date-cell">{formatDate(t.date)}</td>
                    <td className="desc-cell">{t.description}</td>
                    <td>
                      <span className="category-badge">{t.category}</span>
                    </td>
                    <td>
                      <span className={`type-badge ${t.type}`}>
                        {t.type === 'income' ? '↑' : '↓'} {t.type}
                      </span>
                    </td>
                    <td className={`amount-cell ${t.type}`}>
                      {t.type === 'income' ? '+' : '-'}{formatCurrency(t.amount)}
                    </td>
                    {role === 'admin' && (
                      <td className="actions-cell">
                        <button className="btn-icon edit" onClick={() => handleEdit(t)} title="Edit">
                          <FiEdit2 />
                        </button>
                        <button className="btn-icon delete" onClick={() => handleDelete(t.id)} title="Delete">
                          <FiTrash2 />
                        </button>
                      </td>
                    )}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* mobile cards */}
          <div className="mobile-cards">
            {paginatedData.map(t => (
              <div key={t.id} className="transaction-card">
                <div className="tc-top">
                  <div>
                    <div className="tc-desc">{t.description}</div>
                    <div className="tc-meta">{formatDate(t.date)} · {t.category}</div>
                  </div>
                  <div className={`tc-amount ${t.type}`}>
                    {t.type === 'income' ? '+' : '-'}{formatCurrency(t.amount)}
                  </div>
                </div>
                {role === 'admin' && (
                  <div className="tc-actions">
                    <button onClick={() => handleEdit(t)}><FiEdit2 /> Edit</button>
                    <button onClick={() => handleDelete(t.id)} className="danger"><FiTrash2 /> Delete</button>
                  </div>
                )}
              </div>
            ))}
          </div>

          {/* pagination */}
          {totalPages > 1 && (
            <div className="pagination">
              <button
                disabled={currentPage === 1}
                onClick={() => setCurrentPage(p => p - 1)}
              >
                Previous
              </button>
              <span className="page-info">
                Page {currentPage} of {totalPages}
              </span>
              <button
                disabled={currentPage === totalPages}
                onClick={() => setCurrentPage(p => p + 1)}
              >
                Next
              </button>
            </div>
          )}
        </>
      )}

      {/* transaction modal for add/edit */}
      {showModal && (
        <TransactionModal
          transaction={editingTransaction}
          onClose={() => { setShowModal(false); setEditingTransaction(null); }}
        />
      )}
    </div>
  );
}

export default TransactionList;
