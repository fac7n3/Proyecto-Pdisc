# UX/UI Mastery — Curated Palettes & Typography Pairings

## Premium Color Palettes

### 1. Ocean Depth (Professional SaaS)
```css
:root {
  --primary:    hsl(215, 72%, 46%);   /* Deep blue */
  --primary-light: hsl(215, 80%, 56%);
  --accent:     hsl(175, 60%, 46%);   /* Teal */
  --bg:         hsl(220, 25%, 98%);
  --surface:    hsl(0, 0%, 100%);
  --text:       hsl(220, 20%, 18%);
  --text-muted: hsl(220, 12%, 52%);
}
```

### 2. Midnight Luxe (Premium Dark Mode)
```css
:root {
  --primary:    hsl(250, 65%, 62%);   /* Rich violet */
  --accent:     hsl(38, 95%, 58%);    /* Warm gold */
  --bg:         hsl(230, 25%, 9%);
  --surface:    hsl(230, 20%, 13%);
  --elevated:   hsl(230, 18%, 17%);
  --text:       hsl(220, 16%, 93%);
  --text-muted: hsl(220, 10%, 56%);
  --border:     hsl(230, 14%, 22%);
}
```

### 3. Fresh Commerce (E-commerce / Marketplace)
```css
:root {
  --primary:    hsl(220, 72%, 50%);   /* Trustworthy blue */
  --secondary:  hsl(152, 56%, 42%);   /* Growth green */
  --accent:     hsl(28, 90%, 55%);    /* Warm orange CTA */
  --bg:         hsl(220, 20%, 97%);
  --surface:    hsl(0, 0%, 100%);
  --text:       hsl(220, 18%, 16%);
  --text-muted: hsl(220, 10%, 50%);
  --price:      hsl(220, 18%, 16%);
  --discount:   hsl(0, 70%, 50%);
}
```

### 4. Sunset Warm (Lifestyle / Food)
```css
:root {
  --primary:    hsl(16, 80%, 52%);    /* Terracotta */
  --secondary:  hsl(40, 85%, 52%);    /* Warm amber */
  --accent:     hsl(340, 65%, 48%);   /* Berry */
  --bg:         hsl(35, 30%, 97%);
  --surface:    hsl(35, 20%, 99%);
  --text:       hsl(20, 20%, 18%);
  --text-muted: hsl(20, 10%, 48%);
}
```

### 5. Neo Mint (Health / Wellness)
```css
:root {
  --primary:    hsl(168, 55%, 42%);   /* Mint green */
  --secondary:  hsl(200, 60%, 48%);   /* Calm blue */
  --accent:     hsl(340, 60%, 55%);   /* Coral pink */
  --bg:         hsl(168, 20%, 97%);
  --surface:    hsl(0, 0%, 100%);
  --text:       hsl(200, 18%, 16%);
  --text-muted: hsl(200, 10%, 50%);
}
```

### 6. Monochrome Elegant (Portfolio / Agency)
```css
:root {
  --primary:    hsl(0, 0%, 12%);      /* Near black */
  --accent:     hsl(0, 0%, 98%);      /* Near white */
  --highlight:  hsl(50, 90%, 55%);    /* Electric yellow accent */
  --bg:         hsl(0, 0%, 98%);
  --surface:    hsl(0, 0%, 100%);
  --text:       hsl(0, 0%, 12%);
  --text-muted: hsl(0, 0%, 46%);
}
```

---

## Gradient Recipes

