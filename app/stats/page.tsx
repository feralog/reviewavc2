"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import StatsTable from "@/components/StatsTable";
import Link from "next/link";

interface UserStat {
  user_name: string;
  total_checkins: number;
  total_correct: number;
  last_activity: string | null;
  streak: number;
}

export default function StatsPage() {
  const router = useRouter();
  const [stats, setStats] = useState<UserStat[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    fetch("/api/stats")
      .then((r) => r.json())
      .then((data) => {
        if (data.error) throw new Error(data.error);
        setStats(data.stats);
      })
      .catch((e) => setError(String(e)))
      .finally(() => setLoading(false));
  }, []);

  function logout() {
    localStorage.removeItem("currentUser");
    router.push("/");
  }

  return (
    <div className="min-h-screen bg-gray-950">
      <header className="sticky top-0 z-40 bg-gray-900 border-b border-gray-700 px-4 py-3">
        <div className="max-w-4xl mx-auto flex items-center justify-between">
          <Link href="/dashboard" className="text-green-400 font-bold text-lg">
            ← MedStudy
          </Link>
          <button
            onClick={logout}
            className="text-gray-400 hover:text-red-400 text-sm px-3 py-2 rounded-lg hover:bg-gray-800 transition-colors"
          >
            Sair
          </button>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-white mb-1">📊 Ranking & Progresso</h1>
          <p className="text-gray-400 text-sm">16 dias · 28/04 – 13/05/2025</p>
        </div>

        {loading && (
          <div className="text-center py-20">
            <div className="text-gray-400 animate-pulse">Carregando estatísticas...</div>
          </div>
        )}

        {error && (
          <div className="bg-red-950 border border-red-800 text-red-300 rounded-xl p-4 text-sm">
            Erro ao carregar estatísticas: {error}
          </div>
        )}

        {!loading && !error && (
          <>
            {/* Summary cards */}
            <div className="grid grid-cols-3 gap-3 mb-8">
              {[...stats]
                .sort((a, b) => b.total_checkins - a.total_checkins)
                .slice(0, 1)
                .map((leader) => (
                  <div key="leader" className="col-span-3 sm:col-span-1 bg-yellow-950 border border-yellow-700 rounded-xl p-4 text-center">
                    <div className="text-2xl mb-1">🏆</div>
                    <div className="text-yellow-300 font-bold">{leader.user_name}</div>
                    <div className="text-gray-400 text-xs">Líder atual</div>
                  </div>
                ))}
              <div className="bg-gray-800 border border-gray-700 rounded-xl p-4 text-center">
                <div className="text-green-400 font-bold text-2xl">
                  {stats.reduce((s, u) => s + u.total_checkins, 0)}
                </div>
                <div className="text-gray-400 text-xs mt-1">Check-ins totais</div>
              </div>
              <div className="bg-gray-800 border border-gray-700 rounded-xl p-4 text-center">
                <div className="text-blue-400 font-bold text-2xl">
                  {stats.reduce((s, u) => s + u.total_correct, 0)}
                </div>
                <div className="text-gray-400 text-xs mt-1">Acertos totais</div>
              </div>
            </div>

            <div className="bg-gray-900 border border-gray-700 rounded-2xl overflow-hidden">
              <div className="px-5 py-4 border-b border-gray-700">
                <h2 className="text-white font-bold">Placar dos participantes</h2>
              </div>
              <div className="p-4">
                <StatsTable stats={stats} />
              </div>
            </div>

            {/* Progresso visual por usuário */}
            <div className="mt-6 space-y-3">
              {[...stats]
                .sort((a, b) => b.total_checkins - a.total_checkins)
                .map((u) => (
                  <div key={u.user_name} className="bg-gray-800 border border-gray-700 rounded-xl p-4">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-white font-medium text-sm">{u.user_name}</span>
                      <span className="text-gray-400 text-xs">{u.total_checkins}/16 dias</span>
                    </div>
                    <div className="h-3 bg-gray-700 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-green-500 rounded-full transition-all duration-700"
                        style={{ width: `${(u.total_checkins / 16) * 100}%` }}
                      />
                    </div>
                    <div className="flex justify-between mt-1">
                      <span className="text-gray-500 text-xs">
                        {Math.round((u.total_checkins / 16) * 100)}% concluído
                      </span>
                      {u.streak > 0 && (
                        <span className="text-orange-400 text-xs">🔥 {u.streak} dias seguidos</span>
                      )}
                    </div>
                  </div>
                ))}
            </div>
          </>
        )}
      </main>
    </div>
  );
}
