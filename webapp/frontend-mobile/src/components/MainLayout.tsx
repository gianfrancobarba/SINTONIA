import React from 'react';
import { Outlet } from 'react-router-dom';
import BottomNavigation from './BottomNavigation';

const MainLayout: React.FC = () => {
    return (
        <div className="main-layout">
            <div className="content-wrapper" style={{ paddingBottom: '85px' }}>
                <Outlet />
            </div>
            <BottomNavigation />
        </div>
    );
};

export default MainLayout;
