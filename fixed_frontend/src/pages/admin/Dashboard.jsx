import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { getAllUsers, getAllLands, getAllBookings } from '../../utils/api';

export default function AdminDashboard() {
  const [users, setUsers] = useState([]);
  const [lands, setLands] = useState([]);
  const [bookings, setBookings] = useState([]);

  useEffect(() => {
    getAllUsers().then(r => setUsers(r.data)).catch(() => {});
    getAllLands().then(r => setLands(r.data)).catch(() => {});
    getAllBookings().then(r => setBookings(r.data)).catch(() => {});
  }, []);

  const stats = [
    { label: 'Total Users', value: users.filter(u => u.role === 'user').length, icon: 'bi-people-fill', color: 'primary', link: '/admin/users' },
    { label: 'Farmers', value: users.filter(u => u.role === 'farmer').length, icon: 'bi-person-badge', color: 'success', link: '/admin/users' },
    { label: 'Total Lands', value: lands.length, icon: 'bi-geo-alt-fill', color: 'warning', link: '/admin/lands' },
    { label: 'Pending Lands', value: lands.filter(l => l.status === 'pending').length, icon: 'bi-hourglass', color: 'danger', link: '/admin/lands' },
    { label: 'Total Bookings', value: bookings.length, icon: 'bi-calendar-check', color: 'info', link: '/admin/bookings' },
    { label: 'Active Leases', value: bookings.filter(b => b.status === 'approved').length, icon: 'bi-activity', color: 'primary', link: '/admin/bookings' },
  ];

  return (
    <div className="container py-5">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <div>
          <h2 className="fw-bold mb-1">Admin Dashboard 🛡️</h2>
          <p className="text-muted mb-0">Platform overview and management</p>
        </div>
      </div>

      <div className="row g-4 mb-5">
        {stats.map((s, i) => (
          <div key={i} className="col-6 col-md-4 col-lg-2">
            <Link to={s.link} className="text-decoration-none">
              <div className="card border-0 shadow-sm stat-card h-100 text-center">
                <div className="card-body p-3">
                  <i className={`bi ${s.icon} text-${s.color} fs-3 mb-2`}></i>
                  <h3 className="fw-bold mb-0">{s.value}</h3>
                  <small className="text-muted">{s.label}</small>
                </div>
              </div>
            </Link>
          </div>
        ))}
      </div>

      <div className="row g-4">
        <div className="col-lg-6">
          <div className="card border-0 shadow-sm">
            <div className="card-header bg-white d-flex justify-content-between py-3">
              <h5 className="mb-0 fw-bold">Pending Land Approvals</h5>
              <Link to="/admin/lands" className="btn btn-sm btn-outline-primary">View All</Link>
            </div>
            <div className="card-body p-0">
              {lands.filter(l => l.status === 'pending').length === 0 ? (
                <div className="text-center py-4 text-muted"><p>No pending approvals 🎉</p></div>
              ) : (
                <div className="table-responsive">
                  <table className="table mb-0">
                    <thead className="table-agrorent"><tr><th>Land</th><th>Farmer</th><th>Action</th></tr></thead>
                    <tbody>
                      {lands.filter(l => l.status === 'pending').slice(0, 5).map(l => (
                        <tr key={l._id}>
                          <td><div className="fw-semibold">{l.title}</div><small className="text-muted">{l.location}</small></td>
                          <td>{l.farmer?.name}</td>
                          <td><Link to="/admin/lands" className="btn btn-sm btn-warning">Review</Link></td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          </div>
        </div>
        <div className="col-lg-6">
          <div className="card border-0 shadow-sm h-100">
            <div className="card-body p-4">
              <h5 className="fw-bold mb-4">Admin Quick Actions</h5>
              <div className="d-grid gap-2">
                <Link to="/admin/lands" className="btn btn-outline-warning"><i className="bi bi-geo-alt me-2"></i>Manage Lands & Approvals</Link>
                <Link to="/admin/users" className="btn btn-outline-primary"><i className="bi bi-people me-2"></i>Manage Users & Farmers</Link>
                <Link to="/admin/bookings" className="btn btn-outline-info"><i className="bi bi-calendar-check me-2"></i>View All Bookings</Link>
                <Link to="/admin/seasons" className="btn btn-outline-success"><i className="bi bi-calendar me-2"></i>Define Seasons</Link>
                <Link to="/admin/crops" className="btn btn-outline-secondary"><i className="bi bi-leaf me-2"></i>Manage Crops</Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

