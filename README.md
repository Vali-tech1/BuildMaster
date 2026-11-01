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

Këto pika përshkruajnë fushëveprimin e MVP-së, jo domosdoshmërisht funksione tashmë të implementuara. Në gjendjen aktuale të kodit, aplikacioni paraqet një pamje demonstrative me të dhëna statike të projektit; raportimi ditor, fotografitë dhe regjistrimi i shpenzimeve mbeten pjesë e MVP-së së planifikuar.

## Funksionalitete të planifikuara për versionet e ardhshme

- Ndihma e inteligjencës artificiale për përgatitjen e përshkrimeve të raporteve.
- Gjenerimi i raporteve javore, mujore dhe vjetore.
- Raportimi dhe analizimi financiar i avancuar.

Këto funksionalitete janë ide për zhvillim të ardhshëm dhe nuk paraqiten si të implementuara në versionin fillestar.

## Harta e produktit

Shih [HARTA.md](./HARTA.md) për fushëveprimin e MVP-së dhe funksionalitetet e planifikuara.

## Teknologjitë dhe nisja e aplikacionit

Projekti përdor Expo, React Native, TypeScript dhe Expo Router.

Për ta nisur aplikacionin:

```bash
npm install
npx expo start
```
