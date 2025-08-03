import { getCourseById } from '@/services/api/courseService';
import { getProductById } from '@/services/api/productService';

let orders = [
  {
    Id: 1,
    userId: 1,
    items: [
      {
        type: 'course',
        itemId: 1,
        quantity: 1,
        price: 299000,
        title: 'React 마스터클래스: 현대적 웹 개발의 모든 것'
      }
    ],
    totalAmount: 299000,
    status: 'completed',
    paymentMethod: '신용카드',
    orderDate: '2024-03-01T10:00:00Z',
    paymentDate: '2024-03-01T10:05:00Z'
  },
  {
    Id: 2,
    userId: 1,
    items: [
      {
        type: 'course',
        itemId: 2,
        quantity: 1,
        price: 249000,
        title: 'UI/UX 디자인 완전정복: 피그마로 배우는 실무 디자인'
      }
    ],
    totalAmount: 249000,
    status: 'completed',
    paymentMethod: '계좌이체',
    orderDate: '2024-03-02T11:00:00Z',
    paymentDate: '2024-03-02T11:10:00Z'
  },
  {
    Id: 3,
    userId: 1,
    items: [
      {
        type: 'course',
        itemId: 5,
        quantity: 1,
        price: 279000,
        title: 'Python 데이터 분석: 입문부터 실무까지'
      }
    ],
    totalAmount: 279000,
    status: 'completed',
    paymentMethod: '신용카드',
    orderDate: '2024-02-15T16:20:00Z',
    paymentDate: '2024-02-15T16:25:00Z'
  }
];

let nextOrderId = 4;

export const getOrdersByUserId = async (userId) => {
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 200));
  
  return orders.filter(order => order.userId === userId).sort((a, b) => 
    new Date(b.orderDate) - new Date(a.orderDate)
  );
};

export const getOrderById = async (orderId) => {
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 200));
  
  const order = orders.find(o => o.Id === orderId);
  if (!order) {
    throw new Error('주문을 찾을 수 없습니다.');
  }
  
  return { ...order };
};

export const createOrder = async (orderData) => {
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 300));
  
  const newOrder = {
    ...orderData,
    Id: nextOrderId++,
    status: 'pending',
    orderDate: new Date().toISOString()
  };
  
  orders.push(newOrder);
  return { ...newOrder };
};

export const updateOrderStatus = async (orderId, status, paymentDate = null) => {
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 200));
  
  const order = orders.find(o => o.Id === orderId);
  if (!order) {
    throw new Error('주문을 찾을 수 없습니다.');
  }
  
  order.status = status;
  if (paymentDate) {
    order.paymentDate = paymentDate;
  }
  
  return { ...order };
};

export const formatPrice = (price) => {
  return new Intl.NumberFormat('ko-KR').format(price) + '원';
};

export const getStatusText = (status) => {
  const statusMap = {
    'pending': '결제대기',
    'completed': '결제완료',
    'cancelled': '주문취소',
    'refunded': '환불완료'
  };
  
  return statusMap[status] || status;
};

export const getStatusColor = (status) => {
  const colorMap = {
    'pending': 'bg-yellow-100 text-yellow-800',
    'completed': 'bg-green-100 text-green-800',
    'cancelled': 'bg-red-100 text-red-800',
    'refunded': 'bg-gray-100 text-gray-800'
  };
  
  return colorMap[status] || 'bg-gray-100 text-gray-800';
};