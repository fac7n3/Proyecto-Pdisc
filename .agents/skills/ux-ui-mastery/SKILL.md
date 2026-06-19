---
name: ux-ui-mastery
description: >
  Master-level UX/UI design skill for building premium, visually stunning web interfaces.
  Use when designing pages, components, layouts, or any user-facing element that needs to
  look and feel world-class. Covers color theory, typography, spacing systems, micro-animations,
  glassmorphism, modern CSS patterns, responsive design, and accessibility. Trigger on any
  UI/UX work: new pages, redesigns, component creation, visual polish, or design audits.
---

# UX/UI Mastery — Premium Web Interface Design

## Philosophy

**Every pixel communicates.** A premium interface isn't about adding more effects — it's about
every visual decision being intentional. The goal is an interface that feels *crafted*, not
*generated*. Users should feel the interface is responsive, alive, and trustworthy.

### The Three Pillars

1. **Clarity** — The user instantly understands what they're looking at and what to do next
2. **Craft** — Every detail (spacing, color, motion) is intentional and consistent
3. **Delight** — Micro-interactions and polish create emotional connection

---

## 1. Color System

### 1.1 Palette Construction

Never use raw CSS color names (`red`, `blue`, `green`). Build a curated palette:

```css
:root {
  /* === Primary Brand === */
  --color-primary-50:  hsl(220, 90%, 96%);   /* Lightest tint — backgrounds */
  --color-primary-100: hsl(220, 85%, 90%);
  --color-primary-200: hsl(220, 80%, 80%);
  --color-primary-300: hsl(220, 75%, 68%);
  --color-primary-400: hsl(220, 70%, 56%);   /* Default interactive */
  --color-primary-500: hsl(220, 72%, 46%);   /* Primary brand color */
  --color-primary-600: hsl(220, 75%, 38%);   /* Hover state */
  --color-primary-700: hsl(220, 78%, 30%);   /* Active/pressed */
  --color-primary-800: hsl(220, 80%, 22%);
  --color-primary-900: hsl(220, 85%, 14%);   /* Darkest shade */

  /* === Neutral (Gray) Scale === */
  --color-neutral-0:   hsl(0, 0%, 100%);     /* Pure white */
  --color-neutral-50:  hsl(220, 20%, 97%);   /* Page background */
  --color-neutral-100: hsl(220, 16%, 93%);   /* Card backgrounds */
  --color-neutral-200: hsl(220, 14%, 86%);   /* Borders, dividers */
  --color-neutral-300: hsl(220, 12%, 72%);   /* Placeholder text */
  --color-neutral-400: hsl(220, 10%, 56%);   /* Secondary text */
  --color-neutral-500: hsl(220, 10%, 42%);
  --color-neutral-600: hsl(220, 12%, 32%);   /* Body text */
  --color-neutral-700: hsl(220, 14%, 22%);   /* Headings */
  --color-neutral-800: hsl(220, 16%, 14%);   /* Dark backgrounds */
  --color-neutral-900: hsl(220, 20%, 8%);    /* Darkest */

  /* === Semantic Colors === */
  --color-success:     hsl(152, 60%, 42%);
  --color-success-bg:  hsl(152, 60%, 95%);
  --color-warning:     hsl(38,  92%, 50%);
  --color-warning-bg:  hsl(38,  92%, 95%);
  --color-error:       hsl(0,   72%, 51%);
  --color-error-bg:    hsl(0,   72%, 96%);
  --color-info:        hsl(210, 80%, 52%);
  --color-info-bg:     hsl(210, 80%, 96%);
}
```

### 1.2 Color Rules

| Rule | Why |
|------|-----|
| Use HSL (or OKLCH) not hex | HSL is human-readable; you can adjust lightness/saturation intuitively |
| Keep the same hue across a color ramp | Varying hue creates visual noise. Keep hue ±5° within a ramp |
| Maximum 3 hues per page | Primary + accent + neutral. More = chaos |
| Text contrast ≥ 4.5:1 (AA) | Non-negotiable accessibility requirement |
| Large text contrast ≥ 3:1 | Headings ≥ 18px bold or ≥ 24px regular |
| Never rely on color alone | Always pair color with text, icons, or patterns for status |
| Dark mode: reduce saturation 10-20% | Fully saturated colors on dark backgrounds cause eye strain |

