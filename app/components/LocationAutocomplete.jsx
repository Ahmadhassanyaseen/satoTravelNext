'use client';

import React, { useRef, useState, useEffect } from 'react';
import { toast } from 'react-hot-toast';

const LocationAutocomplete = ({ value, onChange, placeholder, label }) => {
  const [suggestions, setSuggestions] = useState([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [inputValue, setInputValue] = useState(value || '');
  const [isLoading, setIsLoading] = useState(false);
  const inputRef = useRef(null);

  useEffect(() => {
    setInputValue(value || '');
  }, [value]);

  const fetchSuggestions = async (query) => {
    if (!query || query.length < 2) return;

    setIsLoading(true);
    try {
      const response = await fetch(`https://wft-geo-db.p.rapidapi.com/v1/geo/cities?namePrefix=${query}&countryIds=JP&limit=10`, {
        headers: {
          'X-RapidAPI-Key': process.env.NEXT_PUBLIC_RAPIDAPI_KEY,
          'X-RapidAPI-Host': 'wft-geo-db.p.rapidapi.com'
        }
      });

      if (!response.ok) throw new Error('Failed to fetch suggestions');

      const data = await response.json();
      const formattedSuggestions = data.data.map(city => ({
        id: city.id,
        name: city.name,
        region: city.region,
        description: `${city.name}, ${city.region}, Japan`
      }));

      setSuggestions(formattedSuggestions);
      setShowSuggestions(true);
    } catch (error) {
      console.error('Error fetching suggestions:', error);
      toast.error('Failed to fetch location suggestions');
    } finally {
      setIsLoading(false);
    }
  };

  // Debounce function to limit API calls
  const debounce = (func, wait) => {
    let timeout;
    return (...args) => {
      clearTimeout(timeout);
      timeout = setTimeout(() => func.apply(this, args), wait);
    };
  };

  const debouncedFetch = useRef(debounce(fetchSuggestions, 300)).current;

  const handleInputChange = (e) => {
    const value = e.target.value;
    setInputValue(value);

    if (!value.trim()) {
      setSuggestions([]);
      setShowSuggestions(false);
      onChange('');
      return;
    }

    debouncedFetch(value);
  };

  const handleSuggestionClick = (suggestion) => {
    setInputValue(suggestion.description);
    onChange(suggestion.description);
    setSuggestions([]);
    setShowSuggestions(false);
  };

  // Close suggestions when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (inputRef.current && !inputRef.current.contains(event.target)) {
        setShowSuggestions(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Common Japanese cities for initial suggestions
  const commonJapaneseCities = [
    { id: 1, name: 'Tokyo', region: 'Tokyo', description: 'Tokyo, Tokyo, Japan' },
    { id: 2, name: 'Osaka', region: 'Osaka', description: 'Osaka, Osaka, Japan' },
    { id: 3, name: 'Kyoto', region: 'Kyoto', description: 'Kyoto, Kyoto, Japan' },
    { id: 4, name: 'Yokohama', region: 'Kanagawa', description: 'Yokohama, Kanagawa, Japan' },
    { id: 5, name: 'Sapporo', region: 'Hokkaido', description: 'Sapporo, Hokkaido, Japan' },
  ];

  // Show common cities when input is empty and focused
  const handleInputFocus = () => {
    if (!inputValue) {
      setSuggestions(commonJapaneseCities);
      setShowSuggestions(true);
    }
  };

  return (
    <div className="relative" ref={inputRef}>
      {label && (
        <label className="block text-sm font-medium text-gray-700 mb-1">
          {label}
        </label>
      )}
      <div className="relative">
        <input
          type="text"
          value={inputValue}
          onChange={handleInputChange}
          onFocus={handleInputFocus}
          placeholder={placeholder}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm 
                   focus:border-blue-500 focus:ring-blue-500 px-2 py-3"
        />
        {isLoading && (
          <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-500"></div>
          </div>
        )}
      </div>
      {showSuggestions && suggestions.length > 0 && (
        <div className="absolute z-10 w-full mt-1 bg-white rounded-md shadow-lg max-h-60 overflow-auto">
          {suggestions.map((suggestion) => (
            <div
              key={suggestion.id}
              onClick={() => handleSuggestionClick(suggestion)}
              className="px-4 py-2 hover:bg-gray-100 cursor-pointer"
            >
              <div className="text-sm text-gray-900">{suggestion.name}</div>
              <div className="text-xs text-gray-500">
                {suggestion.region}, Japan
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default LocationAutocomplete; 