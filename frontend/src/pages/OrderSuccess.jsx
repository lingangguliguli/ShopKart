import { useEffect, useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import api, { getOrderByIdApi } from '../services/api';
import Navbar from '../components/Navbar';

const OrderSuccess = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [user, setUser] = useState(null);
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        setError('');

        const authRes = await api.get('/customers/me');
        setUser(authRes.data);

        const orderRes = await getOrderByIdApi(id);
        setOrder(orderRes.data.order);
      } catch (err) {
        if (err.response?.status === 401) {
          navigate('/login');
          return;
        }
        setError(err.response?.data?.message || 'Unable to retrieve order details.');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [id, navigate]);

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
            <div className="text-4xl mb-4">⚠️</div>
            <h2 className="text-xl font-bold text-gray-900 mb-2">Order Not Found</h2>
            <p className="text-gray-500 mb-6 text-sm">{error || 'Could not find the specified order.'}</p>
            <Link
              to="/orders"
              className="inline-block px-6 py-2.5 bg-indigo-600 text-white text-sm font-semibold rounded-xl hover:bg-indigo-700 transition-colors shadow-sm"
            >
              View My Orders
            </Link>
          </div>
        </main>
      </div>
    );
  }

  const formattedTotal = `₹${(order.totalAmount || 0).toLocaleString('en-IN')}`;

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <Navbar userName={user?.fullName} />

      <main className="flex-1 max-w-3xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-12 fade-in">
        <div className="bg-white rounded-3xl border border-gray-200 p-8 sm:p-10 shadow-sm text-center">
          {/* Success Checkmark Badge */}
          <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6 text-green-600">
            <svg className="w-10 h-10" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" d="m4.5 12.75 6 6 9-13.5" />
            </svg>
          </div>

          <h1 className="text-3xl font-extrabold text-gray-900 mb-2">
            Order Placed Successfully
          </h1>
          <p className="text-gray-500 text-base mb-8">
            Your order has been saved successfully.
          </p>

          {/* Order Snapshot Card */}
          <div className="bg-gray-50 rounded-2xl p-6 border border-gray-100 text-left mb-8 space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-gray-200/60 gap-2">
              <div>
                <span className="text-xs uppercase tracking-wider text-gray-400 font-semibold block">Order ID</span>
                <span className="font-mono text-sm font-bold text-gray-900">{order._id}</span>
              </div>
              <div>
                <span className="text-xs uppercase tracking-wider text-gray-400 font-semibold block sm:text-right">Status</span>
                <span className="inline-block px-3 py-1 text-xs font-bold rounded-full bg-green-100 text-green-800 uppercase">
                  {order.status}
                </span>
              </div>
            </div>

            <div className="flex justify-between items-center pt-1">
              <span className="text-gray-600 font-medium text-sm">Payment Status</span>
              <span className="font-semibold text-sm text-green-600 uppercase">
                {order.paymentStatus}
              </span>
            </div>

            <div className="flex justify-between items-center">
              <span className="text-gray-600 font-medium text-sm">Total Amount Paid</span>
              <span className="text-xl font-extrabold text-indigo-600">{formattedTotal}</span>
            </div>

            {order.shippingAddress && (
              <div className="pt-4 border-t border-gray-200/60 text-xs text-gray-500">
                <span className="font-semibold text-gray-700 block mb-1">Delivering to:</span>
                <p>
                  {order.shippingAddress.fullName} • {order.shippingAddress.phone}
                </p>
                <p>
                  {order.shippingAddress.addressLine1}, {order.shippingAddress.city}, {order.shippingAddress.state} - {order.shippingAddress.pincode}
                </p>
              </div>
            )}
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link
              to="/orders"
              className="w-full sm:w-auto px-8 py-3 bg-indigo-600 text-white font-semibold rounded-xl hover:bg-indigo-700 active:bg-indigo-800 transition-colors shadow-sm"
            >
              View My Orders
            </Link>
            <Link
              to="/products"
              className="w-full sm:w-auto px-8 py-3 border border-gray-300 text-gray-700 font-semibold rounded-xl hover:bg-gray-50 transition-colors"
            >
              Continue Shopping
            </Link>
          </div>
        </div>
      </main>
    </div>
  );
};

export default OrderSuccess;
