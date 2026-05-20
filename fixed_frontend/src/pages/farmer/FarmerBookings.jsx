import React, { useEffect, useState } from 'react';
import { toast } from 'react-toastify';
import { getFarmerBookings, updateBookingStatus, updateBookingProgress } from '../../utils/api';

export default function FarmerBookings() {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selected, setSelected] = useState(null);
  const [progressNote, setProgressNote] = useState('');
  const [newProgress, setNewProgress] = useState('');

  useEffect(() => {
    getFarmerBookings().then(r => { setBookings(r.data); setLoading(false); }).catch(() => setLoading(false));
  }, []);

  const handleStatus = async (id, status, farmerNote = '') => {
    try {
      const { data } = await updateBookingStatus(id, { status, farmerNote });
      setBookings(bookings.map(b => b._id === id ? { ...b, status: data.status } : b));
      toast.success(`Booking ${status}`);
    } catch { toast.error('Failed to update status'); }
  };

  const handleProgress = async (id) => {
    try {
      await updateBookingProgress(id, { farmingProgress: newProgress, note: progressNote });
      toast.success('Progress updated');
      setSelected(null);
      setProgressNote('');
      getFarmerBookings().then(r => setBookings(r.data));
    } catch { toast.error('Failed to update progress'); }
  };

  const progressSteps = ['not_started', 'soil_prep', 'planting', 'growing', 'harvesting', 'completed'];

  return (
    <>
      <div className="page-header">
        <div className="container"><h2 className="fw-bold mb-0">Manage Bookings</h2></div>
      </div>
      <div className="container py-4">
        {loading ? <div className="text-center py-5"><div className="spinner-border text-primary" /></div>
          : bookings.length === 0 ? (
            <div className="text-center py-5">
              <i className="bi bi-calendar-x text-muted" style={{ fontSize: 60 }}></i>
              <h4 className="mt-3">No booking requests yet</h4>
            </div>
          ) : (
            <div className="row g-4">
              {bookings.map(b => (
                <div key={b._id} className="col-lg-6">
                  <div className="card border-0 shadow-sm h-100">
                    <div className="card-body p-4">
                      <div className="d-flex justify-content-between mb-3">
                        <div>
                          <h5 className="fw-bold mb-1">{b.land?.title}</h5>
                          <p className="text-muted small mb-0">by {b.user?.name} · {b.user?.phone}</p>
                        </div>
                        <span className={`badge badge-${b.status} align-self-start`}>{b.status}</span>
                      </div>
                      <div className="row g-2 mb-3 small">
                        <div className="col-6 text-muted">From: <strong className="text-dark">{new Date(b.startDate).toLocaleDateString()}</strong></div>
                        <div className="col-6 text-muted">To: <strong className="text-dark">{new Date(b.endDate).toLocaleDateString()}</strong></div>
                        <div className="col-12 text-muted">Amount: <strong className="text-primary">₹{b.totalPrice?.toLocaleString()}</strong></div>
                      </div>
                      {b.userMessage && <div className="bg-light rounded p-2 small mb-3"><em>"{b.userMessage}"</em></div>}
                      
                      {b.status === 'pending' && (
                        <div className="d-flex gap-2">
                          <button className="btn btn-success btn-sm flex-fill" onClick={() => handleStatus(b._id, 'approved')}>
                            <i className="bi bi-check-lg me-1"></i>Approve
                          </button>
                          <button className="btn btn-danger btn-sm flex-fill" onClick={() => handleStatus(b._id, 'declined')}>
                            <i className="bi bi-x-lg me-1"></i>Decline
                          </button>
                        </div>
                      )}
                      {b.status === 'approved' && (
                        <div>
                          <div className="mb-2">
                            <small className="text-muted">Progress: <strong>{b.farmingProgress?.replace(/_/g, ' ')}</strong></small>
                          </div>
                          {selected === b._id ? (
                            <div>
                              <select className="form-select form-select-sm mb-2" value={newProgress} onChange={e => setNewProgress(e.target.value)}>
                                <option value="">Select progress stage</option>
                                {progressSteps.map(s => <option key={s} value={s}>{s.replace(/_/g, ' ')}</option>)}
                              </select>
                              <textarea className="form-control form-control-sm mb-2" rows={2} placeholder="Add a progress note..."
                                value={progressNote} onChange={e => setProgressNote(e.target.value)} />
                              <div className="d-flex gap-2">
                                <button className="btn btn-primary btn-sm" onClick={() => handleProgress(b._id)}>Update</button>
                                <button className="btn btn-outline-secondary btn-sm" onClick={() => setSelected(null)}>Cancel</button>
                              </div>
                            </div>
                          ) : (
                            <button className="btn btn-outline-primary btn-sm" onClick={() => { setSelected(b._id); setNewProgress(b.farmingProgress); }}>
                              <i className="bi bi-pencil me-1"></i>Update Progress
                            </button>
                          )}
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
      </div>
    </>
  );
}
