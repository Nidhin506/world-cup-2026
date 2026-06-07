---
name: Trophy Gold & Carbon
colors:
  surface: '#131313'
  surface-dim: '#131313'
  surface-bright: '#3a3939'
  surface-container-lowest: '#0e0e0e'
  surface-container-low: '#1c1b1b'
  surface-container: '#201f1f'
  surface-container-high: '#2a2a2a'
  surface-container-highest: '#353534'
  on-surface: '#e5e2e1'
  on-surface-variant: '#d3c5ac'
  inverse-surface: '#e5e2e1'
  inverse-on-surface: '#313030'
  outline: '#9c8f79'
  outline-variant: '#4f4633'
  surface-tint: '#f9bd22'
  primary: '#ffe1a7'
  on-primary: '#402d00'
  primary-container: '#fbbf24'
  on-primary-container: '#6c4f00'
  inverse-primary: '#795900'
  secondary: '#b9c7e0'
  on-secondary: '#233144'
  secondary-container: '#3c4a5e'
  on-secondary-container: '#abb9d2'
  tertiary: '#e7e4e3'
  on-tertiary: '#313030'
  tertiary-container: '#cac8c7'
  on-tertiary-container: '#545453'
  error: '#ffb4ab'
  on-error: '#690005'
  error-container: '#93000a'
  on-error-container: '#ffdad6'
  primary-fixed: '#ffdf9f'
  primary-fixed-dim: '#f9bd22'
  on-primary-fixed: '#261a00'
  on-primary-fixed-variant: '#5c4300'
  secondary-fixed: '#d5e3fd'
  secondary-fixed-dim: '#b9c7e0'
  on-secondary-fixed: '#0d1c2f'
  on-secondary-fixed-variant: '#3a485c'
  tertiary-fixed: '#e5e2e1'
  tertiary-fixed-dim: '#c8c6c5'
  on-tertiary-fixed: '#1c1b1b'
  on-tertiary-fixed-variant: '#474746'
  background: '#131313'
  on-background: '#e5e2e1'
  surface-variant: '#353534'
typography:
  headline-xl:
    fontFamily: Playfair Display
    fontSize: 48px
    fontWeight: '700'
    lineHeight: 56px
    letterSpacing: -0.02em
  headline-lg:
    fontFamily: Playfair Display
    fontSize: 32px
    fontWeight: '700'
    lineHeight: 40px
  headline-lg-mobile:
    fontFamily: Playfair Display
    fontSize: 28px
    fontWeight: '700'
    lineHeight: 36px
  headline-md:
    fontFamily: Playfair Display
    fontSize: 24px
    fontWeight: '600'
    lineHeight: 32px
  body-lg:
    fontFamily: Inter
    fontSize: 18px
    fontWeight: '400'
    lineHeight: 28px
  body-md:
    fontFamily: Inter
    fontSize: 16px
    fontWeight: '400'
    lineHeight: 24px
  body-sm:
    fontFamily: Inter
    fontSize: 14px
    fontWeight: '400'
    lineHeight: 20px
  label-caps:
    fontFamily: Inter
    fontSize: 12px
    fontWeight: '700'
    lineHeight: 16px
    letterSpacing: 0.1em
  stats-display:
    fontFamily: Inter
    fontSize: 24px
    fontWeight: '700'
    lineHeight: 32px
    letterSpacing: -0.01em
rounded:
  sm: 0.125rem
  DEFAULT: 0.25rem
  md: 0.375rem
  lg: 0.5rem
  xl: 0.75rem
  full: 9999px
spacing:
  base: 8px
  container-padding-desktop: 40px
  container-padding-mobile: 20px
  gutter: 24px
  section-gap: 64px
---

## Brand & Style
The design system embodies the prestige and high-stakes atmosphere of the FIFA World Cup 2026. It targets an audience that values exclusivity, precision, and historical significance. The aesthetic is rooted in **Modern Minimalism with Metallic Accents**, drawing inspiration from luxury watchmaking and championship trophies.

