---
name: Electric Midnight
colors:
  surface: '#0f131c'
  surface-dim: '#0f131c'
  surface-bright: '#353942'
  surface-container-lowest: '#0a0e16'
  surface-container-low: '#181c24'
  surface-container: '#1c2028'
  surface-container-high: '#262a33'
  surface-container-highest: '#31353e'
  on-surface: '#dfe2ee'
  on-surface-variant: '#cbc3d7'
  inverse-surface: '#dfe2ee'
  inverse-on-surface: '#2c3039'
  outline: '#958ea0'
  outline-variant: '#494454'
  surface-tint: '#d0bcff'
  primary: '#d0bcff'
  on-primary: '#3c0091'
  primary-container: '#a078ff'
  on-primary-container: '#340080'
  inverse-primary: '#6d3bd7'
  secondary: '#4cd7f6'
  on-secondary: '#003640'
  secondary-container: '#03b5d3'
  on-secondary-container: '#00424e'
  tertiary: '#ffb2b7'
  on-tertiary: '#67001b'
  tertiary-container: '#ff516a'
  on-tertiary-container: '#5b0017'
  error: '#ffb4ab'
  on-error: '#690005'
  error-container: '#93000a'
  on-error-container: '#ffdad6'
  primary-fixed: '#e9ddff'
  primary-fixed-dim: '#d0bcff'
  on-primary-fixed: '#23005c'
  on-primary-fixed-variant: '#5516be'
  secondary-fixed: '#acedff'
  secondary-fixed-dim: '#4cd7f6'
  on-secondary-fixed: '#001f26'
  on-secondary-fixed-variant: '#004e5c'
  tertiary-fixed: '#ffdadb'
  tertiary-fixed-dim: '#ffb2b7'
  on-tertiary-fixed: '#40000d'
  on-tertiary-fixed-variant: '#92002a'
  background: '#0f131c'
  on-background: '#dfe2ee'
  surface-variant: '#31353e'
typography:
  display-lg:
    fontFamily: Montserrat
    fontSize: 48px
    fontWeight: '800'
    lineHeight: 56px
    letterSpacing: -0.02em
  display-lg-mobile:
    fontFamily: Montserrat
    fontSize: 36px
    fontWeight: '800'
    lineHeight: 42px
    letterSpacing: -0.02em
  headline-xl:
    fontFamily: Montserrat
    fontSize: 32px
    fontWeight: '700'
    lineHeight: 40px
  headline-lg:
    fontFamily: Montserrat
    fontSize: 24px
    fontWeight: '700'
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
  label-md:
    fontFamily: Inter
    fontSize: 14px
    fontWeight: '600'
    lineHeight: 20px
    letterSpacing: 0.05em
  label-sm:
    fontFamily: Inter
    fontSize: 12px
    fontWeight: '500'
    lineHeight: 16px
rounded:
  sm: 0.25rem
  DEFAULT: 0.5rem
  md: 0.75rem
  lg: 1rem
  xl: 1.5rem
  full: 9999px
spacing:
  base: 8px
  xs: 4px
  sm: 12px
  md: 24px
  lg: 48px
  xl: 80px
  gutter: 24px
  margin-mobile: 16px
  margin-desktop: 40px
---

## Brand & Style

The design system is a high-octane, premium interface tailored for the FIFA World Cup 2026. It targets a global audience of passionate fans who demand real-time data delivered with cinematic intensity. The aesthetic is a sophisticated blend of **Glassmorphism** and **High-Contrast Dark Mode**, evoking the atmosphere of a floodlit stadium at night.

The emotional response should be one of "controlled energy"—precise, technical, and celebratory. By utilizing deep midnight tones punctuated by neon-infused accents, the system balances the seriousness of sports analytics with the vibrant spectacle of the world’s biggest tournament.

## Colors

This design system utilizes a "Deep Space" palette to ensure high-energy accents pop with maximum luminance.

