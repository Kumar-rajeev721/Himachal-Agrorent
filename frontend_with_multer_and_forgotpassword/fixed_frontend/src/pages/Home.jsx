import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { getLands, getSeasons } from '../utils/api';

export default function Home() {
  const [lands, setLands] = useState([]);
  const [seasons, setSeasons] = useState([]);

  useEffect(() => {
    getLands({ available: true }).then(r => setLands(r.data.slice(0, 3))).catch(() => {});
    getSeasons().then(r => setSeasons(r.data)).catch(() => {});
  }, []);

  const features = [
    { icon: 'bi-geo-alt-fill', title: 'Find Land Easily', desc: 'Browse verified agricultural lands near you with detailed info.' },
    { icon: 'bi-calendar-check', title: 'Easy Bookings', desc: 'Book agricultural land and manage lease requests in one place.' },
    { icon: 'bi-shield-check', title: 'Verified Farmers', desc: 'All farmers and lands are admin-verified for trust and transparency.' },
    { icon: 'bi-graph-up', title: 'Track Progress', desc: 'Monitor farming progress in real-time from sowing to harvest.' },
  ];

  return (
    <>
      {/* Hero */}
      <div className="hero-section text-white">
        <div className="container">
          <div className="row align-items-center py-5">
            <div className="col-lg-6">
              <span className="badge bg-warning text-dark mb-3 px-3 py-2">🌾 Smart Farm Leasing</span>
              <h1 className="display-4 fw-bold mb-3">Lease Land.<br />Grow More.<br /><span className="text-warning">Earn Better.</span></h1>
              <p className="lead mb-4 opacity-75">Connect with verified farmers, book agricultural land, and manage your harvest journey with confidence.</p>
              <div className="d-flex gap-3 flex-wrap">
                <Link to="/lands" className="btn btn-warning btn-lg px-4 fw-bold">Browse Lands</Link>
                <Link to="/register" className="btn btn-outline-light btn-lg px-4">Join Free</Link>
              </div>
            </div>
            <div className="col-lg-6 d-none d-lg-flex justify-content-end">
              <div className="row g-3">
                {[
                  { num: '500+', label: 'Lands Listed' },
                  { num: '200+', label: 'Farmers' },
                  { num: '1000+', label: 'Happy Leasers' },
                  { num: '95%', label: 'Success Rate' },
                ].map((s, i) => (
                  <div key={i} className="col-6">
                    <div className="bg-white bg-opacity-10 rounded-3 p-3 text-center">
                      <h3 className="text-warning fw-bold mb-0">{s.num}</h3>
                      <small>{s.label}</small>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Features */}
      <div className="container py-5">
        <div className="text-center mb-5">
          <h2 className="fw-bold">Why Choose <span className="text-primary">Himachal Agrorent?</span></h2>
          <p className="text-muted">Everything you need for smart agricultural land leasing</p>
        </div>
        <div className="row g-4">
          {features.map((f, i) => (
            <div key={i} className="col-md-6 col-lg-3">
              <div className="card h-100 border-0 shadow-sm service-item text-center p-4">
                <i className={`bi ${f.icon} fs-1 text-primary mb-3`}></i>
                <h5 className="fw-bold">{f.title}</h5>
                <p className="text-muted small mb-0">{f.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Available Lands */}
      {lands.length > 0 && (
        <div className="bg-light py-5">
          <div className="container">
            <div className="d-flex justify-content-between align-items-center mb-4">
              <h2 className="fw-bold section-title">Available Lands</h2>
              <Link to="/lands" className="btn btn-outline-primary">View All -&gt;</Link>
            </div>
            <div className="row g-4">
              {lands.map(land => (
                <div key={land._id} className="col-md-4">
                  <div className="card land-card shadow-sm h-100">
                    <div className="bg-success bg-opacity-10 d-flex align-items-center justify-content-center" style={{ height: 180 }}>
                      <i className="bi bi-tree-fill text-success" style={{ fontSize: 60 }}></i>
                    </div>
                    <div className="card-body">
                      <h5 className="card-title fw-bold">{land.title}</h5>
                      <p className="text-muted small mb-2"><i className="bi bi-geo-alt me-1"></i>{land.location}</p>
                      <p className="text-muted small mb-2"><i className="bi bi-rulers me-1"></i>{land.area} acres</p>
                      <p className="fw-bold text-primary">Rs. {land.pricePerSeason?.toLocaleString()}/season</p>
                    </div>
                    <div className="card-footer bg-white border-0">
                      <Link to={`/lands/${land._id}`} className="btn btn-primary w-100">View Details</Link>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Seasons */}
      {seasons.length > 0 && (
        <div className="container py-5">
          <h2 className="fw-bold text-center mb-4">Farming Seasons</h2>
          <div className="row g-3 justify-content-center">
            {seasons.map((s, i) => (
              <div key={s._id} className="col-md-4">
                <div className={`card border-0 shadow-sm text-center p-4 ${i % 2 === 0 ? 'bg-primary text-white' : 'bg-warning'}`}>
                  <h4 className="fw-bold">{s.name}</h4>
                  <p className="small mb-1">Month {s.startMonth} - Month {s.endMonth}</p>
                  <p className="small mb-0">{s.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* CTA */}
      <div className="bg-primary text-white py-5 text-center">
        <div className="container">
          <h2 className="fw-bold mb-3">Ready to Start Farming Smarter?</h2>
          <p className="lead opacity-75 mb-4">Join thousands of farmers and land seekers on Himachal Agrorent today.</p>
          <Link to="/register" className="btn btn-warning btn-lg px-5 fw-bold">Get Started Free</Link>
        </div>
      </div>
    </>
  );
}

