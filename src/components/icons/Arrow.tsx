const Arrow: React.FC<{ direction: DirectionType }> = ({ direction }) => {
  let rotate = '';

  switch (direction) {
    case 'right':
      rotate = '-rotate-180';
      break;

    case 'up':
      rotate = 'rotate-90';
      break;

    case 'down':
      rotate = '-rotate-90';
      break;

    default:
      break;
  }
  return (
    <svg
      className={`
        flex-shrink-0 w-5 h-5 mr-1 -ml-1 transform z-0
        ${rotate}
      `}
      fill="currentColor"
      viewBox="0 0 20 20"
    >
      <path
        fillRule="evenodd"
        d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z"
        clipRule="evenodd"
      />
    </svg>
  );
};

type DirectionType = 'left' | 'right' | 'up' | 'down';

export default Arrow;
