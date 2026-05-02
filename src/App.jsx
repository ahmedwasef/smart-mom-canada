import { useState, useEffect, useRef, useMemo } from 'react'
import { motion, AnimatePresence, useInView } from 'framer-motion'

// ─── Constants ────────────────────────────────────────────────────────────────
const FORMSPREE = 'https://formspree.io/f/placeholder'

const C = {
  bg: '#FDFAF6',
  bgAlt: '#F5EFE6',
  hero: '#0F0C08',
  primary: '#C4785A',
  sage: '#6A9470',
  gold: '#D4A853',
  text: '#2D2926',
  muted: '#9A8E88',
  border: 'rgba(196,120,90,0.18)',
  borderLight: 'rgba(196,120,90,0.10)',
  white: '#FDFAF6',
}

const font = { head: "'Playfair Display', Georgia, serif", body: "'Inter', sans-serif" }

const CATS = [
  { key: 'all', label: 'All Topics', emoji: '🍁', color: C.primary },
  { key: 'motherhood', label: 'Motherhood', emoji: '👶', color: '#C4785A' },
  { key: 'organization', label: 'Organization', emoji: '🏡', color: '#8B7A5A' },
  { key: 'garden', label: 'Gardening', emoji: '🌱', color: '#6A9470' },
  { key: 'kitchen', label: 'Kitchen', emoji: '🍽️', color: '#C4955A' },
  { key: 'savings', label: 'Savings', emoji: '💰', color: '#7A6A9E' },
]

const ARTICLES = [
  { id: 1, title: '5 Kitchen Gadgets Every Canadian Mom Swears By', cat: 'kitchen', readTime: 4, featured: true, tag: '💰 Affiliate', excerpt: 'These time-saving tools transformed my kitchen routine — all available on Amazon Canada with free Prime shipping.', highlights: ['Instant Pot saves 3+ hours/week', 'Air fryer = healthier kids meals', 'Meal prep containers under $30'], color: '#C4955A' },
  { id: 2, title: 'How to Grow Mint on Your Balcony in Canada', cat: 'garden', readTime: 6, featured: true, tag: '🌱 Garden', excerpt: 'Mint is the perfect starter plant for Canadian moms — grows fast, kids love picking it, nearly impossible to kill.', highlights: ['Grows in any container', 'Ready in 3–4 weeks', 'Kids love watering it'], color: '#6A9470' },
  { id: 3, title: 'The Complete Home Organization Guide for Small Apartments', cat: 'organization', readTime: 8, featured: true, tag: '🏡 Organization', excerpt: 'Transform any small space into an organized haven — room by room, step by step, on a real Canadian budget.', highlights: ['Under-bed storage bins', 'Command hooks everywhere', 'Clear container system'], color: '#8B7A5A' },
  { id: 4, title: 'Must-Have Products for a Child Under 3 (Actually Worth It)', cat: 'motherhood', readTime: 5, featured: false, tag: '👶 Motherhood', excerpt: 'After testing dozens of baby products, these are the 10 items that genuinely make daily life easier for Canadian moms.', highlights: [], color: '#C4785A' },
  { id: 5, title: 'How to Save $500/Month on Groceries in Canada', cat: 'savings', readTime: 7, featured: false, tag: '💰 Savings', excerpt: 'With grocery prices at record highs, these strategies are helping Canadian moms cut their food budget without sacrificing quality.', highlights: [], color: '#7A6A9E' },
  { id: 6, title: 'Gardening with Kids: 5 Plants Every Child Should Grow', cat: 'garden', readTime: 5, featured: false, tag: '🌱 Garden', excerpt: 'Growing plants together teaches patience, responsibility, and where food comes from — these 5 make it truly magical.', highlights: [], color: '#6A9470' },
  { id: 7, title: '15-Minute Healthy Dinners for Exhausted Moms', cat: 'kitchen', readTime: 4, featured: false, tag: '🍽️ Kitchen', excerpt: 'Real recipes under 15 minutes using ingredients from any Canadian grocery store that kids actually eat.', highlights: [], color: '#C4955A' },
  { id: 8, title: 'Best IKEA Products for Home Organization (Tried & Tested)', cat: 'organization', readTime: 5, featured: false, tag: '🏡 Organization', excerpt: 'I reorganized my entire home with IKEA products under $300. Here is exactly what I bought and where it went.', highlights: [], color: '#8B7A5A' },
  { id: 9, title: 'Building a Morning Routine That Works for Moms', cat: 'motherhood', readTime: 6, featured: false, tag: '👶 Motherhood', excerpt: 'This simple system takes 2 weeks to set up and makes every single morning smoother — even with toddlers.', highlights: [], color: '#C4785A' },
  { id: 10, title: 'Flyer Apps Every Canadian Mom Needs on Her Phone', cat: 'savings', readTime: 3, featured: false, tag: '💰 Savings', excerpt: 'Flipp, Reebee, PC Optimum — these apps combined save the average Canadian family $1,200+ per year on groceries.', highlights: [], color: '#7A6A9E' },
  { id: 11, title: 'Winter Balcony Garden: What to Grow When It Is Cold', cat: 'garden', readTime: 5, featured: false, tag: '🌱 Garden', excerpt: "You don't have to stop gardening in winter. These cold-resistant plants thrive in Canadian winters.", highlights: [], color: '#6A9470' },
  { id: 12, title: 'The $50 Kitchen Transformation from Dollarama', cat: 'organization', readTime: 4, featured: false, tag: '🏡 Organization', excerpt: 'With just $50 from Dollarama and Amazon I completely transformed my kitchen drawers and cabinets.', highlights: [], color: '#8B7A5A' },
]

