---
name: The Ledger
colors:
  surface: '#fff9eb'
  surface-dim: '#e0dac7'
  surface-bright: '#fff9eb'
  surface-container-lowest: '#ffffff'
  surface-container-low: '#faf3e0'
  surface-container: '#f4eedb'
  surface-container-high: '#efe8d5'
  surface-container-highest: '#e9e2d0'
  on-surface: '#1e1c10'
  on-surface-variant: '#564338'
  inverse-surface: '#333024'
  inverse-on-surface: '#f7f0de'
  outline: '#8a7266'
  outline-variant: '#ddc1b3'
  surface-tint: '#9a4600'
  primary: '#9a4600'
  on-primary: '#ffffff'
  primary-container: '#ff8a3d'
  on-primary-container: '#682d00'
  inverse-primary: '#ffb68d'
  secondary: '#006970'
  on-secondary: '#ffffff'
  secondary-container: '#8df2fc'
  on-secondary-container: '#006f77'
  tertiary: '#77574d'
  on-tertiary: '#ffffff'
  tertiary-container: '#c8a195'
  on-tertiary-container: '#53382f'
  error: '#ba1a1a'
  on-error: '#ffffff'
  error-container: '#ffdad6'
  on-error-container: '#93000a'
  primary-fixed: '#ffdbc9'
  primary-fixed-dim: '#ffb68d'
  on-primary-fixed: '#321200'
  on-primary-fixed-variant: '#763300'
  secondary-fixed: '#8df2fc'
  secondary-fixed-dim: '#70d6df'
  on-secondary-fixed: '#002022'
  on-secondary-fixed-variant: '#004f54'
  tertiary-fixed: '#ffdbd0'
  tertiary-fixed-dim: '#e7bdb1'
  on-tertiary-fixed: '#2c160e'
  on-tertiary-fixed-variant: '#5d4037'
  background: '#fff9eb'
  on-background: '#1e1c10'
  surface-variant: '#e9e2d0'
typography:
  display-lg:
    fontFamily: Literata
    fontSize: 48px
    fontWeight: '700'
    lineHeight: '1.1'
    letterSpacing: -0.02em
  headline-lg:
    fontFamily: Literata
    fontSize: 32px
    fontWeight: '700'
    lineHeight: '1.2'
  headline-lg-mobile:
    fontFamily: Literata
    fontSize: 28px
    fontWeight: '700'
    lineHeight: '1.2'
  headline-md:
    fontFamily: Literata
    fontSize: 24px
    fontWeight: '600'
    lineHeight: '1.3'
  body-lg:
    fontFamily: Plus Jakarta Sans
    fontSize: 18px
    fontWeight: '400'
    lineHeight: '1.6'
  body-md:
    fontFamily: Plus Jakarta Sans
    fontSize: 16px
    fontWeight: '400'
    lineHeight: '1.6'
  label-md:
    fontFamily: Plus Jakarta Sans
    fontSize: 14px
    fontWeight: '600'
    lineHeight: '1.2'
    letterSpacing: 0.05em
  caption:
    fontFamily: Plus Jakarta Sans
    fontSize: 12px
    fontWeight: '500'
    lineHeight: '1.4'
rounded:
  sm: 0.25rem
  DEFAULT: 0.5rem
  md: 0.75rem
  lg: 1rem
  xl: 1.5rem
  full: 9999px
spacing:
  unit: 8px
  container-max: 1200px
  gutter: 24px
  margin-mobile: 16px
  margin-desktop: 40px
  offset-sm: 2px
  offset-md: 4px
  offset-lg: 6px
---

## Brand & Style
The design system is built upon a narrative of "Cozy Illustrative Whimsy." It transforms the digital interface into a tactile, hand-drawn storybook experience. The brand personality is scholarly yet playful, intellectual yet approachable, evoking the warmth of a sun-drenched library corner.

The aesthetic direction is a refined **Illustrative Neo-Brutalism**. It utilizes bold, deliberate outlines and "sticker-like" offsets to create depth without relying on realistic shadows. The goal is to make every UI element feel like a physical object placed onto a page of heavy-stock paper. White space is treated as "margin space," providing a breathable, organized layout that guides the user through the information with the clarity of a well-edited manuscript.

