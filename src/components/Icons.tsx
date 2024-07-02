import React from "react";

export type IconProps = {
  fill?: string;
  size?: number;
  direction?: "left" | "right" | "up" | "down";
  className?: string; // New prop for class name
  style?: React.CSSProperties; // New prop for inline styles
};

export const PlayIcon: React.FC<IconProps> = ({
  fill = "#63727e",
  size = 32,
  className,
  style,
}) => {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 20 20"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      style={style}
    >
      <path
        fill={fill}
        d="M2 10a8 8 0 1 1 16 0a8 8 0 0 1-16 0m6-2.167v4.334a.75.75 0 0 0 1.125.65l4.125-2.384a.5.5 0 0 0 0-.866L9.125 7.184A.75.75 0 0 0 8 7.834"
      />
    </svg>
  );
};

export const PauseIcon: React.FC<IconProps> = ({
  fill = "#63727e",
  size = 32,
  className,
  style,
}) => {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      style={style}
    >
      <path
        fill={fill}
        d="M12 2C6.477 2 2 6.477 2 12s4.477 10 10 10s10-4.477 10-10S17.523 2 12 2m-1 14H9V8h2zm4 0h-2V8h2z"
      />
    </svg>
  );
};

export const BrowseIcon: React.FC<IconProps> = ({
  fill = "#63727e",
  size = 32,
  className,
  style,
}) => {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      style={style}
    >
      <path
        fill="none"
        stroke={fill}
        stroke-linecap="round"
        stroke-linejoin="round"
        stroke-width="1.5"
        d="M8.984 2c-2.807.064-4.446.331-5.566 1.447C2.438 4.424 2.11 5.797 2 8m13.017-6c2.806.064 4.445.331 5.566 1.447c.98.977 1.308 2.35 1.417 4.553m-6.983 14c2.806-.064 4.445-.331 5.566-1.447c.98-.977 1.308-2.35 1.417-4.553M8.984 22c-2.807-.064-4.446-.331-5.566-1.447C2.438 19.576 2.11 18.203 2 16m13-1l2 2m-1-5.5a4.5 4.5 0 1 0-9 0a4.5 4.5 0 0 0 9 0"
        color={fill}
      />
    </svg>
  );
};

export const LoopIcon: React.FC<IconProps> = ({
  fill = "#63727e",
  size = 32,
  className,
  style,
}) => {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      style={style}
    >
      <path
        fill={fill}
        d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10s10-4.48 10-10S17.52 2 12 2m0 16.5c-3.31 0-6-2.69-6-6h2c0 2.21 1.79 4 4 4s4-1.79 4-4c0-2.24-1.85-4.09-4.16-3.99l1.57 1.57L12 11.5l-4-4l4-4l1.41 1.41l-1.6 1.6C15.28 6.4 18 9.18 18 12.5c0 3.31-2.69 6-6 6"
      />
    </svg>
  );
};
