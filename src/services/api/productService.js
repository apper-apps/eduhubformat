class ProductService {
  constructor() {
    // Initialize ApperClient with Project ID and Public Key
    const { ApperClient } = window.ApperSDK;
    this.apperClient = new ApperClient({
      apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
      apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
    });
    this.tableName = 'product';
  }

  async getAll() {
    try {
      const params = {
        fields: [
          { field: { Name: "Id" } },
          { field: { Name: "Name" } },
          { field: { Name: "price" } },
          { field: { Name: "originalPrice" } },
          { field: { Name: "images" } },
          { field: { Name: "category" } },
          { field: { Name: "description" } },
          { field: { Name: "specifications" } },
          { field: { Name: "stock" } },
          { field: { Name: "isInStock" } },
          { field: { Name: "rating" } },
          { field: { Name: "reviewCount" } },
          { field: { Name: "features" } },
          { field: { Name: "variants" } },
          { field: { Name: "Tags" } },
          { field: { Name: "Owner" } }
        ],
        orderBy: [
          {
            fieldName: "Name",
            sorttype: "ASC"
          }
        ]
      };

      const response = await this.apperClient.fetchRecords(this.tableName, params);

      if (!response.success) {
        console.error(response.message);
        throw new Error(response.message);
      }

      // Handle empty results
      if (!response.data || response.data.length === 0) {
        return [];
      }

      // Map database fields to UI format
      return response.data.map(product => ({
        Id: product.Id,
        name: product.Name || "",
        price: product.price || 0,
        originalPrice: product.originalPrice || 0,
        images: product.images ? JSON.parse(product.images) : [],
        category: product.category || "",
        description: product.description || "",
        specifications: product.specifications ? JSON.parse(product.specifications) : {},
        stock: product.stock || 0,
        isInStock: product.isInStock || false,
        rating: product.rating || 0,
        reviewCount: product.reviewCount || 0,
        features: product.features ? JSON.parse(product.features) : [],
        variants: product.variants ? JSON.parse(product.variants) : [],
        tags: product.Tags || "",
        owner: product.Owner || null
      }));
    } catch (error) {
      if (error?.response?.data?.message) {
        console.error("Error fetching products:", error?.response?.data?.message);
      } else {
        console.error("Error fetching products:", error.message);
      }
      return [];
    }
  }

  async getById(id) {
    try {
      if (!id) {
        throw new Error("Product ID is required");
      }

      const params = {
        fields: [
          { field: { Name: "Id" } },
          { field: { Name: "Name" } },
          { field: { Name: "price" } },
          { field: { Name: "originalPrice" } },
          { field: { Name: "images" } },
          { field: { Name: "category" } },
          { field: { Name: "description" } },
          { field: { Name: "specifications" } },
          { field: { Name: "stock" } },
          { field: { Name: "isInStock" } },
          { field: { Name: "rating" } },
          { field: { Name: "reviewCount" } },
          { field: { Name: "features" } },
          { field: { Name: "variants" } },
          { field: { Name: "Tags" } },
          { field: { Name: "Owner" } }
        ]
      };

      const response = await this.apperClient.getRecordById(this.tableName, id, params);

      if (!response.success) {
        console.error(response.message);
        throw new Error(response.message);
      }

      if (!response.data) {
        throw new Error(`Product not found with ID: ${id}`);
      }

      const product = response.data;
      
      // Map database fields to UI format
      return {
        Id: product.Id,
        name: product.Name || "",
        price: product.price || 0,
        originalPrice: product.originalPrice || 0,
        images: product.images ? JSON.parse(product.images) : [],
        category: product.category || "",
        description: product.description || "",
        specifications: product.specifications ? JSON.parse(product.specifications) : {},
        stock: product.stock || 0,
        isInStock: product.isInStock || false,
        rating: product.rating || 0,
        reviewCount: product.reviewCount || 0,
        features: product.features ? JSON.parse(product.features) : [],
        variants: product.variants ? JSON.parse(product.variants) : [],
        tags: product.Tags || "",
        owner: product.Owner || null
      };
    } catch (error) {
      if (error?.response?.data?.message) {
        console.error(`Error fetching product with ID ${id}:`, error?.response?.data?.message);
      } else {
        console.error(`Error fetching product with ID ${id}:`, error.message);
      }
      throw error;
    }
  }

  async create(productData) {
    try {
      // Only include Updateable fields
      const params = {
        records: [
          {
            Name: productData.name || "",
            price: productData.price || 0,
            originalPrice: productData.originalPrice || 0,
            images: productData.images ? JSON.stringify(productData.images) : "",
            category: productData.category || "",
            description: productData.description || "",
            specifications: productData.specifications ? JSON.stringify(productData.specifications) : "",
            stock: productData.stock || 0,
            isInStock: productData.isInStock || false,
            rating: productData.rating || 0,
            reviewCount: productData.reviewCount || 0,
            features: productData.features ? JSON.stringify(productData.features) : "",
            variants: productData.variants ? JSON.stringify(productData.variants) : "",
            Tags: productData.tags || "",
            Owner: productData.owner || null
          }
        ]
      };

      const response = await this.apperClient.createRecord(this.tableName, params);

      if (!response.success) {
        console.error(response.message);
        throw new Error(response.message);
      }

      if (response.results) {
        const successfulRecords = response.results.filter(result => result.success);
        const failedRecords = response.results.filter(result => !result.success);

        if (failedRecords.length > 0) {
          console.error(`Failed to create product ${failedRecords.length} records:${JSON.stringify(failedRecords)}`);

          failedRecords.forEach(record => {
            record.errors?.forEach(error => {
              throw new Error(`${error.fieldLabel}: ${error.message}`);
            });
            if (record.message) throw new Error(record.message);
          });
        }
        
        if (successfulRecords.length > 0) {
          const product = successfulRecords[0].data;
          // Map database fields to UI format
          return {
            Id: product.Id,
            name: product.Name || "",
            price: product.price || 0,
            originalPrice: product.originalPrice || 0,
            images: product.images ? JSON.parse(product.images) : [],
            category: product.category || "",
            description: product.description || "",
            specifications: product.specifications ? JSON.parse(product.specifications) : {},
            stock: product.stock || 0,
            isInStock: product.isInStock || false,
            rating: product.rating || 0,
            reviewCount: product.reviewCount || 0,
            features: product.features ? JSON.parse(product.features) : [],
            variants: product.variants ? JSON.parse(product.variants) : [],
            tags: product.Tags || "",
            owner: product.Owner || null
          };
        }
      }
    } catch (error) {
      if (error?.response?.data?.message) {
        console.error("Error creating product:", error?.response?.data?.message);
      } else {
        console.error("Error creating product:", error.message);
      }
      throw error;
    }
  }

  async update(id, productData) {
    try {
      if (!id) {
        throw new Error("Product ID is required");
      }

      // Only include Updateable fields
      const params = {
        records: [
          {
            Id: parseInt(id),
            Name: productData.name || "",
            price: productData.price || 0,
            originalPrice: productData.originalPrice || 0,
            images: productData.images ? JSON.stringify(productData.images) : "",
            category: productData.category || "",
            description: productData.description || "",
            specifications: productData.specifications ? JSON.stringify(productData.specifications) : "",
            stock: productData.stock || 0,
            isInStock: productData.isInStock || false,
            rating: productData.rating || 0,
            reviewCount: productData.reviewCount || 0,
            features: productData.features ? JSON.stringify(productData.features) : "",
            variants: productData.variants ? JSON.stringify(productData.variants) : "",
            Tags: productData.tags || "",
            Owner: productData.owner || null
          }
        ]
      };

      const response = await this.apperClient.updateRecord(this.tableName, params);

      if (!response.success) {
        console.error(response.message);
        throw new Error(response.message);
      }

      if (response.results) {
        const successfulUpdates = response.results.filter(result => result.success);
        const failedUpdates = response.results.filter(result => !result.success);

        if (failedUpdates.length > 0) {
          console.error(`Failed to update product ${failedUpdates.length} records:${JSON.stringify(failedUpdates)}`);

          failedUpdates.forEach(record => {
            record.errors?.forEach(error => {
              throw new Error(`${error.fieldLabel}: ${error.message}`);
            });
            if (record.message) throw new Error(record.message);
          });
        }

        if (successfulUpdates.length > 0) {
          const product = successfulUpdates[0].data;
          // Map database fields to UI format
          return {
            Id: product.Id,
            name: product.Name || "",
            price: product.price || 0,
            originalPrice: product.originalPrice || 0,
            images: product.images ? JSON.parse(product.images) : [],
            category: product.category || "",
            description: product.description || "",
            specifications: product.specifications ? JSON.parse(product.specifications) : {},
            stock: product.stock || 0,
            isInStock: product.isInStock || false,
            rating: product.rating || 0,
            reviewCount: product.reviewCount || 0,
            features: product.features ? JSON.parse(product.features) : [],
            variants: product.variants ? JSON.parse(product.variants) : [],
            tags: product.Tags || "",
            owner: product.Owner || null
          };
        }
      }
    } catch (error) {
      if (error?.response?.data?.message) {
        console.error("Error updating product:", error?.response?.data?.message);
      } else {
        console.error("Error updating product:", error.message);
      }
      throw error;
    }
  }

  async delete(id) {
    try {
      if (!id) {
        throw new Error("Product ID is required for deletion");
      }

      const params = {
        RecordIds: [parseInt(id)]
      };

      const response = await this.apperClient.deleteRecord(this.tableName, params);

      if (!response.success) {
        console.error(response.message);
        throw new Error(response.message);
      }

      if (response.results) {
        const successfulDeletions = response.results.filter(result => result.success);
        const failedDeletions = response.results.filter(result => !result.success);

        if (failedDeletions.length > 0) {
          console.error(`Failed to delete product ${failedDeletions.length} records:${JSON.stringify(failedDeletions)}`);

          failedDeletions.forEach(record => {
            if (record.message) throw new Error(record.message);
          });
        }

        return successfulDeletions.length > 0;
      }
    } catch (error) {
      if (error?.response?.data?.message) {
        console.error("Error deleting product:", error?.response?.data?.message);
      } else {
        console.error("Error deleting product:", error.message);
      }
      throw error;
    }
  }

  async searchProducts(query) {
    try {
      if (!query || query.trim() === '') {
        return this.getAll();
      }

      const params = {
        fields: [
          { field: { Name: "Id" } },
          { field: { Name: "Name" } },
          { field: { Name: "price" } },
          { field: { Name: "originalPrice" } },
          { field: { Name: "images" } },
          { field: { Name: "category" } },
          { field: { Name: "description" } },
          { field: { Name: "specifications" } },
          { field: { Name: "stock" } },
          { field: { Name: "isInStock" } },
          { field: { Name: "rating" } },
          { field: { Name: "reviewCount" } },
          { field: { Name: "features" } },
          { field: { Name: "variants" } },
          { field: { Name: "Tags" } },
          { field: { Name: "Owner" } }
        ],
        where: [
          {
            FieldName: "Name",
            Operator: "Contains",
            Values: [query]
          }
        ]
      };

      const response = await this.apperClient.fetchRecords(this.tableName, params);

      if (!response.success) {
        console.error(response.message);
        throw new Error(response.message);
      }

      // Handle empty results
      if (!response.data || response.data.length === 0) {
        return [];
      }

      // Map database fields to UI format
      return response.data.map(product => ({
        Id: product.Id,
        name: product.Name || "",
        price: product.price || 0,
        originalPrice: product.originalPrice || 0,
        images: product.images ? JSON.parse(product.images) : [],
        category: product.category || "",
        description: product.description || "",
        specifications: product.specifications ? JSON.parse(product.specifications) : {},
        stock: product.stock || 0,
        isInStock: product.isInStock || false,
        rating: product.rating || 0,
        reviewCount: product.reviewCount || 0,
        features: product.features ? JSON.parse(product.features) : [],
        variants: product.variants ? JSON.parse(product.variants) : [],
        tags: product.Tags || "",
        owner: product.Owner || null
      }));
    } catch (error) {
      if (error?.response?.data?.message) {
        console.error("Error searching products:", error?.response?.data?.message);
      } else {
        console.error("Error searching products:", error.message);
      }
      return [];
    }
  }

  async getProductsByCategory(category) {
    try {
      if (!category || category === '전체') {
        return this.getAll();
      }

      const params = {
        fields: [
          { field: { Name: "Id" } },
          { field: { Name: "Name" } },
          { field: { Name: "price" } },
          { field: { Name: "originalPrice" } },
          { field: { Name: "images" } },
          { field: { Name: "category" } },
          { field: { Name: "description" } },
          { field: { Name: "specifications" } },
          { field: { Name: "stock" } },
          { field: { Name: "isInStock" } },
          { field: { Name: "rating" } },
          { field: { Name: "reviewCount" } },
          { field: { Name: "features" } },
          { field: { Name: "variants" } },
          { field: { Name: "Tags" } },
          { field: { Name: "Owner" } }
        ],
        where: [
          {
            FieldName: "category",
            Operator: "EqualTo",
            Values: [category]
          }
        ]
      };

      const response = await this.apperClient.fetchRecords(this.tableName, params);

      if (!response.success) {
        console.error(response.message);
        throw new Error(response.message);
      }

      // Handle empty results
      if (!response.data || response.data.length === 0) {
        return [];
      }

      // Map database fields to UI format
      return response.data.map(product => ({
        Id: product.Id,
        name: product.Name || "",
        price: product.price || 0,
        originalPrice: product.originalPrice || 0,
        images: product.images ? JSON.parse(product.images) : [],
        category: product.category || "",
        description: product.description || "",
        specifications: product.specifications ? JSON.parse(product.specifications) : {},
        stock: product.stock || 0,
        isInStock: product.isInStock || false,
        rating: product.rating || 0,
        reviewCount: product.reviewCount || 0,
        features: product.features ? JSON.parse(product.features) : [],
        variants: product.variants ? JSON.parse(product.variants) : [],
        tags: product.Tags || "",
        owner: product.Owner || null
      }));
    } catch (error) {
      if (error?.response?.data?.message) {
        console.error("Error fetching products by category:", error?.response?.data?.message);
      } else {
        console.error("Error fetching products by category:", error.message);
      }
      return [];
    }
  }

  async reduceStock(productId, quantity) {
    try {
      if (!productId || !quantity) {
        throw new Error('상품 ID와 수량이 필요합니다.');
      }

      const product = await this.getById(productId);
  if (!product) {
    throw new Error('상품을 찾을 수 없습니다.');
  }
  
  if (product.stock < quantity) {
    throw new Error('재고가 부족합니다.');
  }
  
      const newStock = product.stock - quantity;
      const isInStock = newStock > 0;

      return await this.update(productId, {
        ...product,
        stock: newStock,
        isInStock: isInStock
      });
    } catch (error) {
      if (error?.response?.data?.message) {
        console.error("Error reducing stock:", error?.response?.data?.message);
      } else {
        console.error("Error reducing stock:", error.message);
      }
      throw error;
    }
  }

  async checkStockAvailability(productId, quantity = 1) {
    try {
      if (!productId) {
        throw new Error('상품 ID가 필요합니다.');
      }

      const product = await this.getById(productId);
  if (!product) {
    throw new Error('상품을 찾을 수 없습니다.');
  }
  
  return {
    available: product.stock >= quantity && product.isInStock,
    currentStock: product.stock,
    isInStock: product.isInStock,
    isLowStock: product.stock > 0 && product.stock <= 5
  };
    } catch (error) {
      if (error?.response?.data?.message) {
        console.error("Error checking stock availability:", error?.response?.data?.message);
      } else {
        console.error("Error checking stock availability:", error.message);
      }
      throw error;
    }
  }

  isLowStock(product) {
  return product.stock > 0 && product.stock <= 5;
  }

  getStockStatus(product) {
  if (product.stock === 0 || !product.isInStock) {
    return 'out_of_stock';
    } else if (this.isLowStock(product)) {
    return 'low_stock';
  } else {
    return 'in_stock';
  }
  }

  async restockProduct(productId, newStock) {
    try {
      if (!productId) {
        throw new Error('상품 ID가 필요합니다.');
      }

      const product = await this.getById(productId);
  if (!product) {
        throw new Error('상품을 찾을 수 없습니다.');
      }

      const isInStock = newStock > 0;

      const updatedProduct = await this.update(productId, {
        ...product,
        stock: newStock,
        isInStock: isInStock
      });
    
    return {
        product: updatedProduct,
        notificationsSent: 0 // Placeholder for notification service integration
      };
    } catch (error) {
      if (error?.response?.data?.message) {
        console.error("Error restocking product:", error?.response?.data?.message);
      } else {
        console.error("Error restocking product:", error.message);
      }
      throw error;
    }
  }

  // Backward compatibility methods
  async getProducts() {
    return this.getAll();
  }

  async getProductById(id) {
    return this.getById(id);
  }

  async createProduct(productData) {
    return this.create(productData);
  }

  async updateProduct(id, productData) {
    return this.update(id, productData);
  }

  async deleteProduct(id) {
    return this.delete(id);
  }
}

export const productService = new ProductService();

// Export individual functions for backward compatibility
export const getProducts = () => 
  productService.getProducts();

export const getProductById = (id) => 
  productService.getProductById(id);

export const createProduct = (productData) => 
  productService.createProduct(productData);

export const updateProduct = (id, productData) => 
  productService.updateProduct(id, productData);

export const deleteProduct = (id) => 
  productService.deleteProduct(id);

export const searchProducts = (query) => 
  productService.searchProducts(query);

export const getProductsByCategory = (category) => 
  productService.getProductsByCategory(category);

export const reduceStock = (productId, quantity) => 
  productService.reduceStock(productId, quantity);

export const checkStockAvailability = (productId, quantity = 1) => 
  productService.checkStockAvailability(productId, quantity);

export const isLowStock = (product) => 
  productService.isLowStock(product);

export const getStockStatus = (product) => 
  productService.getStockStatus(product);

export const restockProduct = (productId, newStock) => 
  productService.restockProduct(productId, newStock);