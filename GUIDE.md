# BAO:G — Setup Guide (Roman Urdu)

## Phase 1 — Code upload (website abhi Under Construction dikhayegi)
1. Is zip ko unzip karke apni GitHub repo mein purani files ki jagah upload/replace karein (`node_modules` aur `dist` upload nahi karne).
2. Vercel apne aap redeploy karega. Link kholein: Under Construction page nazar aana chahiye. ✔

## Phase 2 — Admin password
1. Vercel → Project → Settings → Environment Variables.
2. Name: `ADMIN_PASSWORD` — Value: apna mazboot password. Save.
3. Deployments → latest → ⋯ → Redeploy.
4. `aapka-link.vercel.app/admin` kholein aur login karein.

## Phase 3 — Database (taake admin ki changes save rahein)
1. Vercel → Project → Storage → Create / Marketplace → **Upstash Redis** (Free plan) → Connect to project.
2. Environment variables khud add ho jayenge. Phir Redeploy karein.
3. Admin mein "Database connect nahi" wali warning gayab ho jani chahiye.

## Phase 4 — Content bharna
Admin mein: Site & Contact (asli phone/email/address), Food Menu, Pages, Gallery (image URL), Blog.
`Preview site` button se poori site dekhein — visitors ko abhi bhi Under Construction nazar aayega.

## Phase 5 — Go Live
Admin → Dashboard → **Go Live**. Wapas Under Construction ke liye wohi button dobara.

## Madad
- Naya page: Pages → Add → slug likhein (e.g. `events`), phir Menu (Navigation) mein `/events` ka item add karein.
- Blog: Menu (Navigation) mein `Blog` → `/blog` add karein; posts "Blog" tab mein.
- Images: abhi URL se lagti hain (ya file `public/` folder mein daal kar `/naam.jpg` likhein).
