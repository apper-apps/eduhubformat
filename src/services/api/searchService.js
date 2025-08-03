import { getCourses } from './courseService';
import { getProducts } from './productService';

// Popular search keywords - could be fetched from analytics
const POPULAR_KEYWORDS = [
  'React',
  'JavaScript',
  'Python',
  '웹 개발',
  '데이터 사이언스',
  '머신러닝',
  'UI/UX',
  '포토샵',
  '일러스트',
  '영어회화'
];

// Search suggestions based on available content
const SEARCH_SUGGESTIONS = [
  'React 기초',
  'JavaScript ES6',
  'Python 데이터 분석',
  'UI/UX 디자인',
  '웹 개발 완주',
  '머신러닝 입문',
  '포토샵 실무',
  '영어 회화',
  '데이터 시각화',
  '프론트엔드 개발'
];

let searchHistory = [];

/**
 * Get popular search keywords
 */
export const getPopularKeywords = () => {
  return POPULAR_KEYWORDS;
};

/**
 * Get search suggestions based on query
 */
export const getSearchSuggestions = (query) => {
  if (!query || query.length < 2) {
    return [];
  }
  
  const lowerQuery = query.toLowerCase();
  return SEARCH_SUGGESTIONS
    .filter(suggestion => 
      suggestion.toLowerCase().includes(lowerQuery)
    )
    .slice(0, 5);
};

/**
 * Add search term to history
 */
export const addToSearchHistory = (query) => {
  if (!query.trim()) return;
  
  // Remove if already exists
  searchHistory = searchHistory.filter(item => item !== query);
  
  // Add to beginning
  searchHistory.unshift(query);
  
  // Keep only last 10 searches
  searchHistory = searchHistory.slice(0, 10);
};

/**
 * Get search history
 */
export const getSearchHistory = () => {
  return searchHistory;
};

/**
 * Clear search history
 */
export const clearSearchHistory = () => {
  searchHistory = [];
};

/**
 * Global search function - searches both courses and products
 */
export const globalSearch = async (query, options = {}) => {
  if (!query.trim()) {
    return {
      courses: [],
      products: [],
      total: 0,
      searchTime: 0
    };
  }

  const startTime = Date.now();
  
  try {
    // Search courses and products in parallel
    const [courses, products] = await Promise.all([
      searchCourses(query, options),
      searchProducts(query, options)
    ]);

    const searchTime = Date.now() - startTime;
    
    // Add to search history
    addToSearchHistory(query);

    return {
      courses,
      products,
      total: courses.length + products.length,
      searchTime,
      query
    };
  } catch (error) {
    console.error('Global search error:', error);
    throw new Error('검색 중 오류가 발생했습니다.');
  }
};

/**
 * Search courses
 */
const searchCourses = async (query, options = {}) => {
  try {
    const courses = await getCourses();
    const lowerQuery = query.toLowerCase();
    
    return courses.filter(course => {
      const searchFields = [
        course.title,
        course.description,
        course.instructor,
        course.category
      ];
      
      return searchFields.some(field => 
        field && field.toLowerCase().includes(lowerQuery)
      );
    });
  } catch (error) {
    console.error('Course search error:', error);
    return [];
  }
};

/**
 * Search products
 */
const searchProducts = async (query, options = {}) => {
  try {
    const products = await getProducts();
    const lowerQuery = query.toLowerCase();
    
    return products.filter(product => {
      const searchFields = [
        product.name,
        product.description,
        product.category
      ];
      
      return searchFields.some(field => 
        field && field.toLowerCase().includes(lowerQuery)
      );
    });
  } catch (error) {
    console.error('Product search error:', error);
    return [];
  }
};

/**
 * Highlight search terms in text
 */
export const highlightSearchTerm = (text, searchTerm) => {
  if (!text || !searchTerm) return text;
  
  const regex = new RegExp(`(${searchTerm})`, 'gi');
  return text.replace(regex, '<mark class="bg-yellow-200 px-1 rounded">$1</mark>');
};

/**
 * Sort search results
 */
export const sortSearchResults = (results, sortBy = 'relevance') => {
  const sorted = [...results];
  
  switch (sortBy) {
    case 'alphabetical':
      return sorted.sort((a, b) => {
        const nameA = a.title || a.name || '';
        const nameB = b.title || b.name || '';
        return nameA.localeCompare(nameB);
      });
      
    case 'date':
      return sorted.sort((a, b) => {
        const dateA = new Date(a.createdAt || 0);
        const dateB = new Date(b.createdAt || 0);
        return dateB - dateA;
      });
      
    case 'price_low':
      return sorted.sort((a, b) => (a.price || 0) - (b.price || 0));
      
    case 'price_high':
      return sorted.sort((a, b) => (b.price || 0) - (a.price || 0));
      
    case 'relevance':
    default:
      // For relevance, we could implement a more sophisticated scoring system
      // For now, just return as-is since the search already filters by relevance
      return sorted;
  }
};