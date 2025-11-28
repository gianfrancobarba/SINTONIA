import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import ForumHeader from '../components/ForumHeader';
import CategoryFilters from '../components/CategoryFilters';
import ForumPostCard from '../components/ForumPostCard';
import BottomNavigation from '../components/BottomNavigation';
import { getForumPosts, getForumPostsByCategory, deletePost } from '../services/forum.service';
import type { ForumPost, ForumCategory } from '../types/forum';
import '../css/Forum.css';

const Forum: React.FC = () => {
    const navigate = useNavigate();
    const [posts, setPosts] = useState<ForumPost[]>([]);
    const [loading, setLoading] = useState(true);
    const [selectedCategories, setSelectedCategories] = useState<ForumCategory[]>([]);

    useEffect(() => {
        fetchPosts();
    }, [selectedCategories]);

    const fetchPosts = async () => {
        try {
            setLoading(true);
            const data = selectedCategories.length > 0
                ? await getForumPostsByCategory(selectedCategories)
                : await getForumPosts();
            setPosts(data);
        } catch (error) {
            console.error('Error fetching forum posts:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleAddPost = () => {
        navigate('/forum/create');
    };

    const handleDeletePost = async (id: string) => {
        try {
            await deletePost(id);
            fetchPosts();
        } catch (error) {
            console.error('Error deleting post:', error);
        }
    };

    const handleCategoryChange = (categories: ForumCategory[]) => {
        setSelectedCategories(categories);
    };

    if (loading) {
        return <div className="loading-screen">Caricamento...</div>;
    }

    return (
        <div className="forum-page">
            <ForumHeader postCount={posts.length} onAddPost={handleAddPost} />
            <CategoryFilters
                selectedCategories={selectedCategories}
                onCategoryChange={handleCategoryChange}
            />
            <div className="forum-content">
                <div className="posts-list">
                    {posts.length === 0 ? (
                        <div className="no-posts">
                            <p>Nessuna domanda trovata.</p>
                            <p className="no-posts-hint">Prova a selezionare altre categorie o aggiungine una nuova!</p>
                        </div>
                    ) : (
                        posts.map(post => (
                            <ForumPostCard
                                key={post.id}
                                post={post}
                                onDelete={handleDeletePost}
                            />
                        ))
                    )}
                </div>
            </div>
            <BottomNavigation />
        </div>
    );
};

export default Forum;
