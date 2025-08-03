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