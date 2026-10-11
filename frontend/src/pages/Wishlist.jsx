import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { getWishlist, removeWishlistItem } from '../services/api';
import Navbar from '../components/Navbar';
import WishlistCard from '../components/WishlistCard';


const Wishlist = () => {
  const navigate = useNavigate();
  const [wishlist, setWishlist] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const fetchWishlist = async () => {
    try {
      setLoading(true);
      setError('');
      const response = await getWishlist();
      setWishlist(response.data.wishlist);
    } catch (err) {
      console.error('Failed to fetch wishlist:', err);
      if (err.response?.status === 401) {
        navigate('/login');
        return;
      }
      setError('Something went wrong. We couldn\'t load your wishlist.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchWishlist();
  }, []);

  const handleRemove = async (productId) => {
    await removeWishlistItem(productId);
    setWishlist((prev) => prev.filter((p) => p._id !== productId));
    window.dispatchEvent(new CustomEvent('wishlist-updated'));
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <Navbar />

      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 fade-in">
        {}
        <div className="mb-8">
          <h1 className="text-3xl sm:text-4xl font-extrabold text-gray-900 tracking-tight">My Wishlist</h1>
          {!loading && !error && wishlist.length > 0 && (
            <p className="mt-2 text-gray-500 text-lg">{wishlist.length} {wishlist.length === 1 ? 'product' : 'products'} saved</p>
          )}
        </div>

        {}
        {loading && (
          <div className="flex items-center justify-center py-20">
            <div className="flex flex-col items-center gap-4">
              <div className="w-10 h-10 border-4 border-indigo-200 border-t-indigo-600 rounded-full animate-spin"></div>
              <p className="text-sm text-gray-500 font-medium">Loading your wishlist...</p>
            </div>
          </div>
        )}

        {}
        {!loading && error && (
          <div className="flex items-center justify-center py-20">
            <div className="text-center">
              <svg className="w-16 h-16 text-red-300 mx-auto mb-4" fill="none" viewBox="0 0 24 24" strokeWidth={1} stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m9-.75a9 9 0 1 1-18 0 9 9 0 0 1 18 0Zm-9 3.75h.008v.008H12v-.008Z" />
              </svg>
              <p className="text-lg font-semibold text-gray-700">{error}</p>
              <button
                onClick={fetchWishlist}
                className="mt-4 px-6 py-2.5 bg-indigo-600 text-white text-sm font-semibold rounded-xl
                           hover:bg-indigo-700 transition-colors"
              >
                Try Again
              </button>
            </div>
          </div>
        )}

        {}
        {!loading && !error && wishlist.length === 0 && (
          <div className="flex items-center justify-center py-20">
            <div className="text-center">
              <svg className="w-20 h-20 text-gray-300 mx-auto mb-4" fill="none" viewBox="0 0 24 24" strokeWidth={1} stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12Z" />
              </svg>
              <p className="text-lg font-semibold text-gray-700">Your wishlist is empty</p>
              <p className="mt-1 text-gray-500">Save products you love and find them here later.</p>
              <Link
                to="/products"
                className="inline-flex items-center gap-2 mt-4 px-6 py-2.5 bg-indigo-600 text-white text-sm font-semibold rounded-xl
                           hover:bg-indigo-700 transition-colors shadow-sm"
              >
                Browse Products
              </Link>
            </div>
          </div>
        )}

        {}
        {!loading && !error && wishlist.length > 0 && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {wishlist.map((product) => (
              <WishlistCard
                key={product._id}
                product={product}
                onRemove={handleRemove}
              />
            ))}
          </div>
        )}
      </main>
    </div>
  );
};

export default Wishlist;
