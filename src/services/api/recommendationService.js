import { getCourses } from '@/services/api/courseService';
import { getProducts } from '@/services/api/productService';

// Simulate user behavior data for recommendations
const userBehaviorData = {
  categoryPreferences: {
    '웹 개발': 0.8,
    '모바일 개발': 0.6,
    '데이터 사이언스': 0.4,
    '디자인': 0.7,
    'AI/ML': 0.5
  },
  purchaseHistory: [
    { courseId: 1, productIds: [1, 2, 3] },
    { courseId: 2, productIds: [2, 4] },
    { courseId: 3, productIds: [1, 5] }
  ],
  viewHistory: [1, 2, 3, 4, 5, 6, 7, 8]
};

// Calculate similarity score between two items based on categories and tags
const calculateSimilarity = (item1, item2) => {
  let score = 0;
  
  // Category similarity (40% weight)
  if (item1.category === item2.category) {
    score += 0.4;
  }
  
  // Tag similarity (30% weight)
  if (item1.tags && item2.tags) {
    const tags1 = new Set(item1.tags);
    const tags2 = new Set(item2.tags);
    const intersection = new Set([...tags1].filter(x => tags2.has(x)));
    const union = new Set([...tags1, ...tags2]);
    const jaccard = intersection.size / union.size;
    score += jaccard * 0.3;
  }
  
  // Difficulty level similarity (20% weight)
  if (item1.level && item2.level) {
    const levels = ['초급', '중급', '고급'];
    const level1Index = levels.indexOf(item1.level);
    const level2Index = levels.indexOf(item2.level);
    const levelSimilarity = 1 - Math.abs(level1Index - level2Index) / (levels.length - 1);
    score += levelSimilarity * 0.2;
  }
  
  // User preference bonus (10% weight)
  if (userBehaviorData.categoryPreferences[item1.category]) {
    score += userBehaviorData.categoryPreferences[item1.category] * 0.1;
  }
  
  return score;
};

// Get related products for a course
export const getRelatedProducts = async (courseId) => {
  try {
    await new Promise(resolve => setTimeout(resolve, 300));
    
    const [courses, products] = await Promise.all([
      getCourses(),
      getProducts()
    ]);
    
    const targetCourse = courses.find(c => c.Id === parseInt(courseId));
    if (!targetCourse) {
      return [];
    }
    
    // Find products with similar categories or that complement the course
    const relatedProducts = products
      .filter(product => {
        // Filter relevant categories
        const relevantCategories = ['교재', '굿즈'];
        return relevantCategories.includes(product.category);
      })
      .map(product => ({
        ...product,
        similarity: calculateSimilarity(targetCourse, product)
      }))
      .sort((a, b) => b.similarity - a.similarity)
      .slice(0, 6);
    
    return relatedProducts;
  } catch (error) {
    console.error('Error fetching related products:', error);
    return [];
  }
};

// Get related courses for a course
export const getRelatedCourses = async (courseId) => {
  try {
    await new Promise(resolve => setTimeout(resolve, 300));
    
    const courses = await getCourses();
    const targetCourse = courses.find(c => c.Id === parseInt(courseId));
    
    if (!targetCourse) {
      return [];
    }
    
    // Find similar courses
    const relatedCourses = courses
      .filter(course => course.Id !== parseInt(courseId)) // Exclude current course
      .map(course => ({
        ...course,
        similarity: calculateSimilarity(targetCourse, course)
      }))
      .sort((a, b) => b.similarity - a.similarity)
      .slice(0, 6);
    
    return relatedCourses;
  } catch (error) {
    console.error('Error fetching related courses:', error);
    return [];
  }
};

// Get recommended courses for homepage
export const getRecommendedCourses = async () => {
  try {
    await new Promise(resolve => setTimeout(resolve, 400));
    
    const courses = await getCourses();
    
    // Apply recommendation algorithm based on user preferences and popularity
    const recommendedCourses = courses
      .map(course => {
        let score = 0;
        
        // Category preference score
        if (userBehaviorData.categoryPreferences[course.category]) {
          score += userBehaviorData.categoryPreferences[course.category] * 0.4;
        }
        
        // Popularity score (based on rating and enrollment)
        if (course.rating) {
          score += (course.rating / 5) * 0.3;
        }
        
        // Recently viewed bonus
        if (userBehaviorData.viewHistory.includes(course.Id)) {
          score += 0.2;
        }
        
        // Random factor for diversity
        score += Math.random() * 0.1;
        
        return {
          ...course,
          recommendationScore: score
        };
      })
      .sort((a, b) => b.recommendationScore - a.recommendationScore)
      .slice(0, 8);
    
    return recommendedCourses;
  } catch (error) {
    console.error('Error fetching recommended courses:', error);
    return [];
  }
};

// Get frequently bought together products
export const getFrequentlyBoughtTogether = async (productId) => {
  try {
    await new Promise(resolve => setTimeout(resolve, 300));
    
    const products = await getProducts();
    const targetProduct = products.find(p => p.Id === parseInt(productId));
    
    if (!targetProduct) {
      return [];
    }
    
    // Simulate frequently bought together logic
    const frequentlyBought = products
      .filter(product => product.Id !== parseInt(productId))
      .map(product => {
        let score = 0;
        
        // Category similarity
        if (product.category === targetProduct.category) {
          score += 0.5;
        }
        
        // Simulated purchase correlation
        const correlationData = {
          1: [2, 3, 4], // Product 1 is often bought with products 2, 3, 4
          2: [1, 3, 5],
          3: [1, 2, 4],
          4: [1, 3, 6],
          5: [2, 6, 7],
          6: [4, 5, 8]
        };
        
        if (correlationData[parseInt(productId)]?.includes(product.Id)) {
          score += 0.8;
        }
        
        // Price compatibility (similar price range)
        const priceDiff = Math.abs(product.price - targetProduct.price);
        const priceCompatibility = Math.max(0, 1 - (priceDiff / Math.max(product.price, targetProduct.price)));
        score += priceCompatibility * 0.2;
        
        return {
          ...product,
          correlationScore: score
        };
      })
      .filter(product => product.correlationScore > 0.3)
      .sort((a, b) => b.correlationScore - a.correlationScore)
      .slice(0, 4);
    
    return frequentlyBought;
  } catch (error) {
    console.error('Error fetching frequently bought together:', error);
    return [];
  }
};

// Get trending courses based on recent activity
export const getTrendingCourses = async () => {
  try {
    await new Promise(resolve => setTimeout(resolve, 300));
    
    const courses = await getCourses();
    
    // Simulate trending algorithm
    const trendingCourses = courses
      .map(course => ({
        ...course,
        trendingScore: Math.random() * course.rating * (course.enrolled / course.capacity)
      }))
      .sort((a, b) => b.trendingScore - a.trendingScore)
      .slice(0, 6);
    
    return trendingCourses;
  } catch (error) {
    console.error('Error fetching trending courses:', error);
    return [];
  }
};