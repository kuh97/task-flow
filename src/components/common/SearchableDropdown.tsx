import { useEffect, useRef, useState } from "react";

interface SearchableItem {
  id: number | string;
  label: string;
  subLabel?: string;
  profileImage?: string;
}

interface SearchableDropdownProps<T extends SearchableItem> {
  value: string;
  onChange: (value: string) => void;
  onSelect: (item: T) => void;
  items: T[];
  placeholder?: string;
  errorMessage?: string;
  filterKeys?: (keyof T)[];
  className?: string;
}

const SearchableDropdown = <T extends SearchableItem>({
  value,
  onChange,
  onSelect,
  items,
  placeholder = "선택하세요",
  errorMessage,
  filterKeys = ["label", "subLabel"],
  className,
}: SearchableDropdownProps<T>) => {
  const [isOpen, setIsOpen] = useState(false);
  const [filteredItems, setFilteredItems] = useState<T[]>([]);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (!value.trim()) {
      setFilteredItems(items);
    } else {
      const filtered = items.filter((item) =>
        filterKeys.some((key) =>
          String(item[key]).toLowerCase().includes(value.toLowerCase())
        )
      );
      setFilteredItems(filtered);
    }
  }, [value, items]);

  const handleInputChange = (inputValue: string) => {
    onChange(inputValue);
    setIsOpen(true);
  };

  return (
    <div className={`relative ${className} w-full`} ref={dropdownRef}>
      <input
        ref={inputRef}
        className={`w-full h-10 p-2 text-sm font-normal text-gray-900 
            border-[1.5px] ${errorMessage ? "border-red-400" : "border-gray-300"} rounded-md 
            hover:border-gray-400 focus:outline-none focus:border-indigo-600 
            `}
        type="text"
        value={value}
        placeholder={placeholder}
        onChange={(e) => handleInputChange(e.target.value)}
        onFocus={() => setIsOpen(true)}
        onBlur={() => setIsOpen(false)}
      />
      {errorMessage && (
        <span className="text-xs text-red-600">{errorMessage}</span>
      )}

      {isOpen && filteredItems.length > 0 && (
        <div className="absolute z-10 w-full mt-1 bg-white border border-gray-300 rounded-lg shadow-lg max-h-48 overflow-y-auto">
          {filteredItems.map((item) => (
            <button
              key={item.id}
              type="button"
              onMouseDown={(e) => e.preventDefault()}
              onClick={() => {
                onSelect(item);
                setIsOpen(false);
                inputRef.current?.blur();
              }}
              className="w-full px-4 py-2 text-left hover:bg-indigo-50 flex items-center gap-2"
            >
              {item.profileImage && (
                <img
                  src={
                    item.profileImage ||
                    `https://ui-avatars.com/api/?name=${item.label}`
                  }
                  alt={item.label}
                  className="w-8 h-8 rounded-full object-cover"
                  onError={(e: any) => {
                    e.target.onerror = null;
                    e.target.src = `https://ui-avatars.com/api/?name=${item.label}`;
                  }}
                />
              )}
              <div className="flex flex-col">
                <span className="text-sm font-medium text-gray-900">
                  {item.label}
                </span>
                {item.subLabel && (
                  <span className="text-xs text-gray-500">{item.subLabel}</span>
                )}
              </div>
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

export default SearchableDropdown;
