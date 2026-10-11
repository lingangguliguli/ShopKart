import { useState } from 'react';
import { useNavigate } from 'react-router-dom';


const WishlistCard = ({ product, onRemove }) => {
  const navigate = useNavigate();
  const [removing, setRemoving] = useState(false);

  const formattedPrice = `₹${product.price.toLocaleString('en-IN')}`;
  const isOutOfStock = product.stock === 0;

  const handleRemove = async () => {
    if (removing) return;
    setRemoving(true);
    try {
      await onRemove(product._id);
    } catch (err) {
      setRemoving(false);
    }
  };

  return (
    <div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden
                    hover:shadow-lg transition-all duration-200 flex flex-col fade-in">

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
            {isOutOfStock ? 'Out of stock' : `${product.stock} units left`}
          </span>
        </div>

        {}
        <div className="flex-1"></div>

        <button
          onClick={() => navigate(`/products/${product._id}`)}
          className="w-full mt-2 py-2.5 bg-indigo-600 text-white text-sm font-semibold rounded-xl
                     hover:bg-indigo-700 active:bg-indigo-800
                     focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2
                     transition-all duration-150 shadow-sm hover:shadow-md"
        >
          View Details
        </button>

        <button
          onClick={handleRemove}
          disabled={removing}
          className={`w-full mt-2 py-2 text-sm font-medium rounded-xl border transition-all duration-150
            ${removing
              ? 'border-gray-300 text-gray-400 bg-gray-50 cursor-not-allowed'
              : 'border-red-200 text-red-600 bg-red-50 hover:bg-red-100'
            }`}
        >
          {removing ? '⏳ Removing...' : '♥ Remove from Wishlist'}
        </button>
      </div>
    </div>
  );
};

export default WishlistCard;
