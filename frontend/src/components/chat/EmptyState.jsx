import React from 'react';
import { MessageSquare, Send } from 'lucide-react';

export default function EmptyState({ hasChat = false }) {
    return (
        <div className="flex-1 flex flex-col items-center justify-center text-text-tertiary space-y-4 p-8">
            <div className="w-16 h-16 rounded-2xl bg-surface-tertiary flex items-center justify-center">
                {hasChat ? (
                    <Send size={24} className="text-text-tertiary ml-0.5" />
                ) : (
                    <MessageSquare size={24} className="text-text-tertiary" />
                )}
            </div>
            <div className="text-center space-y-1">
                <p className="text-sm font-medium text-text-secondary">
                    {hasChat ? 'No messages yet' : 'Welcome to My Chat'}
                </p>
                <p className="text-xs text-text-tertiary max-w-xs">
                    {hasChat
                        ? 'Send the first message to start the conversation'
                        : 'Select a conversation from the sidebar or search for someone to start chatting'}
                </p>
            </div>
        </div>
    );
}
