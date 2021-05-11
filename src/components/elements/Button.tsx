import Spinner from 'components/icons/Spinner';

interface ButtonProps {
  className?: string;
  title?: string;
  color?: 'primary' | 'default' | 'red' | 'green' | 'yellow' | 'unset';
  size?: 'xs' | 'sm' | 'default' | 'lg' | 'xl';
  full?: boolean;
  isLoading?: boolean;
  disabled?: boolean;
}

const Button = ({
  isLoading = false,
  title,
  className = '',
  color = 'primary',
  size = 'default',
  full = false,
  disabled = false,
  children,
  ...buttonProps
}: ButtonProps &
  React.ButtonHTMLAttributes<HTMLButtonElement>): JSX.Element => {
  let colorName;
  let bgColor;
  let bgHoverColor;
  let textColor;
  let textHoverColor;
  let borderColor;
  let borderFocusColor;

  switch (color) {
    case 'primary':
      colorName = 'royal-blue';
      bgColor = 'bg-royal-blue-600';
      bgHoverColor = 'bg-royal-blue-500';
      borderColor = 'border-transparent';
      borderFocusColor = 'border-royal-blue-700';
      textColor = 'text-white';
      break;

    case 'red':
      colorName = 'red';
      bgColor = 'bg-red-600';
      bgHoverColor = 'bg-red-500';
      borderColor = 'border-transparent';
      borderFocusColor = 'border-red-700';
      textColor = 'text-white';
      break;

    case 'default':
      colorName = 'gray';
      textColor = 'text-gray-700';
      bgColor = 'bg-gray-200';
      bgHoverColor = 'bg-gray-300';
      borderColor = 'border-transparent';
      borderFocusColor = 'border-gray-700';
      break;

    case 'unset':
      colorName = 'gray';
      textColor = 'text-gray-700';
      bgColor = 'bg-white';
      bgHoverColor = 'bg-gray-100';
      borderColor = 'border-gray-300';
      borderFocusColor = 'border-blue-300';
      break;

    default:
      break;
  }

  let spacing = 'px-4 py-2';

  switch (size) {
    case 'default':
      spacing = 'px-4 py-2 min-w-24';
      break;

    case 'xs':
      spacing = 'px-2 py-1';
      break;

    default:
      break;
  }

  let bgOpacity = '';

  if (disabled) bgOpacity = 'bg-opacity-50 cursor-not-allowed';

  const Children = (
    <>
      {title}
      {children}
    </>
  );

  return (
    <button
      className={`
        ${full ? 'w-full' : ''}
        flex justify-center
        border focus:outline-none text-sm rounded-md
        transition duration-150 ease-in-out
        
        ${textColor}
        ${bgColor}
        hover:${bgHoverColor}
        focus:${borderFocusColor}
        focus:shadow-outline-${colorName}
        active:${borderFocusColor}

        ${spacing}
        ${bgOpacity}

        ${className}
      `}
      disabled={disabled}
      {...buttonProps}
    >
      {isLoading && (
        <Spinner
          width="20"
          fill={color === 'unset' ? 'black' : 'white'}
          className="absolute animate-spin"
        />
      )}
      <span className={isLoading ? 'invisible' : ''}>{Children}</span>
    </button>
  );
};

export default Button;