### 1.3 Dark Mode Strategy

```css
@media (prefers-color-scheme: dark) {
  :root {
    --bg-primary:    var(--color-neutral-900);
    --bg-surface:    var(--color-neutral-800);
    --bg-elevated:   hsl(220, 16%, 18%);
    --text-primary:  var(--color-neutral-100);
    --text-secondary: var(--color-neutral-400);
    --border-default: hsl(220, 14%, 24%);
  }
}
```

---

## 2. Typography System

### 2.1 Type Scale (Based on 1.25 ratio — "Major Third")

```css
:root {
  /* Font families */
  --font-sans:    'Inter', 'Segoe UI', system-ui, -apple-system, sans-serif;
  --font-display: 'Inter', 'Segoe UI', system-ui, sans-serif;
  --font-mono:    'JetBrains Mono', 'Fira Code', 'Consolas', monospace;

  /* Type scale */
  --text-xs:    0.75rem;    /* 12px — captions, labels */
  --text-sm:    0.875rem;   /* 14px — secondary text, helper text */
  --text-base:  1rem;       /* 16px — body text */
  --text-md:    1.125rem;   /* 18px — emphasized body */
  --text-lg:    1.25rem;    /* 20px — card titles, section intros */
  --text-xl:    1.5rem;     /* 24px — h4 */
  --text-2xl:   1.875rem;   /* 30px — h3 */
  --text-3xl:   2.25rem;    /* 36px — h2 */
  --text-4xl:   3rem;       /* 48px — h1 */
  --text-5xl:   3.75rem;    /* 60px — hero headlines */

  /* Line heights */
  --leading-tight:   1.2;   /* Headings */
  --leading-snug:    1.35;  /* Subheadings */
  --leading-normal:  1.5;   /* Body text */
  --leading-relaxed: 1.625; /* Long-form reading */

  /* Font weights */
  --font-regular:   400;
  --font-medium:    500;
  --font-semibold:  600;
  --font-bold:      700;
  --font-extrabold: 800;

  /* Letter spacing */
  --tracking-tight:  -0.025em;  /* Large headings */
  --tracking-normal: 0;         /* Body text */
  --tracking-wide:   0.025em;   /* All-caps labels */
  --tracking-wider:  0.05em;    /* Overline text */
}
```

### 2.2 Typography Rules

| Rule | Implementation |
|------|---------------|
| One `<h1>` per page | It's the page's title. Period. |
| Never skip heading levels | h1 → h2 → h3, never h1 → h3 |
| Body text ≥ 16px | Anything smaller is hard to read |
| Line length 45-75 characters | Use `max-width: 65ch` on text blocks |
| Use `font-display: swap` on @font-face | Prevent invisible text during font load |
| Limit to 2 font families max | One for headings, one for body (or same family, different weights) |

---

## 3. Spacing System

### 3.1 The 4px / 8px Base Grid

All spacing should be multiples of 4px. Primary spacings use 8px multiples:

```css
:root {
  --space-0:   0;
  --space-0.5: 0.125rem;  /* 2px  — micro adjustments only */
  --space-1:   0.25rem;   /* 4px  */
  --space-1.5: 0.375rem;  /* 6px  */
  --space-2:   0.5rem;    /* 8px  */
  --space-3:   0.75rem;   /* 12px */
  --space-4:   1rem;      /* 16px */
  --space-5:   1.25rem;   /* 20px */
  --space-6:   1.5rem;    /* 24px */
  --space-8:   2rem;      /* 32px */
  --space-10:  2.5rem;    /* 40px */
  --space-12:  3rem;      /* 48px */
  --space-16:  4rem;      /* 64px */
  --space-20:  5rem;      /* 80px */
  --space-24:  6rem;      /* 96px */
  --space-32:  8rem;      /* 128px */
}
```

