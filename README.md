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

Këto pika përshkruajnë fushëveprimin e MVP-së, jo domosdoshmërisht funksione tashmë të implementuara. Aplikacioni lexon dhe shfaq projektet nga tabela `public.projects` në Supabase. Tabela dhe pesë projektet fiktive u krijuan në projektin ekzistues Supabase më 4 nëntor 2026. Aplikacioni tani kërkon llogari; qasja private e projekteve varet nga politikat RLS të hapit 6, të cilat ende duhen shkruar dhe aplikuar në Supabase. Raportimi ditor dhe bashkëngjitja e fotografive nuk janë implementuar ende.

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

1. Tabela `public.projects` u krijua, ndërsa pesë projektet demo u futën dhe u verifikuan në Supabase project `jypqnczqqgtaaocjlcao`. Migrimi `supabase/migrations/20261104120000_create_projects.sql` pasqyron konfigurimin e javës 5 dhe krijon qasje anon; mos e ekzekuto sërish pas kalimit te hyrja. `supabase/setup.sql` krijon tabelën pa qasje anon, por kërkon politikat e autentikuara para se aplikacioni të lexojë/shkruajë.
2. Në `.env` lokal, `EXPO_PUBLIC_SUPABASE_URL` dhe çelësi publishable (ose legacy anon) te `EXPO_PUBLIC_SUPABASE_ANON_KEY` duhet të jenë të vendosur. Në klon të ri përdor `.env.example` si model. Mos përdor kurrë çelësin sekret (admin) në aplikacion; .env përjashtohet nga Git.
3. Për testim me llogari sintetike, çaktivizo përkohësisht **Confirm email** te Supabase → Authentication → Sign In / Providers → Email. Aktivizoje sërish para përdoruesve realë. Rinis Expo pas ndryshimit të `.env`; për telefonin fizik, sigurohu që telefoni dhe kompjuteri janë në të njëjtin rrjet ose përdor `--tunnel`.

4. Ndiq `supabase/j6-hyrja-rls.sql`: zëvendëso email-in shembull me llogarinë që do të marrë rreshtat ekzistues. Shkruaj vetë politikat SELECT, INSERT dhe UPDATE për `authenticated` me `auth.uid()` përpara se ta ekzekutosh. Pa to, aplikacioni duhet të marrë `permission denied` dhe nuk do të lexojë rreshta. Rreshtat e rinj nuk dërgojnë `pronari_id`; baza e vendos atë.

Autentikimi, sesioni i ruajtur lokalisht dhe hyrja/dalja janë implementuar. Nuk ka autorizim sipas kompanisë, role përdoruesish, raporte ditore ose ngarkim fotografish.

Për ta nisur aplikacionin:

SDK 58 kërkon version të mbështetur të Node.js. Përdor Node.js 24.3 ose më të ri në linjën 24 LTS; Node.js 25 nuk mbështetet.

```bash
npm install
npx expo start --clear --tunnel
```

Ekzekuto komandat nga dosja rrënjësore e projektit dhe skano kodin QR në Expo Go në iPhone.
