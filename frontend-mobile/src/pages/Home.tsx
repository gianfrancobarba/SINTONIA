import React, { useEffect, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import Header from '../components/Header';
import QuickNote from '../components/QuickNote';
import StreakStatus from '../components/StreakStatus';
import Calendar from '../components/Calendar';
import SuggestedPosts from '../components/SuggestedPosts';
import InitialQuestionnairesModal from '../components/InitialQuestionnairesModal';
import { getHomeDashboard } from '../services/home.service';
import { checkInitialQuestionnaires } from '../services/questionari.service';
import type { HomeDashboardDto } from '../types/home';
import '../css/Home.css';
import LoadingSpinner from '../components/LoadingSpinner';
import Toast from '../components/Toast';
import { useCache } from '../contexts/CacheContext';

const Home: React.FC = () => {
    const { homeData, setHomeData } = useCache();
    // Loading is true only if we don't have cached data yet
    const [loading, setLoading] = useState(!homeData);
    const [showInitialModal, setShowInitialModal] = useState(false);
    const [pendingQuestionnaires, setPendingQuestionnaires] = useState<string[]>([]);
    const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' } | null>(null);

    const location = useLocation();

    // Handle Toast from navigation state
    useEffect(() => {
        const state = location.state as { toastMessage?: string; toastType?: 'success' | 'error' } | null;
        if (state?.toastMessage) {
            setToast({
                message: state.toastMessage,
                type: state.toastType || 'success'
            });
            // Clear state
            window.history.replaceState({}, document.title);
        }
    }, [location]);

    useEffect(() => {
        const fetchData = async () => {
            try {
                // If we don't have data, show loading. If we do, we just refresh in background.
                if (!homeData) setLoading(true);

                const dashboardData = await getHomeDashboard();
                setHomeData(dashboardData);

                // Check if initial questionnaires are completed
                // Only show modal once per session (after login)
                const hasCheckedThisSession = sessionStorage.getItem('initialQuestionnairesChecked');

                if (!hasCheckedThisSession) {
                    const result = await checkInitialQuestionnaires();
                    if (!result.hasCompleted && result.pendingQuestionnaires.length > 0) {
                        setPendingQuestionnaires(result.pendingQuestionnaires);
                        setShowInitialModal(true);
                    }
                    // Mark as checked for this session
                    sessionStorage.setItem('initialQuestionnairesChecked', 'true');
                }
            } catch (error) {
                console.error('Error fetching home data:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, []);

    if (loading) {
        return (
            <div className="loading-screen">
                <LoadingSpinner />
            </div>
        );
    }

    if (!homeData && !loading) {
        return <div className="error-screen">Errore nel caricamento dei dati.</div>;
    }

    if (!homeData) return null; // Should be covered by loading spinner, but for safety

    return (
        <div className="home-page">
            <Header data={homeData} />
            <QuickNote />
            <StreakStatus data={homeData} />
            <Calendar days={homeData.calendarDays} />
            <SuggestedPosts posts={homeData.suggestedPosts} />
            <InitialQuestionnairesModal
                isOpen={showInitialModal}
                onClose={() => setShowInitialModal(false)}
                pendingQuestionnaires={pendingQuestionnaires}
            />
            {toast && (
                <Toast
                    message={toast.message}
                    type={toast.type}
                    onClose={() => setToast(null)}
                />
            )}
        </div>
    );
};

export default Home;