### 3.2 Spacing Rules

- **NEVER** use arbitrary values like `13px`, `27px`, `2.3rem`
- **Padding inside components**: `--space-3` to `--space-6` (12-24px)
- **Gap between sibling elements**: `--space-2` to `--space-4` (8-16px)
- **Section spacing**: `--space-16` to `--space-24` (64-96px)
- **Consistent internal padding**: Cards, modals, and panels should use the same padding

---

## 4. Border Radius System

```css
:root {
  --radius-none: 0;
  --radius-sm:   0.25rem;   /* 4px  — tags, badges */
  --radius-md:   0.5rem;    /* 8px  — buttons, inputs */
  --radius-lg:   0.75rem;   /* 12px — cards, panels */
  --radius-xl:   1rem;      /* 16px — modals, large cards */
  --radius-2xl:  1.5rem;    /* 24px — hero sections */
  --radius-full: 9999px;    /* Perfect circles, pills */
}
```

**Rule**: Use the SAME border-radius consistently within a component family. If buttons use
`--radius-md`, inputs should too. Cards and their children share a radius tier.

---

## 5. Shadow & Elevation System

```css
:root {
  /* Subtle — for borders and dividers */
  --shadow-xs:  0 1px 2px 0 rgba(0, 0, 0, 0.05);
  /* Default — cards at rest */
  --shadow-sm:  0 1px 3px 0 rgba(0, 0, 0, 0.1),
                0 1px 2px -1px rgba(0, 0, 0, 0.1);
  /* Raised — hovered cards, dropdowns */
  --shadow-md:  0 4px 6px -1px rgba(0, 0, 0, 0.1),
                0 2px 4px -2px rgba(0, 0, 0, 0.1);
  /* Prominent — modals, popovers */
  --shadow-lg:  0 10px 15px -3px rgba(0, 0, 0, 0.1),
                0 4px 6px -4px rgba(0, 0, 0, 0.1);
  /* Floating — tooltips, overlays */
  --shadow-xl:  0 20px 25px -5px rgba(0, 0, 0, 0.1),
                0 8px 10px -6px rgba(0, 0, 0, 0.1);
}
```

### Elevation Hierarchy

```
Level 0 → Background (no shadow)
Level 1 → Cards, sections (--shadow-sm)
Level 2 → Hovered cards, dropdowns (--shadow-md)
Level 3 → Modals, dialogs (--shadow-lg)
Level 4 → Tooltips, toasts (--shadow-xl)
```

---

## 6. Micro-Animations & Motion Design

### 6.1 Timing Functions

```css
:root {
  /* Standard easing — most UI interactions */
  --ease-default:    cubic-bezier(0.4, 0, 0.2, 1);
  /* Entrance — elements appearing */
  --ease-out:        cubic-bezier(0, 0, 0.2, 1);
  /* Exit — elements disappearing */
  --ease-in:         cubic-bezier(0.4, 0, 1, 1);
  /* Bouncy — playful interactions */
  --ease-bounce:     cubic-bezier(0.34, 1.56, 0.64, 1);
  /* Smooth spring — premium feel */
  --ease-spring:     cubic-bezier(0.22, 1, 0.36, 1);

  /* Durations */
  --duration-fast:   150ms;   /* Hover states, toggles */
  --duration-normal: 250ms;   /* Most transitions */
  --duration-slow:   350ms;   /* Complex animations */
  --duration-slower: 500ms;   /* Page transitions */
}
```

### 6.2 The Golden Rules of Animation

| Rule | Why |
|------|-----|
| Only animate `transform` and `opacity` | These are GPU-accelerated; never animate `width`, `height`, `top`, `left` |
| Duration 150-500ms | Under 150ms feels instant (no feedback). Over 500ms feels sluggish |
| Use `will-change` sparingly | Only on elements that WILL animate, and remove after animation |
| Always respect `prefers-reduced-motion` | Wrap in `@media (prefers-reduced-motion: no-preference)` |
| Every animation needs purpose | Don't animate for decoration — animate for feedback or direction |

