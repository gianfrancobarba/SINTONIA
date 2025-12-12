CREATE TYPE "public"."nome_priorita" AS ENUM('Urgente', 'Breve', 'Differibile', 'Programmabile');--> statement-breakpoint
CREATE TYPE "public"."stato_ticket" AS ENUM('Aperto', 'Chiuso', 'In elaborazione');--> statement-breakpoint
CREATE TYPE "public"."tipo_sesso" AS ENUM('M', 'F', 'Altro');--> statement-breakpoint
CREATE TABLE "acquisizione_badge" (
	"data_acquisizione" timestamp DEFAULT now(),
	"id_paziente" uuid NOT NULL,
	"nome_badge" varchar(64) NOT NULL,
	CONSTRAINT "acquisizione_badge_id_paziente_nome_badge_data_acquisizione_pk" PRIMARY KEY("id_paziente","nome_badge","data_acquisizione")
);
--> statement-breakpoint
CREATE TABLE "alert_clinico" (
	"id_alert" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"data_alert" timestamp DEFAULT now(),
	"accettato" boolean DEFAULT false NOT NULL,
	"id_paziente" uuid NOT NULL,
	"id_psicologo" char(16) NOT NULL
);
--> statement-breakpoint
CREATE TABLE "amministratore" (
	"email" varchar(64) PRIMARY KEY NOT NULL,
	"nome" varchar(64) NOT NULL,
	"cognome" varchar(64) NOT NULL,
	"pw" varchar(255) NOT NULL
);
--> statement-breakpoint
CREATE TABLE "badge" (
	"nome" varchar(64) PRIMARY KEY NOT NULL,
	"descrizione" text NOT NULL,
	"immagine_badge" varchar(256)
);
--> statement-breakpoint
CREATE TABLE "domanda_forum" (
	"id_domanda" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"titolo" varchar(64) NOT NULL,
	"testo" text NOT NULL,
	"categoria" varchar(128) NOT NULL,
	"data_inserimento" timestamp DEFAULT now() NOT NULL,
	"id_paziente" uuid NOT NULL
);
--> statement-breakpoint
CREATE TABLE "notifica" (
	"id_notifica" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"titolo" varchar(128) NOT NULL,
	"tipologia" varchar(32),
	"descrizione" text NOT NULL
);
--> statement-breakpoint
CREATE TABLE "pagina_diario" (
	"id_pagina_diario" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"titolo" varchar(64) NOT NULL,
	"testo" text NOT NULL,
	"data_inserimento" timestamp DEFAULT now(),
	"id_paziente" uuid NOT NULL
);
--> statement-breakpoint
CREATE TABLE "paziente" (
	"id_paziente" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"nome" varchar(64) NOT NULL,
	"cognome" varchar(64) NOT NULL,
	"data_nascita" date NOT NULL,
	"terms" boolean DEFAULT false NOT NULL,
	"email" varchar(64) NOT NULL,
	"cod_fiscale" char(16) NOT NULL,
	"residenza" varchar(64) NOT NULL,
	"sesso" "tipo_sesso" NOT NULL,
	"data_ingresso" date NOT NULL,
	"score" double precision,
	"id_priorita" "nome_priorita" NOT NULL,
	"id_psicologo" char(16) NOT NULL,
	CONSTRAINT "paziente_cod_fiscale_unique" UNIQUE("cod_fiscale")
);
--> statement-breakpoint
CREATE TABLE "priorita" (
	"nome" "nome_priorita" PRIMARY KEY NOT NULL,
	"punteggio_inizio" double precision NOT NULL,
	"punteggio_fine" double precision NOT NULL,
	"finestra_temporale" integer NOT NULL
);
--> statement-breakpoint
CREATE TABLE "psicologo" (
	"cod_fiscale" char(16) PRIMARY KEY NOT NULL,
	"nome" varchar(64) NOT NULL,
	"cognome" varchar(64) NOT NULL,
	"asl_appartenenza" char(6) NOT NULL,
	"stato" boolean DEFAULT true NOT NULL,
	"immagine_profilo" varchar(256) NOT NULL,
	"password" varchar(255) DEFAULT '$2b$10$EpIxT98hP7v.q.Z6.Z6.Z6.Z6.Z6.Z6.Z6.Z6.Z6.Z6.Z6.Z6' NOT NULL,
	"email" varchar(64) DEFAULT 'temp@temp.com' NOT NULL,
	CONSTRAINT "psicologo_email_unique" UNIQUE("email")
);
--> statement-breakpoint
CREATE TABLE "questionario" (
	"id_questionario" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"score" double precision,
	"risposte" jsonb,
	"cambiamento" boolean DEFAULT false,
	"data_compilazione" timestamp DEFAULT now() NOT NULL,
	"revisionato" boolean DEFAULT false,
	"invalidato" boolean DEFAULT false,
	"note_invalidazione" text,
	"data_invalidazione" timestamp,
	"id_paziente" uuid NOT NULL,
	"nome_tipologia" varchar(32) NOT NULL,
	"id_psicologo_revisione" char(16),
	"id_psicologo_richiedente" char(16),
	"id_amministratore_conferma" varchar(64)
);
--> statement-breakpoint
CREATE TABLE "report" (
	"id_report" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"data_report" timestamp DEFAULT now(),
	"contenuto" text NOT NULL,
	"id_paziente" uuid NOT NULL,
	"id_psicologo" char(16) NOT NULL
);
--> statement-breakpoint
CREATE TABLE "ricezione_notifica_paziente" (
	"data_ricezione" timestamp DEFAULT now(),
	"id_paziente" uuid NOT NULL,
	"id_notifica" uuid NOT NULL,
	CONSTRAINT "ricezione_notifica_paziente_id_paziente_id_notifica_data_ricezione_pk" PRIMARY KEY("id_paziente","id_notifica","data_ricezione")
);
--> statement-breakpoint
CREATE TABLE "ricezione_notifica_psicologo" (
	"data_ricezione" timestamp DEFAULT now(),
	"id_notifica" uuid NOT NULL,
	"id_psicologo" char(16) NOT NULL,
	CONSTRAINT "ricezione_notifica_psicologo_id_psicologo_id_notifica_data_ricezione_pk" PRIMARY KEY("id_psicologo","id_notifica","data_ricezione")
);
--> statement-breakpoint
CREATE TABLE "risposta_forum" (
	"id_risposta" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"data_risposta" timestamp DEFAULT now(),
	"testo" text NOT NULL,
	"id_psicologo" char(16) NOT NULL,
	"id_domanda" uuid NOT NULL
);
--> statement-breakpoint
CREATE TABLE "stato_animo" (
	"id_stato_animo" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"umore" varchar(16) NOT NULL,
	"intensita" integer,
	"note" text,
	"data_inserimento" timestamp DEFAULT now() NOT NULL,
	"id_paziente" uuid NOT NULL
);
--> statement-breakpoint
CREATE TABLE "ticket" (
	"id_ticket" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"risolto" "stato_ticket" DEFAULT 'Aperto',
	"oggetto" varchar(64) NOT NULL,
	"descrizione" text NOT NULL,
	"data_invio" timestamp DEFAULT now(),
	"id_amministratore" varchar(64),
	"id_paziente" uuid,
	"id_psicologo" char(16)
);
--> statement-breakpoint
CREATE TABLE "tipologia_questionario" (
	"nome" varchar(32) PRIMARY KEY NOT NULL,
	"domande" jsonb NOT NULL,
	"punteggio" jsonb NOT NULL,
	"campi" jsonb NOT NULL,
	"tempo_somministrazione" integer NOT NULL
);
--> statement-breakpoint
ALTER TABLE "acquisizione_badge" ADD CONSTRAINT "acquisizione_badge_id_paziente_paziente_id_paziente_fk" FOREIGN KEY ("id_paziente") REFERENCES "public"."paziente"("id_paziente") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "acquisizione_badge" ADD CONSTRAINT "acquisizione_badge_nome_badge_badge_nome_fk" FOREIGN KEY ("nome_badge") REFERENCES "public"."badge"("nome") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "alert_clinico" ADD CONSTRAINT "alert_clinico_id_paziente_paziente_id_paziente_fk" FOREIGN KEY ("id_paziente") REFERENCES "public"."paziente"("id_paziente") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "alert_clinico" ADD CONSTRAINT "alert_clinico_id_psicologo_psicologo_cod_fiscale_fk" FOREIGN KEY ("id_psicologo") REFERENCES "public"."psicologo"("cod_fiscale") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "domanda_forum" ADD CONSTRAINT "domanda_forum_id_paziente_paziente_id_paziente_fk" FOREIGN KEY ("id_paziente") REFERENCES "public"."paziente"("id_paziente") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "pagina_diario" ADD CONSTRAINT "pagina_diario_id_paziente_paziente_id_paziente_fk" FOREIGN KEY ("id_paziente") REFERENCES "public"."paziente"("id_paziente") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "paziente" ADD CONSTRAINT "paziente_id_priorita_priorita_nome_fk" FOREIGN KEY ("id_priorita") REFERENCES "public"."priorita"("nome") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "paziente" ADD CONSTRAINT "paziente_id_psicologo_psicologo_cod_fiscale_fk" FOREIGN KEY ("id_psicologo") REFERENCES "public"."psicologo"("cod_fiscale") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "questionario" ADD CONSTRAINT "questionario_id_paziente_paziente_id_paziente_fk" FOREIGN KEY ("id_paziente") REFERENCES "public"."paziente"("id_paziente") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "questionario" ADD CONSTRAINT "questionario_nome_tipologia_tipologia_questionario_nome_fk" FOREIGN KEY ("nome_tipologia") REFERENCES "public"."tipologia_questionario"("nome") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "questionario" ADD CONSTRAINT "questionario_id_psicologo_revisione_psicologo_cod_fiscale_fk" FOREIGN KEY ("id_psicologo_revisione") REFERENCES "public"."psicologo"("cod_fiscale") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "questionario" ADD CONSTRAINT "questionario_id_psicologo_richiedente_psicologo_cod_fiscale_fk" FOREIGN KEY ("id_psicologo_richiedente") REFERENCES "public"."psicologo"("cod_fiscale") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "questionario" ADD CONSTRAINT "questionario_id_amministratore_conferma_amministratore_email_fk" FOREIGN KEY ("id_amministratore_conferma") REFERENCES "public"."amministratore"("email") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "report" ADD CONSTRAINT "report_id_paziente_paziente_id_paziente_fk" FOREIGN KEY ("id_paziente") REFERENCES "public"."paziente"("id_paziente") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "report" ADD CONSTRAINT "report_id_psicologo_psicologo_cod_fiscale_fk" FOREIGN KEY ("id_psicologo") REFERENCES "public"."psicologo"("cod_fiscale") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "ricezione_notifica_paziente" ADD CONSTRAINT "ricezione_notifica_paziente_id_paziente_paziente_id_paziente_fk" FOREIGN KEY ("id_paziente") REFERENCES "public"."paziente"("id_paziente") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "ricezione_notifica_paziente" ADD CONSTRAINT "ricezione_notifica_paziente_id_notifica_notifica_id_notifica_fk" FOREIGN KEY ("id_notifica") REFERENCES "public"."notifica"("id_notifica") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "ricezione_notifica_psicologo" ADD CONSTRAINT "ricezione_notifica_psicologo_id_notifica_notifica_id_notifica_fk" FOREIGN KEY ("id_notifica") REFERENCES "public"."notifica"("id_notifica") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "ricezione_notifica_psicologo" ADD CONSTRAINT "ricezione_notifica_psicologo_id_psicologo_psicologo_cod_fiscale_fk" FOREIGN KEY ("id_psicologo") REFERENCES "public"."psicologo"("cod_fiscale") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "risposta_forum" ADD CONSTRAINT "risposta_forum_id_psicologo_psicologo_cod_fiscale_fk" FOREIGN KEY ("id_psicologo") REFERENCES "public"."psicologo"("cod_fiscale") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "risposta_forum" ADD CONSTRAINT "risposta_forum_id_domanda_domanda_forum_id_domanda_fk" FOREIGN KEY ("id_domanda") REFERENCES "public"."domanda_forum"("id_domanda") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "stato_animo" ADD CONSTRAINT "stato_animo_id_paziente_paziente_id_paziente_fk" FOREIGN KEY ("id_paziente") REFERENCES "public"."paziente"("id_paziente") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "ticket" ADD CONSTRAINT "ticket_id_amministratore_amministratore_email_fk" FOREIGN KEY ("id_amministratore") REFERENCES "public"."amministratore"("email") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "ticket" ADD CONSTRAINT "ticket_id_paziente_paziente_id_paziente_fk" FOREIGN KEY ("id_paziente") REFERENCES "public"."paziente"("id_paziente") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "ticket" ADD CONSTRAINT "ticket_id_psicologo_psicologo_cod_fiscale_fk" FOREIGN KEY ("id_psicologo") REFERENCES "public"."psicologo"("cod_fiscale") ON DELETE no action ON UPDATE no action;