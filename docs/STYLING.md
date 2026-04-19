# Component Styling Guide

## Styles File Structure

When a component has its own styles, create a separate `ComponentName.css.ts`
file using Vanilla Extract. Do not inline styles in the component file. If a
component delegates all of its visual presentation to another component (e.g. an
abstract base) and has no styles of its own, the `.css.ts` file may be omitted.

```ts
// ComponentName.css.ts
import { style } from '@vanilla-extract/css';
import { getDesignTokens } from '@kapowaz/design-tokens';

const { borderRadius, colors, fontSize, fontWeight, spacing } =
  getDesignTokens();

export const container = style({
  display: 'flex',
  alignItems: 'center',
  gap: spacing.sm,
});

export const label = style({
  fontWeight: fontWeight.medium,
});
```

## Using Styles in Components

Import styles using a namespace import and apply them via `className`:

```tsx
import * as styles from './ComponentName.css';

export const ComponentName = ({ label }: ComponentNameProps) => {
  return (
    <div className={styles.container}>
      <span className={styles.label}>{label}</span>
    </div>
  );
};
```

## Style Rules

- Export each style as a named constant using `style()` from `@vanilla-extract/css`
- Destructure only the tokens you need from `getDesignTokens()`
- Use pixels as unit values for literals

## Style Scoping

A component must only import styles from its own `.css.ts` file — never from
another component's directory. This applies to both `style()` exports **and**
`createVar()` exports. A CSS variable that controls a component's colours
belongs in that component's `.css.ts` file with its own
`cssVariablesByColorMode()` block, not in a shared theme file that other
components import from. This keeps each component self-contained and avoids
hidden coupling between unrelated parts of the tree.

### Sharing styles between components

When two or more components need the same visual treatment, **do not** create a
shared style file that both components import. Instead, extract the common
presentation into a separate abstract component and compose it into each
consumer:

```
// Bad — shared style file creates hidden coupling
ComponentA/
  ComponentA.css.ts    ──imports──▶  shared/commonStyles.css.ts
ComponentB/
  ComponentB.css.ts    ──imports──▶  shared/commonStyles.css.ts

// Good — shared presentation lives in its own component
SharedBase/
  SharedBase.tsx
  SharedBase.css.ts
ComponentA/
  ComponentA.tsx       ──renders──▶  <SharedBase />
ComponentB/
  ComponentB.tsx       ──renders──▶  <SharedBase />
```

This approach keeps each component's styles entirely local while making the
shared visual contract explicit through composition rather than file imports.

## Spacing and Typography via Abstract Components

When a component needs internal padding or font styles, compose it from the
existing abstract components rather than creating new classnames that apply
spacing or font tokens directly.

- **`AbstractSpacer`** — handles padding (`spacing`), flex layout, and adjacent
  sibling spacing. Wrap your component's root (or an inner container) with
  `AbstractSpacer` and pass the appropriate `spacing` prop instead of writing
  `padding` rules in a `.css.ts` file.
- **`AbstractText`** — extends `AbstractSpacer` with font family, size, weight,
  line height, and letter spacing. Use it for **every element that renders
  text**, not just primary text containers. This includes `<span>`, `<button>`,
  `<div>`, `<label>`, and any other element that displays visible text content.
  Both components accept a `tagName` prop, so
  `<AbstractText tagName="button" fontSize="sm">` renders a `<button>` with the
  correct font styles and passes through all native button attributes. Never set
  `fontSize`, `fontWeight`, `fontFamily`, `lineHeight`, or `letterSpacing` in a
  `.css.ts` file — use AbstractText props instead. **Without AbstractText, text
  elements will inherit font styles from their parent context**, which causes
  subtle bugs when components are rendered inside tables, menus, or other
  containers that set their own font properties.

### Why

Centralising padding and typography in these abstract components ensures that:

1. Spacing and font values always come from the token scale — there is no risk
   of accidentally using a raw pixel value or the wrong token.
2. Changes to the token scale or the way tokens map to CSS are applied in one
   place rather than across dozens of individual style files.
3. Components express _what_ spacing or text treatment they need declaratively
   via props, keeping `.css.ts` files focused on layout and visual appearance
   that is unique to the component.

### Example

```ts
// Bad — applying spacing and font tokens directly in a classname
export const container = style({
  padding: spacing.md,
});

export const label = style({
  fontSize: fontSize.ui.sm,
  fontWeight: fontWeight.medium,
  lineHeight: lineHeight.ui.sm,
});

export const menuItem = style({
  fontSize: fontSize.ui.sm,
  fontWeight: fontWeight.regular,
  cursor: 'pointer',
});
```

