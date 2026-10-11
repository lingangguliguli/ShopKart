import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { addToCart, selectCartItems, selectPendingIds } from '../features/cart/cartSlice';


const ProductCard = ({ product, isWishlisted = false, onWishlistToggle }) => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const cartItems = useSelector(selectCartItems);
  const pendingIds = useSelector(selectPendingIds);

  const [saving, setSaving] = useState(false);
  const [wishlistError, setWishlistError] = useState('');
  const [cartError, setCartError] = useState('');

  
  const formattedPrice = `₹${product.price.toLocaleString('en-IN')}`;

  const isOutOfStock = product.stock === 0;
  const isAdding = pendingIds.includes(product._id);
  const existingCartItem = cartItems.find(
    (item) => (item.product?._id || item.product) === product._id
  );
  const isInCart = Boolean(existingCartItem);

  const handleWishlistClick = async () => {
    if (saving || !onWishlistToggle) return;
    setSaving(true);
    setWishlistError('');
    try {
      await onWishlistToggle(product._id);
    } catch (err) {
      setWishlistError('Unable to save product. Please try again.');
    } finally {
      setSaving(false);
    }
  };

  const handleAddToCart = async () => {
    if (isAdding || isOutOfStock) return;
    if (existingCartItem && existingCartItem.quantity >= product.stock) {
      setCartError(`Stock limit reached (${product.stock} available)`);
      return;
    }
    setCartError('');
    const result = await dispatch(addToCart(product._id));
    if (addToCart.rejected.match(result)) {
      setCartError(result.payload || 'Failed to add to cart');
    }
  };

  return (
    <div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden
                    hover:shadow-lg hover:-translate-y-1 transition-all duration-200 flex flex-col">

      {}
      <div className="relative aspect-[4/3] bg-gray-100 overflow-hidden">
        <img
          src={product.image}
          alt={product.name}
          className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
          onError={(e) => {
            e.target.src = 'https://placehold.co/400x300/e2e8f0/94a3b8?text=No+Image';
          }}
        />

        {}
        <span className="absolute top-3 left-3 px-3 py-1 bg-indigo-600 text-white text-xs font-semibold rounded-full">
          {product.category}
        </span>

        {}
        {isOutOfStock && (
          <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
            <span className="px-4 py-2 bg-red-600 text-white text-sm font-bold rounded-lg">Out of Stock</span>
          </div>
        )}
      </div>

      {}
      <div className="p-5 flex flex-col flex-1">
        <h3 className="text-lg font-semibold text-gray-900 mb-1 line-clamp-1">{product.name}</h3>

        <div className="flex items-center justify-between mb-3">
          <span className="text-xl font-bold text-indigo-600">{formattedPrice}</span>
          <span className={`text-xs font-medium px-2.5 py-1 rounded-full ${
            isOutOfStock
              ? 'bg-red-100 text-red-700'
              : 'bg-green-100 text-green-700'
          }`}>
            {isOutOfStock ? 'Out of stock' : `${product.stock} left`}
          </span>
        </div>

        {}
        {wishlistError && (
          <p className="text-xs text-red-600 mb-2">{wishlistError}</p>
        )}

        {}
        <div className="flex-1"></div>

        {onWishlistToggle && (
          <button
            onClick={handleWishlistClick}
            disabled={saving}
            className={`w-full mt-2 py-2 text-sm font-medium rounded-xl border transition-all duration-150
              ${saving
                ? 'border-gray-300 text-gray-400 bg-gray-50 cursor-not-allowed'
                : isWishlisted
                  ? 'border-pink-200 text-pink-600 bg-pink-50 hover:bg-pink-100'
                  : 'border-gray-200 text-gray-600 bg-white hover:border-indigo-300 hover:text-indigo-600 hover:bg-indigo-50'
              }`}
          >
            {saving ? '⏳ Saving...' : isWishlisted ? '♥ Remove from Wishlist' : '♡ Add to Wishlist'}
          </button>
        )}

        <button
          type="button"
          onClick={handleAddToCart}
          disabled={isOutOfStock || isAdding}
          className={`w-full mt-3 py-2.5 text-sm font-semibold rounded-xl transition-all duration-150 shadow-sm flex items-center justify-center gap-2 ${
            isOutOfStock
              ? 'bg-gray-100 text-gray-400 cursor-not-allowed border border-gray-200'
              : isAdding
                ? 'bg-indigo-400 text-white cursor-not-allowed'
                : isInCart
                  ? 'bg-indigo-50 text-indigo-700 border border-indigo-200 hover:bg-indigo-100 active:bg-indigo-200'
                  : 'bg-indigo-600 text-white hover:bg-indigo-700 active:bg-indigo-800'
          }`}
        >
          {isAdding ? 'Adding...' : isInCart ? 'Add Another' : 'Add to Cart'}
        </button>

        {cartError && (
          <p className="text-xs text-red-600 mt-1.5 text-center font-medium">{cartError}</p>
        )}

        <button
          onClick={() => navigate(`/products/${product._id}`)}
          className="w-full mt-2 py-2 border border-gray-200 text-gray-700 text-sm font-semibold rounded-xl hover:bg-gray-50 active:bg-gray-100 transition-colors"
        >
          View Details
        </button>
      </div>
    </div>
  );
};

export default ProductCard;

