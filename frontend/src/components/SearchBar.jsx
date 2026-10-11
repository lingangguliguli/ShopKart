import { useState, useEffect, useCallback } from 'react';


const SearchBar = ({ onFilterChange }) => {
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState('');

  const categories = ['All Categories', 'Electronics', 'Fashion', 'Books', 'Home'];

  
  useEffect(() => {
    const timer = setTimeout(() => {
      onFilterChange({
        search: search.trim(),
        category: category === 'All Categories' ? '' : category
      });
    }, 400);

    
    return () => clearTimeout(timer);
  }, [search, category]); 

  return (
    <div className="flex flex-col sm:flex-row gap-3 mb-8">

      {}
      <div className="relative flex-1">
        <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-gray-400">
          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" d="m21 21-5.197-5.197m0 0A7.5 7.5 0 1 0 5.196 5.196a7.5 7.5 0 0 0 10.607 10.607Z" />
          </svg>
        </span>
        <input
          type="text"
          placeholder="Search products..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full pl-11 pr-4 py-3 border border-gray-300 rounded-xl bg-white
                     placeholder:text-gray-400 text-gray-900
                     focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500
                     transition-shadow duration-150"
        />
      </div>

      {}
      <select
        value={category}
        onChange={(e) => setCategory(e.target.value)}
        className="px-4 py-3 border border-gray-300 rounded-xl bg-white text-gray-900
                   focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500
                   transition-shadow duration-150 sm:w-52 cursor-pointer"
      >
        {categories.map((cat) => (
          <option key={cat} value={cat}>{cat}</option>
        ))}
      </select>
    </div>
  );
};

export default SearchBar;
