import React, { useEffect, useState } from 'react';
import { Sun, Moon } from 'lucide-react';

export default function ThemeToggle({ className = '' }) {
    const [dark, setDark] = useState(() => {
        if (typeof window === 'undefined') return false;
        return document.documentElement.classList.contains('dark');
    });

    useEffect(() => {
        if (dark) {
            document.documentElement.classList.add('dark');
            localStorage.setItem('theme', 'dark');
        } else {
            document.documentElement.classList.remove('dark');
            localStorage.setItem('theme', 'light');
        }
    }, [dark]);

    return (
        <button
            onClick={() => setDark(!dark)}
            className={`
        p-2 rounded-xl
        text-text-secondary hover:text-text-primary
        hover:bg-surface-tertiary
        transition-all duration-200
        focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent
        ${className}
      `}
            aria-label={dark ? 'Switch to light mode' : 'Switch to dark mode'}
            title={dark ? 'Light mode' : 'Dark mode'}
        >
            <div className="relative w-5 h-5">
                <Sun
                    size={20}
                    className={`absolute inset-0 transition-all duration-300 ${dark ? 'opacity-0 rotate-90 scale-0' : 'opacity-100 rotate-0 scale-100'
                        }`}
                />
                <Moon
                    size={20}
                    className={`absolute inset-0 transition-all duration-300 ${dark ? 'opacity-100 rotate-0 scale-100' : 'opacity-0 -rotate-90 scale-0'
                        }`}
                />
            </div>
        </button>
    );
}
