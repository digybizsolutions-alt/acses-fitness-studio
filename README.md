# ACSES Fitness Studio — Website

Premium, cinematic marketing site for **ACSES Fitness Studio** (*A Soul of Healthy body and Wellness*), built from
`ACSES_Fitness_Studio_Website_Requirements.docx` v1.0.

- **Stack:** React 18 + TypeScript + Vite, React Router, plain Three.js (lazy-loaded hero), Lucide icons, CSS design tokens.
- **Lead capture:** Google Apps Script Web App → private Google Sheet.
- **Hosting:** any static host (Netlify, Vercel, Cloudflare Pages).

---

## 1. Local setup

```bash
npm install
cp .env.example .env.local   # then edit values
npm run dev                  # http://localhost:5173
npm run build                # typecheck + production build → dist/
npm run preview              # serve dist/ locally
```

Requires Node 18+.

## 2. Environment variables

| Variable | Purpose |
| --- | --- |
| `VITE_LEAD_ENDPOINT` | Public Apps Script Web App `/exec` URL. Empty in dev = simulated "demo" submission; empty in production = the form shows a safe error. |
| `VITE_SITE_URL` | Production origin (no trailing slash) for canonical + `og:url`. |
| `VITE_SHOW_DRAFTS` | `true` shows unconfirmed content with yellow **"Awaiting confirmation"** badges (review/staging). `false` hides everything not marked `verified: true` (**use for production**). |

No secrets belong in the frontend. The Apps Script URL is public by design; the script validates every request.

## 3. Content — edit without touching layouts

All business content lives in `src/content/`:

| File | What it holds |
| --- | --- |
| `siteConfig.ts` | Address, phone, WhatsApp, email, hours, Maps URLs, social URLs, privacy contact/retention, trial flag |
| `services.ts` | Programme cards (title, summary, detail, focus tags) |
| `coaches.ts` | Team profiles (name, role, **approved** qualifications, portrait) |
| `testimonials.ts` | Approved testimonials (need `verified`, `consentOnFile`, and `sourceUrl` for Google reviews) |
| `gallery.ts` | Curated local gallery images in `public/images/` |
| `faqs.ts` | FAQ questions/answers |
| `approach.ts` | Assess → Plan → Coach → Review process, coaching pillars, brand values |

**Publishing rule:** every item has `verified: boolean`. Set it to `true` only after ACSES confirms the item in writing.
Testimonials are never shown as drafts — fake social proof never appears, even in preview.
Sections with no publishable content (e.g. coaches, FAQ) hide themselves automatically.

If you rename/add a service, also update `ALLOWED_INTERESTS` in `apps-script/Code.gs`.

## 4. Google Sheet + Apps Script setup

1. **Create the sheet.** In Google Drive create a spreadsheet (e.g. *ACSES Leads*). Keep it private — share only with staff who need it.
   Copy its ID from the URL: `https://docs.google.com/spreadsheets/d/<SPREADSHEET_ID>/edit`.
2. **Create the script.** Go to <https://script.google.com> → *New project* → name it *ACSES Lead Capture*.
   Replace `Code.gs` with the contents of `apps-script/Code.gs`.
3. **Configure.** *Project Settings → Script properties* → add
   - `SPREADSHEET_ID` = the ID from step 1
   - `SHEET_NAME` = `Leads` (optional)
   - `RATE_LIMIT_MAX` = `3` (optional, submissions per phone per hour)
4. **Initialise.** In the editor select the `setup` function → *Run* → approve permissions. This creates the `Leads` tab with the header row:
   `Timestamp | Lead ID | Full Name | Phone | Email | Interested In | Preferred Contact | Preferred Time | Message | Consent | Source Page | UTM Source | UTM Medium | UTM Campaign | Status`
5. **Deploy.** *Deploy → New deployment → Web app* — *Execute as:* **Me**, *Who has access:* **Anyone**. Copy the `/exec` URL.
6. **Connect.** Set `VITE_LEAD_ENDPOINT=<the /exec URL>` in your host's environment variables and rebuild.
7. **Updating the script** later: *Deploy → Manage deployments → Edit → New version* (keeps the same URL).

### API contract

`POST <VITE_LEAD_ENDPOINT>` with `Content-Type: text/plain` and a JSON body:

