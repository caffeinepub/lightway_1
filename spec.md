# Lightway

## Current State
- App has an Istixara module (/istixara route, IstixaraPage component, entry in ExtrasPage EXTRAS array)
- Əlavələr bölməsi (ExtrasPage) has 6 items including Istixara
- No random ayah feature exists

## Requested Changes (Diff)

### Add
- New "Təsadüfi Ayə" page (/random-ayah route) in Əlavələr
  - Fetches random verse from Quran API (https://api.alquran.cloud/v1)
  - Shows: Arabic text, Latin transliteration, Azerbaijani translation
  - "Növbəti ayə" button to load a new random verse (no immediate repeat)
  - "Oxu" button that uses browser TTS to read the Arabic text
  - Spiritual, calming UI consistent with app style

### Modify
- ExtrasPage: remove Istixara entry, add Təsadüfi Ayə entry
- App.tsx: remove istixaraRoute, add randomAyahRoute

### Remove
- IstixaraPage.tsx (delete entirely)
- Istixara route from App.tsx
- Istixara entry from ExtrasPage EXTRAS array

## Implementation Plan
1. Delete/empty IstixaraPage.tsx (replace with redirect or remove file reference)
2. Remove istixaraRoute from App.tsx, remove IstixaraPage import
3. Remove istixara from EXTRAS in ExtrasPage.tsx
4. Add Təsadüfi Ayə entry to EXTRAS
5. Create RandomAyahPage.tsx:
   - Use alquran.cloud API: GET /v1/ayah/{number}/editions/quran-uthmani,en.transliteration,az.mammadaliyev (or similar)
   - Total ayahs: 6236, pick random number 1-6236 avoiding last shown
   - Display Arabic, transliteration, Azerbaijani translation
   - TTS button using Web Speech API
   - Loading/error states
6. Register /random-ayah route in App.tsx
