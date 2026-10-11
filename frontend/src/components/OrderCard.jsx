import { useNavigate } from 'react-router-dom';

const OrderCard = ({ order }) => {
  const navigate = useNavigate();

  const formattedDate = new Date(order.createdAt).toLocaleDateString('en-IN', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });

  const formattedTotal = `₹${(order.totalAmount || 0).toLocaleString('en-IN')}`;
  const shortId = `#${order._id.slice(-8).toUpperCase()}`;

  const statusColors = {
    PLACED: 'bg-blue-100 text-blue-800 border-blue-200',
    CONFIRMED: 'bg-indigo-100 text-indigo-800 border-indigo-200',
    SHIPPED: 'bg-amber-100 text-amber-800 border-amber-200',
    DELIVERED: 'bg-green-100 text-green-800 border-green-200',
    PENDING_PAYMENT: 'bg-gray-100 text-gray-800 border-gray-200',
  };

  const steps = ['PLACED', 'CONFIRMED', 'SHIPPED', 'DELIVERED'];
  const currentStepIndex = steps.indexOf(order.status);

  return (
    <div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden hover:shadow-md transition-shadow duration-200">
      {/* Header bar */}
      <div className="p-4 sm:p-5 bg-gray-50 border-b border-gray-200 flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <div>
            <span className="text-xs uppercase tracking-wider text-gray-400 font-semibold block">Order</span>
            <span className="font-mono font-bold text-gray-900 text-sm sm:text-base">{shortId}</span>
          </div>
          <span className="text-gray-300">|</span>
          <div>
            <span className="text-xs uppercase tracking-wider text-gray-400 font-semibold block">Date</span>
            <span className="text-xs sm:text-sm text-gray-600 font-medium">{formattedDate}</span>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <span className={`px-3 py-1 rounded-full text-xs font-bold border ${statusColors[order.status] || 'bg-gray-100 text-gray-800'}`}>
            {order.status}
          </span>
          <span className="text-base sm:text-lg font-extrabold text-indigo-600">
            {formattedTotal}
          </span>
        </div>
      </div>

      {/* Body: Items Preview */}
      <div className="p-5 sm:p-6">
        <div className="space-y-3 mb-5">
          {order.items.map((item, idx) => (
            <div key={idx} className="flex items-center gap-4">
              <div className="w-12 h-12 bg-gray-100 rounded-lg overflow-hidden shrink-0 border border-gray-100 flex items-center justify-center">
                <img
                  src={item.image}
                  alt={item.name}
                  className="w-full h-full object-cover"
                  onError={(e) => {
                    e.target.src = 'https://placehold.co/100x100/e2e8f0/94a3b8?text=No+Image';
                  }}
                />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-semibold text-gray-900 truncate">{item.name}</p>
                <p className="text-xs text-gray-500">
                  Qty: {item.quantity} × ₹{(item.price || 0).toLocaleString('en-IN')}
                </p>
              </div>
              <div className="text-right">
                <span className="text-sm font-medium text-gray-700">
                  ₹{((item.price || 0) * item.quantity).toLocaleString('en-IN')}
                </span>
              </div>
            </div>
          ))}
        </div>

        {/* Bonus: Visual Status Stepper */}
        {currentStepIndex !== -1 && (
          <div className="my-5 pt-4 border-t border-gray-100">
            <div className="flex items-center justify-between relative">
              <div className="absolute left-0 top-1/2 -translate-y-1/2 h-1 bg-gray-200 w-full z-0"></div>
              <div
                className="absolute left-0 top-1/2 -translate-y-1/2 h-1 bg-indigo-600 z-0 transition-all duration-300"
                style={{
                  width: `${(currentStepIndex / (steps.length - 1)) * 100}%`,
                }}
              ></div>

              {steps.map((step, idx) => {
                const isCompleted = idx <= currentStepIndex;
                const isCurrent = idx === currentStepIndex;
                return (
                  <div key={step} className="relative z-10 flex flex-col items-center">
                    <div
                      className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold transition-colors ${
                        isCompleted
                          ? 'bg-indigo-600 text-white'
                          : 'bg-white border-2 border-gray-300 text-gray-400'
                      } ${isCurrent ? 'ring-4 ring-indigo-100' : ''}`}
                    >
                      {idx + 1}
                    </div>
                    <span className="text-[10px] font-semibold text-gray-500 mt-1 uppercase tracking-tight hidden sm:block">
                      {step}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* Footer actions */}
        <div className="flex justify-end pt-3 border-t border-gray-100">
          <button
            type="button"
            onClick={() => navigate(`/orders/${order._id}`)}
            className="px-5 py-2 text-sm font-semibold text-indigo-600 bg-indigo-50 hover:bg-indigo-100 rounded-xl transition-colors"
          >
            View Details →
          </button>
        </div>
      </div>
    </div>
  );
};

export default OrderCard;
