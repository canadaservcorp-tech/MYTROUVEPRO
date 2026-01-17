import React, { useEffect, useMemo, useRef, useState } from 'react';
import { CreditCard, Lock, AlertCircle, Loader } from 'lucide-react';
import { useCart } from '../contexts/CartContext';

const SquarePayment = ({ language, onSuccess, onError }) => {
  const [card, setCard] = useState(null);
  const [loading, setLoading] = useState(true);
  const [processing, setProcessing] = useState(false);
  const [error, setError] = useState(null);
  const [sdkLoaded, setSdkLoaded] = useState(false);
  const [squareConfig, setSquareConfig] = useState(null);
  const cardContainerRef = useRef(null);
  const { grandTotal, total, items, booking, clearCart } = useCart();

  const content = {
    en: {
      payNow: 'Pay Now',
      processing: 'Processing...',
      securePayment: 'Secure Payment',
      poweredBy: 'Powered by Square',
      loadingPayment: 'Loading payment form...',
      paymentError: 'Payment failed. Please try again.',
      total: 'Total',
    },
    fr: {
      payNow: 'Payer maintenant',
      processing: 'Traitement...',
      securePayment: 'Paiement sécurisé',
      poweredBy: 'Propulsé par Square',
      loadingPayment: 'Chargement du formulaire de paiement...',
      paymentError: 'Echec du paiement. Veuillez reessayer.',
      total: 'Total',
    },
  };

  const t = content[language];

  const apiBase = useMemo(() => {
    const base = import.meta.env.VITE_BACKEND_URL || '';
    return base.replace(/\/$/, '');
  }, []);

  useEffect(() => {
    const fetchConfig = async () => {
      try {
        const response = await fetch(`${apiBase}/api/config`);
        if (!response.ok) {
          throw new Error('Failed to load Square config');
        }
        const data = await response.json();
        setSquareConfig({
          applicationId: data.appId,
          locationId: data.locationId,
          environment: data.environment || 'sandbox',
        });
      } catch (err) {
        setError('Unable to load payment configuration');
        console.error('Square config error:', err);
      }
    };

    fetchConfig();
  }, [apiBase]);

  useEffect(() => {
    if (!squareConfig?.applicationId || !squareConfig?.locationId) return;

    const sdkUrl = squareConfig.environment === 'production'
      ? 'https://web.squarecdn.com/v1/square.js'
      : 'https://sandbox.web.squarecdn.com/v1/square.js';

    if (window.Square) {
      setSdkLoaded(true);
      return;
    }

    const script = document.createElement('script');
    script.src = sdkUrl;
    script.async = true;
    script.onload = () => setSdkLoaded(true);
    script.onerror = () => setError('Failed to load payment system');
    document.body.appendChild(script);
  }, [squareConfig]);

  useEffect(() => {
    const initializeSquare = async () => {
      if (!sdkLoaded || !window.Square || !squareConfig) return;

      try {
        const paymentsInstance = window.Square.payments(
          squareConfig.applicationId,
          squareConfig.locationId
        );

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
  }, [sdkLoaded, squareConfig]);

  const handlePayment = async () => {
    if (!card || processing) return;

    setProcessing(true);
    setError(null);

    try {
      const result = await card.tokenize();

      if (result.status === 'OK') {
        const payload = {
          sourceId: result.token,
          amount: total,
          serviceName: items.map(item => item.name).join(', '),
          customerEmail: booking?.email,
          customerPhone: booking?.phone,
          customerName: booking ? `${booking.firstName} ${booking.lastName}` : undefined,
          providerId: items[0]?.providerId,
          providerName: items[0]?.providerName,
          bookingDate: booking?.date,
          bookingTime: booking?.time,
          address: booking?.address,
        };

        const response = await fetch(`${apiBase}/api/process-payment`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload),
        });

        if (!response.ok) {
          const errorData = await response.json().catch(() => ({}));
          throw new Error(errorData.error || 'Payment failed');
        }

        const paymentData = await response.json();
        clearCart();
        if (onSuccess) {
          onSuccess(paymentData);
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
      setError(err.message || t.paymentError);
      if (onError) onError(err.message);
    } finally {
      setProcessing(false);
    }
  };

  return (
    <div className="bg-white rounded-xl p-6 shadow-lg">
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

      {error && (
        <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg flex items-center text-red-700">
          <AlertCircle size={18} className="mr-2 flex-shrink-0" />
          <span className="text-sm">{error}</span>
        </div>
      )}

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

      <div className="flex justify-between items-center mb-6 py-3 border-t border-gray-200">
        <span className="text-lg font-semibold text-gray-900">{t.total}</span>
        <span className="text-2xl font-bold text-blue-600">
          ${grandTotal.toFixed(2)} CAD
        </span>
      </div>

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

      <div className="mt-4 flex items-center justify-center text-xs text-gray-500">
        <Lock size={12} className="mr-1" />
        256-bit SSL encryption
      </div>
    </div>
  );
};

export default SquarePayment;
