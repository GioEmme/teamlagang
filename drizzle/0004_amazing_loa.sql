-- partial sync data from a failed run is cleared so we can re-add the NOT NULL column
TRUNCATE TABLE "mr_round_results";--> statement-breakpoint
TRUNCATE TABLE "mr_standings";--> statement-breakpoint
TRUNCATE TABLE "mr_championship_rounds";--> statement-breakpoint
DROP INDEX "mr_round_results_unique";--> statement-breakpoint
ALTER TABLE "mr_round_results" ADD COLUMN "pilot_position" integer NOT NULL;--> statement-breakpoint
CREATE UNIQUE INDEX "mr_round_results_unique" ON "mr_round_results" USING btree ("championship_id","round_number","pilot_position");