const PRODUCTS = [
  { id: 1, name: 'Instant Pot Duo 7-in-1', desc: 'The #1 kitchen tool for busy moms. Cook dinner in under 30 minutes.', price: '$89.99', old: '$149.99', store: 'Amazon Canada', cat: 'kitchen', badge: '⭐ Best Seller', rating: 4.8, reviews: '47,823', link: 'https://www.amazon.ca', color: C.primary },
  { id: 2, name: 'SONGMICS Closet Organizer Set', desc: 'Transform any closet in 30 minutes. No tools needed. Stackable shelves.', price: '$34.99', old: '$54.99', store: 'Amazon Canada', cat: 'organization', badge: '🏡 Mom Favorite', rating: 4.6, reviews: '12,441', link: 'https://www.amazon.ca', color: C.sage },
  { id: 3, name: 'Herb Garden Starter Kit', desc: 'Grow basil, cilantro & mint indoors year-round. Perfect for Canadian balconies.', price: '$24.99', old: '$39.99', store: 'Amazon Canada', cat: 'garden', badge: '🌿 Fan Favorite', rating: 4.6, reviews: '5,672', link: 'https://www.amazon.ca', color: '#5A8A5A' },
  { id: 4, name: 'Ninja Air Fryer Max XL', desc: 'Healthier family meals, faster. Kids absolutely love air fryer food.', price: '$109.99', old: '$159.99', store: 'Amazon Canada', cat: 'kitchen', badge: '🔥 Hot Deal', rating: 4.8, reviews: '31,204', link: 'https://www.amazon.ca', color: '#C4955A' },
  { id: 5, name: 'Little Tikes Kids Garden Kit', desc: 'Perfect starter garden for kids 2+. Teaches, entertains and grows together.', price: '$29.99', old: '$44.99', store: 'Amazon Canada', cat: 'garden', badge: '👶 Kids Love It', rating: 4.7, reviews: '3,218', link: 'https://www.amazon.ca', color: '#5A8A5A' },
  { id: 6, name: 'Expandable Drawer Organizers (4-Pack)', desc: 'Finally organize your utensil drawer. Expandable to any cabinet size.', price: '$19.99', old: '$34.99', store: 'Amazon Canada', cat: 'organization', badge: '💰 Best Value', rating: 4.5, reviews: '22,108', link: 'https://www.amazon.ca', color: '#8B7A5A' },
  { id: 7, name: 'Graco Pack n Play Travel Dome', desc: 'Essential for moms on the go. Folds flat, sets up in 30 seconds.', price: '$129.99', old: '$189.99', store: 'Amazon Canada', cat: 'motherhood', badge: '💎 Premium Pick', rating: 4.9, reviews: '8,932', link: 'https://www.amazon.ca', color: C.primary },
  { id: 8, name: 'Fisher-Price Learning Toy Bundle', desc: 'Award-winning educational toys for ages 0–3. Stimulates brain development.', price: '$44.99', old: '$69.99', store: 'Amazon Canada', cat: 'motherhood', badge: '🎖️ Award Winner', rating: 4.9, reviews: '15,441', link: 'https://www.amazon.ca', color: '#C4785A' },
]

const TIPS = [
  { day: 0, tip: "Prep tomorrow's lunches tonight — saves 20 minutes every single morning.", emoji: '🕐' },
  { day: 1, tip: "Check Flipp every Sunday. Plan your meals around what is on sale this week.", emoji: '💰' },
  { day: 2, tip: "One drawer, one purpose. Label everything. 10 minutes now, hours saved later.", emoji: '🏡' },
  { day: 3, tip: "Water plants in the morning — afternoon watering can burn leaves in summer.", emoji: '🌱' },
  { day: 4, tip: "Batch cook Sundays: one big pot of rice + one protein = 5 easy weeknight dinners.", emoji: '🍽️' },
  { day: 5, tip: "PC Optimum + Flipp + Reebee = the holy trinity of Canadian grocery savings.", emoji: '🍁' },
  { day: 6, tip: "10-minute tidy-up game with your kids before bedtime. Mornings become magical.", emoji: '👶' },
]

const SEASONS = {
  winter: { name: 'Winter', emoji: '❄️', m: [11, 0, 1], tip: 'Grow herbs indoors under a grow light — mint and basil thrive even in Canadian winters.', color: '#7A9EBE' },
  spring: { name: 'Spring', emoji: '🌸', m: [2, 3, 4], tip: 'Start seedlings indoors 6–8 weeks before last frost (usually May in most of Canada).', color: '#C47A9E' },
  summer: { name: 'Summer', emoji: '☀️', m: [5, 6, 7], tip: 'Water in the morning to prevent mold. Canadian summers are perfect for tomatoes and herbs.', color: '#D4A853' },
  fall: { name: 'Fall', emoji: '🍂', m: [8, 9, 10], tip: 'Plant garlic in October for a summer harvest. It is the easiest thing you will ever grow.', color: '#C4785A' },
}

function getSeason() { const m = new Date().getMonth(); return Object.values(SEASONS).find(s => s.m.includes(m)) || SEASONS.fall }
function getTip() { return TIPS[new Date().getDay()] }

// ─── Shared ────────────────────────────────────────────────────────────────────
function Stars({ n = 5 }) {
  return <span style={{ color: C.gold, fontSize: 13 }}>{'★'.repeat(Math.floor(n))}{'☆'.repeat(5 - Math.floor(n))}</span>
}

function Tag({ children, color = C.primary }) {
  return (
    <span style={{ display: 'inline-flex', alignItems: 'center', gap: 4, fontSize: 11, fontWeight: 600, fontFamily: font.body, color, background: color + '18', border: `1px solid ${color}30`, borderRadius: 20, padding: '3px 10px', letterSpacing: 0.5, textTransform: 'uppercase', whiteSpace: 'nowrap' }}>
      {children}
    </span>
  )
}

function FadeIn({ children, delay = 0, y = 28 }) {
  const ref = useRef(null)
  const inView = useInView(ref, { once: true, margin: '-60px' })
  return (
    <motion.div ref={ref} initial={{ opacity: 0, y }} animate={inView ? { opacity: 1, y: 0 } : {}} transition={{ duration: 0.7, delay, ease: [0.22, 1, 0.36, 1] }}>
      {children}
    </motion.div>
  )
}

function SectionLabel({ children, light = false }) {
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 8 }}>
      <span style={{ display: 'block', width: 28, height: 2, background: C.gold, borderRadius: 2, flexShrink: 0 }} />
      <span style={{ fontFamily: font.body, fontSize: 11, fontWeight: 600, letterSpacing: 2.5, textTransform: 'uppercase', color: light ? C.gold : C.primary }}>
        {children}
      </span>
    </div>
  )
}