```json
{ "fullName": "", "phone": "", "email": "", "interestedIn": "", "preferredContact": "WhatsApp",
  "preferredTime": "", "message": "", "consent": true, "sourcePage": "/contact",
  "utmSource": "", "utmMedium": "", "utmCampaign": "", "honeypot": "" }
```

Success `{ "ok": true, "leadId": "ACSES-YYYYMMDD-XXXXXX" }` · Error `{ "ok": false, "message": "Unable to submit enquiry." }`

`text/plain` keeps the request a CORS "simple request" (Apps Script cannot answer preflight `OPTIONS`). Apps Script replies via a redirect to
`script.googleusercontent.com`, which `fetch` follows and which permits reading the JSON.

### Server-side protections

- Field allow-list, required fields, length limits, phone/email format, allowed option values
- Consent must be `true`; non-empty honeypot is silently discarded
- Formula-injection neutralised (`=`, `+`, `-`, `@`, tab, CR prefixed with `'`)
- Server timestamp, `LockService` around writes, per-phone hourly rate limit via `CacheService`
- Minimal error messages; no personal data logged

**Limitations:** a public Apps Script endpoint is a lightweight lead backend, not a CRM. If spam or volume grows, add a CAPTCHA
(e.g. Cloudflare Turnstile verified in the script) or move to a server-side proxy/serverless function with stronger abuse controls.

## 5. Testing

- `npm run build` — TypeScript check + production bundle.
- Form (dev, no endpoint): submit empty → inline errors + summary + focus on first invalid field; valid submit → loading → success.
- Form (with endpoint): submit a test enquiry → row appears in **Leads** with server timestamp, Lead ID, source page, UTMs (try `/?utm_source=test`).
- Server rejection checks (e.g. with curl): missing consent, invalid phone, unknown `interestedIn`, honeypot filled → no row written.
- Accessibility: keyboard through header, mobile menu (Esc closes, focus trapped), FAQ, form. Enable *Reduce motion* in the OS → static hero poster, no reveal motion.
- Responsive: 360, 390, 768, 1024, 1440 px.

## 6. Deployment

`npm run build` and publish `dist/`.

- **Netlify:** build `npm run build`, publish `dist`. `public/_redirects` handles SPA routes.
- **Vercel:** framework *Vite*. `vercel.json` handles SPA routes.
- **Cloudflare Pages:** build `npm run build`, output `dist` (SPA fallback is automatic).

Set `VITE_LEAD_ENDPOINT`, `VITE_SITE_URL` and `VITE_SHOW_DRAFTS=false` in the host's environment for production.
Before launch, replace `https://www.example.com` in `public/robots.txt` and `public/sitemap.xml`.

## 7. 3D hero

`src/components/Hero3D/` — a brushed-metal weight-plate ring, red orbit and restrained red light sweep around the **real supplied logo**
(used as a texture, never redrawn). Three.js is code-split and imported on idle after first paint; DPR capped (1.75 desktop / 1.25 mobile),
simplified geometry on phones, rendering paused when offscreen or the tab is hidden. With no WebGL or with `prefers-reduced-motion`,
a CSS poster with the same treatment is shown.

## 8. Outstanding client inputs

The build ships with placeholders for everything not yet verified. ACSES to supply/confirm:

- [ ] **High-resolution logo** (SVG or ≥1000 px PNG). Only a 150 × 150 JPEG was supplied; it softens at large sizes.
- [ ] Official Instagram, LinkedIn and Google Business Profile URLs (+ permission to reuse media)
- [ ] Studio address, phone, WhatsApp, email, opening hours, Google Maps link/embed
- [ ] Final list of services currently offered (and scope of physiotherapy / nutrition, if any)
- [ ] Team names, roles, bios, qualifications and approved portraits
- [ ] Approved real testimonials / reviews with consent
- [ ] Approved high-resolution studio and training photos/video (hero, gallery, programmes)
- [ ] Trial / membership details (enables a trial CTA via `siteConfig.trialAvailable`)
- [ ] FAQ answers approval; process wording (Assess → Plan → Coach → Review)
- [ ] Privacy contact route + retention period
- [ ] Google account to own the Sheet and Apps Script deployment
- [ ] Production domain; analytics provider choice (none installed — add only with consent handling)
- [ ] LocalBusiness / SportsActivityLocation structured data — add once address, phone and hours are verified
