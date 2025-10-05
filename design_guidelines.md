# Design Guidelines: Geo-Quest Platform (Telegram Mini App)

## Design Approach

**Hybrid System: Mobile Gaming + Utility Mapping**

This Telegram Mini App requires a specialized approach balancing map-based functionality with gamified storytelling. The design follows mobile gaming UI principles while maintaining Material Design clarity for utility functions. Each Motif (quest theme) dynamically transforms the visual identity without code changes.

## Core Design Elements

### A. Color Palette

**Motif 1: "Old Man Hottabych" - Eastern Fairy Tale**

**Dark Mode (Primary):**
- Background Base: `220 15% 12%` - Deep twilight blue
- Background Elevated: `220 15% 16%` - Elevated surfaces
- Primary (Magical Blue): `215 85% 55%` - Enchanted sapphire
- Accent (Eastern Gold): `45 95% 60%` - Golden lamp shimmer
- Text Primary: `45 25% 95%` - Warm ivory
- Text Secondary: `45 15% 70%` - Muted sand
- Success (POI Active): `150 65% 50%` - Oasis green
- Surface Overlay: `220 20% 20%` with 85% opacity

**Light Mode:**
- Background: `45 40% 96%` - Parchment cream
- Primary: `215 75% 45%` - Deep lapis
- Accent: `40 80% 50%` - Amber gold
- Text: `220 30% 15%` - Ink charcoal

**Component-Specific Colors:**
- Map POI Icons: Primary blue with gold border when active
- Achievement Badges: Gold gradient overlays
- Level Progress: Blue-to-gold gradient fill
- Navigation Active State: Gold underline/indicator

### B. Typography

**Font Stack:**
```
Primary: 'Inter', system-ui, -apple-system, sans-serif
Display/Headers: 'Playfair Display', Georgia, serif (for Hottabych theme)
Monospace: 'JetBrains Mono', monospace (for coordinates/data)
```

**Type Scale:**
- Hero/Display: 32px (2rem), bold, Playfair Display
- H1/Page Title: 24px (1.5rem), semibold, tight leading
- H2/Section: 20px (1.25rem), medium
- Body: 16px (1rem), regular, 1.5 line-height
- Small/Caption: 14px (0.875rem), regular
- Tiny/Meta: 12px (0.75rem), medium, uppercase tracking

### C. Layout System

**Spacing Primitives:** Use Tailwind units of `2, 3, 4, 6, 8, 12, 16`

**Breakpoints (Telegram-optimized):**
- Mobile: 320px-428px (primary target)
- Tablet: 429px-768px
- Desktop: 769px+ (Mini App web view)

**Layout Patterns:**
- Safe Area Insets: `pt-safe pb-safe` for iOS notch/home indicator
- Map Viewport: Full screen minus fixed UI (status bar, bottom nav)
- Content Cards: `p-4` standard, `p-6` emphasis
- List Items: `py-3 px-4`
- Modal Padding: `p-6`

### D. Component Library

**Status Bar (Fixed Top)**
- Height: 64px
- Background: Translucent dark overlay (backdrop-blur-md)
- Contents: User avatar (left), points display (center), level badge (right)
- Typography: Semibold, 14px for stats

**Map Interface (Main Page)**
- Full viewport height minus status bar and bottom nav
- 2GIS map with custom POI markers
- Floating Action Button (FAB): Bottom-right, 56x56px, primary color, for centering on user location
- POI Markers: Custom SVG icons, 32x32px, with pulsing animation when in range
- Active Route: Blue dashed polyline, 3px stroke

**Bottom Navigation**
- Height: 72px (touch-optimized)
- 5 tabs: Map, Locations, Achievements, Rating, Profile
- Active state: Gold icon with label, elevated with subtle shadow
- Inactive: 60% opacity text secondary
- Icon size: 24x24px

**Cards (Content Display)**
- Border radius: 16px (rounded-2xl)
- Shadow: Soft elevation (shadow-lg)
- Padding: p-6 for primary content
- Background: Elevated surface color
- Border: 1px gold accent for highlighted/active cards

