/**
 * Card component con glassmorphism y animaciones
 */

import React from 'react';

interface CardProps {
  children: React.ReactNode;
  className?: string;
  onClick?: () => void;
  hover?: boolean;
  style?: React.CSSProperties;
}

export const Card: React.FC<CardProps> = ({
  children,
  className = '',
  onClick,
  hover = false,
  style,
}) => {
  const baseClasses = 'glass-effect rounded-2xl p-4 shadow-2xl border border-white/20';
  const hoverClasses = hover ? 'card-hover cursor-pointer' : '';
  const clickClasses = onClick ? 'cursor-pointer' : '';

  return (
    <div
      className={`${baseClasses} ${hoverClasses} ${clickClasses} ${className} fade-in`}
      onClick={onClick}
      style={style}
    >
      {children}
    </div>
  );
};
