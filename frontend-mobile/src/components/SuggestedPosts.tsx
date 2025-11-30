import React, { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import type { SuggestedPost } from '../types/home';
import '../css/SuggestedPosts.css';

interface SuggestedPostsProps {
    posts: SuggestedPost[];
}

const SuggestedPosts: React.FC<SuggestedPostsProps> = ({ posts }) => {
    const navigate = useNavigate();
    const [activeIndex, setActiveIndex] = useState(0);
    const scrollContainerRef = useRef<HTMLDivElement>(null);

    const handleScroll = () => {
        if (scrollContainerRef.current) {
            const { scrollLeft } = scrollContainerRef.current;
            // Assuming card width + gap is roughly 275px (260px min-width + 15px gap)
            // Or simpler: calculate based on center point
            const cardWidth = 275;
            const index = Math.round(scrollLeft / cardWidth);
            // Clamp index to bounds
            const clampedIndex = Math.max(0, Math.min(index, posts.length - 1));
            setActiveIndex(clampedIndex);
        }
    };

    const handleMoreOptions = () => {
        navigate('/forum');
    };

    const handlePostClick = (postId: string) => {
        // Navigate to forum with the specific post ID in the URL
        navigate(`/forum?postId=${postId}`);
    };

    return (
        <div className="suggested-posts-section">
            <div className="section-header">
                <h3>Post che potrebbero interessarti</h3>
                <button className="more-options" onClick={handleMoreOptions}>•••</button>
            </div>

            <div
                className="posts-container no-scrollbar"
                ref={scrollContainerRef}
                onScroll={handleScroll}
            >
                {posts.map((post) => (
                    <div
                        key={post.id}
                        className="post-card"
                        onClick={() => handlePostClick(post.id)}
                    >
                        <div className="post-category-tag">
                            {post.category}
                        </div>
                        <h4 className="post-title">{post.title}</h4>
                        <p className="post-snippet">{post.contentSnippet}</p>
                    </div>
                ))}
            </div>

            <div className="pagination-dots">
                {posts.map((_, index) => (
                    <div
                        key={index}
                        className={`pagination-dot ${index === activeIndex ? 'active' : ''}`}
                    />
                ))}
            </div>
        </div>
    );
};

export default SuggestedPosts;
