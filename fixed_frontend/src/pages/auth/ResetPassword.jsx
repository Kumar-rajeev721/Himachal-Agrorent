import React, { useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { toast } from 'react-toastify';
import API from '../../utils/api';

export default function ResetPassword() {
  const { token } = useParams();
  const navigate = useNavigate();
  const [form, setForm] = useState({ password: '', confirm: '' });
  const [loading, setLoading] = useState(false);
  const [showPass, setShowPass] = useState(false);
  const [done, setDone] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (form.password !== form.confirm) {
      toast.error('Passwords do not match');
      return;
    }
    if (form.password.length < 6) {
      toast.error('Password must be at least 6 characters');
      return;
    }
    setLoading(true);
    try {
      await API.post(`/auth/reset-password/${token}`, { password: form.password });
      setDone(true);
      toast.success('Password reset successful!');
      setTimeout(() => navigate('/login'), 3000);
    } catch (err) {
      toast.error(err.response?.data?.message || 'Reset failed. The link may have expired.');
    } finally {
      setLoading(false);
    }
  };

  const strength = (p) => {
    if (!p) return { label: '', color: '' };
    if (p.length < 6) return { label: 'Too short', color: 'danger' };
    if (p.length < 8) return { label: 'Weak', color: 'warning' };
    if (/[A-Z]/.test(p) && /[0-9]/.test(p)) return { label: 'Strong', color: 'success' };
    return { label: 'Fair', color: 'info' };
  };
  const s = strength(form.password);

  return (
    <div className="min-vh-100 d-flex align-items-center bg-light">
      <div className="container">
        <div className="row justify-content-center">
          <div className="col-md-5">
            <div className="card shadow border-0 rounded-4">
              <div className="card-body p-5">
                <div className="text-center mb-4">
                  <div style={{ fontSize: 48 }}>🔒</div>
                  <h2 className="fw-bold mt-2">Set New Password</h2>
                  <p className="text-muted">Choose a strong password for your account.</p>
                </div>

                {done ? (
                  <div className="text-center">
                    <div className="alert alert-success rounded-3">
                      <i className="bi bi-check-circle-fill me-2 fs-5"></i>
                      <strong>Password updated!</strong>
                      <p className="mb-0 mt-1 small">Redirecting you to login...</p>
                    </div>
                    <Link to="/login" className="btn btn-primary mt-3">Go to Login</Link>
                  </div>
                ) : (
                  <form onSubmit={handleSubmit}>
                    <div className="mb-3">
                      <label className="form-label fw-semibold">New Password</label>
                      <div className="input-group">
                        <input
                          type={showPass ? 'text' : 'password'}
                          className="form-control form-control-lg"
                          placeholder="Min 6 characters"
                          value={form.password}
                          onChange={e => setForm({ ...form, password: e.target.value })}
                          required
                        />
                        <button
                          type="button"
                          className="btn btn-outline-secondary"
                          onClick={() => setShowPass(!showPass)}
                        >
                          <i className={`bi bi-eye${showPass ? '-slash' : ''}`}></i>
                        </button>
                      </div>
                      {form.password && (
                        <div className={`mt-1 small text-${s.color}`}>
                          <i className="bi bi-shield-fill me-1"></i>Strength: {s.label}
                        </div>
                      )}
                    </div>

                    <div className="mb-4">
                      <label className="form-label fw-semibold">Confirm Password</label>
                      <input
                        type={showPass ? 'text' : 'password'}
                        className="form-control form-control-lg"
                        placeholder="Re-enter your password"
                        value={form.confirm}
                        onChange={e => setForm({ ...form, confirm: e.target.value })}
                        required
                      />
                      {form.confirm && form.password !== form.confirm && (
                        <div className="mt-1 small text-danger">
                          <i className="bi bi-x-circle me-1"></i>Passwords don't match
                        </div>
                      )}
                      {form.confirm && form.password === form.confirm && (
                        <div className="mt-1 small text-success">
                          <i className="bi bi-check-circle me-1"></i>Passwords match
                        </div>
                      )}
                    </div>

                    <button
                      type="submit"
                      className="btn btn-primary w-100 btn-lg fw-bold"
                      disabled={loading}
                    >
                      {loading
                        ? <><span className="spinner-border spinner-border-sm me-2" />Resetting...</>
                        : 'Reset Password'
                      }
                    </button>
                  </form>
                )}

                <p className="text-center mt-4 mb-0 text-muted">
                  <Link to="/login" className="text-primary fw-semibold">← Back to Login</Link>
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
