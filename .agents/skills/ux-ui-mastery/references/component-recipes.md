# UX/UI Mastery — Ready-to-Use CSS Component Recipes

## 1. Premium Navbar

```css
.navbar {
  position: sticky;
  top: 0;
  z-index: 100;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0.75rem 1.5rem;
  background: rgba(255, 255, 255, 0.85);
  backdrop-filter: blur(12px) saturate(180%);
  -webkit-backdrop-filter: blur(12px) saturate(180%);
  border-bottom: 1px solid rgba(0, 0, 0, 0.06);
  transition: all 0.25s cubic-bezier(0.4, 0, 0.2, 1);
}

.navbar.is-scrolled {
  padding: 0.5rem 1.5rem;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.08);
}
```

## 2. Hero Section

```css
.hero {
  min-height: 80vh;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  text-align: center;
  padding: 4rem 1.5rem;
  background:
    radial-gradient(ellipse at 20% 50%, hsla(220, 80%, 60%, 0.1) 0%, transparent 50%),
    radial-gradient(ellipse at 80% 20%, hsla(280, 70%, 58%, 0.08) 0%, transparent 50%);
}

.hero__title {
  font-size: clamp(2.25rem, 5vw + 1rem, 4.5rem);
  font-weight: 800;
  letter-spacing: -0.03em;
  line-height: 1.1;
  margin-bottom: 1.5rem;
}

.hero__subtitle {
  font-size: clamp(1rem, 1.5vw + 0.5rem, 1.25rem);
  color: var(--text-secondary, #6b7280);
  max-width: 48ch;
  line-height: 1.6;
  margin-bottom: 2.5rem;
}

.hero__cta-group {
  display: flex;
  gap: 1rem;
  flex-wrap: wrap;
  justify-content: center;
}
```

## 3. Feature / Bento Grid

```css
.feature-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
  gap: 1.5rem;
  padding: 4rem 0;
}

.feature-card {
  padding: 2rem;
  border-radius: 0.75rem;
  border: 1px solid var(--border-default, hsl(220, 14%, 90%));
  background: var(--bg-surface, #fff);
  transition: transform 0.3s cubic-bezier(0.22, 1, 0.36, 1),
              box-shadow 0.3s cubic-bezier(0.22, 1, 0.36, 1);
}
.feature-card:hover {
  transform: translateY(-4px);
  box-shadow: 0 12px 24px -8px rgba(0, 0, 0, 0.12);
}

.feature-card__icon {
  width: 3rem;
  height: 3rem;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 0.5rem;
  background: var(--color-primary-50, hsl(220, 90%, 96%));
  color: var(--color-primary-500, hsl(220, 72%, 46%));
  margin-bottom: 1rem;
  font-size: 1.25rem;
}

.feature-card__title {
  font-size: 1.125rem;
  font-weight: 600;
  margin-bottom: 0.5rem;
}

.feature-card__description {
  font-size: 0.875rem;
  color: var(--text-secondary, #6b7280);
  line-height: 1.6;
}
```

## 4. Premium Product Card

```css
.product-card {
  position: relative;
  border-radius: 0.75rem;
  overflow: hidden;
  border: 1px solid var(--border-default, hsl(220, 14%, 90%));
  background: var(--bg-surface, #fff);
  transition: transform 0.3s cubic-bezier(0.22, 1, 0.36, 1),
              box-shadow 0.3s cubic-bezier(0.22, 1, 0.36, 1);
}
.product-card:hover {
  transform: translateY(-4px);
  box-shadow: 0 16px 32px -8px rgba(0, 0, 0, 0.1);
}
.product-card:hover .product-card__image img {
  transform: scale(1.05);
}

.product-card__image {
  aspect-ratio: 4 / 3;
  overflow: hidden;
}
.product-card__image img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: transform 0.5s cubic-bezier(0.22, 1, 0.36, 1);
}

.product-card__badge {
  position: absolute;
  top: 0.75rem;
  left: 0.75rem;
  padding: 0.25rem 0.75rem;
  font-size: 0.75rem;
  font-weight: 600;
  border-radius: 9999px;
  background: var(--color-error, hsl(0, 72%, 51%));
  color: white;
}

.product-card__body {
  padding: 1rem 1.25rem 1.25rem;
}

.product-card__name {
  font-size: 0.9375rem;
  font-weight: 600;
  margin-bottom: 0.25rem;
}

.product-card__shop {
  font-size: 0.8125rem;
  color: var(--text-secondary, #6b7280);
  margin-bottom: 0.75rem;
}

.product-card__price-row {
  display: flex;
  align-items: baseline;
  gap: 0.5rem;
  margin-bottom: 1rem;
}

.product-card__price {
  font-size: 1.25rem;
  font-weight: 700;
  color: var(--text-primary, #1a1a2e);
}

.product-card__price-old {
  font-size: 0.875rem;
  color: var(--text-secondary, #6b7280);
  text-decoration: line-through;
}

.product-card__add {
  width: 100%;
  padding: 0.625rem 1rem;
  border: none;
  border-radius: 0.5rem;
  font-size: 0.875rem;
  font-weight: 600;
  cursor: pointer;
  background: var(--color-primary-500, hsl(220, 72%, 46%));
  color: white;
  transition: background 0.15s ease, transform 0.15s ease;
}
.product-card__add:hover {
  background: var(--color-primary-600, hsl(220, 75%, 38%));
  transform: translateY(-1px);
}
.product-card__add:active {
  transform: scale(0.98);
}
```

