# Developer Documentation: Madam Ambition Technical & Brand Profile

This document details the architectural structure, brand assets, and styling configurations for the "Madam Ambition" website. It is intended for AI coding agents and developers to ensure style consistency and technical compatibility.

## 1. Technical Stack Overview

- **CMS:** WordPress 6.8.5
- **Theme:** Divi (v.4.27.6) by Elegant Themes
- **Analytics:** ExactMetrics (Google Analytics) via `G-SHGE6MHTGD` and `G-YR2Q5GBCMW`
- **Frontend Plugins:** Bloom (Email Opt-in), MediaElement.js (Audio/Video handling)

## 2. CSS Architecture & Priority Hierarchy

Styles are distributed across multiple inline blocks and cached files. When overriding styles, follow this hierarchy:

1.  **Level 1 (Highest):** `<style id="et-critical-inline-css">` (Line 309). This block contains the core brand identity overrides.
2.  **Level 2:** `<style id="divi-style-inline-inline-css">` (Line 245). Contains layout-specific rules and UI behavior.
3.  **Level 3:** `<style id="global-styles-inline-css">` (Line 239). Standard WordPress block presets and CSS variables.
4.  **External:** `et-core-unified-2.min.css` (Line 310). The compiled Divi cache file.

---

## 3. Brand Color Palette

### A. Primary Brand Colors (Extracted from Critical CSS)

| Usage                 | HEX Code                 | Element Selector                  |
| :-------------------- | :----------------------- | :-------------------------------- |
| **Header Background** | `#0b242f`                | `#main-header`, `.et_mobile_menu` |
| **Heading Text**      | `#702315`                | `h1, h2, h3, h4, h5, h6`          |
| **Link Color**        | `#a8623d`                | `a`                               |
| **Active Menu Link**  | `#f5e5d6`                | `.current-menu-item > a`          |
| **Menu Text**         | `rgba(245,229,214,0.84)` | `#top-menu a`                     |
| **Sub-menu Borders**  | `#5b767e`                | `.nav li ul`                      |

### B. Accent & Section Styles

| Usage              | HEX Code  | Element Selector                       |
| :----------------- | :-------- | :------------------------------------- |
| **Primary Accent** | `#7ebec5` | `et_pb_custom.accent_color` (JS)       |
| **Muted Peach**    | `#e2cec0` | `.et_pb_section_0` background          |
| **Soft Tan**       | `#ebd9cb` | `.et_pb_row_2` border                  |
| **Dusty Rose**     | `#b4a194` | `.et_pb_row_0`, `.et_pb_row_3` borders |

### C. Functional & Default Colors

| Usage                 | HEX Code  | Description                                         |
| :-------------------- | :-------- | :-------------------------------------------------- |
| **Pure Black**        | `#000000` | Main body text, button background                   |
| **Pure White**        | `#ffffff` | Button text, standard background                    |
| **Standard Gray**     | `#666666` | Default paragraph text (non-overridden)             |
| **Dark Gray**         | `#333333` | Theme default headings (overridden by brand colors) |
| **Divi Default Blue** | `#2ea3f2` | Legacy theme defaults (largely overridden)          |

---

## 4. Typography

- **Headings Font:** `Abril Fatface` (Primary), display-style serif.
- **Body Font:** `Marcellus`, Georgia, "Times New Roman", serif.
- **Support Fonts:** `Didact Gothic`, `Alef`, `Lora`.
- **Default Font Size:** `16px` for body/paragraphs.

---

## 5. UI & Layout Configuration

### A. Layout Dimensions

- **Max Content Width:** `1200px`
- **Boxed Layout Max Width:** `1360px`
- **Sidebar Ratio:** Left area `79.125%` (on non-fullwidth pages).
- **Gutter Width:** Gutters 3 (Standard Divi spacing).

### B. Button Styles

- **Background:** `#000000`
- **Text:** `#ffffff` (Pure White)
- **Border Radius:** `0px`
- **Transformation:** Uppercase (`text-transform: uppercase`)
- **Letter Spacing:** `1px`
- **Hover State:** Background becomes `rgba(11,36,47,0.93)` (Navy Blue with opacity).

### C. Header & Navigation

- **Height (Standard):** `100px`
- **Height (Fixed/Scroll):** `80px`
- **Menu Alignment:** Left (Standard Logo Left).

---

## 6. Key Asset Paths

- **Main Logo:** `https://madamambition.com/wp-content/uploads/2023/01/Madam-Ambition-Logo-New-Colors-1.png`
- **Favicon (32x32):** `https://madamambition.com/wp-content/uploads/2023/01/cropped-Madam-Ambition-Logo-New-Colors-1-32x32.png`
- **Hero Image:** `https://madamambition.com/wp-content/uploads/2023/01/SelenaTrotter-MadamAmbition-Executive-Coaching-1.jpg`

---

## 7. Social Media Integration

- **Facebook:** `https://www.facebook.com/madamambittion`
- **Instagram:** `https://www.instagram.com/madamambition/`
- **X (Twitter):** `https://twitter.com/AmbitionMadam`
- **LinkedIn:** `https://www.linkedin.com/company/madam-ambition/`

---

## 8. Implementation Notes for Agents

- **Responsive Breaks:** Divi standard breakpoints used (`980px` for tablet, `767px` for mobile).
- **Gradients:** Use `linear-gradient(270deg, #e2cec0 43%, #f5e5d6 43%)` for hero background replication.
- **CSS Variable Prefixes:** WordPress global presets use the `--wp--preset--color--[name]` naming convention (e.g., `--wp--preset--color--cyan-bluish-gray: #abb8c3`).
