import React from 'react';
import { useNavigate } from 'react-router-dom';
import '../css/BottomNavigation.css';
import bottomBarSvg from '../assets/images/BottomBar.svg';

const BottomNavigation: React.FC = () => {
    const navigate = useNavigate();

    return (
        <div className="bottom-nav-container" role="navigation" aria-label="Bottom navigation">
            <div className="bottom-nav-background">
                <img src={bottomBarSvg} alt="" aria-hidden="true" className="nav-curve-img" />
            </div>

            {/* Positioned buttons with explicit icons */}
            <div className="nav-hit-areas">
                <button className="hit-btn hit-leftmost" aria-label="Community">
                </button>
                <button className="hit-btn hit-left" aria-label="Notes">
                </button>
                <button className="hit-btn hit-center" aria-label="Home" onClick={() => navigate('/home')}>
                </button>
                <button className="hit-btn hit-right" aria-label="Notifications">
                </button>
                <button className="hit-btn hit-rightmost" aria-label="Profile" onClick={() => navigate('/profile')}>
                </button>
            </div>


        </div>
    );
};

export default BottomNavigation;
