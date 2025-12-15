CREATE TYPE "public"."umore" AS ENUM('Felice', 'Sereno', 'Energico', 'Neutro', 'Stanco', 'Triste', 'Ansioso', 'Arrabbiato', 'Spaventato', 'Confuso');--> statement-breakpoint
ALTER TABLE "ricezione_notifica_paziente" DISABLE ROW LEVEL SECURITY;--> statement-breakpoint
ALTER TABLE "ricezione_notifica_psicologo" DISABLE ROW LEVEL SECURITY;--> statement-breakpoint
DROP TABLE "ricezione_notifica_paziente" CASCADE;--> statement-breakpoint
DROP TABLE "ricezione_notifica_psicologo" CASCADE;--> statement-breakpoint
ALTER TABLE "paziente" ALTER COLUMN "score" SET DEFAULT 0;--> statement-breakpoint
ALTER TABLE "stato_animo" ALTER COLUMN "umore" SET DATA TYPE "public"."umore" USING "umore"::"public"."umore";--> statement-breakpoint
ALTER TABLE "notifica" ADD COLUMN "data_invio" timestamp DEFAULT now();--> statement-breakpoint
ALTER TABLE "notifica" ADD COLUMN "letto" boolean DEFAULT false;--> statement-breakpoint
ALTER TABLE "notifica" ADD COLUMN "id_paziente" uuid;--> statement-breakpoint
ALTER TABLE "notifica" ADD COLUMN "id_psicologo" char(16);--> statement-breakpoint
ALTER TABLE "notifica" ADD COLUMN "id_amministratore" varchar(64);--> statement-breakpoint
ALTER TABLE "paziente" ADD COLUMN "stato" boolean DEFAULT true NOT NULL;--> statement-breakpoint
ALTER TABLE "notifica" ADD CONSTRAINT "notifica_id_paziente_paziente_id_paziente_fk" FOREIGN KEY ("id_paziente") REFERENCES "public"."paziente"("id_paziente") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "notifica" ADD CONSTRAINT "notifica_id_psicologo_psicologo_cod_fiscale_fk" FOREIGN KEY ("id_psicologo") REFERENCES "public"."psicologo"("cod_fiscale") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "notifica" ADD CONSTRAINT "notifica_id_amministratore_amministratore_email_fk" FOREIGN KEY ("id_amministratore") REFERENCES "public"."amministratore"("email") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "notifica" ADD CONSTRAINT "check_destinatario_notifica" CHECK ("notifica"."id_paziente" IS NOT NULL OR "notifica"."id_psicologo" IS NOT NULL OR "notifica"."id_amministratore" IS NOT NULL);