import React from 'react';

const variants = {
    primary:
        'bg-accent text-text-inverse hover:bg-accent-hover shadow-soft hover:shadow-elevated active:scale-[0.98]',
    secondary:
        'bg-surface-tertiary text-text-primary border border-border hover:bg-surface-secondary active:scale-[0.98]',
    ghost:
        'bg-transparent text-text-secondary hover:bg-surface-tertiary hover:text-text-primary',
    danger:
        'bg-danger text-white hover:opacity-90 active:scale-[0.98]',
    accent:
        'bg-accent-subtle text-accent hover:bg-accent-muted',
};

const sizes = {
    xs: 'px-2.5 py-1 text-xs rounded-lg gap-1',
    sm: 'px-3 py-1.5 text-sm rounded-lg gap-1.5',
    md: 'px-4 py-2.5 text-sm rounded-xl gap-2',
    lg: 'px-6 py-3 text-base rounded-xl gap-2',
};

export default function Button({
    variant = 'primary',
    size = 'md',
    children,
    icon: Icon,
    iconRight: IconRight,
    loading = false,
    disabled = false,
    className = '',
    ...props
}) {
    const isDisabled = disabled || loading;

    return (
        <button
            className={`
        inline-flex items-center justify-center font-medium
        transition-all duration-200 cursor-pointer
        focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent
        disabled:opacity-50 disabled:cursor-not-allowed disabled:active:scale-100
        ${variants[variant]}
        ${sizes[size]}
        ${className}
      `}
            disabled={isDisabled}
            {...props}
        >
            {loading ? (
                <div className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin" />
            ) : Icon ? (
                <Icon size={size === 'xs' ? 14 : size === 'sm' ? 16 : 18} />
            ) : null}
            {children && <span>{children}</span>}
            {IconRight && !loading && (
                <IconRight size={size === 'xs' ? 14 : size === 'sm' ? 16 : 18} />
            )}
        </button>
    );
}
