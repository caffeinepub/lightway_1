import { Button } from "@/components/ui/button";
import { Loader2, MapPin, Navigation, Square, Volume2 } from "lucide-react";
import { useEffect, useRef, useState } from "react";

// Mecca coordinates
const MECCA_LAT = 21.4225;
const MECCA_LNG = 39.8262;

function calculateQiblaAngle(lat: number, lng: number): number {
  const lat1 = (lat * Math.PI) / 180;
  const lat2 = (MECCA_LAT * Math.PI) / 180;
  const deltaLng = ((MECCA_LNG - lng) * Math.PI) / 180;
  const x = Math.sin(deltaLng) * Math.cos(lat2);
  const y =
    Math.cos(lat1) * Math.sin(lat2) -
    Math.sin(lat1) * Math.cos(lat2) * Math.cos(deltaLng);
  let bearing = (Math.atan2(x, y) * 180) / Math.PI;
  return (bearing + 360) % 360;
}

function calculateDistance(lat: number, lng: number): number {
  const R = 6371;
  const dLat = ((MECCA_LAT - lat) * Math.PI) / 180;
  const dLng = ((MECCA_LNG - lng) * Math.PI) / 180;
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos((lat * Math.PI) / 180) *
      Math.cos((MECCA_LAT * Math.PI) / 180) *
      Math.sin(dLng / 2) *
      Math.sin(dLng / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return Math.round(R * c);
}

// Reliable azan/iqama audio sources with fallbacks
const AZAN_URLS = [
  "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3", // placeholder removed below
];

const AZAN_PRIMARY = "https://audio.islamicfinder.org/audio/azan/en/1.mp3";
const AZAN_FALLBACK =
  "https://download.quranicaudio.com/quran/abdurrahmaan_as-sudais/001.mp3";
const IQAMA_PRIMARY = "https://audio.islamicfinder.org/audio/iqamah/en/1.mp3";

// Suppress unused warning
void AZAN_URLS;

async function tryPlayAudio(
  audio: HTMLAudioElement,
  fallbackSrc?: string,
): Promise<boolean> {
  try {
    await audio.play();
    return true;
  } catch {
    if (fallbackSrc && audio.src !== fallbackSrc) {
      audio.src = fallbackSrc;
      try {
        await audio.play();
        return true;
      } catch {
        return false;
      }
    }
    return false;
  }
}

export default function QiblaPage() {
  const [location, setLocation] = useState<{ lat: number; lng: number } | null>(
    null,
  );
  const [locationError, setLocationError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [deviceHeading, setDeviceHeading] = useState<number>(0);
  const [qiblaAngle, setQiblaAngle] = useState<number | null>(null);
  const [distance, setDistance] = useState<number | null>(null);
  const [playingAzan, setPlayingAzan] = useState(false);
  const [playingIqama, setPlayingIqama] = useState(false);
  const [compassSupported, setCompassSupported] = useState(false);
  const [audioError, setAudioError] = useState<string | null>(null);
  const [permissionRequested, setPermissionRequested] = useState(false);

  const azanAudioRef = useRef<HTMLAudioElement | null>(null);
  const iqamaAudioRef = useRef<HTMLAudioElement | null>(null);

  // Setup audio elements
  useEffect(() => {
    azanAudioRef.current = new Audio(AZAN_PRIMARY);
    iqamaAudioRef.current = new Audio(IQAMA_PRIMARY);
    azanAudioRef.current.crossOrigin = "anonymous";
    iqamaAudioRef.current.crossOrigin = "anonymous";
    azanAudioRef.current.preload = "none";
    iqamaAudioRef.current.preload = "none";

    azanAudioRef.current.addEventListener("ended", () => setPlayingAzan(false));
    iqamaAudioRef.current.addEventListener("ended", () =>
      setPlayingIqama(false),
    );

    return () => {
      azanAudioRef.current?.pause();
      iqamaAudioRef.current?.pause();
    };
  }, []);

  // Get GPS location
  useEffect(() => {
    if (!navigator.geolocation) {
      setLocationError("Cihazınız GPS dəstəkləmir");
      setLoading(false);
      return;
    }
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        const lat = pos.coords.latitude;
        const lng = pos.coords.longitude;
        setLocation({ lat, lng });
        setQiblaAngle(calculateQiblaAngle(lat, lng));
        setDistance(calculateDistance(lat, lng));
        setLoading(false);
      },
      (err) => {
        console.error(err);
        setLocationError("Məkan icazəsi verilmədi. Zəhmət olmasa icazə verin.");
        setLoading(false);
      },
      { enableHighAccuracy: true, timeout: 10000 },
    );
  }, []);

  // Device compass
  const requestCompassPermission = () => {
    setPermissionRequested(true);
    const handleOrientation = (e: DeviceOrientationEvent) => {
      setCompassSupported(true);
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const heading =
        (e as any).webkitCompassHeading ??
        (e.alpha !== null ? 360 - e.alpha : 0);
      setDeviceHeading(heading);
    };

    if (typeof DeviceOrientationEvent !== "undefined") {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const DOE = DeviceOrientationEvent as any;
      if (typeof DOE.requestPermission === "function") {
        DOE.requestPermission()
          .then((res: string) => {
            if (res === "granted") {
              window.addEventListener("deviceorientation", handleOrientation);
            }
          })
          .catch(() => {});
      } else {
        window.addEventListener("deviceorientation", handleOrientation);
      }
    }
  };

  // biome-ignore lint/correctness/useExhaustiveDependencies: intentional
  useEffect(() => {
    // Auto-start on non-iOS (no permission needed)
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const DOE = DeviceOrientationEvent as any;
    if (typeof DOE?.requestPermission !== "function") {
      requestCompassPermission();
    }
  }, []);

  const toggleAzan = async () => {
    if (!azanAudioRef.current) return;
    setAudioError(null);
    if (playingAzan) {
      azanAudioRef.current.pause();
      azanAudioRef.current.currentTime = 0;
      setPlayingAzan(false);
    } else {
      iqamaAudioRef.current?.pause();
      if (iqamaAudioRef.current) iqamaAudioRef.current.currentTime = 0;
      setPlayingIqama(false);
      setPlayingAzan(true);
      const ok = await tryPlayAudio(azanAudioRef.current, AZAN_FALLBACK);
      if (!ok) {
        setPlayingAzan(false);
        setAudioError("Audio yüklənə bilmədi. İnternet bağlantınızı yoxlayın.");
      }
    }
  };

  const toggleIqama = async () => {
    if (!iqamaAudioRef.current) return;
    setAudioError(null);
    if (playingIqama) {
      iqamaAudioRef.current.pause();
      iqamaAudioRef.current.currentTime = 0;
      setPlayingIqama(false);
    } else {
      azanAudioRef.current?.pause();
      if (azanAudioRef.current) azanAudioRef.current.currentTime = 0;
      setPlayingAzan(false);
      setPlayingIqama(true);
      const ok = await tryPlayAudio(iqamaAudioRef.current);
      if (!ok) {
        setPlayingIqama(false);
        setAudioError("Audio yüklənə bilmədi. İnternet bağlantınızı yoxlayın.");
      }
    }
  };

  // needleAngle: how many degrees the needle is offset from "up" (12 o'clock)
  // When needleAngle ≈ 0, phone is pointing toward Qibla
  const needleAngle =
    qiblaAngle !== null
      ? compassSupported
        ? qiblaAngle - deviceHeading
        : qiblaAngle
      : 0;

  const normalizedAngle = ((needleAngle % 360) + 360) % 360;
  const isAligned =
    compassSupported && (normalizedAngle < 12 || normalizedAngle > 348);

  return (
    <div
      className="min-h-screen pb-24"
      style={{
        background:
          "linear-gradient(180deg, oklch(var(--islamic-dark)) 0%, oklch(0.12 0.04 150) 100%)",
      }}
    >
      {/* Header */}
      <div className="px-4 pt-6 pb-4 text-center">
        <h1
          className="text-2xl font-bold"
          style={{ color: "oklch(var(--islamic-gold))" }}
        >
          🕌 Qiblə
        </h1>
        <p className="text-white/60 text-sm mt-1">Məkkə istiqaməti</p>
      </div>

      {/* Loading */}
      {loading && (
        <div className="flex flex-col items-center justify-center py-20 gap-4">
          <Loader2
            className="animate-spin"
            size={40}
            style={{ color: "oklch(var(--islamic-gold))" }}
          />
          <p className="text-white/60">Məkan təyin edilir...</p>
        </div>
      )}

      {/* Error */}
      {!loading && locationError && (
        <div className="mx-4 p-4 rounded-2xl border border-red-500/30 bg-red-900/20 text-center">
          <MapPin size={32} className="mx-auto mb-2 text-red-400" />
          <p className="text-red-300 text-sm">{locationError}</p>
          <p className="text-white/40 text-xs mt-2">
            Brauzerin parametrlərindən məkan icazəsini aktivləşdirin
          </p>
        </div>
      )}

      {/* Compass */}
      {!loading && qiblaAngle !== null && (
        <div className="flex flex-col items-center px-4 gap-6">
          {/* Location info */}
          {location && (
            <div
              className="flex items-center gap-2 px-4 py-2 rounded-full text-sm"
              style={{
                background: "oklch(var(--islamic-gold) / 0.1)",
                border: "1px solid oklch(var(--islamic-gold) / 0.3)",
                color: "oklch(var(--islamic-gold))",
              }}
            >
              <MapPin size={14} />
              <span>
                {location.lat.toFixed(4)}°, {location.lng.toFixed(4)}°
              </span>
              {distance && (
                <span className="text-white/50 ml-1">· {distance} km</span>
              )}
            </div>
          )}

          {/* iOS compass permission button */}
          {!compassSupported && !permissionRequested && (
            <button
              type="button"
              className="px-5 py-2.5 rounded-full text-sm font-semibold"
              style={{
                background: "oklch(var(--islamic-gold))",
                color: "oklch(var(--islamic-dark))",
              }}
              onClick={requestCompassPermission}
            >
              📱 Kompas icazəsi ver (iOS)
            </button>
          )}

          {/* Alignment badge */}
          {isAligned ? (
            <div
              className="flex items-center gap-2 px-5 py-2.5 rounded-full text-sm font-bold animate-pulse"
              style={{
                background: "oklch(0.55 0.18 145 / 0.3)",
                border: "2px solid oklch(0.65 0.2 145)",
                color: "oklch(0.75 0.2 145)",
              }}
            >
              ✅ Qiblə istiqamətindasınız!
            </div>
          ) : compassSupported ? (
            <p className="text-white/50 text-sm text-center">
              📱 Telefonu döndürün — qızıl ox yuxarıya baxanda Qiblə
              istiqamətindasınız
            </p>
          ) : (
            <p className="text-white/40 text-xs text-center">
              Kompas sensoru tapılmadı — aşağıdakı dərəcəyə uyğun istiqamət
              götürün
            </p>
          )}

          {/* Compass circle */}
          <div
            className="relative"
            style={{
              width: 280,
              height: 280,
              filter: isAligned
                ? "drop-shadow(0 0 20px oklch(0.65 0.2 145))"
                : undefined,
              transition: "filter 0.5s ease",
            }}
          >
            {/* Outer ring */}
            <div
              className="absolute inset-0 rounded-full"
              style={{
                border: isAligned
                  ? "2px solid oklch(0.65 0.2 145)"
                  : "2px solid oklch(var(--islamic-gold) / 0.4)",
                background:
                  "radial-gradient(circle, oklch(0.15 0.05 150) 0%, oklch(0.08 0.03 150) 100%)",
                boxShadow: isAligned
                  ? "0 0 40px oklch(0.65 0.2 145 / 0.4), inset 0 0 40px oklch(0 0 0 / 0.3)"
                  : "0 0 40px oklch(var(--islamic-gold) / 0.15), inset 0 0 40px oklch(0 0 0 / 0.3)",
                transition: "border 0.5s, box-shadow 0.5s",
              }}
            />

            {/* Compass directions */}
            {["Ş", "Cə", "C", "Qə"].map((dir, i) => {
              const angle = i * 90;
              const rad = ((angle - 90) * Math.PI) / 180;
              const r = 120;
              const x = 140 + r * Math.cos(rad);
              const y = 140 + r * Math.sin(rad);
              return (
                <span
                  key={dir}
                  className="absolute text-xs font-bold"
                  style={{
                    left: x - 6,
                    top: y - 8,
                    color: dir === "Ş" ? "#ef4444" : "rgba(255,255,255,0.4)",
                  }}
                >
                  {dir}
                </span>
              );
            })}

            {/* Degree marks */}
            {Array.from({ length: 36 }).map((_, i) => {
              const angle = i * 10;
              const rad = ((angle - 90) * Math.PI) / 180;
              const isMajor = angle % 90 === 0;
              const r1 = 105;
              const r2 = isMajor ? 92 : 98;
              const x1 = 140 + r1 * Math.cos(rad);
              const y1 = 140 + r1 * Math.sin(rad);
              const x2 = 140 + r2 * Math.cos(rad);
              const y2 = 140 + r2 * Math.sin(rad);
              return (
                <svg
                  key={angle}
                  aria-label="compass tick"
                  role="img"
                  className="absolute inset-0"
                  width={280}
                  height={280}
                  style={{ pointerEvents: "none" }}
                >
                  <line
                    x1={x1}
                    y1={y1}
                    x2={x2}
                    y2={y2}
                    stroke={`rgba(255,255,255,${isMajor ? 0.3 : 0.12})`}
                    strokeWidth={isMajor ? 2 : 1}
                  />
                </svg>
              );
            })}

            {/* Qibla needle */}
            <div
              className="absolute inset-0 flex items-center justify-center"
              style={{
                transform: `rotate(${needleAngle}deg)`,
                transition: compassSupported
                  ? "transform 0.15s ease"
                  : "transform 0.4s ease",
              }}
            >
              <div className="relative" style={{ width: 8, height: 200 }}>
                {/* Qibla tip (points toward Mecca) — gold */}
                <div
                  style={{
                    position: "absolute",
                    top: 0,
                    left: 0,
                    width: 8,
                    height: 100,
                    background: isAligned
                      ? "linear-gradient(to top, oklch(0.65 0.2 145), #22c55e)"
                      : "linear-gradient(to top, oklch(var(--islamic-gold)), #f59e0b)",
                    borderRadius: "4px 4px 0 0",
                    boxShadow: isAligned
                      ? "0 0 16px oklch(0.65 0.2 145)"
                      : "0 0 12px oklch(var(--islamic-gold) / 0.8)",
                    transition: "background 0.5s, box-shadow 0.5s",
                  }}
                />
                {/* South tip */}
                <div
                  style={{
                    position: "absolute",
                    bottom: 0,
                    left: 0,
                    width: 8,
                    height: 100,
                    background:
                      "linear-gradient(to bottom, rgba(255,255,255,0.3), rgba(255,255,255,0.1))",
                    borderRadius: "0 0 4px 4px",
                  }}
                />
                {/* Center dot */}
                <div
                  style={{
                    position: "absolute",
                    top: "50%",
                    left: "50%",
                    transform: "translate(-50%, -50%)",
                    width: 14,
                    height: 14,
                    borderRadius: "50%",
                    background: isAligned
                      ? "oklch(0.65 0.2 145)"
                      : "oklch(var(--islamic-gold))",
                    boxShadow: isAligned
                      ? "0 0 8px oklch(0.65 0.2 145)"
                      : "0 0 8px oklch(var(--islamic-gold))",
                    zIndex: 10,
                    transition: "background 0.5s",
                  }}
                />
              </div>
            </div>

            {/* Kaaba icon in center */}
            <div
              className="absolute"
              style={{
                top: "50%",
                left: "50%",
                transform: "translate(-50%, -50%)",
                fontSize: 22,
                zIndex: 20,
              }}
            >
              🕋
            </div>
          </div>

          {/* Angle info */}
          <div className="text-center">
            <p
              className="text-3xl font-bold"
              style={{ color: "oklch(var(--islamic-gold))" }}
            >
              {Math.round(qiblaAngle)}°
            </p>
            <p className="text-white/50 text-sm">Şimaldan saat yönündə</p>
          </div>

          {/* Azan & Iqama */}
          <div
            className="w-full max-w-sm rounded-2xl p-5"
            style={{
              background: "oklch(var(--islamic-dark) / 0.8)",
              border: "1px solid oklch(var(--islamic-gold) / 0.25)",
            }}
          >
            <p
              className="text-center text-sm font-medium mb-4"
              style={{ color: "oklch(var(--islamic-gold))" }}
            >
              Azan & İqamə
            </p>
            {audioError && (
              <p className="text-red-400 text-xs text-center mb-3">
                {audioError}
              </p>
            )}
            <div className="flex gap-3">
              <Button
                onClick={toggleAzan}
                className="flex-1 flex items-center justify-center gap-2 py-3 rounded-xl font-medium transition-all"
                style={{
                  background: playingAzan
                    ? "oklch(var(--islamic-gold))"
                    : "oklch(var(--islamic-gold) / 0.15)",
                  color: playingAzan
                    ? "oklch(var(--islamic-dark))"
                    : "oklch(var(--islamic-gold))",
                  border: "1px solid oklch(var(--islamic-gold) / 0.4)",
                }}
              >
                {playingAzan ? <Square size={16} /> : <Volume2 size={16} />}
                {playingAzan ? "Dayandır" : "Azan"}
              </Button>

              <Button
                onClick={toggleIqama}
                className="flex-1 flex items-center justify-center gap-2 py-3 rounded-xl font-medium transition-all"
                style={{
                  background: playingIqama
                    ? "oklch(0.6 0.1 200)"
                    : "oklch(0.6 0.1 200 / 0.15)",
                  color: playingIqama ? "white" : "oklch(0.7 0.1 200)",
                  border: "1px solid oklch(0.6 0.1 200 / 0.4)",
                }}
              >
                {playingIqama ? <Square size={16} /> : <Volume2 size={16} />}
                {playingIqama ? "Dayandır" : "İqamə"}
              </Button>
            </div>
          </div>

          {/* Info card */}
          <div
            className="w-full max-w-sm rounded-2xl p-4 text-sm text-white/50 text-center"
            style={{
              background: "oklch(var(--islamic-dark) / 0.5)",
              border: "1px solid oklch(var(--islamic-gold) / 0.1)",
            }}
          >
            <Navigation
              size={16}
              className="inline mr-1"
              style={{ color: "oklch(var(--islamic-gold))" }}
            />
            Qiblə istiqaməti GPS koordinatlarına əsasən hesablanır. Ən dəqiq
            nəticə üçün açıq havada istifadə edin.
          </div>
        </div>
      )}
    </div>
  );
}
