# Component Testing Guide

Every component **must** have tests using React Testing Library with Vitest.

## Test File Structure

```tsx
import React from 'react';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { ComponentName } from './ComponentName';

describe('ComponentName', () => {
  it('renders the label text', () => {
    render(<ComponentName label="Test Label" />);
    expect(screen.getByText('Test Label')).toBeInTheDocument();
  });

  it('calls onClick handler when clicked', async () => {
    const handleClick = vi.fn();
    render(<ComponentName label="Clickable" onClick={handleClick} />);

    await userEvent.click(screen.getByRole('button', { name: /clickable/i }));

    expect(handleClick).toHaveBeenCalledTimes(1);
  });
});
```

## Accessibility-First Query Priority

Tests **must** find elements the way assistive technologies would:

1. **`getByRole`** - Most preferred; tests accessibility
2. **`getByLabelText`** - For form elements
3. **`getByPlaceholderText`** - For inputs without labels
4. **`getByText`** - For non-interactive text content
5. **`getByAltText`** - For images

```tsx
// ✅ Preferred: Query by role with accessible name
screen.getByRole('button', { name: /submit/i });
screen.getByRole('textbox', { name: /email/i });
screen.getByRole('checkbox', { name: /agree to terms/i });

// ✅ Acceptable: Query by text for static content
screen.getByText(/loading.../i);

// ❌ Avoid: Query by test ID or CSS selectors
screen.getByTestId('submit-button');
document.querySelector('.submit-btn');
```

## Testing Interactions

Use `userEvent` from `@testing-library/user-event` for realistic interactions:

```tsx
import userEvent from '@testing-library/user-event';

it('handles keyboard navigation', async () => {
  const user = userEvent.setup();
  render(<ComponentName />);

  const button = screen.getByRole('button');
  await user.tab();
  expect(button).toHaveFocus();

  await user.keyboard('{Enter}');
  // Assert expected behavior
});
```

## What to Test

- Component renders with required props
- Interactive elements respond to user input
- Keyboard accessibility (tab navigation, Enter/Space activation)
- Conditional rendering based on props
- Error states and edge cases
- ARIA attributes are correctly applied

## What Not to Test

- Implementation details (internal state, private functions)
- Exact CSS styles or class names
- Snapshot testing (avoid unless specifically needed)
