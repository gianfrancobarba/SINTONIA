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

                <h1 className="terms-title">Termini & Condizioni</h1>

                <div className="terms-content">
                    <h3>Consenso informato (CNOP)</h3>
                    <p>
                        Prima di procedere con l'assessment, l'utente deve leggere e accettare il consenso informato. Alcuni punti essenziali:
                    </p>
                    <ul>
                        <li>Lo strumento serve solo a screening, non è una diagnosi.</li>
                        <li>Le informazioni raccolte saranno utilizzate per generare una raccomandazione e gestire eventuali emergenze.</li>
                    </ul>

                    <h3>Consenso informato</h3>
                    <p>
                        L'istituto del consenso informato viene qualificato dalla dottrina come idoneo alla tutela dei principi costituzionali espressi nell'articolo 2, che promuove i diritti fondamentali della persona, e negli articoli 13 e 32, i quali stabiliscono che la libertà personale è inviolabile e che nessuno possa essere obbligato a un determinato trattamento sanitario se non per disposizione di legge.
                    </p>
                    <p>
                        L'art. 1 della L. 22 dicembre 2017 n. 219 disciplina in maniera organica la materia del consenso informato, dapprima lasciata ad interventi, anche autorevoli, ma slegati tra loro, della Giurisprudenza nazionale e comunitaria.
                    </p>
                    <p>
                        La norma stabilisce che: "nessun trattamento sanitario può essere iniziato o proseguito se privo del consenso libero e informato della persona interessata, tranne che nei casi espressamente previsti dalla legge".
                    </p>
                    <p>
                        Sebbene la norma esordisca parlando di trattamento sanitario e, pertanto, ricomprendendovi tutte le attività dei vari professionisti che operano in ambito sanitario, prosegue poi focalizzandosi prevalentemente sul rapporto medico-paziente.
                    </p>
                    <p>
                        Tuttavia i principi in essa rinvenibili sono validi per tutte le professioni sanitarie ed essi devono essere letti congiuntamente alle norme in materia già previste nel Codice deontologico degli Psicologi Italiani, in particolare agli artt. 9, 24 e 31.
                    </p>
                    <p>
                        L'informativa sulla quale ricevere il successivo consenso deve essere comprensibile secondo il livello culturale del paziente ed avere ad oggetto:
                    </p>
                    <ul>
                        <li>la diagnosi;</li>
                        <li>la prognosi;</li>
                        <li>i benefici e i rischi degli accertamenti (strumenti diagnostici) e dei trattamenti sanitari che si intendono perseguire;</li>
                        <li>le possibili alternative;</li>
                        <li>le conseguenze dell'eventuale rifiuto del trattamento o della rinuncia agli accertamenti.</li>
                    </ul>
                    <p>
                        Il consenso sulla predetta informativa viene acquisito nei modi e con gli strumenti più consoni alle condizioni del paziente e del setting, è documentato in forma scritta o attraverso videoregistrazioni o, per la persona con disabilità, attraverso dispositivi che le consentano di comunicare.
                    </p>
                    <p>
                        Il consenso informato, in qualunque forma espresso, è inserito nel fascicolo del paziente, nella cartella clinica e nel fascicolo sanitario elettronico, laddove necessario.
                    </p>
                </div>

                <div className="terms-footer">
                    <div className="toggle-container">
                        <span className="toggle-label">
                            Ho preso visione dei termini e condizioni
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
                        {loading ? 'Attendere...' : 'Accetta'}
                    </button>
                </div>
            </div>
        </div>
    );
};

export default Terms;
