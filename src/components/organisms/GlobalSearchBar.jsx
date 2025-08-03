import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import ApperIcon from '@/components/ApperIcon';
import Button from '@/components/atoms/Button';
import { cn } from '@/utils/cn';
import { 
  getSearchSuggestions, 
  getPopularKeywords, 
  getSearchHistory,
  clearSearchHistory 
} from '@/services/api/searchService';

const GlobalSearchBar = ({ className }) => {
  const [query, setQuery] = useState('');
  const [isOpen, setIsOpen] = useState(false);
  const [suggestions, setSuggestions] = useState([]);
  const [popularKeywords] = useState(getPopularKeywords());
  const [searchHistory, setSearchHistory] = useState([]);
  const [selectedIndex, setSelectedIndex] = useState(-1);
  const [isLoading, setIsLoading] = useState(false);
  
  const navigate = useNavigate();
  const searchRef = useRef(null);
  const inputRef = useRef(null);
  const timeoutRef = useRef(null);

  // Load search history on mount
  useEffect(() => {
    setSearchHistory(getSearchHistory());
  }, []);

  // Handle search suggestions with debounce
  useEffect(() => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }

    timeoutRef.current = setTimeout(() => {
      if (query.length >= 2) {
        const newSuggestions = getSearchSuggestions(query);
        setSuggestions(newSuggestions);
      } else {
        setSuggestions([]);
      }
    }, 300);

    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, [query]);

  // Handle click outside to close dropdown
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (searchRef.current && !searchRef.current.contains(event.target)) {
        setIsOpen(false);
        setSelectedIndex(-1);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Handle keyboard navigation
  const handleKeyDown = (e) => {
    const allItems = [...suggestions, ...searchHistory, ...popularKeywords];
    
    switch (e.key) {
      case 'ArrowDown':
        e.preventDefault();
        setSelectedIndex(prev => 
          prev < allItems.length - 1 ? prev + 1 : prev
        );
        break;
        
      case 'ArrowUp':
        e.preventDefault();
        setSelectedIndex(prev => prev > -1 ? prev - 1 : -1);
        break;
        
      case 'Enter':
        e.preventDefault();
        if (selectedIndex >= 0 && allItems[selectedIndex]) {
          handleSearch(allItems[selectedIndex]);
        } else if (query.trim()) {
          handleSearch(query);
        }
        break;
        
      case 'Escape':
        setIsOpen(false);
        setSelectedIndex(-1);
        inputRef.current?.blur();
        break;
    }
  };

  // Handle search execution
  const handleSearch = (searchQuery) => {
    const finalQuery = searchQuery || query;
    if (!finalQuery.trim()) return;

    setIsLoading(true);
    setIsOpen(false);
    setSelectedIndex(-1);
    
    // Update search history
    setSearchHistory(getSearchHistory());
    
    // Navigate to search results
    navigate(`/search?q=${encodeURIComponent(finalQuery.trim())}`);
    
    // Clear input
    setQuery('');
    setIsLoading(false);
  };

  // Handle input focus
  const handleFocus = () => {
    setIsOpen(true);
    setSearchHistory(getSearchHistory());
  };

  // Handle popular keyword click
  const handlePopularKeywordClick = (keyword) => {
    setQuery(keyword);
    handleSearch(keyword);
  };

  // Handle clear history
  const handleClearHistory = () => {
    clearSearchHistory();
    setSearchHistory([]);
  };

  // Get all dropdown items for keyboard navigation
  const getAllDropdownItems = () => {
    const items = [];
    
    if (suggestions.length > 0) {
      items.push(...suggestions.map(s => ({ type: 'suggestion', value: s })));
    }
    
    if (searchHistory.length > 0) {
      items.push(...searchHistory.map(h => ({ type: 'history', value: h })));
    }
    
    if (popularKeywords.length > 0) {
      items.push(...popularKeywords.map(k => ({ type: 'popular', value: k })));
    }
    
    return items;
  };

  const dropdownItems = getAllDropdownItems();

  return (
    <div ref={searchRef} className={cn("relative", className)}>
      {/* Search Input */}
      <div className="relative">
        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
          <ApperIcon 
            name={isLoading ? "Loader2" : "Search"} 
            size={20} 
            className={cn(
              "text-gray-400",
              isLoading && "animate-spin"
            )}
          />
        </div>
        
        <input
          ref={inputRef}
          type="text"
          placeholder="강의와 상품을 검색하세요..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onFocus={handleFocus}
          onKeyDown={handleKeyDown}
          className="w-full pl-10 pr-12 py-3 bg-white border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all duration-200 text-gray-900 placeholder-gray-500"
          disabled={isLoading}
        />
        
        {query && (
          <button
            onClick={() => {
              setQuery('');
              setSuggestions([]);
              inputRef.current?.focus();
            }}
            className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-600 transition-colors"
          >
            <ApperIcon name="X" size={16} />
          </button>
        )}
      </div>

      {/* Search Dropdown */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: -10, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -10, scale: 0.95 }}
            transition={{ duration: 0.2 }}
            className="absolute top-full left-0 right-0 mt-2 bg-white rounded-lg shadow-elevated border border-gray-200 z-50 max-h-96 overflow-hidden"
          >
            <div className="max-h-96 overflow-y-auto">
              {/* Search Suggestions */}
              {suggestions.length > 0 && (
                <div className="p-3 border-b border-gray-100">
                  <div className="flex items-center space-x-2 mb-2">
                    <ApperIcon name="Lightbulb" size={16} className="text-primary-600" />
                    <span className="text-sm font-medium text-gray-700">추천 검색어</span>
                  </div>
                  <div className="space-y-1">
                    {suggestions.map((suggestion, index) => (
                      <button
                        key={`suggestion-${index}`}
                        onClick={() => handleSearch(suggestion)}
                        className={cn(
                          "w-full text-left px-3 py-2 rounded-lg text-sm transition-colors",
                          selectedIndex === index
                            ? "bg-primary-50 text-primary-700"
                            : "hover:bg-gray-50 text-gray-700"
                        )}
                      >
                        <div className="flex items-center space-x-2">
                          <ApperIcon name="Search" size={14} className="text-gray-400" />
                          <span>{suggestion}</span>
                        </div>
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Search History */}
              {searchHistory.length > 0 && (
                <div className="p-3 border-b border-gray-100">
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center space-x-2">
                      <ApperIcon name="Clock" size={16} className="text-gray-500" />
                      <span className="text-sm font-medium text-gray-700">최근 검색</span>
                    </div>
                    <Button
                      variant="ghost"
                      size="small"
                      onClick={handleClearHistory}
                      className="text-xs text-gray-500 hover:text-gray-700"
                    >
                      전체 삭제
                    </Button>
                  </div>
                  <div className="space-y-1">
                    {searchHistory.slice(0, 5).map((historyItem, index) => (
                      <button
                        key={`history-${index}`}
                        onClick={() => handleSearch(historyItem)}
                        className={cn(
                          "w-full text-left px-3 py-2 rounded-lg text-sm transition-colors",
                          selectedIndex === suggestions.length + index
                            ? "bg-primary-50 text-primary-700"
                            : "hover:bg-gray-50 text-gray-700"
                        )}
                      >
                        <div className="flex items-center space-x-2">
                          <ApperIcon name="Clock" size={14} className="text-gray-400" />
                          <span>{historyItem}</span>
                        </div>
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Popular Keywords */}
              <div className="p-3">
                <div className="flex items-center space-x-2 mb-3">
                  <ApperIcon name="TrendingUp" size={16} className="text-accent-500" />
                  <span className="text-sm font-medium text-gray-700">인기 검색어</span>
                </div>
                <div className="flex flex-wrap gap-2">
                  {popularKeywords.slice(0, 8).map((keyword, index) => (
                    <button
                      key={`popular-${index}`}
                      onClick={() => handlePopularKeywordClick(keyword)}
                      className={cn(
                        "px-3 py-1.5 rounded-full text-xs font-medium transition-all duration-200 border",
                        selectedIndex === suggestions.length + searchHistory.length + index
                          ? "bg-primary-600 text-white border-primary-600"
                          : "bg-gray-50 text-gray-700 border-gray-200 hover:bg-gray-100 hover:border-gray-300"
                      )}
                    >
                      {keyword}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default GlobalSearchBar;