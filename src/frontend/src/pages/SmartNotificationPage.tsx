import { useCallback, useEffect, useState } from "react";

const MESSAGES = [
  "Allah səni unutmur",
  "Bu gün də davam et",
  "Səbr et, hər şey düzələcək",
  "Dua et, eşidilir",
  "Sakit ol, hər şey nəzarətdədir",
  "Allah qəlbini bilir",
  "Kiçik addım da dəyərlidir",
  "Ümidini itirmə",
  "Hər gecə bir başlanğıcdır",
  "Allah sənə yaxındır",
  "Qəlbini təmiz saxla",
  "Sən tək deyilsən",
  "Dua qapını açar",
  "Bu da keçəcək",
  "Hər şeyin bir vaxtı var",
  "Allah plan qurur",
  "Səbr ən güclü silahdır",
  "Qəlbin danışır, dinlə",
  "Sakitlik gücdür",
  "Allah səni görür",
  "İçindəki nuru qoru",
  "Hər çətinlikdən sonra rahatlıq var",
  "Dua etməyi unutma",
  "Bu gün yaxşılıq et",
  "Allah səninlədir",
  "Yorulsan belə dayanma",
  "Hər şey səbəblə olur",
  "Özünə qarşı yumşaq ol",
  "Qəlbinə diqqət et",
  "Allah gecikməz",
  "Bu gün daha yaxşı ol",
  "Dua sənin gücündür",
  "Qorxma, sən qorunursan",
  "Qaranlıqdan sonra işıq var",
  "Allah hər şeyi bilir",
  "Sakit nəfəs al",
  "Qəlbini yüngülləşdir",
  "Sən güclüsən",
  "Hər şey düzəlir",
  "Allah sənə yol açır",
  "Hər gün yeni şansdır",
  "Dua qəlbi rahatladır",
  "Özünü itirmə",
  "Allah səni sınayır, tərk etmir",
  "Ümid işıqdır",
  "Səbr edən qazanır",
  "Qəlbini Allahla bağla",
  "Hər şey daha yaxşı olacaq",
  "Bu an da keçəcək",
  "Allahın mərhəməti böyükdür",
  "Sən dəyərlisən",
  "Dua ilə başla",
  "Qəlbin sakitlik istəyir",
  "Allah sənə kifayətdir",
  "Hər şey nəzarətdədir",
  "İçində güc var",
  "Qorxunu burax",
  "Bu gün şükür et",
  "Allah yaxınındadır",
  "Hər şeyin hikməti var",
  "Sakit qal, davam et",
  "Dua qapını açacaq",
  "Allah gecikməz",
  "Səbr et, mükafat gəlir",
  "Qəlbini qorumaq ibadətdir",
  "Özünə inan",
  "Allah səni eşidir",
  "Hər gecə ümid gətirir",
  "Bu da keçəcək",
  "Qaranlıq uzun sürməz",
  "Hər addımın görünür",
  "Allah səni yönləndirir",
  "Qəlbini təmiz saxla",
  "Dua et, yüngülləş",
  "Səbrlə gözlə",
  "Allah sənə yol göstərir",
  "Hər şey düzələcək",
  "Özünü tək hiss etmə",
  "Allah sənə yaxındır",
  "Qəlbin güzgüdür",
  "Hər gün bir fürsətdir",
  "Dua ilə davam et",
  "Allah səni qoruyur",
  "Sakitlik tapacaqsan",
  "Ümidini saxla",
  "Hər şey daha yaxşı olur",
  "Allah hər şeyi görür",
  "Səbr et, yaxınsan",
  "Qəlbini dinlə",
  "Bu gün dəyişə bilər",
  "Allah səni seçib",
  "Dua qaranlığı işıqlandırır",
  "Qəlbinə güvən",
  "Sakit ol, keçəcək",
  "Allah sənə kifayətdir",
  "Hər şey bir səbəblədir",
  "Səbr səni qoruyur",
  "Ümidini itirmə",
  "Allah hər şeyi düzəldər",
  "Sən tək deyilsən",
];

const STORAGE_KEY = "lightway_notif_state";

