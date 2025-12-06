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

const Forum: React.FC = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const [searchParams, setSearchParams] = useSearchParams();
    const [myQuestions, setMyQuestions] = useState<ForumPost[]>([]);
    const [publicQuestions, setPublicQuestions] = useState<ForumPost[]>([]);
    const [loading, setLoading] = useState(true);
    const [selectedCategories, setSelectedCategories] = useState<ForumCategory[]>([]);
    const [showToast, setShowToast] = useState(false);
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

    const fetchPosts = async () => {
        try {
            setLoading(true);
            const data = await getForumPosts();
            setMyQuestions(data.myQuestions);
            setPublicQuestions(data.publicQuestions);
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
            setShowToast(true);
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

    if (loading) {
        return <div className="loading-screen">Caricamento...</div>;
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
                        Pubbliche
                    </button>
                    <button
                        className={`filter-btn ${filter === 'mine' ? 'active' : ''}`}
                        onClick={() => setFilter('mine')}
                    >
                        Le mie
                    </button>
                </div>
            </div>

            <div className="forum-content">
                {/* Sezione con titolo condizionale */}
                {displayQuestions.length > 0 ? (
                    <div className="forum-section">
                        <h2 className="section-title">
                            {filter === 'mine' ? 'Le Mie Domande' : 'Domande Pubbliche'}
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

            {showToast && (
                <Toast
                    message="Domanda eliminata con successo!"
                    onClose={() => setShowToast(false)}
                />
            )}
        </div>
    );
};

export default Forum;
