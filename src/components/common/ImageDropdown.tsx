import { useState, useRef, useEffect } from "react";
import ChevronIcon from "@common/icon/ChevronIcon";

interface Option {
  label: string;
  value: string;
}

interface DropdownProps {
  image: React.ReactNode;
  value: string;
  options: Option[];
  onChange: (value: string) => void;
  className?: string;
}

const ImageDropdown = ({
  image,
  value,
  options,
  onChange,
  className,
}: DropdownProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const selectedOption = options.find((option) => option.value === value);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div className={`relative ${className}`} ref={dropdownRef}>
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="w-full h-9 px-2 py-1 mt-2 text-sm font-normal text-gray-900 rounded-md
          bg-white hover:bg-gray-light focus:outline-none active:bg-gray
          flex items-center"
      >
        {image}
        <span className="ml-1">{selectedOption?.label ?? ""}</span>
        <ChevronIcon isDown={!isOpen} />
      </button>

      {isOpen && (
        <div className="absolute z-10 w-full mt-1 bg-white border border-gray-300 rounded-lg shadow-lg max-h-48 overflow-y-auto">
          {options.map((option) => (
            <button
              key={option.value}
              type="button"
              onClick={() => {
                onChange(option.value);
                setIsOpen(false);
              }}
              className={`w-full px-2 py-1 h-9 text-left text-sm hover:bg-indigo-50 flex items-center
                ${option.value === value ? "bg-indigo-50 text-indigo-600" : "text-gray-900"}`}
            >
              {option.value === value && (
                <svg
                  className="w-4 h-4 mr-2"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M5 13l4 4L19 7"
                  />
                </svg>
              )}
              {option.label}
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

export default ImageDropdown;
