import React, { createContext, useContext, useReducer } from 'react';

const CartContext = createContext(null);
const COMMISSION_RATE = 0.1;

const cartReducer = (state, action) => {
  switch (action.type) {
    case 'ADD_ITEM': {
      const existingItem = state.items.find(item => item.id === action.payload.id);
      if (existingItem) {
        return {
          ...state,
          items: state.items.map(item =>
            item.id === action.payload.id
              ? { ...item, quantity: item.quantity + 1 }
              : item
          ),
        };
      }
      return {
        ...state,
        items: [...state.items, { ...action.payload, quantity: 1 }],
      };
    }
    case 'REMOVE_ITEM':
      return {
        ...state,
        items: state.items.filter(item => item.id !== action.payload),
      };
    case 'UPDATE_QUANTITY':
      return {
        ...state,
        items: state.items.map(item =>
          item.id === action.payload.id
            ? { ...item, quantity: action.payload.quantity }
            : item
        ),
      };
    case 'CLEAR_CART':
      return {
        ...state,
        items: [],
      };
    case 'SET_BOOKING':
      return {
        ...state,
        booking: action.payload,
      };
    default:
      return state;
  }
};

const initialState = {
  items: [],
  booking: null,
};

export const CartProvider = ({ children }) => {
  const [state, dispatch] = useReducer(cartReducer, initialState);

  const addItem = (item) => dispatch({ type: 'ADD_ITEM', payload: item });
  const removeItem = (id) => dispatch({ type: 'REMOVE_ITEM', payload: id });
  const updateQuantity = (id, quantity) => dispatch({ type: 'UPDATE_QUANTITY', payload: { id, quantity } });
  const clearCart = () => dispatch({ type: 'CLEAR_CART' });
  const setBooking = (booking) => dispatch({ type: 'SET_BOOKING', payload: booking });

  const total = state.items.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  const itemCount = state.items.reduce((sum, item) => sum + item.quantity, 0);

  const gst = total * 0.05;
  const qst = total * 0.09975;
  const grandTotal = total + gst + qst;

  const platformFee = total * COMMISSION_RATE;
  const providerPayout = total - platformFee;

  return (
    <CartContext.Provider value={{
      items: state.items,
      booking: state.booking,
      total,
      gst,
      qst,
      grandTotal,
      itemCount,
      commissionRate: COMMISSION_RATE,
      platformFee,
      providerPayout,
      addItem,
      removeItem,
      updateQuantity,
      clearCart,
      setBooking,
    }}>
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
};
