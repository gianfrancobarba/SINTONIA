<div align="center">
  <img src="docs/brand/Logo_con_scritta.png" alt="SINTONIA Logo" width="400" />
  
  <h3>Sistema INtegrato per il Triage e l'Osservazione della salute mentale in CampaNIA</h3>
  
  <p align="center">
    <a href="#-il-team">Il Team</a> •
    <a href="#-visione-del-progetto">Visione</a> •
    <a href="#-il-problema-vs-la-soluzione">Problema vs Soluzione</a> •
    <a href="#-algoritmi-chiave">Algoritmi</a> •
    <a href="#-architettura-di-sistema">Architettura</a> •
    <a href="#-funzionalità-per-ruolo">Funzionalità</a> •
    <a href="#-documentazione">Documentazione</a> •
    <a href="#-roadmap-futura">Roadmap</a>
  </p>
</div>

---

## 👥 Il Team

SINTONIA è sviluppato con passione dal team **C09** dell'Università degli Studi di Salerno.



<br />

### Project Manager

*   <a href="https://github.com/gianfrancobarba"><img src="https://github.com/gianfrancobarba.png" width="25" style="border-radius: 50%; vertical-align: middle;" /> **Gianfranco Barba**</a>

*   <a href="https://github.com/FCorcione02"><img src="https://github.com/FCorcione02.png" width="25" style="border-radius: 50%; vertical-align: middle;" /> **Francesco Corcione**</a>

### Developers

*   <a href="https://github.com/gianlucaam"><img src="https://github.com/gianlucaam.png" width="25" style="border-radius: 50%; vertical-align: middle;" /> **Gianluca Ambrosio**</a>

*   <a href="https://github.com/elesshhhh"><img src="https://github.com/elesshhhh.png" width="25" style="border-radius: 50%; vertical-align: middle;" /> **Elena Carlomagno**</a>

*   <a href="https://github.com/rosx3"><img src="https://github.com/rosx3.png" width="25" style="border-radius: 50%; vertical-align: middle;" /> **Rosaria Cervino**</a>

*   <a href="https://github.com/KekkoCoppola"><img src="https://github.com/KekkoCoppola.png" width="25" style="border-radius: 50%; vertical-align: middle;" /> **Francesco Coppola**</a>

*   <a href="https://github.com/AntonioWalter"><img src="https://github.com/AntonioWalter.png" width="25" style="border-radius: 50%; vertical-align: middle;" /> **Antonio Walter De Fusco**</a>

*   <a href="https://github.com/Gav798"><img src="https://github.com/Gav798.png" width="25" style="border-radius: 50%; vertical-align: middle;" /> **Gavino De Stefano**</a>

*   <a href="https://github.com/aleds25"><img src="https://github.com/aleds25.png" width="25" style="border-radius: 50%; vertical-align: middle;" /> **Alessio Del Sorbo**</a>

*   <a href="https://github.com/franci1313"><img src="https://github.com/franci1313.png" width="25" style="border-radius: 50%; vertical-align: middle;" /> **Francesco Di Giovanni**</a>

*   <a href="https://github.com/mattFanz"><img src="https://github.com/mattFanz.png" width="25" style="border-radius: 50%; vertical-align: middle;" /> **Mattia Fanzini**</a>

*   <a href="https://github.com/af21-code"><img src="https://github.com/af21-code.png" width="25" style="border-radius: 50%; vertical-align: middle;" /> **Angelo Fusco**</a>

*   <a href="https://github.com/GiaPol"><img src="https://github.com/GiaPol.png" width="25" style="border-radius: 50%; vertical-align: middle;" /> **Gianni Policola**</a>

---

## 📖 Visione del Progetto

**SINTONIA** non è solo un gestionale, ma un **ecosistema proattivo** che trasforma il paradigma della salute mentale pubblica: da *reattiva* (aspetto che il paziente stia male) a *predittiva* (intervengo prima della crisi).

Il sistema integra **algoritmi di triage dinamico** e strumenti di **monitoraggio continuo** per garantire che nessun paziente si senta abbandonato durante l'attesa. L'obiettivo è azzerare il "buco nero" assistenziale tra la richiesta di aiuto e la prima visita, fornendo supporto immediato tramite tecnologia accessibile.

SINTONIA persegue quattro obiettivi strategici fondamentali:

1. **Ottimizzazione dell'Accesso e Tempestività delle Cure**: Processo di triage automatizzato che gestisce dinamicamente l'urgenza del paziente attraverso questionari self-report periodici standardizzati (PHQ-9, GAD-7, WHO-5, PC-PTSD-5), garantendo che i casi più critici ricevano attenzione prioritaria

2. **Riduzione del Rischio Clinico**: Identificazione proattiva dei pazienti più vulnerabili mediante alert clinici automatici che si attivano quando un questionario supera soglie critiche di rischio, consentendo un intervento immediato