function loadState(): { queue: number[]; lastIndex: number | null } {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) return JSON.parse(raw);
  } catch {}
  return { queue: [], lastIndex: null };
}

function saveState(state: { queue: number[]; lastIndex: number | null }) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
}

function pickNext(
  lastIndex: number | null,
  queue: number[],
): { index: number; newQueue: number[] } {
  let pool = queue.length > 0 ? [...queue] : MESSAGES.map((_, i) => i);
  // remove last shown to avoid immediate repeat
  if (lastIndex !== null) pool = pool.filter((i) => i !== lastIndex);
  if (pool.length === 0)
    pool = MESSAGES.map((_, i) => i).filter((i) => i !== lastIndex);
  const pick = pool[Math.floor(Math.random() * pool.length)];
  const newQueue = pool.filter((i) => i !== pick);
  return { index: pick, newQueue };
}

const TIME_LABELS: Record<string, string> = {
  morning: "Səhər düşüncəsi · 11:00",
  night: "Gecə düşüncəsi · 21:00",
  manual: "Sizin üçün seçildi",
};

export default function SmartNotificationPage() {
  const [state, setState] = useState(loadState);
  const [current, setCurrent] = useState<{
    text: string;
    label: string;
  } | null>(() => {
    const raw = localStorage.getItem(`${STORAGE_KEY}_current`);
    return raw ? JSON.parse(raw) : null;
  });
  const [animating, setAnimating] = useState(false);

  const showMessage = useCallback(
    (label: string) => {
      setAnimating(true);
      setTimeout(() => {
        const { index, newQueue } = pickNext(state.lastIndex, state.queue);
        const newState = { queue: newQueue, lastIndex: index };
        saveState(newState);
        setState(newState);
        const entry = { text: MESSAGES[index], label };
        setCurrent(entry);
        localStorage.setItem(`${STORAGE_KEY}_current`, JSON.stringify(entry));
        setAnimating(false);
      }, 300);
    },
    [state],
  );

  // Auto-trigger at 11:00 and 21:00
  useEffect(() => {
    const check = () => {
      const now = new Date();
      const h = now.getHours();
      const m = now.getMinutes();
      const lastCheck = localStorage.getItem(`${STORAGE_KEY}_lastcheck`);
      const key = `${now.getFullYear()}-${now.getMonth()}-${now.getDate()}-${h}`;
      if ((h === 11 || h === 21) && m === 0 && lastCheck !== key) {
        localStorage.setItem(`${STORAGE_KEY}_lastcheck`, key);
        showMessage(h === 11 ? "morning" : "night");
      }
    };
    check();
    const timer = setInterval(check, 30_000);
    return () => clearInterval(timer);
  }, [showMessage]);

  const nextTime = (() => {
    const now = new Date();
    const h = now.getHours();
    if (h < 11) return "11:00";
    if (h < 21) return "21:00";
    return "sabah 11:00";
  })();

  return (
    <div
      className="min-h-screen pb-28 flex flex-col"
      style={{
        background:
          "linear-gradient(180deg, oklch(var(--islamic-dark)) 0%, oklch(0.12 0.03 260) 100%)",
      }}
    >
      {/* Header */}
      <div className="px-6 pt-6 pb-4 text-center">
        <p
          className="font-amiri text-2xl mb-1"
          style={{ color: "oklch(var(--islamic-gold))" }}
        >
          بسم الله
        </p>
        <h1 className="text-2xl font-bold text-white">Mənəvi Mesajlar</h1>
        <p className="text-white/40 text-sm mt-1">
          Hər gün qəlbiniz üçün bir söz
        </p>
      </div>

      {/* Message card */}
      <div className="flex-1 flex flex-col items-center justify-start px-6 gap-6">
        <div
          className="w-full rounded-3xl p-8 text-center transition-all duration-500"
          style={{
            background: animating
              ? "oklch(0.18 0.04 260 / 0.4)"
              : "oklch(0.18 0.04 260 / 0.8)",
            border: "1.5px solid oklch(var(--islamic-gold) / 0.2)",
            boxShadow: "0 8px 40px oklch(0.45 0.1 260 / 0.2)",
            opacity: animating ? 0 : 1,
            transform: animating ? "scale(0.97)" : "scale(1)",
          }}
        >
          {current ? (
            <>
              <p
                className="text-xs uppercase tracking-widest mb-4"
                style={{ color: "oklch(var(--islamic-gold) / 0.6)" }}
              >
                {TIME_LABELS[current.label] ?? current.label}
              </p>
              <p
                className="text-2xl font-semibold leading-relaxed text-white"
                style={{ textShadow: "0 2px 12px oklch(0.45 0.1 260 / 0.4)" }}
              >
                {current.text}
              </p>
              <div
                className="mt-6 w-8 h-0.5 mx-auto rounded-full"
                style={{ background: "oklch(var(--islamic-gold) / 0.4)" }}
              />
            </>
          ) : (
            <>
              <div
                className="text-5xl mb-4"
                style={{
                  filter:
                    "drop-shadow(0 0 12px oklch(var(--islamic-gold) / 0.3))",
                }}
              >
                ✨
              </div>
              <p className="text-white/50 text-base">
                Mesaj almaq üçün aşağıdakı düyməyə basın
              </p>
            </>
          )}
        </div>

        {/* Show message button */}
        <button
          type="button"
          onClick={() => showMessage("manual")}
          className="w-full py-4 rounded-2xl text-base font-semibold transition-all active:scale-95"
          style={{
            background:
              "linear-gradient(135deg, oklch(0.55 0.12 75), oklch(0.5 0.1 50))",
            color: "oklch(0.1 0.02 75)",
            boxShadow: "0 4px 20px oklch(0.55 0.12 75 / 0.35)",
          }}
        >
          ✨ İndi mesaj göstər
        </button>

        {/* Auto schedule info */}
        <div
          className="w-full rounded-2xl px-5 py-4"
          style={{
            background: "oklch(0.16 0.03 260 / 0.6)",
            border: "1px solid oklch(var(--islamic-gold) / 0.1)",
          }}
        >
          <p
            className="text-xs font-semibold uppercase tracking-widest mb-3"
            style={{ color: "oklch(var(--islamic-gold) / 0.7)" }}
          >
            Gündəlik cədvəl
          </p>
          <div className="flex flex-col gap-2">
            {[
              { time: "11:00", label: "Səhər düşüncəsi" },
              { time: "21:00", label: "Gecə düşüncəsi" },
            ].map(({ time, label }) => (
              <div key={time} className="flex items-center gap-3">
                <div
                  className="w-12 h-8 rounded-lg flex items-center justify-center text-xs font-bold"
                  style={{
                    background: "oklch(var(--islamic-gold) / 0.12)",
                    color: "oklch(var(--islamic-gold))",
                  }}
                >
                  {time}
                </div>
                <p className="text-white/60 text-sm">{label}</p>
              </div>
            ))}
          </div>
          <p className="text-white/30 text-xs mt-3">
            Növbəti avtomatik mesaj: {nextTime}
          </p>
        </div>

        {/* Progress */}
        <div
          className="w-full rounded-2xl px-5 py-4"
          style={{
            background: "oklch(0.16 0.03 260 / 0.6)",
            border: "1px solid oklch(var(--islamic-gold) / 0.1)",
          }}
        >
          <div className="flex justify-between items-center mb-2">
            <p
              className="text-xs font-semibold uppercase tracking-widest"
              style={{ color: "oklch(var(--islamic-gold) / 0.7)" }}
            >
              İrəliləyiş
            </p>
            <p className="text-white/40 text-xs">
              {MESSAGES.length - state.queue.length} / {MESSAGES.length}
            </p>
          </div>
          <div
            className="w-full h-1.5 rounded-full overflow-hidden"
            style={{ background: "oklch(0.25 0.03 260)" }}
          >
            <div
              className="h-full rounded-full transition-all duration-700"
              style={{
                width: `${((MESSAGES.length - state.queue.length) / MESSAGES.length) * 100}%`,
                background:
                  "linear-gradient(90deg, oklch(0.55 0.12 75), oklch(0.5 0.1 155))",
              }}
            />
          </div>
          <p className="text-white/30 text-xs mt-2">
            Bütün mesajlar göstərildikdə sıfırlanır
          </p>
        </div>
      </div>
    </div>
  );
}
