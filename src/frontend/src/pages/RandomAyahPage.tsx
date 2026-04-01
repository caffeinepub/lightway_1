import { Button } from "@/components/ui/button";
import { ArrowLeft, RefreshCw, Volume2 } from "lucide-react";
import { useCallback, useEffect, useRef, useState } from "react";

interface AyahData {
  arabic: string;
  transliteration: string;
  azerbaijani: string;
  surah: string;
  ayahNumber: number;
  surahNumber: number;
}

function randomAyahNumber(exclude?: number): number {
  let n: number;
  do {
    n = Math.floor(Math.random() * 6236) + 1;
  } while (n === exclude);
  return n;
}

export default function RandomAyahPage() {
  const [ayah, setAyah] = useState<AyahData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [speaking, setSpeaking] = useState(false);
  const [ttsUnsupported, setTtsUnsupported] = useState(false);
  const currentNumberRef = useRef<number | undefined>(undefined);

  const fetchAyah = useCallback(async (exclude?: number) => {
    setLoading(true);
    setError(false);
    setAyah(null);
    const n = randomAyahNumber(exclude);
    currentNumberRef.current = n;
    try {
      const [arabicRes, transRes, azRes] = await Promise.all([
        fetch(`https://api.alquran.cloud/v1/ayah/${n}/quran-uthmani`),
        fetch(`https://api.alquran.cloud/v1/ayah/${n}/en.transliteration`),
        fetch(`https://api.alquran.cloud/v1/ayah/${n}/az.mammadaliyev`),
      ]);
      const [arabicJson, transJson, azJson] = await Promise.all([
        arabicRes.json(),
        transRes.json(),
        azRes.json(),
      ]);
      setAyah({
        arabic: arabicJson.data.text,
        transliteration: transJson.data.text,
        azerbaijani: azJson.data.text,
        surah: `${arabicJson.data.surah.englishName} (${arabicJson.data.surah.name})`,
        ayahNumber: arabicJson.data.numberInSurah,
        surahNumber: arabicJson.data.surah.number,
      });
    } catch {
      setError(true);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchAyah();
    if (!window.speechSynthesis) setTtsUnsupported(true);
  }, [fetchAyah]);

  const handleSpeak = () => {
    if (!ayah || !window.speechSynthesis) return;
    window.speechSynthesis.cancel();
    const utter = new SpeechSynthesisUtterance(ayah.arabic);
    utter.lang = "ar-SA";
    utter.rate = 0.85;
    utter.onstart = () => setSpeaking(true);
    utter.onend = () => setSpeaking(false);
    utter.onerror = () => setSpeaking(false);
    window.speechSynthesis.speak(utter);
  };

  const handleNext = () => {
    window.speechSynthesis?.cancel();
    setSpeaking(false);
    fetchAyah(currentNumberRef.current);
  };

  return (
    <div
      className="min-h-screen pb-28"
      style={{
        background:
          "linear-gradient(180deg, oklch(var(--islamic-dark)) 0%, oklch(0.12 0.03 155) 100%)",
      }}
    >
      {/* Header */}
      <div className="flex items-center gap-3 px-4 pt-5 pb-2">
        <button
          type="button"
          onClick={() => history.back()}
          className="w-9 h-9 rounded-full flex items-center justify-center"
          style={{
            background: "oklch(var(--islamic-dark) / 0.7)",
            border: "1px solid oklch(var(--islamic-gold) / 0.25)",
          }}
          data-ocid="random_ayah.back_button"
        >
          <ArrowLeft
            className="w-4 h-4"
            style={{ color: "oklch(var(--islamic-gold))" }}
          />
        </button>
        <div>
          <h1 className="text-white font-bold text-lg leading-tight">
            Təsadüfi Ayə
          </h1>
          <p className="text-white/40 text-xs">Quran-dan ilahi kəlam</p>
        </div>
      </div>

      <div className="px-4 pt-4">
        {loading && (
          <div
            className="rounded-2xl p-8 flex flex-col items-center justify-center gap-4"
            style={{
              background: "oklch(var(--islamic-dark) / 0.55)",
              border: "1.5px solid oklch(var(--islamic-gold) / 0.2)",
              minHeight: 300,
            }}
            data-ocid="random_ayah.loading_state"
          >
            <RefreshCw
              className="w-8 h-8 animate-spin"
              style={{ color: "oklch(var(--islamic-gold))" }}
            />
            <p className="text-white/50 text-sm">Yüklənir...</p>
          </div>
        )}

        {error && !loading && (
          <div
            className="rounded-2xl p-8 flex flex-col items-center justify-center gap-4 text-center"
            style={{
              background: "oklch(var(--islamic-dark) / 0.55)",
              border: "1.5px solid oklch(0.5 0.15 20 / 0.4)",
              minHeight: 300,
            }}
            data-ocid="random_ayah.error_state"
          >
            <p className="text-white/60 text-sm">
              Ayə yüklənmədi. İnternet bağlantınızı yoxlayın.
            </p>
            <Button
              onClick={() => fetchAyah(currentNumberRef.current)}
              className="mt-2"
              style={{
                background: "oklch(var(--islamic-gold) / 0.2)",
                color: "oklch(var(--islamic-gold))",
                border: "1px solid oklch(var(--islamic-gold) / 0.4)",
              }}
              data-ocid="random_ayah.retry_button"
            >
              Yenidən cəhd et
            </Button>
          </div>
        )}

        {ayah && !loading && (
          <div
            className="rounded-2xl p-6"
            style={{
              background: "oklch(var(--islamic-dark) / 0.55)",
              border: "1.5px solid oklch(var(--islamic-gold) / 0.25)",
              boxShadow: "0 8px 32px oklch(var(--islamic-gold) / 0.08)",
            }}
            data-ocid="random_ayah.card"
          >
            {/* Surah badge */}
            <div className="flex items-center justify-between mb-5">
              <span
                className="text-xs font-semibold px-3 py-1 rounded-full"
                style={{
                  background: "oklch(var(--islamic-gold) / 0.15)",
                  color: "oklch(var(--islamic-gold))",
                  border: "1px solid oklch(var(--islamic-gold) / 0.3)",
                }}
              >
                {ayah.surah}
              </span>
              <span
                className="text-xs px-3 py-1 rounded-full"
                style={{
                  background: "oklch(0.5 0.12 200 / 0.15)",
                  color: "oklch(0.75 0.12 200)",
                  border: "1px solid oklch(0.5 0.12 200 / 0.3)",
                }}
              >
                Ayə {ayah.ayahNumber}
              </span>
            </div>

            {/* Arabic */}
            <p
              className="font-amiri text-3xl leading-loose text-right mb-5 text-white"
              dir="rtl"
              style={{ lineHeight: "2.4" }}
            >
              {ayah.arabic}
            </p>

            <div
              className="h-px w-full mb-4"
              style={{ background: "oklch(var(--islamic-gold) / 0.15)" }}
            />

            {/* Transliteration */}
            <p
              className="text-sm italic mb-4 leading-relaxed"
              style={{ color: "oklch(0.75 0.08 155)" }}
            >
              {ayah.transliteration}
            </p>

            {/* Azerbaijani */}
            <p className="text-sm text-white/70 leading-relaxed">
              {ayah.azerbaijani}
            </p>

            {/* TTS unsupported note */}
            {ttsUnsupported && (
              <p className="text-xs text-white/30 mt-3">
                * Səsləndirmə bu brauzerdə dəstəklənmir
              </p>
            )}
          </div>
        )}

        {/* Action buttons */}
        <div className="flex gap-3 mt-5">
          {!ttsUnsupported && (
            <Button
              onClick={handleSpeak}
              disabled={!ayah || loading || speaking}
              className="flex-1 gap-2"
              style={{
                background: "oklch(0.45 0.1 155 / 0.3)",
                color: "oklch(0.8 0.1 155)",
                border: "1.5px solid oklch(0.5 0.1 155 / 0.4)",
              }}
              data-ocid="random_ayah.speak_button"
            >
              <Volume2 className="w-4 h-4" />
              {speaking ? "Oxuyur..." : "🔊 Oxu"}
            </Button>
          )}
          <Button
            onClick={handleNext}
            disabled={loading}
            className="flex-1 gap-2"
            style={{
              background: "oklch(var(--islamic-gold) / 0.18)",
              color: "oklch(var(--islamic-gold))",
              border: "1.5px solid oklch(var(--islamic-gold) / 0.4)",
            }}
            data-ocid="random_ayah.next_button"
          >
            Növbəti ayə →
          </Button>
        </div>

        {/* Footer note */}
        <div className="text-center mt-6">
          <p
            className="font-amiri text-lg"
            style={{ color: "oklch(var(--islamic-gold) / 0.35)" }}
          >
            وَنُنَزِّلُ مِنَ الْقُرْآنِ مَا هُوَ شِفَاءٌ
          </p>
          <p className="text-white/25 text-xs mt-1">Quran bir şəfadır</p>
        </div>
      </div>
    </div>
  );
}