```tsx
// Good — delegating to AbstractSpacer / AbstractText
import { AbstractSpacer } from '../AbstractSpacer';
import { AbstractText } from '../AbstractText';

export const MyComponent = ({ label, children }: MyComponentProps) => {
  return (
    <AbstractSpacer spacing="md">
      <AbstractText fontSize="sm" fontWeight="medium">
        {label}
      </AbstractText>
      {children}
    </AbstractSpacer>
  );
};

// Good — AbstractText with tagName="button" for interactive elements
export const MenuItem = ({ label, onClick }: MenuItemProps) => {
  return (
    <AbstractText
      tagName="button"
      type="button"
      fontSize="sm"
      className={styles.menuItem}
      onClick={onClick}
    >
      {label}
    </AbstractText>
  );
};
```

Because `AbstractText` extends `AbstractSpacer`, it also accepts all spacing
props. When a single element needs both padding and font styles there is no need
to nest the two — use `AbstractText` alone:

```tsx
// Also good — AbstractText handles both spacing and font styles
import { AbstractText } from '../AbstractText';

export const MyComponent = ({ label }: MyComponentProps) => {
  return (
    <AbstractText spacing="md" fontSize="sm" fontWeight="medium">
      {label}
    </AbstractText>
  );
};
```

If the component has styles that are genuinely unique to it (colours, borders,
layout structure, etc.), those should live in its `.css.ts` file — but it should
not duplicate spacing or font concerns that `AbstractSpacer` and `AbstractText`
already handle. If all visual presentation is delegated to abstract components
and there are no unique styles, the `.css.ts` file may be omitted entirely.

### Prefer padding over margin

Components should use `AbstractSpacer` (or padding) to create space around their
content rather than applying `margin` in their styles. CSS margin collapsing
makes the actual rendered spacing context-dependent and hard to reason about —
adjacent vertical margins merge, margins escape floated or absolutely-positioned
containers, and the rules change inside flex and grid layouts. Padding is always
additive and predictable regardless of surrounding context, which makes component
spacing self-contained and composable.

## Design Tokens

Import design tokens from `@kapowaz/design-tokens`:

```ts
import { style } from '@vanilla-extract/css';
import { getDesignTokens } from '@kapowaz/design-tokens';

const { borderRadius, colors, fontSize, fontWeight, spacing } =
  getDesignTokens();

export const container = style({
  borderRadius: borderRadius.md,
  fontSize: fontSize.ui.sm,
  fontWeight: fontWeight.medium,
  padding: spacing.sm,
});
```

### Available token categories

Common tokens available from `getDesignTokens()`:

- `borderRadius` — border radius values (e.g., `borderRadius.md`, `borderRadius.full`)
- `colors` — color palette (e.g., `colors.blue[500]`, `colors.ink[200]`)
- `fontSize` — font sizes (e.g., `fontSize.ui.sm`, `fontSize.ui.md`, `fontSize.ui.lg`)
- `fontWeight` — font weights (e.g., `fontWeight.medium`, `fontWeight.bold`)
- `lineHeight` — line heights (e.g., `lineHeight.ui.md`, `lineHeight.monospace.sm`)
- `spacing` — spacing scale (e.g., `spacing.xs`, `spacing.sm`, `spacing.lg`)

### Color tokens

Color values that differ between light and dark modes must be declared as CSS
custom properties using `createVar()`, with their light and dark values
registered via `cssVariablesByColorMode()`. Reference color primitives from
`getDesignTokens()` (e.g., `colors.blue[600]`, `colors.ink[200]`) as the
values in each mode.

```ts
import { createVar, style } from '@vanilla-extract/css';
import {
  cssVariablesByColorMode,
  getDesignTokens,
} from '@kapowaz/design-tokens';

const textColor = createVar('my-component-text');
const bgColor = createVar('my-component-bg');

const { colors } = getDesignTokens();

cssVariablesByColorMode({
  light: {
    [textColor]: colors.ink[900],
    [bgColor]: colors.blue[100],
  },
  dark: {
    [textColor]: colors.ink[50],
    [bgColor]: colors.blue[800],
  },
});

export const container = style({
  color: textColor,
  backgroundColor: bgColor,
});
```

Constant colors that do not change between modes (e.g., `colors.white` on a
brand-coloured background) can be used directly without a CSS variable.

### Semi-transparent colours

When a style requires a semi-transparent variant of a colour, use the
`color-mix()` CSS function in the `oklch` colour space:

```ts
backgroundColor: `color-mix(in oklch, ${myColor} 50%, transparent)`,
```

This produces perceptually uniform blending and works with both CSS variables
and literal colour values. Use this approach anywhere a colour needs partial
transparency — hover/active backgrounds, overlays, box shadows, etc.

