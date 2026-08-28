import {
  boolean,
  index,
  integer,
  numeric,
  pgEnum,
  pgTable,
  text,
  timestamp,
  uuid,
  varchar,
} from "drizzle-orm/pg-core";

export const dedicationStatusEnum = pgEnum("dedication_status", [
  "NEW",
  "APPROVED",
  "CONTACTED",
  "READ_LIVE",
  "COMPLETED",
  "REJECTED",
  "ARCHIVED",
]);

export const donationStatusEnum = pgEnum("donation_status", [
  "NOT_OFFERED",
  "OFFERED",
  "PENDING",
  "COMPLETED",
  "FAILED",
  "CANCELLED",
]);

export const dedications = pgTable(
  "dedications",
  {
    id: uuid("id").defaultRandom().primaryKey(),
    publicId: varchar("public_id", { length: 16 }).notNull().unique(),
    senderName: varchar("sender_name", { length: 80 }),
    isAnonymous: boolean("is_anonymous").notNull().default(false),
    recipientName: varchar("recipient_name", { length: 80 }).notNull(),
    recipientWhatsapp: varchar("recipient_whatsapp", { length: 32 }).notNull(),
    dedicationMessage: text("dedication_message").notNull(),
    status: dedicationStatusEnum("status").notNull().default("NEW"),
    donationStatus: donationStatusEnum("donation_status")
      .notNull()
      .default("NOT_OFFERED"),
    donationAmount: numeric("donation_amount", { precision: 10, scale: 2 }),
    donationTransactionId: varchar("donation_transaction_id", { length: 128 }),
    donatedAt: timestamp("donated_at", { withTimezone: true }),
    submittedAt: timestamp("submitted_at", { withTimezone: true })
      .notNull()
      .defaultNow(),
    updatedAt: timestamp("updated_at", { withTimezone: true })
      .notNull()
      .defaultNow(),
    liveDate: timestamp("live_date", { withTimezone: true }),
    adminNotes: text("admin_notes"),
    contactedAt: timestamp("contacted_at", { withTimezone: true }),
    readAt: timestamp("read_at", { withTimezone: true }),
    queueOrder: integer("queue_order"),
    featured: boolean("featured").notNull().default(false),
    submitterIpHash: varchar("submitter_ip_hash", { length: 64 }),
  },
  (table) => [
    index("dedications_status_idx").on(table.status),
    index("dedications_submitted_at_idx").on(table.submittedAt),
    index("dedications_live_date_idx").on(table.liveDate),
    index("dedications_whatsapp_idx").on(table.recipientWhatsapp),
    index("dedications_donation_status_idx").on(table.donationStatus),
    index("dedications_queue_order_idx").on(table.queueOrder),
  ]
);

export const admins = pgTable("admins", {
  id: uuid("id").defaultRandom().primaryKey(),
  email: varchar("email", { length: 255 }).notNull().unique(),
  passwordHash: varchar("password_hash", { length: 255 }).notNull(),
  name: varchar("name", { length: 80 }),
  createdAt: timestamp("created_at", { withTimezone: true })
    .notNull()
    .defaultNow(),
});

export const settings = pgTable("settings", {
  id: integer("id").primaryKey().default(1),
  showName: varchar("show_name", { length: 80 }).notNull().default("Say It"),
  tiktokUrl: text("tiktok_url"),
  paypalDonationUrl: text("paypal_donation_url"),
  showTime: varchar("show_time", { length: 8 }).notNull().default("10:00"),
  timezone: varchar("timezone", { length: 64 })
    .notNull()
    .default("America/New_York"),
  showDurationMinutes: integer("show_duration_minutes").notNull().default(90),
  whatsappMessageTemplate: text("whatsapp_message_template").notNull(),
  maxDedicationLength: integer("max_dedication_length").notNull().default(1000),
  donationMessage: text("donation_message"),
  retentionDays: integer("retention_days").notNull().default(90),
  showStatusOverride: varchar("show_status_override", { length: 20 })
    .notNull()
    .default("auto"),
  updatedAt: timestamp("updated_at", { withTimezone: true })
    .notNull()
    .defaultNow(),
});

export const rateLimits = pgTable(
  "rate_limits",
  {
    id: uuid("id").defaultRandom().primaryKey(),
    key: varchar("key", { length: 128 }).notNull(),
    createdAt: timestamp("created_at", { withTimezone: true })
      .notNull()
      .defaultNow(),
  },
  (table) => [
    index("rate_limits_key_created_idx").on(table.key, table.createdAt),
  ]
);

export type Dedication = typeof dedications.$inferSelect;
export type NewDedication = typeof dedications.$inferInsert;
export type AdminUser = typeof admins.$inferSelect;
export type Settings = typeof settings.$inferSelect;