### 6.3 Essential Micro-Animation Patterns

```css
/* === Button Hover — Lift + Shadow === */
.btn-primary {
  transition: transform var(--duration-fast) var(--ease-default),
              box-shadow var(--duration-fast) var(--ease-default);
}
.btn-primary:hover {
  transform: translateY(-1px);
  box-shadow: var(--shadow-md);
}
.btn-primary:active {
  transform: translateY(0) scale(0.98);
  box-shadow: var(--shadow-xs);
}

/* === Card Hover — Subtle Elevation === */
.card {
  transition: transform var(--duration-normal) var(--ease-spring),
              box-shadow var(--duration-normal) var(--ease-spring);
}
.card:hover {
  transform: translateY(-4px);
  box-shadow: var(--shadow-lg);
}

/* === Fade-In on Load === */
@keyframes fadeInUp {
  from {
    opacity: 0;
    transform: translateY(12px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}
.animate-fade-in {
  animation: fadeInUp var(--duration-slow) var(--ease-out) both;
}

/* === Staggered Children === */
.stagger-children > * {
  opacity: 0;
  animation: fadeInUp var(--duration-slow) var(--ease-out) both;
}
.stagger-children > *:nth-child(1) { animation-delay: 0ms; }
.stagger-children > *:nth-child(2) { animation-delay: 75ms; }
.stagger-children > *:nth-child(3) { animation-delay: 150ms; }
.stagger-children > *:nth-child(4) { animation-delay: 225ms; }
.stagger-children > *:nth-child(5) { animation-delay: 300ms; }

/* === Skeleton Loading Pulse === */
@keyframes shimmer {
  0%   { background-position: -200% 0; }
  100% { background-position: 200% 0; }
}
.skeleton {
  background: linear-gradient(
    90deg,
    var(--color-neutral-100) 25%,
    var(--color-neutral-200) 50%,
    var(--color-neutral-100) 75%
  );
  background-size: 200% 100%;
  animation: shimmer 1.5s infinite;
  border-radius: var(--radius-md);
}

/* === Respect reduced motion === */
@media (prefers-reduced-motion: reduce) {
  *, *::before, *::after {
    animation-duration: 0.01ms !important;
    animation-iteration-count: 1 !important;
    transition-duration: 0.01ms !important;
  }
}
```

### 6.4 Interactive Link Animations

```css
/* === Animated underline (left to right) === */
.link-animated {
  position: relative;
  text-decoration: none;
}
.link-animated::after {
  content: '';
  position: absolute;
  bottom: -2px;
  left: 0;
  width: 0;
  height: 2px;
  background: currentColor;
  transition: width var(--duration-normal) var(--ease-default);
}
.link-animated:hover::after {
  width: 100%;
}
```

---

## 7. Glassmorphism & Modern Effects

### 7.1 Frosted Glass Cards

```css
.glass-card {
  background: rgba(255, 255, 255, 0.08);
  backdrop-filter: blur(16px) saturate(180%);
  -webkit-backdrop-filter: blur(16px) saturate(180%);
  border: 1px solid rgba(255, 255, 255, 0.15);
  border-radius: var(--radius-xl);
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.12);
}

/* Light mode variant */
.glass-card--light {
  background: rgba(255, 255, 255, 0.65);
  backdrop-filter: blur(12px) saturate(150%);
  border: 1px solid rgba(255, 255, 255, 0.4);
}
```

### 7.2 Gradient Techniques

```css
/* === Premium gradient text === */
.gradient-text {
  background: linear-gradient(135deg, hsl(220, 80%, 56%), hsl(280, 70%, 58%));
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}

/* === Mesh-like gradient background === */
.gradient-bg {
  background:
    radial-gradient(ellipse at 20% 50%, hsla(220, 80%, 60%, 0.15) 0%, transparent 50%),
    radial-gradient(ellipse at 80% 20%, hsla(280, 70%, 58%, 0.1) 0%, transparent 50%),
    radial-gradient(ellipse at 50% 80%, hsla(180, 60%, 50%, 0.08) 0%, transparent 50%),
    var(--bg-primary);
}

/* === Animated gradient border === */
.gradient-border {
  position: relative;
  background: var(--bg-surface);
  border-radius: var(--radius-lg);
  padding: var(--space-6);
}
.gradient-border::before {
  content: '';
  position: absolute;
  inset: -1px;
  border-radius: inherit;
  padding: 1px;
  background: linear-gradient(135deg, hsl(220, 80%, 56%), hsl(280, 70%, 58%));
  -webkit-mask: linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0);
  -webkit-mask-composite: xor;
  mask-composite: exclude;
}
```

