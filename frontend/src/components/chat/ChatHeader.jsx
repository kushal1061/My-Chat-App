import React from 'react';
import { PanelLeft, X } from 'lucide-react';
import Avatar from '../ui/Avatar';

export default function ChatHeader({
    chat,
    onAvatarClick,
    sidebarCollapsed,
    onToggleSidebar,
}) {
    return (
        <div className="h-14 px-4 flex items-center justify-between glass border-b border-border sticky top-0 z-10">
            <div className="flex items-center gap-3">
                {sidebarCollapsed && (
                    <button
                        onClick={onToggleSidebar}
                        className="p-2 rounded-xl text-text-secondary hover:text-text-primary hover:bg-surface-tertiary transition-all mr-1"
                        aria-label="Open sidebar"
                    >
                        <PanelLeft size={18} />
                    </button>
                )}

                {chat ? (
                    <>
                        <Avatar
                            src={chat.profilePic}
                            name={chat.name}
                            size="sm"
                            onClick={() => chat.profilePic && onAvatarClick?.(chat.profilePic)}
                        />
                        <div className="flex flex-col leading-tight">
                            <span className="font-semibold text-sm text-text-primary">
                                {chat.name}
                            </span>
                            <span className="text-2xs text-success font-medium">{chat.status}</span>
                        </div>
                    </>
                ) : (
                    <span className="text-sm text-text-secondary font-medium">
                        Select a conversation
                    </span>
                )}
            </div>
        </div>
    );
}
