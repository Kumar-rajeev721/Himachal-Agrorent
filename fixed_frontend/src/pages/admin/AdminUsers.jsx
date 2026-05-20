import React, { useEffect, useState } from 'react';
import { toast } from 'react-toastify';
import { getAllUsers, toggleUser } from '../../utils/api';

export default function AdminUsers() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all');

  useEffect(() => {
    getAllUsers().then(r => { setUsers(r.data); setLoading(false); }).catch(() => setLoading(false));
  }, []);

  const handleToggle = async (id) => {
    try {
      const { data } = await toggleUser(id);
      setUsers(users.map(u => u._id === id ? { ...u, isActive: data.user.isActive } : u));
      toast.success(data.message);
    } catch { toast.error('Failed to update user'); }
  };

  const filtered = filter === 'all' ? users : users.filter(u => u.role === filter);
  const roleColor = { admin: 'danger', farmer: 'warning', user: 'primary' };

  return (
    <>
      <div className="page-header">
        <div className="container"><h2 className="fw-bold mb-0">Manage Users</h2></div>
      </div>
      <div className="container py-4">
        <div className="d-flex gap-2 mb-4">
          {['all', 'user', 'farmer', 'admin'].map(f => (
            <button key={f} className={`btn btn-sm ${filter === f ? 'btn-primary' : 'btn-outline-secondary'}`} onClick={() => setFilter(f)}>
              {f.charAt(0).toUpperCase() + f.slice(1)}
            </button>
          ))}
        </div>
        {loading ? <div className="text-center py-5"><div className="spinner-border text-primary" /></div>
          : (
            <div className="card border-0 shadow-sm">
              <div className="table-responsive">
                <table className="table table-hover mb-0">
                  <thead className="table-agrorent"><tr><th>User</th><th>Role</th><th>Phone</th><th>Status</th><th>Action</th></tr></thead>
                  <tbody>
                    {filtered.map(u => (
                      <tr key={u._id}>
                        <td><div className="fw-semibold">{u.name}</div><small className="text-muted">{u.email}</small></td>
                        <td><span className={`badge bg-${roleColor[u.role]}`}>{u.role}</span></td>
                        <td>{u.phone || ''}</td>
                        <td><span className={`badge ${u.isActive ? 'bg-success' : 'bg-secondary'}`}>{u.isActive ? 'Active' : 'Inactive'}</span></td>
                        <td>
                          {u.role !== 'admin' && (
                            <button className={`btn btn-sm ${u.isActive ? 'btn-outline-danger' : 'btn-outline-success'}`} onClick={() => handleToggle(u._id)}>
                              {u.isActive ? 'Deactivate' : 'Activate'}
                            </button>
                          )}
                        </td>
                      </tr>
                    ))}
                    {filtered.length === 0 && <tr><td colSpan={5} className="text-center text-muted py-4">No users found</td></tr>}
                  </tbody>
                </table>
              </div>
            </div>
          )}
      </div>
    </>
  );
}