---

## 8. Component Design Patterns

### 8.1 Buttons

Every button must have these states: **default → hover → active/pressed → focus → disabled**

```css
.btn {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: var(--space-2);
  padding: var(--space-2) var(--space-5);
  font-family: var(--font-sans);
  font-size: var(--text-sm);
  font-weight: var(--font-semibold);
  line-height: 1;
  border: none;
  border-radius: var(--radius-md);
  cursor: pointer;
  transition: all var(--duration-fast) var(--ease-default);
  /* Minimum touch target */
  min-height: 2.5rem;    /* 40px */
  min-width: 2.5rem;
}

.btn:focus-visible {
  outline: 2px solid var(--color-primary-400);
  outline-offset: 2px;
}

.btn:disabled {
  opacity: 0.5;
  cursor: not-allowed;
  pointer-events: none;
}
```

### 8.2 Cards

```css
.card {
  background: var(--bg-surface);
  border: 1px solid var(--border-default);
  border-radius: var(--radius-lg);
  padding: var(--space-6);
  transition: transform var(--duration-normal) var(--ease-spring),
              box-shadow var(--duration-normal) var(--ease-spring);
}
.card:hover {
  transform: translateY(-2px);
  box-shadow: var(--shadow-md);
}

/* Card image should respect card radius */
.card__image {
  border-radius: calc(var(--radius-lg) - 4px);
  /* Account for card padding */
  margin: calc(var(--space-6) * -1);
  margin-bottom: var(--space-4);
  width: calc(100% + var(--space-6) * 2);
  object-fit: cover;
}
```

### 8.3 Form Inputs

```css
.input {
  width: 100%;
  padding: var(--space-2) var(--space-3);
  font-family: var(--font-sans);
  font-size: var(--text-base);
  color: var(--text-primary);
  background: var(--bg-surface);
  border: 1.5px solid var(--border-default);
  border-radius: var(--radius-md);
  transition: border-color var(--duration-fast) var(--ease-default),
              box-shadow var(--duration-fast) var(--ease-default);
  min-height: 2.5rem;
}
.input:focus {
  outline: none;
  border-color: var(--color-primary-400);
  box-shadow: 0 0 0 3px hsla(220, 80%, 56%, 0.15);
}
.input::placeholder {
  color: var(--color-neutral-300);
}
.input:disabled {
  opacity: 0.6;
  background: var(--color-neutral-100);
  cursor: not-allowed;
}
.input--error {
  border-color: var(--color-error);
}
.input--error:focus {
  box-shadow: 0 0 0 3px hsla(0, 72%, 51%, 0.15);
}
```

### 8.4 Modals & Dialogs

```css
/* Backdrop */
.modal-backdrop {
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.5);
  backdrop-filter: blur(4px);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
  /* Animation */
  opacity: 0;
  transition: opacity var(--duration-normal) var(--ease-default);
}
.modal-backdrop.is-active {
  opacity: 1;
}

/* Modal content */
.modal {
  background: var(--bg-surface);
  border-radius: var(--radius-xl);
  box-shadow: var(--shadow-xl);
  padding: var(--space-8);
  max-width: 32rem;
  width: 90%;
  max-height: 85vh;
  overflow-y: auto;
  /* Animation */
  transform: translateY(16px) scale(0.96);
  transition: transform var(--duration-slow) var(--ease-spring);
}
.modal-backdrop.is-active .modal {
  transform: translateY(0) scale(1);
}
```

### 8.5 Toast Notifications

