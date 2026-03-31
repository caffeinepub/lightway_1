import { ArrowLeft } from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import { useState } from "react";

type MoodKey = "stress" | "fear" | "confusion";

const MOODS: { key: MoodKey; emoji: string; label: string }[] = [
  { key: "stress", emoji: "😟", label: "Narahatlıq" },
  { key: "fear", emoji: "😨", label: "Qorxu" },
  { key: "confusion", emoji: "😕", label: "Çaşqınlıq" },
];

const GUIDANCE: Record<
  MoodKey,
  {
    ayah: { ar: string; tr: string };
    dua: { ar: string; tr: string };
    zikr: string;
    color: string;
  }
> = {
  stress: {
    ayah: {
      ar: "أَلَا بِذِكْرِ اللَّهِ تَطْمَئِنُّ الْقُلُوبُ",
      tr: "Bilin ki, qəlblər yalnız Allahı zikr etməklə rahatlıq tapar. (Rəd 28)",
    },
    dua: {
      ar: "اللَّهُمَّ إِنِّي أَعُوذُ بِكَ مِنَ الْهَمِّ وَالْحَزَنِ",
      tr: "Allahım, narahatlıq və kədərdən sənə sığınıram.",
    },
    zikr: "Subhanallah (33 dəfə)",
    color: "75",
  },
  fear: {
    ayah: {
      ar: "حَسْبُنَا اللَّهُ وَنِعْمَ الْوَكِيلُ",
      tr: "Allah bizə yetər. O, nə gözəl vəkildir. (Ali İmran 173)",
    },
    dua: {
      ar: "بِسْمِ اللَّهِ الَّذِي لَا يَضُرُّ مَعَ اسْمِهِ شَيْءٌ",
      tr: "Adı ilə heç bir şeyin zərər verə bilmədiyi Allahın adıyla.",
    },
    zikr: "Hasbiyallah (100 dəfə)",
    color: "210",
  },
  confusion: {
    ayah: {
      ar: "وَشَاوِرْهُمْ فِي الْأَمْرِ",
      tr: "İşlərini onlarla məşvərət et. (Ali İmran 159)",
    },
    dua: {
      ar: "رَبِّ اشْرَحْ لِي صَدْرِي وَيَسِّرْ لِي أَمْرِي",
      tr: "Rəbbim, köksümü genişləndir, işimi asanlaşdır. (Taha 25-26)",
    },
    zikr: "Estağfirullah (70 dəfə)",
    color: "155",
  },
};

export default function MoodGuidancePage() {
  const [selected, setSelected] = useState<MoodKey | null>(null);

  const guidance = selected ? GUIDANCE[selected] : null;

  return (
    <div
      className="min-h-screen pb-28 px-4"
      style={{
        background:
          "linear-gradient(180deg, oklch(0.14 0.03 260) 0%, oklch(0.10 0.02 155) 100%)",
      }}
    >
      <div className="pt-6 pb-4 text-center">
        <h1 className="text-xl font-bold text-white">
          Bu gün necə hiss edirsən?
        </h1>
        <p className="text-white/40 text-sm mt-1">
          Ruhunuza uyğun rehbərlik alın
        </p>
      </div>

      <AnimatePresence mode="wait">
        {!selected ? (
          <motion.div
            key="mood-select"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="flex flex-col gap-4 mt-4"
          >
            {MOODS.map(({ key, emoji, label }) => (
              <motion.button
                key={key}
                type="button"
                onClick={() => setSelected(key)}
                whileTap={{ scale: 0.97 }}
                className="flex items-center gap-4 p-5 rounded-2xl text-left transition-all"
                style={{
                  background: "oklch(0.16 0.04 260 / 0.8)",
                  border: "1.5px solid oklch(1 0 0 / 0.08)",
                }}
                data-ocid={`mood.${key}.button`}
              >
                <span className="text-4xl">{emoji}</span>
                <div>
                  <p className="text-white font-semibold">{label}</p>
                  <p className="text-white/40 text-sm">
                    {key === "stress" && "Narahatlıq hiss edirsiniz"}
                    {key === "fear" && "Qorxu içindəsiniz"}
                    {key === "confusion" && "Çaşıb qalmısınız"}
                  </p>
                </div>
              </motion.button>
            ))}
          </motion.div>
        ) : (
          <motion.div
            key="guidance"
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            className="mt-2"
          >
            <button
              type="button"
              onClick={() => setSelected(null)}
              className="flex items-center gap-1 text-white/50 text-sm mb-4 hover:text-white/80 transition-colors"
              data-ocid="mood.secondary_button"
            >
              <ArrowLeft size={14} />
              Geri
            </button>

            <div className="flex items-center gap-3 mb-5">
              <span className="text-4xl">
                {MOODS.find((m) => m.key === selected)?.emoji}
              </span>
              <div>
                <p className="text-white font-semibold">
                  {MOODS.find((m) => m.key === selected)?.label}
                </p>
                <p className="text-white/40 text-xs">üçün rehbərlik</p>
              </div>
            </div>

            {guidance && (
              <div className="flex flex-col gap-4">
                {/* Ayah */}
                <div
                  className="p-4 rounded-2xl"
                  style={{
                    background: `oklch(0.45 0.1 ${guidance.color} / 0.12)`,
                    border: `1.5px solid oklch(0.55 0.12 ${guidance.color} / 0.3)`,
                  }}
                  data-ocid="mood.card"
                >
                  <p
                    className="text-xs font-semibold mb-2 uppercase tracking-wider"
                    style={{ color: `oklch(0.65 0.12 ${guidance.color})` }}
                  >
                    📖 Quran Ayəsi
                  </p>
                  <p className="font-amiri text-lg text-right leading-relaxed text-white mb-2">
                    {guidance.ayah.ar}
                  </p>
                  <p className="text-white/55 text-sm">{guidance.ayah.tr}</p>
                </div>

                {/* Dua */}
                <div
                  className="p-4 rounded-2xl"
                  style={{
                    background: `oklch(0.40 0.08 ${guidance.color} / 0.12)`,
                    border: `1.5px solid oklch(0.50 0.10 ${guidance.color} / 0.3)`,
                  }}
                  data-ocid="mood.card"
                >
                  <p
                    className="text-xs font-semibold mb-2 uppercase tracking-wider"
                    style={{ color: `oklch(0.60 0.10 ${guidance.color})` }}
                  >
                    🤲 Dua
                  </p>
                  <p className="font-amiri text-lg text-right leading-relaxed text-white mb-2">
                    {guidance.dua.ar}
                  </p>
                  <p className="text-white/55 text-sm">{guidance.dua.tr}</p>
                </div>

                {/* Zikr */}
                <div
                  className="p-4 rounded-2xl text-center"
                  style={{
                    background: "oklch(var(--islamic-gold) / 0.08)",
                    border: "1.5px solid oklch(var(--islamic-gold) / 0.25)",
                  }}
                  data-ocid="mood.card"
                >
                  <p className="text-xs font-semibold mb-1 uppercase tracking-wider text-white/40">
                    📿 Tövsiyə edilən Zikr
                  </p>
                  <p
                    className="font-semibold"
                    style={{ color: "oklch(var(--islamic-gold))" }}
                  >
                    {guidance.zikr}
                  </p>
                </div>
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
