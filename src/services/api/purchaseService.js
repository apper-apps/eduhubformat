// Mock purchase data - represents user's course purchases
const purchases = [
  {
    Id: 1,
    userId: 1,
    courseId: 1,
    purchaseDate: '2024-03-01T10:00:00Z',
    price: 299000,
    status: 'completed',
    progress: 75,
    lastAccessedAt: '2024-12-28T14:30:00Z',
    completedLessons: 12,
    totalLessons: 16,
    certificateEarned: false
  },
  {
    Id: 2,
    userId: 1,
    courseId: 2,
    purchaseDate: '2024-03-02T11:00:00Z',
    price: 249000,
    status: 'completed',
    progress: 45,
    lastAccessedAt: '2024-12-27T09:15:00Z',
    completedLessons: 9,
    totalLessons: 20,
    certificateEarned: false
  },
  {
    Id: 3,
    userId: 1,
    courseId: 5,
    purchaseDate: '2024-02-15T16:20:00Z',
    price: 279000,
    status: 'completed',
    progress: 100,
    lastAccessedAt: '2024-04-10T18:45:00Z',
    completedLessons: 18,
    totalLessons: 18,
    certificateEarned: true
  }
];

let nextPurchaseId = 4;

export const getPurchasesByUserId = async (userId) => {
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 200));
  
  return purchases.filter(purchase => purchase.userId === userId).sort((a, b) => 
    new Date(b.purchaseDate) - new Date(a.purchaseDate)
  );
};

export const getPurchaseById = async (purchaseId) => {
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 150));
  
  const purchase = purchases.find(p => p.Id === purchaseId);
  if (!purchase) {
    throw new Error('구매 정보를 찾을 수 없습니다.');
  }
  
  return { ...purchase };
};

export const createPurchase = async (purchaseData) => {
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 300));
  
  const newPurchase = {
    ...purchaseData,
    Id: nextPurchaseId++,
    purchaseDate: new Date().toISOString(),
    progress: 0,
    completedLessons: 0,
    certificateEarned: false,
    lastAccessedAt: new Date().toISOString()
  };
  
  purchases.push(newPurchase);
  return { ...newPurchase };
};

export const updateProgress = async (purchaseId, progressData) => {
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 200));
  
  const purchase = purchases.find(p => p.Id === purchaseId);
  if (!purchase) {
    throw new Error('구매 정보를 찾을 수 없습니다.');
  }
  
  // Update progress fields
  if (progressData.progress !== undefined) {
    purchase.progress = Math.min(progressData.progress, 100);
  }
  if (progressData.completedLessons !== undefined) {
    purchase.completedLessons = progressData.completedLessons;
  }
  if (progressData.lastAccessedAt) {
    purchase.lastAccessedAt = progressData.lastAccessedAt;
  }
  
  // Auto-award certificate if progress is 100%
  if (purchase.progress >= 100) {
    purchase.certificateEarned = true;
  }
  
  return { ...purchase };
};

export const checkCourseOwnership = async (userId, courseId) => {
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 100));
  
  const purchase = purchases.find(p => 
    p.userId === userId && 
    p.courseId === courseId && 
    p.status === 'completed'
  );
  
  return purchase ? { ...purchase } : null;
};

export default purchases;