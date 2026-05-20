import React, { useEffect, useState } from 'react';
import { toast } from 'react-toastify';
import { getSeasons, addSeason, deleteSeason } from '../../utils/api';

export default function AdminSeasons() {
  const [seasons, setSeasons] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({ name: '', startMonth: '', endMonth: '', description: '' });

  useEffect(() => {
    getSeasons().then(r => setSeasons(r.data)).catch(() => {});
  }, []);

  const handleAdd = async (e) => {
    e.preventDefault();
    try {
      const { data } = await addSeason(form);
      setSeasons([...seasons, data]);
      setShowForm(false);
      setForm({ name: '', startMonth: '', endMonth: '', description: '' });
      toast.success('Season added!');
    } catch { toast.error('Failed to add season'); }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this season?')) return;
    try {
      await deleteSeason(id);
      setSeasons(seasons.filter(s => s._id !== id));
      toast.success('Season deleted');
    } catch { toast.error('Failed to delete'); }
  };

  const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

  return (
    <>
      <div className="page-header">
        <div className="container d-flex justify-content-between align-items-center">
          <h2 className="fw-bold mb-0">Define Seasons</h2>
          <button className="btn btn-warning fw-bold" onClick={() => setShowForm(!showForm)}>
            <i className={`bi bi-${showForm ? 'x' : 'plus'}-lg me-2`}></i>{showForm ? 'Cancel' : 'Add Season'}
          </button>
        </div>
      </div>
      <div className="container py-4">
        {showForm && (
          <div className="card border-0 shadow-sm mb-4">
            <div className="card-body p-4">
              <h5 className="fw-bold mb-3">Add Season</h5>
              <form onSubmit={handleAdd}>
                <div className="row g-3">
                  <div className="col-md-6">
                    <label className="form-label fw-semibold">Season Name *</label>
                    <input type="text" className="form-control" value={form.name}
                      onChange={e => setForm({ ...form, name: e.target.value })} required placeholder="e.g. Kharif, Rabi, Zaid" />
                  </div>
                  <div className="col-md-3">
                    <label className="form-label fw-semibold">Start Month</label>
                    <select className="form-select" value={form.startMonth} onChange={e => setForm({ ...form, startMonth: e.target.value })} required>
                      <option value="">Select</option>
                      {months.map((m, i) => <option key={i} value={i + 1}>{m}</option>)}
                    </select>
                  </div>
                  <div className="col-md-3">
                    <label className="form-label fw-semibold">End Month</label>
                    <select className="form-select" value={form.endMonth} onChange={e => setForm({ ...form, endMonth: e.target.value })} required>
                      <option value="">Select</option>
                      {months.map((m, i) => <option key={i} value={i + 1}>{m}</option>)}
                    </select>
                  </div>
                  <div className="col-12">
                    <label className="form-label fw-semibold">Description</label>
                    <input type="text" className="form-control" value={form.description}
                      onChange={e => setForm({ ...form, description: e.target.value })} placeholder="Brief description of this season" />
                  </div>
                </div>
                <button type="submit" className="btn btn-primary mt-3">Add Season</button>
              </form>
            </div>
          </div>
        )}

        <div className="row g-4">
          {seasons.length === 0 ? (
            <div className="col-12 text-center py-5 text-muted">
              <i className="bi bi-calendar-x fs-1"></i>
              <p className="mt-2">No seasons defined yet. Add your first season!</p>
            </div>
          ) : seasons.map(s => (
            <div key={s._id} className="col-md-4">
              <div className="card border-0 shadow-sm h-100">
                <div className="card-body p-4 text-center">
                  <div className="fs-1 mb-2">🌾</div>
                  <h5 className="fw-bold">{s.name}</h5>
                  <p className="text-muted small">{months[s.startMonth - 1]} – {months[s.endMonth - 1]}</p>
                  {s.description && <p className="text-muted small">{s.description}</p>}
                  <button className="btn btn-sm btn-outline-danger" onClick={() => handleDelete(s._id)}>Delete</button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </>
  );
}
