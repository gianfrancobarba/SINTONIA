/* Gnerico per pannelli contenuto */

import React, { useState } from 'react';
import DataTable from './DataTable';
import Pagination from './Pagination';
import { getQuestionnairesPage, getTotalPages } from '../services/psychologist.service';
import './ContentPanel.css';

const ContentPanel: React.FC = () => {
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 3;
    const totalPages = getTotalPages(itemsPerPage);
    const questionnaires = getQuestionnairesPage(currentPage, itemsPerPage);

    const handlePageChange = (page: number) => {
        setCurrentPage(page);
    };

    return (
        <div className="content-panel">
            <h2 className="content-panel-title">Gestione Questionari</h2>
            <div className="content-panel-body">
                <DataTable questionnaires={questionnaires} />
                <Pagination
                    currentPage={currentPage}
                    totalPages={totalPages}
                    onPageChange={handlePageChange}
                />
            </div>
        </div>
    );
};

export default ContentPanel;
