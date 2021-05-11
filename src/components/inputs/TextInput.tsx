const TextInput: React.FC<PropsType> = ({
  value = '',
  type = 'text',
  placeholder = '',
  error,
  autoFocus = false,
  onChange = (v) => false,
  ...textInputProps
}) => {
  return (
    <>
      <input
        type={type}
        className="w-full bg-gray-100 bg-opacity-50 rounded border border-gray-300 focus:border-indigo-500 focus:bg-white focus:ring-2 focus:ring-indigo-200 text-base outline-none text-gray-700 py-1 px-3 leading-8 transition-colors duration-200 ease-in-out"
        value={value}
        placeholder={placeholder}
        autoFocus={autoFocus}
        onChange={(e) => onChange(e.target.value)}
        {...textInputProps}
      />
      {error && (
        <div className="text-red-400 py-2">
          {error.message.charAt(0).toUpperCase() + error.message.slice(1)}
        </div>
      )}
    </>
  );
};

type PropsType = {
  value?: string;
  type?: string;
  placeholder?: string;
  error?: any;
  autoFocus?: boolean;
  onChange?: any;
};

export default TextInput;
