CREATE TYPE "dedication_status" AS ENUM (
  'NEW',
  'APPROVED',
  'CONTACTED',
  'READ_LIVE',
  'COMPLETED',
  'REJECTED',
  'ARCHIVED'
);

CREATE TYPE "donation_status" AS ENUM (
  'NOT_OFFERED',
  'OFFERED',
  'PENDING',
  'COMPLETED',
  'FAILED',
  'CANCELLED'
);

CREATE TABLE "dedications" (
  "id" uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  "public_id" varchar(16) NOT NULL UNIQUE,
  "sender_name" varchar(80),
  "is_anonymous" boolean NOT NULL DEFAULT false,
  "recipient_name" varchar(80) NOT NULL,
  "recipient_whatsapp" varchar(32) NOT NULL,
  "dedication_message" text NOT NULL,
  "status" "dedication_status" NOT NULL DEFAULT 'NEW',
  "donation_status" "donation_status" NOT NULL DEFAULT 'NOT_OFFERED',
  "donation_amount" numeric(10, 2),
  "donation_transaction_id" varchar(128),
  "donated_at" timestamptz,
  "submitted_at" timestamptz NOT NULL DEFAULT now(),
  "updated_at" timestamptz NOT NULL DEFAULT now(),
  "live_date" timestamptz,
  "admin_notes" text,
  "contacted_at" timestamptz,
  "read_at" timestamptz,
  "queue_order" integer,
  "featured" boolean NOT NULL DEFAULT false,
  "submitter_ip_hash" varchar(64)
);

CREATE INDEX "dedications_status_idx" ON "dedications" ("status");
CREATE INDEX "dedications_submitted_at_idx" ON "dedications" ("submitted_at");
CREATE INDEX "dedications_live_date_idx" ON "dedications" ("live_date");
CREATE INDEX "dedications_whatsapp_idx" ON "dedications" ("recipient_whatsapp");
CREATE INDEX "dedications_donation_status_idx" ON "dedications" ("donation_status");
CREATE INDEX "dedications_queue_order_idx" ON "dedications" ("queue_order");

CREATE TABLE "admins" (
  "id" uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  "email" varchar(255) NOT NULL UNIQUE,
  "password_hash" varchar(255) NOT NULL,
  "name" varchar(80),
  "created_at" timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE "settings" (
  "id" integer PRIMARY KEY DEFAULT 1,
  "show_name" varchar(80) NOT NULL DEFAULT 'Say It',
  "tiktok_url" text,
  "paypal_donation_url" text,
  "show_time" varchar(8) NOT NULL DEFAULT '10:00',
  "timezone" varchar(64) NOT NULL DEFAULT 'America/New_York',
  "show_duration_minutes" integer NOT NULL DEFAULT 90,
  "whatsapp_message_template" text NOT NULL,
  "max_dedication_length" integer NOT NULL DEFAULT 1000,
  "donation_message" text,
  "retention_days" integer NOT NULL DEFAULT 90,
  "show_status_override" varchar(20) NOT NULL DEFAULT 'auto',
  "updated_at" timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE "rate_limits" (
  "id" uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  "key" varchar(128) NOT NULL,
  "created_at" timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX "rate_limits_key_created_idx" ON "rate_limits" ("key", "created_at");
