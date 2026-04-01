# Lightway — İstixara Module

## Current State
- App has Extras section with 5 modules (Tasbeh, Daily Plan, Mood Guidance, Community Dua, Smart Notifications)
- QiblaPage has Azan & İqamə audio section at the bottom
- SmartNotificationPage has 100 messages in MESSAGES array
- No İstixara module exists

## Requested Changes (Diff)

### Add
- New `IstixaraPage.tsx` page — single scrollable page with:
  - Relevant Quran ayah at top (Al-Baqarah 216 or similar about tawakkul/istikhara)
  - Title: "İstixara", subtitle: "Allahdan xeyirli olanı istəmək üçün dua və namaz"
  - Definition section explaining what istikhara is
  - Step-by-step guide: 1. Niyyət, 2. 2 rükət namaz, 3. İstixara duası, 4. Qəlbi müşahidə et
  - Full dua in 3 sections: Arabic text, Latin transliteration, Azerbaijani translation
  - "(qərar verilən iş)" placeholder shown in different color (amber/gold) as static text
  - Important notes (VACİB QEYDLƏR) section
  - Quick summary (QISA XÜLASƏ) section
- Add İstixara route `/istixara` to App.tsx
- Add İstixara entry to ExtrasPage EXTRAS array

### Modify
- `SmartNotificationPage.tsx`: add "Bu gün istixara etməyi düşünə bilərsən" to MESSAGES array (101st message)
- `QiblaPage.tsx`: remove the entire Azan & İqamə section (audio refs, state, toggle functions, and the UI card)

### Remove
- Azan/İqamə audio from QiblaPage (state, refs, useEffect for audio, toggleAzan, toggleIqama functions, and UI card)

## Implementation Plan
1. Create IstixaraPage.tsx with full content
2. Add route in App.tsx
3. Add entry in ExtrasPage.tsx
4. Remove Azan/İqamə from QiblaPage.tsx
5. Add istixara reminder message to SmartNotificationPage.tsx MESSAGES array
