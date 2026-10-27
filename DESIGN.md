# SENVIA public site design contract

## Scope and reference
The support route extends the existing Astro site. Source of truth: `src/styles/global.css`, `Base.astro`, existing header/footer and contact page. Preserve the established brand; no framework or visual identity change.

## Tokens and typography
Reuse Poppins and global heading scale. Ground `--bg`, elevated surface `--bg-soft`, foreground `--fg`, supporting copy `--fg-soft`, accent `--accent`. Container `--container`, spacing `--space-1` through `--space-8`, corner radii `--radius` and `--radius-lg`. No new palette.

## Composition
Support hero uses a two-column layout: short purpose and installation steps on the left, a download panel on the right. A single primary download action dominates. Manual selection is always available. Stack at 800px; full-width action on narrow screens. Header/footer remain shared.

## Components and states
Use shared `.btn` primitives. Native labelled select, visible focus, system detection live status, expandable installation instructions and real download links. Desktop, unknown architecture, unsupported mobile, no JavaScript and failed client-hints states have explicit guidance. No automatic download or installer execution.

## Accessibility and motion
Semantic headings and lists, 44px minimum controls, full keyboard operation, polite detection status, no decorative motion. Reuse existing reduced-motion rules. The download panel must not overflow at 375px.

## Content and trust
Explain that installation enables ongoing remote technical assistance and that a bar is shown during remote desktop access. Do not claim the download creates per-session approval, is Apple-notarized or has a commercial Windows signature.

## Accepted constraints
Browsers may hide CPU architecture. Default Windows to x64 with an explicitly labelled recommendation, never claim exact detection without client hints. macOS uses the universal package; Linux offers explicit x64/ARM64 variants with installation instructions. iOS/Android show desktop transfer guidance rather than an executable recommendation.
