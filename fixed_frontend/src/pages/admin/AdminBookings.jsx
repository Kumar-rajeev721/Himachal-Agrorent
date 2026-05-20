import React, { useEffect, useState } from 'react';
import { getAllBookings } from '../../utils/api';

export default function AdminBookings() {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all');

  useEffect(() => {
    getAllBookings().then(r => { setBookings(r.data); setLoading(false); }).catch(() => setLoading(false));
  }, []);

  const filtered = filter === 'all' ? bookings : bookings.filter(b => b.status === filter);

  return (
    <>
      <div className="page-header">
        <div className="container"><h2 className="fw-bold mb-0">All Bookings</h2></div>
      </div>
      <div className="container py-4">
        <div className="d-flex gap-2 mb-4">
          {['all', 'pending', 'approved', 'declined', 'completed'].map(f => (
            <button key={f} className={`btn btn-sm ${filter === f ? 'btn-primary' : 'btn-outline-secondary'}`} onClick={() => setFilter(f)}>
              {f.charAt(0).toUpperCase() + f.slice(1)} {f !== 'all' && `(${bookings.filter(b => b.status === f).length})`}
            </button>
          ))}
        </div>
        {loading ? <div className="text-center py-5"><div className="spinner-border text-primary" /></div>
          : (
            <div className="card border-0 shadow-sm">
              <div className="table-responsive">
                <table className="table table-hover mb-0">
                  <thead className="table-agrorent">
                    <tr><th>Land</th><th>User (Leasee)</th><th>Farmer</th><th>Dates</th><th>Amount</th><th>Status</th><th>Progress</th></tr>
                  </thead>
                  <tbody>
                    {filtered.map(b => (
                      <tr key={b._id}>
                        <td><div className="fw-semibold">{b.land?.title}</div><small className="text-muted">{b.land?.location}</small></td>
                        <td>{b.user?.name}<div className="text-muted small">{b.user?.email}</div></td>
                        <td>{b.farmer?.name}</td>
                        <td className="small">
                          {new Date(b.startDate).toLocaleDateString()}<br />
                          {new Date(b.endDate).toLocaleDateString()}
                        </td>
                        <td className="text-primary fw-semibold">Rs.{b.totalPrice?.toLocaleString()}</td>
                        <td><span className={`badge badge-${b.status}`}>{b.status}</span></td>
                        <td><span className="badge bg-light text-dark small">{b.farmingProgress?.replace(/_/g, ' ')}</span></td>
                      </tr>
                    ))}
                    {filtered.length === 0 && <tr><td colSpan={7} className="text-center text-muted py-4">No bookings found</td></tr>}
                  </tbody>
                </table>
              </div>
            </div>
          )}
      </div>
    </>
  );
}

