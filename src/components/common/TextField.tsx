interface TextFieldProps {
  value: string;
  onChange: (value: string) => void;
  errorMessage?: string;
}

const TextField: React.FC<TextFieldProps> = ({
  value,
  onChange,
  errorMessage,
}) => {
  return (
    <div className="h-[65px]">
      <input
        className={`w-full h-10 p-2 mt-2 text-sm font-normal text-gray-900 border-[1.5px] border-gray-300 rounded-md focus:outline-none focus:border-indigo-600 ${errorMessage ? "border-red-400" : ""}`}
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
      />
      {errorMessage && (
        <span className="text-xs text-red-600">{errorMessage}</span>
      )}
    </div>
  );
};

export default TextField;
