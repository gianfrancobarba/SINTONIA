import React, { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import type { SuggestedPost } from '../types/home';
import { categoryInfo } from '../services/forum.service';
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

    // Helper function to get category color
    const getCategoryColor = (category: string): string => {
        const categoryKey = category.toLowerCase().replace(/ /g, '_');
        const categoryData = categoryInfo.find(c => c.id === categoryKey);
        return categoryData?.color || '#e0f2f1'; // Default color if not found
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
                        <div
                            className="post-category-tag"
                            style={{ backgroundColor: getCategoryColor(post.category) }}
                        >
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
