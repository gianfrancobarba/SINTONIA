import React, { useState } from 'react';
import type { ForumPost } from '../types/forum';
import { formatRelativeTime, categoryInfo } from '../services/forum.service';
import ConfirmDeleteModal from './ConfirmDeleteModal';
import '../css/ForumPostCard.css';
import EditIcon from '../assets/icons/edit-pen.svg';

interface ForumPostCardProps {
    post: ForumPost;
    isOwnPost?: boolean;
    onEdit?: (id: string) => void;
    onDelete?: (id: string) => void;
}

const ForumPostCard: React.FC<ForumPostCardProps> = ({ post, isOwnPost = false, onEdit, onDelete }) => {
    const [showDeleteModal, setShowDeleteModal] = useState(false);

    const category = categoryInfo.find(c => c.id === post.category);
    const categoryColor = category?.color || '#888';

    const handleEdit = () => {
        if (onEdit) {
            onEdit(post.id);
        }
    };

    const handleDelete = () => {
        setShowDeleteModal(true);
    };

    const confirmDelete = () => {
        if (onDelete) {
            onDelete(post.id);
        }
        setShowDeleteModal(false);
    };

    return (
        <div className="forum-post-card">
            <div className="post-header">
                <div className="post-header-left">
                    <div
                        className="category-badge"
                        style={{ backgroundColor: categoryColor }}
                    />
                    <div className="post-meta">
                        <h3 className="post-title">{post.title}</h3>
                        <span className="post-timestamp">{formatRelativeTime(post.createdAt)}</span>
                    </div>
                </div>
                {/* Mostra azioni SOLO se è una domanda propria E NON ha risposte */}
                {isOwnPost && (!post.answers || post.answers.length === 0) && (
                    <div className="post-menu-container">
                        {onEdit && (
                            <button
                                className="post-action-btn edit-btn"
                                onClick={(e) => { e.stopPropagation(); handleEdit(); }}
                                aria-label="Modifica"
                            >
                                <img src={EditIcon} alt="" />
                            </button>
                        )}
                        {onDelete && (
                            <button
                                className="post-action-btn delete-btn"
                                onClick={(e) => { e.stopPropagation(); handleDelete(); }}
                                aria-label="Elimina"
                            >
                                ×
                            </button>
                        )}
                    </div>
                )}
            </div>
            <p className="post-content">{post.content}</p>

            {/* Mostra risposte se presenti */}
            {post.answers && post.answers.length > 0 && (
                <div className="post-answers">
                    <h4 className="answers-title">
                        Risposto da {post.answers.length} {post.answers.length > 1 ? 'psicologi' : 'psicologo'}
                    </h4>
                    {post.answers.map((answer) => (
                        <div key={answer.idRisposta} className="answer-card">
                            <div className="answer-header">
                                <strong>Dr. {answer.nomePsicologo} {answer.cognomePsicologo}</strong>
                                <span className="answer-date">{formatRelativeTime(new Date(answer.dataRisposta))}</span>
                            </div>
                            <p className="answer-content">{answer.testo}</p>
                        </div>
                    ))}
                </div>
            )}

            {/* Modal conferma eliminazione */}
            {showDeleteModal && (
                <ConfirmDeleteModal
                    onConfirm={confirmDelete}
                    onCancel={() => setShowDeleteModal(false)}
                />
            )}
        </div>
    );
};

export default ForumPostCard;
