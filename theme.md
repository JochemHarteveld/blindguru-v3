# Theme Reference

Dark, premium poker aesthetic. Deep navy base, gold accent, subtle gradients — no flat plain colors.

---

## Backgrounds

| Token | Hex | Use |
|---|---|---|
| `bg-base` | `#090d18` | Page background |
| `bg-surface` | `#111827` | Cards, panels |
| `bg-raised` | `#1a2236` | Elevated cards, dropdowns |
| `bg-overlay` | `#243352` | Modals, tooltips |

## Borders

| Token | Hex | Use |
|---|---|---|
| `border` | `#2a3a55` | Default border |
| `border-subtle` | `#1e2d45` | Dividers, subtle separators |

## Primary — Blue

| Token | Hex | Use |
|---|---|---|
| `primary-400` | `#60a5fa` | Text on dark, icons |
| `primary-500` | `#3b82f6` | Default interactive |
| `primary-600` | `#2563eb` | Buttons (gradient start) |
| `primary-700` | `#1d4ed8` | Hover state |

## Accent — Gold

Poker feel. Use sparingly for highlights, badges, timer emphasis.

| Token | Hex | Use |
|---|---|---|
| `accent-300` | `#fcd34d` | Text highlight |
| `accent-400` | `#fbbf24` | Icons, badges |
| `accent-500` | `#f59e0b` | Default accent |
| `accent-600` | `#d97706` | Gradient start |

## Semantic

| Token | Hex | Use |
|---|---|---|
| `success-500` | `#10b981` | Positive states |
| `danger-500` | `#ef4444` | Errors, destructive |

## Text

| Token | Use |
|---|---|
| `text-primary` `#f1f5f9` | Body text |
| `text-secondary` `#94a3b8` | Labels, captions |
| `text-muted` `#64748b` | Placeholder, disabled |
| `text-inverse` `#0a0e1a` | Text on light bg |

---

## Gradient Utilities

| Class | Effect |
|---|---|
| `bg-surface-gradient` | `bg-surface` → `bg-raised` |
| `bg-primary-gradient` | `primary-600` → `primary-400` |
| `bg-accent-gradient` | `accent-600` → `accent-400` |
| `bg-danger-gradient` | `danger-600` → `danger-500` |

---

## Usage Patterns

```html
<!-- Card -->
<div class="bg-surface-gradient border border-border rounded-xl p-4">

<!-- Primary button -->
<button class="bg-primary-gradient text-white rounded-lg px-4 py-2">

<!-- Gold badge / level indicator -->
<span class="bg-accent-gradient text-inverse rounded-full px-2 py-0.5 text-sm font-bold">

<!-- Muted label -->
<p class="text-secondary text-sm">Next level</p>

<!-- Danger action -->
<button class="bg-danger-gradient text-white rounded-lg px-4 py-2">
```

---

## Live Clock Guidelines

- Timer digits: `text-accent-400` at `text-7xl` or larger
- Level label: `text-primary` bold
- Blind values: `text-text-primary` large, ante in `text-secondary`
- Page background: `bg-base` — maximum contrast for across-table readability
