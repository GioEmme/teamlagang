import {
  pgTable,
  pgEnum,
  uuid,
  text,
  char,
  timestamp,
  integer,
  boolean,
  date,
  uniqueIndex,
  index,
} from "drizzle-orm/pg-core";

export const userStatusEnum = pgEnum("user_status", [
  "pending",
  "active",
  "disabled",
]);

export const userRoleEnum = pgEnum("user_role", ["admin", "member"]);

export const tokenPurposeEnum = pgEnum("token_purpose", [
  "email_verify",
  "password_reset",
]);

export const users = pgTable("users", {
  id: uuid("id").defaultRandom().primaryKey(),
  email: text("email").notNull().unique(),
  emailVerified: timestamp("email_verified", { withTimezone: true }),
  passwordHash: text("password_hash").notNull(),
  firstName: text("first_name").notNull(),
  lastName: text("last_name").notNull(),
  tesseraCode: char("tessera_code", { length: 4 }).notNull().unique(),
  status: userStatusEnum("status").notNull().default("pending"),
  role: userRoleEnum("role").notNull().default("member"),
  // bumped on password change — JWT issued before this are treated invalid
  passwordChangedAt: timestamp("password_changed_at", { withTimezone: true })
    .notNull()
    .defaultNow(),
  createdAt: timestamp("created_at", { withTimezone: true })
    .notNull()
    .defaultNow(),
  updatedAt: timestamp("updated_at", { withTimezone: true })
    .notNull()
    .defaultNow(),
});

export const news = pgTable("news", {
  id: uuid("id").defaultRandom().primaryKey(),
  slug: text("slug").notNull().unique(),
  title: text("title").notNull(),
  excerpt: text("excerpt").notNull(),
  body: text("body").notNull(),
  coverImage: text("cover_image"),
  publishedAt: timestamp("published_at", { withTimezone: true }),
  authorId: uuid("author_id").references(() => users.id, {
    onDelete: "set null",
  }),
  createdAt: timestamp("created_at", { withTimezone: true })
    .notNull()
    .defaultNow(),
  updatedAt: timestamp("updated_at", { withTimezone: true })
    .notNull()
    .defaultNow(),
});

export const verificationTokens = pgTable("verification_tokens", {
  token: text("token").primaryKey(),
  userId: uuid("user_id")
    .notNull()
    .references(() => users.id, { onDelete: "cascade" }),
  purpose: tokenPurposeEnum("purpose").notNull(),
  expiresAt: timestamp("expires_at", { withTimezone: true }).notNull(),
  createdAt: timestamp("created_at", { withTimezone: true })
    .notNull()
    .defaultNow(),
});

// ---------------- myrcm sync (calendar + championship standings) ----------------

export const mrEvents = pgTable(
  "mr_events",
  {
    id: uuid("id").defaultRandom().primaryKey(),
    myrcmId: integer("myrcm_id").notNull().unique(),
    name: text("name").notNull(),
    startDate: date("start_date").notNull(),
    endDate: date("end_date"),
    registeredCount: integer("registered_count").notNull().default(0),
    waitingCount: integer("waiting_count").notNull().default(0),
    registrationDeadline: timestamp("registration_deadline", {
      withTimezone: true,
    }),
    // 'open' | 'closed' | 'scheduled' | null (unknown)
    registrationStatus: text("registration_status"),
    fetchedAt: timestamp("fetched_at", { withTimezone: true })
      .notNull()
      .defaultNow(),
  },
  (t) => [index("mr_events_start_date_idx").on(t.startDate)],
);

export const mrChampionships = pgTable("mr_championships", {
  id: uuid("id").defaultRandom().primaryKey(),
  myrcmId: integer("myrcm_id").notNull().unique(),
  name: text("name").notNull(),
  category: text("category").notNull(),
  year: integer("year").notNull(),
  roundsCounted: integer("rounds_counted"),
  roundsNotCounted: integer("rounds_not_counted"),
  fetchedAt: timestamp("fetched_at", { withTimezone: true })
    .notNull()
    .defaultNow(),
});

export const mrChampionshipRounds = pgTable(
  "mr_championship_rounds",
  {
    id: uuid("id").defaultRandom().primaryKey(),
    championshipId: uuid("championship_id")
      .notNull()
      .references(() => mrChampionships.id, { onDelete: "cascade" }),
    roundNumber: integer("round_number").notNull(),
    eventName: text("event_name").notNull(),
    startDate: date("start_date"),
    endDate: date("end_date"),
    processed: boolean("processed").notNull().default(false),
    counted: boolean("counted").notNull().default(false),
  },
  (t) => [
    uniqueIndex("mr_championship_rounds_unique").on(
      t.championshipId,
      t.roundNumber,
    ),
  ],
);

export const mrStandings = pgTable(
  "mr_standings",
  {
    id: uuid("id").defaultRandom().primaryKey(),
    championshipId: uuid("championship_id")
      .notNull()
      .references(() => mrChampionships.id, { onDelete: "cascade" }),
    position: integer("position").notNull(),
    pilotName: text("pilot_name").notNull(),
    pilotNumber: text("pilot_number"),
    totalPoints: integer("total_points").notNull(),
    dropPoints: integer("drop_points").notNull().default(0),
    roundsPlayed: integer("rounds_played").notNull().default(0),
    roundsCounted: integer("rounds_counted").notNull().default(0),
  },
  (t) => [
    uniqueIndex("mr_standings_unique").on(t.championshipId, t.position),
    index("mr_standings_pilot_idx").on(t.championshipId, t.pilotName),
  ],
);

export const mrRoundResults = pgTable(
  "mr_round_results",
  {
    id: uuid("id").defaultRandom().primaryKey(),
    championshipId: uuid("championship_id")
      .notNull()
      .references(() => mrChampionships.id, { onDelete: "cascade" }),
    roundNumber: integer("round_number").notNull(),
    pilotPosition: integer("pilot_position").notNull(),
    pilotName: text("pilot_name").notNull(),
    points: integer("points").notNull(),
    penalty: integer("penalty").notNull().default(0),
    tqFlag: boolean("tq_flag").notNull().default(false),
  },
  (t) => [
    uniqueIndex("mr_round_results_unique").on(
      t.championshipId,
      t.roundNumber,
      t.pilotPosition,
    ),
    index("mr_round_results_round_idx").on(t.championshipId, t.roundNumber),
  ],
);

export const mrSyncRuns = pgTable("mr_sync_runs", {
  id: uuid("id").defaultRandom().primaryKey(),
  startedAt: timestamp("started_at", { withTimezone: true })
    .notNull()
    .defaultNow(),
  finishedAt: timestamp("finished_at", { withTimezone: true }),
  ok: boolean("ok").notNull().default(false),
  eventsProcessed: integer("events_processed").notNull().default(0),
  championshipsProcessed: integer("championships_processed")
    .notNull()
    .default(0),
  errorMessage: text("error_message"),
});

// ---------------- types ----------------

export type User = typeof users.$inferSelect;
export type NewUser = typeof users.$inferInsert;
export type News = typeof news.$inferSelect;
export type NewNews = typeof news.$inferInsert;
export type VerificationToken = typeof verificationTokens.$inferSelect;
export type MrEvent = typeof mrEvents.$inferSelect;
export type MrChampionship = typeof mrChampionships.$inferSelect;
export type MrStanding = typeof mrStandings.$inferSelect;
export type MrRoundResult = typeof mrRoundResults.$inferSelect;
