import { Link } from "@tanstack/react-router";

const EXTRAS = [
  {
    to: "/tasbeh",
    emoji: "📿",
    title: "Rəqəmsal Təsbeh",
    desc: "Zikr saymaq üçün rəqəmsal təsbeh",
    color: "oklch(0.55 0.12 75)",
  },
  {
    to: "/daily-plan",
    emoji: "📅",
    title: "Günlük Plan",
    desc: "Günlük mənəvi tapşırıqlar",
    color: "oklch(0.5 0.12 155)",
  },
  {
    to: "/mood-guidance",
    emoji: "🌙",
    title: "Əhval Rehbərliyi",
    desc: "Hissinizə görə ayə və dua",
    color: "oklch(0.45 0.1 260)",
  },
  {
    to: "/community-dua",
    emoji: "🤲",
    title: "İcma Duası",
    desc: "Anonim dua paylaşın, Amin deyin",
    color: "oklch(0.5 0.1 20)",
  },
  {
    to: "/smart-notification",
    emoji: "✨",
    title: "Mənəvi Mesajlar",
    desc: "Gündəlik ruhlandırıcı sözlər",
    color: "oklch(0.5 0.12 300)",
  },
];

export default function ExtrasPage() {
  return (
    <div
      className="min-h-screen pb-24"
      style={{
        background:
          "linear-gradient(180deg, oklch(var(--islamic-dark)) 0%, oklch(0.12 0.03 155) 100%)",
      }}
    >
      {/* Header */}
      <div className="px-6 pt-6 pb-2 text-center">
        <p
          className="font-amiri text-2xl mb-1"
          style={{ color: "oklch(var(--islamic-gold))" }}
        >
          بسم الله
        </p>
        <h1 className="text-2xl font-bold text-white">Əlavələr</h1>
        <p className="text-white/50 text-sm mt-1">
          Mənəvi həyatınızı zənginləşdirin
        </p>
      </div>

      {/* Grid */}
      <div className="px-4 pt-4 grid grid-cols-2 gap-4">
        {EXTRAS.map(({ to, emoji, title, desc, color }) => (
          <Link
            key={to}
            to={to}
            className="flex flex-col items-center text-center p-5 rounded-2xl transition-all active:scale-95"
            style={{
              background: "oklch(var(--islamic-dark) / 0.6)",
              border: `1.5px solid ${color}40`,
              boxShadow: `0 4px 20px ${color}20`,
            }}
            data-ocid="extras.item"
          >
            <div
              className="w-14 h-14 rounded-2xl flex items-center justify-center text-3xl mb-3"
              style={{
                background: `${color}20`,
                border: `1.5px solid ${color}50`,
              }}
            >
              {emoji}
            </div>
            <p className="font-semibold text-sm text-white leading-tight mb-1">
              {title}
            </p>
            <p className="text-xs text-white/40 leading-snug">{desc}</p>
          </Link>
        ))}
      </div>

      {/* Decorative footer */}
      <div className="text-center mt-8 px-6">
        <p
          className="font-amiri text-lg"
          style={{ color: "oklch(var(--islamic-gold) / 0.4)" }}
        >
          سُبْحَانَ اللَّهِ وَبِحَمْدِهِ
        </p>
      </div>
    </div>
  );
}
