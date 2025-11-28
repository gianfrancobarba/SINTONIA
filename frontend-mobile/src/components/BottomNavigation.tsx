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

            {/* Positioned hit areas over the SVG icons */}
            <div className="nav-hit-areas">
                <button className="hit-btn hit-leftmost" aria-label="Community" />
                <button className="hit-btn hit-left" aria-label="Notes" />
                <button className="hit-btn hit-center" aria-label="Home" onClick={() => navigate('/home')} />
                <button className="hit-btn hit-right" aria-label="Notifications" />
                <button className="hit-btn hit-rightmost" aria-label="Profile" onClick={() => navigate('/profile')} />
            </div>


        </div>
    );
};

export default BottomNavigation;
