interface TextAreaProps {
  value: string;
  onChange: (value: string) => void;
  errorMessage?: string;
  placeholder?: string;
  className?: string;
}

const TextArea = ({
  value,
  onChange,
  errorMessage,
  placeholder = "",
  className = "",
}: TextAreaProps) => {
  return (
    <>
      <textarea
        className={`w-full p-2 mt-2 text-sm font-normal text-gray-900 
            border-[1.5px] ${errorMessage ? "border-red-400" : "border-gray-300"} rounded-md 
            hover:border-gray-400 focus:outline-none focus:border-indigo-600 
            resize-none align-top 
            ${className}`}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
      />
      {errorMessage && (
        <span className="text-xs text-red-600">{errorMessage}</span>
      )}
    </>
  );
};

export default TextArea;
