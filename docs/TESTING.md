# Component Testing Guide

Every component **must** have tests using React Testing Library with Vitest.

## Test File Structure

```
This section to be completed with an example later.
```

## Accessibility-First Query Priority

Tests **must** find elements the way assistive technologies would:

1. **`getByRole`** - Most preferred; tests accessibility
2. **`getByLabelText`** - For form elements
3. **`getByPlaceholderText`** - For inputs without labels
4. **`getByText`** - For non-interactive text content
5. **`getByAltText`** - For images

```
More examples to be added here.
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
