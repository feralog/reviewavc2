"use client";

interface UserStat {
  user_name: string;
  total_checkins: number;
  total_correct: number;
  last_activity: string | null;
  streak: number;
}

interface StatsTableProps {
  stats: UserStat[];
}

const AVATARS: Record<string, string> = {
  Fernando: "🧑‍⚕️",
  Gabriel: "👨‍⚕️",
  Diogenes: "🩺",
};

export default function StatsTable({ stats }: StatsTableProps) {
  const sorted = [...stats].sort(
    (a, b) => b.total_checkins - a.total_checkins
  );

  function formatLastActivity(ts: string | null): string {
    if (!ts) return "—";
    const d = new Date(ts);
    return d.toLocaleDateString("pt-BR", { day: "2-digit", month: "2-digit" });
  }

  return (
    <div className="space-y-4">
      {/* Desktop table */}
      <div className="hidden sm:block overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-gray-700">
              <th className="text-left text-gray-400 font-medium py-3 px-4">#</th>
              <th className="text-left text-gray-400 font-medium py-3 px-4">Usuário</th>
              <th className="text-center text-gray-400 font-medium py-3 px-4">Check-ins</th>
              <th className="text-center text-gray-400 font-medium py-3 px-4">Acertos</th>
              <th className="text-center text-gray-400 font-medium py-3 px-4">Streak</th>
              <th className="text-center text-gray-400 font-medium py-3 px-4">Última atividade</th>
            </tr>
          </thead>
          <tbody>
            {sorted.map((u, i) => (
              <tr
                key={u.user_name}
                className="border-b border-gray-800 hover:bg-gray-800/50 transition-colors"
              >
                <td className="py-3 px-4 text-gray-500">
                  {i === 0 ? "🥇" : i === 1 ? "🥈" : "🥉"}
                </td>
                <td className="py-3 px-4">
                  <div className="flex items-center gap-2">
                    <span className="text-xl">{AVATARS[u.user_name] ?? "👤"}</span>
                    <span className="text-white font-medium">{u.user_name}</span>
                  </div>
                </td>
                <td className="py-3 px-4 text-center">
                  <span className="text-green-400 font-bold">{u.total_checkins}</span>
                  <span className="text-gray-500">/16</span>
                </td>
                <td className="py-3 px-4 text-center">
                  <span className="text-blue-400 font-bold">{u.total_correct}</span>
                  <span className="text-gray-500">/{u.total_checkins * 5}</span>
                </td>
                <td className="py-3 px-4 text-center">
                  <span className="text-orange-400 font-bold">
                    {u.streak > 0 ? `🔥 ${u.streak}` : "—"}
                  </span>
                </td>
                <td className="py-3 px-4 text-center text-gray-400">
                  {formatLastActivity(u.last_activity)}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Mobile cards */}
      <div className="sm:hidden space-y-3">
        {sorted.map((u, i) => (
          <div
            key={u.user_name}
            className="bg-gray-800 border border-gray-700 rounded-xl p-4"
          >
            <div className="flex items-center gap-3 mb-3">
              <span className="text-2xl">
                {i === 0 ? "🥇" : i === 1 ? "🥈" : "🥉"}
              </span>
              <span className="text-xl">{AVATARS[u.user_name] ?? "👤"}</span>
              <span className="text-white font-bold text-base">{u.user_name}</span>
            </div>
            <div className="grid grid-cols-3 gap-3 text-center">
              <div>
                <div className="text-green-400 font-bold text-xl">{u.total_checkins}<span className="text-gray-500 text-sm">/16</span></div>
                <div className="text-gray-400 text-xs">Check-ins</div>
              </div>
              <div>
                <div className="text-blue-400 font-bold text-xl">{u.total_correct}</div>
                <div className="text-gray-400 text-xs">Acertos</div>
              </div>
              <div>
                <div className="text-orange-400 font-bold text-xl">
                  {u.streak > 0 ? `🔥${u.streak}` : "—"}
                </div>
                <div className="text-gray-400 text-xs">Streak</div>
              </div>
            </div>
            {u.last_activity && (
              <p className="text-gray-500 text-xs text-right mt-2">
                Último: {formatLastActivity(u.last_activity)}
              </p>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
