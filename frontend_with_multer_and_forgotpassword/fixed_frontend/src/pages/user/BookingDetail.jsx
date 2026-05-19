// BookingDetail.js
import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { getBooking } from '../../utils/api';

export default function BookingDetail() {
  const { id } = useParams();
  const [booking, setBooking] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getBooking(id).then(r => { setBooking(r.data); setLoading(false); }).catch(() => setLoading(false));
  }, [id]);

  if (loading) return <div className="text-center py-5"><div className="spinner-border text-primary" /></div>;
  if (!booking) return <div className="text-center py-5"><h4>Booking not found</h4></div>;

  const steps = ['not_started', 'soil_prep', 'planting', 'growing', 'harvesting', 'completed'];
  const stepIdx = steps.indexOf(booking.farmingProgress);

  return (
    <>
      <div className="page-header">
        <div className="container"><h2 className="fw-bold">Booking Details</h2></div>
      </div>
      <div className="container py-4">
        <div className="row g-4">
          <div className="col-lg-8">
            <div className="card border-0 shadow-sm mb-4">
              <div className="card-body p-4">
                <div className="d-flex justify-content-between mb-3">
                  <h4 className="fw-bold">{booking.land?.title}</h4>
                  <span className={`badge badge-${booking.status} fs-6`}>{booking.status}</span>
                </div>
                <p className="text-muted"><i className="bi bi-geo-alt me-1"></i>{booking.land?.location}</p>
                <div className="row g-3">
                  <div className="col-6"><span className="text-muted small">Start Date</span><div className="fw-semibold">{new Date(booking.startDate).toLocaleDateString()}</div></div>
                  <div className="col-6"><span className="text-muted small">End Date</span><div className="fw-semibold">{new Date(booking.endDate).toLocaleDateString()}</div></div>
                  <div className="col-6"><span className="text-muted small">Total Price</span><div className="fw-bold text-primary">₹{booking.totalPrice?.toLocaleString()}</div></div>
                  <div className="col-6"><span className="text-muted small">Season</span><div className="fw-semibold">{booking.season?.name || 'N/A'}</div></div>
                </div>
                {booking.userMessage && <div className="mt-3 p-3 bg-light rounded"><strong>Your message:</strong><p className="mb-0 small">{booking.userMessage}</p></div>}
                {booking.farmerNote && <div className="mt-3 p-3 bg-warning bg-opacity-10 rounded"><strong>Farmer's note:</strong><p className="mb-0 small">{booking.farmerNote}</p></div>}
              </div>
            </div>
            {booking.status === 'approved' && (
              <div className="card border-0 shadow-sm mb-4">
                <div className="card-body p-4">
                  <h5 className="fw-bold mb-3">Farming Progress</h5>
                  <div className="d-flex justify-content-between mb-4">
                    {steps.map((step, i) => (
                      <div key={step} className={`progress-step ${i === stepIdx ? 'active' : i < stepIdx ? 'done' : ''}`}>
                        <div className="step-circle">{i < stepIdx ? '✓' : i + 1}</div>
                        <div style={{ fontSize: '0.65rem' }}>{step.replace(/_/g, ' ')}</div>
                      </div>
                    ))}
                  </div>
                  {booking.progressNotes?.length > 0 && (
                    <div>
                      <h6 className="fw-semibold">Progress Notes</h6>
                      {booking.progressNotes.map((n, i) => (
                        <div key={i} className="d-flex gap-2 mb-2">
                          <div className="bg-primary rounded-circle d-flex align-items-center justify-content-center text-white flex-shrink-0" style={{ width: 32, height: 32 }}>
                            <i className="bi bi-chat-text" style={{ fontSize: 12 }}></i>
                          </div>
                          <div className="bg-light rounded p-2 small flex-fill">
                            <div>{n.note}</div>
                            <div className="text-muted">{new Date(n.date).toLocaleDateString()}</div>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
          <div className="col-lg-4">
            <div className="card border-0 shadow-sm mb-4">
              <div className="card-body p-4">
                <h5 className="fw-bold mb-3">Farmer Info</h5>
                <div className="d-flex align-items-center mb-3">
                  <div className="bg-primary rounded-circle d-flex align-items-center justify-content-center text-white me-3" style={{ width: 44, height: 44 }}>
                    {booking.farmer?.name?.[0]}
                  </div>
                  <div>
                    <div className="fw-bold">{booking.farmer?.name}</div>
                    <div className="text-muted small">{booking.farmer?.email}</div>
                    <div className="text-muted small">{booking.farmer?.phone}</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
