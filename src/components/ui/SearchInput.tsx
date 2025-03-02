
import React from 'react';
import { Search } from 'lucide-react';

interface SearchInputProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  className?: string;
}

const SearchInput: React.FC<SearchInputProps> = ({ 
  value, 
  onChange, 
  placeholder = "Search...", 
  className = "" 
}) => {
  return (
    <div className={`relative ${className}`}>
      <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
      <input
        type="text"
        placeholder={placeholder}
        className="w-full pl-10 py-2 rounded-md border border-input bg-background ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
        value={value}
        onChange={(e) => onChange(e.target.value)}
      />
    </div>
  );
};

export default SearchInput;