// ─── Nav ──────────────────────────────────────────────────────────────────────
function Nav({ scrolled }) {
  const [open, setOpen] = useState(false)
  const links = [
    { label: 'Motherhood', href: '#motherhood' },
    { label: 'Organization', href: '#organization' },
    { label: 'Garden', href: '#garden' },
    { label: 'Kitchen', href: '#kitchen' },
    { label: 'Savings', href: '#savings' },
  ]

  return (
    <motion.nav initial={{ y: -80 }} animate={{ y: 0 }} transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
      style={{ position: 'fixed', top: 0, left: 0, right: 0, zIndex: 100, background: scrolled ? 'rgba(253,250,246,0.97)' : 'transparent', backdropFilter: scrolled ? 'blur(16px)' : 'none', boxShadow: scrolled ? '0 1px 0 rgba(196,120,90,0.12)' : 'none', transition: 'all 0.35s ease', padding: '0 clamp(16px, 5vw, 60px)' }}>
      <div style={{ maxWidth: 1280, margin: '0 auto', display: 'flex', alignItems: 'center', justifyContent: 'space-between', height: 70 }}>
        <a href="#" style={{ textDecoration: 'none' }}>
          <div style={{ fontFamily: font.head, fontSize: 19, fontWeight: 700, color: scrolled ? C.text : C.white, lineHeight: 1 }}>The Smart Mom</div>
          <div style={{ fontFamily: font.body, fontSize: 9, fontWeight: 600, letterSpacing: 2.5, textTransform: 'uppercase', color: C.gold }}>Life in Canada 🍁</div>
        </a>
        <div style={{ display: 'flex', alignItems: 'center', gap: 28 }}>
          {links.map(l => (
            <a key={l.label} href={l.href} style={{ display: 'none', fontFamily: font.body, fontSize: 13, fontWeight: 500, color: scrolled ? C.muted : 'rgba(253,250,246,0.72)', textDecoration: 'none' }}>
              {l.label}
            </a>
          ))}
          <a href="#newsletter" style={{ fontFamily: font.body, fontSize: 13, fontWeight: 700, color: C.white, background: C.primary, padding: '9px 20px', borderRadius: 50, textDecoration: 'none' }}>
            🍁 Subscribe
          </a>
          <button onClick={() => setOpen(!open)} style={{ background: 'none', border: 'none', cursor: 'pointer', padding: 4, display: 'flex', flexDirection: 'column', gap: 5 }}>
            {[0, 1, 2].map(i => (
              <span key={i} style={{ display: 'block', width: 22, height: 2, background: scrolled ? C.text : C.white, borderRadius: 2, transition: 'all 0.25s', transform: open && i === 0 ? 'rotate(45deg) translate(5px, 5px)' : open && i === 1 ? 'scaleX(0)' : open && i === 2 ? 'rotate(-45deg) translate(5px, -5px)' : 'none' }} />
            ))}
          </button>
        </div>
      </div>
      <AnimatePresence>
        {open && (
          <motion.div initial={{ opacity: 0, y: -8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -8 }}
            style={{ background: C.bg, borderTop: `1px solid ${C.border}`, padding: '14px clamp(16px, 5vw, 60px) 20px' }}>
            {links.map((l, i) => (
              <motion.a key={l.label} href={l.href} initial={{ opacity: 0, x: -16 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.05 }}
                onClick={() => setOpen(false)}
                style={{ display: 'block', fontFamily: font.body, fontSize: 15, fontWeight: 500, color: C.text, textDecoration: 'none', padding: '11px 0', borderBottom: `1px solid ${C.borderLight}` }}>
                {l.label}
              </motion.a>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </motion.nav>
  )
}

// ─── Hero ─────────────────────────────────────────────────────────────────────
function Hero() {
  const season = getSeason()
  const tip = getTip()
  const [hIdx, setHIdx] = useState(0)
  const headlines = ['Smarter Living,\nHappier Family.', 'Every Mom\nDeserves Better.', 'Your Canadian\nLife, Simplified.']
  useEffect(() => {
    const t = setInterval(() => setHIdx(n => (n + 1) % headlines.length), 4200)
    return () => clearInterval(t)
  }, [])

  return (
    <section style={{ position: 'relative', minHeight: '100vh', display: 'flex', flexDirection: 'column', justifyContent: 'center', background: C.hero, overflow: 'hidden' }}>
      {/* Background glow orbs */}
      <div style={{ position: 'absolute', inset: 0, pointerEvents: 'none' }}>
        <div style={{ position: 'absolute', top: '5%', left: '0%', width: 600, height: 600, borderRadius: '50%', background: 'radial-gradient(circle, rgba(196,120,90,0.16) 0%, transparent 70%)', filter: 'blur(50px)' }} />
        <div style={{ position: 'absolute', bottom: '10%', right: '5%', width: 480, height: 480, borderRadius: '50%', background: 'radial-gradient(circle, rgba(106,148,112,0.12) 0%, transparent 70%)', filter: 'blur(50px)' }} />
        <div style={{ position: 'absolute', top: '45%', right: '25%', width: 300, height: 300, borderRadius: '50%', background: 'radial-gradient(circle, rgba(212,168,83,0.08) 0%, transparent 70%)', filter: 'blur(40px)' }} />
      </div>

      {/* Floating decorative elements */}
      {['🍁', '🍃', '🌿', '🍂', '🍁', '✨'].map((el, i) => (
        <motion.div key={i} style={{ position: 'absolute', fontSize: [18, 24, 16, 20, 14, 12][i], opacity: [0.22, 0.18, 0.20, 0.15, 0.25, 0.12][i], pointerEvents: 'none', left: `${[12, 78, 48, 88, 22, 62][i]}%`, top: `${[18, 12, 62, 38, 78, 25][i]}%` }}
          animate={{ y: [-10, 10], rotate: [-6, 6] }} transition={{ duration: [4.2, 5.1, 3.8, 4.7, 3.3, 6][i], repeat: Infinity, repeatType: 'reverse', delay: i * 0.8 }}>
          {el}
        </motion.div>
      ))}

      <div style={{ maxWidth: 1280, margin: '0 auto', padding: '120px clamp(16px, 5vw, 60px) 100px', position: 'relative', zIndex: 1 }}>
        <div style={{ maxWidth: 720 }}>
          {/* Season badge */}
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.15 }}
            style={{ display: 'inline-flex', alignItems: 'center', gap: 8, background: season.color + '20', border: `1px solid ${season.color}40`, borderRadius: 50, padding: '6px 16px', marginBottom: 28 }}>
            <span>{season.emoji}</span>
            <span style={{ fontFamily: font.body, fontSize: 12, fontWeight: 600, color: season.color, letterSpacing: 1.5, textTransform: 'uppercase' }}>{season.name} in Canada</span>
          </motion.div>

          {/* Rotating headline */}
          <div style={{ minHeight: 'clamp(120px, 16vw, 200px)', marginBottom: 24 }}>
            <AnimatePresence mode="wait">
              <motion.h1 key={hIdx} initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -24 }} transition={{ duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
                style={{ fontFamily: font.head, fontSize: 'clamp(44px, 6.5vw, 80px)', fontWeight: 700, color: C.white, lineHeight: 1.08, letterSpacing: '-2px', margin: 0, whiteSpace: 'pre-line' }}>
                {headlines[hIdx]}
              </motion.h1>
            </AnimatePresence>
          </div>

          <motion.p initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }}
            style={{ fontFamily: font.body, fontSize: 18, color: 'rgba(253,250,246,0.60)', lineHeight: 1.7, maxWidth: 500, marginBottom: 40 }}>
            Tips, trusted products, and real savings for the Canadian mom who wants a beautiful, organized, and financially smart life.
          </motion.p>

          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.52 }}
            style={{ display: 'flex', gap: 14, flexWrap: 'wrap', marginBottom: 56 }}>
            <a href="#articles" style={{ fontFamily: font.body, fontWeight: 700, fontSize: 15, color: C.white, background: C.primary, padding: '14px 30px', borderRadius: 50, textDecoration: 'none', display: 'flex', alignItems: 'center', gap: 8 }}>
              📖 Read Latest Tips
            </a>
            <a href="#picks" style={{ fontFamily: font.body, fontWeight: 600, fontSize: 15, color: 'rgba(253,250,246,0.80)', background: 'rgba(253,250,246,0.08)', border: '1px solid rgba(253,250,246,0.22)', padding: '14px 30px', borderRadius: 50, textDecoration: 'none', display: 'flex', alignItems: 'center', gap: 8, backdropFilter: 'blur(8px)' }}>
              🛒 Shop My Picks
            </a>
          </motion.div>

          {/* Today's tip */}
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.68 }}
            style={{ background: 'rgba(253,250,246,0.06)', border: '1px solid rgba(253,250,246,0.11)', borderRadius: 16, padding: '16px 20px', display: 'flex', alignItems: 'flex-start', gap: 14, maxWidth: 500, backdropFilter: 'blur(8px)' }}>
            <span style={{ fontSize: 24, flexShrink: 0 }}>{tip.emoji}</span>
            <div>
              <div style={{ fontFamily: font.body, fontSize: 10, fontWeight: 600, letterSpacing: 2.2, textTransform: 'uppercase', color: C.gold, marginBottom: 4 }}>Today's Smart Tip</div>
              <div style={{ fontFamily: font.body, fontSize: 14, color: 'rgba(253,250,246,0.75)', lineHeight: 1.5 }}>{tip.tip}</div>
            </div>
          </motion.div>
        </div>

        {/* Stats */}
        <motion.div initial={{ opacity: 0, y: 28 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.9 }}
          style={{ display: 'flex', gap: 'clamp(24px, 5vw, 56px)', flexWrap: 'wrap', marginTop: 68, paddingTop: 36, borderTop: '1px solid rgba(253,250,246,0.07)' }}>
          {[['10K+', 'Canadian Moms'], ['200+', 'Tested Products'], ['$1,200', 'Avg. Annual Savings'], ['100%', 'Honest Reviews']].map(([n, l], i) => (
            <motion.div key={n} initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 1 + i * 0.09 }}>
              <div style={{ fontFamily: font.head, fontSize: 'clamp(28px, 4vw, 42px)', fontWeight: 700, color: C.white, lineHeight: 1, marginBottom: 4 }}>{n}</div>
              <div style={{ fontFamily: font.body, fontSize: 13, color: 'rgba(253,250,246,0.40)' }}>{l}</div>
            </motion.div>
          ))}
        </motion.div>
      </div>

      <motion.div animate={{ y: [0, 8, 0] }} transition={{ duration: 2.2, repeat: Infinity }}
        style={{ position: 'absolute', bottom: 28, left: '50%', transform: 'translateX(-50%)', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 6, cursor: 'pointer' }}
        onClick={() => document.getElementById('articles')?.scrollIntoView({ behavior: 'smooth' })}>
        <span style={{ fontFamily: font.body, fontSize: 10, letterSpacing: 2.5, textTransform: 'uppercase', color: 'rgba(253,250,246,0.28)' }}>Explore</span>
        <div style={{ width: 1, height: 28, background: 'linear-gradient(to bottom, rgba(253,250,246,0.28), transparent)' }} />
      </motion.div>
    </section>
  )
}