```css
.toast {
  position: fixed;
  top: var(--space-6);
  right: var(--space-6);
  display: flex;
  align-items: center;
  gap: var(--space-3);
  padding: var(--space-3) var(--space-5);
  border-radius: var(--radius-lg);
  box-shadow: var(--shadow-lg);
  font-size: var(--text-sm);
  font-weight: var(--font-medium);
  z-index: 9999;
  /* Animation */
  transform: translateY(-100%) scale(0.95);
  opacity: 0;
  transition: all var(--duration-normal) var(--ease-spring);
}
.toast.is-visible {
  transform: translateY(0) scale(1);
  opacity: 1;
}
```

---

## 9. Layout Patterns

### 9.1 CSS Grid for Page Layouts

```css
/* Bento grid — modern asymmetric layout */
.bento-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
  gap: var(--space-6);
}

/* Featured item spans two columns */
.bento-grid__featured {
  grid-column: span 2;
}

@media (max-width: 640px) {
  .bento-grid__featured {
    grid-column: span 1;
  }
}
```

### 9.2 Responsive Container

```css
.container {
  width: 100%;
  max-width: 1200px;
  margin-inline: auto;
  padding-inline: var(--space-4);
}

@media (min-width: 768px) {
  .container {
    padding-inline: var(--space-8);
  }
}
```

### 9.3 Sticky Navbar with Scroll Effect

```css
.navbar {
  position: sticky;
  top: 0;
  z-index: 100;
  background: rgba(255, 255, 255, 0.85);
  backdrop-filter: blur(12px);
  border-bottom: 1px solid transparent;
  transition: border-color var(--duration-normal) var(--ease-default),
              background var(--duration-normal) var(--ease-default);
}

/* Applied via JS on scroll */
.navbar.is-scrolled {
  border-color: var(--border-default);
  background: rgba(255, 255, 255, 0.95);
}
```

---

## 10. Responsive Design

### 10.1 Breakpoints

```css
/* Mobile-first approach */
/* sm: 640px  — Large phones, small tablets */
/* md: 768px  — Tablets */
/* lg: 1024px — Laptops */
/* xl: 1280px — Desktops */
/* 2xl: 1536px — Large screens */

@media (min-width: 640px)  { /* sm */ }
@media (min-width: 768px)  { /* md */ }
@media (min-width: 1024px) { /* lg */ }
@media (min-width: 1280px) { /* xl */ }
```

### 10.2 Responsive Typography

```css
/* Use clamp() for fluid type scaling */
h1 { font-size: clamp(1.875rem, 4vw + 1rem, 3.75rem); }
h2 { font-size: clamp(1.5rem, 3vw + 0.75rem, 2.25rem); }
h3 { font-size: clamp(1.25rem, 2vw + 0.5rem, 1.875rem); }
```

### 10.3 Touch Targets

- Minimum 44×44px for all interactive elements (WCAG 2.5.5)
- On mobile: increase to 48×48px
- Add `padding` to small icons/links to meet the target without visual bloat

---

## 11. Accessibility Checklist

### Must-Have (Non-Negotiable)

- [ ] Every page has exactly one `<h1>`
- [ ] Heading hierarchy never skips levels (h1 → h2 → h3)
- [ ] All images have descriptive `alt` text (or `alt=""` for decorative)
- [ ] All form inputs have associated `<label>` elements
- [ ] Focus states are visible and styled (never `outline: none` without a replacement)
- [ ] Color contrast ratio ≥ 4.5:1 for normal text
- [ ] All interactive elements are keyboard-accessible (Tab, Enter, Escape)
- [ ] `prefers-reduced-motion` is respected for all animations
- [ ] `aria-label` on icon-only buttons
- [ ] Semantic HTML: `<nav>`, `<main>`, `<article>`, `<aside>`, `<section>`, `<footer>`

### Should-Have

- [ ] Skip navigation link for keyboard users
- [ ] `aria-live` regions for dynamic content updates
- [ ] Focus trapped inside modals when open
- [ ] `lang` attribute on `<html>`
- [ ] Error messages associated with inputs via `aria-describedby`

