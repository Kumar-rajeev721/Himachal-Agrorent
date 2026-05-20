import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

const adminActions = [
  { to: '/admin/lands',       icon: 'bi-geo-alt',        label: 'Manage Lands & Approvals', color: 'text-warning'   },
  { to: '/admin/users',       icon: 'bi-people',         label: 'Manage Users & Farmers',   color: 'text-primary'   },
  { to: '/admin/bookings',    icon: 'bi-calendar-check', label: 'View All Bookings',         color: 'text-info'      },
  { to: '/admin/seasons',     icon: 'bi-calendar',       label: 'Define Seasons',            color: 'text-success'   },
  { to: '/admin/crops',       icon: 'bi-leaf',           label: 'Manage Crops',              color: 'text-secondary' },
];

const farmerActions = [
  { to: '/farmer/lands/add', icon: 'bi-plus-circle',     label: 'Add New Land',    color: 'text-primary'   },
  { to: '/farmer/lands',     icon: 'bi-geo-alt',         label: 'Manage Lands',    color: 'text-primary'   },
  { to: '/farmer/bookings',  icon: 'bi-calendar-check',  label: 'Manage Bookings', color: 'text-secondary' },
  { to: '/farmer/crops',     icon: 'bi-leaf',            label: 'Manage Crops',    color: 'text-success'   },
];

const userActions = [
  { to: '/lands',            icon: 'bi-search',          label: 'Browse Lands',        color: 'text-primary' },
  { to: '/my-bookings',      icon: 'bi-list-check',      label: 'My Bookings',         color: 'text-primary' },
];

export default function Navbar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => { logout(); navigate('/'); };

  const getDashboardLink = () => {
    if (!user) return null;
    if (user.role === 'admin') return '/admin/dashboard';
    if (user.role === 'farmer') return '/farmer/dashboard';
    return '/dashboard';
  };

  const getQuickActions = () => {
    if (!user) return [];
    if (user.role === 'admin') return adminActions;
    if (user.role === 'farmer') return farmerActions;
    return userActions;
  };

  const quickActions = getQuickActions();
  const quickActionsLabel = user?.role === 'admin' ? 'Admin Quick Actions' : 'Quick Actions';

  return (
    <nav className="navbar navbar-expand-lg agrorent-navbar shadow-sm py-2 px-3 px-lg-5">
      <Link className="navbar-brand text-white fw-bold" to="/">
        🌱 <span className="text-warning">Himachal Agrorent</span>
      </Link>
      <button className="navbar-toggler border-0" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNav">
        <span className="navbar-toggler-icon"></span>
      </button>
      <div className="collapse navbar-collapse" id="navbarNav">
        <ul className="navbar-nav me-auto">
          <li className="nav-item"><Link className="nav-link" to="/">Home</Link></li>
          <li className="nav-item"><Link className="nav-link" to="/lands">Browse Lands</Link></li>

          {/* Role-based Quick Actions dropdown in Navbar */}
          {user && quickActions.length > 0 && (
            <li className="nav-item dropdown">
              <a
                className="nav-link dropdown-toggle"
                href="#"
                data-bs-toggle="dropdown"
                aria-expanded="false"
              >
                <i className="bi bi-lightning-charge-fill me-1 text-warning"></i>
                {quickActionsLabel}
              </a>
              <ul className="dropdown-menu shadow border-0" style={{ minWidth: '230px' }}>
                <li>
                  <h6 className="dropdown-header text-uppercase small fw-bold text-muted">
                    {quickActionsLabel}
                  </h6>
                </li>
                {quickActions.map((action, i) => (
                  <li key={i}>
                    <Link className="dropdown-item d-flex align-items-center gap-2 py-2" to={action.to}>
                      <i className={`bi ${action.icon} ${action.color}`}></i>
                      <span>{action.label}</span>
                    </Link>
                  </li>
                ))}
              </ul>
            </li>
          )}
        </ul>

        <ul className="navbar-nav">
          {user ? (
            <li className="nav-item dropdown">
              <a className="nav-link dropdown-toggle text-white" href="#" data-bs-toggle="dropdown">
                <i className="bi bi-person-circle me-1"></i>{user.name}
                <span className={`badge ms-2 ${user.role === 'admin' ? 'bg-danger' : user.role === 'farmer' ? 'bg-warning text-dark' : 'bg-light text-dark'}`}>
                  {user.role}
                </span>
              </a>
              <ul className="dropdown-menu dropdown-menu-end shadow border-0">
                <li>
                  <Link className="dropdown-item" to={getDashboardLink()}>
                    <i className="bi bi-speedometer2 me-2"></i>Dashboard
                  </Link>
                </li>
                <li><hr className="dropdown-divider" /></li>
                <li>
                  <button className="dropdown-item text-danger" onClick={handleLogout}>
                    <i className="bi bi-box-arrow-right me-2"></i>Logout
                  </button>
                </li>
              </ul>
            </li>
          ) : (
            <>
              <li className="nav-item"><Link className="nav-link" to="/login">Login</Link></li>
              <li className="nav-item"><Link className="btn btn-warning btn-sm ms-2 my-auto px-3" to="/register">Register</Link></li>
            </>
          )}
        </ul>
      </div>
    </nav>
  );
}
