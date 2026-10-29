---
name: CampusConnect
colors:
  surface: '#f8f9ff'
  surface-dim: '#ccdbf3'
  surface-bright: '#f8f9ff'
  surface-container-lowest: '#ffffff'
  surface-container-low: '#eff4ff'
  surface-container: '#e6eeff'
  surface-container-high: '#dce9ff'
  surface-container-highest: '#d5e3fc'
  on-surface: '#0d1c2e'
  on-surface-variant: '#474555'
  inverse-surface: '#233144'
  inverse-on-surface: '#eaf1ff'
  outline: '#787586'
  outline-variant: '#c8c4d8'
  surface-tint: '#5543df'
  primary: '#5442de'
  on-primary: '#ffffff'
  primary-container: '#6d5ef8'
  on-primary-container: '#ffffff'
  inverse-primary: '#c5c0ff'
  secondary: '#006c49'
  on-secondary: '#ffffff'
  secondary-container: '#6cf8bb'
  on-secondary-container: '#00714d'
  tertiary: '#a63628'
  on-tertiary: '#ffffff'
  tertiary-container: '#c74e3e'
  on-tertiary-container: '#fffeff'
  error: '#ba1a1a'
  on-error: '#ffffff'
  error-container: '#ffdad6'
  on-error-container: '#93000a'
  primary-fixed: '#e4dfff'
  primary-fixed-dim: '#c5c0ff'
  on-primary-fixed: '#140067'
  on-primary-fixed-variant: '#3c22c7'
  secondary-fixed: '#6ffbbe'
  secondary-fixed-dim: '#4edea3'
  on-secondary-fixed: '#002113'
  on-secondary-fixed-variant: '#005236'
  tertiary-fixed: '#ffdad4'
  tertiary-fixed-dim: '#ffb4a8'
  on-tertiary-fixed: '#410000'
  on-tertiary-fixed-variant: '#872015'
  background: '#f8f9ff'
  on-background: '#0d1c2e'
  surface-variant: '#d5e3fc'
typography:
  display-hero:
    fontFamily: Plus Jakarta Sans
    fontSize: 40px
    fontWeight: '700'
    lineHeight: 48px
    letterSpacing: -0.02em
  display-hero-mobile:
    fontFamily: Plus Jakarta Sans
    fontSize: 30px
    fontWeight: '700'
    lineHeight: 38px
    letterSpacing: -0.015em
  headline-lg:
    fontFamily: Plus Jakarta Sans
    fontSize: 32px
    fontWeight: '700'
    lineHeight: 40px
    letterSpacing: -0.015em
  headline-lg-mobile:
    fontFamily: Plus Jakarta Sans
    fontSize: 24px
    fontWeight: '700'
    lineHeight: 32px
    letterSpacing: -0.01em
  headline-md:
    fontFamily: Plus Jakarta Sans
    fontSize: 22px
    fontWeight: '600'
    lineHeight: 28px
  headline-sm:
    fontFamily: Plus Jakarta Sans
    fontSize: 18px
    fontWeight: '600'
    lineHeight: 24px
  body-lg:
    fontFamily: Inter
    fontSize: 16px
    fontWeight: '400'
    lineHeight: 24px
  body-md:
    fontFamily: Inter
    fontSize: 14px
    fontWeight: '400'
    lineHeight: 20px
  body-sm:
    fontFamily: Inter
    fontSize: 12px
    fontWeight: '400'
    lineHeight: 16px
  label-lg:
    fontFamily: Inter
    fontSize: 14px
    fontWeight: '600'
    lineHeight: 20px
    letterSpacing: 0.01em
  label-md:
    fontFamily: Inter
    fontSize: 12px
    fontWeight: '600'
    lineHeight: 16px
    letterSpacing: 0.02em
  label-caps:
    fontFamily: Inter
    fontSize: 11px
    fontWeight: '700'
    lineHeight: 14px
    letterSpacing: 0.05em
rounded:
  sm: 0.25rem
  DEFAULT: 0.5rem
  md: 0.75rem
  lg: 1rem
  xl: 1.5rem
  full: 9999px
