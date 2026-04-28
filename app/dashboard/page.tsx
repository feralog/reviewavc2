"use client";

import { useEffect, useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import Header from "@/components/Header";
import DayBlock from "@/components/DayBlock";
import PomodoroTimer from "@/components/PomodoroTimer";
import ScheduleModal from "@/components/ScheduleModal";
import { schedule } from "@/data/schedule";
import { getCurrentDay, isBeforeSchedule, isAfterSchedule, formatDate } from "@/lib/utils";

export default function DashboardPage() {
  const router = useRouter();
  const [userName, setUserName] = useState<string>("");
  const [currentDay, setCurrentDay] = useState<number | null>(null);
  const [alreadyCheckedIn, setAlreadyCheckedIn] = useState(false);
  const [checkedDays, setCheckedDays] = useState<number[]>([]);
  const [showSchedule, setShowSchedule] = useState(false);
  const [loading, setLoading] = useState(true);
  const [todayCheckin, setTodayCheckin] = useState<{ correct_answers: number } | null>(null);

  const loadCheckins = useCallback(async (user: string) => {
    try {
      const res = await fetch(`/api/stats`);
      const data = await res.json();
      const userStats = data.stats?.find((s: { user_name: string }) => s.user_name === user);
      // We'll fetch dates separately
    } catch {}
  }, []);

  useEffect(() => {
    const user = localStorage.getItem("currentUser");
    if (!user) { router.push("/"); return; }
    setUserName(user);

    const day = getCurrentDay();
    setCurrentDay(day);

    if (day) {
      const today = new Date().toISOString().split("T")[0];
      fetch(`/api/checkin?user=${encodeURIComponent(user)}&date=${today}`)
        .then((r) => r.json())
        .then((data) => {
          if (data.checkin) {
            setAlreadyCheckedIn(true);
            setTodayCheckin(data.checkin);
          }
        })
        .catch(() => {})
        .finally(() => setLoading(false));
    } else {
      setLoading(false);
    }
  }, [router]);

  const dayData = currentDay ? schedule.find((d) => d.day === currentDay) : null;
  const before = isBeforeSchedule();
  const after = isAfterSchedule();

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-950 flex items-center justify-center">
        <div className="text-gray-400 text-lg animate-pulse">Carregando...</div>
      </div>
    );
  }

  return (
    <>
      <Header userName={userName} currentDay={currentDay} />

      <main className="max-w-4xl mx-auto px-4 py-6 pb-32">
        {/* Fora do período */}
        {(before || after) && (
          <div className="text-center py-20">
            <div className="text-6xl mb-4">{before ? "📅" : "🎓"}</div>
            <h2 className="text-2xl font-bold text-white mb-3">
              {before
                ? "O período de estudos ainda não começou"
                : "Período de estudos encerrado!"}
            </h2>
            <p className="text-gray-400">
              {before
                ? "Começa em 28/04/2026. Até lá, descanse e se prepare!"
                : "Boa sorte nas provas, Fernando, Gabriel e Diogenes! 💪"}
            </p>
          </div>
        )}

        {/* Dia normal */}
        {!before && !after && dayData && (
          <>
            {/* Header do dia */}
            <div className="mb-6">
              <div className="flex flex-wrap items-center gap-3 mb-4">
                <button
                  onClick={() => setShowSchedule(true)}
                  className="flex items-center gap-2 bg-gray-800 hover:bg-gray-700 border border-gray-600 text-white font-medium px-4 py-2.5 rounded-xl transition-colors text-sm"
                >
                  📅 Ver cronograma completo
                </button>
                {dayData.isExamDay && (
                  <span className="bg-yellow-900 border border-yellow-600 text-yellow-300 px-3 py-1.5 rounded-xl text-sm font-bold">
                    {dayData.isExamDay}
                  </span>
                )}
              </div>

              <h2 className="text-2xl font-bold text-white">{dayData.label}</h2>
              <p className="text-gray-400 text-sm mt-1">
                {formatDate(dayData.date)} · Dia {dayData.day} de 16
              </p>
            </div>

            {/* Check-in já feito */}
            {alreadyCheckedIn && todayCheckin && (
              <div className="bg-green-950 border border-green-700 rounded-2xl p-5 mb-6">
                <div className="flex items-center gap-3">
                  <span className="text-3xl">✅</span>
                  <div>
                    <h3 className="text-green-400 font-bold text-lg">Check-in do dia concluído!</h3>
                    <p className="text-gray-300 text-sm">
                      Você acertou {todayCheckin.correct_answers}/5 questões hoje.{" "}
                      <button
                        onClick={() => router.push("/stats")}
                        className="text-green-400 underline hover:text-green-300"
                      >
                        Ver ranking
                      </button>
                    </p>
                  </div>
                </div>
              </div>
            )}

            {/* Conteúdo do dia */}
            <div className="grid gap-4 sm:grid-cols-2 mb-6">
              {dayData.blocks.map((block, i) => (
                <DayBlock
                  key={i}
                  subject={block.subject}
                  topics={block.topics}
                  bullets={block.bullets}
                />
              ))}
            </div>

            {/* Pomodoro */}
            <div className="max-w-sm mb-6">
              <PomodoroTimer />
            </div>

            {/* Botão de finalizar */}
            {!alreadyCheckedIn && (
              <div className="fixed bottom-0 left-0 right-0 p-4 bg-gray-950/95 backdrop-blur border-t border-gray-800 sm:relative sm:bg-transparent sm:border-0 sm:backdrop-blur-none sm:p-0">
                <div className="max-w-4xl mx-auto sm:mt-4">
                  <button
                    onClick={() => router.push("/quiz")}
                    className="w-full sm:w-auto bg-green-600 hover:bg-green-500 text-white font-bold text-base py-4 px-8 rounded-2xl transition-colors shadow-lg active:scale-95"
                  >
                    ✅ Finalizar estudo do dia
                  </button>
                </div>
              </div>
            )}
          </>
        )}
      </main>

      <ScheduleModal
        open={showSchedule}
        onClose={() => setShowSchedule(false)}
        currentDay={currentDay}
        checkedDays={checkedDays}
      />
    </>
  );
}