// ─── Featured Articles ─────────────────────────────────────────────────────────
function FeaturedArticles() {
  const featured = ARTICLES.filter(a => a.featured)
  return (
    <section id="articles" style={{ background: C.bg, padding: 'clamp(60px, 8vw, 96px) clamp(16px, 5vw, 60px)' }}>
      <div style={{ maxWidth: 1280, margin: '0 auto' }}>
        <FadeIn>
          <SectionLabel>Editor's Picks</SectionLabel>
          <h2 style={{ fontFamily: font.head, fontSize: 'clamp(30px, 4vw, 50px)', fontWeight: 700, color: C.text, lineHeight: 1.12, letterSpacing: '-1px', marginBottom: 10 }}>This Week's Must-Reads</h2>
          <p style={{ fontFamily: font.body, fontSize: 15, color: C.muted, marginBottom: 44, maxWidth: 480 }}>Chosen to help you save time, money, and energy in your daily life as a Canadian mom.</p>
        </FadeIn>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: 22 }}>
          {featured.map((a, i) => (
            <FadeIn key={a.id} delay={i * 0.12}>
              <motion.article whileHover={{ y: -6, boxShadow: `0 20px 48px ${a.color}18` }} transition={{ type: 'spring', stiffness: 280, damping: 20 }}
                style={{ background: C.white, border: `1px solid ${C.border}`, borderRadius: 20, overflow: 'hidden', cursor: 'pointer', height: '100%', display: 'flex', flexDirection: 'column' }}>
                <div style={{ height: 4, background: `linear-gradient(90deg, ${a.color}, ${a.color}60)` }} />
                <div style={{ padding: '26px 28px 30px', flex: 1, display: 'flex', flexDirection: 'column', gap: 14 }}>
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                    <Tag color={a.color}>{a.tag}</Tag>
                    <span style={{ fontFamily: font.body, fontSize: 12, color: C.muted }}>{a.readTime} min read</span>
                  </div>
                  <h3 style={{ fontFamily: font.head, fontSize: 22, fontWeight: 700, color: C.text, lineHeight: 1.22, letterSpacing: '-0.3px', margin: 0 }}>{a.title}</h3>
                  <p style={{ fontFamily: font.body, fontSize: 14, color: C.muted, lineHeight: 1.65, flex: 1 }}>{a.excerpt}</p>
                  {a.highlights.length > 0 && (
                    <ul style={{ listStyle: 'none', margin: 0, padding: 0, display: 'flex', flexDirection: 'column', gap: 7 }}>
                      {a.highlights.map(h => (
                        <li key={h} style={{ fontFamily: font.body, fontSize: 13, color: C.text, display: 'flex', alignItems: 'center', gap: 8 }}>
                          <span style={{ color: a.color, fontWeight: 700 }}>✓</span> {h}
                        </li>
                      ))}
                    </ul>
                  )}
                  <div style={{ display: 'flex', alignItems: 'center', gap: 6, color: a.color, fontFamily: font.body, fontSize: 13, fontWeight: 700 }}>
                    Read full article <span>→</span>
                  </div>
                </div>
              </motion.article>
            </FadeIn>
          ))}
        </div>
      </div>
    </section>
  )
}

