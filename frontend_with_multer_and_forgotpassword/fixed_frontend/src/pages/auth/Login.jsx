import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { login as loginAPI } from '../../utils/api';
import { useAuth } from '../../context/AuthContext';

export default function Login() {
  const [form, setForm] = useState({ email: '', password: '' });
  const [loading, setLoading] = useState(false);
  const [showPass, setShowPass] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const { data } = await loginAPI(form);
      const loggedInUser = login(data);
      toast.success(`Welcome back, ${loggedInUser.name}!`);
      if (loggedInUser.role === 'admin') navigate('/admin/dashboard');
      else if (loggedInUser.role === 'farmer') navigate('/farmer/dashboard');
      else navigate('/dashboard');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Login failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-vh-100 d-flex align-items-center bg-light">
      <div className="container">
        <div className="row justify-content-center">
          <div className="col-md-5">
            <div className="card shadow border-0 rounded-4">
              <div className="card-body p-5">
                <div className="text-center mb-4">
                  <h2 className="fw-bold">🌱 <span className="text-primary">Himachal Agrorent</span></h2>
                  <p className="text-muted">Sign in to your account</p>
                </div>
                <form onSubmit={handleSubmit}>
                  <div className="mb-3">
                    <label className="form-label fw-semibold">Email Address</label>
                    <input type="email" className="form-control form-control-lg" placeholder="you@example.com"
                      value={form.email} onChange={e => setForm({ ...form, email: e.target.value })} required />
                  </div>
                  <div className="mb-1">
                    <label className="form-label fw-semibold">Password</label>
                    <div className="input-group">
                      <input
                        type={showPass ? 'text' : 'password'}
                        className="form-control form-control-lg"
                        placeholder="Enter your password"
                        value={form.password}
                        onChange={e => setForm({ ...form, password: e.target.value })}
                        required
                      />
                      <button type="button" className="btn btn-outline-secondary" onClick={() => setShowPass(!showPass)}>
                        <i className={`bi bi-eye${showPass ? '-slash' : ''}`}></i>
                      </button>
                    </div>
                  </div>
                  {/* Forgot password link */}
                  <div className="text-end mb-4">
                    <Link to="/forgot-password" className="text-muted small">Forgot password?</Link>
                  </div>
                  <button type="submit" className="btn btn-primary w-100 btn-lg fw-bold" disabled={loading}>
                    {loading ? <><span className="spinner-border spinner-border-sm me-2" />Signing in...</> : 'Sign In'}
                  </button>
                </form>
                <p className="text-center mt-4 mb-0 text-muted">
                  Don't have an account? <Link to="/register" className="text-primary fw-semibold">Register here</Link>
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
