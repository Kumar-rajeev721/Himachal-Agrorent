import React, { useEffect, useState } from 'react';
import { toast } from 'react-toastify';
import { getCrops, deleteCrop } from '../../utils/api';

export default function AdminCrops() {
  const [crops, setCrops] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getCrops().then(r => { setCrops(r.data); setLoading(false); }).catch(() => setLoading(false));
  }, []);

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this crop?')) return;
    try {
      await deleteCrop(id);
      setCrops(crops.filter(c => c._id !== id));
      toast.success('Crop deleted');
    } catch { toast.error('Failed to delete'); }
  };

  return (
    <>
      <div className="page-header">
        <div className="container"><h2 className="fw-bold mb-0">Manage Crops</h2></div>
      </div>
      <div className="container py-4">
        {loading ? <div className="text-center py-5"><div className="spinner-border text-primary" /></div>
          : (
            <div className="card border-0 shadow-sm">
              <div className="table-responsive">
                <table className="table table-hover mb-0">
                  <thead className="table-agrorent"><tr><th>Crop</th><th>Season</th><th>Growth Period</th><th>Water</th><th>Added By</th><th>Action</th></tr></thead>
                  <tbody>
                    {crops.map(c => (
                      <tr key={c._id}>
                        <td><div className="fw-semibold">🌾 {c.name}</div>{c.description && <small className="text-muted">{c.description}</small>}</td>
                        <td>{c.season?.name || ''}</td>
                        <td>{c.growthPeriod ? `${c.growthPeriod} days` : ''}</td>
                        <td><span className={`badge ${c.waterRequirement === 'high' ? 'bg-danger' : c.waterRequirement === 'medium' ? 'bg-warning text-dark' : 'bg-success'}`}>{c.waterRequirement}</span></td>
                        <td>{c.addedBy?.name || 'System'}</td>
                        <td><button className="btn btn-sm btn-outline-danger" onClick={() => handleDelete(c._id)}>Delete</button></td>
                      </tr>
                    ))}
                    {crops.length === 0 && <tr><td colSpan={6} className="text-center text-muted py-4">No crops found</td></tr>}
                  </tbody>
                </table>
              </div>
            </div>
          )}
      </div>
    </>
  );
}

