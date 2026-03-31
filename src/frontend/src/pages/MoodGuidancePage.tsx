import { ArrowLeft, Volume2 } from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import { useState } from "react";

type MoodKey =
  | "stress"
  | "fear"
  | "confusion"
  | "sadness"
  | "loneliness"
  | "anger"
  | "gratitude"
  | "hope"
  | "regret"
  | "guilt"
  | "grief"
  | "jealousy"
  | "despair";

const MOODS: { key: MoodKey; emoji: string; label: string; desc: string }[] = [
  {
    key: "stress",
    emoji: "😟",
    label: "Narahatlıq",
    desc: "Narahatlıq hiss edirsiniz",
  },
  { key: "fear", emoji: "😨", label: "Qorxu", desc: "Qorxu içindəsiniz" },
  {
    key: "confusion",
    emoji: "😕",
    label: "Çaşqınlıq",
    desc: "Çaşıb qalmısınız",
  },
  {
    key: "sadness",
    emoji: "😢",
    label: "Kədər",
    desc: "Kədərli hiss edirsiniz",
  },
  {
    key: "loneliness",
    emoji: "😔",
    label: "Tənhalıq",
    desc: "Özünüzü tək hiss edirsiniz",
  },
  { key: "anger", emoji: "😠", label: "Qəzəb", desc: "Qəzəb içindəsiniz" },
  {
    key: "gratitude",
    emoji: "🙏",
    label: "Şükür",
    desc: "Şükür hiss edirsiniz",
  },
  { key: "hope", emoji: "🌟", label: "Ümid", desc: "Ümidlə dolusunuz" },
  {
    key: "regret",
    emoji: "😞",
    label: "Peşmançılıq",
    desc: "Bir şeyə görə peşmansınız",
  },
  {
    key: "guilt",
    emoji: "🫣",
    label: "Günahkarlıq",
    desc: "Günahkarlıq hiss edirsiniz",
  },
  { key: "grief", emoji: "💔", label: "Yas", desc: "Dərin kədər içindəsiniz" },
  {
    key: "jealousy",
    emoji: "😒",
    label: "Həsəd",
    desc: "Həsəd hiss edirsiniz",
  },
  {
    key: "despair",
    emoji: "😩",
    label: "Ümidsizlik",
    desc: "Ümidini itirmisiniz",
  },
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
  sadness: {
    ayah: {
      ar: "إِنَّ مَعَ الْعُسْرِ يُسْرًا",
      tr: "Həqiqətən, çətinliyin yanında asanlıq var. (İnşirah 6)",
    },
    dua: {
      ar: "اللَّهُمَّ إِنِّي عَبْدُكَ وَأَنَا فَقِيرٌ إِلَيْكَ",
      tr: "Allahım, mən sənin qulunam, sənə möhtacam.",
    },
    zikr: "Ya Latif (100 dəfə)",
    color: "240",
  },
  loneliness: {
    ayah: {
      ar: "وَهُوَ مَعَكُمْ أَيْنَ مَا كُنتُمْ",
      tr: "O, harada olursanız olun, sizinlədir. (Hədid 4)",
    },
    dua: {
      ar: "رَبِّ لَا تَذَرْنِي فَرْدًا وَأَنتَ خَيْرُ الْوَارِثِينَ",
      tr: "Rəbbim, məni tək qoyma. Sən varislərin ən yaxşısısın. (Ənbiya 89)",
    },
    zikr: "Ya Qarib (100 dəfə)",
    color: "200",
  },
  anger: {
    ayah: {
      ar: "وَالْكَاظِمِينَ الْغَيْظَ وَالْعَافِينَ عَنِ النَّاسِ",
      tr: "Qəzəblərini udanlar, insanları bağışlayanlar... (Ali İmran 134)",
    },
    dua: {
      ar: "أَعُوذُ بِاللَّهِ مِنَ الشَّيْطَانِ الرَّجِيمِ",
      tr: "Kovulmuş şeytandan Allaha sığınıram.",
    },
    zikr: "Euzu billahi minəş-şeytanir-racim (3 dəfə)",
    color: "20",
  },
  gratitude: {
    ayah: {
      ar: "لَئِن شَكَرْتُمْ لَأَزِيدَنَّكُمْ",
      tr: "Əgər şükür etsəniz, sizə olan nemətimi artıracağam. (İbrahim 7)",
    },
    dua: {
      ar: "الْحَمْدُ لِلَّهِ الَّذِي بِنِعْمَتِهِ تَتِمُّ الصَّالِحَاتُ",
      tr: "Nemətləri ilə yaxşı işlər tamamlanan Allaha həmd olsun.",
    },
    zikr: "Elhamdulillah (100 dəfə)",
    color: "80",
  },
  hope: {
    ayah: {
      ar: "إِنَّهُ لَا يَيْأَسُ مِن رَّوْحِ اللَّهِ إِلَّا الْقَوْمُ الْكَافِرُونَ",
      tr: "Allahın rəhmətindən yalnız kafirlər ümidini kəsər. (Yusif 87)",
    },
    dua: {
      ar: "رَبَّنَا لَا تُؤَاخِذْنَا إِن نَّسِينَا أَوْ أَخْطَأْنَا",
      tr: "Rəbbimiz, unutduqlarımıza və xətalarımıza görə bizi cəzalandırma. (Bəqərə 286)",
    },
    zikr: "Ya Fattah (33 dəfə)",
    color: "60",
  },
  regret: {
    ayah: {
      ar: "قُلْ يَا عِبَادِيَ الَّذِينَ أَسْرَفُوا عَلَىٰ أَنفُسِهِمْ لَا تَقْنَطُوا مِن رَّحْمَةِ اللَّهِ",
      tr: "De: Ey özünə zülm edən qullarım, Allahın rəhmətindən ümidini kəsmə. (Zümər 53)",
    },
    dua: {
      ar: "رَبَّنَا ظَلَمْنَا أَنفُسَنَا وَإِن لَّمْ تَغْفِرْ لَنَا لَنَكُونَنَّ مِنَ الْخَاسِرِينَ",
      tr: "Rəbbimiz, özümüzə zülm etdik. Bağışlamasan, ziyana uğrayanlardan olarıq. (Əraf 23)",
    },
    zikr: "Estağfirullah (100 dəfə)",
    color: "300",
  },
  guilt: {
    ayah: {
      ar: "وَمَن يَعْمَلْ سُوءًا أَوْ يَظْلِمْ نَفْسَهُ ثُمَّ يَسْتَغْفِرِ اللَّهَ يَجِدِ اللَّهَ غَفُورًا رَّحِيمًا",
      tr: "Kim pis iş görüb tövbə etsə, Allahı bağışlayan, rəhmli tapacaq. (Nisa 110)",
    },
    dua: {
      ar: "اللَّهُمَّ اغْفِرْ لِي ذَنْبِي كُلَّهُ",
      tr: "Allahım, bütün günahlarımı bağışla.",
    },
    zikr: "Estağfirullahal-Azim (70 dəfə)",
    color: "280",
  },
  grief: {
    ayah: {
      ar: "إِنَّا لِلَّهِ وَإِنَّا إِلَيْهِ رَاجِعُونَ",
      tr: "Həqiqətən biz Allaha məxsusuq və Ona qayıdacağıq. (Bəqərə 156)",
    },
    dua: {
      ar: "اللَّهُمَّ أَجِرْنِي فِي مُصِيبَتِي وَأَخْلِفْ لِي خَيْرًا مِنْهَا",
      tr: "Allahım, müsibətimdə bana mükafat ver, ondan daha yaxşısını qismət et.",
    },
    zikr: "Ya Sabur (100 dəfə)",
    color: "230",
  },
  jealousy: {
    ayah: {
      ar: "وَلَا تَتَمَنَّوْا مَا فَضَّلَ اللَّهُ بِهِ بَعْضَكُمْ عَلَىٰ بَعْضٍ",
      tr: "Allahın kimə üstünlük verdiyi şeyə tamah etməyin. (Nisa 32)",
    },
    dua: {
      ar: "اللَّهُمَّ بَارِكْ لِي فِيمَا رَزَقْتَنِي",
      tr: "Allahım, bana verdiyin ruzi və nemətə bərəkət ver.",
    },
    zikr: "Elhamdulillah ala kulli hal (33 dəfə)",
    color: "130",
  },
  despair: {
    ayah: {
      ar: "فَإِنَّ مَعَ الْعُسْرِ يُسْرًا إِنَّ مَعَ الْعُسْرِ يُسْرًا",
      tr: "Çətinliyin yanında mütləq asanlıq var, çətinliyin yanında mütləq asanlıq var. (İnşirah 5-6)",
    },
    dua: {
      ar: "لَا إِلَٰهَ إِلَّا أَنتَ سُبْحَانَكَ إِنِّي كُنتُ مِنَ الظَّالِمِينَ",
      tr: "Səndən başqa ilah yoxdur. Sən pak və müqəddəssən. Mən zalımlardan oldum. (Ənbiya 87)",
    },
    zikr: "La ilaha illallah (100 dəfə)",
    color: "260",
  },
};

