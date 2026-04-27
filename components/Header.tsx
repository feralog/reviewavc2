"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";

interface HeaderProps {
  userName: string;
  currentDay?: number | null;
}

export default function Header({ userName, currentDay }: HeaderProps) {
  const router = useRouter();

  function logout() {
    localStorage.removeItem("currentUser");
    router.push("/");
  }

  return (
    <header className="sticky top-0 z-40 bg-gray-900 border-b border-gray-700 px-4 py-3">
      <div className="max-w-4xl mx-auto flex items-center justify-between gap-3">
        <div className="flex items-center gap-3 min-w-0">
          <span className="text-green-400 font-bold text-lg whitespace-nowrap">
            MedStudy
          </span>
          <span className="text-gray-400 text-sm hidden sm:block truncate">
            Olá, <span className="text-white font-medium">{userName}</span>
          </span>
        </div>

        {currentDay != null && (
          <div className="flex-1 max-w-xs hidden sm:block">
            <div className="flex items-center gap-2">
              <span className="text-gray-400 text-xs whitespace-nowrap">
                Dia {currentDay}/16
              </span>
              <div className="flex-1 bg-gray-700 rounded-full h-2">
                <div
                  className="bg-green-500 h-2 rounded-full transition-all"
                  style={{ width: `${(currentDay / 16) * 100}%` }}
                />
              </div>
            </div>
          </div>
        )}

        <nav className="flex items-center gap-2 sm:gap-3">
          <Link
            href="/stats"
            className="text-gray-300 hover:text-white text-sm px-3 py-2 rounded-lg hover:bg-gray-800 transition-colors"
          >
            📊 Stats
          </Link>
          <button
            onClick={logout}
            className="text-gray-400 hover:text-red-400 text-sm px-3 py-2 rounded-lg hover:bg-gray-800 transition-colors"
            aria-label="Sair"
          >
            Sair
          </button>
        </nav>
      </div>

      {currentDay != null && (
        <div className="max-w-4xl mx-auto mt-2 sm:hidden">
          <div className="flex items-center gap-2">
            <span className="text-gray-400 text-xs whitespace-nowrap">
              Dia {currentDay}/16
            </span>
            <div className="flex-1 bg-gray-700 rounded-full h-1.5">
              <div
                className="bg-green-500 h-1.5 rounded-full transition-all"
                style={{ width: `${(currentDay / 16) * 100}%` }}
              />
            </div>
          </div>
        </div>
      )}
    </header>
  );
}
