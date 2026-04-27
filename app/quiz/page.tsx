"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { questionsByDay, type Question } from "@/data/questions";
import { getCurrentDay } from "@/lib/utils";
import Header from "@/components/Header";

type AnswerState = "unanswered" | "correct" | "wrong";

interface QuestionResult {
  answered: boolean;
  selectedLabel: string | null;
  state: AnswerState;
}

function shuffle<T>(arr: T[]): T[] {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

export default function QuizPage() {
  const router = useRouter();
  const [userName, setUserName] = useState("");
  const [currentDay, setCurrentDay] = useState<number | null>(null);
  const [questions, setQuestions] = useState<Question[]>([]);
  const [results, setResults] = useState<QuestionResult[]>([]);
  const [submitting, setSubmitting] = useState(false);
  const [done, setDone] = useState(false);

  useEffect(() => {
    const user = localStorage.getItem("currentUser");
    if (!user) { router.push("/"); return; }
    setUserName(user);

    const day = getCurrentDay();
    setCurrentDay(day);

    const qs = day ? (questionsByDay[day] ?? []) : [];
    const shuffled = shuffle(qs).map((q) => {
      const correctText = q.options.find((o) => o.label === q.correctLabel)!.text;
      const shuffledOpts = shuffle(q.options);
      const newCorrectLabel = shuffledOpts.find((o) => o.text === correctText)!.label;
      return { ...q, options: shuffledOpts, correctLabel: newCorrectLabel };
    });

    setQuestions(shuffled);
    setResults(shuffled.map(() => ({ answered: false, selectedLabel: null, state: "unanswered" as AnswerState })));
  }, [router]);

  function answer(qIndex: number, label: string) {
    if (results[qIndex].answered) return;
    const isCorrect = label === questions[qIndex].correctLabel;
    setResults((prev) =>
      prev.map((r, i) =>
        i === qIndex
          ? { answered: true, selectedLabel: label, state: isCorrect ? "correct" : "wrong" }
          : r
      )
    );
  }

  const allAnswered = results.length > 0 && results.every((r) => r.answered);
  const correctCount = results.filter((r) => r.state === "correct").length;

  async function confirmCheckin() {
    setSubmitting(true);
    try {
      const today = new Date().toISOString().split("T")[0];
      await fetch("/api/checkin", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          user_name: userName,
          check_date: today,
          correct_answers: correctCount,
          total_questions: questions.length,
        }),
      });
      setDone(true);
    } catch {
      setSubmitting(false);
    }
  }

  if (done) {
    return (
      <div className="min-h-screen bg-gray-950 flex flex-col items-center justify-center px-4 text-center">
        <div className="text-6xl mb-4">🎉</div>
        <h2 className="text-2xl font-bold text-white mb-2">Check-in confirmado!</h2>
        <p className="text-gray-400 mb-2">
          Você acertou <span className="text-green-400 font-bold">{correctCount}</span> de{" "}
          <span className="font-bold">{questions.length}</span> questões.
        </p>
        <div className="flex gap-3 mt-6 flex-wrap justify-center">
          <button
            onClick={() => router.push("/dashboard")}
            className="bg-gray-800 hover:bg-gray-700 text-white px-6 py-3 rounded-xl font-medium transition-colors"
          >
            Voltar ao Dashboard
          </button>
          <button
            onClick={() => router.push("/stats")}
            className="bg-green-600 hover:bg-green-500 text-white px-6 py-3 rounded-xl font-bold transition-colors"
          >
            📊 Ver Ranking
          </button>
        </div>
      </div>
    );
  }

  if (!currentDay || questions.length === 0) {
    return (
      <div className="min-h-screen bg-gray-950 flex items-center justify-center">
        <p className="text-gray-400">Nenhuma questão disponível para hoje.</p>
      </div>
    );
  }

  return (
    <>
      <Header userName={userName} currentDay={currentDay} />

      <main className="max-w-3xl mx-auto px-4 py-6 pb-32">
        <div className="mb-6">
          <h2 className="text-xl font-bold text-white">Quiz do Dia {currentDay}</h2>
          <p className="text-gray-400 text-sm mt-1">
            Responda todas as questões para confirmar seu check-in.
          </p>
          <div className="flex gap-1 mt-3">
            {results.map((r, i) => (
              <div
                key={i}
                className={`h-2 flex-1 rounded-full transition-colors ${
                  r.state === "correct"
                    ? "bg-green-500"
                    : r.state === "wrong"
                    ? "bg-red-500"
                    : "bg-gray-700"
                }`}
              />
            ))}
          </div>
          <p className="text-gray-500 text-xs mt-1">
            {results.filter((r) => r.answered).length}/{questions.length} respondidas
          </p>
        </div>

        <div className="space-y-6">
          {questions.map((q, qi) => {
            const result = results[qi];
            return (
              <div
                key={q.id}
                className="bg-gray-800 border border-gray-700 rounded-2xl p-5"
              >
                <p className="text-gray-300 text-sm font-medium mb-1">Questão {qi + 1}</p>
                <p className="text-white font-medium leading-relaxed mb-4">{q.question}</p>

                <div className="space-y-2">
                  {q.options.map((opt) => {
                    const isSelected = result.selectedLabel === opt.label;
                    const isCorrect = opt.label === q.correctLabel;
                    let cls = "bg-gray-700 border-gray-600 text-gray-300 hover:bg-gray-600 hover:border-gray-500";
                    if (result.answered) {
                      if (isCorrect) cls = "bg-green-900 border-green-600 text-green-200";
                      else if (isSelected) cls = "bg-red-900 border-red-600 text-red-200";
                      else cls = "bg-gray-700 border-gray-700 text-gray-500";
                    }

                    return (
                      <button
                        key={opt.label}
                        onClick={() => answer(qi, opt.label)}
                        disabled={result.answered}
                        className={`w-full text-left border rounded-xl px-4 py-3 text-sm transition-all leading-relaxed ${cls} ${
                          !result.answered ? "cursor-pointer active:scale-[0.99]" : "cursor-default"
                        }`}
                      >
                        <span className="font-bold mr-2">{opt.label}.</span>
                        {opt.text}
                      </button>
                    );
                  })}
                </div>

                {result.answered && (
                  <div
                    className={`mt-4 p-3 rounded-xl text-sm ${
                      result.state === "correct"
                        ? "bg-green-950 border border-green-800 text-green-300"
                        : "bg-red-950 border border-red-800 text-red-300"
                    }`}
                  >
                    <span className="font-bold mr-1">
                      {result.state === "correct" ? "✅ Correto!" : "❌ Incorreto."}
                    </span>
                    {q.explanation}
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {allAnswered && (
          <div className="fixed bottom-0 left-0 right-0 p-4 bg-gray-950/95 backdrop-blur border-t border-gray-800 sm:relative sm:bg-transparent sm:border-0 sm:backdrop-blur-none sm:p-0 sm:mt-6">
            <div className="max-w-3xl mx-auto">
              <div className="bg-gray-800 border border-gray-700 rounded-2xl p-4 sm:p-5">
                <p className="text-gray-300 text-sm mb-3 text-center">
                  Resultado: <span className="text-green-400 font-bold">{correctCount}</span>/{questions.length} acertos
                  {" "}({Math.round((correctCount / questions.length) * 100)}%)
                </p>
                <button
                  onClick={confirmCheckin}
                  disabled={submitting}
                  className="w-full bg-green-600 hover:bg-green-500 disabled:opacity-60 text-white font-bold py-4 rounded-xl text-base transition-colors"
                >
                  {submitting ? "Salvando..." : "✅ Confirmar check-in do dia"}
                </button>
              </div>
            </div>
          </div>
        )}
      </main>
    </>
  );
}
