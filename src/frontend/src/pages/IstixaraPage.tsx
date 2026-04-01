import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

export default function IstixaraPage() {
  return (
    <div
      className="min-h-screen pb-28"
      style={{
        background:
          "linear-gradient(180deg, oklch(var(--islamic-dark)) 0%, oklch(0.12 0.04 30) 100%)",
      }}
    >
      {/* Quran Ayah Banner */}
      <div
        className="mx-4 mt-6 rounded-2xl p-5 text-center"
        style={{
          background: "oklch(0.18 0.05 50 / 0.6)",
          border: "1.5px solid oklch(var(--islamic-gold) / 0.35)",
          boxShadow: "0 4px 24px oklch(var(--islamic-gold) / 0.1)",
        }}
      >
        <p
          className="font-amiri text-2xl leading-loose text-right mb-3"
          dir="rtl"
          style={{ color: "oklch(var(--islamic-gold))" }}
        >
          وَعَسَىٰ أَن تَكْرَهُوا شَيْئًا وَهُوَ خَيْرٌ لَّكُمْ
        </p>
        <p className="text-white/60 text-sm">
          <span style={{ color: "oklch(var(--islamic-gold) / 0.8)" }}>
            Bəqərə, 216
          </span>{" "}
          — "Bəlkə bir şeyi xoşlamırsınız, amma o sizin üçün xeyirlidir."
        </p>
      </div>

      {/* Header */}
      <div className="px-6 pt-6 pb-2 text-center">
        <h1
          className="text-3xl font-bold"
          style={{ color: "oklch(var(--islamic-gold))" }}
        >
          İstixara
        </h1>
        <p className="text-white/50 text-sm mt-2">
          Allahdan xeyirli olanı istəmək üçün dua və namaz
        </p>
      </div>

      <div className="px-4 flex flex-col gap-4 mt-4">
        {/* Definition Card */}
        <div
          className="rounded-2xl p-5"
          style={{
            background: "oklch(0.16 0.04 30 / 0.7)",
            border: "1px solid oklch(var(--islamic-gold) / 0.2)",
          }}
        >
          <p
            className="text-xs font-semibold uppercase tracking-widest mb-3"
            style={{ color: "oklch(var(--islamic-gold) / 0.7)" }}
          >
            Tərif
          </p>
          <ul className="flex flex-col gap-2">
            <li className="flex gap-2 text-white/70 text-sm">
              <span style={{ color: "oklch(var(--islamic-gold))" }}>•</span>
              İstixara, insanın vacib bir qərar verərkən Allahdan xeyirli olanı
              istəməsi üçün etdiyi dua və 2 rükət nafilə namazdır
            </li>
            <li className="flex gap-2 text-white/70 text-sm">
              <span style={{ color: "oklch(var(--islamic-gold))" }}>•</span>
              Bu, gələcəyi görmək və ya fal açmaq deyil
            </li>
            <li className="flex gap-2 text-white/70 text-sm">
              <span style={{ color: "oklch(var(--islamic-gold))" }}>•</span>
              Məqsəd Allahın xeyirli olan yolu göstərməsini istəməkdir
            </li>
          </ul>
        </div>

        {/* Steps */}
        <div
          className="rounded-2xl p-5"
          style={{
            background: "oklch(0.16 0.04 30 / 0.7)",
            border: "1px solid oklch(var(--islamic-gold) / 0.2)",
          }}
        >
          <p
            className="text-xs font-semibold uppercase tracking-widest mb-4"
            style={{ color: "oklch(var(--islamic-gold) / 0.7)" }}
          >
            Addım-addım
          </p>

          {/* Step 1 */}
          <div className="flex gap-3 mb-5">
            <div
              className="flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold"
              style={{
                background: "oklch(var(--islamic-gold) / 0.15)",
                color: "oklch(var(--islamic-gold))",
                border: "1px solid oklch(var(--islamic-gold) / 0.3)",
              }}
            >
              1
            </div>
            <div>
              <p className="font-semibold text-white mb-1">Niyyət et</p>
              <p className="text-white/60 text-sm italic">
                "Ya Allah, bu iş mənim üçün xeyirlidirsə, onu mənim üçün
                asanlaşdır…"
              </p>
            </div>
          </div>

          {/* Step 2 */}
          <div className="flex gap-3 mb-5">
            <div
              className="flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold"
              style={{
                background: "oklch(var(--islamic-gold) / 0.15)",
                color: "oklch(var(--islamic-gold))",
                border: "1px solid oklch(var(--islamic-gold) / 0.3)",
              }}
            >
              2
            </div>
            <div>
              <p className="font-semibold text-white mb-1">2 rükət namaz qıl</p>
              <p className="text-white/60 text-sm">
                Normal nafilə namaz qaydası ilə qılınır. Sakit və diqqətli
                şəkildə qılın.
              </p>
            </div>
          </div>

          {/* Step 3 */}
          <div className="flex gap-3 mb-5">
            <div
              className="flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold"
              style={{
                background: "oklch(var(--islamic-gold) / 0.15)",
                color: "oklch(var(--islamic-gold))",
                border: "1px solid oklch(var(--islamic-gold) / 0.3)",
              }}
            >
              3
            </div>
            <div className="w-full">
              <p className="font-semibold text-white mb-3">İstixara duası</p>
              <Tabs defaultValue="arabic">
                <TabsList
                  className="w-full mb-4"
                  style={{
                    background: "oklch(0.12 0.03 30 / 0.8)",
                    border: "1px solid oklch(var(--islamic-gold) / 0.2)",
                  }}
                >
                  <TabsTrigger
                    value="arabic"
                    className="flex-1 text-xs data-[state=active]:text-black"
                    style={
                      {
                        // active styling handled by shadcn default + color override
                      }
                    }
                    data-ocid="istixara.tab"
                  >
                    Ərəb
                  </TabsTrigger>
                  <TabsTrigger
                    value="latin"
                    className="flex-1 text-xs data-[state=active]:text-black"
                    data-ocid="istixara.tab"
                  >
                    Latın
                  </TabsTrigger>
                  <TabsTrigger
                    value="azerbaijani"
                    className="flex-1 text-xs data-[state=active]:text-black"
                    data-ocid="istixara.tab"
                  >
                    Azərbaycanca
                  </TabsTrigger>
                </TabsList>

                {/* Arabic */}
                <TabsContent value="arabic">
                  <div
                    className="rounded-xl p-4"
                    style={{ background: "oklch(0.1 0.03 30 / 0.6)" }}
                  >
                    <p
                      className="font-amiri text-lg leading-loose text-right text-white/90"
                      dir="rtl"
                    >
                      اللّهُمَّ إِنِّي أَسْتَخِيرُكَ بِعِلْمِكَ،
                      <br />
                      وَأَسْتَقْدِرُكَ بِقُدْرَتِكَ،
                      <br />
                      وَأَسْأَلُكَ مِنْ فَضْلِكَ الْعَظِيمِ،
                      <br />
                      فَإِنَّكَ تَقْدِرُ وَلَا أَقْدِرُ،
                      <br />
                      وَتَعْلَمُ وَلَا أَعْلَمُ،
                      <br />
                      وَأَنْتَ عَلَّامُ الْغُيُوبِ.
                      <br />
                      <br />
                      اللّهُمَّ إِنْ كُنْتَ تَعْلَمُ أَنَّ هَذَا الأَمْرَ
                      <br />
                      <span
                        className="text-sm px-1 py-0.5 rounded"
                        style={{
                          color: "oklch(0.82 0.18 75)",
                          background: "oklch(0.82 0.18 75 / 0.12)",
                        }}
                      >
                        (qərar verilən iş)
                      </span>
                      <br />
                      خَيْرٌ لِي فِي دِينِي، وَمَعَاشِي، وَعَاقِبَةِ أَمْرِي،
                      <br />
                      فَاقْدُرْهُ لِي، وَيَسِّرْهُ لِي، ثُمَّ بَارِكْ لِي فِيهِ.
                      <br />
                      <br />
                      وَإِنْ كُنْتَ تَعْلَمُ أَنَّ هَذَا الأَمْرَ
                      <br />
                      شَرٌّ لِي فِي دِينِي، وَمَعَاشِي، وَعَاقِبَةِ أَمْرِي،
                      <br />
                      فَاصْرِفْهُ عَنِّي، وَاصْرِفْنِي عَنْهُ،
                      <br />
                      وَاقْدُرْ لِيَ الْخَيْرَ حَيْثُ كَانَ،
                      <br />
                      ثُمَّ أَرْضِنِي بِهِ.
                    </p>
                  </div>
                </TabsContent>

                {/* Latin */}
                <TabsContent value="latin">
                  <div
                    className="rounded-xl p-4"
                    style={{ background: "oklch(0.1 0.03 30 / 0.6)" }}
                  >
                    <p className="text-white/80 text-sm leading-relaxed">
                      Allahumma inni astakhiruka bi&apos;ilmika,
                      <br />
                      wa astaqdiruka bi-qudratika,
                      <br />
                      wa as&apos;aluka min fadlika al-&apos;azim,
                      <br />
                      fa innaka taqdiru wa la aqdir,
                      <br />
                      wa ta&apos;lamu wa la a&apos;lam,
                      <br />
                      wa anta &apos;allamul-ghuyub.
                      <br />
                      <br />
                      Allahumma in kunta ta&apos;lamu anna haza al-amr
                      <br />
                      <span
                        className="text-sm px-1 py-0.5 rounded"
                        style={{
                          color: "oklch(0.82 0.18 75)",
                          background: "oklch(0.82 0.18 75 / 0.12)",
                        }}
                      >
                        (kərar verilən iş)
                      </span>
                      <br />
                      khayrun li fi dini, wa ma&apos;ashi, wa &apos;aqibati amri
                      <br />
                      faqdurhu li, wa yassirhu li, thumma barik li fihi.
                      <br />
                      <br />
                      Wa in kunta ta&apos;lamu anna haza al-amr
                      <br />
                      sharrun li fi dini, wa ma&apos;ashi, wa &apos;aqibati amri
                      <br />
                      fasrifhu &apos;anni, wasrifni &apos;anhu,
                      <br />
                      waqdur li al-khayra haythu kana,
                      <br />
                      thumma ardhini bihi.
                    </p>
                  </div>
                </TabsContent>

                {/* Azerbaijani */}
                <TabsContent value="azerbaijani">
                  <div
                    className="rounded-xl p-4"
                    style={{ background: "oklch(0.1 0.03 30 / 0.6)" }}
                  >
                    <p className="text-white/80 text-sm leading-relaxed">
                      Allahım, Səndən Öz elmindən mənim üçün xeyir istəyirəm,
                      <br />
                      Sənin qüdrətindən mənim üçün qüdrət istəyirəm,
                      <br />
                      Səndən Sənin böyük lütfünü diləyirəm.
                      <br />
                      <br />
                      Çünki Sən qüdrətlisən, mən isə qüdrətsizəm,
                      <br />
                      Sən bilirsən, mən isə bilmirəm,
                      <br />
                      Sən bütün gizli şeyləri bilənsən.
                      <br />
                      <br />
                      Allahım, əgər bu iş
                      <br />
                      <span
                        className="text-sm px-1 py-0.5 rounded"
                        style={{
                          color: "oklch(0.82 0.18 75)",
                          background: "oklch(0.82 0.18 75 / 0.12)",
                        }}
                      >
                        (qərar verilən iş)
                      </span>
                      <br />
                      dinim, həyatım və işimin sonu üçün xeyirlidirsə,
                      <br />
                      onu mənim üçün təqdir et, asanlaşdır və bərəkətli et.
                      <br />
                      <br />
                      Əgər bu iş dinim, həyatım və işimin sonu üçün şərdirsə,
                      <br />
                      onu məndən uzaqlaşdır, məni də ondan uzaqlaşdır,
                      <br />
                      harada xeyir varsa onu mənim üçün təqdir et
                      <br />
                      və məni onunla razı et.
                    </p>
                  </div>
                </TabsContent>
              </Tabs>
            </div>
          </div>

          {/* Step 4 */}
          <div className="flex gap-3">
            <div
              className="flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold"
              style={{
                background: "oklch(var(--islamic-gold) / 0.15)",
                color: "oklch(var(--islamic-gold))",
                border: "1px solid oklch(var(--islamic-gold) / 0.3)",
              }}
            >
              4
            </div>
            <div>
              <p className="font-semibold text-white mb-1">Qəlbi müşahidə et</p>
              <ul className="flex flex-col gap-1">
                <li className="text-white/60 text-sm">
                  • Qəlbində rahatlıq hiss edə bilərsən
                </li>
                <li className="text-white/60 text-sm">
                  • Ya da narahatlıq hissi ola bilər
                </li>
                <li className="text-white/60 text-sm">
                  • İşlərin asanlaşması və ya çətinləşməsi də bir işarə ola
                  bilər
                </li>
              </ul>
            </div>
          </div>
        </div>

        {/* Important Notes */}
        <div
          className="rounded-2xl p-5"
          style={{
            background: "oklch(0.18 0.05 30 / 0.5)",
            border: "1px solid oklch(0.7 0.15 50 / 0.3)",
          }}
        >
          <p className="font-semibold text-white mb-3">⚠️ VACİB QEYDLƏR</p>
          <ul className="flex flex-col gap-2">
            {[
              "İstixara fal deyil",
              "Yuxu görmək şərt deyil",
              "Nəticə hiss, vəziyyət və təvəkkül ilə bağlıdır",
              "Ağıl və məsləhət də vacibdir",
            ].map((note) => (
              <li key={note} className="flex gap-2 text-white/65 text-sm">
                <span style={{ color: "oklch(0.75 0.15 50)" }}>›</span>
                {note}
              </li>
            ))}
          </ul>
        </div>

        {/* Quick Summary */}
        <div
          className="rounded-2xl p-5"
          style={{
            background: "oklch(0.16 0.04 30 / 0.7)",
            border: "1px solid oklch(var(--islamic-gold) / 0.2)",
          }}
        >
          <p className="font-semibold text-white mb-3">💡 QISA XÜLASƏ</p>
          <ol className="flex flex-col gap-2">
            {[
              "Niyyət et",
              "2 rükət namaz qıl",
              "İstixara duasını oxu",
              "Qəlbini və vəziyyəti müşahidə et",
              "Qərar ver və Allaha təvəkkül et",
            ].map((step, i) => (
              <li key={step} className="flex gap-3 text-sm">
                <span
                  className="flex-shrink-0 w-5 h-5 rounded-full flex items-center justify-center text-xs font-bold"
                  style={{
                    background: "oklch(var(--islamic-gold) / 0.15)",
                    color: "oklch(var(--islamic-gold))",
                  }}
                >
                  {i + 1}
                </span>
                <span className="text-white/70">{step}</span>
              </li>
            ))}
          </ol>
        </div>

        {/* Footer attribution */}
        <div className="text-center py-4">
          <p
            className="font-amiri text-lg"
            style={{ color: "oklch(var(--islamic-gold) / 0.35)" }}
          >
            تَوَكَّلْتُ عَلَى اللَّهِ
          </p>
          <p className="text-white/20 text-xs mt-1">
            © {new Date().getFullYear()}. Built with love using{" "}
            <a
              href={`https://caffeine.ai?utm_source=caffeine-footer&utm_medium=referral&utm_content=${encodeURIComponent(typeof window !== "undefined" ? window.location.hostname : "")}`}
              target="_blank"
              rel="noopener noreferrer"
              className="underline"
            >
              caffeine.ai
            </a>
          </p>
        </div>
      </div>
    </div>
  );
}
