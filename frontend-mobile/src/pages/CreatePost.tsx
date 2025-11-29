import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { createPost } from '../services/forum.service';
import { categoryInfo } from '../services/forum.service';
import CategoryModal from '../components/CategoryModal';
import type { ForumCategory, CreatePostDto } from '../types/forum';
import '../css/CreatePost.css';
import LeftArrowIcon from '../assets/icons/LeftArrow.svg';

const CreatePost: React.FC = () => {
    const navigate = useNavigate();
    const [title, setTitle] = useState('');
    const [content, setContent] = useState('');
    const [category, setCategory] = useState<ForumCategory | null>(null);
    const [showCategoryModal, setShowCategoryModal] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);

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

        try {
            setIsSubmitting(true);
            const postData: CreatePostDto = {
                title: title.trim(),
                content: content.trim(),
                category,
            };
            await createPost(postData);
            navigate('/forum');
        } catch (error) {
            console.error('Error creating post:', error);
            alert('Errore nella creazione del post');
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

    return (
        <div className="create-post-page">
            {/* Header blu scuro */}
            <div className="create-post-header-blue">
                <button
                    className="back-arrow-btn-circle"
                    onClick={handleCancel}
                    disabled={isSubmitting}
                    aria-label="Torna indietro"
                >
                    <img src={LeftArrowIcon} alt="Back" />
                </button>
                <h1 className="create-post-title-white">Nuova domanda</h1>
            </div>

            {/* Form */}
            <form className="create-post-form" onSubmit={handleSubmit}>
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
                {isSubmitting ? 'Invio in corso...' : 'Pubblica Domanda'}
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

export default CreatePost;
