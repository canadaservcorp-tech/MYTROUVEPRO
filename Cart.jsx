import React, { useState } from 'react';
import { useCart } from './CartContext';
import { ShoppingCart, X, Plus, Minus, Trash2 } from 'lucide-react';
import { Link } from 'react-router-dom';

const Cart = ({ language, isOpen, onClose }) => {
  const { items, total, gst, qst, grandTotal, itemCount, removeItem, updateQuantity } = useCart();

  const content = {
    en: {
      cart: 'Shopping Cart',
      empty: 'Your cart is empty',
      browseServices: 'Browse Services',
      subtotal: 'Subtotal',
      gst: 'GST (5%)',
      qst: 'QST (9.975%)',
      total: 'Total',
      checkout: 'Proceed to Checkout',
      remove: 'Remove',
      items: 'items',
    },
    fr: {
      cart: 'Panier',
      empty: 'Votre panier est vide',
      browseServices: 'Parcourir les services',
      subtotal: 'Sous-total',
      gst: 'TPS (5%)',
      qst: 'TVQ (9.975%)',
      total: 'Total',
      checkout: 'Passer à la caisse',
      remove: 'Retirer',
      items: 'articles',
    }
  };

  const t = content[language];

  if (!isOpen) return null;

  return (
    <>
      {/* Overlay */}
      <div 
        className="fixed inset-0 bg-black bg-opacity-50 z-40"
        onClick={onClose}
      />

      {/* Cart Sidebar */}
      <div className="fixed right-0 top-0 h-full w-full max-w-md bg-white shadow-2xl z-50 flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b">
          <div className="flex items-center">
            <ShoppingCart size={24} className="text-blue-600 mr-2" />
            <h2 className="text-xl font-bold">{t.cart}</h2>
            {itemCount > 0 && (
              <span className="ml-2 bg-blue-100 text-blue-600 px-2 py-1 rounded-full text-sm">
                {itemCount} {t.items}
              </span>
            )}
          </div>
          <button 
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-full"
          >
            <X size={24} />
          </button>
        </div>

        {/* Cart Items */}
        <div className="flex-1 overflow-y-auto p-4">
          {items.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full text-gray-500">
              <ShoppingCart size={64} className="mb-4 opacity-30" />
              <p className="text-lg mb-4">{t.empty}</p>
              <Link
                to="/services"
                onClick={onClose}
                className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700"
              >
                {t.browseServices}
              </Link>
            </div>
          ) : (
            <div className="space-y-4">
              {items.map((item) => (
                <div key={item.id} className="flex gap-4 bg-gray-50 p-4 rounded-lg">
                  {/* Image */}
                  <div className="w-20 h-20 bg-gray-200 rounded-lg overflow-hidden flex-shrink-0">
                    {item.image ? (
                      <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-3xl">
                        {item.icon || '🔧'}
                      </div>
                    )}
                  </div>

                  {/* Details */}
                  <div className="flex-1">
                    <h3 className="font-semibold text-gray-900">{item.name}</h3>
                    <p className="text-sm text-gray-500">{item.category}</p>
                    <p className="text-blue-600 font-semibold mt-1">
                      ${item.price.toFixed(2)}
                    </p>

                    {/* Quantity Controls */}
                    <div className="flex items-center mt-2">
                      <button
                        onClick={() => updateQuantity(item.id, Math.max(1, item.quantity - 1))}
                        className="p-1 bg-gray-200 rounded hover:bg-gray-300"
                      >
                        <Minus size={14} />
                      </button>
                      <span className="mx-3 font-medium">{item.quantity}</span>
                      <button
                        onClick={() => updateQuantity(item.id, item.quantity + 1)}
                        className="p-1 bg-gray-200 rounded hover:bg-gray-300"
                      >
                        <Plus size={14} />
                      </button>
                      <button
                        onClick={() => removeItem(item.id)}
                        className="ml-auto p-2 text-red-500 hover:bg-red-50 rounded"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Footer - Totals & Checkout */}
        {items.length > 0 && (
          <div className="border-t p-4 bg-gray-50">
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-gray-600">{t.subtotal}</span>
                <span className="font-medium">${total.toFixed(2)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">{t.gst}</span>
                <span>${gst.toFixed(2)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">{t.qst}</span>
                <span>${qst.toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-lg font-bold pt-2 border-t">
                <span>{t.total}</span>
                <span className="text-blue-600">${grandTotal.toFixed(2)} CAD</span>
              </div>
            </div>

            <Link
              to="/checkout"
              onClick={onClose}
              className="mt-4 w-full bg-green-600 text-white py-3 rounded-lg font-semibold hover:bg-green-700 flex items-center justify-center"
            >
              {t.checkout}
            </Link>
          </div>
        )}
      </div>
    </>
  );
};

export default Cart;
