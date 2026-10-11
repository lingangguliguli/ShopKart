import { useState, useEffect } from 'react';
import api from '../services/api';
import { getWishlist, toggleWishlistItem } from '../services/api';
import Navbar from '../components/Navbar';
import SearchBar from '../components/SearchBar';
import ProductCard from '../components/ProductCard';


const Products = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [sortOrder, setSortOrder] = useState('');
  const [wishlistIds, setWishlistIds] = useState(new Set());

  
  const fetchProducts = async (filters = {}) => {
    try {
      setLoading(true);
      setError('');

      
      const params = {};
      if (filters.search) params.search = filters.search;
      if (filters.category) params.category = filters.category;
      if (sortOrder) params.sort = sortOrder;

      const response = await api.get('/products', { params });
      setProducts(response.data.products);
    } catch (err) {
      console.error('Failed to fetch products:', err);
      setError('Something went wrong while loading products.');
    } finally {
      setLoading(false);
    }
  };

  
  const [currentFilters, setCurrentFilters] = useState({});

  
  useEffect(() => {
    fetchProducts();

    const fetchWishlistIds = async () => {
      try {
        const response = await getWishlist();
        const ids = new Set(response.data.wishlist.map((p) => p._id));
        setWishlistIds(ids);
      } catch (err) {
        // silently fail — user may not be logged in
      }
    };
    fetchWishlistIds();
  }, []); 

  
  useEffect(() => {
    fetchProducts(currentFilters);
  }, [sortOrder]); 

  
  const handleFilterChange = (filters) => {
    setCurrentFilters(filters);
    fetchProducts({ ...filters });
  };

  const handleWishlistToggle = async (productId) => {
    const response = await toggleWishlistItem(productId);
    setWishlistIds((prev) => {
      const next = new Set(prev);
      if (response.data.isWishlisted) {
        next.add(productId);
      } else {
        next.delete(productId);
      }
      return next;
    });
    window.dispatchEvent(new CustomEvent('wishlist-updated'));
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <Navbar />

      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 fade-in">
        {}
        <div className="mb-8">
          <h1 className="text-3xl sm:text-4xl font-extrabold text-gray-900 tracking-tight">Products</h1>
          <p className="mt-2 text-gray-500 text-lg">Discover our amazing collection</p>
        </div>

        {}
        <div className="flex flex-col lg:flex-row lg:items-end gap-3 mb-8">
          <div className="flex-1">
            <SearchBar onFilterChange={handleFilterChange} />
          </div>
          <div className="mb-8 lg:mb-8">
            <select
              value={sortOrder}
              onChange={(e) => setSortOrder(e.target.value)}
              className="px-4 py-3 border border-gray-300 rounded-xl bg-white text-gray-900
                         focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500
                         transition-shadow duration-150 cursor-pointer w-full sm:w-48"
            >
              <option value="">Sort: Default</option>
              <option value="price_asc">Price: Low → High</option>
              <option value="price_desc">Price: High → Low</option>
            </select>
          </div>
        </div>

        {}
        {loading && (
          <div className="flex items-center justify-center py-20">
            <div className="flex flex-col items-center gap-4">
              <div className="w-10 h-10 border-4 border-indigo-200 border-t-indigo-600 rounded-full animate-spin"></div>
              <p className="text-sm text-gray-500 font-medium">Loading products…</p>
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
                onClick={() => fetchProducts(currentFilters)}
                className="mt-4 px-6 py-2.5 bg-indigo-600 text-white text-sm font-semibold rounded-xl
                           hover:bg-indigo-700 transition-colors"
              >
                Try Again
              </button>
            </div>
          </div>
        )}

        {}
        {!loading && !error && products.length === 0 && (
          <div className="flex items-center justify-center py-20">
            <div className="text-center">
              <svg className="w-16 h-16 text-gray-300 mx-auto mb-4" fill="none" viewBox="0 0 24 24" strokeWidth={1} stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" d="m21 21-5.197-5.197m0 0A7.5 7.5 0 1 0 5.196 5.196a7.5 7.5 0 0 0 10.607 10.607Z" />
              </svg>
              <p className="text-lg font-semibold text-gray-700">No products found.</p>
              <p className="mt-1 text-gray-500">Try adjusting your search or filter.</p>
            </div>
          </div>
        )}

        {}
        {!loading && !error && products.length > 0 && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {products.map((product) => (
              <ProductCard
                key={product._id}
                product={product}
                isWishlisted={wishlistIds.has(product._id)}
                onWishlistToggle={handleWishlistToggle}
              />
            ))}
          </div>
        )}
      </main>
    </div>
  );
};

export default Products;

