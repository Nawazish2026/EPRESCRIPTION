
// src/components/SearchBar.jsx
import React, { useState } from 'react';
import { Search, Loader } from 'lucide-react';

export default function SearchBar({ query = '', onSearch }) {
  const [q, setQ] = useState(query);
  const [isLoading, setIsLoading] = useState(false);

  const handleSearch = async () => {
    if (!q.trim() || q.trim().length < 2) {
      return;
    }
    
    setIsLoading(true);
    try {
      await onSearch(q);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl p-6 mb-8 border border-gray-200 hover:shadow-2xl transition-all duration-300">
      <div className="flex gap-3">
        <div className="flex-1 relative group">
          <Search className="absolute left-5 top-1/2 transform -translate-y-1/2 text-gray-400 w-6 h-6 group-focus-within:text-blue-500 transition-colors" />
          <input
            value={q}
            onChange={(e) => setQ(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
            type="text"
            placeholder="Search for medicines... (min 2 characters)"
            className="w-full pl-14 pr-4 py-5 border-2 border-gray-200 rounded-xl focus:ring-4 focus:ring-blue-500/20 focus:border-blue-500 outline-none transition-all duration-300 hover:border-gray-300"
          />
        </div>

        <button 
          onClick={handleSearch} 
          disabled={isLoading || !q.trim() || q.trim().length < 2}
          className="px-8 py-3 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-xl font-semibold hover:from-indigo-700 hover:to-purple-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300 flex items-center gap-2"
        >
          {isLoading ? (
            <>
              <Loader className="w-5 h-5 animate-spin" />
              Searching
            </>
          ) : (
            'Search'
          )}
        </button>
      </div>
    </div>
  );
}
