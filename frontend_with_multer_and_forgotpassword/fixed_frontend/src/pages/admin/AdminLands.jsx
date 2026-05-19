import React, { useEffect, useState } from 'react';
import { toast } from 'react-toastify';
import { getAllLands, approveLand } from '../../utils/api';

export default function AdminLands() {
  const [lands, setLands] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all');
  const [noteId, setNoteId] = useState(null);
  const [note, setNote] = useState('');

  useEffect(() => {
    getAllLands().then(r => { setLands(r.data); setLoading(false); }).catch(() => setLoading(false));
  }, []);

  const handleApprove = async (id, status) => {
    try {
      await approveLand(id, { status, adminNote: note });
      setLands(lands.map(l => l._id === id ? { ...l, status } : l));
      toast.success(`Land ${status}`);
      setNoteId(null); setNote('');
    } catch { toast.error('Action failed'); }
  };

  const filtered = filter === 'all' ? lands : lands.filter(l => l.status === filter);

  return (
    <>
      <div className="page-header">
        <div className="container"><h2 className="fw-bold mb-0">Manage Lands</h2></div>
      </div>
      <div className="container py-4">
        <div className="d-flex gap-2 mb-4">
          {['all', 'pending', 'approved', 'rejected'].map(f => (
            <button key={f} className={`btn btn-sm ${filter === f ? 'btn-primary' : 'btn-outline-secondary'}`} onClick={() => setFilter(f)}>
              {f.charAt(0).toUpperCase() + f.slice(1)} {f !== 'all' && `(${lands.filter(l => l.status === f).length})`}
            </button>
          ))}
        </div>
        {loading ? <div className="text-center py-5"><div className="spinner-border text-primary" /></div>
          : (
            <div className="card border-0 shadow-sm">
              <div className="table-responsive">
                <table className="table table-hover mb-0">
                  <thead className="table-agrorent">
                    <tr><th>Land</th><th>Farmer</th><th>Area</th><th>Price</th><th>Status</th><th>Actions</th></tr>
                  </thead>
                  <tbody>
                    {filtered.map(l => (
                      <React.Fragment key={l._id}>
                        <tr>
                          <td><div className="fw-semibold">{l.title}</div><small className="text-muted">{l.location}</small></td>
                          <td>{l.farmer?.name}<div className="text-muted small">{l.farmer?.email}</div></td>
                          <td>{l.area} ac</td>
                          <td className="text-primary fw-semibold">Rs. {l.pricePerSeason?.toLocaleString()}</td>
                          <td><span className={`badge badge-${l.status}`}>{l.status}</span></td>
                          <td>
                            {l.status === 'pending' && (
                              <div className="d-flex gap-1">
                                <button className="btn btn-sm btn-success" onClick={() => handleApprove(l._id, 'approved')}>Approve</button>
                                <button className="btn btn-sm btn-danger" onClick={() => setNoteId(l._id)}>Reject</button>
                              </div>
                            )}
                            {l.status !== 'pending' && <span className="text-muted small">-</span>}
                          </td>
                        </tr>
                        {noteId === l._id && (
                          <tr>
                            <td colSpan={6} className="bg-light">
                              <div className="d-flex gap-2 p-2">
                                <input className="form-control form-control-sm" placeholder="Rejection reason..." value={note} onChange={e => setNote(e.target.value)} />
                                <button className="btn btn-danger btn-sm" onClick={() => handleApprove(l._id, 'rejected')}>Confirm Reject</button>
                                <button className="btn btn-outline-secondary btn-sm" onClick={() => setNoteId(null)}>Cancel</button>
                              </div>
                            </td>
                          </tr>
                        )}
                      </React.Fragment>
                    ))}
                    {filtered.length === 0 && (
                      <tr><td colSpan={6} className="text-center text-muted py-4">No lands found</td></tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          )}
      </div>
    </>
  );
}

