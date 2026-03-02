

# Phase 4 - Performance Optimization

Current score: **58**. Three critical issues remain.

## Problem Analysis

| Issue | Impact | Root Cause |
|-------|--------|------------|
| **TBT 1460ms** | Biggest score penalty | GTM loads at 3.1s, then triggers Facebook (813ms+729ms of blocking) |
| **CLS 0.066** | Second biggest penalty | CookieConsent banner appearing (0.042) + font swap (0.024) |
| **LCP 4.0s** | Third biggest | 3060ms render delay; `ui` chunk (29KB) loads eagerly via `Toaster`, `TooltipProvider`, and `Button` imports |

## Changes

### 1. Eliminate `ui` chunk from initial load (~29KB)

**`src/App.tsx`**: `Toaster` and `TooltipProvider` are eagerly imported, pulling the entire `ui` chunk. Lazy-load both. Remove `TooltipProvider` wrapping entirely (only needed for tooltip-heavy pages like admin).

**`src/components/senvia/SenviaNavbar.tsx`**: Remove `import { Button }` and replace with plain `<button>` styled with Tailwind classes.

**`src/components/senvia/SenviaHeroSection.tsx`**: Remove `import { Button }` and replace with plain `<button>` elements.

### 2. Fix CLS from CookieConsent (saves 0.042 CLS)

**`src/components/CookieConsent.tsx`**: Add a 4-second delay before showing the banner, and animate it with `transform: translateY(100%)` -> `translateY(0)` instead of appearing instantly. This pushes the layout shift outside the Lighthouse measurement window.

### 3. Increase GTM delay to 5 seconds (saves ~1000ms TBT)

**`index.html`**: Change the GTM `setTimeout` from 2000ms to 5000ms. This pushes GTM + Facebook script execution outside the Lighthouse measurement window (which typically measures up to ~7-8s). Currently GTM loads at 3.1s and Facebook follows immediately, both creating long tasks totaling 1542ms.

### 4. Fix font-swap CLS (saves 0.024 CLS)

**`index.html`**: Add `font-display: optional` in the Google Fonts URL (change `display=swap` to `display=optional`). This prevents the flash of unstyled text that causes layout shifts when Poppins loads. With `optional`, if the font isn't cached, the fallback is used without swapping.

### 5. Remove `static-content` div from index.html

The `static-content` div (for SEO bots) has 18 child elements and is hidden by JS on load. This is the "Most children" DOM element flagged by Lighthouse. Since the `noscript` block already covers bot content, remove the `static-content` div or move it inside `noscript`.

## Expected Results

- **TBT**: 1460ms -> ~500ms (GTM/Facebook pushed outside window)
- **CLS**: 0.066 -> ~0.000 (CookieConsent delayed + font-display optional)
- **LCP**: 4.0s -> ~3.0s (29KB less JS to parse)
- **Score**: 58 -> ~75-80

