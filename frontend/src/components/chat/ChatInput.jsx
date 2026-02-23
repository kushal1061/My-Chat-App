import React, { useRef, useState } from 'react';
import { Send, Paperclip, Image as ImageIcon, Video, FileText, X } from 'lucide-react';
import TextareaAutosize from 'react-textarea-autosize';

export default function ChatInput({
    input,
    onInputChange,
    onSend,
    onFileSelect,
    disabled = false,
}) {
    const [showAttachMenu, setShowAttachMenu] = useState(false);
    const fileInputRef = useRef(null);

    const handleAttachmentOption = (type) => {
        if (!fileInputRef.current) return;
        switch (type) {
            case 'video':
                fileInputRef.current.accept = 'video/*';
                break;
            case 'image':
                fileInputRef.current.accept = 'image/*';
                break;
            case 'document':
                fileInputRef.current.accept = '.pdf,.doc,.docx,.txt';
                break;
            default:
                fileInputRef.current.accept = '*';
        }
        fileInputRef.current.click();
        setShowAttachMenu(false);
    };

    const handleKeyDown = (e) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            onSend();
        }
    };

    const attachOptions = [
        { type: 'image', icon: ImageIcon, label: 'Photos', color: 'text-purple-500 bg-purple-500/10' },
        { type: 'video', icon: Video, label: 'Videos', color: 'text-pink-500 bg-pink-500/10' },
        { type: 'document', icon: FileText, label: 'Document', color: 'text-blue-500 bg-blue-500/10' },
    ];

    return (
        <div className="p-3 border-t border-border bg-surface">
            <div className="flex gap-2 items-end max-w-4xl mx-auto">
                {/* Attachment */}
                <div className="relative">
                    {showAttachMenu && (
                        <div className="absolute bottom-14 left-0 bg-surface-elevated rounded-xl shadow-float border border-border p-1.5 min-w-[170px] animate-scale-in z-20">
                            {attachOptions.map(({ type, icon: Icon, label, color }) => (
                                <button
                                    key={type}
                                    onClick={() => handleAttachmentOption(type)}
                                    className="flex items-center gap-3 w-full px-3 py-2 text-sm text-text-secondary hover:bg-surface-tertiary rounded-lg transition-colors"
                                >
                                    <div className={`p-1.5 rounded-lg ${color}`}>
                                        <Icon size={16} />
                                    </div>
                                    <span className="font-medium">{label}</span>
                                </button>
                            ))}
                        </div>
                    )}
                    <button
                        onClick={() => setShowAttachMenu(!showAttachMenu)}
                        disabled={disabled}
                        className={`
              p-2.5 rounded-xl transition-all duration-200
              disabled:opacity-40 disabled:cursor-not-allowed
              ${showAttachMenu
                                ? 'bg-surface-tertiary text-accent rotate-45'
                                : 'text-text-tertiary hover:bg-surface-tertiary hover:text-text-primary'
                            }
            `}
                        aria-label="Attach file"
                    >
                        {showAttachMenu ? <X size={18} /> : <Paperclip size={18} />}
                    </button>
                    <input
                        ref={fileInputRef}
                        type="file"
                        className="hidden"
                        onChange={(e) => onFileSelect(e)}
                    />
                </div>

                {/* Input */}
                <div className="flex-1">
                    <TextareaAutosize
                        minRows={1}
                        maxRows={5}
                        value={input}
                        onChange={(e) => onInputChange(e.target.value)}
                        onKeyDown={handleKeyDown}
                        disabled={disabled}
                        placeholder={disabled ? 'Select a chat to start messaging' : 'Type a message...'}
                        className="w-full bg-surface-tertiary rounded-xl px-4 py-2.5 text-sm text-text-primary outline-none border border-transparent focus:border-accent focus:bg-surface focus:ring-2 focus:ring-accent-muted transition-all resize-none placeholder:text-text-tertiary disabled:opacity-50 disabled:cursor-not-allowed"
                    />
                </div>

                {/* Send */}
                <button
                    onClick={onSend}
                    disabled={disabled || !input?.trim()}
                    className="p-2.5 bg-accent text-text-inverse rounded-xl hover:bg-accent-hover disabled:opacity-40 disabled:cursor-not-allowed transition-all duration-200 active:scale-95 shadow-soft"
                    aria-label="Send message"
                >
                    <Send size={18} />
                </button>
            </div>

            {/* Keyboard hint */}
            <div className="max-w-4xl mx-auto mt-1.5 px-12">
                <p className="text-2xs text-text-tertiary">
                    Press <kbd className="px-1 py-0.5 bg-surface-tertiary rounded text-text-tertiary font-mono text-[9px]">Enter</kbd> to send · <kbd className="px-1 py-0.5 bg-surface-tertiary rounded text-text-tertiary font-mono text-[9px]">Shift+Enter</kbd> for new line
                </p>
            </div>
        </div>
    );
}
