import { sql } from "@/lib/db";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    const { user_name, check_date, correct_answers, total_questions } =
      await req.json();

    if (!user_name || !check_date) {
      return NextResponse.json(
        { error: "user_name and check_date are required" },
        { status: 400 }
      );
    }

    await sql`
      INSERT INTO checkins (user_name, check_date, correct_answers, total_questions)
      VALUES (${user_name}, ${check_date}, ${correct_answers ?? 0}, ${total_questions ?? 5})
      ON CONFLICT (user_name, check_date)
      DO UPDATE SET
        correct_answers = EXCLUDED.correct_answers,
        total_questions = EXCLUDED.total_questions,
        completed_at = NOW()
    `;

    return NextResponse.json({ ok: true });
  } catch (err) {
    return NextResponse.json({ error: String(err) }, { status: 500 });
  }
}

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const user_name = searchParams.get("user");
  const check_date = searchParams.get("date");

  if (!user_name || !check_date) {
    return NextResponse.json({ checkin: null });
  }

  try {
    const result = await sql`
      SELECT * FROM checkins
      WHERE user_name = ${user_name} AND check_date = ${check_date}
      LIMIT 1
    `;
    return NextResponse.json({ checkin: result.rows[0] ?? null });
  } catch (err) {
    return NextResponse.json({ error: String(err) }, { status: 500 });
  }
}