The emotional response should be one of "earned access"—the user feels they are viewing an elite, authoritative command center. The UI avoids trendy transparency in favor of solid, "weighted" surfaces that feel permanent and premium.

## Colors
The palette is built on a foundation of **Carbon Black (#0a0a0a)** to ensure maximum contrast and visual depth. **Brushed Gold (#fbbf24)** is used sparingly as a "prestige" accent for primary actions, critical highlights, and championship-related data points. 

**Slate Gray (#334155)** serves as a functional secondary color for utility icons and secondary information, preventing the UI from feeling overly decorative. Surfaces utilize **#1a1a1a** for card backgrounds to create a clear hierarchical distinction from the canvas.

## Typography
The typographic strategy creates a "high-end editorial" feel. **Playfair Display** is reserved for headlines and editorial titles, evoking the tradition and history of the tournament. 

**Inter** provides a utilitarian, high-performance counterpoint for data, statistics, and body copy. Use `label-caps` for table headers and category tags to maintain a structured, disciplined layout. For live match scores and primary statistics, use `stats-display` to ensure immediate legibility.

## Layout & Spacing
The design system employs a **Fixed Grid** philosophy for desktop to maintain a cinematic, composed feel, while transitioning to a fluid model for mobile.

- **Desktop (1440px+):** 12-column grid with 24px gutters. Content is centered with generous 40px side margins to allow the "Carbon" background to frame the UI.
- **Tablet:** 8-column grid with 16px gutters.
- **Mobile:** 4-column grid. Headings scale down via the `-mobile` tokens, and vertical padding is reduced to 20px.

Spacing follows a strict 8px rhythmic scale. Use wider gaps (64px+) between major sections (e.g., Live Scores vs. Tournament Bracket) to reinforce the premium, "un-crowded" aesthetic.

## Elevation & Depth
Depth is achieved through **Tonal Layering** and **Hairline Outlines** rather than aggressive shadows. 

1.  **Level 0 (Canvas):** Pure Carbon Black (#0a0a0a).
2.  **Level 1 (Cards/Containers):** Solid Slate-tinted Black (#1a1a1a).
3.  **Accents:** All Level 1 containers feature a **1px hairline border**. For standard components, use #334155 (Slate) at 50% opacity. For featured or active components, use the primary Gold (#fbbf24) at 30% opacity.
4.  **Shadows:** Use a single, subtle "Ambient Drop" shadow (0px 12px 24px rgba(0,0,0,0.5)) only for floating elements like modals or dropdowns.

## Shapes
The shape language is architectural and precise. A **Soft (0.25rem / 4px)** base radius is applied to most UI elements to provide just enough refinement without losing the "hard" masculine edge of a sports dashboard. 

Large containers and cards may use `rounded-lg` (8px) to soften the overall layout on larger screens, but buttons and input fields should remain at 4px to maintain a sharp, professional look.

## Components
- **Buttons:** Primary buttons use a solid Brushed Gold (#fbbf24) background with Black text. Secondary buttons are "Ghost" style with a 1px Slate Gray border.
- **Cards:** Solid background (#1a1a1a) with a subtle vertical gradient (Top: 5% lighter, Bottom: 0%). Hairline borders are mandatory for definition against the black canvas.
- **Lists:** Table rows and list items should be separated by 1px Slate Gray lines at 20% opacity. Avoid alternating row colors; use hover states with a 5% Gold tint instead.
- **Input Fields:** Darker than the card background (#050505) with 4px radius. Focus state triggers a 1px Gold border.
- **Chips/Badges:** Small, rectangular with `label-caps` text. Live status badges use a Gold pulse animation.
- **Progress Bars:** Use Gold for the "fill" and Slate Gray for the "track." Tracks should be thin (4px) to look technical and precise.