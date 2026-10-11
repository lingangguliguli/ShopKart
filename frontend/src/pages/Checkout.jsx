import { useEffect, useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useSelector } from 'react-redux';
import api from '../services/api';
import Navbar from '../components/Navbar';
import CheckoutForm from '../components/CheckoutForm';
import OrderSummary from '../components/OrderSummary';
import { selectCartItems, selectCartLoading } from '../features/cart/cartSlice';

const Checkout = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [authLoading, setAuthLoading] = useState(true);

  const cartItems = useSelector(selectCartItems);
  const cartLoading = useSelector(selectCartLoading);

  useEffect(() => {
    const checkAuth = async () => {
      try {
        setAuthLoading(true);
        const response = await api.get('/customers/me');
        setUser(response.data);
      } catch (err) {
        if (err.response?.status === 401) {
          navigate('/login');
          return;
        }
      } finally {
        setAuthLoading(false);
      }
    };

    checkAuth();
  }, [navigate]);

  if (authLoading || cartLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex flex-col">
        <Navbar userName={user?.fullName} />
        <div className="flex-1 flex items-center justify-center">
          <div className="flex flex-col items-center gap-4">
            <div className="w-10 h-10 border-4 border-indigo-200 border-t-indigo-600 rounded-full animate-spin"></div>
            <p className="text-sm text-gray-500 font-medium">Preparing checkout...</p>
          </div>
        </div>
      </div>
    );
  }

  // If cart is empty, do not show checkout form
  if (!cartLoading && cartItems.length === 0) {
    return (
      <div className="min-h-screen bg-gray-50 flex flex-col">
        <Navbar userName={user?.fullName} />
        <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-16 flex items-center justify-center">
          <div className="text-center max-w-md bg-white p-8 rounded-2xl border border-gray-200 shadow-sm">
            <div className="text-5xl mb-4">🛒</div>
            <h2 className="text-2xl font-bold text-gray-900 mb-2">Your Cart is Empty</h2>
            <p className="text-gray-500 mb-6 text-sm">
              You must have at least one product in your cart to proceed with checkout.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
              <Link
                to="/products"
                className="w-full sm:w-auto px-6 py-2.5 bg-indigo-600 text-white text-sm font-semibold rounded-xl hover:bg-indigo-700 transition-colors shadow-sm"
              >
                Browse Products
              </Link>
              <Link
                to="/cart"
                className="w-full sm:w-auto px-6 py-2.5 border border-gray-300 text-gray-700 text-sm font-semibold rounded-xl hover:bg-gray-50 transition-colors"
              >
                Go to Cart
              </Link>
            </div>
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <Navbar userName={user?.fullName} />

      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 fade-in">
        <div className="mb-8">
          <div className="flex items-center gap-2 text-sm text-gray-500 mb-2">
            <Link to="/cart" className="hover:text-indigo-600 transition-colors">
              Cart
            </Link>
            <span>/</span>
            <span className="text-gray-900 font-medium">Checkout</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-extrabold text-gray-900 tracking-tight">
            Checkout
          </h1>
          <p className="mt-1 text-gray-500 text-base">
            Complete your shipping details and proceed to payment
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
          {/* Checkout Form */}
          <div className="lg:col-span-2">
            <CheckoutForm />
          </div>

          {/* Order Summary */}
          <div>
            <OrderSummary />
          </div>
        </div>
      </main>
    </div>
  );
};

export default Checkout;