### When no token exists

Use literal pixel values and add a comment flagging it for future extraction:

```ts
export const container = style({
  gap: '12px', // TODO: extract to spacing token
});
```

## Variant Styles

For components with variants (e.g., different status types or button styles),
create separate style constants for each variant and map them:

```ts
import { style } from '@vanilla-extract/css';
import { getDesignTokens } from '@kapowaz/design-tokens';

const { colors } = getDesignTokens();

export const badge = style({
  display: 'inline-flex',
  alignItems: 'center',
});

export const badgeSuccess = style({
  backgroundColor: colors.green[100],
  color: colors.green[800],
});

export const badgeError = style({
  backgroundColor: colors.red[100],
  color: colors.red[800],
});
```

In the component, use a record to map variants to styles:

```tsx
import clsx from 'clsx';

import type { StatusType } from './types';
import * as styles from './StatusBadge.css';

const statusStyles: Record<StatusType, string> = {
  success: styles.badgeSuccess,
  error: styles.badgeError,
};

export const StatusBadge = ({ status }: StatusBadgeProps) => {
  return (
    <span className={clsx(styles.badge, statusStyles[status])}>
      {/* content */}
    </span>
  );
};
```

## Interactive Elements

Where an element supports interactivity (for example: because it uses a
`<button>` element in its implementation), ensure that there are appropriate
styles for the `:hover`, `:focus-visible` and `:active` states.

```ts
import { createVar, style } from '@vanilla-extract/css';
import { getDesignTokens } from '@kapowaz/design-tokens';

import { cssVariablesByColorMode } from '../../util';

const hoverBg = createVar('button-hover-bg');
const activeBg = createVar('button-active-bg');

const { colors } = getDesignTokens();

cssVariablesByColorMode({
  light: {
    [hoverBg]: colors.gray[100],
    [activeBg]: colors.gray[200],
  },
  dark: {
    [hoverBg]: colors.gray[800],
    [activeBg]: colors.gray[700],
  },
});

export const button = style({
  cursor: 'pointer',
  transition: 'background-color 150ms ease',

  ':hover': {
    backgroundColor: hoverBg,
  },

  ':active': {
    backgroundColor: activeBg,
  },
});
```

Where an event handler is being attached to a container surrounding an
interactive element such as a button, also ensure there are styles for the
`:focus-within` state.

## CSS Isolation

Every styled element must have its own explicit classname. Do not rely on
structural or attribute selectors to reach child elements.

### Forbidden patterns

| Pattern                 | Why it breaks isolation                                           |
| ----------------------- | ----------------------------------------------------------------- |
| `'& > *'`, `'& *'`      | Targets any child regardless of identity; fragile to DOM changes. |
| `'& [data-foo]'`        | Couples styles to data attributes instead of classnames.          |
| `'& > div'`, `'& span'` | Targets raw HTML tags; breaks when markup changes.                |

### Correct approach: explicit classnames

Define a style constant for every styled element. When a parent needs to alter a
child's style based on hover, focus, or other states, use Vanilla Extract's
`selectors` API:

```ts
import { style, globalStyle } from '@vanilla-extract/css';

export const icon = style({
  display: 'inline-flex',
});

export const removeIcon = style({
  display: 'none',
});

export const container = style({
  display: 'flex',
});

// Parent hover changes child visibility
globalStyle(`${container}:hover ${icon}`, {
  display: 'none',
});

globalStyle(`${container}:hover ${removeIcon}`, {
  display: 'inline-flex',
});
```

In the component, apply classnames directly:

```tsx
<div className={styles.container}>
  <span className={styles.icon}>...</span>
  <span className={styles.removeIcon}>...</span>
</div>
```

### Key rules

- Every element that receives styles must have its own style constant
- Never use `& > *`, `& *`, or bare tag selectors (`& div`, `& span`) to style
  children
- Never use `[data-*]` attribute selectors for styling; data attributes are for
  testing or semantics, not CSS targeting
- When a parent's pseudo-state (`:hover`, `:focus-visible`, etc.) needs to
  change a child's style, use `globalStyle()` with the parent and child
  selectors combined

## Combining Class Names

Use `clsx` to combine class names. This avoids stray whitespace from falsy
values and keeps conditional logic readable:

```tsx
import clsx from 'clsx';

// Combining internal styles with an optional external className prop
<div className={clsx(styles.container, className)} />

// Conditional class application
<div className={clsx(styles.base, isActive && styles.active, className)} />
```

Do not use template strings for class combination — they produce trailing
spaces when values are undefined and are harder to read with multiple
conditions.
