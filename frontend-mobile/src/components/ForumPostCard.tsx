import React, { useState } from 'react';
import type { ForumPost } from '../types/forum';
import { formatRelativeTime, categoryInfo } from '../services/forum.service';
import '../css/ForumPostCard.css';

interface ForumPostCardProps {
    post: ForumPost;
    onDelete?: (id: string) => void;
}

const ForumPostCard: React.FC<ForumPostCardProps> = ({ post, onDelete }) => {
    const [showMenu, setShowMenu] = useState(false);

    const category = categoryInfo.find(c => c.id === post.category);
    const categoryColor = category?.color || '#888';

    const handleDelete = () => {
        if (onDelete) {
            onDelete(post.id);
        }
        setShowMenu(false);
    };

    return (
        <div className="forum-post-card">
            <div className="post-header">
                <div className="post-header-left">
                    <div
                        className="category-badge"
                        style={{ backgroundColor: categoryColor }}
                    />
                    <div className="post-meta">
                        <h3 className="post-title">{post.title}</h3>
                        <span className="post-timestamp">{formatRelativeTime(post.createdAt)}</span>
                    </div>
                </div>
                <div className="post-menu-container">
                    <button
                        className="menu-button"
                        onClick={() => setShowMenu(!showMenu)}
                        aria-label="Menu post"
                    >
                        ⋮
                    </button>
                    {showMenu && (
                        <div className="menu-dropdown">
                            <button onClick={handleDelete} className="menu-item delete">
                                Elimina
                            </button>
                        </div>
                    )}
                </div>
            </div>
            <p className="post-content">{post.content}</p>
        </div>
    );
};

export default ForumPostCard;