spacing:
  gutter: 1.5rem
  gutter-mobile: 1rem
  margin: 2rem
  margin-mobile: 1rem
  space-xs: 0.5rem
  space-sm: 1rem
  space-md: 1.5rem
  space-lg: 2rem
  space-xl: 3rem
---

## Brand & Style

This design system powers a vibrant, frictionless discovery and registration platform for collegiate communities. The aesthetic bridges contemporary SaaS precision with energetic campus culture—balancing academic credibility with social warmth. 

The aesthetic adheres to **Modern Clean**: high clarity, airy whitespace, crisp structural contrast, and focused micro-interactions. The interface minimizes cognitive friction during high-frequency tasks like event RSVPing, schedule syncing, and student club onboarding. Visual interest is established via rich violet focal points, pristine white container elevations, and structured typographic hierarchy rather than heavy ornamentation.

## Colors

The palette delivers crisp visual balance optimized for accessible student communication:

- **Primary (`#6D5EF8`)**: Electric Violet commands primary actions, selected navigation items, active tab indicators, and featured badges. Its interactive hover counterpart is `#5B4BE3`.
- **Secondary (`#10B981`)**: Emerald Green denotes confirmed RSVPs, successful registrations, published status pills, and active capacity markers.
- **Tertiary (`#F97360`)**: Coral functions as a vibrant warning and destructive cue—used for sold-out events, attendance cutoffs, and cancellation triggers.
- **Neutral (`#475569`)**: Slate handles secondary body text, meta-details (dates, venues, organizer labels), and auxiliary UI icons.
- **Surface & Backgrounds**: Base canvas defaults to Light Slate (`#F8FAFC`). Surfaces like modal overlays and interactive cards sit cleanly on Pure White (`#FFFFFF`) framed by neutral outline `#E2E8F0`.
- **Primary Text (`#111827`)**: Deep Navy ensures high contrast and legibility across all display elements.

## Typography

The type scale combines **Plus Jakarta Sans** for expressive, humanistic headings with **Inter** for dense, clean UI readability. 

- **Headlines & Titles**: Rendered in Plus Jakarta Sans. Subtle negative tracking (`-0.01em` to `-0.02em`) gives prominent event names and hero headers an editorial, refined posture.
- **Body & Data**: Rendered in Inter. Standardized line heights prevent collisions within multi-line event overviews, schedule breakdowns, and attendee notes.
- **Labels & Badges**: Set in medium or semibold Inter weights. The `label-caps` token is reserved strictly for category pills, dates, and ticket capacity tags.

## Layout & Spacing

The layout is anchored strictly to an 8px modular spacing rhythm (8px, 16px, 24px, 32px, 48px).

- **Grid Systems**:
  - **Desktop (>=1024px)**: 12-column fluid grid, `2rem` (32px) outer margins, and `1.5rem` (24px) gutters. Event directories leverage 3-column layouts (4 spans each).
  - **Tablet (768px - 1023px)**: 8-column layout, `1.5rem` margins, and `1rem` gutters. Event listings shift to 2-column arrays.
  - **Mobile (<768px)**: 4-column layout, `1rem` (16px) outer margins, and `1rem` gutters. Cards reflow into single-column vertical stacks.
- **Density Guidelines**:
  - Card internal padding uses `space-md` (24px) on desktop, condensing to `space-sm` (16px) on mobile viewport profiles.
  - Form field groupings and badge groups standardize on `space-xs` (8px).

## Elevation & Depth

Visual hierarchy is maintained through subtle, ambient surface elevations paired with crisp boundary lines rather than heavy drop shadows:

- **Border Strategy**: Surfaces rely primarily on a continuous 1px border (`#E2E8F0`) to demarcate boundaries against the `#F8FAFC` base canvas.
- **Level 0 (Flat)**: Nested elements, inactive chips, and input track boundaries sit flat against their container surfaces.
- **Level 1 (Card & Shell Base / `shadow-sm`)**: Used across standard event cards, filter panels, and top navigation. Defined by:
  - `box-shadow: 0 1px 2px 0 rgba(17, 24, 39, 0.05);`
  - Outline: 1px solid `#E2E8F0`
