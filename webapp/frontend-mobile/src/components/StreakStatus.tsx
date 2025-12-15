import React from 'react';
import type { HomeDashboardDto } from '../types/home';
import '../css/StreakStatus.css';
import fireIcon from '../assets/icons/fire-department.svg';

interface StreakStatusProps {
    data: HomeDashboardDto;
}

const StreakStatus: React.FC<StreakStatusProps> = ({ data }) => {
    // Calcola quanti segmenti attivare (0-7 basato sui giorni nella settimana corrente)
    const daysInCurrentWeek = data.currentStreakDays % 7 || (data.currentStreakDays > 0 ? 7 : 0);

    return (
        <div className="container">
            <div className="streak-card card">
                <div className="streak-icon-container">
                    <div className="fire-icon">
                        <img src={fireIcon} alt="Fire" />
                    </div>
                </div>

                <div className="streak-content">
                    <h3>
                        {data.currentStreakDays > 0
                            ? `${data.currentStreakDays} ${data.currentStreakDays === 1 ? 'giorno' : 'giorni'} di streak!`
                            : 'Inizia la tua Streak!'}
                    </h3>
                    <div className="progress-bar-container">
                        {[1, 2, 3, 4, 5, 6, 7].map((step) => (
                            <div
                                key={step}
                                className={`progress-segment ${step <= daysInCurrentWeek ? 'active' : ''}`}
                            ></div>
                        ))}
                    </div>
                    <p className="level-text">
                        {data.streakLevel > 0
                            ? `Livello ${data.streakLevel} • Continua così!`
                            : 'Inserisci lo stato d\'animo ogni giorno'}
                    </p>
                </div>
            </div>
        </div>
    );
};

export default StreakStatus;
