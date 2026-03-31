import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { AnimatePresence, motion } from "motion/react";
import { useEffect, useState } from "react";

interface Dua {
  id: string;
  text: string;
  aminCount: number;
  createdAt: number;
}

const STORAGE_KEY = "community-duas";

function loadDuas(): Dua[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

function saveDuas(duas: Dua[]) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(duas));
}

export default function CommunityDuaPage() {
  const [duas, setDuas] = useState<Dua[]>(() =>
    loadDuas().sort((a, b) => b.createdAt - a.createdAt),
  );
  const [text, setText] = useState("");
  const [submitted, setSubmitted] = useState(false);

  useEffect(() => {
    saveDuas(duas);
  }, [duas]);

  const handleSubmit = () => {
    const trimmed = text.trim();
    if (!trimmed || trimmed.length > 300) return;
    const newDua: Dua = {
      id: Date.now().toString(),
      text: trimmed,
      aminCount: 0,
      createdAt: Date.now(),
    };
    setDuas((prev) => [newDua, ...prev]);
    setText("");
    setSubmitted(true);
    setTimeout(() => setSubmitted(false), 3000);
  };

  const handleAmin = (id: string) => {
    setDuas((prev) =>
      prev.map((d) => (d.id === id ? { ...d, aminCount: d.aminCount + 1 } : d)),
    );
  };

  return (
    <div
      className="min-h-screen pb-28"
      style={{
        background:
          "linear-gradient(180deg, oklch(var(--islamic-dark)) 0%, oklch(0.10 0.02 20) 100%)",
      }}
    >
      <div className="px-5 pt-6 pb-2 text-center">
        <p
          className="font-amiri text-2xl mb-1"
          style={{ color: "oklch(var(--islamic-gold))" }}
        >
          🤲
        </p>
        <h1 className="text-xl font-bold text-white">İcma Duası</h1>
        <p className="text-white/40 text-sm mt-1">Anonim dua paylaşın</p>
      </div>

      {/* Submit form */}
      <div
        className="mx-4 mt-4 p-4 rounded-2xl"
        style={{
          background: "oklch(var(--islamic-dark) / 0.7)",
          border: "1px solid oklch(var(--islamic-gold) / 0.2)",
        }}
      >
        <Textarea
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="Duanızı yazın..."
          maxLength={300}
          rows={3}
          className="bg-white/5 border-white/15 text-white placeholder:text-white/30 resize-none text-sm"
          data-ocid="community.textarea"
        />
        <div className="flex items-center justify-between mt-3">
          <span className="text-white/30 text-xs">{text.length}/300</span>
          <Button
            onClick={handleSubmit}
            disabled={!text.trim() || text.length > 300}
            size="sm"
            className="font-semibold"
            style={{
              background: "oklch(var(--islamic-gold))",
              color: "oklch(var(--islamic-dark))",
            }}
            data-ocid="community.submit_button"
          >
            🤲 Dua et
          </Button>
        </div>
        {submitted && (
          <p
            className="text-green-400 text-xs mt-2"
            data-ocid="community.success_state"
          >
            Duanız paylaşıldı. Allah qəbul etsin! 🤲
          </p>
        )}
      </div>

      {/* Feed */}
      <div className="px-4 mt-5">
        <p className="text-xs uppercase tracking-wider text-white/30 mb-3 font-semibold">
          Paylaşılan Dualar
        </p>

        {duas.length === 0 && (
          <div
            className="text-center py-12 text-white/30 text-sm"
            data-ocid="community.empty_state"
          >
            <p className="text-3xl mb-3">🤲</p>
            <p>Hələ heç bir dua paylaşılmayıb</p>
            <p className="text-xs mt-1">İlk duanı paylaş!</p>
          </div>
        )}

        <AnimatePresence>
          {duas.map((dua, i) => (
            <motion.div
              key={dua.id}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.04 }}
              className="mb-3 p-4 rounded-2xl"
              style={{
                background: "oklch(var(--islamic-dark) / 0.6)",
                border: "1px solid oklch(1 0 0 / 0.07)",
              }}
              data-ocid={`community.item.${i + 1}`}
            >
              <p className="text-white/80 text-sm leading-relaxed mb-3">
                {dua.text}
              </p>
              <div className="flex items-center justify-between">
                <span className="text-white/25 text-xs">
                  {new Date(dua.createdAt).toLocaleDateString()}
                </span>
                <button
                  type="button"
                  onClick={() => handleAmin(dua.id)}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold transition-all active:scale-95"
                  style={{
                    background: "oklch(var(--islamic-gold) / 0.12)",
                    color: "oklch(var(--islamic-gold))",
                    border: "1px solid oklch(var(--islamic-gold) / 0.3)",
                  }}
                  data-ocid={`community.amin_button.${i + 1}`}
                >
                  🤲 Amin
                  <span
                    className="ml-1 px-1.5 py-0.5 rounded-full text-xs"
                    style={{
                      background: "oklch(var(--islamic-gold) / 0.2)",
                    }}
                  >
                    {dua.aminCount}
                  </span>
                </button>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
    </div>
  );
}
