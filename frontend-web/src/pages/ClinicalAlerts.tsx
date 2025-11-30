import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import PsychologistProfile from '../components/PsychologistProfile';
import ClinicalAlertsTable from '../components/ClinicalAlertsTable';
import { fetchClinicalAlerts, acceptClinicalAlert } from '../services/alert-clinici.service';
import type { ClinicalAlert, LoadingState } from '../types/alert';
import '../css/ClinicalAlerts.css';

const ClinicalAlerts: React.FC = () => {
    const navigate = useNavigate();
    const [alertsState, setAlertsState] = useState<LoadingState<ClinicalAlert[]>>({
        data: null,
        loading: true,
        error: null,
    });
    const [confirmingAlertId, setConfirmingAlertId] = useState<string | null>(null);

    useEffect(() => {
        loadAlerts();
    }, []);

    const loadAlerts = async () => {
        setAlertsState({ data: null, loading: true, error: null });
        try {
            const data = await fetchClinicalAlerts();
            setAlertsState({ data, loading: false, error: null });
        } catch (error) {
            setAlertsState({
                data: null,
                loading: false,
                error: error instanceof Error ? error.message : 'Errore nel caricamento degli alert',
            });
        }
    };

    const handleAcceptClick = (id: string) => {
        setConfirmingAlertId(id);
    };

    const handleConfirmAccept = async () => {
        if (!confirmingAlertId) return;

        try {
            await acceptClinicalAlert(confirmingAlertId);

            // Remove the accepted alert from the list
            setAlertsState(prev => ({
                ...prev,
                data: prev.data?.filter(alert => alert.idAlert !== confirmingAlertId) || null,
            }));

            setConfirmingAlertId(null);
        } catch (error) {
            console.error('Error accepting alert:', error);
            alert('Errore durante l\'accettazione dell\'alert');
        }
    };

    const handleCancelAccept = () => {
        setConfirmingAlertId(null);
    };

    const handleSectionSelect = (section: string) => {
        if (section === 'pazienti') {
            navigate('/dashboard', { state: { selectedSection: 'pazienti' } });
        } else if (section === 'questionari') {
            navigate('/questionnaires');
        } else if (section === 'forum') {
            navigate('/forum');
        } else if (section === 'area-personale') {
            navigate('/dashboard', { state: { selectedSection: 'area-personale' } });
        } else if (section !== 'alert') {
            navigate('/dashboard');
        }
    };

    return (
        <div className="clinical-alerts-container">
            <div className="management-grid">
                <div className="management-sidebar">
                    <PsychologistProfile
                        onSelectSection={handleSectionSelect}
                        activeSection="alert"
                    />
                </div>
                <div className="management-content">
                    <div className="content-panel fade-in">
                        <h2 className="panel-title">Alert Clinici</h2>

                        {alertsState.error && (
                            <div className="error-state">
                                <p>Errore: {alertsState.error}</p>
                                <button onClick={loadAlerts} className="retry-btn">
                                    Riprova
                                </button>
                            </div>
                        )}

                        {alertsState.loading && (
                            <div className="loading-state">
                                Caricamento alert clinici...
                            </div>
                        )}

                        {alertsState.data && !alertsState.loading && (
                            <>
                                <div className="alerts-header">
                                    <p className="alerts-count">
                                        {alertsState.data.length === 0
                                            ? 'Nessun alert da gestire'
                                            : `${alertsState.data.length} alert ${alertsState.data.length === 1 ? 'non accettato' : 'non accettati'}`
                                        }
                                    </p>
                                </div>

                                {/* Confirmation Message */}
                                {confirmingAlertId && (
                                    <div className="confirmation-banner">
                                        <div className="confirmation-content">
                                            <p className="confirmation-text">
                                                Sei sicuro di voler accettare questo alert clinico?
                                            </p>
                                            <p className="confirmation-id">
                                                <strong>ID Alert:</strong> {confirmingAlertId}
                                            </p>
                                            <p className="confirmation-warning">
                                                Una volta accettato, l'alert verrà preso in carico e rimosso dalla lista.
                                            </p>
                                        </div>
                                        <div className="confirmation-actions">
                                            <button className="cancel-btn" onClick={handleCancelAccept}>
                                                Annulla
                                            </button>
                                            <button className="confirm-btn" onClick={handleConfirmAccept}>
                                                Conferma
                                            </button>
                                        </div>
                                    </div>
                                )}

                                <ClinicalAlertsTable
                                    alerts={alertsState.data}
                                    onAccept={handleAcceptClick}
                                />
                            </>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ClinicalAlerts;
