import { createSlice } from '@reduxjs/toolkit';
import { toast } from 'react-toastify';
// Load cart state from localStorage
const loadCartFromStorage = () => {
  try {
    const savedCart = localStorage.getItem('cart');
    if (savedCart) {
      return JSON.parse(savedCart);
    }
  } catch (error) {
    console.error('Failed to load cart from localStorage:', error);
  }
  return {
    items: [],
    totalQuantity: 0,
    totalAmount: 0,
    isOpen: false
  };
};

// Save cart state to localStorage
const saveCartToStorage = (state) => {
  try {
    const cartData = {
      items: state.items,
      totalQuantity: state.totalQuantity,
      totalAmount: state.totalAmount,
      isOpen: false // Don't persist sidebar open state
    };
    localStorage.setItem('cart', JSON.stringify(cartData));
  } catch (error) {
    console.error('Failed to save cart to localStorage:', error);
  }
};

const initialState = loadCartFromStorage();

const cartSlice = createSlice({
  name: 'cart',
  initialState,
  reducers: {
addToCart: (state, action) => {
      const { productId, name, price, quantity = 1, variants = {}, image, stock = 0, isInStock = true } = action.payload;
      
      // Check stock availability
      if (!isInStock || stock === 0) {
        toast.error(`${name}은(는) 현재 품절입니다.`);
        return;
      }
      
      // Create unique key for variants
      const variantKey = Object.keys(variants).length > 0 
        ? Object.entries(variants).map(([k, v]) => `${k}:${v}`).join(',')
        : '';
      
      const existingItemIndex = state.items.findIndex(
        item => item.productId === productId && item.variantKey === variantKey
      );

      let totalRequestedQuantity = quantity;
      if (existingItemIndex >= 0) {
        totalRequestedQuantity += state.items[existingItemIndex].quantity;
      }
      
      // Check if requested quantity exceeds available stock
      if (totalRequestedQuantity > stock) {
        if (stock <= 5) {
          toast.error(`${name}의 재고가 부족합니다. (재고: ${stock}개)`);
        } else {
          toast.error(`요청한 수량이 재고를 초과합니다. (재고: ${stock}개)`);
        }
        return;
      }

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
      
      // Save to localStorage
      saveCartToStorage(state);
      
      // Show appropriate success message based on stock level
      if (stock <= 5) {
        toast.success(`${name}이(가) 장바구니에 추가되었습니다! (재고 부족 상품)`);
      } else {
        toast.success(`${name}이(가) 장바구니에 추가되었습니다!`);
      }
    },

removeFromCart: (state, action) => {
      const itemId = action.payload;
      const itemIndex = state.items.findIndex(item => item.id === itemId);
      
      if (itemIndex >= 0) {
        const item = state.items[itemIndex];
        state.totalQuantity -= item.quantity;
        state.totalAmount -= item.price * item.quantity;
        state.items.splice(itemIndex, 1);
        
        // Save to localStorage
        saveCartToStorage(state);
        
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
        
        // Save to localStorage
        saveCartToStorage(state);
      }
    },

clearCart: (state) => {
      state.items = [];
      state.totalQuantity = 0;
      state.totalAmount = 0;
      
      // Save to localStorage
      saveCartToStorage(state);
      
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