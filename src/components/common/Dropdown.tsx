import { useState, useRef, useEffect } from "react";
import Icon from "@common/icon/Icon";
import ChevronIcon from "@common/icon/ChevronIcon";

export interface Option {
  label: string;
  value: string;
}

interface DropdownProps {
  value: string;
  options: Option[];
  onChange: (value: string) => void;
  placeholder?: string;
  className?: string;
}

const Dropdown = ({
  value,
  options,
  onChange,
  className,
  placeholder = "선택하세요",
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
        className="w-full h-10 px-3 text-sm font-normal text-gray-900
          border-[1.5px] border-gray-300 rounded-md
          hover:border-gray-400 focus:outline-none focus:border-indigo-600
          bg-white flex items-center justify-between"
      >
        <span>{selectedOption?.label || placeholder}</span>
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
              className={`w-full px-3 py-2.5 text-left text-sm hover:bg-indigo-50 flex items-center
                ${option.value === value ? "bg-indigo-50 text-indigo-600" : "text-gray-900"}`}
            >
              {option.value === value && (
                <Icon name={"saveButton"} className={"w-5 h-5 pr-1"} />
              )}
              {option.label}
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

export default Dropdown;
