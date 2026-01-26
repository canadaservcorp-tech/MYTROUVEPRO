import React, { useEffect, useState, useRef } from 'react';
import { SQUARE_CONFIG, SQUARE_SDK_URL } from '../config/square';
import { useCart } from '../context/CartContext';
import { CreditCard, Lock, CheckCircle, AlertCircle, Loader } from 'lucide-react';

const SquarePayment = ({ language, onSuccess, onError }) => {
  const [card, setCard] = useState(null);
  const [payments, setPayments] = useState(null);
  const [loading, setLoading] = useState(true);
  const [processing, setProcessing] = useState(false);
  const [error, setError] = useState(null);
  const [sdkLoaded, setSdkLoaded] = useState(false);
  const cardContainerRef = useRef(null);
  const { grandTotal, clearCart, items, booking } = useCart();

  const content = {
    en: {
      payNow: 'Pay Now',
      processing: 'Processing...',
      securePayment: 'Secure Payment',
      poweredBy: 'Powered by Square',
      cardNumber: 'Card Number',
      expiry: 'Expiry',
      cvv: 'CVV',
      loadingPayment: 'Loading payment form...',
      paymentSuccess: 'Payment successful!',
      paymentError: 'Payment failed. Please try again.',
      backendUnavailable: 'Payment service unavailable. Please try again later.',
      total: 'Total',
    },
    fr: {
      payNow: 'Payer maintenant',
      processing: 'Traitement...',
      securePayment: 'Paiement sécurisé',
      poweredBy: 'Propulsé par Square',
      cardNumber: 'Numéro de carte',
      expiry: 'Expiration',
      cvv: 'CVV',
      loadingPayment: 'Chargement du formulaire de paiement...',
      paymentSuccess: 'Paiement réussi!',
      paymentError: 'Échec du paiement. Veuillez réessayer.',
      backendUnavailable: 'Service de paiement indisponible. Veuillez réessayer plus tard.',
      total: 'Total',
    }
  };

  const t = content[language];
  const backendUrl = import.meta.env.VITE_BACKEND_URL || '';
  const buildBackendUrl = (path) => {
    if (!backendUrl) return null;
    return `${backendUrl.replace(/\/+$/, '')}${path}`;
  };

  // Load Square SDK
  useEffect(() => {
    const loadSquareSDK = () => {
      if (window.Square) {
        setSdkLoaded(true);
        return;
      }

      const script = document.createElement('script');
      script.src = SQUARE_SDK_URL;
      script.async = true;
      script.onload = () => setSdkLoaded(true);
      script.onerror = () => setError('Failed to load payment system');
      document.body.appendChild(script);
    };

    loadSquareSDK();
  }, []);

  // Initialize Square Payments
  useEffect(() => {
    const initializeSquare = async () => {
      if (!sdkLoaded || !window.Square) return;

      try {
        const paymentsInstance = window.Square.payments(
          SQUARE_CONFIG.applicationId,
          SQUARE_CONFIG.locationId
        );
        setPayments(paymentsInstance);

        const cardInstance = await paymentsInstance.card();
        await cardInstance.attach('#card-container');
        setCard(cardInstance);
        setLoading(false);
      } catch (err) {
        console.error('Square initialization error:', err);
        setError('Failed to initialize payment form');
        setLoading(false);
      }
    };

    initializeSquare();

    return () => {
      if (card) {
        card.destroy();
      }
    };
  }, [sdkLoaded]);

  const handlePayment = async () => {
    if (!card) return;

    setProcessing(true);
    setError(null);

    try {
      const result = await card.tokenize();
      
      if (result.status === 'OK') {
        const endpoint = buildBackendUrl('/api/process-payment');
        if (!endpoint) {
          setError(t.backendUnavailable);
          if (onError) onError(t.backendUnavailable);
          return;
        }

        const customerName = `${booking?.firstName || ''} ${booking?.lastName || ''}`.trim();
        const serviceLabel = items.length === 1
          ? items[0]?.name || 'Service'
          : `Booking (${items.length} services)`;

        const response = await fetch(endpoint, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            sourceId: result.token,
            amount: grandTotal,
            serviceName: serviceLabel,
            customerEmail: booking?.email || undefined,
            customerName: customerName || undefined,
          }),
        });

        const payload = await response.json().catch(() => null);
        if (!response.ok || !payload?.success) {
          const message = payload?.error || t.paymentError;
          setError(message);
          if (onError) onError(message);
          return;
        }

        clearCart();
        if (onSuccess) {
          onSuccess({
            paymentId: payload.payment?.id,
            status: payload.payment?.status,
            receiptUrl: payload.payment?.receiptUrl,
            amount: payload.payment?.amount,
            referenceId: payload.payment?.referenceId,
          });
        }
      } else {
        let errorMessage = t.paymentError;
        if (result.errors) {
          errorMessage = result.errors.map(e => e.message).join(', ');
        }
        setError(errorMessage);
        if (onError) onError(errorMessage);
      }
    } catch (err) {
      console.error('Payment error:', err);
      setError(t.paymentError);
      if (onError) onError(err.message);
    } finally {
      setProcessing(false);
    }
  };

  return (
    <div className="bg-white rounded-xl p-6 shadow-lg">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center">
          <Lock className="text-green-600 mr-2" size={20} />
          <span className="font-semibold text-gray-900">{t.securePayment}</span>
        </div>
        <div className="flex items-center text-gray-500 text-sm">
          <CreditCard size={16} className="mr-1" />
          {t.poweredBy}
        </div>
      </div>

      {/* Error Message */}
      {error && (
        <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg flex items-center text-red-700">
          <AlertCircle size={18} className="mr-2 flex-shrink-0" />
          <span className="text-sm">{error}</span>
        </div>
      )}

      {/* Card Input Container */}
      <div className="mb-6">
        {loading && (
          <div className="flex items-center justify-center py-8 text-gray-500">
            <Loader className="animate-spin mr-2" size={20} />
            {t.loadingPayment}
          </div>
        )}
        <div 
          id="card-container" 
          ref={cardContainerRef}
          className={`min-h-[100px] ${loading ? 'hidden' : ''}`}
          style={{
            padding: '12px',
            border: '1px solid #e5e7eb',
            borderRadius: '8px',
            backgroundColor: '#f9fafb',
          }}
        />
      </div>

      {/* Total */}
      <div className="flex justify-between items-center mb-6 py-3 border-t border-gray-200">
        <span className="text-lg font-semibold text-gray-900">{t.total}</span>
        <span className="text-2xl font-bold text-blue-600">
          ${grandTotal.toFixed(2)} CAD
        </span>
      </div>

      {/* Pay Button */}
      <button
        onClick={handlePayment}
        disabled={loading || processing || !card}
        className={`w-full py-4 rounded-lg font-semibold text-lg flex items-center justify-center transition-all ${
          loading || processing || !card
            ? 'bg-gray-300 cursor-not-allowed text-gray-500'
            : 'bg-green-600 hover:bg-green-700 text-white'
        }`}
      >
        {processing ? (
          <>
            <Loader className="animate-spin mr-2" size={20} />
            {t.processing}
          </>
        ) : (
          <>
            <Lock size={20} className="mr-2" />
            {t.payNow} - ${grandTotal.toFixed(2)}
          </>
        )}
      </button>

      {/* Security Badge */}
      <div className="mt-4 flex items-center justify-center text-xs text-gray-500">
        <Lock size={12} className="mr-1" />
        256-bit SSL encryption
      </div>

      {/* Accepted Cards */}
      <div className="mt-4 flex items-center justify-center space-x-3">
        <img src="https://cdn.jsdelivr.net/gh/lipis/flag-icons/flags/4x3/us.svg" alt="Visa" className="h-6 w-auto opacity-60" />
        <span className="text-gray-400 text-xs">Visa</span>
        <span className="text-gray-400 text-xs">Mastercard</span>
        <span className="text-gray-400 text-xs">Amex</span>
      </div>
    </div>
  );
};

export default SquarePayment;
