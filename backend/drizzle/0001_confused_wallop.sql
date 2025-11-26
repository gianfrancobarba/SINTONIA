ALTER TABLE "paziente" ALTER COLUMN "data_nascita" SET DATA TYPE date;--> statement-breakpoint
ALTER TABLE "paziente" ALTER COLUMN "data_ingresso" SET DATA TYPE date;--> statement-breakpoint
ALTER TABLE "questionario" ALTER COLUMN "data_compilazione" SET NOT NULL;