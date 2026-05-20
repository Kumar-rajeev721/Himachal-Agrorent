import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { getMyBookings } from '../../utils/api';

export default function MyBookings() {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getMyBookings().then(r => { setBookings(r.data); setLoading(false); }).catch(() => setLoading(false));
  }, []);

  const progressSteps = ['not_started', 'soil_prep', 'planting', 'growing', 'harvesting', 'completed'];

  return (
    <>
      <div className="page-header">
        <div className="container"><h2 className="fw-bold mb-0">My Bookings</h2></div>
      </div>
      <div className="container py-4">
        {loading ? <div className="text-center py-5"><div className="spinner-border text-primary" /></div>
          : bookings.length === 0 ? (
            <div className="text-center py-5">
              <i className="bi bi-calendar-x text-muted" style={{ fontSize: 60 }}></i>
              <h4 className="mt-3">No bookings yet</h4>
              <Link to="/lands" className="btn btn-primary mt-2">Browse Lands</Link>
            </div>
          ) : (
            <div className="row g-4">
              {bookings.map(b => {
                const stepIdx = progressSteps.indexOf(b.farmingProgress);
                return (
                  <div key={b._id} className="col-lg-6">
                    <div className="card border-0 shadow-sm h-100">
                      <div className="card-body p-4">
                        <div className="d-flex justify-content-between mb-3">
                          <div>
                            <h5 className="fw-bold mb-1">{b.land?.title}</h5>
                            <p className="text-muted small mb-0"><i className="bi bi-geo-alt me-1"></i>{b.land?.location}</p>
                          </div>
                          <span className={`badge badge-${b.status} align-self-start`}>{b.status}</span>
                        </div>
                        <div className="row g-2 mb-3">
                          <div className="col-6 small text-muted">Farmer: <strong className="text-dark">{b.farmer?.name}</strong></div>
                          <div className="col-6 small text-muted">Price: <strong className="text-primary">₹{b.totalPrice?.toLocaleString()}</strong></div>
                          <div className="col-6 small text-muted">From: <strong className="text-dark">{new Date(b.startDate).toLocaleDateString()}</strong></div>
                          <div className="col-6 small text-muted">To: <strong className="text-dark">{new Date(b.endDate).toLocaleDateString()}</strong></div>
                        </div>
                        {b.status === 'approved' && (
                          <div className="mb-3">
                            <small className="text-muted fw-semibold d-block mb-2">Farming Progress</small>
                            <div className="d-flex">
                              {progressSteps.map((step, i) => (
                                <div key={step} className={`progress-step ${i === stepIdx ? 'active' : i < stepIdx ? 'done' : ''}`}>
                                  <div className="step-circle">{i + 1}</div>
                                  <div style={{ fontSize: '0.6rem' }}>{step.replace('_', ' ')}</div>
                                </div>
                              ))}
                            </div>
                          </div>
                        )}
                        <Link to={`/bookings/${b._id}`} className="btn btn-outline-primary btn-sm">View Details</Link>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
      </div>
    </>
  );
}
