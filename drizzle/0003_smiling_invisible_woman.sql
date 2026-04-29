CREATE TABLE "mr_championship_rounds" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"championship_id" uuid NOT NULL,
	"round_number" integer NOT NULL,
	"event_name" text NOT NULL,
	"start_date" date,
	"end_date" date,
	"processed" boolean DEFAULT false NOT NULL,
	"counted" boolean DEFAULT false NOT NULL
);
--> statement-breakpoint
CREATE TABLE "mr_championships" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"myrcm_id" integer NOT NULL,
	"name" text NOT NULL,
	"category" text NOT NULL,
	"year" integer NOT NULL,
	"rounds_counted" integer,
	"rounds_not_counted" integer,
	"fetched_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "mr_championships_myrcm_id_unique" UNIQUE("myrcm_id")
);
--> statement-breakpoint
CREATE TABLE "mr_events" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"myrcm_id" integer NOT NULL,
	"name" text NOT NULL,
	"start_date" date NOT NULL,
	"end_date" date,
	"registered_count" integer DEFAULT 0 NOT NULL,
	"waiting_count" integer DEFAULT 0 NOT NULL,
	"registration_deadline" timestamp with time zone,
	"fetched_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "mr_events_myrcm_id_unique" UNIQUE("myrcm_id")
);
--> statement-breakpoint
CREATE TABLE "mr_round_results" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"championship_id" uuid NOT NULL,
	"round_number" integer NOT NULL,
	"pilot_name" text NOT NULL,
	"points" integer NOT NULL,
	"penalty" integer DEFAULT 0 NOT NULL,
	"tq_flag" boolean DEFAULT false NOT NULL
);
--> statement-breakpoint
CREATE TABLE "mr_standings" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"championship_id" uuid NOT NULL,
	"position" integer NOT NULL,
	"pilot_name" text NOT NULL,
	"pilot_number" text,
	"total_points" integer NOT NULL,
	"drop_points" integer DEFAULT 0 NOT NULL,
	"rounds_played" integer DEFAULT 0 NOT NULL,
	"rounds_counted" integer DEFAULT 0 NOT NULL
);
--> statement-breakpoint
CREATE TABLE "mr_sync_runs" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"started_at" timestamp with time zone DEFAULT now() NOT NULL,
	"finished_at" timestamp with time zone,
	"ok" boolean DEFAULT false NOT NULL,
	"events_processed" integer DEFAULT 0 NOT NULL,
	"championships_processed" integer DEFAULT 0 NOT NULL,
	"error_message" text
);
--> statement-breakpoint
ALTER TABLE "mr_championship_rounds" ADD CONSTRAINT "mr_championship_rounds_championship_id_mr_championships_id_fk" FOREIGN KEY ("championship_id") REFERENCES "public"."mr_championships"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "mr_round_results" ADD CONSTRAINT "mr_round_results_championship_id_mr_championships_id_fk" FOREIGN KEY ("championship_id") REFERENCES "public"."mr_championships"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "mr_standings" ADD CONSTRAINT "mr_standings_championship_id_mr_championships_id_fk" FOREIGN KEY ("championship_id") REFERENCES "public"."mr_championships"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
CREATE UNIQUE INDEX "mr_championship_rounds_unique" ON "mr_championship_rounds" USING btree ("championship_id","round_number");--> statement-breakpoint
CREATE INDEX "mr_events_start_date_idx" ON "mr_events" USING btree ("start_date");--> statement-breakpoint
CREATE UNIQUE INDEX "mr_round_results_unique" ON "mr_round_results" USING btree ("championship_id","round_number","pilot_name");--> statement-breakpoint
CREATE INDEX "mr_round_results_round_idx" ON "mr_round_results" USING btree ("championship_id","round_number");--> statement-breakpoint
CREATE UNIQUE INDEX "mr_standings_unique" ON "mr_standings" USING btree ("championship_id","position");--> statement-breakpoint
CREATE INDEX "mr_standings_pilot_idx" ON "mr_standings" USING btree ("championship_id","pilot_name");