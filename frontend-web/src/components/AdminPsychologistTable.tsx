import React from 'react';
import '../css/QuestionnaireTable.css'; // Reuse existing styles

// SVG Icon Component
const ViewIcon = () => (
    <svg viewBox="0 0 256 256" fill="currentColor" xmlns="http://www.w3.org/2000/svg" stroke="currentColor" strokeWidth="10.24">
        <path d="M112,44H48a4,4,0,0,0-4,4v64a4,4,0,0,0,4,4h64a4,4,0,0,0,4-4V48A4,4,0,0,0,112,44Zm-4,64H52V52h56ZM208,44H144a4,4,0,0,0-4,4v64a4,4,0,0,0,4,4h64a4,4,0,0,0,4-4V48A4,4,0,0,0,208,44Zm-4,64H148V52h56Zm-92,32H48a4,4,0,0,0-4,4v64a4.0002,4.0002,0,0,0,4,4h64a4.0002,4.0002,0,0,0,4-4V144A4,4,0,0,0,112,140Zm-4,64H52V148h56Zm100-64H144a4,4,0,0,0-4,4v64a4.0002,4.0002,0,0,0,4,4h64a4.0002,4.0002,0,0,0,4-4V144A4,4,0,0,0,208,140Zm-4,64H148V148h56Z" />
    </svg>
);

interface PsychologistData {
    codiceFiscale: string;
    nome: string;
    cognome: string;
    email: string;
    aslAppartenenza: string;
    stato: 'Attivo' | 'Inattivo';  // Changed from 'Disattivato' to 'Inattivo'
}

interface AdminPsychologistTableProps {
    psychologists: PsychologistData[];
    selectedId: string | null;
    onSelect: (id: string) => void;
    onView: (id: string) => void;
}

const AdminPsychologistTable: React.FC<AdminPsychologistTableProps> = ({
    psychologists,
    selectedId,
    onSelect,
    onView,
}) => {
    return (
        <div className="questionnaire-table-container">
            <table className="questionnaire-table">
                <thead>
                    <tr>
                        <th>Codice Fiscale</th>
                        <th>Nome</th>
                        <th>Cognome</th>
                        <th>ASL Appartenenza</th>
                        <th>Stato</th>
                        <th>Email</th>
                        <th>Azioni</th>
                    </tr>
                </thead>
                <tbody>
                    {psychologists.map((psy) => {
                        const isSelected = selectedId === psy.codiceFiscale;

                        return (
                            <tr
                                key={psy.codiceFiscale}
                                className={isSelected ? 'selected' : ''}
                                onClick={() => onSelect(psy.codiceFiscale)}
                            >
                                <td
                                    className="questionnaire-id-cell"
                                    title={`Codice Fiscale: ${psy.codiceFiscale}`}
                                >
                                    {psy.codiceFiscale}
                                </td>
                                <td>{psy.nome}</td>
                                <td>{psy.cognome}</td>
                                <td>{psy.aslAppartenenza}</td>
                                <td>
                                    <span style={{
                                        padding: '4px 8px',
                                        borderRadius: '4px',
                                        fontSize: '12px',
                                        fontWeight: 'bold',
                                        backgroundColor: psy.stato === 'Attivo' ? '#d4edda' : '#f8d7da',
                                        color: psy.stato === 'Attivo' ? '#155724' : '#721c24'
                                    }}>
                                        {psy.stato}
                                    </span>
                                </td>
                                <td>{psy.email}</td>
                                <td className="actions-cell">
                                    <button
                                        className="action-btn view-btn"
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            onView(psy.codiceFiscale);
                                        }}
                                        aria-label="Visualizza"
                                        title="Visualizza"
                                    >
                                        <ViewIcon />
                                    </button>
                                </td>
                            </tr>
                        );
                    })}
                </tbody>
            </table>

            {psychologists.length === 0 && (
                <div className="empty-state">
                    <p>Nessuno psicologo trovato</p>
                </div>
            )}
        </div>
    );
};

export default AdminPsychologistTable;