// ─── Mama Picks ────────────────────────────────────────────────────────────────
function MamaPicks() {
  const [activeCat, setActiveCat] = useState('all')
  const filtered = useMemo(() => activeCat === 'all' ? PRODUCTS : PRODUCTS.filter(p => p.cat === activeCat), [activeCat])
  const cats = [['all', 'All'], ['kitchen', 'Kitchen'], ['organization', 'Organization'], ['garden', 'Garden'], ['motherhood', 'Motherhood']]

  return (
    <section id="picks" style={{ background: C.bgAlt, padding: 'clamp(60px, 8vw, 96px) clamp(16px, 5vw, 60px)' }}>
      <div style={{ maxWidth: 1280, margin: '0 auto' }}>
        <FadeIn>
          <SectionLabel>Trusted Recommendations</SectionLabel>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', flexWrap: 'wrap', gap: 20, marginBottom: 32 }}>
            <div>
              <h2 style={{ fontFamily: font.head, fontSize: 'clamp(28px, 4vw, 48px)', fontWeight: 700, color: C.text, lineHeight: 1.12, letterSpacing: '-1px', marginBottom: 6 }}>Mama's Trusted Picks 🛒</h2>
              <p style={{ fontFamily: font.body, fontSize: 15, color: C.muted }}>Products I personally use — all available on Amazon Canada with real reviews.</p>
            </div>
            <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
              {cats.map(([key, label]) => {
                const active = activeCat === key
                return (
                  <button key={key} onClick={() => setActiveCat(key)}
                    style={{ fontFamily: font.body, fontSize: 13, fontWeight: 600, color: active ? C.white : C.muted, background: active ? C.primary : 'transparent', border: `1.5px solid ${active ? C.primary : C.border}`, borderRadius: 50, padding: '8px 18px', cursor: 'pointer', transition: 'all 0.2s' }}>
                    {label}
                  </button>
                )
              })}
            </div>
          </div>
        </FadeIn>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(255px, 1fr))', gap: 18 }}>
          <AnimatePresence mode="popLayout">
            {filtered.map((p, i) => (
              <motion.div key={p.id} layout initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.95 }} transition={{ delay: i * 0.04 }}>
                <motion.div whileHover={{ y: -5, boxShadow: `0 16px 40px ${p.color}22` }} transition={{ type: 'spring', stiffness: 300 }}
                  style={{ background: C.white, border: `1px solid ${C.border}`, borderRadius: 18, overflow: 'hidden', height: '100%', display: 'flex', flexDirection: 'column' }}>
                  <div style={{ background: `linear-gradient(135deg, ${p.color}1E, ${p.color}07)`, padding: '22px 20px 18px', position: 'relative' }}>
                    <div style={{ position: 'absolute', top: 12, right: 12 }}><Tag color={p.color}>{p.badge}</Tag></div>
                    <div style={{ width: 46, height: 46, borderRadius: 12, background: p.color + '20', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 20, marginBottom: 12 }}>
                      {p.cat === 'kitchen' ? '🍽️' : p.cat === 'organization' ? '🏡' : p.cat === 'garden' ? '🌱' : '👶'}
                    </div>
                    <h3 style={{ fontFamily: font.head, fontSize: 16, fontWeight: 700, color: C.text, lineHeight: 1.2, margin: 0 }}>{p.name}</h3>
                  </div>
                  <div style={{ padding: '14px 20px 18px', flex: 1, display: 'flex', flexDirection: 'column', gap: 10 }}>
                    <p style={{ fontFamily: font.body, fontSize: 13, color: C.muted, lineHeight: 1.55, flex: 1 }}>{p.desc}</p>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                      <Stars n={p.rating} />
                      <span style={{ fontFamily: font.body, fontSize: 12, color: C.muted }}>{p.rating} ({p.reviews})</span>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                      <div>
                        <span style={{ fontFamily: font.head, fontSize: 21, fontWeight: 700, color: C.text }}>{p.price}</span>
                        <span style={{ fontFamily: font.body, fontSize: 13, color: C.muted, marginLeft: 6, textDecoration: 'line-through' }}>{p.old}</span>
                      </div>
                    </div>
                    <a href={p.link} target="_blank" rel="noopener noreferrer"
                      style={{ display: 'block', textAlign: 'center', background: p.color, color: C.white, fontFamily: font.body, fontWeight: 700, fontSize: 13, padding: '10px', borderRadius: 10, textDecoration: 'none' }}>
                      View on Amazon →
                    </a>
                  </div>
                </motion.div>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>

        <FadeIn delay={0.3}>
          <p style={{ fontFamily: font.body, fontSize: 12, color: C.muted, textAlign: 'center', marginTop: 28, fontStyle: 'italic' }}>
            🍁 Affiliate disclosure: Some links are affiliate links. Purchases made through these links support this site at no extra cost to you.
          </p>
        </FadeIn>
      </div>
    </section>
  )
}

// ─── Blog Grid ─────────────────────────────────────────────────────────────────
function BlogGrid() {
  const [activeCat, setActiveCat] = useState('all')
  const filtered = useMemo(() =>
    activeCat === 'all' ? ARTICLES.filter(a => !a.featured) : ARTICLES.filter(a => a.cat === activeCat && !a.featured),
    [activeCat])

  return (
    <section id="motherhood" style={{ background: C.bg, padding: 'clamp(60px, 8vw, 96px) clamp(16px, 5vw, 60px)' }}>
      <div style={{ maxWidth: 1280, margin: '0 auto' }}>
        <FadeIn>
          <SectionLabel>All Articles</SectionLabel>
          <h2 style={{ fontFamily: font.head, fontSize: 'clamp(28px, 4vw, 48px)', fontWeight: 700, color: C.text, lineHeight: 1.12, letterSpacing: '-1px', marginBottom: 28 }}>Browse by Topic</h2>
        </FadeIn>
        <FadeIn delay={0.08}>
          <div style={{ display: 'flex', gap: 8, overflowX: 'auto', paddingBottom: 4, marginBottom: 36, scrollbarWidth: 'none' }}>
            {CATS.map(cat => {
              const active = activeCat === cat.key
              return (
                <button key={cat.key} onClick={() => setActiveCat(cat.key)}
                  style={{ flexShrink: 0, fontFamily: font.body, fontSize: 13, fontWeight: 600, color: active ? C.white : C.muted, background: active ? cat.color : C.bgAlt, border: `1.5px solid ${active ? cat.color : C.border}`, borderRadius: 50, padding: '9px 19px', cursor: 'pointer', transition: 'all 0.2s', display: 'flex', alignItems: 'center', gap: 5 }}>
                  {cat.emoji} {cat.label}
                </button>
              )
            })}
          </div>
        </FadeIn>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(275px, 1fr))', gap: 18 }}>
          <AnimatePresence mode="popLayout">
            {filtered.map((a, i) => {
              const catInfo = CATS.find(c => c.key === a.cat) || CATS[0]
              return (
                <motion.article key={a.id} layout initial={{ opacity: 0, y: 18 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, scale: 0.95 }} transition={{ delay: i * 0.04 }}>
                  <motion.div whileHover={{ y: -4 }} transition={{ type: 'spring', stiffness: 300 }}
                    style={{ background: C.white, border: `1px solid ${C.border}`, borderRadius: 16, padding: '22px', cursor: 'pointer', height: '100%', display: 'flex', flexDirection: 'column', gap: 10 }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <Tag color={catInfo.color}>{catInfo.emoji} {catInfo.label}</Tag>
                      <span style={{ fontFamily: font.body, fontSize: 12, color: C.muted }}>{a.readTime} min</span>
                    </div>
                    <h3 style={{ fontFamily: font.head, fontSize: 18, fontWeight: 700, color: C.text, lineHeight: 1.28, flex: 1 }}>{a.title}</h3>
                    <p style={{ fontFamily: font.body, fontSize: 13, color: C.muted, lineHeight: 1.6 }}>{a.excerpt}</p>
                    <div style={{ color: catInfo.color, fontFamily: font.body, fontSize: 13, fontWeight: 700 }}>Read more →</div>
                  </motion.div>
                </motion.article>
              )
            })}
          </AnimatePresence>
        </div>
        {filtered.length === 0 && (
          <div style={{ textAlign: 'center', padding: '56px 0', color: C.muted, fontFamily: font.body, fontSize: 15 }}>
            More articles coming soon for this topic! 🌿
          </div>
        )}
      </div>
    </section>
  )
}

