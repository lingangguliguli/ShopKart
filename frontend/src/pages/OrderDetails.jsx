import { useEffect, useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import api, { getOrderByIdApi, updateOrderStatusApi } from '../services/api';
import Navbar from '../components/Navbar';

const OrderDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [user, setUser] = useState(null);
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [updatingStatus, setUpdatingStatus] = useState(false);

  const fetchOrder = async () => {
    try {
      setLoading(true);
      setError('');

      const authRes = await api.get('/customers/me');
      setUser(authRes.data);

      const response = await getOrderByIdApi(id);
      setOrder(response.data.order);
    } catch (err) {
      if (err.response?.status === 401) {
        navigate('/login');
        return;
      }
      if (err.response?.status === 404 || err.response?.status === 403) {
        setError('Order not found or you do not have permission to view it.');
      } else {
        setError('Failed to load order details.');
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrder();
  }, [id]);

  const handleStatusChange = async (newStatus) => {
    try {
      setUpdatingStatus(true);
      const res = await updateOrderStatusApi(order._id, newStatus);
      setOrder(res.data.order);
    } catch (err) {
      // Dev status change silently fails or logs if disabled
      console.error('Dev status update failed:', err);
    } finally {
      setUpdatingStatus(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex flex-col">
        <Navbar userName={user?.fullName} />
        <div className="flex-1 flex items-center justify-center">
          <div className="flex flex-col items-center gap-4">
            <div className="w-10 h-10 border-4 border-indigo-200 border-t-indigo-600 rounded-full animate-spin"></div>
            <p className="text-sm text-gray-500 font-medium">Loading order details...</p>
          </div>
        </div>
      </div>
    );
  }

  if (error || !order) {
    return (
      <div className="min-h-screen bg-gray-50 flex flex-col">
        <Navbar userName={user?.fullName} />
        <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-16 flex items-center justify-center">
          <div className="text-center max-w-md bg-white p-8 rounded-2xl border border-gray-200 shadow-sm">
            <div className="text-4xl mb-4">🔍</div>
            <h2 className="text-xl font-bold text-gray-900 mb-2">Order Not Available</h2>
            <p className="text-gray-500 mb-6 text-sm">{error || 'This order does not exist or belongs to another user.'}</p>
            <Link
              to="/orders"
              className="inline-block px-6 py-2.5 bg-indigo-600 text-white text-sm font-semibold rounded-xl hover:bg-indigo-700 transition-colors shadow-sm"
            >
              Back to My Orders
            </Link>
          </div>
        </main>
      </div>
    );
  }

  const formattedDate = new Date(order.createdAt).toLocaleDateString('en-IN', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });

  const formattedTotal = `₹${(order.totalAmount || 0).toLocaleString('en-IN')}`;

  const steps = ['PLACED', 'CONFIRMED', 'SHIPPED', 'DELIVERED'];
  const currentStepIndex = steps.indexOf(order.status);

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <Navbar userName={user?.fullName} />

      <main className="flex-1 max-w-5xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 fade-in">
        {/* Navigation Breadcrumb */}
        <div className="flex items-center gap-2 text-sm text-gray-500 mb-6">
          <Link to="/orders" className="hover:text-indigo-600 transition-colors">
            My Orders
          </Link>
          <span>/</span>
          <span className="text-gray-900 font-medium font-mono text-xs">
            {order._id}
          </span>
        </div>

        {/* Top Header Card */}
        <div className="bg-white rounded-2xl border border-gray-200 p-6 sm:p-8 shadow-sm mb-8">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-6 border-b border-gray-100 gap-4">
            <div>
              <span className="text-xs uppercase tracking-wider text-gray-400 font-bold block mb-1">
                Order ID
              </span>
              <h1 className="text-xl sm:text-2xl font-bold font-mono text-gray-900">
                #{order._id}
              </h1>
              <p className="text-xs text-gray-500 mt-1">Placed on {formattedDate}</p>
            </div>

            <div className="flex items-center gap-3">
              <span className="px-3.5 py-1.5 rounded-full text-xs font-bold uppercase tracking-wider bg-indigo-50 text-indigo-700 border border-indigo-200">
                {order.status}
              </span>
              <span className="text-2xl font-extrabold text-indigo-600">
                {formattedTotal}
              </span>
            </div>
          </div>

          {/* Bonus: Visual Stepper */}
          {currentStepIndex !== -1 && (
            <div className="pt-8 pb-4">
              <div className="flex items-center justify-between relative max-w-2xl mx-auto">
                <div className="absolute left-0 top-1/2 -translate-y-1/2 h-1 bg-gray-200 w-full z-0"></div>
                <div
                  className="absolute left-0 top-1/2 -translate-y-1/2 h-1 bg-indigo-600 z-0 transition-all duration-300"
                  style={{
                    width: `${(currentStepIndex / (steps.length - 1)) * 100}%`,
                  }}
                ></div>

                {steps.map((step, idx) => {
                  const isCompleted = idx <= currentStepIndex;
                  const isCurrent = idx === currentStepIndex;
                  return (
                    <div key={step} className="relative z-10 flex flex-col items-center">
                      <div
                        className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold transition-all ${
                          isCompleted
                            ? 'bg-indigo-600 text-white shadow-sm'
                            : 'bg-white border-2 border-gray-300 text-gray-400'
                        } ${isCurrent ? 'ring-4 ring-indigo-100 scale-110' : ''}`}
                      >
                        {isCompleted ? '✓' : idx + 1}
                      </div>
                      <span className="text-xs font-bold text-gray-700 mt-2 uppercase tracking-tight">
                        {step}
                      </span>
                    </div>
                  );
                })}
              </div>

              {/* Dev Status Controls (Bonus development helper) */}
              <div className="mt-8 pt-4 border-t border-gray-100 flex flex-wrap items-center justify-end gap-2 text-xs">
                <span className="text-gray-400 font-medium">Dev Status Simulator:</span>
                {steps.map((step) => (
                  <button
                    key={step}
                    type="button"
                    disabled={updatingStatus || order.status === step}
                    onClick={() => handleStatusChange(step)}
                    className={`px-2.5 py-1 rounded-lg font-medium transition-colors ${
                      order.status === step
                        ? 'bg-indigo-600 text-white'
                        : 'bg-gray-100 hover:bg-gray-200 text-gray-700'
                    }`}
                  >
                    {step}
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Content Details Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
          {/* Items Snapshot (2 cols) */}
          <div className="lg:col-span-2 bg-white rounded-2xl border border-gray-200 p-6 shadow-sm">
            <h2 className="text-lg font-bold text-gray-900 mb-4 pb-3 border-b border-gray-100">
              Items Ordered ({order.items?.length || 0})
            </h2>

            <div className="divide-y divide-gray-100">
              {order.items.map((item, idx) => {
                const lineTotal = (item.price || 0) * item.quantity;
                return (
                  <div key={idx} className="py-4 flex items-center gap-4">
                    <div className="w-16 h-16 bg-gray-100 rounded-xl overflow-hidden shrink-0 border border-gray-100 flex items-center justify-center">
                      <img
                        src={item.image}
                        alt={item.name}
                        className="w-full h-full object-cover"
                        onError={(e) => {
                          e.target.src = 'https://placehold.co/100x100/e2e8f0/94a3b8?text=No+Image';
                        }}
                      />
                    </div>
                    <div className="flex-1 min-w-0">
                      <h4 className="text-base font-semibold text-gray-900 truncate">{item.name}</h4>
                      <p className="text-sm text-gray-500 mt-0.5">
                        Price: ₹{(item.price || 0).toLocaleString('en-IN')} × {item.quantity}
                      </p>
                    </div>
                    <div className="text-right shrink-0">
                      <span className="text-base font-bold text-gray-900">
                        ₹{lineTotal.toLocaleString('en-IN')}
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Right Column: Address & Payment Info */}
          <div className="space-y-6">
            {/* Shipping Address */}
            <div className="bg-white rounded-2xl border border-gray-200 p-6 shadow-sm">
              <h3 className="text-base font-bold text-gray-900 mb-3 pb-2 border-b border-gray-100 flex items-center gap-2">
                <svg className="w-4 h-4 text-indigo-600" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M15 10.5a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z" />
                  <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1 1 15 0Z" />
                </svg>
                Delivery Address
              </h3>
              {order.shippingAddress ? (
                <div className="text-sm text-gray-600 space-y-1">
                  <p className="font-semibold text-gray-900">{order.shippingAddress.fullName}</p>
                  <p>{order.shippingAddress.phone}</p>
                  <p>{order.shippingAddress.addressLine1}</p>
                  <p>
                    {order.shippingAddress.city}, {order.shippingAddress.state} - {order.shippingAddress.pincode}
                  </p>
                </div>
              ) : (
                <p className="text-sm text-gray-400">No address recorded</p>
              )}
            </div>

            {/* Payment Summary */}
            <div className="bg-white rounded-2xl border border-gray-200 p-6 shadow-sm">
              <h3 className="text-base font-bold text-gray-900 mb-3 pb-2 border-b border-gray-100">
                Payment Info
              </h3>

              <div className="space-y-3 text-sm">
                <div className="flex justify-between items-center">
                  <span className="text-gray-500">Payment Status</span>
                  <span className={`font-bold px-2.5 py-0.5 rounded-full text-xs uppercase ${
                    order.paymentStatus === 'PAID'
                      ? 'bg-green-100 text-green-800'
                      : order.paymentStatus === 'FAILED'
                        ? 'bg-red-100 text-red-800'
                        : 'bg-yellow-100 text-yellow-800'
                  }`}>
                    {order.paymentStatus}
                  </span>
                </div>

                {order.razorpayPaymentId && (
                  <div className="flex justify-between items-center">
                    <span className="text-gray-500">Transaction ID</span>
                    <span className="font-mono text-xs font-semibold text-gray-700">
                      {order.razorpayPaymentId}
                    </span>
                  </div>
                )}

                <div className="pt-3 border-t border-gray-100 flex justify-between items-center font-bold text-base text-gray-900">
                  <span>Grand Total</span>
                  <span className="text-indigo-600 text-lg">{formattedTotal}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default OrderDetails;
