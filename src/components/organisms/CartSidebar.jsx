import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { motion, AnimatePresence } from 'framer-motion';
import { cn } from '@/utils/cn';
import { removeFromCart, updateQuantity, clearCart, closeCart } from '@/store/cartSlice';
import Button from '@/components/atoms/Button';
import ApperIcon from '@/components/ApperIcon';

const CartSidebar = () => {
  const dispatch = useDispatch();
  const { items, totalQuantity, totalAmount, isOpen } = useSelector(state => state.cart);

  const formatPrice = (price) => {
    return new Intl.NumberFormat('ko-KR', {
      style: 'currency',
      currency: 'KRW'
    }).format(price);
  };

  const handleQuantityChange = (itemId, newQuantity) => {
    if (newQuantity === 0) {
      dispatch(removeFromCart(itemId));
    } else {
      dispatch(updateQuantity({ itemId, quantity: newQuantity }));
    }
  };

  const handleCheckout = () => {
    // Here you would typically navigate to checkout page
    alert('결제 페이지로 이동합니다!');
    dispatch(closeCart());
  };

  return (
    <>
      {/* Backdrop */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black bg-opacity-50 z-40"
            onClick={() => dispatch(closeCart())}
          />
        )}
      </AnimatePresence>

      {/* Sidebar */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
            className="fixed top-0 right-0 h-full w-full max-w-md bg-white shadow-elevated z-50 flex flex-col"
          >
            {/* Header */}
            <div className="flex items-center justify-between p-6 border-b border-gray-200">
              <h2 className="text-xl font-semibold text-gray-900">
                장바구니 ({totalQuantity})
              </h2>
              <button
                onClick={() => dispatch(closeCart())}
                className="p-2 hover:bg-gray-100 rounded-full transition-colors"
              >
                <ApperIcon name="X" size={20} />
              </button>
            </div>

            {/* Cart Items */}
            <div className="flex-1 overflow-y-auto p-6">
              {items.length === 0 ? (
                <div className="flex flex-col items-center justify-center h-full text-gray-500">
                  <ApperIcon name="ShoppingCart" size={48} className="mb-4" />
                  <p className="text-lg mb-2">장바구니가 비어있습니다</p>
                  <p className="text-sm">상품을 추가해보세요!</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {items.map((item) => (
                    <motion.div
                      key={item.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -20 }}
                      className="flex items-center space-x-4 bg-gray-50 rounded-lg p-4"
                    >
                      <img
                        src={item.image}
                        alt={item.name}
                        className="w-16 h-16 object-cover rounded-lg"
                      />
                      
                      <div className="flex-1 min-w-0">
                        <h3 className="font-medium text-gray-900 truncate">
                          {item.name}
                        </h3>
                        
                        {Object.keys(item.variants).length > 0 && (
                          <div className="text-sm text-gray-500">
                            {Object.entries(item.variants).map(([key, value]) => (
                              <span key={key} className="mr-2">
                                {key}: {value}
                              </span>
                            ))}
                          </div>
                        )}
                        
                        <div className="flex items-center justify-between mt-2">
                          <span className="font-semibold text-primary-800">
                            {formatPrice(item.price)}
                          </span>
                          
                          <div className="flex items-center space-x-2">
                            <button
                              onClick={() => handleQuantityChange(item.id, item.quantity - 1)}
                              className="w-8 h-8 flex items-center justify-center rounded-full bg-white border border-gray-300 hover:bg-gray-50"
                            >
                              <ApperIcon name="Minus" size={14} />
                            </button>
                            
                            <span className="w-8 text-center font-medium">
                              {item.quantity}
                            </span>
                            
                            <button
                              onClick={() => handleQuantityChange(item.id, item.quantity + 1)}
                              className="w-8 h-8 flex items-center justify-center rounded-full bg-white border border-gray-300 hover:bg-gray-50"
                            >
                              <ApperIcon name="Plus" size={14} />
                            </button>
                          </div>
                        </div>
                      </div>
                      
                      <button
                        onClick={() => dispatch(removeFromCart(item.id))}
                        className="p-2 text-gray-400 hover:text-red-500 transition-colors"
                      >
                        <ApperIcon name="Trash2" size={16} />
                      </button>
                    </motion.div>
                  ))}
                </div>
              )}
            </div>

            {/* Footer */}
            {items.length > 0 && (
              <div className="border-t border-gray-200 p-6 space-y-4">
                <div className="flex justify-between items-center text-lg font-semibold">
                  <span>총 합계</span>
                  <span className="text-primary-800">
                    {formatPrice(totalAmount)}
                  </span>
                </div>
                
                <div className="flex space-x-3">
                  <Button
                    variant="ghost"
                    size="small"
                    onClick={() => dispatch(clearCart())}
                    className="flex-1"
                  >
                    전체 삭제
                  </Button>
                  
                  <Button
                    variant="gradient"
                    size="small"
                    onClick={handleCheckout}
                    className="flex-1"
                  >
                    결제하기
                  </Button>
                </div>
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default CartSidebar;