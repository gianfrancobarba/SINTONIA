import React from 'react';
import '../css/BottomNavigation.css';
import bottomBarSvg from '../assets/images/BottomBar.svg';

const BottomNavigation: React.FC = () => {
    return (
        <div className="bottom-nav-container" role="navigation" aria-label="Bottom navigation">
            <div className="bottom-nav-background">
                <img src={bottomBarSvg} alt="" aria-hidden="true" className="nav-curve-img" />
            </div>

            {/* Positioned hit areas over the SVG icons */}
            <div className="nav-hit-areas">
                <button className="hit-btn hit-leftmost" aria-label="Community" />
                <button className="hit-btn hit-left" aria-label="Notes" />
                <button className="hit-btn hit-center" aria-label="Home" />
                <button className="hit-btn hit-right" aria-label="Notifications" />
                <button className="hit-btn hit-rightmost" aria-label="Profile" />
            </div>


        </div>
    );
};

export default BottomNavigation;
