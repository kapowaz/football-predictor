# Component Styling Guide

## Styles File Structure

Create a separate `ComponentName.css.ts` file using Vanilla Extract CSS. Do not
inline styles in the component file.

```ts
// ComponentName.css.ts
import { style } from '@vanilla-extract/css';
import { space2 } from '../../theme.css';

export const optionContent = style({
  display: 'flex',
  alignItems: 'center',
  gap: space2,
});

export const optionLogo = style({
  width: '20px',
  height: '20px',
  objectFit: 'contain',
  flexShrink: 0,
});
```

## Using Styles in Components

```tsx
import * as styles from './CompetitionSelect.css';

export const ComponentName = ({ label }: ComponentNameProps) => {
  const styles = getStyles();

  return (
    <div className={styles.optionContent}>
      <span className={styles.optionLogo}>{label}</span>
    </div>
  );
};
```

## Style Rules

- Where available, use theme tokens from theme.css.ts for color, spacing, and
  typography values
- Use pixels as unit values

## CSS Isolation

Every styled element must have its own explicit classname. Do not rely on
structural or attribute selectors to reach child elements.

### Forbidden patterns

| Pattern                 | Why it breaks isolation                                           |
| ----------------------- | ----------------------------------------------------------------- |
| `'& > *'`, `'& *'`      | Targets any child regardless of identity; fragile to DOM changes. |
| `'& [data-foo]'`        | Couples styles to data attributes instead of classnames.          |
| `'& > div'`, `'& span'` | Targets raw HTML tags; breaks when markup changes.                |

### Key rules

- Every element that receives styles must have its own classname from `css()`
- Never use `& > *`, `& *`, or bare tag selectors (`& div`, `& span`) to style
  children
- Never use `[data-*]` attribute selectors for styling; data attributes are for
  testing or semantics, not CSS targeting
- When a parent's pseudo-state (`:hover`, `:focus-visible`, etc.) needs to
  change a child's style, define the child class first, then reference it with
  `` `&:hover .${childClass}` `` in the parent
- This pattern works because Emotion's `css()` returns the generated classname
  as a string, which can be interpolated into other selectors

## Combining Class Names

Use the `clsx` utility to combine multiple class names:

```tsx
import { clsx } from 'clsx';

// Combining internal styles with an optional external className prop
<div className={clsx(styles.container, className)} />

// Conditional class application
<div className={clsx(styles.base, isActive && styles.active)} />
```
