import { useState } from 'react';
import { useAppContext } from '../context/AppContext';
import { FiSun, FiMoon, FiMenu, FiX, FiUser, FiShield } from 'react-icons/fi';
import './Navbar.css';

function Navbar({ activeTab, setActiveTab }) {
  const { role, setRole, darkMode, setDarkMode } = useAppContext();
  const [mobileOpen, setMobileOpen] = useState(false);

  const tabs = [
    { id: 'dashboard', label: 'Dashboard' },
    { id: 'transactions', label: 'Transactions' },
    { id: 'insights', label: 'Insights' }
  ];

  return (
    <nav className="navbar">
      <div className="navbar-inner">
        <div className="navbar-brand">
          <span className="logo-icon">💰</span>
          <h1>FinTrack</h1>
        </div>

        <button
          className="mobile-toggle"
          onClick={() => setMobileOpen(!mobileOpen)}
        >
          {mobileOpen ? <FiX /> : <FiMenu />}
        </button>

        <div className={`navbar-links ${mobileOpen ? 'open' : ''}`}>
          {tabs.map(tab => (
            <button
              key={tab.id}
              className={`nav-tab ${activeTab === tab.id ? 'active' : ''}`}
              onClick={() => {
                setActiveTab(tab.id);
                setMobileOpen(false);
              }}
            >
              {tab.label}
            </button>
          ))}
        </div>

        <div className={`navbar-actions ${mobileOpen ? 'open' : ''}`}>
          {/* role switcher */}
          <div className="role-switcher">
            <div className={`role-toggle ${role}`} onClick={() => setRole(role === 'admin' ? 'viewer' : 'admin')}>
              <div className="role-indicator"></div>
              <span className="role-label">
                {role === 'admin' ? (
                  <><FiShield size={14} /> Admin</>
                ) : (
                  <><FiUser size={14} /> Viewer</>
                )}
              </span>
            </div>
          </div>

          {/* dark mode toggle */}
          <button
            className="theme-toggle"
            onClick={() => setDarkMode(!darkMode)}
            title={darkMode ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
          >
            {darkMode ? <FiSun /> : <FiMoon />}
          </button>
        </div>
      </div>
    </nav>
  );
}

export default Navbar;
