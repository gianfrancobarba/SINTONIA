import {
    pgTable,
    uuid,
    varchar,
    text,
    boolean,
    timestamp,
    doublePrecision,
    integer,
    char,
    jsonb,
    pgEnum,
    primaryKey,
    date,
} from 'drizzle-orm/pg-core';

// Enums
export const nomePrioritaEnum = pgEnum('nome_priorita', [
    'Urgente',
    'Breve',
    'Differibile',
    'Programmabile',
]);

export const tipoSessoEnum = pgEnum('tipo_sesso', ['M', 'F', 'Altro']);

export const statoTicketEnum = pgEnum('stato_ticket', [
    'Aperto',
    'Chiuso',
    'In elaborazione',
]);

// Tables

export const priorita = pgTable('priorita', {
    nome: nomePrioritaEnum('nome').primaryKey(),
    punteggioInizio: doublePrecision('punteggio_inizio').notNull(),
    punteggioFine: doublePrecision('punteggio_fine').notNull(),
    finestraTemporale: integer('finestra_temporale').notNull(),
});

export const psicologo = pgTable('psicologo', {
    codFiscale: char('cod_fiscale', { length: 16 }).primaryKey(),
    nome: varchar('nome', { length: 64 }).notNull(),
    cognome: varchar('cognome', { length: 64 }).notNull(),
    aslAppartenenza: char('asl_appartenenza', { length: 6 }).notNull(),
    stato: boolean('stato').default(true).notNull(),
    immagineProfilo: varchar('immagine_profilo', { length: 256 }).notNull()
});

export const amministratore = pgTable('amministratore', {
    email: varchar('email', { length: 64 }).primaryKey(),
    nome: varchar('nome', { length: 64 }).notNull(),
    cognome: varchar('cognome', { length: 64 }).notNull(),
    pw: varchar('pw', { length: 255 }).notNull(),
});

export const tipologiaQuestionario = pgTable('tipologia_questionario', {
    nome: varchar('nome', { length: 32 }).primaryKey(),
    domande: jsonb('domande').notNull(),
    punteggio: jsonb('punteggio').notNull(),
    campi: jsonb('campi').notNull(),
    tempoSomministrazione: integer('tempo_somministrazione').notNull(),
});

export const notifica = pgTable('notifica', {
    idNotifica: uuid('id_notifica').defaultRandom().primaryKey(),
    titolo: varchar('titolo', { length: 128 }).notNull(),
    tipologia: varchar('tipologia', { length: 32 }),
    descrizione: text('descrizione').notNull(),
});

export const badge = pgTable('badge', {
    nome: varchar('nome', { length: 64 }).primaryKey(),
    descrizione: text('descrizione').notNull(),
    immagineBadge: varchar('immagine_badge', { length: 256 }),
});

export const paziente = pgTable('paziente', {
    idPaziente: uuid('id_paziente').defaultRandom().primaryKey(),
    nome: varchar('nome', { length: 64 }).notNull(),
    cognome: varchar('cognome', { length: 64 }).notNull(),
    dataNascita: date('data_nascita', { mode: 'string' }).notNull(),
    terms: boolean('terms').default(false).notNull(),
    email: varchar('email', { length: 64 }).notNull(),
    codFiscale: char('cod_fiscale', { length: 16 }).notNull().unique(),
    residenza: varchar('residenza', { length: 64 }).notNull(),
    sesso: tipoSessoEnum('sesso').notNull(),
    dataIngresso: date('data_ingresso', { mode: 'string' }).notNull(),
    score: doublePrecision('score'),

    idPriorita: nomePrioritaEnum('id_priorita')
        .notNull()
        .references(() => priorita.nome),
    idPsicologo: char('id_psicologo', { length: 16 })
        .references(() => psicologo.codFiscale),
});

export const domandaForum = pgTable('domanda_forum', {
    idDomanda: uuid('id_domanda').defaultRandom().primaryKey(),
    titolo: varchar('titolo', { length: 64 }).notNull(),
    testo: text('testo').notNull(),
    categoria: varchar('categoria', { length: 128 }).notNull(),
    dataInserimento: timestamp('data_inserimento').defaultNow().notNull(),

    idPaziente: uuid('id_paziente')
        .notNull()
        .references(() => paziente.idPaziente),
});

export const statoAnimo = pgTable('stato_animo', {
    idStatoAnimo: uuid('id_stato_animo').defaultRandom().primaryKey(),
    umore: varchar('umore', { length: 16 }).notNull(),
    intensita: integer('intensita'),
    note: text('note'),
    dataInserimento: timestamp('data_inserimento').defaultNow().notNull(),

    idPaziente: uuid('id_paziente')
        .notNull()
        .references(() => paziente.idPaziente),
});

export const paginaDiario = pgTable('pagina_diario', {
    idPaginaDiario: uuid('id_pagina_diario').defaultRandom().primaryKey(),
    titolo: varchar('titolo', { length: 64 }).notNull(),
    testo: text('testo').notNull(),
    dataInserimento: timestamp('data_inserimento').defaultNow(),

    idPaziente: uuid('id_paziente')
        .notNull()
        .references(() => paziente.idPaziente),
});

