# Deployment Guide

## 1. Pre-Deployment Verification

Run the full gate and inspect the output. Do not deploy on a guess.

```bash
npm ci
npm run typecheck
npm run lint
npm test
npm run build
```

Verified results for this repository:

| Check | Result |
| :--- | :--- |
| `npm run typecheck` | PASS — 0 errors (strict) |
| `npm run lint` | PASS — 0 errors, 0 warnings |
| `npm test` | PASS — 186 tests across 4 files |
| `npm run build` | PASS — 1657 modules in ~5–6 s |
| Bundle | ~245 kB gzipped initial; Firebase SDK isolated in its own 112 kB gzip chunk |

Then complete the manual QA checklist in [`TESTING.md`](TESTING.md#6-manual-qa-checklist-before-a-release)
and the rules review checklist in [`TESTING.md`](TESTING.md#53-rules-review-checklist).

### Pre-flight safety check

```bash
# No secrets tracked?
git grep -nE "(BEGIN PRIVATE KEY|private_key|firebase-adminsdk|serviceAccount)" -- . \
  || echo "clean: no secret material found"

# No .env tracked?
git ls-files | grep -E "(^|/)\.env$" && echo "STOP: .env is tracked" || echo "clean: no .env tracked"

# Build output not committed?
git ls-files | grep -E "^dist/" && echo "STOP: dist/ is tracked" || echo "clean: dist/ untracked"
```

---

## 2. Firebase Hosting (recommended, Spark free tier)

### First deployment

```bash
npx firebase-tools login
npx firebase-tools use your-project-id
npm run build
npx firebase-tools deploy --only hosting
npx firebase-tools deploy --only firestore:rules,firestore:indexes
```

### What `firebase.json` configures

- `public: "dist"` — the Vite output directory.
- SPA rewrite of `**` → `/index.html`, so deep links such as
  `/lessons/what-is-music-sound` resolve on a hard refresh.
- One-year immutable caching for hashed JS/CSS, which is what makes redeploys
  effectively instant for returning learners.
- Security headers: `X-Content-Type-Options: nosniff`,
  `X-Frame-Options: SAMEORIGIN`,
  `Referrer-Policy: strict-origin-when-cross-origin`, and
  `Permissions-Policy: microphone=(self), camera=(), geolocation=()`.
  The microphone allowance is required by the Audio Visualizer; camera and
  geolocation are denied outright.

### Preview channels

```bash
npx firebase-tools hosting:channel:deploy staging --expires 7d
```

Each channel gets its own URL and its own 7-day lifetime, so you can share a
build for review without touching production. **Deploy to production only after
explicit authorisation**, and record the resulting URL and its verification
result.

### Quota headroom

| Limit | Allowance | Aura's usage | Headroom |
| :--- | :--- | :--- | :--- |
| Hosting storage | 10 GB | ~2 MB | 5,000× |
| Hosting transfer | 360 MB/day | ~245 kB/visit | ~1,470 visits/day |
| Firestore reads | 50,000/day | ~25/session | ~2,000 sessions/day |
| Firestore writes | 20,000/day | ~3/session | ~6,600 sessions/day |

Exceeding Spark limits pauses the affected service until the next reset; it does
not create a bill. The app degrades to bundled seed data if Firestore becomes
unavailable, so lessons and labs keep working.

### Rollback

```bash
npx firebase-tools hosting:rollback
```

Because asset filenames are content-hashed, a rollback cannot serve a stale
mismatch between `index.html` and its scripts.

---

## 3. Alternative Static Hosts

`dist/` is a plain static bundle. Any host that can serve SPA rewrites works.
The `firebase` npm package is only needed if you actually configure Firebase;
without it the build is self-contained and offline-capable.

### Netlify

`netlify.toml`:

```toml
[build]
  command = "npm run build"
  publish = "dist"

[[redirects]]
  from = "/*"
  to = "/index.html"
  status = 200

[[headers]]
  for = "/assets/*"
  [headers.values]
    Cache-Control = "public, max-age=31536000, immutable"
```

### Cloudflare Pages

Build command `npm run build`, output directory `dist`, and an SPA fallback rule
of `/* → /index.html` with status 200.

### GitHub Pages

Needs a router basename. In `src/app/router.tsx`, switch `createBrowserRouter`
to accept `{ basename: '/<repo-name>' }`, or use hash routing. Then publish
`dist/` from a GitHub Actions workflow.

### Nginx

```nginx
server {
  listen 80;
  root /var/www/aura/dist;
  index index.html;

  location /assets/ {
    add_header Cache-Control "public, max-age=31536000, immutable";
  }

  location / {
    try_files $uri $uri/ /index.html;
  }
}
```

---

## 4. Environment Variables in Production

Vite inlines `VITE_*` values at **build** time, so they must be present in the
build environment, not at runtime.

**Firebase Hosting / Netlify / Cloudflare Pages:** add the six `VITE_FIREBASE_*`
values to the build environment's variables, then trigger a new build.

**GitHub Actions:** if you ever need them in CI, add them as repository secrets.
Note that **CI in this repository does not deploy and uses no secrets** —
deployment is an explicit, human-authorised action.

**Never** add `GOOGLE_APPLICATION_CREDENTIALS`, service-account JSON, or any
private key to a build environment that produces client code.

---

## 5. Post-Deployment Smoke Tests

Run these against the deployed URL, signed out, in a private window.

**Routing and content**
- [ ] `/` loads and shows the hero and all nine levels.
- [ ] Hard-refreshing `/lessons/what-is-music-and-sound` returns the lesson, not a 404 (proves SPA rewrites).
- [ ] `/this-does-not-exist` shows the Sinhala 404 page.
- [ ] Search returns results for `compression` and for `ස්වර`.
- [ ] The Glossary loads and filters.
- [ ] Changing theme to light and reloading keeps the choice.

**Audio (must be produced by a user gesture — no autoplay)**
- [ ] Virtual Piano sounds on click, on tap, and on `A`/`S`/`D` keys.
- [ ] `/labs?tab=metronome` deep-links and its click is audible and steady.
- [ ] `/labs?tab=eq` audibly changes timbre when the low band moves from −12 to +12 dB.
- [ ] `/labs?tab=analyzer` reports duration and peak/RMS dBFS for a local file.
- [ ] Switching browser tabs mid-note leaves no stuck note.

**Accounts (when Firebase is configured)**
- [ ] Registration succeeds and `/my-learning` shows 0% progress.
- [ ] Marking a lesson complete raises the percentage by exactly `100 ÷ published lessons`.
- [ ] Signing out and back in preserves progress.
- [ ] A non-admin visiting `/admin` sees the permission-denied screen.

**Security**
- [ ] Deep-linking `/admin` while signed out redirects to `/login`.
- [ ] The browser console shows no errors on `/`, `/lessons/...` and `/labs`.
- [ ] `curl -I https://your-app.web.app` returns the configured security headers.

**Responsiveness**
- [ ] No horizontal scroll at 320 px, 768 px and 1440 px.
- [ ] The mobile navigation toggle opens and closes the menu.

Report the **actual** outcome of each item. If something fails, say so and
state the next step — never describe an unverified deployment as successful.

---

## 6. Cost Control

| Risk | Control |
| :--- | :--- |
| Accidental Blaze upgrade | Never add a billing account for a Spark deployment. |
| Runaway Firestore reads | `getDocs` only; every query has `limit()`; the catalogue is read once per session. |
| Bandwidth spikes | 360 MB/day hosting transfer with a ~245 kB page; consider a CDN in front of the app if traffic grows. |
| Storage growth | No user file uploads exist. The only writer of large data would be the admin CMS. |
| Log noise | No analytics or third-party scripts are included. |

---

## 7. CI

`.github/workflows/ci.yml` runs on every push and PR: install (cached), typecheck,
lint, test, build. It needs **no secrets** and therefore works safely on forks.

Firestore rules are intentionally **not** deployed from CI. Rule changes are
high-impact and must be reviewed by a human against the checklist in
`docs/TESTING.md` before deployment.
