import React from 'react';

export function Input({ value, onChange, placeholder, className = '', label }) {
  return (
    <div className="flex flex-col gap-1.5">
      {label && (
        <span className="text-[10px] uppercase tracking-[0.2em] text-charcoal/35 font-medium select-none">
          {label}
        </span>
      )}
      <input
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        className={[
          'bg-white border border-charcoal/10 rounded-lg',
          'px-4 py-2.5 text-sm text-charcoal/80 placeholder:text-charcoal/25',
          'font-mono tracking-wide',
          'focus:outline-none focus:border-aqua/60',
          'transition-colors duration-200',
          className,
        ].join(' ')}
      />
    </div>
  );
}
