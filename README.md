# Farm House Bradford Restaurant – Website + Admin Dashboard

React (Vite) website + admin dashboard. Database, login aur image storage ke liye **Supabase** (free plan se start ho jata hai). Hosting **Vercel**.

Site ke pages: Home, About Us, Menu, Gallery, Booking, Franchise, Contact Us, Blog.
Admin: `https://your-site.vercel.app/admin` (public site par admin ka koi button nahi hai).

---

## 1) Supabase project banayen
1. https://supabase.com par account banayen > **New project**.
2. Name: `farm-house-bradford`, ek strong database password set karein (save kar lein), region apne nazdeek chunein.
3. Project tayar hone mein 1-2 minute lagte hain.

## 2) Database tables banayen
1. `supabase/schema.sql` file kholen.
2. Us mein `YOUR_ADMIN_EMAIL` ko apni admin email se replace karein (sirf **ek jagah** hai, `is_admin()` function mein). Yehi email aap Step 3 mein user banane ke liye use karenge.
3. Supabase > **SQL Editor** > **New query** > poori file paste karein > **Run**.
4. "Success" aana chahiye. Is se tables, security rules aur `media` image bucket ban jate hain.

## 3) Admin user banayen aur signup band karein
1. Supabase > **Authentication** > **Users** > **Add user** > *Create new user*.
2. Wohi email (Step 2 wali) aur ek strong password dein. **Auto Confirm User** ON rakhein.
3. Authentication ki settings mein jaa kar **"Allow new users to sign up"** ko **OFF** karein
   (Supabase ke menu ke naam thore alag ho sakte hain: Sign In / Providers ya Settings ke andar dhoondein).
   Is se koi aur account nahi bana sakta.

Security: admin sirf wohi hai jis ki email `is_admin()` mein likhi hai. Agar koi aur bhi login kar le, database use likhne nahi dega.

## 4) Keys copy karein
Supabase > **Project Settings** > **API**:
- **Project URL**
- **anon / publishable key** (public key hai, frontend mein use hoti hai)

`.env.example` ko copy karke `.env` banayen:
```
VITE_SUPABASE_URL=https://xxxxxxxxxxxx.supabase.co
VITE_SUPABASE_ANON_KEY=aapki-anon-ya-publishable-key
```
**service_role / secret key kabhi bhi is project mein na daalein.**

## 5) Apne computer par chalayen
```
npm install
npm run dev
```
- Website: http://localhost:5173
- Admin: http://localhost:5173/admin

## 6) GitHub aur Vercel par lagayen
1. Is folder ki files apne GitHub repo mein replace karke push karein (`.env` push nahi hoti, `.gitignore` mein hai).
2. Vercel > Project > **Settings > Environment Variables** mein wohi 2 variables add karein:
   `VITE_SUPABASE_URL` aur `VITE_SUPABASE_ANON_KEY`.
3. **Deployments** mein jaa kar **Redeploy** karein (env variables naye build mein hi aate hain).
4. `vercel.json` pehle se hai, is liye `/menu`, `/admin` jaise links refresh par bhi chalte hain.

## 7) Dashboard kaise use karein
Pehli baar login ke baad site **Under construction** mein hogi (visitors ko sirf Coming Soon nazar aata hai).

| Section | Kya karta hai |
|---|---|
| Overview | Site status, naye bookings/messages ki ginti |
| **Site Mode** | **Make site live / Put under construction** ka button + Coming Soon page ka text |
| General & Branding | Logo, naam, colours, phone/email/address/hours, Google Maps, SEO |
| Header & Menu | Menu items rename/hide/order, naye links, header button |
| Footer | About text, links, social media, copyright |
| Pages Content | Har page ka heading, text, images |
| Menu Items | Categories aur dishes (photo, price, available on/off) |
| Gallery | Photos upload (ek sath kai), caption, delete |
| Blog | Posts likhna, draft/publish |
| Bookings | Booking requests, status (new / confirmed / cancelled) |
| Messages | Contact aur Franchise form ke messages |
| Account | Password change |

Tips:
- Jo cheez khali chhori jaye (phone, address, text, photo) woh website par dikhai hi nahi deti. Is liye fake content ki zarurat nahi.
- Under construction mein bhi aap login ho kar poori site preview kar sakte hain (upar ek preview bar aati hai).
- **Blog** ka link header mein pehle se hidden hai. Pehla post likhne ke baad Header & Menu se "Show" ON karein.
- Bari photos upload par khud chhoti (max 1600px) ho jati hain taake site tez rahe.

## 8) Domain lagana (jab client de)
Vercel > Project > Settings > **Domains** mein domain add karein aur Vercel ki batayi DNS settings apne domain provider par lagayen.

## Masle aur hal
- **Login ho jata hai magar Save par error "row-level security"**: SQL mein jo email likhi thi aur jis email se login kiya, dono alag hain. Sahi email se `create or replace function public.is_admin()` wala hissa dobara Run karein.
- **Image upload nahi ho rahi**: SQL poori Run hui? Supabase > Storage mein `media` bucket (Public) hona chahiye.
- **Site par "Under construction" hi aa raha hai**: Admin > Site Mode > Make site live.
- **Admin page par "Database not connected"**: `.env` / Vercel variables check karein aur Redeploy karein.
- **Supabase free plan**: agar kai din koi activity na ho to project pause ho sakta hai. Live site ke liye Supabase dashboard mein plan/pause settings dekh lein.
