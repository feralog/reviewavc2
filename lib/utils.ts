import { schedule } from "@/data/schedule";

export function getCurrentDay(): number | null {
  const today = new Date();
  const todayStr = today.toISOString().split("T")[0];

  const found = schedule.find((d) => d.date === todayStr);
  return found ? found.day : null;
}

export function getDayByNumber(day: number) {
  return schedule.find((d) => d.day === day) ?? null;
}

export function getDayByDate(dateStr: string) {
  return schedule.find((d) => d.date === dateStr) ?? null;
}

export function isBeforeSchedule(): boolean {
  const today = new Date();
  const start = new Date("2025-04-28");
  today.setHours(0, 0, 0, 0);
  start.setHours(0, 0, 0, 0);
  return today < start;
}

export function isAfterSchedule(): boolean {
  const today = new Date();
  const end = new Date("2025-05-13");
  today.setHours(0, 0, 0, 0);
  end.setHours(0, 0, 0, 0);
  return today > end;
}

export function formatDate(dateStr: string): string {
  const [year, month, day] = dateStr.split("-");
  return `${day}/${month}/${year}`;
}

export function getStreakForUser(
  checkins: { check_date: string }[]
): number {
  if (checkins.length === 0) return 0;

  const dates = checkins
    .map((c) => c.check_date.split("T")[0])
    .sort()
    .reverse();

  const today = new Date();
  today.setHours(0, 0, 0, 0);

  let streak = 0;
  let current = new Date(today);

  for (const dateStr of dates) {
    const d = new Date(dateStr);
    d.setHours(0, 0, 0, 0);
    const diff = Math.round(
      (current.getTime() - d.getTime()) / (1000 * 60 * 60 * 24)
    );
    if (diff === 0 || diff === 1) {
      streak++;
      current = d;
    } else {
      break;
    }
  }

  return streak;
}
