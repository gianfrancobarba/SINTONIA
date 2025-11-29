import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { updatePost, getForumPosts } from '../services/forum.service';
import { categoryInfo } from '../services/forum.service';
import CategoryModal from '../components/CategoryModal';
import type { ForumCategory, UpdatePostDto } from '../types/forum';
import '../css/EditPost.css';
import LeftArrowIcon from '../assets/icons/LeftArrow.svg';

const EditPost: React.FC = () => {
    const navigate = useNavigate();
    const { id } = useParams<{ id: string }>();
    const [title, setTitle] = useState('');
    const [content, setContent] = useState('');
    const [category, setCategory] = useState<ForumCategory | null>(null);
    const [showCategoryModal, setShowCategoryModal] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        loadPost();
    }, [id]);

    const loadPost = async () => {
        try {
            setIsLoading(true);
            const data = await getForumPosts();
            const post = [...data.myQuestions, ...data.publicQuestions].find(p => p.id === id);

            if (post) {
                setTitle(post.title);
                setContent(post.content);
                setCategory(post.category);
            } else {
                alert('Domanda non trovata');
                navigate('/forum');
            }
        } catch (error) {
            console.error('Error loading post:', error);
            alert('Errore nel caricamento della domanda');
            navigate('/forum');
        } finally {
            setIsLoading(false);
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!title.trim() || !content.trim()) {
            alert('Per favore compila tutti i campi');
            return;
        }

        if (!category) {
            alert('Per favore seleziona una categoria');
            return;
        }

        if (!id) {
            alert('ID domanda mancante');
            return;
        }

        try {
            setIsSubmitting(true);
            const updateData: UpdatePostDto = {
                title: title.trim(),
                content: content.trim(),
                category,
            };
            await updatePost(id, updateData);
            navigate('/forum');
        } catch (error) {
            console.error('Error updating post:', error);
            alert('Errore nella modifica del post');
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleCancel = () => {
        navigate('/forum');
    };

    const getCategoryLabel = (catId: ForumCategory) => {
        return categoryInfo.find((c) => c.id === catId)?.label || catId;
    };

    if (isLoading) {
        return <div className="loading-screen">Caricamento...</div>;
    }

    return (
        <div className="edit-post-page">
            {/* Header blu scuro */}
            <div className="edit-post-header-blue">
                <button
                    className="back-arrow-btn-circle"
                    onClick={handleCancel}
                    disabled={isSubmitting}
                    aria-label="Torna indietro"
                >
                    <img src={LeftArrowIcon} alt="Back" />
                </button>
                <h1 className="edit-post-title-white">Modifica domanda</h1>
            </div>

            {/* Form */}
            <form className="edit-post-form" onSubmit={handleSubmit}>
                {/* Campo Titolo */}
                <div className="form-group">
                    <label htmlFor="title" className="form-label-bold">Titolo</label>
                    <div className="input-with-icon">
                        <input
                            id="title"
                            type="text"
                            className="form-input-new"
                            placeholder="Inserisci un titolo"
                            value={title}
                            onChange={(e) => setTitle(e.target.value)}
                            maxLength={64}
                            disabled={isSubmitting}
                        />
                    </div>
                </div>

                {/* Campo Contenuto con contatore */}
                <div className="form-group">
                    <label htmlFor="content" className="form-label-bold">Contenuto</label>
                    <div className="textarea-container card">
                        <textarea
                            id="content"
                            className="form-textarea-new"
                            placeholder="Descrivi la tua domanda in dettaglio..."
                            value={content}
                            onChange={(e) => setContent(e.target.value)}
                            maxLength={300}
                            rows={6}
                            disabled={isSubmitting}
                        />
                        <span className="char-counter">{content.length}/300</span>
                    </div>
                </div>

                {/* Selezione categoria (campo cliccabile) */}
                <div className="form-group">
                    <div
                        className="category-selector"
                        onClick={() => !isSubmitting && setShowCategoryModal(true)}
                    >
                        <span className="category-label">
                            {category ? getCategoryLabel(category) : 'Seleziona una categoria'}
                        </span>
                    </div>
                </div>
            </form>

            {/* Bottone fisso in fondo */}
            <button
                className="publish-button-fixed"
                onClick={handleSubmit}
                disabled={isSubmitting || !title.trim() || !content.trim() || !category}
            >
                {isSubmitting ? 'Modifica in corso...' : 'Modifica Domanda'}
            </button>

            {/* Modal per selezione categoria */}
            {showCategoryModal && (
                <CategoryModal
                    categories={categoryInfo}
                    selectedCategory={category}
                    onSelect={(cat) => {
                        setCategory(cat);
                        setShowCategoryModal(false);
                    }}
                    onClose={() => setShowCategoryModal(false)}
                />
            )}
        </div>
    );
};

export default EditPost;