## 5. Modern Footer

```css
.footer {
  background: var(--color-neutral-900, hsl(220, 20%, 8%));
  color: var(--color-neutral-300, hsl(220, 12%, 72%));
  padding: 4rem 0 2rem;
}

.footer__grid {
  display: grid;
  grid-template-columns: 2fr repeat(3, 1fr);
  gap: 3rem;
  margin-bottom: 3rem;
}

@media (max-width: 768px) {
  .footer__grid {
    grid-template-columns: 1fr 1fr;
    gap: 2rem;
  }
}

@media (max-width: 480px) {
  .footer__grid {
    grid-template-columns: 1fr;
  }
}

.footer__brand-description {
  font-size: 0.875rem;
  line-height: 1.6;
  max-width: 32ch;
  color: var(--color-neutral-400, hsl(220, 10%, 56%));
}

.footer__column-title {
  font-size: 0.8125rem;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.05em;
  color: var(--color-neutral-100, hsl(220, 16%, 93%));
  margin-bottom: 1rem;
}

.footer__link {
  display: block;
  font-size: 0.875rem;
  color: var(--color-neutral-400, hsl(220, 10%, 56%));
  text-decoration: none;
  padding: 0.25rem 0;
  transition: color 0.15s ease;
}
.footer__link:hover {
  color: var(--color-neutral-100, hsl(220, 16%, 93%));
}

.footer__bottom {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding-top: 2rem;
  border-top: 1px solid hsl(220, 14%, 18%);
  font-size: 0.8125rem;
}
```

## 6. Scroll Reveal Animation (CSS-only with Intersection Observer)

```javascript
// Add to your JS initialization
function initScrollReveal() {
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('is-revealed');
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.1, rootMargin: '0px 0px -50px 0px' });

  document.querySelectorAll('[data-reveal]').forEach(el => observer.observe(el));
}
```

```css
/* Fade up */
[data-reveal] {
  opacity: 0;
  transform: translateY(20px);
  transition: opacity 0.6s cubic-bezier(0.22, 1, 0.36, 1),
              transform 0.6s cubic-bezier(0.22, 1, 0.36, 1);
}
[data-reveal].is-revealed {
  opacity: 1;
  transform: translateY(0);
}

/* Stagger children */
[data-reveal-stagger] > * {
  opacity: 0;
  transform: translateY(16px);
  transition: opacity 0.5s cubic-bezier(0.22, 1, 0.36, 1),
              transform 0.5s cubic-bezier(0.22, 1, 0.36, 1);
}
[data-reveal-stagger].is-revealed > *:nth-child(1) { transition-delay: 0ms; opacity: 1; transform: none; }
[data-reveal-stagger].is-revealed > *:nth-child(2) { transition-delay: 80ms; opacity: 1; transform: none; }
[data-reveal-stagger].is-revealed > *:nth-child(3) { transition-delay: 160ms; opacity: 1; transform: none; }
[data-reveal-stagger].is-revealed > *:nth-child(4) { transition-delay: 240ms; opacity: 1; transform: none; }
[data-reveal-stagger].is-revealed > *:nth-child(5) { transition-delay: 320ms; opacity: 1; transform: none; }
[data-reveal-stagger].is-revealed > *:nth-child(6) { transition-delay: 400ms; opacity: 1; transform: none; }

@media (prefers-reduced-motion: reduce) {
  [data-reveal],
  [data-reveal-stagger] > * {
    opacity: 1;
    transform: none;
    transition: none;
  }
}
```

## 7. Utility Classes

```css
/* Screen reader only */
.sr-only {
  position: absolute;
  width: 1px;
  height: 1px;
  padding: 0;
  margin: -1px;
  overflow: hidden;
  clip: rect(0, 0, 0, 0);
  white-space: nowrap;
  border: 0;
}

/* Focus visible ring */
.focus-ring:focus-visible {
  outline: 2px solid var(--color-primary-400);
  outline-offset: 2px;
}

/* Truncate text */
.truncate {
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

/* Line clamp */
.line-clamp-2 {
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.line-clamp-3 {
  display: -webkit-box;
  -webkit-line-clamp: 3;
  -webkit-box-orient: vertical;
  overflow: hidden;
}
```
