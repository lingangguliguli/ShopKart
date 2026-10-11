import { useDispatch, useSelector } from 'react-redux';
import { updateQuantity, removeFromCart, selectPendingIds } from '../features/cart/cartSlice';

const CartItem = ({ item }) => {
  const dispatch = useDispatch();
  const pendingIds = useSelector(selectPendingIds);

  const product = item.product;
  if (!product) return null;

  const isPending = pendingIds.includes(product._id);
  const formattedUnitPrice = `₹${(product.price || 0).toLocaleString('en-IN')}`;
  const lineTotal = (product.price || 0) * item.quantity;
  const formattedLineTotal = `₹${lineTotal.toLocaleString('en-IN')}`;
  const isMinQuantity = item.quantity <= 1;
  const isMaxQuantity = item.quantity >= product.stock;

  const handleDecrement = () => {
    if (isMinQuantity || isPending) return;
    dispatch(updateQuantity({ productId: product._id, quantity: item.quantity - 1 }));
  };

  const handleIncrement = () => {
    if (isMaxQuantity || isPending) return;
    dispatch(updateQuantity({ productId: product._id, quantity: item.quantity + 1 }));
  };

  const handleRemove = () => {
    if (isPending) return;
    dispatch(removeFromCart(product._id));
  };

  return (
    <div className={`p-4 sm:p-6 bg-white rounded-2xl border border-gray-200 shadow-sm flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 transition-opacity duration-200 ${
      isPending ? 'opacity-60 pointer-events-none' : ''
    }`}>
      {/* Product Image & Info */}
      <div className="flex items-center gap-4 flex-1 min-w-0">
        <div className="w-20 h-20 bg-gray-100 rounded-xl overflow-hidden shrink-0 border border-gray-100 flex items-center justify-center">
          <img
            src={product.image}
            alt={product.name}
            className="w-full h-full object-cover"
            onError={(e) => {
              e.target.src = 'https://placehold.co/200x200/e2e8f0/94a3b8?text=No+Image';
            }}
          />
        </div>

        <div className="min-w-0 flex-1">
          <h3 className="text-base font-semibold text-gray-900 truncate">{product.name}</h3>
          <p className="text-sm text-gray-500 mt-0.5">
            Unit Price: <span className="font-medium text-gray-700">{formattedUnitPrice}</span>
          </p>
          {product.stock <= 5 && (
            <p className="text-xs text-amber-600 font-medium mt-1">
              Only {product.stock} units left in stock
            </p>
          )}
        </div>
      </div>

      {/* Quantity Controls & Line Total & Remove */}
      <div className="flex items-center justify-between sm:justify-end gap-6 w-full sm:w-auto pt-3 sm:pt-0 border-t sm:border-t-0 border-gray-100">
        {/* Quantity Controls */}
        <div className="flex items-center border border-gray-300 rounded-xl overflow-hidden bg-white shadow-sm">
          <button
            type="button"
            onClick={handleDecrement}
            disabled={isMinQuantity || isPending}
            className="w-9 h-9 flex items-center justify-center text-gray-600 hover:bg-gray-100 active:bg-gray-200 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
            title={isMinQuantity ? 'Quantity cannot be less than 1. Use Remove to delete.' : 'Decrease quantity'}
          >
            <span className="text-lg font-medium leading-none">−</span>
          </button>

          <span className="w-10 text-center text-sm font-semibold text-gray-900 select-none">
            {item.quantity}
          </span>

          <button
            type="button"
            onClick={handleIncrement}
            disabled={isMaxQuantity || isPending}
            className="w-9 h-9 flex items-center justify-center text-gray-600 hover:bg-gray-100 active:bg-gray-200 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
            title={isMaxQuantity ? 'Cannot exceed available stock' : 'Increase quantity'}
          >
            <span className="text-lg font-medium leading-none">+</span>
          </button>
        </div>

        {/* Line Total */}
        <div className="text-right min-w-[5rem]">
          <span className="block text-base font-bold text-indigo-600">
            {formattedLineTotal}
          </span>
          <span className="text-xs text-gray-400">Total</span>
        </div>

        {/* Remove Button */}
        <button
          type="button"
          onClick={handleRemove}
          disabled={isPending}
          className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-xl transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
          title="Remove item"
        >
          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" strokeWidth={1.75} stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" d="m14.74 9-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 0 1-2.244 2.077H8.084a2.25 2.25 0 0 1-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 0 0-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 0 1 3.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 0 0-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 0 0-7.5 0" />
          </svg>
        </button>
      </div>
    </div>
  );
};

export default CartItem;
