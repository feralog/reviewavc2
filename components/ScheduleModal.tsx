"use client";

import { useEffect } from "react";
import { schedule } from "@/data/schedule";
import { formatDate } from "@/lib/utils";

interface ScheduleModalProps {
  open: boolean;
  onClose: () => void;
  currentDay: number | null;
  checkedDays: number[];
}

export default function ScheduleModal({
  open,
  onClose,
  currentDay,
  checkedDays,
}: ScheduleModalProps) {
  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape") onClose();
    }
    if (open) document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [open, onClose]);

  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [open]);

  if (!open) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-start justify-center bg-black/70 p-4 pt-8 overflow-y-auto"
      onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}
    >
      <div className="bg-gray-900 border border-gray-700 rounded-2xl w-full max-w-2xl shadow-2xl">
        <div className="sticky top-0 bg-gray-900 border-b border-gray-700 px-5 py-4 flex items-center justify-between rounded-t-2xl">
          <h2 className="text-white font-bold text-lg">📅 Cronograma Completo</h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-white text-2xl leading-none px-2 py-1 rounded-lg hover:bg-gray-800 transition-colors"
            aria-label="Fechar"
          >
            ×
          </button>
        </div>

        <div className="p-4 space-y-2">
          {schedule.map((day) => {
            const isToday = day.day === currentDay;
            const isDone = checkedDays.includes(day.day);
            const isPast = currentDay != null && day.day < currentDay;
            const isFuture = currentDay != null && day.day > currentDay;
            const isMissed = isPast && !isDone;

            let border = "border-gray-700";
            let bg = "bg-gray-800";
            if (isToday) { border = "border-green-500"; bg = "bg-green-950"; }
            else if (day.isExamDay) { border = "border-yellow-500"; bg = "bg-yellow-950"; }

            return (
              <div
                key={day.day}
                className={`border ${border} ${bg} rounded-xl p-4 transition-all`}
              >
                <div className="flex items-start justify-between gap-2">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span
                        className={`font-bold text-sm ${
                          isToday
                            ? "text-green-400"
                            : day.isExamDay
                            ? "text-yellow-400"
                            : "text-gray-200"
                        }`}
                      >
                        {day.label}
                      </span>
                      {isToday && (
                        <span className="text-xs bg-green-600 text-white px-2 py-0.5 rounded-full">
                          Hoje
                        </span>
                      )}
                      {day.isExamDay && (
                        <span className="text-xs bg-yellow-600 text-white px-2 py-0.5 rounded-full">
                          {day.isExamDay}
                        </span>
                      )}
                    </div>
                    <div className="mt-1 space-y-0.5">
                      {day.blocks.map((block, i) => (
                        <p key={i} className="text-xs text-gray-400">
                          {block.subject}: {block.topics.join(", ")}
                        </p>
                      ))}
                    </div>
                  </div>
                  <div className="text-xl flex-shrink-0">
                    {isDone ? "✅" : isMissed ? "❌" : isFuture || isToday ? "⬜" : ""}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