3. **Miglioramento del Sostegno e Engagement**: Strumenti di coinvolgimento attivo (gamification, diario personale, forum anonimo, calendario) che mantengono il paziente partecipe del proprio percorso terapeutico durante l'attesa

4. **Potenziamento della Gestione delle Risorse Sanitarie**: Strumenti per il monitoraggio in tempo reale delle liste d'attesa, ottimizzando la gestione del carico di lavoro basata su dati clinici costantemente aggiornati

---

## 🆚 Il Problema vs La Soluzione

Ecco come SINTONIA cambia le regole del gioco rispetto al sistema tradizionale (ASL).

<table>
  <thead>
    <tr>
      <th width="45%" align="center">🚫 Situazione Attuale (ASL)</th>
      <th width="10%" align="center"></th>
      <th width="45%" align="center">✅ Innovazione SINTONIA</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td>
        <strong>Soggetta a Staticità</strong><br>
        Il paziente riceve una "etichetta" di priorità all'inizio che rimane invariata per mesi, ignorando peggioramenti.
      </td>
      <td align="center">➡️</td>
      <td>
        <strong>Triage Dinamico e Vivo</strong><br>
        La priorità si aggiorna <em>in tempo reale</em> ad ogni questionario. Se il paziente peggiora, scala la coda automaticamente.
      </td>
    </tr>
    <tr>
      <td>
        <strong>Vuoto Assistenziale</strong><br>
        Silenzio totale per mesi. Il paziente è solo con i suoi pensieri in attesa della chiamata.
      </td>
      <td align="center">➡️</td>
      <td>
        <strong>Supporto H24</strong><br>
        Strumenti di <em>self-help</em> (Diario, Monitoraggio Umore) e una Community anonima offrono supporto immediato fin dal primo giorno.
      </td>
    </tr>
    <tr>
      <td>
        <strong>Rischio Invisibile</strong><br>
        Questionari con punteggi critici passano inosservati nel "mucchio" cartaceo, senza meccanismi di allerta automatici.
      </td>
      <td align="center">➡️</td>
      <td>
        <strong>Alert Automatici</strong><br>
        Il sistema genera alert clinici quando un questionario supera soglie di rischio critiche, notificando istantaneamente lo psicologo per un intervento immediato.
      </td>
    </tr>
  </tbody>
</table>

---

## 🔬 Algoritmi Chiave

La logica "intelligente" di SINTONIA risiede nei suoi algoritmi clinici avanzati.

### Calcolo Score Paziente (Exponential Decay)

Il sistema utilizza un modello matematico a **decadimento esponenziale** per calcolare il rischio clinico. Questo garantisce che gli eventi recenti abbiano più peso, senza però "dimenticare" la storia clinica del paziente (peso minimo garantito 20%).

La formula utilizzata per il calcolo del peso temporale $w(t)$ è:

$$ w(t) = \max(e^{-\lambda \cdot t}, 0.20) $$

Dove:
*   $t$ è il numero di giorni trascorsi dalla compilazione.
*   $\lambda$ è il coefficiente di decadimento, calcolato dinamicamente per ogni tipo di questionario in base alla sua frequenza clinica (es. PHQ-9 ogni 14gg).

### Coda Prioritaria Dinamica

L'assegnazione è basata su **Finestre Temporali di Intervento**:

| Fascia Priorità | Score Rischio | Target Intervento |
|:---|:---:|:---:|
| 🔴 **Urgente** | 80 - 100 | **3 giorni** |
| 🟠 **Breve** | 60 - 79 | **10 giorni** |
| 🟡 **Differibile** | 40 - 59 | **30 giorni** |
| 🟢 **Programmabile** | 0 - 39 | **120 giorni** |

---

## 🏗 Architettura di Sistema

SINTONIA è costruito su un'architettura **Three-Tier** robusta e scalabile.

### ⚡ Tech Stack

<div align="center">