// ─── Savings Hub ───────────────────────────────────────────────────────────────
function SavingsHub() {
  const [monthly, setMonthly] = useState(800)
  const saved = Math.round(monthly * 0.25 * 12)
  const apps = [
    { name: 'Flipp', desc: 'All Canadian flyers in one app — plan meals around weekly sales', badge: '#1 Downloaded', icon: '📰' },
    { name: 'PC Optimum', desc: 'Earn points at Loblaws, Shoppers Drug Mart & more', badge: 'Best Rewards', icon: '⭐' },
    { name: 'Reebee', desc: 'Digital flyers plus instant cashback offers every week', badge: 'Free Cashback', icon: '💸' },
    { name: 'Checkout 51', desc: 'Weekly cashback on everyday grocery items', badge: 'Easy Money', icon: '🧾' },
  ]

  return (
    <section id="savings" style={{ background: C.hero, padding: 'clamp(60px, 8vw, 96px) clamp(16px, 5vw, 60px)', position: 'relative', overflow: 'hidden' }}>
      <div style={{ position: 'absolute', inset: 0, pointerEvents: 'none' }}>
        <div style={{ position: 'absolute', top: '-15%', right: '-5%', width: 550, height: 550, borderRadius: '50%', background: 'radial-gradient(circle, rgba(122,106,158,0.14) 0%, transparent 70%)', filter: 'blur(60px)' }} />
        <div style={{ position: 'absolute', bottom: '-10%', left: '0%', width: 450, height: 450, borderRadius: '50%', background: 'radial-gradient(circle, rgba(212,168,83,0.10) 0%, transparent 70%)', filter: 'blur(60px)' }} />
      </div>
      <div style={{ maxWidth: 1280, margin: '0 auto', position: 'relative', zIndex: 1 }}>
        <FadeIn>
          <SectionLabel light>Smart Savings</SectionLabel>
          <h2 style={{ fontFamily: font.head, fontSize: 'clamp(28px, 4vw, 48px)', fontWeight: 700, color: C.white, lineHeight: 1.12, letterSpacing: '-1px', marginBottom: 10 }}>Save Smarter in Canada 🍁</h2>
          <p style={{ fontFamily: font.body, fontSize: 15, color: 'rgba(253,250,246,0.50)', marginBottom: 44, maxWidth: 480 }}>With grocery prices at record highs, every dollar counts. Here is your complete savings toolkit.</p>
        </FadeIn>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(290px, 1fr))', gap: 28, alignItems: 'start' }}>
          {/* Calculator */}
          <FadeIn>
            <div style={{ background: 'rgba(253,250,246,0.05)', border: '1px solid rgba(253,250,246,0.09)', borderRadius: 20, padding: 28, backdropFilter: 'blur(10px)' }}>
              <div style={{ fontFamily: font.body, fontSize: 10, fontWeight: 600, letterSpacing: 2.2, textTransform: 'uppercase', color: C.gold, marginBottom: 14 }}>💰 Savings Calculator</div>
              <h3 style={{ fontFamily: font.head, fontSize: 22, fontWeight: 700, color: C.white, marginBottom: 6 }}>How Much Can You Save?</h3>
              <p style={{ fontFamily: font.body, fontSize: 13, color: 'rgba(253,250,246,0.45)', marginBottom: 24 }}>Drag to your monthly grocery spend</p>
              <div style={{ marginBottom: 22 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8 }}>
                  <span style={{ fontFamily: font.body, fontSize: 13, color: 'rgba(253,250,246,0.55)' }}>Monthly groceries</span>
                  <span style={{ fontFamily: font.head, fontSize: 20, fontWeight: 700, color: C.white }}>${monthly}</span>
                </div>
                <input type="range" min={200} max={2000} step={50} value={monthly} onChange={e => setMonthly(+e.target.value)}
                  style={{ width: '100%', accentColor: C.gold, height: 4, cursor: 'pointer' }} />
              </div>
              <div style={{ background: C.gold + '1A', border: `1px solid ${C.gold}30`, borderRadius: 12, padding: '16px 18px', textAlign: 'center' }}>
                <div style={{ fontFamily: font.body, fontSize: 12, color: C.gold, marginBottom: 4 }}>Potential annual savings with our tips</div>
                <motion.div key={saved} initial={{ scale: 0.82 }} animate={{ scale: 1 }} style={{ fontFamily: font.head, fontSize: 36, fontWeight: 700, color: C.gold }}>${saved.toLocaleString()}</motion.div>
                <div style={{ fontFamily: font.body, fontSize: 11, color: 'rgba(253,250,246,0.35)', marginTop: 4 }}>per year (approx. 25% reduction)</div>
              </div>
            </div>
          </FadeIn>

          {/* Apps */}
          <FadeIn delay={0.14}>
            <div>
              <div style={{ fontFamily: font.body, fontSize: 10, fontWeight: 600, letterSpacing: 2.2, textTransform: 'uppercase', color: C.gold, marginBottom: 18 }}>Essential Canadian Apps</div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                {apps.map((app, i) => (
                  <motion.div key={app.name} initial={{ opacity: 0, x: 18 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.07 }}
                    whileHover={{ x: 4 }}
                    style={{ background: 'rgba(253,250,246,0.05)', border: '1px solid rgba(253,250,246,0.07)', borderRadius: 14, padding: '14px 16px', display: 'flex', alignItems: 'center', gap: 12, cursor: 'pointer' }}>
                    <span style={{ fontSize: 22, flexShrink: 0 }}>{app.icon}</span>
                    <div style={{ flex: 1 }}>
                      <div style={{ fontFamily: font.body, fontSize: 14, fontWeight: 600, color: C.white, marginBottom: 2 }}>{app.name}</div>
                      <div style={{ fontFamily: font.body, fontSize: 12, color: 'rgba(253,250,246,0.40)' }}>{app.desc}</div>
                    </div>
                    <span style={{ fontFamily: font.body, fontSize: 10, fontWeight: 700, color: C.gold, background: C.gold + '1A', padding: '3px 8px', borderRadius: 6, flexShrink: 0, whiteSpace: 'nowrap' }}>{app.badge}</span>
                  </motion.div>
                ))}
              </div>
            </div>
          </FadeIn>
        </div>
      </div>
    </section>
  )
}

