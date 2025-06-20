import React from 'react';

interface IconProps {
  className: string;
  path: string;
}

export const Icon: React.FC<IconProps> = ({ className, path }) => (
  <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d={path} />
  </svg>
);