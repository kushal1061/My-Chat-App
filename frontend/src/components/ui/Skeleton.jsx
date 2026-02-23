import React from 'react';

export function Skeleton({ className = '', rounded = false }) {
    return (
        <div
            className={`
        bg-surface-tertiary
        animate-shimmer
        bg-[length:200%_100%]
        bg-gradient-to-r from-surface-tertiary via-surface-secondary to-surface-tertiary
        ${rounded ? 'rounded-full' : 'rounded-lg'}
        ${className}
      `}
        />
    );
}

export function ChatItemSkeleton() {
    return (
        <div className="flex items-center gap-3 px-4 py-3">
            <Skeleton className="w-11 h-11" rounded />
            <div className="flex-1 space-y-2">
                <Skeleton className="w-24 h-3.5" />
                <Skeleton className="w-36 h-3" />
            </div>
        </div>
    );
}

export function MessageSkeleton({ align = 'left' }) {
    return (
        <div className={`flex ${align === 'right' ? 'justify-end' : 'justify-start'}`}>
            <div className="space-y-1.5">
                <Skeleton className={`h-10 ${align === 'right' ? 'w-48' : 'w-56'} rounded-2xl`} />
                <Skeleton className={`h-3 w-12 ${align === 'right' ? 'ml-auto' : ''}`} />
            </div>
        </div>
    );
}
