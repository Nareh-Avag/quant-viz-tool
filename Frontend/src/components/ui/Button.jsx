import React from 'react';

export function Button({ children, onClick, disabled, loading, className = '' }) {
  return (
    <button
      onClick={onClick}
      disabled={disabled || loading}
      className={[
        'inline-flex items-center justify-center gap-2',
        'px-6 py-2.5 rounded-lg',
        'bg-wine text-cream/90 text-sm font-normal tracking-wide',
        'border border-wine',
        'hover:bg-plum hover:border-plum transition-colors duration-200',
        'disabled:opacity-40 disabled:cursor-not-allowed',
        'active:scale-[0.98]',
        className,
      ].join(' ')}
    >
      {loading && (
        <span className="w-3.5 h-3.5 rounded-full border border-cream/25 border-t-cream/80 animate-spin" />
      )}
      {children}
    </button>
  );
}
