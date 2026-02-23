import React from 'react';
import { Search, X, PanelLeftClose, PanelLeft } from 'lucide-react';
import { Link } from 'react-router-dom';
import Avatar from '../ui/Avatar';
import Badge from '../ui/Badge';
import ThemeToggle from '../ui/ThemeToggle';
import { ChatItemSkeleton } from '../ui/Skeleton';

function formatChatTime(value) {
    if (!value) return '';
    const date = new Date(value);
    if (Number.isNaN(date.getTime())) return '';

    const now = new Date();
    const isToday = date.toDateString() === now.toDateString();

    if (isToday) {
        return date.toLocaleTimeString([], { hour: 'numeric', minute: '2-digit' });
    }

    const yesterday = new Date(now);
    yesterday.setDate(now.getDate() - 1);
    if (date.toDateString() === yesterday.toDateString()) {
        return 'Yesterday';
    }

    const diffMs = now - date;
    const oneWeekMs = 7 * 24 * 60 * 60 * 1000;
    if (diffMs < oneWeekMs) {
        return date.toLocaleDateString([], { weekday: 'short' });
    }

    return date.toLocaleDateString([], { day: 'numeric', month: 'short' });
}

export default function Sidebar({
    chats,
    selectedChatId,
    onSelectChat,
    unreadCounts,
    search,
    onSearchChange,
    searchResults,
    isSearching,
    onSearchResultClick,
    collapsed,
    onToggleCollapse,
    isLoading = false,
}) {
    const filteredChats = chats.filter((chat) =>
        chat.name?.toLowerCase().includes(search.toLowerCase())
    );

    return (
        <>
            {/* Mobile backdrop */}
            {!collapsed && (
                <div
                    className="fixed inset-0 bg-black/30 z-30 md:hidden animate-fade-in"
                    onClick={onToggleCollapse}
                />
            )}

            <aside
                className={`
          fixed md:relative z-40 md:z-auto
          h-full flex flex-col
          bg-surface border-r border-border
          transition-all duration-300 ease-in-out
          ${collapsed
                        ? '-translate-x-full md:translate-x-0 md:w-0 md:overflow-hidden md:border-r-0'
                        : 'translate-x-0 w-[var(--sidebar-width)]'
                    }
        `}
            >
                {/* Header */}
                <div className="flex items-center justify-between px-4 py-3 border-b border-border-secondary">
                    <div className="flex items-center gap-2">
                        <div className="w-8 h-8 rounded-lg bg-accent flex items-center justify-center">
                            <span className="text-text-inverse font-bold text-sm">M</span>
                        </div>
                        <span className="font-semibold text-text-primary text-base tracking-tight">
                            My Chat
                        </span>
                    </div>
                    <div className="flex items-center gap-1">
                        <ThemeToggle />
                        <button
                            onClick={onToggleCollapse}
                            className="p-2 rounded-xl text-text-secondary hover:text-text-primary hover:bg-surface-tertiary transition-all"
                            aria-label="Toggle sidebar"
                        >
                            <PanelLeftClose size={18} />
                        </button>
                    </div>
                </div>

                {/* Search */}
                <div className="p-3 border-b border-border-secondary">
                    <div className="flex items-center gap-2 bg-surface-tertiary border border-transparent rounded-xl px-3 py-2 transition-all focus-within:border-accent focus-within:bg-surface">
                        <Search size={16} className="text-text-tertiary shrink-0" />
                        <input
                            className="bg-transparent outline-none text-sm w-full text-text-primary placeholder:text-text-tertiary"
                            placeholder="Search or start new chat"
                            value={search}
                            onChange={(e) => onSearchChange(e.target.value)}
                        />
                        {search && (
                            <button
                                onClick={() => onSearchChange('')}
                                className="text-text-tertiary hover:text-text-primary transition-colors"
                            >
                                <X size={14} />
                            </button>
                        )}
                    </div>

                    {/* Search results dropdown */}
                    {(isSearching || searchResults.length > 0) && (
                        <div className="mt-2 max-h-60 overflow-y-auto bg-surface-elevated border border-border rounded-xl shadow-elevated z-10 animate-slide-down">
                            {isSearching && (
                                <div className="px-4 py-3 text-xs text-text-tertiary flex items-center gap-2">
                                    <div className="w-3 h-3 border-2 border-accent border-t-transparent rounded-full animate-spin" />
                                    Searching...
                                </div>
                            )}
                            {!isSearching && searchResults.length === 0 && (
                                <div className="px-4 py-3 text-xs text-text-tertiary">No results found</div>
                            )}
                            {!isSearching &&
                                searchResults.map((user) => (
                                    <div
                                        key={user._id}
                                        className="px-4 py-3 text-sm hover:bg-surface-tertiary cursor-pointer border-b border-border-secondary last:border-0 transition-colors"
                                        onClick={() => onSearchResultClick(user)}
                                    >
                                        <div className="font-medium text-text-primary">{user.name || user.phone}</div>
                                        {user.phone && (
                                            <div className="text-xs text-text-tertiary mt-0.5">{user.phone}</div>
                                        )}
                                    </div>
                                ))}
                        </div>
                    )}
                </div>

                {/* Chat List */}
                <div className="flex-1 overflow-y-auto">
                    {isLoading ? (
                        <div className="space-y-1 p-2">
                            {[...Array(6)].map((_, i) => (
                                <ChatItemSkeleton key={i} />
                            ))}
                        </div>
                    ) : filteredChats.length === 0 ? (
                        <div className="flex flex-col items-center justify-center h-40 text-text-tertiary">
                            <p className="text-sm">No chats yet</p>
                            <p className="text-xs mt-1">Search for someone to start chatting</p>
                        </div>
                    ) : (
                        <div className="p-2 space-y-0.5">
                            {filteredChats.map((chat) => {
                                const isActive = chat._id === selectedChatId;
                                return (
                                    <div
                                        key={chat._id}
                                        onClick={() => onSelectChat(chat._id)}
                                        className={`
                      flex items-center gap-3 px-3 py-2.5 rounded-xl cursor-pointer
                      transition-all duration-150 group
                      ${isActive
                                                ? 'bg-accent-subtle'
                                                : 'hover:bg-surface-tertiary'
                                            }
                    `}
                                    >
                                        <Avatar
                                            src={chat.profilePic}
                                            name={chat.name}
                                            size="md"
                                        />
                                        <div className="flex-1 min-w-0">
                                            <div className="flex justify-between items-baseline mb-0.5">
                                                <span
                                                    className={`font-medium text-sm truncate ${isActive ? 'text-accent' : 'text-text-primary'
                                                        }`}
                                                >
                                                    {chat.name}
                                                </span>
                                            </div>
                                            <div className="flex justify-between
 gap-2 text-xs truncate text-text-secondary">
                                                <div>

                                                    {chat.lastMessage.text || 'No messages yet'}
                                                </div>
                                                <div>

                                                    {formatChatTime(chat.lastMessage?.time || chat.createdAt)}
                                                </div>
                                            </div>
                                        </div>
                                        <Badge count={unreadCounts[chat._id]} />
                                    </div>
                                );
                            })}
                        </div>
                    )}
                </div>

                {/* Bottom — Profile link */}
                <div className="p-3 border-t border-border-secondary">
                    <Link
                        to="/profile"
                        className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm text-text-secondary hover:text-text-primary hover:bg-surface-tertiary transition-all"
                    >
                        <div className="w-8 h-8 rounded-full bg-surface-tertiary flex items-center justify-center">
                            <span className="text-xs font-semibold text-text-secondary">👤</span>
                        </div>
                        <span className="font-medium">Profile & Settings</span>
                    </Link>
                </div>
            </aside>
        </>
    );
}
