import { useEffect, useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import api, { getOrdersApi } from '../services/api';
import Navbar from '../components/Navbar';
import OrderCard from '../components/OrderCard';

const Orders = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const fetchOrders = async () => {
    try {
      setLoading(true);
      setError('');

      const authRes = await api.get('/customers/me');
      setUser(authRes.data);

      const response = await getOrdersApi();
      setOrders(response.data.orders || []);
    } catch (err) {
      if (err.response?.status === 401) {
        navigate('/login');
        return;
      }
      setError('Unable to load your orders.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <Navbar userName={user?.fullName} />

      <main className="flex-1 max-w-5xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 fade-in">
        <div className="mb-8">
          <h1 className="text-3xl sm:text-4xl font-extrabold text-gray-900 tracking-tight">
            My Orders
          </h1>
          {!loading && !error && orders.length > 0 && (
            <p className="mt-1 text-gray-500 text-base">
              You have placed {orders.length} {orders.length === 1 ? 'order' : 'orders'}
            </p>
          )}
        </div>

        {/* Loading State */}
        {loading && (
          <div className="flex items-center justify-center py-20">
            <div className="flex flex-col items-center gap-4">
              <div className="w-10 h-10 border-4 border-indigo-200 border-t-indigo-600 rounded-full animate-spin"></div>
              <p className="text-sm text-gray-500 font-medium">Loading your orders...</p>
            </div>
          </div>
        )}

        {/* Error State */}
        {!loading && error && (
          <div className="flex items-center justify-center py-20">
            <div className="text-center bg-white p-8 rounded-2xl border border-gray-200 shadow-sm max-w-md w-full">
              <svg className="w-16 h-16 text-red-300 mx-auto mb-4" fill="none" viewBox="0 0 24 24" strokeWidth={1} stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m9-.75a9 9 0 1 1-18 0 9 9 0 0 1 18 0Zm-9 3.75h.008v.008H12v-.008Z" />
              </svg>
              <p className="text-lg font-semibold text-gray-800">{error}</p>
              <p className="text-sm text-gray-500 mt-1 mb-6">Something went wrong while fetching your orders.</p>
              <button
                type="button"
                onClick={fetchOrders}
                className="px-6 py-2.5 bg-indigo-600 text-white text-sm font-semibold rounded-xl hover:bg-indigo-700 transition-colors shadow-sm"
              >
                Try Again
              </button>
            </div>
          </div>
        )}

        {/* Empty State */}
        {!loading && !error && orders.length === 0 && (
          <div className="flex items-center justify-center py-20">
            <div className="text-center bg-white p-10 rounded-2xl border border-gray-200 shadow-sm max-w-md w-full">
              <div className="text-5xl mb-4">📦</div>
              <h2 className="text-xl font-bold text-gray-900 mb-2">No orders placed yet</h2>
              <p className="text-gray-500 text-sm mb-6">
                You have not placed any orders yet.
              </p>
              <Link
                to="/products"
                className="inline-block px-6 py-2.5 bg-indigo-600 text-white text-sm font-semibold rounded-xl hover:bg-indigo-700 transition-colors shadow-sm"
              >
                Start Shopping
              </Link>
            </div>
          </div>
        )}

        {/* Orders List */}
        {!loading && !error && orders.length > 0 && (
          <div className="space-y-6">
            {orders.map((order) => (
              <OrderCard key={order._id} order={order} />
            ))}
          </div>
        )}
      </main>
    </div>
  );
};

export default Orders;
