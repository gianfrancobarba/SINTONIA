/* Generico per Tabelle Dati */

import React from 'react';
import type { Questionnaire } from '../types/psychologist';
import '../css/DataTable.css';

interface DataTableProps {
    questionnaires: Questionnaire[];
}

const DataTable: React.FC<DataTableProps> = ({ questionnaires }) => {
    const handleView = (id: string) => {
        console.log('View questionnaire:', id);
        // Placeholder - will be implemented in future
    };

    const handleEdit = (id: string) => {
        console.log('Edit questionnaire:', id);
        // Placeholder - will be implemented in future
    };

    const handleDelete = (id: string) => {
        console.log('Delete questionnaire:', id);
        // Placeholder - will be implemented in future
    };

    const getStatusClassName = (status: string) => {
        return `status-badge status-${status.toLowerCase().replace(' ', '-')}`;
    };

    return (
        <div className="data-table-container">
            <table className="data-table">
                <thead>
                    <tr>
                        <th>Nome Questionario</th>
                        <th>Autore</th>
                        <th>Stato</th>
                        <th>Data Invio Revisione</th>
                        <th>Azioni</th>
                    </tr>
                </thead>
                <tbody>
                    {questionnaires.map((questionnaire) => (
                        <tr key={questionnaire.id}>
                            <td>{questionnaire.name}</td>
                            <td>{questionnaire.author}</td>
                            <td>
                                <span className={getStatusClassName(questionnaire.status)}>
                                    {questionnaire.status}
                                </span>
                            </td>
                            <td>{questionnaire.revisionDate}</td>
                            <td className="actions-cell">
                                <button
                                    className="action-btn view-btn"
                                    onClick={() => handleView(questionnaire.id)}
                                    aria-label="View"
                                    title="View"
                                >
                                    👁
                                </button>
                                <button
                                    className="action-btn edit-btn"
                                    onClick={() => handleEdit(questionnaire.id)}
                                    aria-label="Edit"
                                    title="Edit"
                                >
                                    ✎
                                </button>
                                <button
                                    className="action-btn delete-btn"
                                    onClick={() => handleDelete(questionnaire.id)}
                                    aria-label="Delete"
                                    title="Delete"
                                >
                                    🗑
                                </button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};

export default DataTable;
