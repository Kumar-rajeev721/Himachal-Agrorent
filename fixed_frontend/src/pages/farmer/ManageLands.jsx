import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { toast } from 'react-toastify';
import { getMyLands, setLandAvailability } from '../../utils/api';

export default function ManageLands() {
  const [lands, setLands] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getMyLands().then(r => { setLands(r.data); setLoading(false); }).catch(() => setLoading(false));
  }, []);

  const toggleAvailability = async (id, current) => {
    try {
      await setLandAvailability(id, { isAvailable: !current });
      setLands(lands.map(l => l._id === id ? { ...l, isAvailable: !current } : l));
      toast.success('Availability updated');
    } catch { toast.error('Failed to update'); }
  };

  return (
    <>
      <div className="page-header">
        <div className="container d-flex justify-content-between align-items-center">
          <h2 className="fw-bold mb-0">My Lands</h2>
          <Link to="/farmer/lands/add" className="btn btn-warning fw-bold"><i className="bi bi-plus me-2"></i>Add Land</Link>
        </div>
      </div>
      <div className="container py-4">
        {loading ? <div className="text-center py-5"><div className="spinner-border text-primary" /></div>
          : lands.length === 0 ? (
            <div className="text-center py-5">
              <i className="bi bi-geo-alt text-muted" style={{ fontSize: 60 }}></i>
              <h4 className="mt-3">No lands added yet</h4>
              <Link to="/farmer/lands/add" className="btn btn-primary mt-2">Add Your First Land</Link>
            </div>
          ) : (
            <div className="card border-0 shadow-sm">
              <div className="table-responsive">
                <table className="table table-hover mb-0">
                  <thead className="table-agrorent">
                    <tr><th>Land</th><th>Area</th><th>Price/Season</th><th>Admin Status</th><th>Available</th><th>Actions</th></tr>
                  </thead>
                  <tbody>
                    {lands.map(l => (
                      <tr key={l._id}>
                        <td>
                          <div className="fw-semibold">{l.title}</div>
                          <small className="text-muted">{l.location}</small>
                        </td>
                        <td>{l.area} acres</td>
                        <td className="text-primary fw-semibold">Rs. {l.pricePerSeason?.toLocaleString()}</td>
                        <td><span className={`badge badge-${l.status}`}>{l.status}</span></td>
                        <td>
                          <div className="form-check form-switch">
                            <input className="form-check-input" type="checkbox" checked={l.isAvailable}
                              onChange={() => toggleAvailability(l._id, l.isAvailable)} disabled={l.status !== 'approved'} />
                          </div>
                        </td>
                        <td>
                          <Link to={`/lands/${l._id}`} className="btn btn-sm btn-outline-primary me-1">View</Link>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
      </div>
    </>
  );
}

