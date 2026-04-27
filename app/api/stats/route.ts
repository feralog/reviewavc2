import { sql } from "@/lib/db";
import { NextResponse } from "next/server";
import { getStreakForUser } from "@/lib/utils";

const USERS = ["Fernando", "Gabriel", "Diogenes"];

export async function GET() {
  try {
    const result = await sql`
      SELECT
        user_name,
        COUNT(*)::int AS total_checkins,
        SUM(correct_answers)::int AS total_correct,
        MAX(completed_at) AS last_activity,
        json_agg(check_date ORDER BY check_date) AS dates
      FROM checkins
      GROUP BY user_name
    `;

    const statsMap: Record<string, {
      user_name: string;
      total_checkins: number;
      total_correct: number;
      last_activity: string | null;
      streak: number;
    }> = {};

    for (const row of result.rows) {
      const dates = (row.dates as string[]).map((d: string) =>
        d.split("T")[0]
      );
      statsMap[row.user_name] = {
        user_name: row.user_name,
        total_checkins: row.total_checkins,
        total_correct: row.total_correct,
        last_activity: row.last_activity,
        streak: getStreakForUser(dates.map((d) => ({ check_date: d }))),
      };
    }

    const stats = USERS.map((u) =>
      statsMap[u] ?? {
        user_name: u,
        total_checkins: 0,
        total_correct: 0,
        last_activity: null,
        streak: 0,
      }
    );

    return NextResponse.json({ stats });
  } catch (err) {
    return NextResponse.json({ error: String(err) }, { status: 500 });
  }
}