// ─── Garden Feature ────────────────────────────────────────────────────────────
function GardenFeature() {
  const season = getSeason()
  const plants = [
    { name: 'Mint', icon: '🌿', ease: 'Very Easy', time: '3 weeks', note: 'Grows anywhere — smells amazing in the kitchen' },
    { name: 'Basil', icon: '🌱', ease: 'Easy', time: '4 weeks', note: 'Perfect for pasta nights and pizzas' },
    { name: 'Cherry Tomatoes', icon: '🍅', ease: 'Medium', time: '8 weeks', note: 'Kids love picking them off the vine' },
    { name: 'Lavender', icon: '💜', ease: 'Easy', time: '6 weeks', note: 'Calming scent, beautiful on any balcony' },
    { name: 'Strawberries', icon: '🍓', ease: 'Medium', time: '6 weeks', note: 'The ultimate reward for a patient gardener' },
    { name: 'Chives', icon: '🌾', ease: 'Very Easy', time: '2 weeks', note: 'Regrow endlessly after every cutting' },
  ]

  return (
    <section id="garden" style={{ background: C.bgAlt, padding: 'clamp(60px, 8vw, 96px) clamp(16px, 5vw, 60px)' }}>
      <div style={{ maxWidth: 1280, margin: '0 auto' }}>
        <FadeIn>
          <SectionLabel>Grow Something Beautiful</SectionLabel>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: 20, marginBottom: 44 }}>
            <div>
              <h2 style={{ fontFamily: font.head, fontSize: 'clamp(28px, 4vw, 48px)', fontWeight: 700, color: C.text, lineHeight: 1.12, letterSpacing: '-1px', marginBottom: 10 }}>Canadian Balcony Garden 🌱</h2>
              <p style={{ fontFamily: font.body, fontSize: 15, color: C.muted, maxWidth: 420 }}>No backyard? No problem. These plants thrive on any Canadian balcony — and your kids will love growing them with you.</p>
            </div>
            <div style={{ background: season.color + '18', border: `1px solid ${season.color}30`, borderRadius: 16, padding: '16px 18px', maxWidth: 270 }}>
              <div style={{ fontFamily: font.body, fontSize: 10, fontWeight: 600, letterSpacing: 1.8, textTransform: 'uppercase', color: season.color, marginBottom: 6 }}>{season.emoji} {season.name} Garden Tip</div>
              <div style={{ fontFamily: font.body, fontSize: 13, color: C.text, lineHeight: 1.55 }}>{season.tip}</div>
            </div>
          </div>
        </FadeIn>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(210px, 1fr))', gap: 14 }}>
          {plants.map((p, i) => (
            <FadeIn key={p.name} delay={i * 0.07}>
              <motion.div whileHover={{ y: -4, boxShadow: '0 12px 32px rgba(106,148,112,0.14)' }} transition={{ type: 'spring', stiffness: 300 }}
                style={{ background: C.white, border: `1px solid ${C.border}`, borderRadius: 16, padding: '18px', cursor: 'pointer' }}>
                <span style={{ fontSize: 30, display: 'block', marginBottom: 10 }}>{p.icon}</span>
                <div style={{ fontFamily: font.head, fontSize: 17, fontWeight: 700, color: C.text, marginBottom: 5 }}>{p.name}</div>
                <div style={{ fontFamily: font.body, fontSize: 12, color: C.muted, marginBottom: 10, lineHeight: 1.5 }}>{p.note}</div>
                <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
                  <span style={{ fontFamily: font.body, fontSize: 11, fontWeight: 600, color: C.sage, background: C.sage + '18', padding: '2px 8px', borderRadius: 6 }}>{p.ease}</span>
                  <span style={{ fontFamily: font.body, fontSize: 11, color: C.muted, background: C.bgAlt, padding: '2px 8px', borderRadius: 6 }}>⏱ {p.time}</span>
                </div>
              </motion.div>
            </FadeIn>
          ))}
        </div>
      </div>
    </section>
  )
}

// ─── Kitchen Section ───────────────────────────────────────────────────────────
function KitchenSection() {
  const recipes = [
    { name: 'One-Pan Lemon Chicken & Veggies', time: '20 min', servings: 4, emoji: '🍋', tag: 'Family Favorite' },
    { name: 'Creamy Tomato Pasta (5 Ingredients)', time: '15 min', servings: 4, emoji: '🍝', tag: '15 Minutes' },
    { name: 'Sheet Pan Salmon & Potatoes', time: '25 min', servings: 4, emoji: '🐟', tag: 'Healthy' },
    { name: 'Kid-Friendly Veggie Stir Fry', time: '12 min', servings: 3, emoji: '🥦', tag: 'Quick & Easy' },
  ]

  return (
    <section id="kitchen" style={{ background: C.bg, padding: 'clamp(60px, 8vw, 96px) clamp(16px, 5vw, 60px)' }}>
      <div style={{ maxWidth: 1280, margin: '0 auto' }}>
        <FadeIn>
          <SectionLabel>Quick Kitchen</SectionLabel>
          <h2 style={{ fontFamily: font.head, fontSize: 'clamp(28px, 4vw, 48px)', fontWeight: 700, color: C.text, lineHeight: 1.12, letterSpacing: '-1px', marginBottom: 10 }}>Meals the Whole Family Will Love 🍽️</h2>
          <p style={{ fontFamily: font.body, fontSize: 15, color: C.muted, marginBottom: 44, maxWidth: 460 }}>Fast, healthy, and actually enjoyed by picky eaters — all under 25 minutes with Canadian grocery ingredients.</p>
        </FadeIn>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(250px, 1fr))', gap: 18 }}>
          {recipes.map((r, i) => (
            <FadeIn key={r.name} delay={i * 0.09}>
              <motion.div whileHover={{ y: -4 }} transition={{ type: 'spring', stiffness: 300 }}
                style={{ background: C.bgAlt, border: `1px solid ${C.border}`, borderRadius: 16, padding: '22px', cursor: 'pointer', display: 'flex', flexDirection: 'column', gap: 10 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                  <span style={{ fontSize: 34 }}>{r.emoji}</span>
                  <Tag color="#C4955A">{r.tag}</Tag>
                </div>
                <h3 style={{ fontFamily: font.head, fontSize: 17, fontWeight: 700, color: C.text, lineHeight: 1.25 }}>{r.name}</h3>
                <div style={{ display: 'flex', gap: 14 }}>
                  <span style={{ fontFamily: font.body, fontSize: 13, color: C.muted }}>⏱ {r.time}</span>
                  <span style={{ fontFamily: font.body, fontSize: 13, color: C.muted }}>👥 {r.servings} servings</span>
                </div>
                <div style={{ color: '#C4955A', fontFamily: font.body, fontSize: 13, fontWeight: 700 }}>See full recipe →</div>
              </motion.div>
            </FadeIn>
          ))}
        </div>
      </div>
    </section>
  )
}

// ─── Newsletter ────────────────────────────────────────────────────────────────
function Newsletter() {
  const [email, setEmail] = useState('')
  const [sent, setSent] = useState(false)
  const [loading, setLoading] = useState(false)
  const perks = ['Weekly smart tips for moms', 'Exclusive deals & affiliate picks', 'Seasonal garden & kitchen guides', 'First access to new content']

  async function handleSubmit(e) {
    e.preventDefault()
    if (!email) return
    setLoading(true)
    try { await fetch(FORMSPREE, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ email, source: 'newsletter' }) }) } catch {}
    setSent(true)
    setLoading(false)
  }

  return (
    <section id="newsletter" style={{ background: `linear-gradient(135deg, ${C.primary}14, ${C.sage}0D, ${C.gold}0A)`, borderTop: `1px solid ${C.border}`, padding: 'clamp(60px, 8vw, 96px) clamp(16px, 5vw, 60px)' }}>
      <div style={{ maxWidth: 760, margin: '0 auto', textAlign: 'center' }}>
        <FadeIn>
          <div style={{ fontSize: 44, marginBottom: 18 }}>🍁</div>
          <SectionLabel>Join the Community</SectionLabel>
          <h2 style={{ fontFamily: font.head, fontSize: 'clamp(28px, 5vw, 52px)', fontWeight: 700, color: C.text, lineHeight: 1.1, letterSpacing: '-1.5px', marginBottom: 14 }}>
            Join 10,000+ Smart<br />Canadian Moms
          </h2>
          <p style={{ fontFamily: font.body, fontSize: 15, color: C.muted, marginBottom: 32, lineHeight: 1.65 }}>
            Weekly tips straight to your inbox — no spam, no fluff. Just real advice that makes your life easier and your wallet heavier.
          </p>
          <div style={{ display: 'flex', gap: 10, justifyContent: 'center', flexWrap: 'wrap', marginBottom: 36 }}>
            {perks.map(p => (
              <div key={p} style={{ fontFamily: font.body, fontSize: 13, color: C.text, display: 'flex', alignItems: 'center', gap: 5, background: C.white, border: `1px solid ${C.border}`, borderRadius: 50, padding: '6px 13px' }}>
                <span style={{ color: C.sage }}>✓</span> {p}
              </div>
            ))}
          </div>
          <AnimatePresence mode="wait">
            {sent ? (
              <motion.div key="ok" initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }}
                style={{ background: C.sage + '18', border: `1px solid ${C.sage}35`, borderRadius: 16, padding: '22px', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 12 }}>
                <span style={{ fontSize: 28 }}>🎉</span>
                <div style={{ textAlign: 'left' }}>
                  <div style={{ fontFamily: font.head, fontSize: 19, fontWeight: 700, color: C.text }}>Welcome to the community!</div>
                  <div style={{ fontFamily: font.body, fontSize: 14, color: C.muted }}>Check your inbox for your first smart tip.</div>
                </div>
              </motion.div>
            ) : (
              <motion.form key="form" onSubmit={handleSubmit} style={{ display: 'flex', gap: 10, maxWidth: 500, margin: '0 auto', flexWrap: 'wrap' }}>
                <input type="email" placeholder="your@email.com" value={email} onChange={e => setEmail(e.target.value)} required
                  style={{ flex: 1, minWidth: 190, fontFamily: font.body, fontSize: 15, color: C.text, background: C.white, border: `1.5px solid ${C.border}`, borderRadius: 50, padding: '13px 20px', outline: 'none', boxSizing: 'border-box' }} />
                <motion.button type="submit" disabled={loading} whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}
                  style={{ fontFamily: font.body, fontWeight: 700, fontSize: 14, color: C.white, background: C.primary, border: 'none', borderRadius: 50, padding: '13px 24px', cursor: 'pointer', whiteSpace: 'nowrap' }}>
                  {loading ? 'Subscribing...' : '🍁 Subscribe Free'}
                </motion.button>
              </motion.form>
            )}
          </AnimatePresence>
          <p style={{ fontFamily: font.body, fontSize: 12, color: C.muted, marginTop: 14, fontStyle: 'italic' }}>Free forever. Unsubscribe anytime.</p>
        </FadeIn>
      </div>
    </section>
  )
}