export const acquisizioneBadge = pgTable(
    'acquisizione_badge',
    {
        dataAcquisizione: timestamp('data_acquisizione').defaultNow(),
        idPaziente: uuid('id_paziente')
            .notNull()
            .references(() => paziente.idPaziente),
        nomeBadge: varchar('nome_badge', { length: 64 })
            .notNull()
            .references(() => badge.nome),
    },
    (t) => ({
        pk: primaryKey({ columns: [t.idPaziente, t.nomeBadge, t.dataAcquisizione] }),
    }),
);

export const ricezioneNotificaPaziente = pgTable(
    'ricezione_notifica_paziente',
    {
        dataRicezione: timestamp('data_ricezione').defaultNow(),
        idPaziente: uuid('id_paziente')
            .notNull()
            .references(() => paziente.idPaziente),
        idNotifica: uuid('id_notifica')
            .notNull()
            .references(() => notifica.idNotifica),
    },
    (t) => ({
        pk: primaryKey({ columns: [t.idPaziente, t.idNotifica, t.dataRicezione] }),
    }),
);

export const ricezioneNotificaPsicologo = pgTable(
    'ricezione_notifica_psicologo',
    {
        dataRicezione: timestamp('data_ricezione').defaultNow(),
        idNotifica: uuid('id_notifica')
            .notNull()
            .references(() => notifica.idNotifica),
        idPsicologo: char('id_psicologo', { length: 16 })
            .notNull()
            .references(() => psicologo.codFiscale),
    },
    (t) => ({
        pk: primaryKey({ columns: [t.idPsicologo, t.idNotifica, t.dataRicezione] }),
    }),
);

export const ticket = pgTable(
    'ticket',
    {
        idTicket: uuid('id_ticket').defaultRandom().primaryKey(),
        risolto: statoTicketEnum('risolto').default('Aperto'),
        oggetto: varchar('oggetto', { length: 64 }).notNull(),
        descrizione: text('descrizione').notNull(),
        dataInvio: timestamp('data_invio').defaultNow(),

        idAmministratore: varchar('id_amministratore', { length: 64 }).references(
            () => amministratore.email,
        ),
        idPaziente: uuid('id_paziente').references(() => paziente.idPaziente),
        idPsicologo: char('id_psicologo', { length: 16 }).references(
            () => psicologo.codFiscale,
        ),
    },
);

export const alertClinico = pgTable('alert_clinico', {
    idAlert: uuid('id_alert').defaultRandom().primaryKey(),
    dataAlert: timestamp('data_alert').defaultNow(),
    accettato: boolean('accettato').default(false).notNull(),

    idPaziente: uuid('id_paziente')
        .notNull()
        .references(() => paziente.idPaziente),
    idPsicologo: char('id_psicologo', { length: 16 })
        .notNull()
        .references(() => psicologo.codFiscale),
});

export const report = pgTable('report', {
    idReport: uuid('id_report').defaultRandom().primaryKey(),
    dataReport: timestamp('data_report').defaultNow(),
    contenuto: text('contenuto').notNull(),

    idPaziente: uuid('id_paziente')
        .notNull()
        .references(() => paziente.idPaziente),
    idPsicologo: char('id_psicologo', { length: 16 })
        .notNull()
        .references(() => psicologo.codFiscale),
});

export const rispostaForum = pgTable('risposta_forum', {
    idRisposta: uuid('id_risposta').defaultRandom().primaryKey(),
    dataRisposta: timestamp('data_risposta').defaultNow(),
    testo: text('testo').notNull(),

    idPsicologo: char('id_psicologo', { length: 16 })
        .notNull()
        .references(() => psicologo.codFiscale),
    idDomanda: uuid('id_domanda')
        .notNull()
        .references(() => domandaForum.idDomanda),
});

export const questionario = pgTable('questionario', {
    idQuestionario: uuid('id_questionario').defaultRandom().primaryKey(),
    score: doublePrecision('score'),
    risposte: jsonb('risposte'),
    cambiamento: boolean('cambiamento').default(false),
    dataCompilazione: timestamp('data_compilazione').defaultNow().notNull(),
    revisionato: boolean('revisionato').default(false),

    invalidato: boolean('invalidato').default(false),
    noteInvalidazione: text('note_invalidazione'),
    dataInvalidazione: timestamp('data_invalidazione'),

    idPaziente: uuid('id_paziente')
        .notNull()
        .references(() => paziente.idPaziente),
    nomeTipologia: varchar('nome_tipologia', { length: 32 })
        .notNull()
        .references(() => tipologiaQuestionario.nome),
    idPsicologoRevisione: char('id_psicologo_revisione', { length: 16 }).references(
        () => psicologo.codFiscale,
    ),

    idPsicologoRichiedente: char('id_psicologo_richiedente', {
        length: 16,
    }).references(() => psicologo.codFiscale),
    idAmministratoreConferma: varchar('id_amministratore_conferma', {
        length: 64,
    }).references(() => amministratore.email),
});
