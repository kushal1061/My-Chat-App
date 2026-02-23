import React from 'react';

export default function Badge({ count, className = '' }) {
    if (!count || count <= 0) return null;

    const display = count > 99 ? '99+' : count;

    return (
        <span
            className={`
        inline-flex items-center justify-center
        min-w-[20px] h-5 px-1.5
        text-[10px] font-bold
        bg-accent text-text-inverse
        rounded-full
        animate-bounce-in
        ${className}
      `}
        >
            {display}
        </span>
    );
}