- **Level 2 (Interactive Hover & Dropdowns)**: Active hover state on event listings, flyout profile menus, and search completion prompts:
  - `box-shadow: 0 4px 6px -1px rgba(17, 24, 39, 0.08), 0 2px 4px -2px rgba(17, 24, 39, 0.04);`
  - Subtle transformation: `-1px` vertical translation.
- **Level 3 (Modals & Drawers)**: Registration checkouts, QR pass sheets, and calendar filters:
  - `box-shadow: 0 20px 25px -5px rgba(17, 24, 39, 0.1), 0 8px 10px -6px rgba(17, 24, 39, 0.05);`

## Shapes

The design system uses a deliberate hierarchy of corner curvature to maintain both structure and friendliness:

- **Cards & Content Surfaces**: Fixed at `12px` (`0.75rem`) border radius, striking a balance between structural cleanliness and tactile softness.
- **Action Controls**: Standard buttons, input fields, and alert containers carry an `8px` (`0.5rem`) border radius.
- **Pills & Status Micro-components**: Category filters, availability tags, and user avatars enforce continuous roundness via `9999px` (`pill`).

## Components

### Buttons
- **Primary**: Solid Violet (`#6D5EF8`) background, white text (`#FFFFFF`), `8px` border radius, padding `10px 20px`. Transitions smoothly to `#5B4BE3` on hover. Focus state exhibits an outer ring: `3px solid rgba(109, 94, 248, 0.25)`.
- **Secondary / Outline**: Pure White background with 1px border (`#E2E8F0`), text color `#111827`. Hovers to `#F8FAFC` background with border `#CBD5E1`.
- **Destructive**: White surface with 1px border (`#F97360`), text color `#F97360`. On hover, fills with light coral tint (`rgba(249, 115, 96, 0.08)`).

### Event Cards
- Surface color `#FFFFFF`, border `1px solid #E2E8F0`, border radius `12px`, elevation `shadow-sm`.
- Layout structure: 16:9 aspect ratio image header with inset category pill badge on the upper left. Body provides `16px` or `24px` internal padding containing an uppercase date/time lockup (`label-caps`, `#6D5EF8`), bold event headline (`headline-sm`, `#111827`), venue subtitle (`body-md`, `#475569`), and a bottom action bar with avatar piles and capacity indicators.

### Category Chips & Status Badges
- **Filter Chips**: Pill-shaped (`9999px`), `6px 14px` padding, set in `label-md`. Inactive state sits on `#FFFFFF` with `#E2E8F0` border and `#475569` text; active state fills with `#6D5EF8` and white text.
- **Status Badges**: Small pill badges (`4px 10px`, `label-caps`). 
  - *Confirmed/Open*: Emerald background (`rgba(16, 185, 129, 0.12)`) with `#10B981` text.
  - *Filling Fast/Sold Out*: Coral background (`rgba(249, 115, 96, 0.12)`) with `#F97360` text.

### Form Inputs
- Background `#FFFFFF`, 1px border (`#E2E8F0`), `8px` radius, padding `10px 14px`, text `#111827`. Placeholder colored in `#94A3B8`.
- Focus state: border color switches directly to `#6D5EF8` accompanied by a `3px` focus ring halo (`rgba(109, 94, 248, 0.2)`).

### Checkboxes & Radio Controls
- Base dimension `18px x 18px`, `4px` radius for checkboxes, `9999px` for radios. 
- Inactive state utilizes `#E2E8F0` border. Active checked state fills with `#6D5EF8` displaying a white checkmark or center pip.

### Registration Pass / Ticket Component
- Dedicated dual-segment card joined by a perforated separator line. Left segment holds attendee credentials, event name, and session timestamp. Right segment isolates a high-contrast black/white QR check-in code with an Emerald confirmation badge.