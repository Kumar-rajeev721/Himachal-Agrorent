import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { register as registerAPI } from '../../utils/api';
import { useAuth } from '../../context/AuthContext';

export default function Register() {
  const [form, setForm] = useState({ name: '', email: '', password: '', role: 'user', phone: '', address: '' });
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const { data } = await registerAPI(form);
      const loggedInUser = login(data);
      toast.success('Account created successfully!');
      if (loggedInUser.role === 'farmer') navigate('/farmer/dashboard');
      else navigate('/dashboard');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Registration failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-vh-100 d-flex align-items-center bg-light py-5">
      <div className="container">
        <div className="row justify-content-center">
          <div className="col-md-6">
            <div className="card shadow border-0 rounded-4">
              <div className="card-body p-5">
                <div className="text-center mb-4">
                  <h2 className="fw-bold">🌱 Join <span className="text-primary">Himachal Agrorent</span></h2>
                  <p className="text-muted">Create your free account</p>
                </div>
                <form onSubmit={handleSubmit}>
                  <div className="mb-3">
                    <label className="form-label fw-semibold">I am a...</label>
                    <div className="d-flex gap-3">
                      {['user', 'farmer'].map(r => (
                        <div key={r} className={`flex-fill p-3 rounded-3 border text-center cursor-pointer ${form.role === r ? 'border-primary bg-primary bg-opacity-10' : ''}`}
                          style={{ cursor: 'pointer' }} onClick={() => setForm({ ...form, role: r })}>
                          <div className="fs-4">{r === 'user' ? '🧑‍💼' : '👨‍🌾'}</div>
                          <div className="fw-semibold text-capitalize">{r === 'user' ? 'Land Seeker' : 'Farmer'}</div>
                        </div>
                      ))}
                    </div>
                  </div>
                  <div className="mb-3">
                    <label className="form-label fw-semibold">Full Name</label>
                    <input type="text" className="form-control" placeholder="Your full name"
                      value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} required />
                  </div>
                  <div className="mb-3">
                    <label className="form-label fw-semibold">Email</label>
                    <input type="email" className="form-control" placeholder="you@example.com"
                      value={form.email} onChange={e => setForm({ ...form, email: e.target.value })} required />
                  </div>
                  <div className="mb-3">
                    <label className="form-label fw-semibold">Phone</label>
                    <input type="tel" className="form-control" placeholder="+91 98765 43210"
                      value={form.phone} onChange={e => setForm({ ...form, phone: e.target.value })} />
                  </div>
                  <div className="mb-3">
                    <label className="form-label fw-semibold">Address</label>
                    <input type="text" className="form-control" placeholder="City, State"
                      value={form.address} onChange={e => setForm({ ...form, address: e.target.value })} />
                  </div>
                  <div className="mb-4">
                    <label className="form-label fw-semibold">Password</label>
                    <input type="password" className="form-control" placeholder="Min. 6 characters"
                      value={form.password} onChange={e => setForm({ ...form, password: e.target.value })} required minLength={6} />
                  </div>
                  <button type="submit" className="btn btn-primary w-100 btn-lg fw-bold" disabled={loading}>
                    {loading ? <><span className="spinner-border spinner-border-sm me-2" />Creating Account...</> : 'Create Account'}
                  </button>
                </form>
                <p className="text-center mt-4 mb-0 text-muted">
                  Already have an account? <Link to="/login" className="text-primary fw-semibold">Sign in</Link>
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

