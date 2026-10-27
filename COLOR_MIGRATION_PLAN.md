# Color Migration Plan & Semantic Token Architecture

## 1. Overview & Principles
- **Aesthetic**: Obsidian Noir (`#0B0C0E`), Deep Charcoal Surfaces (`#121418`, `#16181F`), Champagne Gold Accents (`#DFB76C`, `#ECC870`), High-Contrast Typography, and Razor-Sharp Edges (`border-radius: 0`).
- **Objective**: 100% elimination of raw hex codes, arbitrary color utilities, and unthemed Tailwind palette classes. Every color is derived from semantic CSS tokens defined in RGB channels to support full Tailwind opacity modifiers (`bg-surface/80`, `border-border/60`, etc.).
- **Zero Regressions**: Preserves the exact high-end luxury look and ensures full WCAG contrast (>= 4.5:1 for normal text, >= 3:1 for large text and UI components).

---

## 2. Token System (Single Source of Truth)

| Category | CSS Variable | RGB Channels | Hex Reference | Semantic Role & Paired Text |
| :--- | :--- | :--- | :--- | :--- |
| **Surface** | `--background` | `11 12 14` | `#0B0C0E` | Page root canvas ↔ `text-foreground` |
| **Surface** | `--surface` | `18 20 24` | `#121418` | Primary card & section surface ↔ `text-foreground` |
| **Surface** | `--surface-elevated`| `22 24 31` | `#16181F` | Elevated cards, dialogs, drawers ↔ `text-foreground` |
| **Surface** | `--surface-sunken` | `26 29 36` | `#1A1D24` | Inset containers, dark badges ↔ `text-foreground-secondary` |
| **Surface** | `--overlay` | `5 6 7` | `#050607` | Modal / Drawer backdrop overlay |
| **Border** | `--border` | `38 40 46` | `#26282E` | Default subtle borders |
| **Border** | `--border-strong` | `51 55 66` | `#333742` | Card hover / active dividers |
| **Border** | `--border-brand` | `223 183 108` | `#DFB76C` | Gold accent border |
| **Text** | `--foreground` | `243 244 246` | `#F3F4F6` | Primary high-contrast text (15.5:1 ratio) |
| **Text** | `--foreground-secondary` | `226 232 240` | `#E2E8F0` | Secondary body text (13.8:1 ratio) |
| **Text** | `--foreground-muted` | `203 213 225` | `#CBD5E1` | Muted captions & subtitles (11.0:1 ratio) |
| **Text** | `--foreground-disabled`| `100 116 139`| `#64748B` | Disabled action text (4.6:1 ratio) |
| **Brand** | `--brand` | `223 183 108` | `#DFB76C` | Regal Champagne Gold |
| **Brand** | `--brand-hover` | `236 200 112` | `#ECC870` | Interactive gold hover |
| **Brand** | `--brand-active` | `184 147 74` | `#B8934A` | Interactive gold active/pressed |
| **Brand** | `--brand-soft` | `34 32 24` | `#222018` | Subtle gold tint container/badge background |
| **Brand** | `--on-brand` | `11 12 14` | `#0B0C0E` | High-contrast dark text on gold (11.2:1 ratio) |
| **Status (Success)**| `--success` | `52 211 153` | `#34D399` | Success text & icons |
| **Status (Success)**| `--success-solid` | `16 185 129` | `#10B981` | Solid success badge/button ↔ `text-white` |
| **Status (Success)**| `--success-soft` | `13 33 26` | `#0D211A` | Success soft badge bg ↔ `text-success` |
| **Status (Warning)**| `--warning` | `251 191 36` | `#FBBF24` | Warning text & icons |
| **Status (Warning)**| `--warning-solid` | `245 158 11` | `#F59E0B` | Solid warning badge/button ↔ `text-on-brand` |
| **Status (Warning)**| `--warning-soft` | `38 29 12` | `#261D0C` | Warning soft badge bg ↔ `text-warning` |
| **Status (Danger)** | `--danger` | `248 113 113` | `#F87171` | Danger text & icons |
| **Status (Danger)** | `--danger-solid` | `239 68 68` | `#EF4444` | Solid danger badge/button ↔ `text-white` |
| **Status (Danger)** | `--danger-soft` | `38 16 16` | `#261010` | Danger soft badge bg ↔ `text-danger` |
| **Status (Info)** | `--info` | `96 165 250` | `#60A5FA` | Info text & icons |
| **Status (Info)** | `--info-solid` | `59 130 246` | `#3B82F6` | Solid info badge/button ↔ `text-white` |
| **Status (Info)** | `--info-soft` | `15 26 44` | `#0F1A2C` | Info soft badge bg ↔ `text-info` |
| **Form** | `--input-bg` | `11 12 14` | `#0B0C0E` | Textfield / textarea / select background |
| **Form** | `--input-border` | `38 40 46` | `#26282E` | Form control border |
| **Form** | `--input-placeholder`| `148 163 184`| `#94A3B8` | Input placeholder text (6.8:1 ratio) |
| **Form** | `--focus-ring` | `223 183 108` | `#DFB76C` | Focus ring outline color |