export default function MoodGuidancePage() {
  const [selected, setSelected] = useState<MoodKey | null>(null);
  const [speaking, setSpeaking] = useState<string | null>(null);

  const guidance = selected ? GUIDANCE[selected] : null;

  const handleSpeak = (text: string, key: string) => {
    setSpeaking(key);
    if (!window.speechSynthesis) return;
    window.speechSynthesis.cancel();
    const utter = new SpeechSynthesisUtterance(text);
    utter.lang = "ar-SA";
    utter.rate = 0.8;
    utter.onend = () => setSpeaking(null);
    utter.onerror = () => setSpeaking(null);
    window.speechSynthesis.speak(utter);
  };

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
            className="flex flex-col gap-3 mt-2"
          >
            {MOODS.map(({ key, emoji, label, desc }) => (
              <motion.button
                key={key}
                type="button"
                onClick={() => setSelected(key)}
                whileTap={{ scale: 0.97 }}
                className="flex items-center gap-4 p-4 rounded-2xl text-left transition-all"
                style={{
                  background: "oklch(0.16 0.04 260 / 0.8)",
                  border: "1.5px solid oklch(1 0 0 / 0.08)",
                }}
                data-ocid={`mood.${key}.button`}
              >
                <span className="text-3xl">{emoji}</span>
                <div>
                  <p className="text-white font-semibold">{label}</p>
                  <p className="text-white/40 text-sm">{desc}</p>
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
              onClick={() => {
                setSelected(null);
                setSpeaking(null);
                window.speechSynthesis?.cancel();
              }}
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
                  <div className="flex items-center justify-between mb-2">
                    <p
                      className="text-xs font-semibold uppercase tracking-wider"
                      style={{ color: `oklch(0.65 0.12 ${guidance.color})` }}
                    >
                      📖 Quran Ayəsi
                    </p>
                    <button
                      type="button"
                      onClick={() => handleSpeak(guidance.ayah.ar, "ayah")}
                      className="flex items-center gap-1 px-2 py-1 rounded-full text-xs transition-all"
                      style={{
                        background:
                          speaking === "ayah"
                            ? `oklch(0.55 0.12 ${guidance.color} / 0.4)`
                            : `oklch(0.55 0.12 ${guidance.color} / 0.15)`,
                        color: `oklch(0.75 0.12 ${guidance.color})`,
                        border: `1px solid oklch(0.55 0.12 ${guidance.color} / 0.3)`,
                      }}
                    >
                      <Volume2 size={11} />
                      {speaking === "ayah" ? "..." : "Səsləndir"}
                    </button>
                  </div>
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
                  <div className="flex items-center justify-between mb-2">
                    <p
                      className="text-xs font-semibold uppercase tracking-wider"
                      style={{ color: `oklch(0.60 0.10 ${guidance.color})` }}
                    >
                      🤲 Dua
                    </p>
                    <button
                      type="button"
                      onClick={() => handleSpeak(guidance.dua.ar, "dua")}
                      className="flex items-center gap-1 px-2 py-1 rounded-full text-xs transition-all"
                      style={{
                        background:
                          speaking === "dua"
                            ? `oklch(0.50 0.10 ${guidance.color} / 0.4)`
                            : `oklch(0.50 0.10 ${guidance.color} / 0.15)`,
                        color: `oklch(0.70 0.10 ${guidance.color})`,
                        border: `1px solid oklch(0.50 0.10 ${guidance.color} / 0.3)`,
                      }}
                    >
                      <Volume2 size={11} />
                      {speaking === "dua" ? "..." : "Səsləndir"}
                    </button>
                  </div>
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
