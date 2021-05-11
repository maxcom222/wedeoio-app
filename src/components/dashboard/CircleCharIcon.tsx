import ColorHash from 'color-hash';
import React from 'react';

const colorHash = new ColorHash();

const CircleCharIcon: React.FC<{
  string: string;
  className?: string;
  style?: any;
  onClick?: any;
}> = ({ string, className = '', style = {}, onClick = () => false }) => {
  const hsl = colorHash.hsl(string);
  const bgHsl = `hsl(${hsl[0]}, ${hsl[1] * 100}%, ${hsl[2] * 100}%)`;
  const textColor = hsl[2] > 0.5 ? 'black' : 'white';

  return (
    <span
      className={`
        flex justify-center items-center capitalize rounded-full
        ${className}
      `}
      style={{
        ...style,
        backgroundColor: bgHsl,
        color: textColor,
      }}
      onClick={() => onClick()}
    >
      {string.substring(0, 1)}
    </span>
  );
};

export default CircleCharIcon;
