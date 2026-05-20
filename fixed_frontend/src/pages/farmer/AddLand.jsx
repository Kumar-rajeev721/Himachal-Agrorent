import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { getSeasons } from '../../utils/api';
import { useAuth } from '../../context/AuthContext';
import API from '../../utils/api';

export default function AddLand() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [seasons, setSeasons] = useState([]);
  const [loading, setLoading] = useState(false);
  const [imageFiles, setImageFiles] = useState([]);
  const [imagePreviews, setImagePreviews] = useState([]);
  const [form, setForm] = useState({
    title: '', description: '', location: '', area: '', pricePerSeason: '',
    soilType: '', waterSource: '', season: '', amenities: ''
  });

  useEffect(() => { getSeasons().then(r => setSeasons(r.data)).catch(() => {}); }, []);

  const handleImages = (e) => {
    const files = Array.from(e.target.files);
    if (files.length > 5) { toast.error('Max 5 images allowed'); return; }
    setImageFiles(files);
    setImagePreviews(files.map(f => URL.createObjectURL(f)));
  };

  const removeImage = (idx) => {
    const newFiles = imageFiles.filter((_, i) => i !== idx);
    const newPreviews = imagePreviews.filter((_, i) => i !== idx);
    setImageFiles(newFiles);
    setImagePreviews(newPreviews);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!user?.token) { toast.error('Please log in again.'); navigate('/login'); return; }

    setLoading(true);
    try {
      const formData = new FormData();
      // Append text fields
      Object.entries(form).forEach(([key, val]) => {
        if (val) formData.append(key, val);
      });
      // Append image files
      imageFiles.forEach(file => formData.append('images', file));

      await API.post('/lands', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });

      toast.success('Land submitted for admin approval!');
      navigate('/farmer/lands');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to add land');
    } finally { setLoading(false); }
  };

  const f = (field, label, type = 'text', opts = {}) => (
    <div className={opts.col || 'col-md-6'}>
      <label className="form-label fw-semibold">{label}</label>
      <input type={type} className="form-control" value={form[field]}
        onChange={e => setForm({ ...form, [field]: e.target.value })} {...opts} />
    </div>
  );

  return (
    <>
      <div className="page-header">
        <div className="container"><h2 className="fw-bold mb-0">Add New Land</h2></div>
      </div>
      <div className="container py-4">
        <div className="row justify-content-center">
          <div className="col-lg-9">
            <div className="card border-0 shadow-sm">
              <div className="card-body p-5">
                <form onSubmit={handleSubmit}>
                  <h5 className="fw-bold mb-4 text-primary">Basic Information</h5>
                  <div className="row g-3 mb-4">
                    {f('title', 'Land Title *', 'text', { col: 'col-12', required: true, placeholder: 'e.g. 5-Acre Loamy Farm near Ludhiana' })}
                    {f('location', 'Location *', 'text', { required: true, placeholder: 'City, District, State' })}
                    {f('area', 'Area (acres) *', 'number', { required: true, min: 0.1, step: 0.1 })}
                    {f('pricePerSeason', 'Price per Season ₹ *', 'number', { required: true, min: 1 })}
                    <div className="col-md-6">
                      <label className="form-label fw-semibold">Season</label>
                      <select className="form-select" value={form.season} onChange={e => setForm({ ...form, season: e.target.value })}>
                        <option value="">Select season</option>
                        {seasons.map(s => <option key={s._id} value={s._id}>{s.name}</option>)}
                      </select>
                    </div>
                    <div className="col-md-6">
                      <label className="form-label fw-semibold">Soil Type</label>
                      <select className="form-select" value={form.soilType} onChange={e => setForm({ ...form, soilType: e.target.value })}>
                        <option value="">Select type</option>
                        {['Loamy', 'Sandy', 'Clay', 'Black', 'Red', 'Alluvial'].map(s => <option key={s}>{s}</option>)}
                      </select>
                    </div>
                    {f('waterSource', 'Water Source', 'text', { placeholder: 'e.g. Borewell, Canal, River' })}
                    {f('amenities', 'Amenities (comma separated)', 'text', { placeholder: 'e.g. Storage shed, Electricity, Road access' })}
                    <div className="col-12">
                      <label className="form-label fw-semibold">Description</label>
                      <textarea className="form-control" rows={4} placeholder="Describe your land, its history, suitability..."
                        value={form.description} onChange={e => setForm({ ...form, description: e.target.value })} />
                    </div>
                  </div>

                  {/* ── Image Upload Section ── */}
                  <h5 className="fw-bold mb-3 text-primary">Land Photos</h5>
                  <div className="mb-4">
                    <label className="form-label fw-semibold">Upload Images <span className="text-muted fw-normal">(max 5, each up to 5MB)</span></label>
                    <input
                      type="file"
                      className="form-control"
                      accept="image/jpeg,image/png,image/webp"
                      multiple
                      onChange={handleImages}
                    />
                    <div className="form-text">JPG, PNG or WebP format only.</div>

                    {/* Image Previews */}
                    {imagePreviews.length > 0 && (
                      <div className="d-flex flex-wrap gap-2 mt-3">
                        {imagePreviews.map((src, i) => (
                          <div key={i} className="position-relative">
                            <img
                              src={src}
                              alt={`preview-${i}`}
                              style={{ width: 110, height: 85, objectFit: 'cover', borderRadius: 8, border: '2px solid #dee2e6' }}
                            />
                            <button
                              type="button"
                              onClick={() => removeImage(i)}
                              className="btn btn-danger btn-sm position-absolute top-0 end-0 p-0"
                              style={{ width: 22, height: 22, fontSize: 11, borderRadius: '50%', lineHeight: 1 }}
                            >
                              ✕
                            </button>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                  {/* ──────────────────────── */}

                  <div className="alert alert-info small">
                    <i className="bi bi-info-circle me-2"></i>
                    Your land will be reviewed by admin before being listed publicly. This usually takes 1-2 business days.
                  </div>
                  <div className="d-flex gap-3">
                    <button type="submit" className="btn btn-primary px-5 fw-bold" disabled={loading}>
                      {loading ? <><span className="spinner-border spinner-border-sm me-2" />Submitting...</> : 'Submit for Approval'}
                    </button>
                    <button type="button" className="btn btn-outline-secondary" onClick={() => navigate('/farmer/lands')}>Cancel</button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
