import { useLocation, useRouter } from "@tanstack/react-router";
import { ChevronLeft, Moon, Sun } from "lucide-react";
import { useEffect, useState } from "react";

const PAGE_TITLES: Record<string, string> = {
  "/prayer-times": "Namaz Vaxtları",
  "/quran": "Quran",
  "/books": "Kitabxana",
  "/admin": "Admin",
  "/extras": "Əlavələr",
  "/tasbeh": "Rəqəmsal Təsbeh",
  "/daily-plan": "Günlük Plan",
  "/mood-guidance": "Əhval Rehbərliyi",
  "/community-dua": "İcma Duası",
};

export default function MobileHeader() {
  const location = useLocation();
  const router = useRouter();
  const isHome = location.pathname === "/";
  const title = PAGE_TITLES[location.pathname];

  const [isDark, setIsDark] = useState(() => {
    if (typeof window !== "undefined") {
      return localStorage.getItem("lightway-dark-mode") === "true";
    }
    return false;
  });

  useEffect(() => {
    if (isDark) {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
    localStorage.setItem("lightway-dark-mode", String(isDark));
  }, [isDark]);

  // Apply on mount
  useEffect(() => {
    const stored = localStorage.getItem("lightway-dark-mode");
    if (stored === "true") {
      document.documentElement.classList.add("dark");
      setIsDark(true);
    }
  }, []);

  return (
    <header
      className="sticky top-0 z-50 w-full flex items-center justify-center"
      style={{
        backgroundColor: "oklch(var(--islamic-dark))",
        height: "52px",
        borderBottom: "1px solid oklch(var(--islamic-gold) / 0.2)",
        transition: "background-color 0.3s ease",
      }}
    >
      {!isHome && (
        <button
          type="button"
          onClick={() => router.history.back()}
          className="absolute left-3 flex items-center justify-center w-9 h-9 rounded-full transition-colors"
          style={{ color: "oklch(var(--islamic-gold))" }}
          data-ocid="header.button"
          aria-label="Geri"
        >
          <ChevronLeft size={22} />
        </button>
      )}

      <div className="flex items-center gap-2">
        {isHome && (
          <div
            className="w-7 h-7 rounded-full flex items-center justify-center text-base"
            style={{
              backgroundColor: "oklch(var(--islamic-gold) / 0.15)",
              border: "1.5px solid oklch(var(--islamic-gold))",
            }}
          >
            ☪
          </div>
        )}
        <span
          className="font-bold tracking-widest text-sm"
          style={{ color: isHome ? "oklch(var(--islamic-gold))" : "white" }}
        >
          {isHome ? "LIGHTWAY" : title}
        </span>
      </div>

      <button
        type="button"
        onClick={() => setIsDark((d) => !d)}
        className="absolute right-3 flex items-center justify-center w-9 h-9 rounded-full transition-all"
        style={{
          color: "oklch(var(--islamic-gold))",
          background: "oklch(var(--islamic-gold) / 0.1)",
          border: "1px solid oklch(var(--islamic-gold) / 0.3)",
        }}
        data-ocid="header.toggle"
        aria-label={isDark ? "Gündüz rejimi" : "Gecə rejimi"}
      >
        {isDark ? <Sun size={16} /> : <Moon size={16} />}
      </button>
    </header>
  );
}
