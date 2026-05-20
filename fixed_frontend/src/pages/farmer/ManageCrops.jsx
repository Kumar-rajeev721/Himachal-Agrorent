import React, { useEffect, useState } from 'react';
import { toast } from 'react-toastify';
import { getCrops, addCrop, getSeasons } from '../../utils/api';

export default function ManageCrops() {
  const [crops, setCrops] = useState([]);
  const [seasons, setSeasons] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({ name: '', description: '', season: '', growthPeriod: '', waterRequirement: 'medium' });

  useEffect(() => {
    getCrops().then(r => setCrops(r.data)).catch(() => {});
    getSeasons().then(r => setSeasons(r.data)).catch(() => {});
  }, []);

  const handleAdd = async (e) => {
    e.preventDefault();
    try {
      const { data } = await addCrop(form);
      setCrops([data, ...crops]);
      setShowForm(false);
      setForm({ name: '', description: '', season: '', growthPeriod: '', waterRequirement: 'medium' });
      toast.success('Crop added!');
    } catch { toast.error('Failed to add crop'); }
  };

  return (
    <>
      <div className="page-header">
        <div className="container d-flex justify-content-between align-items-center">
          <h2 className="fw-bold mb-0">Manage Crops</h2>
          <button className="btn btn-warning fw-bold" onClick={() => setShowForm(!showForm)}>
            <i className={`bi bi-${showForm ? 'x' : 'plus'}-lg me-2`}></i>{showForm ? 'Cancel' : 'Add Crop'}
          </button>
        </div>
      </div>
      <div className="container py-4">
        {showForm && (
          <div className="card border-0 shadow-sm mb-4">
            <div className="card-body p-4">
              <h5 className="fw-bold mb-3">Add New Crop</h5>
              <form onSubmit={handleAdd}>
                <div className="row g-3">
                  <div className="col-md-6">
                    <label className="form-label fw-semibold">Crop Name *</label>
                    <input type="text" className="form-control" value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} required placeholder="e.g. Wheat" />
                  </div>
                  <div className="col-md-6">
                    <label className="form-label fw-semibold">Season</label>
                    <select className="form-select" value={form.season} onChange={e => setForm({ ...form, season: e.target.value })}>
                      <option value="">Select season</option>
                      {seasons.map(s => <option key={s._id} value={s._id}>{s.name}</option>)}
                    </select>
                  </div>
                  <div className="col-md-4">
                    <label className="form-label fw-semibold">Growth Period (days)</label>
                    <input type="number" className="form-control" value={form.growthPeriod} onChange={e => setForm({ ...form, growthPeriod: e.target.value })} />
                  </div>
                  <div className="col-md-4">
                    <label className="form-label fw-semibold">Water Requirement</label>
                    <select className="form-select" value={form.waterRequirement} onChange={e => setForm({ ...form, waterRequirement: e.target.value })}>
                      <option value="low">Low</option>
                      <option value="medium">Medium</option>
                      <option value="high">High</option>
                    </select>
                  </div>
                  <div className="col-md-4">
                    <label className="form-label fw-semibold">Description</label>
                    <input type="text" className="form-control" value={form.description} onChange={e => setForm({ ...form, description: e.target.value })} />
                  </div>
                </div>
                <button type="submit" className="btn btn-primary mt-3">Add Crop</button>
              </form>
            </div>
          </div>
        )}
        <div className="row g-3">
          {crops.map(c => (
            <div key={c._id} className="col-md-4 col-lg-3">
              <div className="card border-0 shadow-sm text-center p-3 h-100">
                <div className="fs-2 mb-2">🌾</div>
                <h6 className="fw-bold">{c.name}</h6>
                {c.season && <span className="badge bg-success bg-opacity-10 text-success mb-1">{c.season.name}</span>}
                {c.growthPeriod && <p className="text-muted small mb-1">{c.growthPeriod} days</p>}
                <span className={`badge ${c.waterRequirement === 'high' ? 'bg-danger' : c.waterRequirement === 'medium' ? 'bg-warning text-dark' : 'bg-success'} bg-opacity-10 text-${c.waterRequirement === 'high' ? 'danger' : c.waterRequirement === 'medium' ? 'warning' : 'success'}`}>
                  💧 {c.waterRequirement}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </>
  );
}
