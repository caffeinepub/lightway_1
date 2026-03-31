import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { RotateCcw } from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import { useEffect, useState } from "react";

const PRESETS = [33, 99];

function getTodayKey() {
  return `tasbeh-daily-${new Date().toDateString()}`;
}

export default function TasbehPage() {
  const [count, setCount] = useState(0);
  const [target, setTarget] = useState(33);
  const [customTarget, setCustomTarget] = useState("");
  const [showCustom, setShowCustom] = useState(false);
  const [tapping, setTapping] = useState(false);
  const [dailyTotal, setDailyTotal] = useState(() => {
    const stored = localStorage.getItem(getTodayKey());
    return stored ? Number(stored) : 0;
  });
  const [completed, setCompleted] = useState(false);

  const progress = Math.min(count / target, 1);
  const circumference = 2 * Math.PI * 110;
  const strokeDash = circumference * progress;

  const handleTap = () => {
    if (completed) return;
    if (navigator.vibrate) navigator.vibrate(30);
    setTapping(true);
    setTimeout(() => setTapping(false), 150);
    setCount((prev) => {
      const next = prev + 1;
      const newDaily = dailyTotal + 1;
      localStorage.setItem(getTodayKey(), String(newDaily));
      setDailyTotal(newDaily);
      if (next >= target) setCompleted(true);
      return next;
    });
  };

  const handleReset = () => {
    setCount(0);
    setCompleted(false);
  };

  const handlePreset = (p: number) => {
    setTarget(p);
    setShowCustom(false);
    setCount(0);
    setCompleted(false);
  };

  const handleCustomSubmit = () => {
    const val = Number(customTarget);
    if (val > 0) {
      setTarget(val);
      setShowCustom(false);
      setCount(0);
      setCompleted(false);
    }
  };

  useEffect(() => {
    const stored = localStorage.getItem(getTodayKey());
    setDailyTotal(stored ? Number(stored) : 0);
  }, []);

  return (
    <div
      className="min-h-screen pb-28 flex flex-col items-center"
      style={{
        background:
          "linear-gradient(180deg, oklch(var(--islamic-dark)) 0%, oklch(0.10 0.03 155) 100%)",
      }}
    >
      <div className="pt-6 pb-2 text-center px-4">
        <p
          className="font-amiri text-xl mb-1"
          style={{ color: "oklch(var(--islamic-gold))" }}
        >
          سُبْحَانَ اللَّهِ
        </p>
        <h1 className="text-xl font-bold text-white">Rəqəmsal Təsbeh</h1>
      </div>

      {/* Preset buttons */}
      <div className="flex gap-2 mt-4 mb-2">
        {PRESETS.map((p) => (
          <button
            key={p}
            type="button"
            onPointerDown={() => handlePreset(p)}
            className="px-4 py-1.5 rounded-full text-sm font-semibold transition-all"
            style={{
              background:
                target === p && !showCustom
                  ? "oklch(var(--islamic-gold))"
                  : "oklch(var(--islamic-gold) / 0.12)",
              color:
                target === p && !showCustom
                  ? "oklch(var(--islamic-dark))"
                  : "oklch(var(--islamic-gold))",
              border: "1px solid oklch(var(--islamic-gold) / 0.35)",
            }}
            data-ocid="tasbeh.toggle"
          >
            {p}
          </button>
        ))}
        <button
          type="button"
          onPointerDown={() => setShowCustom((s) => !s)}
          className="px-4 py-1.5 rounded-full text-sm font-semibold transition-all"
          style={{
            background: showCustom
              ? "oklch(var(--islamic-gold))"
              : "oklch(var(--islamic-gold) / 0.12)",
            color: showCustom
              ? "oklch(var(--islamic-dark))"
              : "oklch(var(--islamic-gold))",
            border: "1px solid oklch(var(--islamic-gold) / 0.35)",
          }}
          data-ocid="tasbeh.toggle"
        >
          Xüsusi
        </button>
      </div>

      <AnimatePresence>
        {showCustom && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="flex gap-2 mb-2 overflow-hidden"
          >
            <Input
              type="number"
              min={1}
              placeholder="Hədəf say"
              value={customTarget}
              onChange={(e) => setCustomTarget(e.target.value)}
              className="w-28 text-center bg-white/10 border-white/20 text-white placeholder:text-white/30"
              data-ocid="tasbeh.input"
            />
            <Button
              onPointerDown={handleCustomSubmit}
              size="sm"
              style={{
                background: "oklch(var(--islamic-gold))",
                color: "oklch(var(--islamic-dark))",
              }}
              data-ocid="tasbeh.submit_button"
            >
              Təsdiqlə
            </Button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Progress ring + tap button */}
      <div
        className="relative mt-4 flex items-center justify-center"
        style={{ width: 260, height: 260 }}
      >
        <svg
          role="img"
          aria-label="Təsbeh hədəf ireli gədiş"
          width={260}
          height={260}
          className="absolute inset-0"
          style={{ transform: "rotate(-90deg)" }}
        >
          <title>Təsbeh hədəf ireli gədiş</title>
          <circle
            cx={130}
            cy={130}
            r={110}
            fill="none"
            stroke="oklch(var(--islamic-gold) / 0.12)"
            strokeWidth={8}
          />
          <circle
            cx={130}
            cy={130}
            r={110}
            fill="none"
            stroke={
              completed ? "oklch(0.65 0.2 145)" : "oklch(var(--islamic-gold))"
            }
            strokeWidth={8}
            strokeLinecap="round"
            strokeDasharray={`${strokeDash} ${circumference}`}
            style={{ transition: "stroke-dasharray 0.2s ease, stroke 0.4s" }}
          />
        </svg>

        <button
          type="button"
          onPointerDown={handleTap}
          disabled={completed}
          className="w-44 h-44 rounded-full flex flex-col items-center justify-center cursor-pointer select-none"
          style={{
            background: completed
              ? "linear-gradient(135deg, oklch(0.45 0.15 145), oklch(0.35 0.12 145))"
              : "linear-gradient(135deg, oklch(var(--islamic-green)), oklch(var(--islamic-dark)))",
            border: `3px solid ${completed ? "oklch(0.65 0.2 145)" : "oklch(var(--islamic-gold) / 0.5)"}`,
            boxShadow: tapping
              ? "0 2px 8px oklch(0 0 0 / 0.5)"
              : "0 8px 32px oklch(0 0 0 / 0.4), 0 0 0 1px oklch(var(--islamic-gold) / 0.2)",
            transform: tapping ? "scale(0.92)" : "scale(1)",
            transition: "transform 0.15s ease, box-shadow 0.15s ease",
          }}
          data-ocid="tasbeh.primary_button"
          aria-label="Saymaq üçün bas"
        >
          <span
            className="text-5xl font-bold leading-none"
            style={{ color: "oklch(var(--islamic-gold))" }}
          >
            {count}
          </span>
          <span className="text-white/50 text-xs mt-1">
            {completed ? "✓ Tamamlandı" : `/ ${target}`}
          </span>
        </button>
      </div>

      <AnimatePresence>
        {completed && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            className="mt-4 px-6 py-3 rounded-2xl text-center"
            style={{
              background: "oklch(0.45 0.15 145 / 0.2)",
              border: "1.5px solid oklch(0.65 0.2 145 / 0.5)",
            }}
          >
            <p className="text-green-400 font-semibold">Tamamlandı! 🎉</p>
            <p
              className="font-amiri text-lg mt-1"
              style={{ color: "oklch(var(--islamic-gold))" }}
            >
              الحمد لله
            </p>
          </motion.div>
        )}
      </AnimatePresence>

      <button
        type="button"
        onPointerDown={handleReset}
        className="mt-4 flex items-center gap-2 px-5 py-2 rounded-full text-sm text-white/50 transition-all hover:text-white/80"
        style={{ border: "1px solid oklch(1 0 0 / 0.1)" }}
        data-ocid="tasbeh.secondary_button"
      >
        <RotateCcw size={14} />
        Sıfırla
      </button>

      <div
        className="mt-6 px-5 py-3 rounded-2xl text-center"
        style={{
          background: "oklch(var(--islamic-dark) / 0.6)",
          border: "1px solid oklch(var(--islamic-gold) / 0.15)",
        }}
      >
        <p className="text-white/40 text-xs">Bu günün ümumi zikri</p>
        <p
          className="text-2xl font-bold mt-0.5"
          style={{ color: "oklch(var(--islamic-gold))" }}
        >
          {dailyTotal}
        </p>
      </div>
    </div>
  );
}
