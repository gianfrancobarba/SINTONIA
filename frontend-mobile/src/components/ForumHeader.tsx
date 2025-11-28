import React from 'react';
import { useNavigate } from 'react-router-dom';
import '../css/ForumHeader.css';

interface ForumHeaderProps {
    postCount: number;
    onAddPost: () => void;
}

const ForumHeader: React.FC<ForumHeaderProps> = ({ postCount, onAddPost }) => {
    const navigate = useNavigate();

    return (
        <div className="forum-header">
            <div className="forum-header-content">
                <button
                    className="back-button"
                    onClick={() => navigate('/home')}
                    aria-label="Torna indietro"
                >
                    ←
                </button>
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
