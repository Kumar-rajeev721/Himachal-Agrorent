import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { getLand, getSeasons, getRazorpayKey, createPaymentOrder, verifyPayment } from '../utils/api';
import { useAuth } from '../context/AuthContext';

// Load Razorpay script dynamically
const loadRazorpayScript = () =>
  new Promise((resolve) => {
    if (document.getElementById('razorpay-script')) return resolve(true);
    const script = document.createElement('script');
    script.id = 'razorpay-script';
    script.src = 'https://checkout.razorpay.com/v1/checkout.js';
    script.onload = () => resolve(true);
    script.onerror = () => resolve(false);
    document.body.appendChild(script);
  });

export default function LandDetail() {
  const { id } = useParams();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [land, setLand] = useState(null);
  const [seasons, setSeasons] = useState([]);
  const [loading, setLoading] = useState(true);
  const [paymentLoading, setPaymentLoading] = useState(false);
  const [booking, setBooking] = useState({
    startDate: '',
    endDate: '',
    userMessage: '',
    season: '',
  });

  useEffect(() => {
    getLand(id).then(r => { setLand(r.data); setLoading(false); }).catch(() => setLoading(false));
    getSeasons().then(r => setSeasons(r.data)).catch(() => {});
  }, [id]);

  // Calculate price preview
  const calcPrice = () => {
    if (!booking.startDate || !booking.endDate || !land) return null;
    const days = Math.ceil((new Date(booking.endDate) - new Date(booking.startDate)) / (1000 * 60 * 60 * 24));
    if (days <= 0) return null;
    return Math.ceil((days / 90) * land.pricePerSeason);
  };

  const handlePayAndBook = async (e) => {
    e.preventDefault();
    if (!user) { navigate('/login'); return; }
    if (user.role !== 'user') { toast.error('Only land seekers can book lands'); return; }
    if (!booking.startDate || !booking.endDate) { toast.error('Please select start and end dates'); return; }

    setPaymentLoading(true);

    try {
      // Step 1: Load Razorpay script
      const loaded = await loadRazorpayScript();
      if (!loaded) {
        toast.error('Failed to load payment gateway. Check your internet connection.');
        setPaymentLoading(false);
        return;
      }

      // Step 2: Create order on backend
      const { data: orderData } = await createPaymentOrder({
        landId: id,
        startDate: booking.startDate,
        endDate: booking.endDate,
        userMessage: booking.userMessage,
        season: booking.season || undefined,
      });

      // Step 3: Get Razorpay public key
      const { data: keyData } = await getRazorpayKey();

      // Step 4: Open Razorpay checkout popup
      const options = {
        key: keyData.key,
        amount: orderData.amount,
        currency: orderData.currency,
        name: 'Himachal Agrorent',
        description: `Booking: ${land.title}`,
        order_id: orderData.order_id,
        handler: async (response) => {
          // Step 5: Verify payment on backend → creates booking
          try {
            const { data: verifyData } = await verifyPayment({
              razorpay_order_id: response.razorpay_order_id,
              razorpay_payment_id: response.razorpay_payment_id,
              razorpay_signature: response.razorpay_signature,
              landId: id,
              startDate: booking.startDate,
              endDate: booking.endDate,
              userMessage: booking.userMessage,
              season: booking.season || undefined,
              totalPrice: orderData.totalPrice,
            });

            if (verifyData.success) {
              toast.success('🎉 Payment successful! Booking request sent to farmer.');
              navigate('/my-bookings');
            }
          } catch (err) {
            toast.error(err.response?.data?.message || 'Payment verification failed');
          }
          setPaymentLoading(false);
        },
        prefill: {
          name: user.name,
          email: user.email,
          contact: user.phone || '',
        },
        theme: { color: '#198754' },
        modal: {
          ondismiss: () => {
            toast.info('Payment cancelled');
            setPaymentLoading(false);
          },
        },
      };

      const rzp = new window.Razorpay(options);
      rzp.on('payment.failed', (response) => {
        toast.error(`Payment failed: ${response.error.description}`);
        setPaymentLoading(false);
      });
      rzp.open();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Something went wrong. Please try again.');
      setPaymentLoading(false);
    }
  };

  if (loading) return <div className="text-center py-5"><div className="spinner-border text-primary" /></div>;
  if (!land) return <div className="text-center py-5"><h4>Land not found</h4></div>;

  const estimatedPrice = calcPrice();

  return (
    <>
      <div className="page-header">
        <div className="container">
          <nav aria-label="breadcrumb">
            <ol className="breadcrumb mb-2">
              <li className="breadcrumb-item"><a href="/lands" className="text-white-50">Lands</a></li>
              <li className="breadcrumb-item active text-white">{land.title}</li>
            </ol>
          </nav>
          <h1 className="fw-bold mb-1">{land.title}</h1>
          <p className="mb-0 opacity-75"><i className="bi bi-geo-alt me-1"></i>{land.location}</p>
        </div>
      </div>

      <div className="container py-5">
        <div className="row g-4">
          <div className="col-lg-8">
            {/* Land Image */}
            {land.images && land.images.length > 0 ? (
              <div className="mb-4">
                <img
                  src={`http://localhost:5000${land.images[0]}`}
                  alt={land.title}
                  className="rounded-3 w-100"
                  style={{ height: 300, objectFit: 'cover' }}
                />
                {land.images.length > 1 && (
                  <div className="d-flex gap-2 mt-2 flex-wrap">
                    {land.images.slice(1).map((img, i) => (
                      <img
                        key={i}
                        src={`http://localhost:5000${img}`}
                        alt={`land-${i + 1}`}
                        className="rounded"
                        style={{ height: 80, width: 110, objectFit: 'cover' }}
                      />
                    ))}
                  </div>
                )}
              </div>
            ) : (
              <div className="bg-success bg-opacity-10 rounded-3 d-flex align-items-center justify-content-center mb-4" style={{ height: 300 }}>
                <i className="bi bi-tree-fill text-success" style={{ fontSize: 100 }}></i>
              </div>
            )}

            {/* Details */}
            <div className="card border-0 shadow-sm mb-4">
              <div className="card-body p-4">
                <h4 className="fw-bold mb-3">Land Details</h4>
                <div className="row g-3">
                  {[
                    { label: 'Area', value: `${land.area} acres`, icon: 'bi-rulers' },
                    { label: 'Soil Type', value: land.soilType || 'N/A', icon: 'bi-layers' },
                    { label: 'Water Source', value: land.waterSource || 'N/A', icon: 'bi-droplet' },
                    { label: 'Season', value: land.season?.name || 'All seasons', icon: 'bi-calendar' },
                    { label: 'Price/Season', value: `Rs. ${land.pricePerSeason?.toLocaleString()}`, icon: 'bi-currency-rupee' },
                    { label: 'Status', value: land.isAvailable ? 'Available' : 'Not Available', icon: 'bi-check-circle' },
                  ].map((d, i) => (
                    <div key={i} className="col-md-4">
                      <div className="d-flex align-items-center">
                        <i className={`bi ${d.icon} text-success me-2`}></i>
                        <div>
                          <div className="text-muted small">{d.label}</div>
                          <div className="fw-semibold">{d.value}</div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
                {land.description && <>
                  <hr />
                  <h5 className="fw-bold">Description</h5>
                  <p className="text-muted">{land.description}</p>
                </>}
              </div>
            </div>

            {/* Crops */}
            {land.crops?.length > 0 && (
              <div className="card border-0 shadow-sm mb-4">
                <div className="card-body p-4">
                  <h5 className="fw-bold mb-3">Crops on this Land</h5>
                  <div className="d-flex flex-wrap gap-2">
                    {land.crops.map(c => (
                      <span key={c._id} className="badge bg-success bg-opacity-10 text-success px-3 py-2">🌾 {c.name}</span>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* Farmer Info */}
            <div className="card border-0 shadow-sm">
              <div className="card-body p-4">
                <h5 className="fw-bold mb-3">Farmer Information</h5>
                <div className="d-flex align-items-center">
                  <div className="bg-primary rounded-circle d-flex align-items-center justify-content-center text-white me-3" style={{ width: 50, height: 50, fontSize: 20 }}>
                    {land.farmer?.name?.[0]?.toUpperCase()}
                  </div>
                  <div>
                    <div className="fw-bold">{land.farmer?.name}</div>
                    <div className="text-muted small">{land.farmer?.email}</div>
                    {land.farmer?.phone && <div className="text-muted small"><i className="bi bi-telephone me-1"></i>{land.farmer?.phone}</div>}
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Booking + Payment Form */}
          <div className="col-lg-4">
            <div className="card border-0 shadow-sm sticky-top" style={{ top: 80 }}>
              <div className="card-header bg-primary text-white text-center py-3">
                <h5 className="mb-0">Rs. {land.pricePerSeason?.toLocaleString()} <small className="opacity-75">/ season</small></h5>
              </div>
              <div className="card-body p-4">
                {!land.isAvailable ? (
                  <div className="alert alert-warning text-center">
                    <i className="bi bi-clock me-2"></i>This land is currently not available
                  </div>
                ) : !user ? (
                  <div className="text-center">
                    <p className="text-muted">Login to book this land</p>
                    <a href="/login" className="btn btn-primary w-100">Login to Book</a>
                  </div>
                ) : user.role !== 'user' ? (
                  <div className="alert alert-info text-center small">Only land seekers can book lands</div>
                ) : (
                  <form onSubmit={handlePayAndBook}>
                    <div className="mb-3">
                      <label className="form-label fw-semibold">Start Date</label>
                      <input type="date" className="form-control" value={booking.startDate}
                        onChange={e => setBooking({ ...booking, startDate: e.target.value })}
                        required min={new Date().toISOString().split('T')[0]} />
                    </div>
                    <div className="mb-3">
                      <label className="form-label fw-semibold">End Date</label>
                      <input type="date" className="form-control" value={booking.endDate}
                        onChange={e => setBooking({ ...booking, endDate: e.target.value })}
                        required min={booking.startDate} />
                    </div>
                    <div className="mb-3">
                      <label className="form-label fw-semibold">Season</label>
                      <select className="form-select" value={booking.season} onChange={e => setBooking({ ...booking, season: e.target.value })}>
                        <option value="">Select season</option>
                        {seasons.map(s => <option key={s._id} value={s._id}>{s.name}</option>)}
                      </select>
                    </div>
                    <div className="mb-3">
                      <label className="form-label fw-semibold">Message to Farmer (optional)</label>
                      <textarea className="form-control" rows={3} placeholder="Introduce yourself or ask questions..."
                        value={booking.userMessage} onChange={e => setBooking({ ...booking, userMessage: e.target.value })} />
                    </div>

                    {/* Price Preview */}
                    {estimatedPrice && (
                      <div className="alert alert-success py-2 text-center mb-3">
                        <i className="bi bi-currency-rupee"></i>
                        <strong> Estimated Total: Rs. {estimatedPrice.toLocaleString()}</strong>
                      </div>
                    )}

                    {/* Razorpay Pay Button */}
                    <button type="submit" className="btn btn-success w-100 fw-bold py-2" disabled={paymentLoading}>
                      {paymentLoading ? (
                        <><span className="spinner-border spinner-border-sm me-2" />Processing...</>
                      ) : (
                        <><i className="bi bi-credit-card me-2"></i>Pay & Book Now</>
                      )}
                    </button>
                    <p className="text-muted text-center mt-2 small">
                      <i className="bi bi-shield-check me-1"></i>Secured by Razorpay
                    </p>
                  </form>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
