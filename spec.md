# Lightway – Version 4

## Current State
- Islamic app with: Namaz vaxtları, Quran, Qiblə, Kitabxana, Ərəbcə bölmələri
- BottomNav has 6 items (Home, Namaz, Quran, Qiblə, Kitab, Ərəbcə)
- Azan/İqamə audio in QiblaPage uses archive.org URLs which are failing
- No Night Mode toggle
- No Tasbeh, Günlük Plan, Əhval Rəhbərliyi, or İcma Duası modules
- Backend has Books, UserProfiles, HTTP outcalls, auth, blob storage

## Requested Changes (Diff)

### Add
- **Night Mode toggle** in MobileHeader – persists via localStorage, applies `dark` class to `<html>`
- **New route `/extras`** → `ExtrasPage` – a hub page with cards for 4 sub-modules
- **New route `/tasbeh`** → `TasbehPage` – digital tasbih counter (tap to count, presets 33/99/custom, vibration, daily save to localStorage)
- **New route `/daily-plan`** → `DailyPlanPage` – daily spiritual plan (1 random ayah, 1 random dua, 33 zikr task, checkbox completion, reset daily, localStorage persistence)
- **New route `/mood-guidance`** → `MoodGuidancePage` – mood-based guidance (stress/fear/confusion emoji selector, returns ayah+dua+zikr from predefined mapping)
- **New route `/community-dua`** → `CommunityDuaPage` – community dua feed (submit anonymous dua, tap Amin, show amin count, backed by Motoko actor)
- **Backend**: Add `Dua` type, `submitDua`, `listDuas`, `aminDua` functions to main.mo
- **BottomNav**: Add 7th tab "Əlavələr" (Sparkles icon) at the end linking to `/extras`

### Modify
- **QiblaPage.tsx**: Replace archive.org azan/iqama URLs with reliable alternatives (cdn.islamic.network or qurancdn.com), improve error handling, add user-friendly error UI
- **App.tsx**: Register 5 new routes
- **MobileHeader.tsx**: Add night mode toggle button (sun/moon icon)
- **index.css**: Add dark mode CSS variables and `.dark` class overrides for calm night palette (deep navy/dark bg, gold accents, soft glow)

### Remove
- Nothing removed

## Implementation Plan
1. Update `main.mo` to add Community Dua (submitDua, listDuas, aminDua)
2. Update `App.tsx` to add new routes
3. Create `ExtrasPage.tsx` as hub for 4 modules
4. Create `TasbehPage.tsx` with counter, presets, vibration
5. Create `DailyPlanPage.tsx` with local data, checklist
6. Create `MoodGuidancePage.tsx` with mood emoji selector and predefined mapping
7. Create `CommunityDuaPage.tsx` with backend integration
8. Update `BottomNav.tsx` to add Əlavələr tab
9. Update `MobileHeader.tsx` to add night mode toggle
10. Update `index.css` to add dark mode support
11. Fix Azan/İqamə audio URLs in `QiblaPage.tsx`
