CREATE TABLE IF NOT EXISTS "users" (
	"id" integer PRIMARY KEY GENERATED ALWAYS AS IDENTITY (sequence name "users_id_seq" INCREMENT BY 1 MINVALUE 1 MAXVALUE 2147483647 START WITH 1 CACHE 1),
	"wallet_address" varchar(42) NOT NULL,
	"name" varchar(255),
	"bio" text,
	CONSTRAINT "users_wallet_address_unique" UNIQUE("wallet_address")
);
