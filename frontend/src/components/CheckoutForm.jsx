import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { clearCart } from '../features/cart/cartSlice';
import { createPaymentOrderApi, verifyPaymentApi, paymentFailedApi } from '../services/api';

const CheckoutForm = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const [formData, setFormData] = useState({
    fullName: '',
    phone: '',
    addressLine1: '',
    city: '',
    state: '',
    pincode: '',
  });

  const [fieldErrors, setFieldErrors] = useState({});
  const [generalError, setGeneralError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (fieldErrors[name]) {
      setFieldErrors((prev) => ({ ...prev, [name]: '' }));
    }
  };

  const validate = () => {
    const errors = {};

    if (!formData.fullName.trim()) {
      errors.fullName = 'Full Name is required';
    }

    if (!formData.phone.trim()) {
      errors.phone = 'Phone number is required';
    } else if (!/^[6-9]\d{9}$/.test(formData.phone.trim())) {
      errors.phone = 'Phone must be a valid 10-digit Indian mobile number';
    }

    if (!formData.addressLine1.trim()) {
      errors.addressLine1 = 'Address is required';
    }

    if (!formData.city.trim()) {
      errors.city = 'City is required';
    }

    if (!formData.state.trim()) {
      errors.state = 'State is required';
    }

    if (!formData.pincode.trim()) {
      errors.pincode = 'Pincode is required';
    } else if (!/^\d{6}$/.test(formData.pincode.trim())) {
      errors.pincode = 'Pincode must contain 6 digits';
    }

    setFieldErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const loadRazorpayScript = () => {
    return new Promise((resolve) => {
      if (window.Razorpay) {
        return resolve(true);
      }
      const script = document.createElement('script');
      script.src = 'https://checkout.razorpay.com/v1/checkout.js';
      script.onload = () => resolve(true);
      script.onerror = () => resolve(false);
      document.body.appendChild(script);
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setGeneralError('');

    if (!validate()) {
      return;
    }

    setLoading(true);

    try {
      // 1. Create payment order on server (client passes ONLY shippingAddress)
      const shippingAddress = {
        fullName: formData.fullName.trim(),
        phone: formData.phone.trim(),
        addressLine1: formData.addressLine1.trim(),
        city: formData.city.trim(),
        state: formData.state.trim(),
        pincode: formData.pincode.trim(),
      };

      const response = await createPaymentOrderApi(shippingAddress);
      const data = response.data;

      // 2. Load Razorpay script dynamically
      const scriptLoaded = await loadRazorpayScript();
      if (!scriptLoaded || !window.Razorpay) {
        setGeneralError('Failed to load Razorpay SDK. Please check your internet connection and try again.');
        setLoading(false);
        return;
      }

      // 3. Configure and open Razorpay
      const options = {
        key: data.key,
        amount: data.amount,
        currency: data.currency,
        name: 'ShopKart',
        description: 'ShopKart Order Payment',
        order_id: data.razorpayOrderId,
        prefill: {
          name: shippingAddress.fullName,
          contact: shippingAddress.phone,
        },
        theme: {
          color: '#4f46e5',
        },
        handler: async function (paymentResponse) {
          try {
            // Forward payment response parameters to verify-payment endpoint
            await verifyPaymentApi({
              shopKartOrderId: data.shopKartOrderId,
              razorpay_order_id: paymentResponse.razorpay_order_id,
              razorpay_payment_id: paymentResponse.razorpay_payment_id,
              razorpay_signature: paymentResponse.razorpay_signature,
            });

            // Dispatches cart clear action on successful payment verification
            dispatch(clearCart());
            navigate(`/order-success/${data.shopKartOrderId}`);
          } catch (err) {
            setGeneralError(err.response?.data?.message || 'Payment verification failed. Please contact support.');
            setLoading(false);
          }
        },
        modal: {
          ondismiss: function () {
            paymentFailedApi({ shopKartOrderId: data.shopKartOrderId }).catch(() => {});
            setLoading(false);
            setGeneralError('Payment failed. Your cart has not been cleared. Please try again.');
          },
        },
      };

      const rzp = new window.Razorpay(options);
      rzp.on('payment.failed', function () {
        paymentFailedApi({ shopKartOrderId: data.shopKartOrderId }).catch(() => {});
        setLoading(false);
        setGeneralError('Payment failed. Your cart has not been cleared. Please try again.');
      });

      rzp.open();
    } catch (err) {
      setLoading(false);
      setGeneralError(err.response?.data?.message || 'Failed to initiate order. Please try again.');
    }
  };

  return (
    <form onSubmit={handleSubmit} className="bg-white rounded-2xl border border-gray-200 p-6 sm:p-8 shadow-sm">
      <h2 className="text-xl font-bold text-gray-900 mb-6 pb-3 border-b border-gray-100 flex items-center gap-2">
        <svg className="w-5 h-5 text-indigo-600" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" d="M15 10.5a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z" />
          <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1 1 15 0Z" />
        </svg>
        Shipping Address
      </h2>

      {generalError && (
        <div className="mb-6 flex items-start gap-3 p-4 bg-red-50 border border-red-200 text-red-700 rounded-xl text-sm font-medium">
          <svg className="w-5 h-5 shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m9-.75a9 9 0 1 1-18 0 9 9 0 0 1 18 0Zm-9 3.75h.008v.008H12v-.008Z" />
          </svg>
          <span>{generalError}</span>
        </div>
      )}

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
        {/* Full Name */}
        <div className="sm:col-span-2">
          <label htmlFor="fullName" className="block text-sm font-medium text-gray-700 mb-1.5">
            Full Name <span className="text-red-500">*</span>
          </label>
          <input
            id="fullName"
            name="fullName"
            type="text"
            placeholder="John Doe"
            value={formData.fullName}
            onChange={handleChange}
            className={`w-full px-4 py-3 border rounded-xl bg-white text-gray-900 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-shadow ${
              fieldErrors.fullName ? 'border-red-400 ring-1 ring-red-400' : 'border-gray-300'
            }`}
          />
          {fieldErrors.fullName && (
            <p className="text-xs text-red-600 mt-1 font-medium">{fieldErrors.fullName}</p>
          )}
        </div>

        {/* Phone */}
        <div className="sm:col-span-2">
          <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-1.5">
            Phone Number (10-digit Indian Mobile) <span className="text-red-500">*</span>
          </label>
          <div className="relative">
            <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-gray-400 font-medium text-sm">
              +91
            </span>
            <input
              id="phone"
              name="phone"
              type="tel"
              maxLength="10"
              placeholder="9876543210"
              value={formData.phone}
              onChange={handleChange}
              className={`w-full pl-12 pr-4 py-3 border rounded-xl bg-white text-gray-900 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-shadow ${
                fieldErrors.phone ? 'border-red-400 ring-1 ring-red-400' : 'border-gray-300'
              }`}
            />
          </div>
          {fieldErrors.phone && (
            <p className="text-xs text-red-600 mt-1 font-medium">{fieldErrors.phone}</p>
          )}
        </div>

        {/* Address */}
        <div className="sm:col-span-2">
          <label htmlFor="addressLine1" className="block text-sm font-medium text-gray-700 mb-1.5">
            Street Address <span className="text-red-500">*</span>
          </label>
          <input
            id="addressLine1"
            name="addressLine1"
            type="text"
            placeholder="Flat / House No., Street, Landmark"
            value={formData.addressLine1}
            onChange={handleChange}
            className={`w-full px-4 py-3 border rounded-xl bg-white text-gray-900 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-shadow ${
              fieldErrors.addressLine1 ? 'border-red-400 ring-1 ring-red-400' : 'border-gray-300'
            }`}
          />
          {fieldErrors.addressLine1 && (
            <p className="text-xs text-red-600 mt-1 font-medium">{fieldErrors.addressLine1}</p>
          )}
        </div>

        {/* City */}
        <div>
          <label htmlFor="city" className="block text-sm font-medium text-gray-700 mb-1.5">
            City <span className="text-red-500">*</span>
          </label>
          <input
            id="city"
            name="city"
            type="text"
            placeholder="Bengaluru"
            value={formData.city}
            onChange={handleChange}
            className={`w-full px-4 py-3 border rounded-xl bg-white text-gray-900 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-shadow ${
              fieldErrors.city ? 'border-red-400 ring-1 ring-red-400' : 'border-gray-300'
            }`}
          />
          {fieldErrors.city && (
            <p className="text-xs text-red-600 mt-1 font-medium">{fieldErrors.city}</p>
          )}
        </div>

        {/* State */}
        <div>
          <label htmlFor="state" className="block text-sm font-medium text-gray-700 mb-1.5">
            State <span className="text-red-500">*</span>
          </label>
          <input
            id="state"
            name="state"
            type="text"
            placeholder="Karnataka"
            value={formData.state}
            onChange={handleChange}
            className={`w-full px-4 py-3 border rounded-xl bg-white text-gray-900 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-shadow ${
              fieldErrors.state ? 'border-red-400 ring-1 ring-red-400' : 'border-gray-300'
            }`}
          />
          {fieldErrors.state && (
            <p className="text-xs text-red-600 mt-1 font-medium">{fieldErrors.state}</p>
          )}
        </div>

        {/* Pincode */}
        <div className="sm:col-span-2">
          <label htmlFor="pincode" className="block text-sm font-medium text-gray-700 mb-1.5">
            Pincode (6 digits) <span className="text-red-500">*</span>
          </label>
          <input
            id="pincode"
            name="pincode"
            type="text"
            maxLength="6"
            placeholder="560001"
            value={formData.pincode}
            onChange={handleChange}
            className={`w-full px-4 py-3 border rounded-xl bg-white text-gray-900 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-shadow ${
              fieldErrors.pincode ? 'border-red-400 ring-1 ring-red-400' : 'border-gray-300'
            }`}
          />
          {fieldErrors.pincode && (
            <p className="text-xs text-red-600 mt-1 font-medium">{fieldErrors.pincode}</p>
          )}
        </div>
      </div>

      {/* Submit Button */}
      <div className="mt-8 pt-6 border-t border-gray-100">
        <button
          type="submit"
          disabled={loading}
          className="w-full py-3.5 bg-indigo-600 text-white font-semibold rounded-xl hover:bg-indigo-700 active:bg-indigo-800 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 transition-all duration-150 shadow-sm hover:shadow-md disabled:opacity-60 disabled:cursor-not-allowed flex items-center justify-center gap-2"
        >
          {loading ? (
            <>
              <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
              <span>Processing Order...</span>
            </>
          ) : (
            <>
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 8.25h19.5M2.25 9h19.5m-16.5 5.25h6m-6 2.25h3m-3.75 3h15a2.25 2.25 0 0 0 2.25-2.25V6.75A2.25 2.25 0 0 0 19.5 4.5h-15a2.25 2.25 0 0 0-2.25 2.25v10.5A2.25 2.25 0 0 0 2.25 19.5Z" />
              </svg>
              <span>Pay with Razorpay</span>
            </>
          )}
        </button>
        <p className="text-xs text-gray-500 text-center mt-3">
          🔒 Secure 256-bit encrypted payment via Razorpay Test Mode
        </p>
      </div>
    </form>
  );
};

export default CheckoutForm;
