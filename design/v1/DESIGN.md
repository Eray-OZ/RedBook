---
name: Crimson Archive
colors:
  surface: '#131313'
  surface-dim: '#131313'
  surface-bright: '#393939'
  surface-container-lowest: '#0e0e0e'
  surface-container-low: '#1b1c1c'
  surface-container: '#1f2020'
  surface-container-high: '#2a2a2a'
  surface-container-highest: '#353535'
  on-surface: '#e4e2e1'
  on-surface-variant: '#e1bebb'
  inverse-surface: '#e4e2e1'
  inverse-on-surface: '#303030'
  outline: '#a98986'
  outline-variant: '#59413e'
  surface-tint: '#ffb4ac'
  primary: '#ffb4ac'
  on-primary: '#690006'
  primary-container: '#9e1b1b'
  on-primary-container: '#ffafa7'
  inverse-primary: '#b22a27'
  secondary: '#d4c59f'
  on-secondary: '#383014'
  secondary-container: '#52482b'
  on-secondary-container: '#c6b792'
  tertiary: '#eac34a'
  on-tertiary: '#3c2f00'
  tertiary-container: '#cca830'
  on-tertiary-container: '#4f3e00'
  error: '#ffb4ab'
  on-error: '#690005'
  error-container: '#93000a'
  on-error-container: '#ffdad6'
  primary-fixed: '#ffdad6'
  primary-fixed-dim: '#ffb4ac'
  on-primary-fixed: '#410002'
  on-primary-fixed-variant: '#8f0e12'
  secondary-fixed: '#f1e1b9'
  secondary-fixed-dim: '#d4c59f'
  on-secondary-fixed: '#221b03'
  on-secondary-fixed-variant: '#504629'
  tertiary-fixed: '#ffe088'
  tertiary-fixed-dim: '#e9c349'
  on-tertiary-fixed: '#241a00'
  on-tertiary-fixed-variant: '#574500'
  background: '#131313'
  on-background: '#e4e2e1'
  surface-variant: '#353535'
typography:
  display-lg:
    fontFamily: Playfair Display
    fontSize: 48px
    fontWeight: '900'
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
  title-md:
    fontFamily: Playfair Display
    fontSize: 20px
    fontWeight: '600'
    lineHeight: 28px
  body-lg:
    fontFamily: Literata
    fontSize: 18px
    fontWeight: '400'
    lineHeight: 28px
  body-md:
    fontFamily: Literata
    fontSize: 16px
    fontWeight: '400'
    lineHeight: 24px
  label-sm:
    fontFamily: Source Serif 4
    fontSize: 12px
    fontWeight: '600'
    lineHeight: 16px
    letterSpacing: 0.1em
spacing:
  unit: 8px
  gutter: 24px
  margin-mobile: 16px
  margin-desktop: 64px
  container-max: 1200px
---

## Brand & Style
The design system evokes the atmosphere of a clandestine medieval scriptorium. It targets bibliophiles who view reading as a ritualistic experience. The aesthetic is a hybrid of **Atmospheric Dark Mode** and **Tactile Historiography**, blending the mystery of a candlelit dungeon with the high-fidelity clarity of modern Glassmorphism.

The UI should feel heavy, aged, and significant—as if every interaction is recorded in a royal ledger. Visual depth is achieved through layered organic textures (weathered stone, cracked leather) while maintaining functional usability through semi-transparent glass panes that "float" over the historical environment.

## Colors
The palette is rooted in a "Blood and Parchment" narrative. 
- **Primary (Crimson):** Used for critical actions and primary branding, representing wax seals and royal ink.
- **Secondary (Aged Parchment):** The primary surface color for content areas, providing a high-contrast "ink on paper" reading experience.
- **Tertiary (Mystical Gold):** Reserved for highlights, achievements, and rare book status indicators.
- **Neutral (Weathered Iron):** The foundational structure of the UI, used for borders, heavy backgrounds, and shadows.
- **Background:** Should utilize a deep charcoal-to-black gradient with a subtle stone texture overlay to simulate a castle wall.

## Typography
The typography system prioritizes the "Writerly" and "Scholarly" nature of the app. 
- **Headings:** Use **Playfair Display** in High Bold or Black weights. It provides the necessary dramatic flair and high contrast required for a medieval editorial look.
- **Body:** Use **Literata**. Designed for long-form reading on screens, it maintains a "bookish" feel while ensuring high legibility for book synopses and reviews.
- **Labels:** Use **Source Serif 4** in uppercase to emulate the look of small-print foot-notes or archival stamps.

## Layout & Spacing
The layout follows a **Fixed Central Column** philosophy for desktop, mimicking the proportions of a medieval manuscript. 
- **Grid:** A 12-column grid is used for the dashboard, but content-heavy pages (like reading a book entry) should use a focused 8-column central track.
- **Rhythm:** Generous vertical spacing (32px - 64px) is essential to prevent the "heavy" textures from feeling claustrophobic.
- **Adaptation:** On mobile, margins shrink to 16px, and multi-column parchment "cards" stack vertically into a continuous scroll of "scrolls."

## Elevation & Depth
Elevation in this design system is conveyed through **Material Layering** rather than simple shadows:
- **Level 0 (Background):** Deep, textured weathered iron/stone. Static and dark.
- **Level 1 (Glass Panes):** Semi-transparent (40% opacity) weathered iron with a heavy backdrop blur (20px). This represents the "display case" of the archive.
- **Level 2 (Parchment):** Solid #f4e4bc surfaces. These sit atop the glass panes, featuring a subtle inner shadow to look like they are set *into* a frame.
- **Glow:** High-priority items (like the "Currently Reading" book) feature a soft #ff6b00 outer glow, simulating a flickering candle placed nearby.

## Shapes
The core shape language is **Sharp and Ornate**. While the primary containers use 0px radius (Sharp) to feel like cut stone or wood blocks, decorative elements introduce complexity.
- **Containers:** Hard 90-degree angles.
- **Accents:** Use SVG "Corner Brackets" in Mystical Gold on primary cards.
- **Buttons:** Sharp-edged with a 1px inner border in Gold.
- **Separators:** Instead of simple lines, use "Dagger" or "Filigree" horizontal rules to divide content sections.

## Components
- **Buttons (Wax Seals):** Primary buttons are Crimson Red with a circular "seal" icon on the left. The shape remains rectangular but includes a subtle 1px gold border.
- **Cards (The Folio):** A combination of a Weathered Iron glass frame containing a Parchment inset. Text inside cards uses the #1a1311 "Ink" color.
- **Input Fields:** Styled as a single horizontal line in Iron, with the parchment background changing to a slightly brighter hue when focused, simulating a fresh sheet of paper.
- **Lists:** Items are separated by ornate, thin gold dividers. Hovering over a list item should trigger a faint parchment-colored glow behind the text.
- **Progress Bars (The Wick):** Tracking reading progress uses a Crimson bar that ends in a small "flickering flame" icon (#ff6b00) representing the burning of a candle.
- **Checkboxes:** Stylized as a "Cross" (X) hand-drawn in ink rather than a standard checkmark.