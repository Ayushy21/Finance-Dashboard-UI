# FinTrack - Personal Finance Dashboard

A clean, interactive finance dashboard built with React to help users track and understand their financial activity. Built as part of a frontend development assignment.



## Features

### Core Features

- **Dashboard Overview**
  - Summary cards showing Total Balance, Income, Expenses, and Transaction count
  - Balance trend line chart (6-month view with income/expense overlay)
  - Spending breakdown doughnut chart by category
  - Recent transactions quick view

- **Transactions Management**
  - Full transaction listing with date, amount, category, type
  - Search across descriptions, categories, and amounts
  - Filter by type (income/expense) and category
  - **Date range filter** (from/to date picker)
  - Sort by date, amount, or category (ascending/descending)
  - Pagination (10 per page)
  - CSV and **JSON export** functionality

- **Role-Based UI**
  - Toggle between Admin and Viewer roles via the navbar
  - Admin: Can add, edit, and delete transactions
  - Viewer: Read-only access (add/edit/delete buttons hidden)

- **Financial Insights**
  - Highest spending category identification
  - Average monthly expense calculation
  - Month-over-month expense comparison
  - Most frequent transaction detection
  - Monthly income vs expenses bar chart
  - Category-wise spending breakdown with progress bars
  - Biggest single expense highlight

- **State Management**
  - React Context API for global state
  - Managed state includes: transactions, filters, active role, dark mode preference
  - Memoized computations for filtered/sorted data

### Optional Enhancements Implemented

- **Dark Mode** - Toggle between light and dark themes
- **Data Persistence** - localStorage for transactions, role, and theme preference
- **Animations** - Page transitions, hover effects, modal animations
- **CSV + JSON Export** - Download filtered transactions as CSV or JSON
- **Date Range Filter** - Filter transactions by a from/to date range
- **Responsive Design** - Works on desktop, tablet, and mobile
- **Empty State Handling** - Graceful UI when no data matches filters

## Tech Stack

- **Framework**: React 19 (via Vite)
- **Charts**: Chart.js + react-chartjs-2
- **Icons**: react-icons (Feather icons)
- **Styling**: Vanilla CSS with CSS custom properties for theming
- **State**: React Context API + useReducer pattern
- **Build Tool**: Vite

## Project Structure

```
src/
├── components/
│   ├── Navbar.jsx          # Navigation bar with tabs, role switcher, theme toggle
│   ├── Navbar.css
│   ├── SummaryCards.jsx     # Financial overview cards
│   ├── SummaryCards.css
│   ├── BalanceChart.jsx     # Line chart for balance trend
│   ├── SpendingChart.jsx    # Doughnut chart for spending breakdown
│   ├── Charts.css           # Shared chart styles
│   ├── TransactionList.jsx  # Transaction table with filters
│   ├── Transactions.css
│   ├── TransactionModal.jsx # Add/Edit transaction form
│   ├── TransactionModal.css
│   ├── Insights.jsx         # Financial insights and analytics
│   └── Insights.css
├── context/
│   └── AppContext.jsx       # Global state management
├── data/
│   └── mockData.js          # Mock transaction data generator
├── App.jsx                  # Main app with tab routing
├── main.jsx                 # Entry point
└── index.css                # Global styles and CSS variables
```

## Getting Started

### Prerequisites

- Node.js (v18 or higher)
- npm

### Installation

1. Clone the repository
```bash
git clone <repository-url>
cd zorvyn-frontend
```

2. Install dependencies
```bash
npm install
```

3. Start the development server
```bash
npm run dev
```

4. Open your browser and go to `http://localhost:5173`

### Building for Production

```bash
npm run build
```

The output will be in the `dist/` folder.

## Design Decisions

### Why React Context instead of Redux/Zustand?
For a project of this scope, Context API provides enough functionality without adding external dependencies. The state is relatively simple (transactions array, filters, role) and doesn't have deeply nested consumers that would benefit from a more specialized solution.

### Why Vanilla CSS?
CSS custom properties give us theming (dark mode) for free, and the project doesn't need the overhead of a CSS-in-JS library. Each component has its own CSS file to keep styles co-located and easy to maintain.

### Why mock data generation?
Instead of hardcoding a JSON file, the data generator creates realistic-looking transactions across 6 months with appropriate amounts for each category. This makes the charts and insights more interesting to look at.

### Currency
Used INR (₹) formatting since the mock data uses Indian-style amounts (salary ranges, food delivery app names etc).

## Responsive Design

The dashboard adapts to different screen sizes:
- **Desktop** (1200px+): Full layout with side-by-side charts
- **Tablet** (768-1200px): Stacked charts, 2-column summary cards
- **Mobile** (<768px): Single column layout, hamburger menu, card-based transaction view instead of table

## Browser Support

Tested on:
- Chrome (latest)
- Firefox (latest)
- Edge (latest)

## What I'd Improve With More Time

- Implement mock API with loading states and skeleton screens
- Add budget setting feature with progress tracking
- More chart types (area charts, daily spending heatmap)
- Proper unit tests with Vitest
- Better accessibility (keyboard navigation, ARIA labels)
- URL-based routing with React Router

---

Made with ☕ and React
