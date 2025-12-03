import React from 'react';
import type { HomeDashboardDto } from '../types/home';
import '../css/StreakStatus.css';
import fireIcon from '../assets/icons/fire-department.svg';

interface StreakStatusProps {
    data: HomeDashboardDto;
}

const StreakStatus: React.FC<StreakStatusProps> = ({ data }) => {
    return (
        <div className="container">
            <div className="streak-card card">
                <div className="streak-icon-container">
                    <div className="fire-icon">
                        <img src={fireIcon} alt="Fire" />
                    </div>
                </div>

                <div className="streak-content">
                    <h3>Completa la Streak!</h3>
                    <div className="progress-bar-container">
                        {[1, 2, 3, 4, 5].map((step) => (
                            <div
                                key={step}
                                className={`progress-segment ${step <= data.streakLevel ? 'active' : ''}`}
                            ></div>
                        ))}
                    </div>
                    <p className="level-text">Livello {data.streakLevel}</p>
                </div>
            </div>


        </div>
    );
};

export default StreakStatus;
