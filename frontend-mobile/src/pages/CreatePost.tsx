import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { createPost } from '../services/forum.service';
import { categoryInfo } from '../services/forum.service';
import type { ForumCategory, CreatePostDto } from '../types/forum';
import '../css/CreatePost.css';

const CreatePost: React.FC = () => {
    const navigate = useNavigate();
    const [title, setTitle] = useState('');
    const [content, setContent] = useState('');
    const [category, setCategory] = useState<ForumCategory>('ansia');
    const [isSubmitting, setIsSubmitting] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!title.trim() || !content.trim()) {
            alert('Per favore compila tutti i campi');
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

    return (
        <div className="create-post-page">
            <div className="create-post-header">
                <button
                    className="cancel-button"
                    onClick={handleCancel}
                    disabled={isSubmitting}
                >
                    Annulla
                </button>
                <h1 className="create-post-title">Nuova Domanda</h1>
                <button
                    className="submit-button"
                    onClick={handleSubmit}
                    disabled={isSubmitting || !title.trim() || !content.trim()}
                >
                    {isSubmitting ? 'Invio...' : 'Pubblica'}
                </button>
            </div>

            <form className="create-post-form" onSubmit={handleSubmit}>
                <div className="form-group">
                    <label htmlFor="title" className="form-label">Titolo</label>
                    <input
                        id="title"
                        type="text"
                        className="form-input"
                        placeholder="Inserisci il titolo della domanda"
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                        maxLength={100}
                        disabled={isSubmitting}
                    />
                </div>

                <div className="form-group">
                    <label htmlFor="category" className="form-label">Categoria</label>
                    <div className="category-select-grid">
                        {categoryInfo.map((cat) => {
                            const isSelected = category === cat.id;
                            return (
                                <button
                                    key={cat.id}
                                    type="button"
                                    className={`category-select-btn ${isSelected ? 'selected' : ''}`}
                                    style={{
                                        backgroundColor: isSelected ? cat.color : 'transparent',
                                        borderColor: cat.color,
                                        color: isSelected ? 'white' : cat.color,
                                    }}
                                    onClick={() => setCategory(cat.id)}
                                    disabled={isSubmitting}
                                >
                                    {cat.label}
                                </button>
                            );
                        })}
                    </div>
                </div>

                <div className="form-group">
                    <label htmlFor="content" className="form-label">Domanda</label>
                    <textarea
                        id="content"
                        className="form-textarea"
                        placeholder="Descrivi la tua domanda in dettaglio..."
                        value={content}
                        onChange={(e) => setContent(e.target.value)}
                        rows={10}
                        disabled={isSubmitting}
                    />
                </div>
            </form>
        </div>
    );
};

export default CreatePost;
