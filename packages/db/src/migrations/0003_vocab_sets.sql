-- 0003_vocab_sets.sql
-- Bảng lưu bộ từ vựng do user tự upload (tool Vocab Trainer)
-- user_id là INTEGER (khớp với kiểu thật của users.id trên production,
-- không phải uuid như phần lớn schema .ts khác khai báo).

CREATE TABLE IF NOT EXISTS "vocab_sets" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"user_id" integer NOT NULL,
	"name" text NOT NULL,
	"is_public" boolean DEFAULT false NOT NULL,
	"words" jsonb NOT NULL,
	"word_count" integer DEFAULT 0 NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);

DO $$ BEGIN
	ALTER TABLE "vocab_sets" ADD CONSTRAINT "vocab_sets_user_id_users_id_fk"
		FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE cascade;
EXCEPTION
	WHEN duplicate_object THEN null;
END $$;

CREATE INDEX IF NOT EXISTS "vocab_sets_user_id_idx" ON "vocab_sets" ("user_id");
CREATE INDEX IF NOT EXISTS "vocab_sets_is_public_idx" ON "vocab_sets" ("is_public");
