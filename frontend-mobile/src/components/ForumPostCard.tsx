import React, { useState, useRef, useLayoutEffect } from 'react';
import type { ForumPost } from '../types/forum';
import { formatRelativeTime, categoryInfo } from '../services/forum.service';
import ConfirmDeleteModal from './ConfirmDeleteModal';
import '../css/ForumPostCard.css';
import EditIcon from '../assets/icons/edit-pen.svg';
import { ChevronDown, ChevronUp } from 'lucide-react';

interface ForumPostCardProps {
    post: ForumPost;
    isOwnPost?: boolean;
    onEdit?: (id: string) => void;
    onDelete?: (id: string) => void;
}

const ForumPostCard: React.FC<ForumPostCardProps> = ({ post, isOwnPost = false, onEdit, onDelete }) => {
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [isContentExpanded, setIsContentExpanded] = useState(false);
    const [areAnswersExpanded, setAreAnswersExpanded] = useState(false);
    const [isContentTruncated, setIsContentTruncated] = useState(false);
    const contentRef = useRef<HTMLParagraphElement>(null);

    const category = categoryInfo.find(c => c.id === post.category);
    const categoryColor = category?.color || '#888';

    // Check if content is truncated - useLayoutEffect to prevent flicker
    useLayoutEffect(() => {
        if (contentRef.current) {
            setIsContentTruncated(contentRef.current.scrollHeight > contentRef.current.clientHeight);
        }
    }, [post.content]);

    const handleEdit = (e: React.MouseEvent) => {
        e.stopPropagation();
        if (onEdit) {
            onEdit(post.id);
        }
    };

    const handleDelete = (e: React.MouseEvent) => {
        e.stopPropagation();
        setShowDeleteModal(true);
    };

    const confirmDelete = () => {
        if (onDelete) {
            onDelete(post.id);
        }
        setShowDeleteModal(false);
    };

    const hasAnswers = post.answers && post.answers.length > 0;

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
                {isOwnPost && !hasAnswers && (
                    <div className="post-menu-container">
                        {onEdit && (
                            <button
                                className="post-action-btn edit-btn"
                                onClick={handleEdit}
                                aria-label="Modifica"
                            >
                                <img src={EditIcon} alt="" />
                            </button>
                        )}
                        {onDelete && (
                            <button
                                className="post-action-btn delete-btn"
                                onClick={handleDelete}
                                aria-label="Elimina"
                            >
                                ×
                            </button>
                        )}
                    </div>
                )}
            </div>

            {/* Post Content with expand */}
            <p
                ref={contentRef}
                className={`post-content ${isContentExpanded ? 'expanded' : ''}`}
            >
                {post.content}
            </p>
            {isContentTruncated && !isContentExpanded && (
                <button className="expand-btn" onClick={() => setIsContentExpanded(true)}>
                    Leggi di più
                </button>
            )}
            {isContentExpanded && (
                <button className="expand-btn" onClick={() => setIsContentExpanded(false)}>
                    Mostra meno
                </button>
            )}

            {/* Answers Section */}
            {hasAnswers && (
                <div className="post-answers">
                    <button
                        className="answers-toggle"
                        onClick={() => setAreAnswersExpanded(!areAnswersExpanded)}
                    >
                        <span className="answers-toggle-text">
                            Risposto da {post.answers!.length} {post.answers!.length > 1 ? 'psicologi' : 'psicologo'}
                        </span>
                        {areAnswersExpanded ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
                    </button>

                    {areAnswersExpanded && (
                        <div className="answers-list">
                            {post.answers!.map((answer) => (
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
                </div>
            )}

            {/* Modal conferma eliminazione */}
            <ConfirmDeleteModal
                isOpen={showDeleteModal}
                onConfirm={confirmDelete}
                onCancel={() => setShowDeleteModal(false)}
            />
        </div>
    );
};

export default ForumPostCard;
