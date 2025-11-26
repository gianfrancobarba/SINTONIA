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
                    <h3>Consenso informato e trattamento dei dati (CNOP)</h3>
                    <p>
                        Prima di procedere con l’assessment, l’utente deve leggere e accettare il consenso informato. Alcuni punti essenziali:
                    </p>
                    <ul>
                        <li>Lo strumento serve solo a screening, non è una diagnosi.</li>
                        <li>I dati raccolti saranno utilizzati per generare una raccomandazione e gestire eventuali emergenze.</li>
                        <li>Tutti i dati sono trattati secondo le leggi italiane e europee sulla privacy (GDPR).</li>
                    </ul>

                    <h3>Consenso informato (sito dell’ordine degli psicologi)</h3>
                    <p>
                        L’istituto del consenso informato viene qualificato dalla dottrina come idoneo alla tutela dei principi costituzionali espressi nell’articolo 2, che promuove i diritti fondamentali della persona, e negli articoli 13 e 32, i quali stabiliscono che la libertà personale è inviolabile e che nessuno possa essere obbligato a un determinato trattamento sanitario se non per disposizione di legge.
                    </p>
                    <p>
                        L’art. 1 della L. 22 dicembre 2017 n. 219 disciplina in maniera organica la materia del consenso informato, dapprima lasciata ad interventi, anche autorevoli, ma slegati tra loro, della Giurisprudenza nazionale e comunitaria.
                    </p>
                    <p>
                        La norma stabilisce che: “nessun trattamento sanitario può essere iniziato o proseguito se privo del consenso libero e informato della persona interessata, tranne che nei casi espressamente previsti dalla legge”.
                    </p>
                    <p>
                        Sebbene la norma esordisca parlando di trattamento sanitario e, pertanto, ricomprendendovi tutte le attività dei vari professionisti che operano in ambito sanitario, prosegue poi focalizzandosi prevalentemente sul rapporto medico-paziente.
                    </p>
                    <p>
                        Tuttavia i principi in essa rinvenibili sono validi per tutte le professioni sanitarie ed essi devono essere letti congiuntamente alle norme in materia già previste nel Codice deontologico degli Psicologi Italiani, in particolare agli artt. 9, 24 e 31.
                    </p>
                    <p>
                        L’informativa sulla quale ricevere il successivo consenso deve essere comprensibile secondo il livello culturale del paziente ed avere ad oggetto:
                    </p>
                    <ul>
                        <li>la diagnosi;</li>
                        <li>la prognosi;</li>
                        <li>i benefici e i rischi degli accertamenti (strumenti diagnostici) e dei trattamenti sanitari che si intendono perseguire;</li>
                        <li>le possibili alternative;</li>
                        <li>le conseguenze dell’eventuale rifiuto del trattamento o della rinuncia agli accertamenti.</li>
                    </ul>
                    <p>
                        Il consenso sulla predetta informativa viene acquisito nei modi e con gli strumenti più consoni alle condizioni del paziente e del setting, è documentato in forma scritta o attraverso videoregistrazioni o, per la persona con disabilità, attraverso dispositivi che le consentano di comunicare.
                    </p>
                    <p>
                        Il consenso informato, in qualunque forma espresso, è inserito nel fascicolo del paziente, nella cartella clinica e nel fascicolo sanitario elettronico, laddove necessario.
                    </p>

                    <h3>Consenso al trattamento dei dati</h3>
                    <p>
                        Il tipo di consenso richiesto in questo caso attiene alla tutela del diritto alla riservatezza delle informazioni acquisite dal professionista durante il trattamento sanitario e inerente lo stato di salute del paziente — una tutela particolarmente necessaria nel caso di dati sensibili come quelli sanitari.
                    </p>
                    <p>
                        La normativa di riferimento è il D.Lgs. 30 giugno 2003, n. 196, come modificato dal d.lgs. 10 agosto 2018, n. 101, emanato per l’adeguamento della normativa interna al Regolamento (UE) 2016/679 (GDPR).
                    </p>
                    <p>
                        La normativa dispone il divieto per chiunque di trattare le “categorie particolari di dati”, tra cui rientrano quelli sulla salute. Tuttavia sono ammesse delle deroghe, sulla base delle quali è ammesso il trattamento di tali dati.
                    </p>
                    <p>
                        Tali deroghe sono contenute nell’art. 9 del Regolamento che elenca una serie di eccezioni che rendono lecito il trattamento e che, in ambito sanitario, sono riconducibili, in via generale, ai trattamenti necessari per:
                    </p>
                    <p>
                        c. finalità di medicina preventiva, diagnosi, assistenza o terapia sanitaria o sociale ovvero gestione dei sistemi e servizi sanitari o sociali (di seguito “finalità di cura”) sulla base del diritto dell’Unione/Stati membri o conformemente al contratto con un professionista della sanità (art. 9, par. 2, lett. h) e par. 3 del Regolamento e considerando n. 53; art. 75 del Codice d.lgs 196/2003) effettuati da (o sotto la responsabilità di) un professionista sanitario soggetto al segreto professionale o da altra persona anch’essa soggetta all’obbligo di segretezza.
                    </p>
                    <p>
                        Al riguardo, il Garante per la protezione dei dati personali, con provvedimento n. 55 del 7 marzo 2019, precisa che i trattamenti per “finalità di cura”, sulla base dell’art. 9, par. 2, lett. h) e par. 3 del Regolamento, sono propriamente quelli effettuati da (o sotto la responsabilità di) un professionista sanitario soggetto al segreto professionale o da altra persona anch’essa soggetta all’obbligo di segretezza.
                    </p>
                    <p>
                        Diversamente dal passato, quindi, il professionista sanitario non deve più richiedere il consenso del paziente per i trattamenti necessari alla prestazione sanitaria richiesta, indipendentemente dal contesto (libero professionista o struttura sanitaria pubblica/privata).
                    </p>
                    <p>
                        L'esenzione dalla richiesta del consenso è limitata ai dati strettamente necessari al trattamento sanitario al quale il paziente volontariamente si sottopone. Per qualsiasi altra finalità, rimane fermo il divieto di trattamento in mancanza di un espresso consenso.
                    </p>
                    <p>
                        Ciò che rileva ai fini dell'esenzione è il contratto professionale tra professionista e paziente finalizzato ad un determinato trattamento.
                    </p>
                    <p>
                        La normativa primaria e regolamentare adottata in questo periodo emergenziale non innova la normativa vigente, ma applica una deroga già prevista, secondo cui il trattamento dei dati sanitari è lecito e non necessita di previo consenso qualora ricorrano motivi di interesse pubblico nel settore della sanità pubblica (art. 9, par. 2, lett. i) GDPR).
                    </p>
                </div>

                <div className="terms-footer">
                    <div className="toggle-container">
                        <label htmlFor="terms-toggle" className="toggle-label">
                            Ho preso visione dei termini e condizioni
                        </label>
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
