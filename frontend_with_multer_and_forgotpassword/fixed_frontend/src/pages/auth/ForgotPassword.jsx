import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { toast } from 'react-toastify';
import API from '../../utils/api';

export default function ForgotPassword() {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await API.post('/auth/forgot-password', { email });
      setSent(true);
    } catch (err) {
      toast.error(err.response?.data?.message || 'Something went wrong. Please try again.');
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
                  <div style={{ fontSize: 48 }}>🔑</div>
                  <h2 className="fw-bold mt-2">Forgot Password?</h2>
                  <p className="text-muted">Enter your email and we'll send you a reset link.</p>
                </div>

                {sent ? (
                  <div className="text-center">
                    <div className="alert alert-success rounded-3">
                      <i className="bi bi-envelope-check-fill me-2 fs-5"></i>
                      <strong>Check your inbox!</strong>
                      <p className="mb-0 mt-1 small">
                        A password reset link has been sent to <strong>{email}</strong>. It expires in 15 minutes.
                      </p>
                    </div>
                    <p className="text-muted small mt-3">Didn't receive it? Check your spam folder.</p>
                    <button
                      className="btn btn-outline-primary mt-2"
                      onClick={() => { setSent(false); setEmail(''); }}
                    >
                      Try a different email
                    </button>
                  </div>
                ) : (
                  <form onSubmit={handleSubmit}>
                    <div className="mb-4">
                      <label className="form-label fw-semibold">Email Address</label>
                      <input
                        type="email"
                        className="form-control form-control-lg"
                        placeholder="you@example.com"
                        value={email}
                        onChange={e => setEmail(e.target.value)}
                        required
                      />
                    </div>
                    <button
                      type="submit"
                      className="btn btn-primary w-100 btn-lg fw-bold"
                      disabled={loading}
                    >
                      {loading
                        ? <><span className="spinner-border spinner-border-sm me-2" />Sending...</>
                        : 'Send Reset Link'
                      }
                    </button>
                  </form>
                )}

                <p className="text-center mt-4 mb-0 text-muted">
                  Remember your password?{' '}
                  <Link to="/login" className="text-primary fw-semibold">Sign in</Link>
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
