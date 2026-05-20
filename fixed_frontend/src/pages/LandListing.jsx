import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { getLands, getSeasons } from '../utils/api';

export default function LandListing() {
  const [lands, setLands] = useState([]);
  const [seasons, setSeasons] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({ location: '', season: '', available: '' });

  const fetchLands = async () => {
    setLoading(true);
    try {
      const params = {};
      if (filters.location) params.location = filters.location;
      if (filters.season) params.season = filters.season;
      if (filters.available) params.available = filters.available;
      const { data } = await getLands(params);
      setLands(data);
    } catch { setLands([]); }
    setLoading(false);
  };

  useEffect(() => { fetchLands(); }, []);
  useEffect(() => { getSeasons().then(r => setSeasons(r.data)).catch(() => {}); }, []);

  return (
    <>
      <div className="page-header">
        <div className="container">
          <h1 className="fw-bold mb-1">Browse Agricultural Lands</h1>
          <p className="mb-0 opacity-75">Find and lease the perfect land for your farming needs</p>
        </div>
      </div>

      <div className="container py-4">
        {/* Filters */}
        <div className="card border-0 shadow-sm mb-4">
          <div className="card-body">
            <div className="row g-3 align-items-end">
              <div className="col-md-4">
                <label className="form-label fw-semibold">Location</label>
                <input type="text" className="form-control" placeholder="Search by city/district..."
                  value={filters.location} onChange={e => setFilters({ ...filters, location: e.target.value })} />
              </div>
              <div className="col-md-3">
                <label className="form-label fw-semibold">Season</label>
                <select className="form-select" value={filters.season} onChange={e => setFilters({ ...filters, season: e.target.value })}>
                  <option value="">All Seasons</option>
                  {seasons.map(s => <option key={s._id} value={s._id}>{s.name}</option>)}
                </select>
              </div>
              <div className="col-md-3">
                <label className="form-label fw-semibold">Availability</label>
                <select className="form-select" value={filters.available} onChange={e => setFilters({ ...filters, available: e.target.value })}>
                  <option value="">All Lands</option>
                  <option value="true">Available Only</option>
                </select>
              </div>
              <div className="col-md-2">
                <button className="btn btn-primary w-100" onClick={fetchLands}>
                  <i className="bi bi-search me-1"></i>Search
                </button>
              </div>
            </div>
          </div>
        </div>

        {loading ? (
          <div className="text-center py-5"><div className="spinner-border text-primary" /></div>
        ) : lands.length === 0 ? (
          <div className="text-center py-5">
            <i className="bi bi-tree text-muted" style={{ fontSize: 60 }}></i>
            <h4 className="mt-3 text-muted">No lands found</h4>
            <p className="text-muted">Try adjusting your filters</p>
          </div>
        ) : (
          <div className="row g-4">
            {lands.map(land => (
              <div key={land._id} className="col-md-6 col-lg-4">
                <div className="card land-card shadow-sm h-100">
                  <div className="position-relative" style={{ height: 190, overflow: 'hidden' }}>
                    {land.images && land.images.length > 0 ? (
                      <img
                        src={`http://localhost:5000${land.images[0]}`}
                        alt={land.title}
                        style={{ width: '100%', height: 190, objectFit: 'cover' }}
                      />
                    ) : (
                      <div className="bg-success bg-opacity-10 d-flex align-items-center justify-content-center" style={{ height: 190 }}>
                        <i className="bi bi-tree-fill text-success" style={{ fontSize: 64 }}></i>
                      </div>
                    )}
                    {land.isAvailable && <span className="badge bg-success position-absolute top-0 end-0 m-2">Available</span>}
                    {!land.isAvailable && <span className="badge bg-secondary position-absolute top-0 end-0 m-2">Booked</span>}
                  </div>
                  <div className="card-body">
                    <h5 className="card-title fw-bold">{land.title}</h5>
                    <p className="text-muted small mb-1"><i className="bi bi-geo-alt me-1"></i>{land.location}</p>
                    <p className="text-muted small mb-1"><i className="bi bi-rulers me-1"></i>{land.area} acres</p>
                    {land.soilType && <p className="text-muted small mb-1"><i className="bi bi-layers me-1"></i>{land.soilType}</p>}
                    {land.season && <p className="text-muted small mb-2"><i className="bi bi-calendar me-1"></i>{land.season.name}</p>}
                    <p className="fw-bold text-primary fs-5 mb-0">₹{land.pricePerSeason?.toLocaleString()}<span className="text-muted fs-6 fw-normal">/season</span></p>
                  </div>
                  <div className="card-footer bg-white border-0 pt-0">
                    <div className="d-flex gap-2">
                      <Link to={`/lands/${land._id}`} className="btn btn-primary flex-fill">View Details</Link>
                      {land.isAvailable && <Link to={`/lands/${land._id}`} className="btn btn-outline-success">Book</Link>}
                    </div>
                    <p className="text-muted small mt-2 mb-0"><i className="bi bi-person me-1"></i>By {land.farmer?.name}</p>
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
