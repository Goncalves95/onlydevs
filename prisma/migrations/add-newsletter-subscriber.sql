-- Migration: add NewsletterSubscriber table
-- Run in the Supabase SQL Editor for your production project.

CREATE TABLE IF NOT EXISTS "NewsletterSubscriber" (
  "id"        TEXT         NOT NULL,
  "email"     TEXT         NOT NULL,
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "locale"    TEXT         NOT NULL DEFAULT 'en',

  CONSTRAINT "NewsletterSubscriber_pkey" PRIMARY KEY ("id")
);

CREATE UNIQUE INDEX IF NOT EXISTS "NewsletterSubscriber_email_key"
  ON "NewsletterSubscriber"("email");
