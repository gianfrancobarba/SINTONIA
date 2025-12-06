import React from 'react';
import '../css/ForumHeader.css';

interface ForumHeaderProps {
    onAddPost?: () => void;
}

const ForumHeader: React.FC<ForumHeaderProps> = () => {
    return (
        <div className="forum-header">
            <div className="forum-header-content">
                <div className="forum-title-section">
                    <h1 className="forum-title">Forum</h1>
                </div>
            </div>
        </div>
    );
};

export default ForumHeader;