// ─── Footer ───────────────────────────────────────────────────────────────────
function Footer() {
  const cols = [
    { title: 'Topics', links: ['Motherhood', 'Home Organization', 'Balcony Garden', 'Quick Kitchen', 'Savings in Canada'] },
    { title: 'Resources', links: ['Flipp App Guide', 'Starter Garden Kit', 'Organization Checklist', 'Free Meal Planner', 'Product Reviews'] },
    { title: 'About', links: ['About The Smart Mom', 'Affiliate Disclaimer', 'Privacy Policy', 'Contact Us', 'Write for Us'] },
  ]
  return (
    <footer style={{ background: C.hero, padding: 'clamp(48px, 6vw, 76px) clamp(16px, 5vw, 60px) 28px', borderTop: '1px solid rgba(253,250,246,0.06)' }}>
      <div style={{ maxWidth: 1280, margin: '0 auto' }}>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(190px, 1fr))', gap: 36, marginBottom: 52 }}>
          <div>
            <div style={{ fontFamily: font.head, fontSize: 21, fontWeight: 700, color: C.white, marginBottom: 3 }}>The Smart Mom</div>
            <div style={{ fontFamily: font.body, fontSize: 9, fontWeight: 600, letterSpacing: 2.5, textTransform: 'uppercase', color: C.gold, marginBottom: 14 }}>Life in Canada 🍁</div>
            <p style={{ fontFamily: font.body, fontSize: 13, color: 'rgba(253,250,246,0.40)', lineHeight: 1.62, maxWidth: 220, marginBottom: 20 }}>Smart tips, tested products, and real savings for Canadian moms who want more from life.</p>
            <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
              {['📘', '📸', '🎵'].map((icon, i) => (
                <a key={i} href="#" style={{ fontFamily: font.body, fontSize: 16, color: 'rgba(253,250,246,0.40)', background: 'rgba(253,250,246,0.06)', border: '1px solid rgba(253,250,246,0.08)', borderRadius: 8, padding: '7px 10px', textDecoration: 'none' }}>
                  {icon}
                </a>
              ))}
            </div>
          </div>
          {cols.map(col => (
            <div key={col.title}>
              <div style={{ fontFamily: font.body, fontSize: 10, fontWeight: 700, letterSpacing: 2.2, textTransform: 'uppercase', color: 'rgba(253,250,246,0.30)', marginBottom: 14 }}>{col.title}</div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 9 }}>
                {col.links.map(l => (
                  <a key={l} href="#" style={{ fontFamily: font.body, fontSize: 13, color: 'rgba(253,250,246,0.46)', textDecoration: 'none' }}>{l}</a>
                ))}
              </div>
            </div>
          ))}
        </div>
        <div style={{ borderTop: '1px solid rgba(253,250,246,0.07)', paddingTop: 22, display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 10 }}>
          <span style={{ fontFamily: font.body, fontSize: 12, color: 'rgba(253,250,246,0.25)' }}>© {new Date().getFullYear()} The Smart Mom — Life in Canada. All rights reserved.</span>
          <span style={{ fontFamily: font.body, fontSize: 11, color: 'rgba(253,250,246,0.22)', fontStyle: 'italic' }}>Some links are affiliate links. We earn a small commission at no extra cost to you.</span>
        </div>
      </div>
    </footer>
  )
}

// ─── App ──────────────────────────────────────────────────────────────────────
export default function App() {
  const [scrolled, setScrolled] = useState(false)
  useEffect(() => {
    const fn = () => setScrolled(window.scrollY > 60)
    window.addEventListener('scroll', fn, { passive: true })
    return () => window.removeEventListener('scroll', fn)
  }, [])
  return (
    <div style={{ fontFamily: font.body, background: C.bg, color: C.text, overflowX: 'hidden' }}>
      <Nav scrolled={scrolled} />
      <Hero />
      <FeaturedArticles />
      <MamaPicks />
      <BlogGrid />
      <SavingsHub />
      <GardenFeature />
      <KitchenSection />
      <Newsletter />
      <Footer />
    </div>
  )
}
