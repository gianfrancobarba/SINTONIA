import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { updateLocalTerms } from '../services/spid-auth.service';
import '../css/Terms.css';

const Terms = () => {
    const [accepted, setAccepted] = useState(false);
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    const handleAccept = async () => {
        setLoading(true);
        try {
            const token = localStorage.getItem('patient_token');
            const response = await axios.post('http://localhost:3000/patient/terms', {}, {
                headers: { Authorization: `Bearer ${token}` }
            });

            if (response.data && response.data.access_token) {
                localStorage.setItem('patient_token', response.data.access_token);
            }

            updateLocalTerms(true);
            navigate('/home');
        } catch (error) {
            console.error('Error accepting terms:', error);
            alert('Si è verificato un errore. Riprova.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="terms-page-background">
            <div className="terms-card">
                <div className="logo-container">
                    <img src="/sintonia-logo-new.jpg" alt="Sintonia Logo" className="logo" />
                </div>

                <h1 className="terms-title">Termini e Condizioni di Utilizzo</h1>

                <div className="terms-content">
                    <h3>Art. 1 - Oggetto del Servizio</h3>
                    <p>
                        SINTONIA costituisce l'applicazione ufficiale per l'accesso al servizio di supporto
                        psicologico gratuito erogato dalla Regione Campania. Il servizio comprende strumenti
                        di screening psicologico e monitoraggio dello stato emotivo.
                    </p>
                    <p>
                        Il presente strumento ha esclusiva finalità di screening e monitoraggio. Esso non
                        sostituisce in alcun modo la diagnosi clinica né il percorso terapeutico con un
                        professionista della salute mentale.
                    </p>

                    <h3>Art. 2 - Finalità dello Screening e Criteri di Priorità</h3>
                    <p>
                        I questionari validati (PHQ-9, GAD-7 e altri strumenti clinici) sono somministrati
                        al fine di:
                    </p>
                    <ul>
                        <li>Valutare il livello di bisogno psicologico dell'utente;</li>
                        <li>Determinare la priorità di accesso al servizio di supporto psicologico;</li>
                        <li>Identificare situazioni di urgenza clinica;</li>
                    </ul>
                    <p>
                        La priorità nella lista d'attesa è assegnata sulla base dei risultati dello screening.
                        Tali esiti non costituiscono diagnosi medica o psicologica e sono
                        utilizzati esclusivamente ai fini della gestione delle priorità di accesso.
                    </p>

                    <h3>Art. 3 - Consenso Informato</h3>
                    <p>
                        Ai sensi della Legge 22 dicembre 2017, n. 219, e del Codice Deontologico degli
                        Psicologi Italiani (artt. 9, 24, 31), l'utilizzo del presente servizio è subordinato
                        al consenso libero e informato dell'utente.
                    </p>
                    <p>
                        Con l'accettazione dei presenti Termini, l'utente dichiara:
                    </p>
                    <ul>
                        <li>Di aver compreso natura e limiti del servizio;</li>
                        <li>Di essere consapevole che il servizio non ha finalità diagnostiche;</li>
                        <li>Di aderire volontariamente all'utilizzo dell'applicazione.</li>
                    </ul>

                    <h3>Art. 4 - Gestione delle Situazioni di Emergenza</h3>
                    <p>
                        Qualora le risposte fornite dall'utente evidenzino una situazione di potenziale
                        rischio, il sistema provvederà a generare una segnalazione verso un professionista
                        sanitario per la valutazione del caso.
                    </p>
                    <p>
                        In caso di emergenza, contattare il Numero Unico Emergenze 112 o recarsi presso
                        il Pronto Soccorso più vicino.
                    </p>

                    <h3>Art. 5 - Esclusione di Responsabilità</h3>
                    <p>
                        Il gestore del servizio declina ogni responsabilità per:
                    </p>
                    <ul>
                        <li>Decisioni assunte dall'utente sulla base dei risultati dello screening;</li>
                        <li>Ritardi nella presa in carico da parte dei professionisti sanitari;</li>
                        <li>Errate interpretazioni dei risultati da parte dell'utente.</li>
                    </ul>

                    <h3>Art. 6 - Requisiti di Accesso</h3>
                    <p>
                        L'accesso al servizio SINTONIA è subordinato ai seguenti requisiti:
                    </p>
                    <ul>
                        <li>Possesso di credenziali SPID valide;</li>
                        <li>Accettazione dei presenti Termini e Condizioni.</li>
                    </ul>

                    <h3>Art. 7 - Modifiche delle Condizioni</h3>
                    <p>
                        Il gestore si riserva la facoltà di modificare i presenti Termini e Condizioni.
                        In caso di modifiche sostanziali, l'utente sarà informato al successivo accesso
                        e sarà tenuto ad accettare nuovamente le condizioni aggiornate.
                    </p>
                </div>

                <div className="terms-footer">
                    <div className="toggle-container">
                        <span className="toggle-label">
                            Dichiaro di aver letto e di accettare i Termini e Condizioni
                        </span>
                        <label className="switch">
                            <input
                                type="checkbox"
                                id="terms-toggle"
                                checked={accepted}
                                onChange={(e) => setAccepted(e.target.checked)}
                            />
                            <span className="slider round"></span>
                        </label>
                    </div>

                    <button
                        className="accept-button"
                        disabled={!accepted || loading}
                        onClick={handleAccept}
                    >
                        {loading ? 'Attendere...' : 'Accetta e Prosegui'}
                    </button>
                </div>
            </div>
        </div>
    );
};

export default Terms;
