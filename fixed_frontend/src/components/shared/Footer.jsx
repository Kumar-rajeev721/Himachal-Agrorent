import React from 'react';
import { Link } from 'react-router-dom';

export default function Footer() {
  return (
    <footer className="agrorent-footer pt-5 pb-3 mt-5">
      <div className="container">
        <div className="row g-4">
          <div className="col-md-4">
            <h5 className="text-white fw-bold mb-3">🌱 Himachal Agrorent</h5>
            <p className="small">Connecting farmers and land seekers for a greener, more productive future.</p>
          </div>
          <div className="col-md-2">
            <h6 className="text-white mb-3">Quick Links</h6>
            <ul className="list-unstyled small">
              <li><Link to="/">Home</Link></li>
              <li><Link to="/lands">Browse Lands</Link></li>
              <li><Link to="/register">Register</Link></li>
            </ul>
          </div>
          <div className="col-md-3">
            <h6 className="text-white mb-3">For Farmers</h6>
            <ul className="list-unstyled small">
              <li><Link to="/register">Become a Farmer</Link></li>
              <li><Link to="/farmer/lands">Manage Lands</Link></li>
            </ul>
          </div>
          <div className="col-md-3">
            <h6 className="text-white mb-3">Contact</h6>
            <p className="small mb-1"><i className="bi bi-envelope me-2"></i>support@himachalagrorent.in</p>
            <p className="small mb-1"><i className="bi bi-telephone me-2"></i>+91 98765 43210</p>
            <p className="small"><i className="bi bi-geo-alt me-2"></i>Punjab, India</p>
          </div>
        </div>
        <hr className="border-secondary mt-4" />
        <p className="text-center small mb-0">© 2024 Himachal Agrorent. All rights reserved. Built with MERN Stack + Bootstrap 5</p>
      </div>
    </footer>
  );
}


