import { useState } from 'react';
import {
  LayoutDashboard,
  Plus,
  CheckSquare,
  BarChart3,
  Settings,
  TrendingUp,
} from 'lucide-react';
import '../../../styles/NavBar.css';

export default function NavBar({ currentPage, onNavigate, userName, isAuthenticated }) {
  const [isMobileOpen, setIsMobileOpen] = useState(false);

  // si no está logueado, no mostramos el navbar
  if (!isAuthenticated) return null;

  const navItems = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'add-habit', label: 'Add Habit', icon: Plus },
    { id: 'daily-entries', label: 'Daily Entries', icon: CheckSquare },
  ];

  const userInitial =
    (userName && userName.trim().charAt(0).toUpperCase()) || '?';

  return (
    <nav className="nav">
      <div className="nav-inner">
        {/* Logo / Brand */}
        <div className="nav-left">
          <div className="nav-logo">
            <TrendingUp className="nav-logo-icon" />
          </div>
          <span className="nav-brand">Momentum</span>
        </div>

        {/* Links desktop */}
        <div className="nav-links">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = currentPage === item.id;

            return (
              <button
                key={item.id}
                className={`nav-link ${isActive ? 'nav-link--active' : ''}`}
                onClick={() => {
                  onNavigate(item.id);
                  setIsMobileOpen(false);
                }}
              >
                <Icon className="nav-link-icon" />
                <span>{item.label}</span>
              </button>
            );
          })}
        </div>

        {/* User + hamburguesa */}
        <div className="nav-right">
          <div className="nav-user">
            <div className="nav-user-avatar">
              <span>{userInitial}</span>
            </div>
            <span className="nav-user-name">{userName}</span>
          </div>

          <button
            className={`nav-toggle ${isMobileOpen ? 'nav-toggle--open' : ''}`}
            onClick={() => setIsMobileOpen((prev) => !prev)}
            aria-label="Toggle navigation menu"
          >
            <span className="nav-toggle-bar" />
            <span className="nav-toggle-bar" />
            <span className="nav-toggle-bar" />
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      <div
        className={`nav-mobile-menu ${
          isMobileOpen ? 'nav-mobile-menu--open' : ''
        }`}
      >
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = currentPage === item.id;

          return (
            <button
              key={item.id}
              className={`nav-mobile-link ${
                isActive ? 'nav-mobile-link--active' : ''
              }`}
              onClick={() => {
                onNavigate(item.id);
                setIsMobileOpen(false);
              }}
            >
              <Icon className="nav-mobile-icon" />
              <span>{item.label}</span>
            </button>
          );
        })}
      </div>
    </nav>
  );
}