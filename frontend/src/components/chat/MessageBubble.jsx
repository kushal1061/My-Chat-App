
import React, { useState } from 'react';
import { Copy, Check, Download, FileText, Film } from 'lucide-react';
import { motion } from 'framer-motion';

// ── Helpers ───────────────────────────────────────────────────────────────────

/** Extract a clean filename from a URL or raw string */
function extractFilename(text = '') {
    try {
        const url = new URL('https://' + text.replace(/^https?:\/\//, ''));
        const parts = url.pathname.split('/');
        return decodeURIComponent(parts[parts.length - 1] || 'file');
    } catch {
        return text.split('/').pop() || 'file';
    }
}

/** Normalise the src: prepend https:// if the URL came as a bare hostname/path */
function normaliseSrc(text = '') {
    if (text.startsWith('http://') || text.startsWith('https://')) return text;
    return 'https://' + text;
}

// ── Sub-components ────────────────────────────────────────────────────────────

function ImageMessage({ src, isMe, onImageClick }) {
    const [loaded, setLoaded] = useState(false);
    const [errored, setErrored] = useState(false);
    const fullSrc = normaliseSrc(src);

    return (
        <div
            className={`relative overflow-hidden rounded-2xl ${isMe ? 'rounded-br-md' : 'rounded-bl-md'} border border-border shadow-soft cursor-pointer group/img`}
            style={{ maxWidth: 280 }}
            onClick={() => !errored && onImageClick?.(fullSrc)}
        >
            {/* Shimmer skeleton while loading */}
            {!loaded && !errored && (
                <div className="w-64 h-44 bg-surface-tertiary animate-pulse rounded-2xl" />
            )}
            {errored ? (
                <div className="w-64 h-24 flex items-center justify-center bg-surface-tertiary text-text-tertiary text-xs rounded-2xl">
                    Image unavailable
                </div>
            ) : (
                <img
                    src={fullSrc}
                    alt="Shared image"
                    onLoad={() => setLoaded(true)}
                    onError={() => setErrored(true)}
                    className={`w-full max-h-72 object-cover transition-all duration-300 group-hover/img:brightness-90 ${loaded ? 'opacity-100' : 'opacity-0 absolute inset-0'}`}
                />
            )}
            {/* Zoom hint */}
            {loaded && !errored && (
                <span className="absolute bottom-2 right-2 text-[10px] bg-black/50 text-white px-1.5 py-0.5 rounded-md opacity-0 group-hover/img:opacity-100 transition-opacity pointer-events-none">
                    Click to zoom
                </span>
            )}
        </div>
    );
}

function DocumentMessage({ src, isMe }) {
    const fullSrc = normaliseSrc(src);
    const filename = extractFilename(src);
    const ext = filename.split('.').pop()?.toLowerCase() || '';
    const isVideo = ['mp4', 'mov', 'avi', 'webm', 'mkv'].includes(ext);

    return (
        <div
            className={`
                flex items-center gap-3 px-4 py-3 rounded-2xl border
                ${isMe
                    ? 'rounded-br-md bg-accent/10 border-accent/25'
                    : 'rounded-bl-md bg-surface-elevated border-border'
                }
            `}
            style={{ maxWidth: 280 }}
        >
            {/* Icon */}
            <div className={`flex-shrink-0 w-10 h-10 rounded-xl flex items-center justify-center ${isMe ? 'bg-accent/15 text-accent' : 'bg-surface-tertiary text-text-secondary'}`}>
                {isVideo
                    ? <Film size={20} />
                    : <FileText size={20} />
                }
            </div>

            {/* Info */}
            <div className="flex-1 min-w-0">
                <p className={`text-sm font-medium truncate ${isMe ? 'text-accent' : 'text-text-primary'}`}>
                    {filename}
                </p>
                <p className={`text-xs mt-0.5 ${isMe ? 'text-accent/70' : 'text-text-tertiary'}`}>
                    {isVideo ? 'Video' : ext.toUpperCase() || 'File'}
                </p>
            </div>

            {/* Download */}
            <a
                href={fullSrc}
                target="_blank"
                rel="noopener noreferrer"
                download={filename}
                onClick={(e) => e.stopPropagation()}
                className={`flex-shrink-0 p-2 rounded-lg transition-colors ${isMe ? 'text-accent hover:bg-accent/15' : 'text-text-secondary hover:bg-surface-tertiary'}`}
                title="Download"
            >
                <Download size={16} />
            </a>
        </div>
    );
}

// ── Main Component ────────────────────────────────────────────────────────────

export default function MessageBubble({ message, isMe, onImageClick }) {
    const [copied, setCopied] = useState(false);

    // Normalise: WebSocket sends { message: { type, text } }, DB sends { type, text } directly
    const raw = message.message ?? message;
    const type = raw.type ?? 'text';
    const text = raw.text ?? '';

    const handleCopy = async () => {
        try {
            await navigator.clipboard.writeText(text);
            setCopied(true);
            setTimeout(() => setCopied(false), 1500);
        } catch { }
    };

    const isMedia = type === 'image' || type === 'video' || type === 'document';

    /* ── Image bubble ── */
    if (type === 'image') {
        return (
            <motion.div
                initial={{ opacity: 0, y: 6, scale: 0.98 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                transition={{ duration: 0.2, ease: 'easeOut' }}
                className={`flex w-full ${isMe ? 'justify-end' : 'justify-start'}`}
            >
                <ImageMessage src={text} isMe={isMe} onImageClick={onImageClick} />
            </motion.div>
        );
    }

    /* ── Document / video bubble ── */
    if (type === 'document' || type === 'video') {
        return (
            <motion.div
                initial={{ opacity: 0, y: 6, scale: 0.98 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                transition={{ duration: 0.2, ease: 'easeOut' }}
                className={`flex w-full ${isMe ? 'justify-end' : 'justify-start'}`}
            >
                <DocumentMessage src={text} isMe={isMe} />
            </motion.div>
        );
    }

    /* ── Text bubble (default) ── */
    return (
        <motion.div
            initial={{ opacity: 0, y: 6, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            transition={{ duration: 0.2, ease: 'easeOut' }}
            className={`flex w-full ${isMe ? 'justify-end' : 'justify-start'} group`}
        >
            <div className="relative max-w-[75%] md:max-w-[65%]">
                <div
                    className={`
                        px-4 py-2.5 text-sm leading-relaxed
                        ${isMe
                            ? 'bg-accent text-text-inverse rounded-2xl rounded-br-md'
                            : 'bg-surface-elevated text-text-primary border border-border rounded-2xl rounded-bl-md'
                        }
                    `}
                >
                    <div style={{ whiteSpace: 'pre-wrap', wordBreak: 'break-word' }}>{text}</div>

                    {/* Timestamp */}
                    <div className={`text-[10px] mt-1 text-right ${isMe ? 'text-white/60' : 'text-text-tertiary'}`}>
                        {raw.time || ''}
                    </div>
                </div>

                {/* Copy button — visible on hover */}
                <button
                    onClick={handleCopy}
                    className={`
                        absolute -top-2 ${isMe ? '-left-9' : '-right-9'}
                        p-1.5 rounded-lg
                        bg-surface-elevated border border-border shadow-soft
                        text-text-tertiary hover:text-text-primary
                        opacity-0 group-hover:opacity-100
                        transition-all duration-150
                        focus-visible:opacity-100
                    `}
                    aria-label="Copy message"
                >
                    {copied ? (
                        <Check size={12} className="text-success" />
                    ) : (
                        <Copy size={12} />
                    )}
                </button>
            </div>
        </motion.div>
    );
}
