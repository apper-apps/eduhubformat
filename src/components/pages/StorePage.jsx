import React from "react";
import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { getProducts, searchProducts, getProductsByCategory } from "@/services/api/productService";
import ProductCard from "@/components/molecules/ProductCard";
import Loading from "@/components/ui/Loading";
import Error from "@/components/ui/Error";
import Empty from "@/components/ui/Empty";
import Button from "@/components/atoms/Button";
import ApperIcon from "@/components/ApperIcon";

const StorePage = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('전체');
  const [sortBy, setSortBy] = useState('popularity');

  const categories = ['전체', '교재', '굿즈', '기타'];
  const sortOptions = [
    { value: 'popularity', label: '인기순' },
    { value: 'latest', label: '최신순' },
    { value: 'price_low', label: '가격 낮은순' },
    { value: 'price_high', label: '가격 높은순' }
  ];

  useEffect(() => {
    loadProducts();
  }, []);

  useEffect(() => {
    handleSearch();
  }, [searchQuery, selectedCategory]);

  const loadProducts = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await getProducts();
      setProducts(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = async () => {
    try {
      setLoading(true);
      let data;
      
      if (searchQuery.trim()) {
        data = await searchProducts(searchQuery);
      } else {
        data = await getProductsByCategory(selectedCategory);
      }
      
      // Apply additional filtering if both search and category are active
      if (searchQuery.trim() && selectedCategory !== '전체') {
        data = data.filter(product => product.category === selectedCategory);
      }
      
      setProducts(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleCategoryChange = (category) => {
    setSelectedCategory(category);
    setSearchQuery(''); // Clear search when changing category
  };

  const handleSortChange = (sortValue) => {
    setSortBy(sortValue);
    
    const sorted = [...products].sort((a, b) => {
      switch (sortValue) {
        case 'latest':
          return new Date(b.createdAt || 0) - new Date(a.createdAt || 0);
        case 'price_low':
          return a.price - b.price;
        case 'price_high':
          return b.price - a.price;
        case 'popularity':
        default:
          return (b.reviewCount || 0) - (a.reviewCount || 0);
      }
    });
    
    setProducts(sorted);
  };

  const filteredProducts = products;

  return (
    <div className="min-h-screen bg-stone-50">
      {/* Page Header */}
      <section className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <motion.div
            className="text-center space-y-4"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <h1 className="text-4xl sm:text-5xl font-bold text-gray-900 korean-text">
              EduHub <span className="text-gradient">스토어</span>
            </h1>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto korean-text">
              학습에 필요한 모든 것을 한 곳에서 만나보세요.
              전자책, 굿즈, 학습 도구까지 특별한 가격으로 제공합니다.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Search and Filters */}
      <section className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between space-y-4 lg:space-y-0">
            {/* Search Bar */}
            <div className="relative flex-1 max-w-md">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <ApperIcon name="Search" size={20} className="text-gray-400" />
              </div>
              <input
                type="text"
                placeholder="상품을 검색하세요..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              />
            </div>

            {/* Category Filter */}
            <div className="flex items-center space-x-4">
              <span className="text-sm font-medium text-gray-700">카테고리:</span>
              <div className="flex space-x-2">
                {categories.map((category) => (
                  <button
                    key={category}
                    onClick={() => handleCategoryChange(category)}
                    className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                      selectedCategory === category
                        ? 'bg-primary-800 text-white'
                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                    }`}
                  >
                    {category}
                  </button>
                ))}
              </div>
            </div>

            {/* Sort Dropdown */}
            <div className="flex items-center space-x-2">
              <span className="text-sm font-medium text-gray-700">정렬:</span>
              <select
                value={sortBy}
                onChange={(e) => handleSortChange(e.target.value)}
                className="border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              >
                {sortOptions.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>
      </section>

      {/* Products Grid */}
      <section className="py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {loading ? (
            <Loading />
          ) : error ? (
            <Error message={error} />
          ) : filteredProducts.length === 0 ? (
            <Empty
              icon="Package"
              title="상품이 없습니다"
              description={
                searchQuery
                  ? `"${searchQuery}"에 대한 검색 결과가 없습니다.`
                  : "해당 카테고리에 상품이 없습니다."
              }
            />
          ) : (
            <>
              {/* Results Count */}
              <motion.div
                className="mb-6"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
              >
                <p className="text-gray-600">
                  총 <span className="font-semibold text-gray-900">{filteredProducts.length}개</span>의 상품이 있습니다.
                </p>
              </motion.div>

              {/* Products Grid */}
              <motion.div
                className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.6, delay: 0.2 }}
              >
                {filteredProducts.map((product, index) => (
                  <motion.div
                    key={product.Id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, delay: 0.1 * index }}
                  >
                    <ProductCard product={product} />
                  </motion.div>
                ))}
              </motion.div>
            </>
          )}
        </div>
      </section>
    </div>
  );
};

export default StorePage;