- **Primary (Electric Violet):** Used for primary actions, active states, and high-priority branding elements. It represents the prestige of the tournament.
- **Secondary (Cyber Cyan):** Used for data visualizations, live indicators, and secondary interactive elements. It provides a technical, "HUD" feel.
- **Tertiary (Victory Rose):** An occasional accent for live goals or urgent alerts to ensure immediate visual hierarchy.
- **Neutral (Midnight Navy):** The foundational canvas. All backgrounds use the deep midnight hex to provide infinite depth.
- **Surface & Borders:** Surfaces are built using semi-transparent white overlays to create the frosted glass effect, paired with ultra-thin, low-opacity borders to define edges without adding visual weight.

## Typography

The typography strategy leverages **Montserrat** for high-impact headlines to mirror the boldness of sports headlines, while **Inter** provides the necessary legibility for dense statistics and play-by-play data.

- **Headlines:** Should always be set with tight letter-spacing to appear aggressive and modern. Use "Display LG" for scorelines and major announcements.
- **Labels:** Use uppercase for technical data points (e.g., POSSESSION, XG) to maintain a professional, analytical tone.
- **Contrast:** Ensure all body text uses at least an 85% white opacity to maintain readability against the dark navy backgrounds while avoiding harsh "vibration" against the primary colors.

## Layout & Spacing

The design system employs a **Fluid Grid** approach to maximize data density on desktop while ensuring a focused, single-column experience on mobile.

- **Grid:** A 12-column layout on desktop with a 24px gutter. For the dashboard, "Widgets" should span 3, 4, 6, or 12 columns.
- **Rhythm:** An 8px base unit drives all spacing. Consistent padding of 24px (md) inside glass containers creates a sense of luxury and breathability.
- **Responsive Behavior:** On mobile, margins shrink to 16px. Complex data tables should transition to horizontally scrollable cards or simplified list views to maintain usability during live matches.

## Elevation & Depth

Depth is achieved through the layering of light, not physical height. This system avoids heavy black shadows in favor of **Tonal Layers** and **Glows**.

- **Level 1 (Base):** Midnight Navy background with a subtle, low-opacity vector grid pattern (Cyan, 5% opacity).
- **Level 2 (Glass Surfaces):** Frosted glass panels (#ffffff05) with a 20px Backdrop Blur. These carry a 1px solid border (#ffffff10) to catch the "light."
- **Level 3 (Active Elements):** Interactive cards or hovered items should feature a "Deep Soft Shadow"—a diffused primary-colored outer glow (Violet or Cyan) with 15% opacity to make the element appear as if it is emitting light.
- **Visual Hierarchy:** More important information (like the live match score) should have a slightly higher background opacity or a more pronounced border-glow than static background stats.

## Shapes

The shape language is contemporary and friendly yet structured. 

- **Containers:** All primary dashboard cards and glass containers use a `1.0rem` (16px) corner radius to soften the high-tech aesthetic.
- **Buttons & Chips:** Follow the "Rounded" setting, but specialized "Live" indicators may use a pill-shape to distinguish them from actionable buttons.
- **Icons:** Use linear, 2px stroke icons that match the typography's weight. Avoid filled icons unless they represent a state change (e.g., a "favorited" team).

## Components

- **Buttons:** Primary buttons use a solid Electric Violet fill with a subtle inner top-light gradient. Secondary buttons use a glass background with a Cyan border. 
- **Live Chips:** Use a pill shape with a Cyan background and a pulsing 4px outer glow to indicate real-time activity.
- **Cards:** Dashboard cards must include the 20px backdrop-blur. Header sections within cards should be separated by a 1px line (#ffffff10).
- **Inputs:** Text fields should be dark glass with a bottom-only 2px border that turns Electric Violet on focus.
- **Scoreboard:** A specialized component using "Display LG" typography. The team crests should be housed in circular glass containers with a subtle 10% white stroke.
- **Data Visuals:** Charts should exclusively use the Primary, Secondary, and Tertiary colors. Use gradients (e.g., Cyan to Transparent) for area charts to maintain the "Midnight" depth.