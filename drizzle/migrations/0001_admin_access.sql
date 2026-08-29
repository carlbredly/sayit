ALTER TABLE "admins"
  ADD COLUMN IF NOT EXISTS "is_owner" boolean NOT NULL DEFAULT false;

ALTER TABLE "admins"
  ADD COLUMN IF NOT EXISTS "is_active" boolean NOT NULL DEFAULT true;
