import { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import api from '../services/api';
import { getWishlistCount } from '../services/api';
import { selectTotalUnits, clearCart } from '../features/cart/cartSlice';


const Navbar = ({ userName }) => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const totalUnits = useSelector(selectTotalUnits);
  const [loggingOut, setLoggingOut] = useState(false);
  const [wishlistCount, setWishlistCount] = useState(0);

  const fetchCount = async () => {
    try {
      const response = await getWishlistCount();
      setWishlistCount(response.data.count);
    } catch (err) {
      // silently fail
    }
  };

  useEffect(() => {
    fetchCount();

    const handleWishlistUpdate = () => fetchCount();
    window.addEventListener('wishlist-updated', handleWishlistUpdate);
    return () => window.removeEventListener('wishlist-updated', handleWishlistUpdate);
  }, []);

  
  const handleLogout = async () => {
    try {
      setLoggingOut(true);
      await api.post('/customers/logout');
      dispatch(clearCart());
      navigate('/login');
    } catch (error) {
      console.error('Logout failed:', error);
      dispatch(clearCart());
      navigate('/login');
    }
  };

  return (
    <nav className="bg-white border-b border-gray-200 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">

          {}
          <div className="flex items-center gap-6">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 bg-indigo-600 rounded-lg flex items-center justify-center">
                <svg className="w-5 h-5 text-white" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 3h1.386c.51 0 .955.343 1.087.835l.383 1.437M7.5 14.25a3 3 0 0 0-3 3h15.75m-12.75-3h11.218c1.121-2.3 2.1-4.684 2.924-7.138a60.114 60.114 0 0 0-16.536-1.84M7.5 14.25 5.106 5.272M6 20.25a.75.75 0 1 1-1.5 0 .75.75 0 0 1 1.5 0Zm12.75 0a.75.75 0 1 1-1.5 0 .75.75 0 0 1 1.5 0Z" />
                </svg>
              </div>
              <span className="text-xl font-bold text-gray-900">ShopKart</span>
            </div>

            {}
            <div className="hidden sm:flex items-center gap-1">
              <Link to="/home" className="px-3 py-2 text-sm font-medium text-gray-600 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg transition-colors">
                Home
              </Link>
              <Link to="/products" className="px-3 py-2 text-sm font-medium text-gray-600 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg transition-colors">
                Products
              </Link>
              <Link to="/wishlist" className="px-3 py-2 text-sm font-medium text-gray-600 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg transition-colors">
                Wishlist {wishlistCount > 0 && `(${wishlistCount})`}
              </Link>
              <Link to="/cart" className="px-3 py-2 text-sm font-medium text-gray-600 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg transition-colors">
                Cart ({totalUnits})
              </Link>
              <Link to="/orders" className="px-3 py-2 text-sm font-medium text-gray-600 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg transition-colors">
                Orders
              </Link>
            </div>
          </div>

          {}
          <div className="flex items-center gap-4">
            <div className="hidden sm:flex items-center gap-2 text-sm text-gray-600">
              <div className="w-8 h-8 bg-indigo-100 text-indigo-700 rounded-full flex items-center justify-center font-semibold text-sm">
                {userName?.charAt(0)?.toUpperCase() || 'U'}
              </div>
              <span className="font-medium text-gray-800">{userName}</span>
            </div>
            <button
              onClick={handleLogout}
              disabled={loggingOut}
              className="inline-flex items-center gap-2 px-4 py-2 text-sm font-medium text-red-600 bg-red-50 rounded-lg
                         hover:bg-red-100 active:bg-red-200 transition-colors duration-150
                         disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loggingOut ? (
                <>
                  <span className="spinner !border-red-300 !border-t-red-600"></span>
                  Logging out…
                </>
              ) : (
                <>
                  {}
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 9V5.25A2.25 2.25 0 0 0 13.5 3h-6a2.25 2.25 0 0 0-2.25 2.25v13.5A2.25 2.25 0 0 0 7.5 21h6a2.25 2.25 0 0 0 2.25-2.25V15m3 0 3-3m0 0-3-3m3 3H9" />
                  </svg>
                  Logout
                </>
              )}
            </button>
          </div>

        </div>
      </div>
    </nav>
  );
};

export default Navbar;

