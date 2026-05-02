# The Smart Mom — Life in Canada

Mom lifestyle & affiliate blog for Canadian moms.
Live at: **https://ahmedwasef.github.io/smart-mom-canada/**
Repository: **https://github.com/ahmedwasef/smart-mom-canada**

---

## Stack

| Layer | Technology |
|---|---|
| Framework | React 19 + Vite 8 |
| Animation | Framer Motion 12 |
| Deployment | GitHub Pages (gh-pages npm package) |
| Forms | Formspree (placeholder — update ID in App.jsx) |
| Fonts | Playfair Display + Inter (Google Fonts) |

No backend. No database. 100% static.

---

## Project Structure

```
smart-mom-canada/
├── src/
│   ├── App.jsx    — entire site (~840 lines, single file)
│   └── main.jsx   — React entry point
├── index.html     — SEO meta tags, Google Fonts link
├── vite.config.js — base: '/smart-mom-canada/'
├── package.json   — deploy script
└── CLAUDE.md      — this file
```

---

## Sections (scroll-based, no router)

| ID | Component | Notes |
|---|---|---|
| top | `AnnouncementBanner` | Rotating dismissible deals strip |
| — | `Nav` | Sticky, transparent→white on scroll |
| `#hero` | `Hero` | Rotating headline, seasonal badge, today's tip, stats |
| `#articles` | `FeaturedArticles` | 3 featured article cards |
| `#picks` | `MamaPicks` | 8 affiliate product cards, filterable |
| `#motherhood` | `BlogGrid` | All non-featured articles, filterable by category |
| `#savings` | `SavingsHub` | Interactive savings calculator + Canadian apps |
| `#garden` | `GardenFeature` | 6 plants with difficulty/time + seasonal tip |
| `#kitchen` | `KitchenSection` | 4 quick recipe cards |
| `#about` | `AboutSection` | Trust-building identity card + 4 values |
| `#newsletter` | `Newsletter` | Email capture via Formspree |
| — | `Footer` | 3-column links, social, affiliate disclaimer |

---

## Key Data Arrays in App.jsx

| Constant | Purpose |
|---|---|
| `ARTICLES` | 12 articles (3 featured, 9 in grid) — add real blog posts here |
| `PRODUCTS` | 8 affiliate product cards — replace `link` with your Amazon Associates URLs |
| `TIPS` | 7 daily tips (one per day of week, auto-rotates) |
| `CATS` | Category definitions with emoji and color |
| `SEASONS` | 4 seasonal garden tips (auto-detects current season) |
| `FORMSPREE` | Newsletter endpoint — replace with your real Formspree form ID |

---

## Color Palette

```
Background cream:  #FDFAF6
Background alt:    #F5EFE6
Dark hero:         #0F0C08
Terracotta:        #C4785A  (primary — CTAs, tags)
Sage green:        #6A9470  (garden, secondary)
Warm gold:         #D4A853  (accents, stars, season badge)
Text:              #2D2926
Muted:             #9A8E88
```

---

## Affiliate Setup

To activate affiliate income:

1. Sign up for **Amazon Associates Canada** at affiliate-program.amazon.ca
2. Open `src/App.jsx` and find the `PRODUCTS` array (~line 64)
3. Replace each `link: 'https://www.amazon.ca'` with your tracking URL:
   ```js
   link: 'https://www.amazon.ca/dp/ASIN?tag=YOUR-TAG-20'
   ```
4. Run `npm run deploy`

Other affiliate programs to add:
- **Walmart Canada** — affiliates.walmart.ca
- **IKEA Canada** — through Rakuten/CJ
- **Dollarama** — not available (direct link only)

---

## Adding Content

### Add a new article
In the `ARTICLES` array:
```js
{ id: 13, title: 'Your Article Title', cat: 'kitchen', readTime: 5, featured: false, tag: '🍽️ Kitchen', excerpt: 'Short preview text...', highlights: [], color: '#C4955A' }
```
Categories: `motherhood` | `organization` | `garden` | `kitchen` | `savings`

Set `featured: true` on up to 3 articles — they appear in the hero Featured section.

### Add a new product
In the `PRODUCTS` array:
```js
{ id: 9, name: 'Product Name', desc: 'Short description.', price: '$XX.XX', old: '$XX.XX', store: 'Amazon Canada', cat: 'kitchen', badge: '⭐ Label', rating: 4.7, reviews: '1,000', link: 'YOUR_AFFILIATE_URL', color: '#C4955A' }
```

### Update the announcement banner
In the `AnnouncementBanner` component, edit the `deals` array — each string rotates every 4 seconds.

### Update today's tip
Edit the `TIPS` array — index 0 = Sunday, 1 = Monday, ... 6 = Saturday.

---

## Deployment

```bash
npm run deploy
```
Runs `vite build` then `gh-pages -d dist`. Pushes built files to the `gh-pages` branch automatically.

### Vite config — critical
```js
base: '/smart-mom-canada/'   // Must match GitHub repo name
```

If you ever connect a custom domain (e.g. thesmartmom.ca):
1. Change `base: '/'` in `vite.config.js`
2. Add a `public/CNAME` file containing your domain
3. Update all canonical/OG URLs in `index.html`

---

## Custom Domain (Future)

To connect a domain like `thesmartmom.ca`:
1. `vite.config.js` → `base: '/'`
2. Create `public/CNAME` with content `thesmartmom.ca`
3. At your DNS registrar add:
   - A records → 185.199.108-111.153
   - CNAME www → ahmedwasef.github.io
4. `npm run deploy`

---

## Formspree

Newsletter and any contact forms use Formspree.
Current ID: `placeholder` — replace in `App.jsx` line 5:
```js
const FORMSPREE = 'https://formspree.io/f/YOUR_REAL_ID'
```
Sign up free at formspree.io.

---

## Git

Branch `main` — source code
Branch `gh-pages` — built site (managed by gh-pages package, never edit manually)
