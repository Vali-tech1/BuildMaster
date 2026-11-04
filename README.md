# BuildMaster

**Sistem inteligjent për menaxhimin e kompanive ndërtimore**

BuildMaster është projekt universitar për një aplikacion mobil që synon t’i ndihmojë ekipet e projekteve ndërtimore të përcjellin punimet, të raportojnë aktivitetet ditore dhe të kenë pasqyrë më të qartë të shpenzimeve.

## Problemi dhe hulumtimi

Në tri intervista me një menaxher projekti, një përgjegjës kantieri dhe një pronar të kompanisë ndërtimore u përmendën vështirësi në përcjelljen e vazhdueshme të progresit, mungesë llogaridhënieje kur menaxheri nuk është në kantier, kohë e humbur në përgatitjen manuale të raporteve ditore dhe sfida në kontrollin e shpenzimeve të paplanifikuara. Intervistat theksuan gjithashtu dobinë e fotografive me raportet e punës dhe rëndësinë e transparencës financiare.

Këto janë gjetje nga tri intervistat, jo pretendime për të gjitha kompanitë ndërtimore. Përgjigjet e plota gjenden te [BISEDAT.md](./BISEDAT.md).

## Përdoruesit e synuar

- Menaxherët e projekteve ndërtimore
- Përgjegjësit e kantierit
- Pronarët e kompanive ndërtimore

## Qëllimi dhe MVP-ja

Qëllimi i BuildMaster është ta bëjë më të lehtë ndjekjen e punëve në kantier dhe ndarjen e informacionit mes ekipit të projektit. MVP-ja e planifikuar përfshin:

- Përcjelljen ditore të progresit të ndërtimit.
- Raportimin e aktiviteteve ditore në kantier.
- Bashkëngjitjen e fotografive në raportet e punimeve.
- Historikun e progresit të projektit.
- Pasqyrën e shpenzimeve të projektit, përfshirë shpenzimet e paplanifikuara të regjistruara.

Këto pika përshkruajnë fushëveprimin e MVP-së, jo domosdoshmërisht funksione tashmë të implementuara. Aplikacioni lexon projektet nga tabela `public.projects` në Supabase dhe shfaq statusin, progresin dhe financat. Tabela, politikat RLS dhe të dhënat shembull duhet të krijohen nga Supabase SQL Editor duke përdorur [supabase/setup.sql](./supabase/setup.sql). Raportimi ditor dhe bashkëngjitja e fotografive nuk janë implementuar ende.

## Funksionalitete të planifikuara për versionet e ardhshme

- Ndihma e inteligjencës artificiale për përgatitjen e përshkrimeve të raporteve.
- Gjenerimi i raporteve javore, mujore dhe vjetore.
- Raportimi dhe analizimi financiar i avancuar.

Këto funksionalitete janë ide për zhvillim të ardhshëm dhe nuk paraqiten si të implementuara në versionin fillestar.

## Harta e produktit

Shih [HARTA.md](./HARTA.md) për fushëveprimin e MVP-së dhe funksionalitetet e planifikuara.

## Teknologjitë dhe nisja e aplikacionit

Projekti përdor Expo, React Native, TypeScript, Expo Router dhe `@supabase/supabase-js`.

### Konfigurimi i Supabase

1. Në Supabase Dashboard të projektit ekzistues, kontrollo nëse `public.projects` ekziston dhe verifiko kolonat/politikat e saj para se të krijosh tabelë. Mos vazhdo pa përshtatur skriptet nëse tabela ka skemë tjetër ose nëse ka politika leximi më të gjera; politikat RLS lejuese bashkohen me OR.
2. Nëse nuk ekziston, ose përputhet me skemën e demonstrimit, ekzekuto fillimisht `supabase/setup.sql` e pastaj `supabase/seed.sql` në SQL Editor. Skriptet krijojnë tabelën, aktivizojnë RLS, lejojnë lexim anonim vetëm të rreshtave `is_demo = true` dhe shtojnë pesë projekte fiktive pa dublikatë.
3. Në `.env` lokal vendos çelësin publishable (ose legacy anon) të këtij projekti te `EXPO_PUBLIC_SUPABASE_ANON_KEY`. Në një klon të ri, përdor `.env.example` si model dhe vendos edhe URL-në e projektit. Mos përdor kurrë `service_role` ose çelës sekret në aplikacion; `.env` përjashtohet nga Git.
4. Rinis Expo pas ndryshimit të `.env`. Për telefonin fizik, sigurohu që iPhone dhe kompjuteri janë në të njëjtin rrjet ose përdor `--tunnel`.

Politika anon është vetëm për të dhëna fiktive demo. Para përdorimit real duhen autentikimi dhe politika aksesi sipas kompanisë; mos ekspozo të dhëna reale me leje publike.

Për ta nisur aplikacionin:

SDK 58 kërkon version të mbështetur të Node.js. Përdor Node.js 24.3 ose më të ri në linjën 24 LTS; Node.js 25 nuk mbështetet.

```bash
npm install
npx expo start --clear --tunnel
```

Ekzekuto komandat nga dosja rrënjësore e projektit dhe skano kodin QR në Expo Go në iPhone.