**POI Content Modal**
- Slides up from bottom (mobile drawer pattern)
- Max height: 85vh
- Handle bar at top for dismissal
- Sections: Title (Playfair, 24px) → Quote (italic, 18px) → Description → Action Button
- Spacing: Generous vertical rhythm (space-y-6)

**Achievement Badges**
- Card grid: 2 columns mobile, 3 columns tablet+
- Size: 100x100px icon area
- Design: Circular badge with gold border
- States: Locked (grayscale 40%), Unlocked (full color with glow effect)

**Progress Indicators**
- XP Bar: Full-width, 8px height, rounded-full, blue-to-gold gradient
- Radial Progress (Level): 80x80px, 6px stroke, gold accent
- Mini Progress Dots: 8px circles for step indicators

**Buttons**
- Primary: Full primary color, white text, py-3 px-6, rounded-xl, semibold
- Secondary: Outline variant, 2px border, primary color text
- Ghost: No background, primary color text, hover:bg with 10% opacity
- FAB: Circular, 56x56px, shadow-2xl, primary background

**List Items (Locations/History)**
- Height: 88px
- Left: Icon/thumbnail (56x56px, rounded-lg)
- Center: Title (16px semibold) + subtitle (14px secondary)
- Right: Chevron or status indicator
- Dividers: 1px, 10% opacity

**Leaderboard Table**
- Row height: 64px
- Rank badge: 32x32px circle, gold for top 3
- Alternating row backgrounds (zebra striping)
- Sticky header with translucent background

### E. Dynamic Theming System

**Theme Variables (CSS Custom Properties):**
```
--motif-primary: [dynamic]
--motif-accent: [dynamic]
--motif-surface: [dynamic]
--motif-font-display: [dynamic]
```

**Theming Rules:**
- All color references use CSS variables
- Theme data stored in Motif table (DB)
- Frontend reads active Motif and applies theme on load
- Transition duration: 300ms ease-in-out for theme switches

**Future Motifs Examples:**
- Cyberpunk Moscow: Neon purple/cyan, tech font
- Soviet Era: Red/gray, constructivist typography
- Art Nouveau: Teal/bronze, decorative fonts

## Animations & Micro-interactions

**Use Very Sparingly:**
- POI pulse animation when user enters proximity (scale + opacity, 2s loop)
- Achievement unlock: Single burst particle effect (500ms)
- Page transitions: Slide left/right (250ms)
- Button press: Scale to 0.95 (100ms)
- Loading states: Simple spinner, no elaborate animations

**NO elaborate scroll effects, parallax, or decorative animations**

## Images

**Hero Image:** NOT APPLICABLE - Map dominates main screen

**Achievement/Badge Graphics:**
- Custom illustrated icons for each achievement
- Style: Flat illustration with gold accents
- Format: SVG for scalability
- Fallback: Unicode emoji as placeholder

**POI Thumbnails:**
- Historical photos of locations (640x480px)
- Positioned in content modal header
- Border radius: 12px
- Aspect ratio: 4:3

**User Avatars:**
- Circular, 40x40px in status bar
- Pulled from Telegram profile
- Fallback: Initials in colored circle

## Accessibility & UX

- Minimum touch target: 44x44px
- Color contrast ratio: 4.5:1 minimum (WCAG AA)
- Focus indicators: 3px gold outline with offset
- Screen reader labels for all interactive elements
- Haptic feedback on POI activation and achievement unlock
- Offline state clearly indicated with banner
- Loading skeletons for async content

## Mobile-Specific Considerations

- Pull-to-refresh on map page for location sync
- Swipe gestures: Left/right for tab navigation, up for modal dismiss
- Native-feel scrolling with momentum
- Optimized for one-handed use (bottom nav, FAB placement)
- Battery-conscious geolocation tracking (60s intervals)
- Telegram theme color integration (uses Telegram's color scheme as base)

## Technical Notes

- Use Tailwind CSS for all styling
- Implement theme switching via data attributes: `data-motif="hottabych"`
- Map component uses 2GIS Web API SDK
- Icons from Heroicons CDN (outline variant for inactive, solid for active)
- Google Fonts: Playfair Display (400, 600, 700) + Inter (400, 500, 600)