import { Checkbox } from "@/components/ui/checkbox";
import { RefreshCw } from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import { useState } from "react";

const AYAHS = [
  {
    ar: "وَمَن يَتَّقِ اللَّهَ يَجْعَل لَّهُ مَخْرَجًا",
    tr: "Kim Allahdan qorxarsa, Allah ona çıxış yolu açar. (Talaq 2)",
  },
  {
    ar: "إِنَّ مَعَ الْعُسْرِ يُسْرًا",
    tr: "Həqiqətən, çətinliyin yanında asanlıq var. (İnşirah 6)",
  },
  {
    ar: "وَلَا تَيْأَسُوا مِن رَّوْحِ اللَّهِ",
    tr: "Allahın rəhmətindən ümidini kəsmə. (Yusif 87)",
  },
  {
    ar: "فَاذْكُرُونِي أَذْكُرْكُمْ",
    tr: "Məni xatırlayın, Mən də sizi xatırlayım. (Bəqərə 152)",
  },
  {
    ar: "اللَّهُ نُورُ السَّمَاوَاتِ وَالْأَرْضِ",
    tr: "Allah göylərin və yerin nurudur. (Nur 35)",
  },
];

const DUAS = [
  {
    ar: "رَبِّ زِدْنِي عِلْمًا",
    tr: "Rəbbim, elmimi artır. (Taha 114)",
  },
  {
    ar: "رَبَّنَا آتِنَا فِي الدُّنْيَا حَسَنَةً",
    tr: "Rəbbimiz, bizə dünyada da, axirətdə də gözəllik ver. (Bəqərə 201)",
  },
  {
    ar: "رَبِّ اغْفِرْ لِي وَلِوَالِدَيَّ",
    tr: "Rəbbim, mənə və valideynlərimə bağışla. (İbrahim 41)",
  },
];

function hashDate(str: string): number {
  let h = 0;
  for (let i = 0; i < str.length; i++) {
    h = (Math.imul(31, h) + str.charCodeAt(i)) | 0;
  }
  return Math.abs(h);
}

function getPlanKey() {
  return `daily-plan-${new Date().toDateString()}`;
}

export default function DailyPlanPage() {
  const seed = hashDate(new Date().toDateString());
  const ayah = AYAHS[seed % AYAHS.length];
  const dua = DUAS[seed % DUAS.length];

  const loadChecked = (): [boolean, boolean, boolean] => {
    try {
      const stored = localStorage.getItem(getPlanKey());
      if (stored) {
        const parsed = JSON.parse(stored);
        return [!!parsed[0], !!parsed[1], !!parsed[2]];
      }
    } catch {
      // ignore
    }
    return [false, false, false];
  };

  const [[c0, c1, c2], setChecked] =
    useState<[boolean, boolean, boolean]>(loadChecked);

  const toggle = (idx: number) => {
    const next: [boolean, boolean, boolean] = [c0, c1, c2];
    next[idx] = !next[idx];
    setChecked(next);
    localStorage.setItem(getPlanKey(), JSON.stringify(next));
  };

  const allDone = c0 && c1 && c2;

  const reset = () => {
    setChecked([false, false, false]);
    localStorage.setItem(getPlanKey(), JSON.stringify([false, false, false]));
  };

  const TASKS = [
    {
      id: "ayah",
      label: "Günün Ayəsi",
      ar: ayah.ar,
      tr: ayah.tr,
      checked: c0,
      idx: 0,
    },
    {
      id: "dua",
      label: "Günün Duası",
      ar: dua.ar,
      tr: dua.tr,
      checked: c1,
      idx: 1,
    },
    {
      id: "zikr",
      label: "33 Zikr — Subhanallah",
      ar: "سُبْحَانَ اللَّهِ",
      tr: "Subhanallah — 33 dəfə",
      checked: c2,
      idx: 2,
    },
  ];

  return (
    <div
      className="min-h-screen pb-28"
      style={{
        background:
          "linear-gradient(180deg, oklch(var(--islamic-dark)) 0%, oklch(0.11 0.03 155) 100%)",
      }}
    >
      <div className="px-5 pt-6 pb-2 text-center">
        <p
          className="font-amiri text-xl mb-1"
          style={{ color: "oklch(var(--islamic-gold))" }}
        >
          بِسْمِ اللَّهِ
        </p>
        <h1 className="text-xl font-bold text-white">Günlük Mənəvi Plan</h1>
        <p className="text-white/40 text-xs mt-1">
          {new Date().toDateString()}
        </p>
      </div>

      <div className="px-4 mt-4 flex flex-col gap-3">
        {TASKS.map(({ id, label, ar, tr, checked, idx }) => (
          <motion.div
            key={id}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: idx * 0.1 }}
            className="rounded-2xl p-4"
            style={{
              background: checked
                ? "oklch(0.45 0.12 145 / 0.15)"
                : "oklch(var(--islamic-dark) / 0.7)",
              border: `1.5px solid ${checked ? "oklch(0.65 0.18 145 / 0.5)" : "oklch(var(--islamic-gold) / 0.15)"}`,
              transition: "background 0.3s, border 0.3s",
            }}
            data-ocid={`daily.item.${idx + 1}`}
          >
            <div className="flex items-start gap-3">
              <Checkbox
                checked={checked}
                onCheckedChange={() => toggle(idx)}
                className="mt-1 border-white/30"
                data-ocid={`daily.checkbox.${idx + 1}`}
              />
              <div className="flex-1">
                <p
                  className="text-sm font-semibold mb-1"
                  style={{
                    color: checked
                      ? "oklch(0.65 0.18 145)"
                      : "oklch(var(--islamic-gold))",
                  }}
                >
                  {label}
                </p>
                <p
                  className="font-amiri text-base text-right leading-relaxed mb-1"
                  style={{ color: "rgba(255,255,255,0.85)" }}
                >
                  {ar}
                </p>
                <p className="text-xs text-white/40">{tr}</p>
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      <AnimatePresence>
        {allDone && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0 }}
            className="mx-4 mt-5 p-4 rounded-2xl text-center"
            style={{
              background: "oklch(0.45 0.15 145 / 0.2)",
              border: "1.5px solid oklch(0.65 0.2 145 / 0.5)",
            }}
            data-ocid="daily.success_state"
          >
            <p className="text-green-400 font-semibold text-base">
              MəşAllah! 🌟
            </p>
            <p className="text-white/60 text-sm mt-1">Gününüz mübarək olsun!</p>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="flex justify-center mt-5">
        <button
          type="button"
          onClick={reset}
          className="flex items-center gap-2 px-5 py-2 rounded-full text-sm text-white/40 hover:text-white/70 transition-all"
          style={{ border: "1px solid oklch(1 0 0 / 0.1)" }}
          data-ocid="daily.secondary_button"
        >
          <RefreshCw size={13} />
          Sıfırla
        </button>
      </div>
    </div>
  );
}
