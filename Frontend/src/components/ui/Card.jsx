import React from 'react';

const variants = {
  default: 'bg-white border border-charcoal/7 rounded-xl',
  flush:   'bg-cream/40 border border-charcoal/6 rounded-xl',
};

export function Card({ children, className = '', variant = 'default' }) {
  return (
    <div className={`${variants[variant]} ${className}`}>
      {children}
    </div>
  );
}
