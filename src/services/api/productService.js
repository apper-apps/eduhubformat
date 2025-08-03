import productsData from '@/services/mockData/products.json';

// Create a copy of the data to avoid mutations
let products = [...productsData];
let nextId = Math.max(...products.map(p => p.Id), 0) + 1;

export const getProducts = () => {
  return Promise.resolve([...products]);
};

export const getProductById = (id) => {
  const productId = parseInt(id);
  if (isNaN(productId)) {
    return Promise.reject(new Error('Invalid product ID'));
  }
  
  const product = products.find(p => p.Id === productId);
  if (!product) {
    return Promise.reject(new Error('Product not found'));
  }
  
  return Promise.resolve({ ...product });
};

export const getPurchasedProducts = async (userId) => {
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 200));
  
  // Mock purchased products for user
  const purchasedProductIds = [1, 3, 5]; // Example purchased product IDs
  
  return products.filter(product => purchasedProductIds.includes(product.Id));
};

export const createProduct = (productData) => {
  const newProduct = {
    ...productData,
    Id: nextId++,
    createdAt: new Date().toISOString()
  };
  
  products.push(newProduct);
  return Promise.resolve({ ...newProduct });
};

export const updateProduct = (id, updateData) => {
  const productId = parseInt(id);
  if (isNaN(productId)) {
    return Promise.reject(new Error('Invalid product ID'));
  }
  
  const index = products.findIndex(p => p.Id === productId);
  if (index === -1) {
    return Promise.reject(new Error('Product not found'));
  }
  
  products[index] = { ...products[index], ...updateData };
  return Promise.resolve({ ...products[index] });
};

export const deleteProduct = (id) => {
  const productId = parseInt(id);
  if (isNaN(productId)) {
    return Promise.reject(new Error('Invalid product ID'));
  }
  
  const index = products.findIndex(p => p.Id === productId);
  if (index === -1) {
    return Promise.reject(new Error('Product not found'));
  }
  
  const deletedProduct = products.splice(index, 1)[0];
  return Promise.resolve({ ...deletedProduct });
};

export const searchProducts = (query) => {
  const searchTerm = query.toLowerCase();
  const filtered = products.filter(product => 
    product.name.toLowerCase().includes(searchTerm) ||
    product.description.toLowerCase().includes(searchTerm) ||
    product.category.toLowerCase().includes(searchTerm)
  );
  
  return Promise.resolve([...filtered]);
};

export const getProductsByCategory = (category) => {
if (category === '전체') {
    return getProducts();
  }
  
  const filtered = products.filter(product => product.category === category);
  return Promise.resolve([...filtered]);
};

// Stock management functions
export const reduceStock = async (productId, quantity) => {
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 100));
  
  const product = products.find(p => p.Id === productId);
  if (!product) {
    throw new Error('상품을 찾을 수 없습니다.');
  }
  
  if (product.stock < quantity) {
    throw new Error('재고가 부족합니다.');
  }
  
  // Reduce stock
  product.stock -= quantity;
  
  // Update stock status
  if (product.stock === 0) {
    product.isInStock = false;
  }
  
  return { ...product };
};

export const checkStockAvailability = async (productId, quantity = 1) => {
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 50));
  
  const product = products.find(p => p.Id === productId);
  if (!product) {
    throw new Error('상품을 찾을 수 없습니다.');
  }
  
  return {
    available: product.stock >= quantity && product.isInStock,
    currentStock: product.stock,
    isInStock: product.isInStock,
    isLowStock: product.stock > 0 && product.stock <= 5
  };
};

export const isLowStock = (product) => {
  return product.stock > 0 && product.stock <= 5;
};

export const getStockStatus = (product) => {
  if (product.stock === 0 || !product.isInStock) {
    return 'out_of_stock';
  } else if (isLowStock(product)) {
    return 'low_stock';
  } else {
    return 'in_stock';
  }
};

export const restockProduct = async (productId, newStock) => {
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 200));
  
  const productIdInt = parseInt(productId);
  if (isNaN(productIdInt)) {
    throw new Error('Invalid product ID');
  }
  
  const product = products.find(p => p.Id === productIdInt);
  if (!product) {
    throw new Error('Product not found');
  }
  
  // Update stock
  product.stock = newStock;
  product.isInStock = newStock > 0;
  
  // Trigger restock notifications
  if (newStock > 0) {
    // Import notification service dynamically to avoid circular dependency
    const { sendRestockNotifications } = await import('./notificationService.js');
    const notificationResult = await sendRestockNotifications(productIdInt);
    
    return {
      product: { ...product },
      notificationsSent: notificationResult.notificationsSent
    };
  }
  
  return { product: { ...product }, notificationsSent: 0 };
};