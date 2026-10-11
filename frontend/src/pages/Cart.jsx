import { useEffect, useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import api from '../services/api';
import Navbar from '../components/Navbar';
import CartItem from '../components/CartItem';
import {
  selectCartItems,
  selectCartLoading,
  selectCartError,
  selectTotalUnits,
  selectSubtotal,
  fetchCart,
} from '../features/cart/cartSlice';

const Cart = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const [user, setUser] = useState(null);
  const [authLoading, setAuthLoading] = useState(true);

  const cartItems = useSelector(selectCartItems);
  const cartLoading = useSelector(selectCartLoading);
  const cartError = useSelector(selectCartError);
  const totalUnits = useSelector(selectTotalUnits);
  const subtotal = useSelector(selectSubtotal);

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

  const handleRetry = () => {
    dispatch(fetchCart());
  };

  const handleProceedToCheckout = () => {
    if (cartItems.length > 0) {
      navigate('/checkout');
    }
  };

  const formattedSubtotal = `₹${subtotal.toLocaleString('en-IN')}`;

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <Navbar userName={user?.fullName} />

      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 fade-in">
        <div className="mb-8">
          <h1 className="text-3xl sm:text-4xl font-extrabold text-gray-900 tracking-tight">
            Shopping Cart
          </h1>
          {!cartLoading && !cartError && cartItems.length > 0 && (
            <p className="mt-2 text-gray-500 text-lg">
              {totalUnits} {totalUnits === 1 ? 'item' : 'items'} in your cart
            </p>
          )}
        </div>

        {/* Loading State */}
        {(authLoading || cartLoading) && (
          <div className="flex items-center justify-center py-20">
            <div className="flex flex-col items-center gap-4">
              <div className="w-10 h-10 border-4 border-indigo-200 border-t-indigo-600 rounded-full animate-spin"></div>
              <p className="text-sm text-gray-500 font-medium">Loading your cart...</p>
            </div>
          </div>
        )}

        {/* Error State */}
        {!authLoading && !cartLoading && cartError && (
          <div className="flex items-center justify-center py-20">
            <div className="text-center">
              <svg className="w-16 h-16 text-red-300 mx-auto mb-4" fill="none" viewBox="0 0 24 24" strokeWidth={1} stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m9-.75a9 9 0 1 1-18 0 9 9 0 0 1 18 0Zm-9 3.75h.008v.008H12v-.008Z" />
              </svg>
              <p className="text-lg font-semibold text-gray-700">Unable to load your cart.</p>
              <p className="mt-1 text-sm text-gray-500">{typeof cartError === 'string' ? cartError : 'Please check your connection and try again.'}</p>
              <button
                type="button"
                onClick={handleRetry}
                className="mt-4 px-6 py-2.5 bg-indigo-600 text-white text-sm font-semibold rounded-xl hover:bg-indigo-700 transition-colors shadow-sm"
              >
                Try Again
              </button>
            </div>
          </div>
        )}

        {/* Empty State */}
        {!authLoading && !cartLoading && !cartError && cartItems.length === 0 && (
          <div className="flex items-center justify-center py-20">
            <div className="text-center">
              <div className="text-5xl mb-4">🛒</div>
              <p className="text-xl font-bold text-gray-800">Your cart is empty</p>
              <p className="mt-1 text-gray-500">Looks like you haven't added anything yet.</p>
              <Link
                to="/products"
                className="inline-flex items-center gap-2 mt-6 px-6 py-2.5 bg-indigo-600 text-white text-sm font-semibold rounded-xl hover:bg-indigo-700 transition-colors shadow-sm"
              >
                Browse Products
              </Link>
            </div>
          </div>
        )}

        {/* Cart Contents with Order Summary */}
        {!authLoading && !cartLoading && !cartError && cartItems.length > 0 && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
            {/* Cart Items List */}
            <div className="lg:col-span-2 space-y-4">
              {cartItems.map((item) => (
                <CartItem key={item.product?._id || item._id} item={item} />
              ))}
            </div>

            {/* Order Summary */}
            <div className="bg-white rounded-2xl border border-gray-200 p-6 shadow-sm sticky top-24">
              <h2 className="text-lg font-bold text-gray-900 mb-4 pb-3 border-b border-gray-100">
                Order Summary
              </h2>

              <div className="space-y-3 mb-6">
                <div className="flex justify-between text-sm text-gray-600">
                  <span>Items</span>
                  <span className="font-medium text-gray-900">{totalUnits}</span>
                </div>
                <div className="flex justify-between text-sm text-gray-600">
                  <span>Subtotal</span>
                  <span className="font-semibold text-gray-900">{formattedSubtotal}</span>
                </div>
                <div className="flex justify-between text-sm text-gray-600">
                  <span>Shipping</span>
                  <span className="text-green-600 font-medium">Free</span>
                </div>
                <div className="pt-3 border-t border-gray-100 flex justify-between text-base font-bold text-gray-900">
                  <span>Total</span>
                  <span className="text-indigo-600">{formattedSubtotal}</span>
                </div>
              </div>

              <button
                type="button"
                onClick={handleProceedToCheckout}
                disabled={cartItems.length === 0}
                className="w-full py-3 bg-indigo-600 text-white font-semibold rounded-xl hover:bg-indigo-700 active:bg-indigo-800 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 transition-all duration-150 shadow-sm hover:shadow-md disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Proceed to Checkout
              </button>

              <div className="mt-4 text-center">
                <Link
                  to="/products"
                  className="text-xs text-indigo-600 hover:text-indigo-800 font-medium"
                >
                  ← Continue Shopping
                </Link>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
};

export default Cart;
