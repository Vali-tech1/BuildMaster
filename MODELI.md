# MODELI

## Kush sheh çka

| Tabela          | Kush lexon            | Kush shton            | Kush ndryshon         | Arsye |
|-----------------|-----------------------|-----------------------|-----------------------|-------|
| public.projects | Vetëm pronari i rreshtit (pronari_id = auth.uid()) | Çdo përdorues i kyçur, rreshti i takon atij | Vetëm pronari | Çdo përdorues duhet të shohë vetëm projektet e veta; pa hyrë, askush nuk lexon asgjë |

Roli anon nuk ka asnjë qasje. Policy-të janë "to authenticated".
pronari_id vendoset nga serveri (default auth.uid()); aplikacioni nuk e dërgon.
Nuk përdorim role në user_metadata, sepse e ndryshon vetë përdoruesi.
Nuk ka ende rol admin (hapi E nuk është bërë).

## Përdorimi i AI-t

Çka pyetëm AI-n:
- Si të lidhim Supabase Auth (signUp, signInWithPassword, signOut, getSession).
- Si ta ndajmë _layout.tsx me Stack.Protected.
- Si të rregullojmë gabimet TypeScript dhe gabimin "Invalid API key".

Çka mbajtëm:
- Kodin e hyrjes pasi e lexuam diff-in.
- Policy-të RLS i shkruam vetë, pa AI.

