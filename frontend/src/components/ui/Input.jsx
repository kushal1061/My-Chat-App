import React, { forwardRef } from 'react';

const Input = forwardRef(function Input(
    {
        label,
        icon: Icon,
        error,
        className = '',
        containerClassName = '',
        ...props
    },
    ref
) {
    return (
        <div className={`space-y-1.5 ${containerClassName}`}>
            {label && (
                <label className="flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wider text-text-secondary">
                    {Icon && <Icon size={14} className="text-text-tertiary" />}
                    {label}
                </label>
            )}
            <input
                ref={ref}
                className={`
          w-full rounded-xl px-4 py-2.5 text-sm
          bg-surface-tertiary text-text-primary
          border border-border
          placeholder:text-text-tertiary
          transition-all duration-200
          focus:border-accent focus:bg-surface focus:outline-none
          focus:ring-2 focus:ring-accent-muted
          ${error ? 'border-danger ring-2 ring-danger/20' : ''}
          ${className}
        `}
                {...props}
            />
            {error && (
                <p className="text-xs text-danger mt-1">{error}</p>
            )}
        </div>
    );
});

export default Input;
