# Complete Component Example

This example demonstrates a complete component implementation following all
guidelines, using Vanilla Extract for styling.

## Directory Structure

```
StatusBadge/
├── StatusBadge.tsx
├── StatusBadge.css.ts
├── StatusBadge.stories.tsx
├── StatusBadge.test.tsx
├── index.ts
└── types.ts
```

## types.ts

Define shared types that may be used across multiple components. Props
interfaces belong in the component file itself.

```ts
export type StatusType = 'success' | 'warning' | 'error' | 'info';
```

## StatusBadge.css.ts

Styles are written using Vanilla Extract. Import `style` and `createVar` from
`@vanilla-extract/css` and `getDesignTokens` from `@kapowaz/design-tokens`.
Destructure the tokens you need from `getDesignTokens()` rather than assigning
the entire object to a variable. Export each style as a named constant.

For any values that change between color modes, use `createVar()` to declare a
CSS custom property, then register the light and dark values using the
`cssVariablesByColorMode()` helper from `@kapowaz/design-tokens`. This helper calls
`globalStyle()` under the hood with the correct selectors for both explicit
`data-color-mode` attributes and the `prefers-color-scheme` media query,
ensuring variables resolve correctly regardless of how the color mode is
determined. Reference the CSS variable directly inside `style()` calls — this
keeps each style declaration static while the underlying value adapts to the
active color mode at runtime.

```ts
import { createVar, style } from '@vanilla-extract/css';
import {
  cssVariablesByColorMode,
  getDesignTokens,
} from '@kapowaz/design-tokens';

const badgeSuccessBg = createVar('badge-success-bg');
const badgeSuccessColor = createVar('badge-success-color');
const badgeWarningBg = createVar('badge-warning-bg');
const badgeWarningColor = createVar('badge-warning-color');
const badgeErrorBg = createVar('badge-error-bg');
const badgeErrorColor = createVar('badge-error-color');
const badgeInfoBg = createVar('badge-info-bg');
const badgeInfoColor = createVar('badge-info-color');

const { borderRadius, colors, spacing } = getDesignTokens();

cssVariablesByColorMode({
  light: {
    [badgeSuccessBg]: colors.green[100],
    [badgeSuccessColor]: colors.green[800],
    [badgeWarningBg]: colors.amber[100],
    [badgeWarningColor]: colors.amber[800],
    [badgeErrorBg]: colors.red[100],
    [badgeErrorColor]: colors.red[800],
    [badgeInfoBg]: colors.blue[100],
    [badgeInfoColor]: colors.blue[800],
  },
  dark: {
    [badgeSuccessBg]: colors.green[800],
    [badgeSuccessColor]: colors.green[100],
    [badgeWarningBg]: colors.amber[800],
    [badgeWarningColor]: colors.amber[100],
    [badgeErrorBg]: colors.red[800],
    [badgeErrorColor]: colors.red[100],
    [badgeInfoBg]: colors.blue[800],
    [badgeInfoColor]: colors.blue[100],
  },
});

export const badge = style({
  display: 'inline-flex',
  alignItems: 'center',
  gap: spacing.xs,
  borderRadius: borderRadius.full,
});

export const badgeSuccess = style({
  backgroundColor: badgeSuccessBg,
  color: badgeSuccessColor,
});

export const badgeWarning = style({
  backgroundColor: badgeWarningBg,
  color: badgeWarningColor,
});

export const badgeError = style({
  backgroundColor: badgeErrorBg,
  color: badgeErrorColor,
});

export const badgeInfo = style({
  backgroundColor: badgeInfoBg,
  color: badgeInfoColor,
});

export const label = style({
  whiteSpace: 'nowrap',
});

export const icon = style({
  flexShrink: 0,
  width: '1em',
  height: '1em',
});
```

## StatusBadge.tsx

Components use arrow function syntax with named exports. Import styles using
`import * as styles from './StatusBadge.css'` and apply them via
`className={styles.badge}`. For multiple classes, use `clsx`.

```tsx
import clsx from 'clsx';

import type { StatusType } from './types';

import * as styles from './StatusBadge.css';

export interface StatusBadgeProps {
  /** The status to display */
  status: StatusType;
  /** Optional label text */
  label?: string;
  /** Additional CSS class for styling overrides */
  className?: string;
}

const statusStyles: Record<StatusType, string> = {
  success: styles.badgeSuccess,
  warning: styles.badgeWarning,
  error: styles.badgeError,
  info: styles.badgeInfo,
};

const statusIcons: Record<StatusType, string> = {
  success: '✓',
  warning: '⚠',
  error: '✕',
  info: 'ℹ',
};

export const StatusBadge = ({
  status,
  label,
  className,
}: StatusBadgeProps) => {
  return (
    <span
      className={clsx(styles.badge, statusStyles[status], className)}
      role="status"
      aria-label={label ?? status}
    >
      <span className={styles.icon} aria-hidden="true">
        {statusIcons[status]}
      </span>
      {label && <span className={styles.label}>{label}</span>}
    </span>
  );
};
```

## index.ts

Use wildcard re-exports to expose all public API from the component directory.

```ts
export * from './StatusBadge';
export * from './types';
```

## StatusBadge.test.tsx

Tests use `@testing-library/react`. Prefer role-based queries (see TESTING.md
for query priority).

```tsx
import { render, screen } from '@testing-library/react';

import { StatusBadge } from './StatusBadge';

describe('StatusBadge', () => {
  it('renders with accessible status role', () => {
    render(<StatusBadge status="success" label="Complete" />);

    expect(
      screen.getByRole('status', { name: /complete/i }),
    ).toBeInTheDocument();
  });

  it('uses status as aria-label when no label provided', () => {
    render(<StatusBadge status="error" />);

    expect(screen.getByRole('status', { name: /error/i })).toBeInTheDocument();
  });

  it('displays the label text', () => {
    render(<StatusBadge status="success" label="All systems operational" />);

    expect(screen.getByText('All systems operational')).toBeInTheDocument();
  });

  it('applies custom className', () => {
    render(<StatusBadge status="info" className="custom-class" />);

    expect(screen.getByRole('status')).toHaveClass('custom-class');
  });
});
```

## StatusBadge.stories.tsx

Stories use the CSF3 format with typed meta and story objects.

```tsx
import type { Meta, StoryObj } from '@storybook/react';

import { StatusBadge } from './StatusBadge';

const meta: Meta<typeof StatusBadge> = {
  title: 'Components/StatusBadge',
  component: StatusBadge,
  parameters: { layout: 'centered' },
  tags: ['autodocs'],
  argTypes: {
    status: {
      control: 'select',
      options: ['success', 'warning', 'error', 'info'],
    },
  },
};

export default meta;
type Story = StoryObj<typeof StatusBadge>;

export const Success: Story = {
  args: { status: 'success', label: 'Complete' },
};

export const Warning: Story = {
  args: { status: 'warning', label: 'Pending' },
};

export const Error: Story = {
  args: { status: 'error', label: 'Failed' },
};

export const Info: Story = {
  args: { status: 'info', label: 'Processing' },
};

export const WithoutLabel: Story = {
  args: { status: 'success' },
};
```
