import { useSelector } from 'react-redux';
import { selectCartItems, selectSubtotal, selectTotalUnits } from '../features/cart/cartSlice';

const OrderSummary = () => {
  const cartItems = useSelector(selectCartItems);
  const subtotal = useSelector(selectSubtotal);
  const totalUnits = useSelector(selectTotalUnits);

  const formattedSubtotal = `₹${subtotal.toLocaleString('en-IN')}`;

  return (
    <div className="bg-white rounded-2xl border border-gray-200 p-6 shadow-sm sticky top-24">
      <h2 className="text-lg font-bold text-gray-900 mb-4 pb-3 border-b border-gray-100 flex items-center justify-between">
        <span>Order Summary</span>
        <span className="text-xs font-semibold px-2.5 py-1 bg-indigo-50 text-indigo-700 rounded-full">
          {totalUnits} {totalUnits === 1 ? 'item' : 'items'}
        </span>
      </h2>

      {/* Items list */}
      <div className="divide-y divide-gray-100 max-h-80 overflow-y-auto mb-6 pr-1">
        {cartItems.map((item) => {
          const product = item.product;
          if (!product) return null;
          const lineTotal = (product.price || 0) * item.quantity;
          const formattedLineTotal = `₹${lineTotal.toLocaleString('en-IN')}`;
          const formattedUnitPrice = `₹${(product.price || 0).toLocaleString('en-IN')}`;

          return (
            <div key={product._id || item._id} className="py-3 flex items-center gap-3">
              <div className="w-14 h-14 bg-gray-100 rounded-lg overflow-hidden shrink-0 border border-gray-100 flex items-center justify-center">
                <img
                  src={product.image}
                  alt={product.name}
                  className="w-full h-full object-cover"
                  onError={(e) => {
                    e.target.src = 'https://placehold.co/100x100/e2e8f0/94a3b8?text=No+Image';
                  }}
                />
              </div>

              <div className="flex-1 min-w-0">
                <h4 className="text-sm font-medium text-gray-900 truncate">{product.name}</h4>
                <p className="text-xs text-gray-500 mt-0.5">
                  {item.quantity} × {formattedUnitPrice}
                </p>
              </div>

              <div className="text-right shrink-0">
                <span className="text-sm font-semibold text-gray-900">{formattedLineTotal}</span>
              </div>
            </div>
          );
        })}
      </div>

      {/* Calculation breakdown */}
      <div className="space-y-3 pt-4 border-t border-gray-100 text-sm">
        <div className="flex justify-between text-gray-600">
          <span>Subtotal</span>
          <span className="font-semibold text-gray-900">{formattedSubtotal}</span>
        </div>
        <div className="flex justify-between text-gray-600">
          <span>Shipping</span>
          <span className="text-green-600 font-medium">Free</span>
        </div>
        <div className="pt-3 border-t border-gray-100 flex justify-between text-base font-bold text-gray-900">
          <span>Total</span>
          <span className="text-indigo-600 text-lg">{formattedSubtotal}</span>
        </div>
      </div>
    </div>
  );
};

export default OrderSummary;
