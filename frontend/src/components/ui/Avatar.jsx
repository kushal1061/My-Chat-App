import React from 'react';

const sizeMap = {
    xs: 'w-7 h-7 text-2xs',
    sm: 'w-9 h-9 text-xs',
    md: 'w-11 h-11 text-sm',
    lg: 'w-14 h-14 text-base',
    xl: 'w-20 h-20 text-xl',
};

const onlineDotSize = {
    xs: 'w-2 h-2 border',
    sm: 'w-2.5 h-2.5 border-[1.5px]',
    md: 'w-3 h-3 border-2',
    lg: 'w-3.5 h-3.5 border-2',
    xl: 'w-4 h-4 border-2',
};

function getInitials(name) {
    if (!name) return '?';
    return name
        .split(' ')
        .map((n) => n[0])
        .join('')
        .slice(0, 2)
        .toUpperCase();
}

export default function Avatar({
    src,
    name,
    size = 'md',
    online,
    onClick,
    className = '',
}) {
    return (
        <div className={`relative inline-flex shrink-0 ${className}`} onClick={onClick}>
            <div
                className={`
          ${sizeMap[size]}
          rounded-full flex items-center justify-center
          font-semibold overflow-hidden
          bg-accent-subtle text-accent
          ${onClick ? 'cursor-pointer hover:scale-105 transition-transform' : ''}
        `}
            >
                {src ? (
                    <img
                        src={src}
                        alt={name || 'Avatar'}
                        className="w-full h-full object-cover"
                        loading="lazy"
                    />
                ) : (
                    <span>{getInitials(name)}</span>
                )}
            </div>
            {online !== undefined && (
                <span
                    className={`
            absolute bottom-0 right-0
            ${onlineDotSize[size]}
            rounded-full border-surface
            ${online ? 'bg-success' : 'bg-text-tertiary'}
          `}
                />
            )}
        </div>
    );
}
