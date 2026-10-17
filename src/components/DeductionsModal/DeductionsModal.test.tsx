import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import type { ComponentProps } from 'react';
import { describe, expect, it, vi } from 'vitest';

import { DeductionsModal } from './DeductionsModal';

const noop = () => {};

const renderModal = (
  props: Partial<ComponentProps<typeof DeductionsModal>> = {},
) =>
  render(
    <DeductionsModal
      isOpen
      onClose={noop}
      deductions={[]}
      teams={[]}
      isCustomised={false}
      onUpdate={noop}
      onAdd={noop}
      onRemove={noop}
      onReset={noop}
      {...props}
    />,
  );

describe('DeductionsModal', () => {
  it('does not render the Genuine switch without onGenuineChange', () => {
    renderModal();
    expect(
      screen.queryByRole('checkbox', { name: /genuine/i }),
    ).not.toBeInTheDocument();
  });

  it('toggles Genuine from the switch', async () => {
    const onGenuineChange = vi.fn();
    renderModal({ isGenuine: true, onGenuineChange });

    const toggle = screen.getByRole('checkbox', { name: /genuine/i });
    expect(toggle).toHaveAttribute('aria-checked', 'true');

    await userEvent.click(toggle);
    expect(onGenuineChange).toHaveBeenCalledTimes(1);
    expect(onGenuineChange).toHaveBeenCalledWith(false);
  });

  it('toggles Genuine once when the label text is clicked', async () => {
    const onGenuineChange = vi.fn();
    renderModal({ isGenuine: false, onGenuineChange });

    await userEvent.click(screen.getByText('Genuine'));
    expect(onGenuineChange).toHaveBeenCalledTimes(1);
    expect(onGenuineChange).toHaveBeenCalledWith(true);
  });
});