---

## 12. Anti-Patterns to AVOID

| Anti-Pattern | Why It Fails | What to Do Instead |
|---|---|---|
| Purple/indigo everything | AI-default palette that makes every app look identical | Use the project's brand palette |
| Excessive border-radius (`border-radius: 24px` on everything) | Destroys visual hierarchy | Use tiered radius system |
| Shadow on every element | Visual noise, performance hit | Shadow = elevation; use sparingly |
| Animating `width`, `height`, `margin` | Triggers layout reflow, causes jank | Animate `transform` and `opacity` only |
| `!important` everywhere | Breaks cascade, causes maintenance nightmares | Fix specificity properly |
| Using `div` for everything | No semantic meaning, hurts accessibility | Use appropriate HTML5 elements |
| Inline styles in JavaScript | Hard to override, no hover states | Use CSS classes, toggle with JS |
| Placeholder-only labels | Disappears on focus, accessibility fail | Always use visible `<label>` |
| Auto-playing animations | Distracting, accessibility violation | Respect `prefers-reduced-motion` |
| Tiny click targets | Frustrating on mobile, fails WCAG | Minimum 44×44px |

---

## 13. Design Quality Checklist

Before shipping any UI, verify:

### Visual
- [ ] Spacing is consistent (uses spacing scale, no magic numbers)
- [ ] Typography follows the type scale
- [ ] Colors come from the palette (no raw hex/rgb in component code)
- [ ] Border radius is consistent within component families
- [ ] Shadows follow the elevation system

### Interaction
- [ ] All buttons have hover, active, and focus states
- [ ] Links have visible hover indicators
- [ ] Inputs have focus, error, and disabled states
- [ ] Loading states use skeleton loaders (not just spinners)
- [ ] Empty states have helpful messages + CTAs
- [ ] Error states explain what went wrong + how to fix it

### Performance
- [ ] No layout shift (CLS) during page load
- [ ] Animations use GPU-accelerated properties only
- [ ] Images are appropriately sized and lazy-loaded
- [ ] Fonts use `font-display: swap`

### Responsiveness
- [ ] Tested at 320px, 768px, 1024px, 1440px
- [ ] Touch targets ≥ 44px on mobile
- [ ] No horizontal scrolling at any breakpoint
- [ ] Text is readable without zooming on mobile

---

## 14. CSS Architecture Best Practices

### Use CSS Custom Properties for Theming
```css
/* Define ALL design decisions as variables */
:root {
  --bg-primary:    var(--color-neutral-0);
  --bg-surface:    var(--color-neutral-50);
  --bg-elevated:   var(--color-neutral-0);
  --text-primary:  var(--color-neutral-700);
  --text-secondary: var(--color-neutral-400);
  --border-default: var(--color-neutral-200);
}
```

### Cascade Layers (Modern CSS)
```css
@layer reset, base, components, utilities;

@layer reset { /* CSS reset */ }
@layer base { /* Typography, color variables */ }
@layer components { /* .btn, .card, .navbar */ }
@layer utilities { /* .sr-only, .visually-hidden */ }
```

### BEM Naming Convention
```css
/* Block */
.card { }

/* Element */
.card__title { }
.card__image { }
.card__body { }

/* Modifier */
.card--featured { }
.card--compact { }
```

---

## Quick Reference: Premium Feel Checklist

When building any new component or page, ask:

1. ✦ **Does it have motion?** → Hover, focus, and entrance animations
2. ✦ **Does it have depth?** → Appropriate shadows and layering
3. ✦ **Does it have rhythm?** → Consistent spacing from the scale
4. ✦ **Does it have hierarchy?** → Clear visual weight (size, color, weight)
5. ✦ **Does it have feedback?** → Every interaction has a visible response
6. ✦ **Does it have grace?** → Error states, empty states, loading states handled
7. ✦ **Does it have accessibility?** → Keyboard, screen reader, contrast all work
8. ✦ **Does it have consistency?** → Uses design tokens, not ad-hoc values
