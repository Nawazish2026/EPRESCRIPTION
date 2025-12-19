
import React, { useState, useEffect } from 'react';
import MedicineCard from './MedicineCard';
import { Search as SearchIcon, Loader, AlertCircle } from 'lucide-react';

const Search = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    // Don't search if the term is too short, and clear results
    if (searchTerm.trim().length < 2) {
      setResults([]);
      return;
    }

    setLoading(true);
    setError(null);

    // Debounce the search request to avoid excessive API calls
    const delayDebounceFn = setTimeout(() => {
      const fetchMedicines = async () => {
        try {
          // Fixed API endpoint for searching medicines
          const response = await fetch(`/api/medicines/search?q=${encodeURIComponent(searchTerm)}`);
          if (!response.ok) {
            throw new Error('Network response was not ok');
          }
          const data = await response.json();
          setResults(data.data || []);
        } catch (err) {
          console.error("Failed to fetch medicines:", err);
          setError('Failed to load medicines. Please try again later.');
          setResults([]);
        } finally {
          setLoading(false);
        }
      };

      fetchMedicines();
    }, 500); // 500ms delay before sending request

    // Cleanup function to cancel the timeout if the user types again
    return () => clearTimeout(delayDebounceFn);
  }, [searchTerm]);

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
            <SearchIcon />
          </div>
          <input
            type="text"
            placeholder="Search for medicines... (min 2 characters)"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-12 pr-4 py-4 text-lg bg-white/80 backdrop-blur-sm border-2 border-gray-200 rounded-2xl focus:ring-4 focus:ring-blue-500/20 focus:border-blue-500 outline-none transition-all duration-300 shadow-lg hover:shadow-xl"
          />
          {loading && (
            <div className="absolute right-4 top-1/2 transform -translate-y-1/2">
              <Loader className="w-6 h-6 text-blue-600 animate-spin" />
            </div>
          )}
        </div>

        {/* Error Message */}
        {error && (
          <div className="mb-6 p-4 bg-red-50 border-2 border-red-200 rounded-2xl text-red-700 flex items-center gap-3">
            <AlertCircle className="w-5 h-5" />
            <span>{error}</span>
          </div>
        )}

        {/* Loading State */}
        {loading && (
          <div className="text-center py-12">
            <Loader className="w-8 h-8 text-blue-600 animate-spin mx-auto mb-4" />
            <p className="text-gray-600">Searching for medicines...</p>
          </div>
        )}

        {/* No Results */}
        {!loading && !error && searchTerm.length > 1 && results.length === 0 && (
          <div className="text-center py-12">
            <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <SearchIcon className="w-8 h-8 text-gray-400" />
            </div>
            <p className="text-gray-600 text-lg">No medicines found for "{searchTerm}"</p>
            <p className="text-gray-500 mt-2">Try searching with different keywords</p>
          </div>
        )}

        {/* Results */}
        {!loading && results.length > 0 && (
          <div>
            <p className="text-gray-600 mb-6">
              Found {results.length} medicine{results.length !== 1 ? 's' : ''} for "{searchTerm}"
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

export default Search;
