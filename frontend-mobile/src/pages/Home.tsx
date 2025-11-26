import React, { useEffect, useState } from 'react';
import Header from '../components/Header';
import QuickNote from '../components/QuickNote';
import StreakStatus from '../components/StreakStatus';
import Calendar from '../components/Calendar';
import SuggestedPosts from '../components/SuggestedPosts';
import BottomNavigation from '../components/BottomNavigation';
import { getHomeDashboard } from '../services/home.service';
import type { HomeDashboardDto } from '../types/home';
import '../css/Home.css';

const Home: React.FC = () => {
    const [data, setData] = useState<HomeDashboardDto | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const dashboardData = await getHomeDashboard();
                setData(dashboardData);
            } catch (error) {
                console.error('Error fetching home data:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, []);

    if (loading) {
        return <div className="loading-screen">Caricamento...</div>;
    }

    if (!data) {
        return <div className="error-screen">Errore nel caricamento dei dati.</div>;
    }

    return (
        <div className="home-page">
            <Header data={data} />
            <QuickNote />
            <StreakStatus data={data} />
            <Calendar days={data.calendarDays} />
            <SuggestedPosts posts={data.suggestedPosts} />
            <BottomNavigation />
        </div>
    );
};

export default Home;