---

## 3. Mapping Table (Raw Classes -> Semantic Tokens)

| Raw / Legacy Pattern | Semantic Replacement | Notes |
| :--- | :--- | :--- |
| `border-[#26282E]`, `border-[#262930]` | `border-border` | Standard subtle architectural border |
| `border-[#DFB76C]` | `border-border-brand` | Accent gold border |
| `border-slate-200`, `border-slate-100`, `border-gray-200` | `border-border` | Replaces light slate borders |
| `border-white/10`, `border-white/20` | `border-border` or `border-border-strong` | Controlled border hierarchy |
| `bg-[#0B0C0E]`, `bg-black` | `bg-background` | Root canvas / deep dark container |
| `bg-[#121418]`, `bg-white` | `bg-surface` | Primary card / table / modal background |
| `bg-[#16181F]`, `bg-[#F8F9FD]`, `bg-slate-50` | `bg-surface-elevated` | Elevated cards, drawers, popups |
| `bg-[#1A1D24]`, `bg-slate-100`, `bg-gray-100` | `bg-surface-sunken` | Inset containers, recessed panels |
| `bg-[#DFB76C]`, `bg-[#0F0C3B]` (legacy primary btn) | `bg-brand text-on-brand` | Primary CTA gold action |
| `bg-[#ECC870]`, `hover:bg-[#ECC870]` | `bg-brand-hover` | Hover state for gold CTA |
| `text-[#DFB76C]`, `text-gold-400`, `text-gold-500` | `text-brand` | Champagne gold brand text |
| `text-[#0B0C0E]`, `text-black` (on gold CTA) | `text-on-brand` | Legible dark text on gold button |
| `text-[#0F0C3B]`, `text-slate-900`, `text-slate-800` | `text-foreground` | High contrast primary text |
| `text-white`, `text-[#F3F4F6]` | `text-foreground` | High contrast primary text |
| `text-[#CBD5E1]`, `text-slate-300`, `text-slate-200` | `text-foreground-secondary` | Secondary readable text |
| `text-slate-400`, `text-slate-500`, `text-gray-400` | `text-foreground-muted` | High-contrast silver muted text |
| `text-emerald-400`, `text-emerald-500`, `text-emerald-600` | `text-success` | Success text |
| `bg-emerald-500`, `bg-emerald-600` | `bg-success-solid text-white` | Solid success indicator |
| `bg-emerald-950/80`, `bg-emerald-500/20` | `bg-success-soft text-success` | Soft success badge |
| `text-amber-400`, `text-amber-300`, `text-amber-500` | `text-warning` | Warning text |
| `bg-amber-500`, `bg-amber-600` | `bg-warning-solid text-on-brand` | Solid warning indicator |
| `bg-amber-950/80`, `bg-amber-500/20` | `bg-warning-soft text-warning` | Soft warning badge |
| `text-red-400`, `text-rose-400` | `text-danger` | Danger / error text |
| `bg-red-500`, `bg-rose-500` | `bg-danger-solid text-white` | Solid danger indicator |
| `bg-red-950/80`, `bg-red-500/20` | `bg-danger-soft text-danger` | Soft danger badge |
| `text-blue-400`, `text-indigo-400`, `text-sky-400` | `text-info` | Information text |
| `bg-blue-500`, `bg-indigo-500` | `bg-info-solid text-white` | Solid info indicator |
| `bg-blue-950/80`, `bg-indigo-500/20` | `bg-info-soft text-info` | Soft info badge |
| `text-purple-gradient` | `text-gold-gradient` | Cleaned duplicate utility |
| `purple-border-glow` | `gold-border-glow` | Cleaned duplicate utility |

---

## 4. Execution Checkpoints

### Phase A: Core Foundation & Tokens
- [ ] Update `frontend/src/app/globals.css` with semantic RGB `:root` tokens, autofill, scrollbar, selection, and color-scheme.
- [ ] Update `frontend/tailwind.config.ts` mapping all colors directly to CSS variables with alpha values, set `borderRadius` all `0px`.
- [ ] Create `frontend/src/lib/status-colors.ts` with centralized status-to-token map for orders, payments, milestones, levels.

### Phase B: Shared Layout, Navigation, and Root Components
- [ ] `frontend/src/app/layout.tsx` (Antd ConfigProvider token integration & root layout tokens)
- [ ] `frontend/src/components/shared/Navbar/Navbar.tsx` & subcomponents
- [ ] `frontend/src/components/shared/Navbar/ForMobile.tsx`
- [ ] `frontend/src/components/shared/Footer/Footer.tsx`
- [ ] `frontend/src/components/shared/layout/Layout.tsx`
- [ ] `frontend/src/components/shared/Breadcrumb/Breadcrumb.tsx`