| Area | Tecnologie | Dettagli |
|:---:|:--- |:---|
| **Frontend** | ![React](https://img.shields.io/badge/React_19-20232A?style=flat&logo=react&logoColor=61DAFB) ![TypeScript](https://img.shields.io/badge/TypeScript-007ACC?style=flat&logo=typescript&logoColor=white) ![Vite](https://img.shields.io/badge/Vite-646CFF?style=flat&logo=vite&logoColor=white) | SPA moderna reattiva (Web + Mobile PWA). |
| **Backend** | ![NestJS](https://img.shields.io/badge/NestJS_11-E0234E?style=flat&logo=nestjs&logoColor=white) ![Node.js](https://img.shields.io/badge/Node.js-43853D?style=flat&logo=node.js&logoColor=white) | Framework server-side scalabile e modulare. |
| **Data** | ![PostgreSQL](https://img.shields.io/badge/PostgreSQL-316192?style=flat&logo=postgresql&logoColor=white) ![Drizzle ORM](https://img.shields.io/badge/Drizzle_ORM-C5F74F?style=flat&logo=drizzle&logoColor=black) | DBMS relazionale e ORM type-safe. |
| **Infra** | ![Docker](https://img.shields.io/badge/Docker-2496ED?style=flat&logo=docker&logoColor=white) ![NPM](https://img.shields.io/badge/NPM_Workspaces-CB3837?style=flat&logo=npm&logoColor=white) | Orchestrazione containerizzata e Monorepo. |

</div>


---

## ✨ Funzionalità per Ruolo

### 👤 Per i Pazienti (App Mobile / PWA)

*   **Questionari Clinici**: Compilazione di questionari standardizzati periodici (PHQ-9, GAD-7, WHO-5, PC-PTSD-5) per il monitoraggio continuo dello stato psicologico. Visualizzazione dello storico dei questionari compilati con data di compilazione
*   **Diario Personale**: Creazione, modifica ed eliminazione di pagine di diario per registrare pensieri e riflessioni personali
*   **Stati d'Animo**: Registrazione quotidiana dell'umore, dell'intensità percepita e di note opzionali, con visualizzazione dell'andamento storico degli ultimi 7 giorni
*   **Forum Anonimo**: Creazione, modifica ed eliminazione di domande nel forum organizzato per categorie tematiche, con possibilità di ricevere risposte da psicologi
*   **Badge**: Sistema di gamification con badge ottenibili per traguardi specifici (es. primo questionario, diario costante, streak di stati d'animo)
*   **Home Dashboard**: Vista principale con streak di giorni consecutivi di compilazione stati d'animo, calendario degli eventi e post suggeriti dal forum
*   **Notifiche**: Centro notifiche per rimanere aggiornati su eventi rilevanti della piattaforma
*   **Supporto Tecnico**: Richiesta di supporto tecnico per assistenza

---

### 🧑‍⚕️ Per gli Psicologi (Web Dashboard)

*   **Dashboard**: Vista centralizzata con contatori di alert clinici, questionari da revisionare e messaggi forum non letti
*   **Gestione Pazienti**: Visualizzazione, ricerca e gestione dei pazienti assegnati, con possibilità di terminare la cura e liberare lo slot per nuovi pazienti
*   **Questionari**: Visualizzazione e revisione dei questionari compilati dai pazienti, con possibilità di aggiungere note cliniche e richiedere l'invalidazione di questionari errati
*   **Alert Clinici**: Visualizzazione degli alert generati automaticamente quando un questionario supera soglie critiche di rischio, con possibilità di accettare l'alert per intervento immediato
*   **Generazione Report**: Creazione di report clinici supportati da Intelligenza Artificiale che analizzano tutti i dati del paziente (questionari, diario, stati d'animo, forum) per fornire un riepilogo completo del percorso
*   **Forum**: Possibilità di rispondere pubblicamente alle domande dei pazienti nel forum
*   **Notifiche**: Centro notifiche per alert clinici e aggiornamenti del sistema

---

### 👨‍💼 Per gli Amministratori (Web Admin)

*   **Dashboard**: Panoramica amministrativa con informazioni personali dell'amministratore
*   **Gestione Pazienti**: Visualizzazione, ricerca, modifica dati, modifica priorità manuale, modifica assegnazione psicologo e rimozione pazienti
*   **Gestione Psicologi**: Creazione, modifica, eliminazione e ricerca di account psicologo nel sistema
*   **Questionari**: Visualizzazione dei questionari e annullamento dello stato di revisione in caso di errori procedurali
*   **Invalidazioni**: Gestione delle richieste di invalidazione questionario inoltrate dagli psicologi, con possibilità di accettare o rifiutare le richieste
*   **Visualizzazione Forum**: Consultazione di tutte le domande e risposte pubblicate nel forum
*   **Notifiche**: Centro notifiche per aggiornamenti e richieste di invalidazione
*   **Supporto Tecnico**: Gestione delle richieste di supporto tecnico

---

## 📂 Documentazione

> [!NOTE]
> La documentazione completa del progetto, incluse le guide utente e i manuali di installazione, è attualmente in fase di revisione e sarà disponibile a breve.

---

## 🗺️ Roadmap Futura

- [ ] **App Mobile Nativa**: Migrazione a React Native.
- [ ] **Suddivisione Territoriale**: Gestione code multiple per ASL.
- [ ] **Telemedicina**: Videochiamate in-app criptate.

---

<p align="center">
  <img src="https://img.shields.io/badge/Status-Active-success?style=for-the-badge" alt="Status" />
  <a href="./LICENSE"><img src="https://img.shields.io/badge/License-GPLv3-blue?style=for-the-badge" alt="License" /></a>
  <img src="https://img.shields.io/badge/Version-1.0.0-blueviolet?style=for-the-badge" alt="Version" />
</p>

<p align="center">
  Copyright © 2025 SINTONIA. All rights reserved.
</p>