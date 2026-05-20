import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { getMyBookings } from '../../utils/api';

export default function UserDashboard() {
  const { user } = useAuth();
  const [bookings, setBookings] = useState([]);

  useEffect(() => { getMyBookings().then(r => setBookings(r.data)).catch(() => {}); }, []);

  const stats = [
    { label: 'Total Bookings', value: bookings.length, icon: 'bi-calendar-check', color: 'primary' },
    { label: 'Pending', value: bookings.filter(b => b.status === 'pending').length, icon: 'bi-hourglass-split', color: 'warning' },
    { label: 'Approved', value: bookings.filter(b => b.status === 'approved').length, icon: 'bi-check-circle', color: 'success' },
    { label: 'Completed', value: bookings.filter(b => b.status === 'completed').length, icon: 'bi-trophy', color: 'info' },
  ];

  return (
    <div className="container py-5">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <div>
          <h2 className="fw-bold mb-1">Welcome, {user?.name}! 👋</h2>
          <p className="text-muted mb-0">Your land leasing dashboard</p>
        </div>
        <Link to="/lands" className="btn btn-primary"><i className="bi bi-search me-2"></i>Browse Lands</Link>
      </div>

      <div className="row g-4 mb-5">
        {stats.map((s, i) => (
          <div key={i} className="col-6 col-md-3">
            <div className={`card border-0 shadow-sm stat-card h-100`}>
              <div className="card-body text-center p-4">
                <i className={`bi ${s.icon} text-${s.color} fs-2 mb-2`}></i>
                <h3 className="fw-bold mb-0">{s.value}</h3>
                <small className="text-muted">{s.label}</small>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="row g-4">
        <div className="col-lg-8">
          <div className="card border-0 shadow-sm">
            <div className="card-header bg-white d-flex justify-content-between align-items-center py-3">
              <h5 className="mb-0 fw-bold">Recent Bookings</h5>
              <Link to="/my-bookings" className="btn btn-sm btn-outline-primary">View All</Link>
            </div>
            <div className="card-body p-0">
              {bookings.length === 0 ? (
                <div className="text-center py-5">
                  <i className="bi bi-calendar-x text-muted fs-1"></i>
                  <p className="text-muted mt-2">No bookings yet. <Link to="/lands">Browse lands</Link> to get started!</p>
                </div>
              ) : (
                <div className="table-responsive">
                  <table className="table table-hover mb-0">
                    <thead className="table-agrorent"><tr><th>Land</th><th>Status</th><th>Progress</th><th></th></tr></thead>
                    <tbody>
                      {bookings.slice(0, 5).map(b => (
                        <tr key={b._id}>
                          <td><div className="fw-semibold">{b.land?.title}</div><small className="text-muted">{b.land?.location}</small></td>
                          <td><span className={`badge badge-${b.status}`}>{b.status}</span></td>
                          <td><span className="badge bg-light text-dark">{b.farmingProgress?.replace('_', ' ')}</span></td>
                          <td><Link to={`/bookings/${b._id}`} className="btn btn-sm btn-outline-primary">View</Link></td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          </div>
        </div>
        <div className="col-lg-4">
          <div className="card border-0 shadow-sm h-100">
            <div className="card-body p-4">
              <h5 className="fw-bold mb-4">Quick Actions</h5>
              <div className="d-grid gap-3">
                <Link to="/lands" className="btn btn-primary"><i className="bi bi-search me-2"></i>Browse Lands</Link>
                <Link to="/my-bookings" className="btn btn-outline-primary"><i className="bi bi-list-check me-2"></i>My Bookings</Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
