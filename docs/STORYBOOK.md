# Storybook Guide

Every component **must** have an associated `ComponentName.stories.tsx` file.

## Story File Structure

```tsx
import type { Meta, StoryObj } from '@storybook/react';
import { ComponentName, ComponentNameProps } from './ComponentName';

const meta: Meta<ComponentNameProps> = {
  title: 'ComponentName',
  component: ComponentName,
  parameters: {
    layout: 'centered', // or 'padded' for larger components
  },
  tags: ['autodocs'],
  argTypes: {
    variant: {
      control: 'select',
      options: ['primary', 'secondary', 'danger'],
    },
  },
};

export default meta;
type Story = StoryObj<ComponentNameProps>;

export const Default: Story = {
  args: {
    label: 'Example Label',
  },
};

export const WithIcon: Story = {
  args: {
    label: 'With Icon',
    icon: 'database',
  },
};

export const Disabled: Story = {
  args: {
    label: 'Disabled State',
    disabled: true,
  },
};
```

## Best Practices

- Include a `Default` story showing typical usage
- Add stories for each visual variant and interactive state
- Use `argTypes` to define controls for interactive props
- Include `tags: ['autodocs']` for automatic documentation generation