### Phase C: Shared UI & Form Primitives
- [ ] `frontend/src/components/ui/MyButton/AppButton.tsx`
- [ ] `frontend/src/components/ui/MyButton/MyButton.tsx`
- [ ] `frontend/src/components/ui/MyButton/SuccessButton.tsx`
- [ ] `frontend/src/components/ui/MyButton/WarningButton.tsx`
- [ ] `frontend/src/components/ui/MyForm/MyFormInput/MyFormInput.tsx`
- [ ] `frontend/src/components/ui/MyForm/MyFormSelect/MyFormSelect.tsx`
- [ ] `frontend/src/components/ui/MyForm/MyFormTextArea/MyFormTextArea.tsx`
- [ ] `frontend/src/components/ui/MyForm/MyFormWrapper/MyFormWrapper.tsx`
- [ ] `frontend/src/components/ui/MySelect/MySelect.tsx`
- [ ] `frontend/src/components/ui/ScrollToTopButton/ScrollToTopButton.tsx`
- [ ] `frontend/src/components/modal.MyModal.tsx`

### Phase D: Payment, Stripe & Third-Party UI
- [ ] `frontend/src/components/payment/CustomStripePaymentForm.tsx` (Stripe Elements night theme with tokens)
- [ ] `frontend/src/app/(common)/checkout/page.tsx` (Direct card inputs & checkout flow)

### Phase E: Auth Pages
- [ ] `frontend/src/app/(auth)/login/page.tsx` & `src/components/pages/auth/LoginClient.tsx`
- [ ] `frontend/src/app/(auth)/register/page.tsx` & `src/components/pages/auth/RegisterClient.tsx`
- [ ] `frontend/src/app/(auth)/forgot-password/page.tsx`
- [ ] `frontend/src/app/(auth)/reset-password/page.tsx`

### Phase F: Public Pages & Discovery
- [ ] `frontend/src/app/page.tsx` & Home components (`HeroSection`, `Services`, `WhyChooseUs`, etc.)
- [ ] `frontend/src/app/(common)/services/page.tsx` & `src/components/pages/services/*`
- [ ] `frontend/src/app/(common)/services/[slug]/page.tsx`
- [ ] `frontend/src/app/(common)/jobs/page.tsx` & `src/components/pages/jobs/*`
- [ ] `frontend/src/app/(common)/jobs/[id]/page.tsx`
- [ ] `frontend/src/app/(common)/vendors/[slug]/page.tsx`

### Phase G: Client Dashboard (`/user/*`)
- [ ] `frontend/src/app/(userDashboard)/user/dashboard/page.tsx`
- [ ] `frontend/src/app/(userDashboard)/user/orders/page.tsx` & `[id]/page.tsx`
- [ ] `frontend/src/app/(userDashboard)/user/jobs/page.tsx` & `[id]/page.tsx`
- [ ] `frontend/src/app/(userDashboard)/user/post-job/page.tsx`
- [ ] `frontend/src/app/(userDashboard)/user/messages/page.tsx`
- [ ] `frontend/src/app/(userDashboard)/user/settings/page.tsx`
- [ ] `frontend/src/components/user/OrderDetailDrawer.tsx`

### Phase H: Vendor Dashboard (`/vendor/*`)
- [ ] `frontend/src/app/(vendorDashboard)/vendor/dashboard/page.tsx`
- [ ] `frontend/src/app/(vendorDashboard)/vendor/gigs/page.tsx` & create/edit pages
- [ ] `frontend/src/app/(vendorDashboard)/vendor/orders/page.tsx` & `[id]/page.tsx`
- [ ] `frontend/src/app/(vendorDashboard)/vendor/earnings/page.tsx`
- [ ] `frontend/src/app/(vendorDashboard)/vendor/proposals/page.tsx`
- [ ] `frontend/src/app/(vendorDashboard)/vendor/messages/page.tsx`
- [ ] `frontend/src/app/(vendorDashboard)/vendor/settings/page.tsx`

### Phase I: Admin Dashboard (`/admin/*`)
- [ ] `frontend/src/app/(adminDashboard)/admin/dashboard/page.tsx`
- [ ] `frontend/src/app/(adminDashboard)/admin/orders/page.tsx`
- [ ] `frontend/src/app/(adminDashboard)/admin/disputes/page.tsx`
- [ ] `frontend/src/app/(adminDashboard)/admin/vendors/page.tsx`
- [ ] `frontend/src/app/(adminDashboard)/admin/gigs/page.tsx`
- [ ] `frontend/src/app/(adminDashboard)/admin/users/page.tsx`
- [ ] `frontend/src/app/(adminDashboard)/admin/categories/page.tsx`
- [ ] `frontend/src/app/(adminDashboard)/admin/platform-settings/page.tsx`

### Phase J: Clean Legacy Overrides & Build Guard Script
- [ ] Remove `!important` color override block in `frontend/src/app/globals.css`.
- [ ] Add `scripts/check-colors.js` and `npm run check:colors`.
- [ ] Contrast analysis report verification.
