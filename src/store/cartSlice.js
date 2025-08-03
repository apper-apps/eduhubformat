import { createSlice } from '@reduxjs/toolkit';
import { toast } from 'react-toastify';

const initialState = {
  items: [],
  totalQuantity: 0,
  totalAmount: 0,
  isOpen: false
};

const cartSlice = createSlice({
  name: 'cart',
  initialState,
  reducers: {
    addToCart: (state, action) => {
      const { productId, name, price, quantity = 1, variants = {}, image } = action.payload;
      
      // Create unique key for variants
      const variantKey = Object.keys(variants).length > 0 
        ? Object.entries(variants).map(([k, v]) => `${k}:${v}`).join(',')
        : '';
      
      const existingItemIndex = state.items.findIndex(
        item => item.productId === productId && item.variantKey === variantKey
      );

      if (existingItemIndex >= 0) {
        state.items[existingItemIndex].quantity += quantity;
      } else {
        state.items.push({
          id: Date.now() + Math.random(),
          productId,
          name,
          price,
          quantity,
          variants,
          variantKey,
          image
        });
      }

      state.totalQuantity += quantity;
      state.totalAmount += price * quantity;
      
      toast.success(`${name}이(가) 장바구니에 추가되었습니다!`);
    },

    removeFromCart: (state, action) => {
      const itemId = action.payload;
      const itemIndex = state.items.findIndex(item => item.id === itemId);
      
      if (itemIndex >= 0) {
        const item = state.items[itemIndex];
        state.totalQuantity -= item.quantity;
        state.totalAmount -= item.price * item.quantity;
        state.items.splice(itemIndex, 1);
        
        toast.success(`${item.name}이(가) 장바구니에서 제거되었습니다.`);
      }
    },

    updateQuantity: (state, action) => {
      const { itemId, quantity } = action.payload;
      const item = state.items.find(item => item.id === itemId);
      
      if (item && quantity > 0) {
        const quantityDiff = quantity - item.quantity;
        state.totalQuantity += quantityDiff;
        state.totalAmount += item.price * quantityDiff;
        item.quantity = quantity;
      }
    },

    clearCart: (state) => {
      state.items = [];
      state.totalQuantity = 0;
      state.totalAmount = 0;
      toast.success('장바구니가 비워졌습니다.');
    },

    toggleCart: (state) => {
      state.isOpen = !state.isOpen;
    },

    closeCart: (state) => {
      state.isOpen = false;
    }
  }
});

export const {
  addToCart,
  removeFromCart,
  updateQuantity,
  clearCart,
  toggleCart,
  closeCart
} = cartSlice.actions;

export default cartSlice.reducer;