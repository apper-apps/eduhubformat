// Mock data storage for restock notifications
let notifications = [];
let nextId = 1;

export const subscribeToRestockNotification = async (productId, customerEmail) => {
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 200));
  
  const productIdInt = parseInt(productId);
  if (isNaN(productIdInt)) {
    throw new Error('Invalid product ID');
  }
  
  if (!customerEmail || !customerEmail.includes('@')) {
    throw new Error('유효한 이메일 주소를 입력해주세요.');
  }
  
  // Check if already subscribed
  const existing = notifications.find(n => 
    n.productId === productIdInt && n.customerEmail === customerEmail
  );
  
  if (existing) {
    throw new Error('이미 재입고 알림을 신청하셨습니다.');
  }
  
  const notification = {
    Id: nextId++,
    productId: productIdInt,
    customerEmail,
    subscribedAt: new Date().toISOString(),
    isActive: true
  };
  
  notifications.push(notification);
  return { ...notification };
};

export const unsubscribeFromRestockNotification = async (productId, customerEmail) => {
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 200));
  
  const productIdInt = parseInt(productId);
  if (isNaN(productIdInt)) {
    throw new Error('Invalid product ID');
  }
  
  const index = notifications.findIndex(n => 
    n.productId === productIdInt && n.customerEmail === customerEmail
  );
  
  if (index === -1) {
    throw new Error('구독 정보를 찾을 수 없습니다.');
  }
  
  const unsubscribed = notifications.splice(index, 1)[0];
  return { ...unsubscribed };
};

export const checkSubscriptionStatus = async (productId, customerEmail) => {
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 100));
  
  const productIdInt = parseInt(productId);
  if (isNaN(productIdInt)) {
    throw new Error('Invalid product ID');
  }
  
  const subscription = notifications.find(n => 
    n.productId === productIdInt && n.customerEmail === customerEmail && n.isActive
  );
  
  return {
    isSubscribed: !!subscription,
    subscription: subscription ? { ...subscription } : null
  };
};

export const getProductSubscribers = async (productId) => {
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 100));
  
  const productIdInt = parseInt(productId);
  if (isNaN(productIdInt)) {
    throw new Error('Invalid product ID');
  }
  
  const subscribers = notifications.filter(n => 
    n.productId === productIdInt && n.isActive
  );
  
  return [...subscribers];
};

export const getAllNotifications = () => {
  return Promise.resolve([...notifications]);
};

export const sendRestockNotifications = async (productId) => {
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 300));
  
  const productIdInt = parseInt(productId);
  if (isNaN(productIdInt)) {
    throw new Error('Invalid product ID');
  }
  
  const subscribers = notifications.filter(n => 
    n.productId === productIdInt && n.isActive
  );
  
  // Mark notifications as sent
  subscribers.forEach(notification => {
    notification.isActive = false;
    notification.sentAt = new Date().toISOString();
  });
  
  return {
    notificationsSent: subscribers.length,
    subscribers: [...subscribers]
  };
};