"use client";

import { useRouter } from "next/navigation";

const USERS = [
  { name: "Fernando", emoji: "🧑‍⚕️", color: "from-green-600 to-green-800 hover:from-green-500 hover:to-green-700" },
  { name: "Gabriel", emoji: "👨‍⚕️", color: "from-blue-600 to-blue-800 hover:from-blue-500 hover:to-blue-700" },
  { name: "Diogenes", emoji: "🩺", color: "from-purple-600 to-purple-800 hover:from-purple-500 hover:to-purple-700" },
];

export default function LoginPage() {
  const router = useRouter();

  function selectUser(name: string) {
    localStorage.setItem("currentUser", name);
    router.push("/dashboard");
  }

  return (
    <div className="min-h-screen bg-gray-950 flex flex-col items-center justify-center px-4 py-12">
      <div className="w-full max-w-md">
        <div className="text-center mb-10">
          <div className="text-5xl mb-4">🏥</div>
          <h1 className="text-3xl font-bold text-white mb-2">MedStudy Check-in</h1>
          <p className="text-gray-400 text-base">
            Preparação para provas · 16 dias · 28/04 – 13/05
          </p>
        </div>

        <p className="text-center text-gray-400 text-sm mb-6">Quem está estudando hoje?</p>

        <div className="flex flex-col gap-4">
          {USERS.map((u) => (
            <button
              key={u.name}
              onClick={() => selectUser(u.name)}
              className={`w-full bg-gradient-to-r ${u.color} text-white font-bold text-lg py-5 px-6 rounded-2xl flex items-center gap-4 transition-all duration-200 shadow-lg active:scale-95`}
            >
              <span className="text-3xl">{u.emoji}</span>
              <span>{u.name}</span>
            </button>
          ))}
        </div>

        <p className="text-center text-gray-600 text-xs mt-8">
          Sem senha — apenas selecione seu nome para entrar
        </p>
      </div>
    </div>
  );
}