## Colors
The palette is rooted in organic, warm tones that mimic natural library materials. 

- **Primary (Library Orange):** A vibrant, sun-soaked orange used for primary calls to action and critical highlights.
- **Secondary (Reading Teal):** A calming, sophisticated teal that provides a cool contrast to the warm browns and yellows.
- **Tertiary (Polished Wood):** A deep, rich brown used for borders, heavy text, and structural elements.
- **Neutral (Aged Paper):** The primary background color, shifting away from sterile white to a softer, more comfortable cream that reduces eye strain.
- **Ink Black:** A slightly softened black used exclusively for the 2px to 3px thick outlines that define the illustrative style.

## Typography
The typography pairing balances literary tradition with modern legibility.

**Literata** is used for headlines. Its slightly rounded serif terminals and high x-height evoke a contemporary storybook feel. It should be used with tighter tracking in larger sizes to emphasize its distinctive character.

**Plus Jakarta Sans** serves as the functional workhorse for all body copy, inputs, and labels. Its friendly, geometric curves mirror the roundedness of the UI components, ensuring the design feels cohesive and approachable even in data-heavy sections.

## Layout & Spacing
The layout system follows a **Fixed Grid** philosophy on desktop to maintain the "book-like" structure, while transitioning to a fluid model on mobile. 

A strict 8px spacing scale ensures consistency. Significant emphasis is placed on "negative offset" and "hard shadows." Components often sit on top of a colored "shadow box" that is offset by 4px to 6px to the bottom right, creating a 2.5D illustrative depth.

**Breakpoints:**
- **Mobile:** 0 - 599px (4-column grid, 16px margins)
- **Tablet:** 600px - 1023px (8-column grid, 24px margins)
- **Desktop:** 1024px+ (12-column grid, 40px margins, 1200px max-width)

## Elevation & Depth
This design system rejects traditional Gaussian blurs and soft ambient shadows. Depth is communicated through:

1.  **Bold Outlines:** Every container and interactive element must have a 2px or 3px solid border in "Ink Black" or "Polished Wood."
2.  **Hard Offsets:** Interactive elements (buttons, cards) feature a solid color block shifted behind them. This "shadow" is opaque and uses a contrasting color from the palette.
3.  **Layering:** Active states are represented by "pressing" the element—moving it 2px down and to the right so it aligns perfectly with its offset shadow, simulating a physical click.

## Shapes
The shape language is "Extra Rounded." The high radius values (16px to 24px) counteract the "harshness" of the thick black outlines, maintaining the friendly, cartoonish aesthetic.

- **Standard Radius:** 16px (0.5rem) for small components like buttons and inputs.
- **Large Radius:** 24px (1.5rem) for cards and main containers.
- **Pill:** Used exclusively for tags, chips, and toggles.

The combination of thick borders and high roundness creates a "bubbly" feel that is characteristic of the illustrative style.

## Components

### Buttons
Buttons are defined by a 2px "Ink Black" border and a solid 4px offset shadow. The primary button uses "Library Orange" with a "Polished Wood" shadow. On hover, the button moves 1px towards the shadow; on active/click, it moves the full 4px to "cover" the shadow.

### Cards
Cards use the "Aged Paper" or white background with a 2px border. They should always feature a "header" area separated by a horizontal 2px line. Use illustrative icons (doodle-style) in the top right corner of cards to denote category.

### Input Fields
Inputs are deep and recessed. Use a slightly darker "Paper" tint for the background and a 2px border. Focus states should change the border color to "Reading Teal" and increase the border thickness to 3px, rather than using a glow.

### Chips & Tags
These should be pill-shaped with a 1px border. Use "Reading Teal" for categorical tags and "Library Orange" for status-based tags.

### Icons
Icons must be "Hand-Drawn" in style—monolinear, with slightly imperfect strokes and open paths. They should never be perfectly geometric; a slight "wobble" in the icon's path reinforces the cozy, illustrative brand narrative.