import React from 'react';
import '../css/ForumHeader.css';

interface ForumHeaderProps {
    postCount: number;
    onAddPost: () => void;
}

const ForumHeader: React.FC<ForumHeaderProps> = ({ postCount, onAddPost }) => {
    return (
        <div className="forum-header">
            <div className="forum-header-content">
                <div className="forum-title-section">
                    <h1 className="forum-title">Forum</h1>
                    <p className="forum-subtitle">{postCount} domande inserite</p>
                </div>
                <button
                    className="add-post-button"
                    onClick={onAddPost}
                    aria-label="Aggiungi domanda"
                >
                    +
                </button>
            </div>
        </div>
    );
};

export default ForumHeader;
