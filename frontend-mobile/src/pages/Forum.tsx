import React, { useEffect, useState } from 'react';
import { useNavigate, useLocation, useSearchParams } from 'react-router-dom';
import ForumHeader from '../components/ForumHeader';
import CategoryFilters from '../components/CategoryFilters';
import ForumPostCard from '../components/ForumPostCard';
import { getForumPosts, deletePost } from '../services/forum.service';
import type { ForumPost, ForumCategory } from '../types/forum';
import '../css/Forum.css';
import Toast from '../components/Toast';
import NewDiaryPageIcon from '../assets/icons/NewDiaryPage.svg';
import LoadingSpinner from '../components/LoadingSpinner';
import { useCache } from '../contexts/CacheContext';

const Forum: React.FC = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const [searchParams, setSearchParams] = useSearchParams();

    const { forumData, setForumData } = useCache();
    // Helper accessors
    const myQuestions = forumData?.myQuestions || [];
    const publicQuestions = forumData?.publicQuestions || [];

    // Loading is true only if we don't have cached data yet
    const [loading, setLoading] = useState(!forumData);
    const [selectedCategories, setSelectedCategories] = useState<ForumCategory[]>([]);
    const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' } | null>(null);
    const [filter, setFilter] = useState<'all' | 'mine'>('all'); // New filter state

    useEffect(() => {
        fetchPosts();
    }, [location.key]); // Ricarica quando la location cambia (es. tornando da CreatePost)

    // Scroll automatico al post specifico quando viene passato postId
    useEffect(() => {
        const postId = searchParams.get('postId');
        if (postId && !loading) {
            // Timeout per assicurarsi che il DOM sia renderizzato
            setTimeout(() => {
                const element = document.getElementById(`post-${postId}`);
                if (element) {
                    element.scrollIntoView({
                        behavior: 'smooth',
                        block: 'center'
                    });
                    // Rimuove il parametro dalla URL dopo lo scroll
                    setSearchParams({});
                }
            }, 300);
        }
    }, [loading, searchParams, setSearchParams]);

    // Handle Toast from navigation state
    useEffect(() => {
        if (location.state?.toastMessage) {
            setToast({
                message: location.state.toastMessage,
                type: location.state.toastType || 'success'
            });
            // Clear state
            window.history.replaceState({}, document.title);
        }
    }, [location]);

    const fetchPosts = async () => {
        try {
            if (!forumData) setLoading(true);
            const data = await getForumPosts();
            setForumData(data);
        } catch (error) {
            console.error('Error fetching forum posts:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleAddPost = () => {
        navigate('/forum/create');
    };

    const handleEditPost = (id: string) => {
        navigate(`/forum/edit/${id}`);
    };

    const handleDeletePost = async (id: string) => {
        try {
            await deletePost(id);
            setToast({ message: 'Domanda eliminata con successo!', type: 'success' });
            fetchPosts();
        } catch (error) {
            console.error('Error deleting post:', error);
        }
    };

    const handleCategoryChange = (categories: ForumCategory[]) => {
        setSelectedCategories(categories);
    };

    // Filtra le domande in base alle categorie selezionate
    const filteredMyQuestions = selectedCategories.length > 0
        ? myQuestions.filter(q => selectedCategories.includes(q.category))
        : myQuestions;

    const filteredPublicQuestions = selectedCategories.length > 0
        ? publicQuestions.filter(q => selectedCategories.includes(q.category))
        : publicQuestions;

    // Display questions based on filter
    // 'all' = only public questions (not mine)
    // 'mine' = only my questions
    const displayQuestions = filter === 'mine' ? filteredMyQuestions : filteredPublicQuestions;

    if (!forumData && !loading) {
        // Show empty state or error if absolutely no data and no loading
    }

    if (loading && !forumData) {
        return (
            <div className="loading-screen">
                <LoadingSpinner />
            </div>
        );
    }

    return (
        <div className="forum-page">
            <ForumHeader onAddPost={handleAddPost} />
            <CategoryFilters
                selectedCategories={selectedCategories}
                onCategoryChange={handleCategoryChange}
            />

            {/* Filter Toggle - below category filters */}
            <div className="forum-filter-section">
                <div className="forum-filter-toggle">
                    <button
                        className={`filter-btn ${filter === 'all' ? 'active' : ''}`}
                        onClick={() => setFilter('all')}
                    >
                        I post degli altri
                    </button>
                    <button
                        className={`filter-btn ${filter === 'mine' ? 'active' : ''}`}
                        onClick={() => setFilter('mine')}
                    >
                        I tuoi post
                    </button>
                </div>
            </div>

            <div className="forum-content">
                {/* Sezione con titolo condizionale */}
                {displayQuestions.length > 0 ? (
                    <div className="forum-section">
                        <h2 className="section-title">
                            {filter === 'mine' ? 'I Tuoi Post' : 'Post degli Altri'}
                        </h2>
                        <div className="posts-list">
                            {displayQuestions.map(post => (
                                <div key={post.id} id={`post-${post.id}`}>
                                    <ForumPostCard
                                        post={post}
                                        isOwnPost={filter === 'mine'}
                                        onEdit={filter === 'mine' ? handleEditPost : undefined}
                                        onDelete={filter === 'mine' ? handleDeletePost : undefined}
                                    />
                                </div>
                            ))}
                        </div>
                    </div>
                ) : (
                    <div className="no-posts">
                        <p>Nessuna domanda trovata.</p>
                        {filter === 'mine' ? (
                            <p className="no-posts-hint">Non hai ancora fatto domande. Aggiungi la tua prima domanda!</p>
                        ) : selectedCategories.length === 0 ? (
                            <p className="no-posts-hint">Aggiungi la tua prima domanda!</p>
                        ) : (
                            <p className="no-posts-hint">Prova a selezionare altre categorie.</p>
                        )}
                    </div>
                )}
            </div>

            <button
                className="forum-fab"
                onClick={handleAddPost}
                aria-label="Nuova domanda"
            >
                <img src={NewDiaryPageIcon} alt="" />
            </button>

            {toast && (
                <Toast
                    message={toast.message}
                    type={toast.type}
                    onClose={() => setToast(null)}
                />
            )}
        </div>
    );
};

export default Forum;
