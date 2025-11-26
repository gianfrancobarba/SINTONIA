import React from 'react';
import type { SuggestedPost } from '../types/home';
import '../css/SuggestedPosts.css';

interface SuggestedPostsProps {
    posts: SuggestedPost[];
}

const SuggestedPosts: React.FC<SuggestedPostsProps> = ({ posts }) => {
    return (
        <div className="suggested-posts-section">
            <div className="section-header">
                <h3>Post che potrebbero interessarti</h3>
                <button className="more-options">•••</button>
            </div>

            <div className="posts-container no-scrollbar">
                {posts.map((post) => (
                    <div key={post.id} className="post-card">
                        <div className="post-category-tag">
                            {post.category}
                        </div>
                        <h4 className="post-title">{post.title}</h4>
                        <p className="post-snippet">{post.contentSnippet}</p>
                    </div>
                ))}
            </div>


        </div>
    );
};

export default SuggestedPosts;
