import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { getMyLands, getFarmerBookings } from '../../utils/api';

export default function FarmerDashboard() {
  const { user } = useAuth();
  const [lands, setLands] = useState([]);
  const [bookings, setBookings] = useState([]);

  useEffect(() => {
    getMyLands().then(r => setLands(r.data)).catch(() => {});
    getFarmerBookings().then(r => setBookings(r.data)).catch(() => {});
  }, []);

  const stats = [
    { label: 'My Lands', value: lands.length, icon: 'bi-geo-alt-fill', color: 'primary' },
    { label: 'Approved Lands', value: lands.filter(l => l.status === 'approved').length, icon: 'bi-check-circle', color: 'success' },
    { label: 'Pending Bookings', value: bookings.filter(b => b.status === 'pending').length, icon: 'bi-hourglass', color: 'warning' },
    { label: 'Active Leases', value: bookings.filter(b => b.status === 'approved').length, icon: 'bi-activity', color: 'info' },
  ];

  return (
    <div className="container py-5">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <div>
          <h2 className="fw-bold mb-1">Farmer Dashboard 👨‍🌾</h2>
          <p className="text-muted mb-0">Manage your lands and bookings</p>
        </div>
        <Link to="/farmer/lands/add" className="btn btn-primary"><i className="bi bi-plus-lg me-2"></i>Add Land</Link>
      </div>

      <div className="row g-4 mb-5">
        {stats.map((s, i) => (
          <div key={i} className="col-6 col-md-3">
            <div className="card border-0 shadow-sm stat-card h-100">
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
        <div className="col-lg-7">
          <div className="card border-0 shadow-sm">
            <div className="card-header bg-white d-flex justify-content-between py-3">
              <h5 className="mb-0 fw-bold">Recent Booking Requests</h5>
              <Link to="/farmer/bookings" className="btn btn-sm btn-outline-primary">View All</Link>
            </div>
            <div className="card-body p-0">
              {bookings.length === 0 ? (
                <div className="text-center py-4 text-muted"><i className="bi bi-inbox fs-2"></i><p className="mt-2">No booking requests yet</p></div>
              ) : (
                <div className="table-responsive">
                  <table className="table mb-0">
                    <thead className="table-agrorent"><tr><th>Leasee</th><th>Land</th><th>Status</th><th></th></tr></thead>
                    <tbody>
                      {bookings.slice(0, 5).map(b => (
                        <tr key={b._id}>
                          <td>{b.user?.name}<div className="text-muted small">{b.user?.email}</div></td>
                          <td>{b.land?.title}</td>
                          <td><span className={`badge badge-${b.status}`}>{b.status}</span></td>
                          <td><Link to="/farmer/bookings" className="btn btn-sm btn-outline-primary">Manage</Link></td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          </div>
        </div>
        <div className="col-lg-5">
          <div className="card border-0 shadow-sm h-100">
            <div className="card-body p-4">
              <h5 className="fw-bold mb-4">Quick Actions</h5>
              <div className="d-grid gap-2">
                <Link to="/farmer/lands/add" className="btn btn-primary"><i className="bi bi-plus-circle me-2"></i>Add New Land</Link>
                <Link to="/farmer/lands" className="btn btn-outline-primary"><i className="bi bi-geo-alt me-2"></i>Manage Lands</Link>
                <Link to="/farmer/bookings" className="btn btn-outline-secondary"><i className="bi bi-calendar-check me-2"></i>Manage Bookings</Link>
                <Link to="/farmer/crops" className="btn btn-outline-success"><i className="bi bi-leaf me-2"></i>Manage Crops</Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

