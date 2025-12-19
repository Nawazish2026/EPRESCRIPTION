
import React, { useState, useCallback, useEffect } from 'react';
import { Search, Loader, AlertCircle } from 'lucide-react';
import MedicineCard from './MedicineCard';

const SearchComponent = () => {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [hasSearched, setHasSearched] = useState(false);

  // Debounce function
  const debounce = (func, wait) => {
    let timeout;
    return function executedFunction(...args) {
      const later = () => {
        clearTimeout(timeout);
        func(...args);
      };
      clearTimeout(timeout);
      timeout = setTimeout(later, wait);
    };
  };

  // This function will call the backend API
  const fetchSearchResults = async (searchQuery) => {
    if (!searchQuery || searchQuery.trim().length < 2) {
      setResults([]);
      setHasSearched(false);
      return;
    }

    setIsLoading(true);
    setError(null);
    setHasSearched(true);

    try {
      const response = await fetch(`/api/medicines/search?q=${encodeURIComponent(searchQuery)}`);
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
      const data = await response.json();
      setResults(data.data || []);
    } catch (err) {
      setError(err.message);
      setResults([]);
    } finally {
      setIsLoading(false);
    }
  };

  // Using debounce to avoid sending too many requests while the user is typing
  const debouncedFetch = useCallback(debounce(fetchSearchResults, 500), []);

  const handleInputChange = (e) => {
    const newQuery = e.target.value;
    setQuery(newQuery);
    debouncedFetch(newQuery);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 p-4">
      <div className="max-w-6xl mx-auto">
        {/* Search Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent mb-4">
            Search Medicines
          </h1>
          <p className="text-gray-600 text-lg">
            Find the medicines you need by name, composition, or manufacturer
          </p>
        </div>

        {/* Search Input */}
        <div className="relative mb-8">
          <div className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-6 h-6">
            <Search />
          </div>
          <input
            type="text"
            value={query}
            onChange={handleInputChange}
            placeholder="Search for medicines... (min 2 characters)"
            className="w-full pl-12 pr-4 py-4 text-lg bg-white/80 backdrop-blur-sm border-2 border-gray-200 rounded-2xl focus:ring-4 focus:ring-blue-500/20 focus:border-blue-500 outline-none transition-all duration-300 shadow-lg hover:shadow-xl"
          />
          {isLoading && (
            <div className="absolute right-4 top-1/2 transform -translate-y-1/2">
              <Loader className="w-6 h-6 text-blue-600 animate-spin" />
            </div>
          )}
        </div>

        {/* Error Message */}
        {error && (
          <div className="mb-6 p-4 bg-red-50 border-2 border-red-200 rounded-2xl text-red-700 flex items-center gap-3">
            <AlertCircle className="w-5 h-5" />
            <span>Error: {error}</span>
          </div>
        )}

        {/* Loading State */}
        {isLoading && (
          <div className="text-center py-12">
            <Loader className="w-8 h-8 text-blue-600 animate-spin mx-auto mb-4" />
            <p className="text-gray-600">Searching for medicines...</p>
          </div>
        )}

        {/* No Results */}
        {hasSearched && !isLoading && results.length === 0 && (
          <div className="text-center py-12">
            <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Search className="w-8 h-8 text-gray-400" />
            </div>
            <p className="text-gray-600 text-lg">No medicines found for "{query}"</p>
            <p className="text-gray-500 mt-2">Try searching with different keywords</p>
          </div>
        )}

        {/* Results */}
        {!isLoading && results.length > 0 && (
          <div>
            <p className="text-gray-600 mb-6">
              Found {results.length} medicine{results.length !== 1 ? 's' : ''} for "{query}"
            </p>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {results.map((medicine) => (
                <MedicineCard key={medicine._id} medicine={medicine} />
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default SearchComponent;