```css
/* Sunrise — warm, inviting */
background: linear-gradient(135deg, hsl(16, 80%, 52%), hsl(40, 85%, 52%));

/* Ocean — professional, trustworthy */
background: linear-gradient(135deg, hsl(200, 75%, 48%), hsl(240, 65%, 55%));

/* Aurora — vibrant, creative */
background: linear-gradient(135deg, hsl(280, 65%, 55%), hsl(200, 80%, 56%));

/* Emerald — growth, nature */
background: linear-gradient(135deg, hsl(152, 56%, 42%), hsl(180, 50%, 48%));

/* Subtle mesh (for backgrounds) */
background:
  radial-gradient(ellipse at 20% 50%, hsla(220, 80%, 60%, 0.08) 0%, transparent 50%),
  radial-gradient(ellipse at 80% 20%, hsla(280, 70%, 58%, 0.06) 0%, transparent 50%),
  radial-gradient(ellipse at 50% 80%, hsla(40, 80%, 55%, 0.05) 0%, transparent 50%),
  hsl(220, 20%, 97%);
```

---

## Typography Pairings

### 1. Inter (All-Rounder — Best for Apps)
```css
@import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&display=swap');

:root {
  --font-sans: 'Inter', system-ui, sans-serif;
  --font-display: 'Inter', system-ui, sans-serif;
}
```
**Best for**: Dashboards, SaaS, marketplaces, any data-heavy UI.

### 2. Outfit + Inter (Modern Display)
```css
@import url('https://fonts.googleapis.com/css2?family=Outfit:wght@600;700;800&family=Inter:wght@400;500;600&display=swap');

:root {
  --font-display: 'Outfit', system-ui, sans-serif;   /* Headings */
  --font-sans: 'Inter', system-ui, sans-serif;        /* Body */
}
```
**Best for**: Landing pages, marketing sites, creative portfolios.

### 3. DM Sans + DM Mono (Clean Geometric)
```css
@import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;700&family=DM+Mono:wght@400;500&display=swap');

:root {
  --font-sans: 'DM Sans', system-ui, sans-serif;
  --font-mono: 'DM Mono', 'Consolas', monospace;
}
```
**Best for**: Developer tools, tech products, minimal interfaces.

### 4. Plus Jakarta Sans (Friendly Premium)
```css
@import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800&display=swap');

:root {
  --font-sans: 'Plus Jakarta Sans', system-ui, sans-serif;
}
```
**Best for**: E-commerce, lifestyle brands, warm/friendly apps.

### 5. Space Grotesk + Work Sans (Bold Modern)
```css
@import url('https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@600;700&family=Work+Sans:wght@400;500;600&display=swap');

:root {
  --font-display: 'Space Grotesk', system-ui, sans-serif;
  --font-sans: 'Work Sans', system-ui, sans-serif;
}
```
**Best for**: Startups, fintech, bold branding.

### 6. Playfair Display + Source Sans 3 (Editorial Elegance)
```css
@import url('https://fonts.googleapis.com/css2?family=Playfair+Display:wght@600;700;800&family=Source+Sans+3:wght@400;500;600&display=swap');

:root {
  --font-display: 'Playfair Display', Georgia, serif;
  --font-sans: 'Source Sans 3', system-ui, sans-serif;
}
```
**Best for**: Magazines, luxury brands, editorial content.

---

## Icon Libraries (Recommended)

| Library | CDN | Best For |
|---------|-----|----------|
| **Font Awesome 6** | cdnjs | Full-featured, huge icon set |
| **Lucide** | unpkg | Clean, consistent, lightweight |
| **Phosphor Icons** | unpkg | Flexible weights (thin to bold) |
| **Heroicons** | unpkg | Tailwind-style, clean |
| **Tabler Icons** | CDN | 4500+ free icons, very complete |

---

## Inspiration Checklist

When starting a new design, reference these elements:

- [ ] **What's the emotional tone?** (Professional, Playful, Luxurious, Trustworthy)
- [ ] **What palette matches?** (Select from above or create custom)
- [ ] **What font pairing conveys the brand?** (Modern geometric vs. editorial serif)
- [ ] **What's the primary CTA?** (Color should be the most vibrant on page)
- [ ] **Does the hero answer "What, Why, What next" in 3 seconds?**
- [ ] **Are cards interactive?** (Hover effects, image zoom, elevation change)
- [ ] **Is there visual rhythm?** (Alternating sections, consistent spacing)
- [ ] **Are there loading/empty/error states?** (Never a blank screen)
