import React, { useState, useEffect } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import ApperIcon from '@/components/ApperIcon';
import Button from '@/components/atoms/Button';
import CourseCard from '@/components/molecules/CourseCard';
import ProductCard from '@/components/molecules/ProductCard';
import Loading from '@/components/ui/Loading';
import Error from '@/components/ui/Error';
import Empty from '@/components/ui/Empty';
import { cn } from '@/utils/cn';
import { globalSearch, highlightSearchTerm, sortSearchResults } from '@/services/api/searchService';
import { toast } from 'react-toastify';

const SearchResultsPage = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const query = searchParams.get('q') || '';
  
  const [results, setResults] = useState({
    courses: [],
    products: [],
    total: 0,
    searchTime: 0
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeTab, setActiveTab] = useState('all');
  const [sortBy, setSortBy] = useState('relevance');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 12;

  // Load search results
  useEffect(() => {
    if (query) {
      performSearch(query);
    } else {
      setLoading(false);
    }
  }, [query]);

  // Reset page when filters change
  useEffect(() => {
    setCurrentPage(1);
  }, [activeTab, sortBy]);

  const performSearch = async (searchQuery) => {
    if (!searchQuery.trim()) return;

    try {
      setLoading(true);
      setError(null);
      
      const searchResults = await globalSearch(searchQuery);
      setResults(searchResults);
      
      if (searchResults.total === 0) {
        toast.info(`"${searchQuery}"에 대한 검색 결과가 없습니다.`);
      } else {
        toast.success(`${searchResults.total}개의 검색 결과를 찾았습니다.`);
      }
    } catch (err) {
      setError(err.message);
      toast.error('검색 중 오류가 발생했습니다.');
    } finally {
      setLoading(false);
    }
  };

  // Get filtered results based on active tab
  const getFilteredResults = () => {
    let items = [];
    
    switch (activeTab) {
      case 'courses':
        items = results.courses.map(course => ({ ...course, type: 'course' }));
        break;
      case 'products':
        items = results.products.map(product => ({ ...product, type: 'product' }));
        break;
      case 'all':
      default:
        items = [
          ...results.courses.map(course => ({ ...course, type: 'course' })),
          ...results.products.map(product => ({ ...product, type: 'product' }))
        ];
        break;
    }

    // Sort results
    return sortSearchResults(items, sortBy);
  };

  // Get paginated results
  const getPaginatedResults = () => {
    const filtered = getFilteredResults();
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    return filtered.slice(startIndex, endIndex);
  };

  // Calculate total pages
  const getTotalPages = () => {
    const filtered = getFilteredResults();
    return Math.ceil(filtered.length / itemsPerPage);
  };

  // Handle new search
  const handleNewSearch = (newQuery) => {
    setSearchParams({ q: newQuery });
  };

  // Sort options
  const sortOptions = [
    { value: 'relevance', label: '관련도순' },
    { value: 'alphabetical', label: '이름순' },
    { value: 'date', label: '최신순' },
    { value: 'price_low', label: '가격 낮은순' },
    { value: 'price_high', label: '가격 높은순' }
  ];

  const filteredResults = getFilteredResults();
  const paginatedResults = getPaginatedResults();
  const totalPages = getTotalPages();

  if (loading) {
    return (
      <div className="min-h-screen bg-stone-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <Loading />
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-stone-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <Error message={error} />
        </div>
      </div>
    );
  }

  if (!query) {
    return (
      <div className="min-h-screen bg-stone-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <Empty 
            title="검색어를 입력해주세요"
            description="찾고 싶은 강의나 상품을 검색해보세요."
            icon="Search"
          />
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-stone-50">
      {/* Search Header */}
      <section className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <div className="space-y-4">
              <div className="flex items-center space-x-3">
                <ApperIcon name="Search" size={24} className="text-primary-600" />
                <h1 className="text-2xl font-bold text-gray-900">
                  "<span className="text-primary-600">{query}</span>" 검색 결과
                </h1>
              </div>
              
              <div className="flex flex-wrap items-center gap-4 text-sm text-gray-600">
                <span>총 {results.total}개 결과</span>
                <span>•</span>
                <span>{results.searchTime}ms</span>
                {results.courses.length > 0 && (
                  <>
                    <span>•</span>
                    <span>강의 {results.courses.length}개</span>
                  </>
                )}
                {results.products.length > 0 && (
                  <>
                    <span>•</span>
                    <span>상품 {results.products.length}개</span>
                  </>
                )}
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Results Section */}
      <section className="py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {results.total === 0 ? (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
            >
              <Empty 
                title="검색 결과가 없습니다"
                description={`"${query}"와 일치하는 강의나 상품을 찾을 수 없습니다. 다른 검색어로 시도해보세요.`}
                icon="SearchX"
              />
            </motion.div>
          ) : (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="space-y-6"
            >
              {/* Filters and Controls */}
              <div className="bg-white rounded-lg shadow-card p-6">
                <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between space-y-4 lg:space-y-0">
                  {/* Tab Filters */}
                  <div className="flex items-center space-x-1 bg-gray-100 rounded-lg p-1">
                    <button
                      onClick={() => setActiveTab('all')}
                      className={cn(
                        "px-4 py-2 rounded-md text-sm font-medium transition-all duration-200",
                        activeTab === 'all'
                          ? "bg-white text-primary-600 shadow-sm"
                          : "text-gray-600 hover:text-gray-900"
                      )}
                    >
                      전체 ({results.total})
                    </button>
                    {results.courses.length > 0 && (
                      <button
                        onClick={() => setActiveTab('courses')}
                        className={cn(
                          "px-4 py-2 rounded-md text-sm font-medium transition-all duration-200",
                          activeTab === 'courses'
                            ? "bg-white text-primary-600 shadow-sm"
                            : "text-gray-600 hover:text-gray-900"
                        )}
                      >
                        강의 ({results.courses.length})
                      </button>
                    )}
                    {results.products.length > 0 && (
                      <button
                        onClick={() => setActiveTab('products')}
                        className={cn(
                          "px-4 py-2 rounded-md text-sm font-medium transition-all duration-200",
                          activeTab === 'products'
                            ? "bg-white text-primary-600 shadow-sm"
                            : "text-gray-600 hover:text-gray-900"
                        )}
                      >
                        상품 ({results.products.length})
                      </button>
                    )}
                  </div>

                  {/* Sort Dropdown */}
                  <div className="flex items-center space-x-3">
                    <span className="text-sm text-gray-600">정렬:</span>
                    <select
                      value={sortBy}
                      onChange={(e) => setSortBy(e.target.value)}
                      className="border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent bg-white"
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

              {/* Results Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {paginatedResults.map((item, index) => (
                  <motion.div
                    key={`${item.type}-${item.Id}`}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, delay: index * 0.1 }}
                  >
                    {item.type === 'course' ? (
                      <Link to={`/courses/${item.Id}`}>
                        <CourseCard 
                          course={{
                            ...item,
                            title: highlightSearchTerm(item.title, query),
                            description: highlightSearchTerm(item.description, query)
                          }}
                          className="h-full"
                        />
                      </Link>
                    ) : (
                      <ProductCard 
                        product={{
                          ...item,
                          name: highlightSearchTerm(item.name, query),
                          description: highlightSearchTerm(item.description, query)
                        }}
                        className="h-full"
                      />
                    )}
                  </motion.div>
                ))}
              </div>

              {/* Pagination */}
              {totalPages > 1 && (
                <div className="flex items-center justify-center space-x-2 pt-8">
                  <Button
                    variant="outline"
                    size="small"
                    onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
                    disabled={currentPage === 1}
                  >
                    <ApperIcon name="ChevronLeft" size={16} />
                    이전
                  </Button>
                  
                  <div className="flex items-center space-x-1">
                    {Array.from({ length: totalPages }, (_, i) => i + 1)
                      .filter(page => {
                        const distance = Math.abs(page - currentPage);
                        return distance <= 2 || page === 1 || page === totalPages;
                      })
                      .map((page, index, array) => {
                        const prevPage = array[index - 1];
                        const showEllipsis = prevPage && page - prevPage > 1;
                        
                        return (
                          <React.Fragment key={page}>
                            {showEllipsis && (
                              <span className="px-3 py-2 text-gray-500">...</span>
                            )}
                            <button
                              onClick={() => setCurrentPage(page)}
                              className={cn(
                                "px-3 py-2 rounded-lg text-sm font-medium transition-colors",
                                currentPage === page
                                  ? "bg-primary-600 text-white"
                                  : "text-gray-700 hover:bg-gray-100"
                              )}
                            >
                              {page}
                            </button>
                          </React.Fragment>
                        );
                      })}
                  </div>
                  
                  <Button
                    variant="outline"
                    size="small"
                    onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
                    disabled={currentPage === totalPages}
                  >
                    다음
                    <ApperIcon name="ChevronRight" size={16} />
                  </Button>
                </div>
              )}
            </motion.div>
          )}
        </div>
      </section>
    </div>
  );
};

export default SearchResultsPage;