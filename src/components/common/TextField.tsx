interface TextFieldProps {
  value: string;
  onChange: (value: string) => void;
  errorMessage?: string;
  placeholder?: string;
  className?: string;
  autoFocus?: boolean;
  readOnly?: boolean;
}

const TextField = ({
  value,
  onChange,
  errorMessage,
  placeholder = "",
  className = "",
  autoFocus = false,
  readOnly = false,
}: TextFieldProps) => {
  return (
    <>
      <input
        className={`w-full h-10 p-2 mt-2 text-sm font-normal text-gray-900 
          border-[1.5px] ${errorMessage ? "border-red-400" : "border-gray-300"} rounded-md 
          hover:border-gray-400 focus:outline-none focus:border-indigo-600
          ${className}`}
        type="text"
        value={value}
        autoFocus={autoFocus}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        readOnly={readOnly}
      />
      {errorMessage && (
        <span className="text-xs text-red-600">{errorMessage}</span>
      )}
    </>
  );
};

export default TextField;
