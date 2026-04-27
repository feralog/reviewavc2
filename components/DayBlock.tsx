interface DayBlockProps {
  subject: string;
  topics: string[];
  bullets: string[];
}

export default function DayBlock({ subject, topics, bullets }: DayBlockProps) {
  return (
    <div className="bg-gray-800 border border-gray-700 rounded-xl p-5">
      <h3 className="text-lg font-bold text-white mb-1">{subject}</h3>
      <p className="text-green-400 text-sm mb-4 font-medium">
        {topics.join(" + ")}
      </p>
      <ul className="space-y-2">
        {bullets.map((b, i) => (
          <li key={i} className="flex gap-2 text-sm text-gray-300 leading-relaxed">
            <span className="text-green-500 mt-0.5 flex-shrink-0">▸</span>
            <span>{b}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}
