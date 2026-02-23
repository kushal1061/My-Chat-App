import React, { useState } from 'react';
import { Copy, Check } from 'lucide-react';
import { motion } from 'framer-motion';

export default function MessageBubble({ message, isMe }) {
    const [copied, setCopied] = useState(false);

    const handleCopy = async () => {
        try {
            await navigator.clipboard.writeText(message.text || '');
            setCopied(true);
            setTimeout(() => setCopied(false), 1500);
        } catch { }
    };

    return (
        message.type==="image" ? <img width="500px" height="500px" src={"https://"+message.text} alt="" />:
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
                    {/* Message text */}
                    <div className="">{ message.text }</div>

                    {/* Timestamp */}
                    <div
                        className={`text-[10px] mt-1 text-right ${isMe ? 'text-white/60' : 'text-text-tertiary'
                            }`}
                    >
                        {message.time || ''}
                    </div>
                </div>

                {/* Copy button — hover visible */}
                <button
                    onClick={handleCopy}
                    className={`
            absolute -top-2 ${isMe ? '-left-8' : '-right-8'}
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
