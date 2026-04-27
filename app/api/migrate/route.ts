import { sql } from "@/lib/db";
import { NextResponse } from "next/server";

export async function POST() {
  try {
    await sql`
      CREATE TABLE IF NOT EXISTS checkins (
        id SERIAL PRIMARY KEY,
        user_name VARCHAR(50) NOT NULL,
        check_date DATE NOT NULL,
        correct_answers INTEGER NOT NULL DEFAULT 0,
        total_questions INTEGER NOT NULL DEFAULT 5,
        completed_at TIMESTAMPTZ DEFAULT NOW(),
        UNIQUE(user_name, check_date)
      )
    `;
    return NextResponse.json({ ok: true, message: "Migration complete" });
  } catch (err) {
    return NextResponse.json({ ok: false, error: String(err) }, { status: 500 });
  }
}
