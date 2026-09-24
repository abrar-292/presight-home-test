import React, { useState, useEffect } from "react";
import { Search, X } from "lucide-react";
import { useDebouncedCallback } from "../hooks/useDebouncedCallback";

interface SearchBarProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  delay?: number;
}

export const SearchBar: React.FC<SearchBarProps> = ({ value, onChange, placeholder = "Search by first or last name...", delay = 300 }) => {
  const [inputValue, setInputValue] = useState(value);

  const { cancel, debounced } = useDebouncedCallback((val: string) => {
    onChange(val);
  }, delay);

  useEffect(() => {
    setInputValue(value);
    cancel();
  }, [value, cancel]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = e.target.value;
    setInputValue(newValue);
    debounced(newValue);
  };

  const handleClear = () => {
    cancel();
    setInputValue("");
    onChange("");
  };

  return (
    <div className="relative w-full">
      <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
        <Search className="w-4 h-4" />
      </div>
      <input type="text" value={inputValue} onChange={handleChange} placeholder={placeholder} className="w-full pl-10 pr-9 py-2.5 bg-white border border-slate-200 rounded-xl text-sm text-slate-900 placeholder-slate-400 focus:outline-hidden focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 shadow-xs transition-all" />
      {inputValue && (
        <button type="button" onClick={handleClear} className="absolute inset-y-0 right-0 pr-3 flex items-center text-slate-400 hover:text-slate-600 cursor-pointer" title="Clear search">
          <X className="w-4 h-4" />
        </button>
      )}
    </div>
  );
};
