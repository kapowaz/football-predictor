import { createRef } from 'react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { Popover } from './Popover';

describe('Popover', () => {
  beforeEach(() => {
    // Clear any leftover timers between tests
    vi.clearAllTimers();
  });

  it('should not have aria-describedby attribute on the trigger element when the popover is closed', () => {
    render(
      <Popover trigger={<button>Trigger</button>} placement="top">
        <div>Popover content</div>
      </Popover>,
    );

    const trigger = screen.getByRole('button', { name: 'Trigger' });
    expect(trigger).toBeInTheDocument();
    expect(trigger).not.toHaveAttribute('aria-describedby');
  });

  it('should have aria-describedby attribute on the trigger element when the popover is open', async () => {
    const user = userEvent.setup();

    render(
      <Popover trigger={<button>Trigger</button>} placement="top">
        <div>Popover content</div>
      </Popover>,
    );

    const trigger = screen.getByRole('button', { name: 'Trigger' });
    await user.hover(trigger);

    await waitFor(() => {
      expect(trigger).toHaveAttribute('aria-describedby');
      const ariaDescribedBy = trigger.getAttribute('aria-describedby');
      expect(ariaDescribedBy).toBeTruthy();

      const tooltip = screen.getByRole('tooltip');
      expect(tooltip).toHaveAttribute('id', ariaDescribedBy);
    });
  });

  it('should have role="tooltip" on popover content', async () => {
    const user = userEvent.setup();

    render(
      <Popover trigger={<button>Trigger</button>} placement="top">
        <div>Popover content</div>
      </Popover>,
    );

    const trigger = screen.getByRole('button', { name: 'Trigger' });
    await user.hover(trigger);

    await waitFor(() => {
      const tooltip = screen.getByRole('tooltip');
      expect(tooltip).toBeInTheDocument();
    });
  });

  it('should have tabIndex="0" on trigger for keyboard navigation', () => {
    render(
      <Popover trigger={<div>Trigger div</div>} placement="top">
        <div>Popover content</div>
      </Popover>,
    );

    const trigger = screen.getByText('Trigger div');
    expect(trigger).toHaveAttribute('tabIndex', '0');
  });

  it('should display when focusing the trigger element via keyboard navigation', async () => {
    const user = userEvent.setup();

    render(
      <Popover trigger={<button>Trigger</button>} placement="top">
        <div>Popover content</div>
      </Popover>,
    );

    const trigger = screen.getByRole('button', { name: 'Trigger' });

    // Tab to focus the trigger
    await user.tab();
    expect(trigger).toHaveFocus();

    // Popover should open on focus
    await waitFor(() => {
      expect(screen.getByRole('tooltip')).toBeInTheDocument();
    });
  });

  it('should close on blur when navigated to via keyboard', async () => {
    const user = userEvent.setup();

    render(
      <>
        <Popover trigger={<button>Trigger</button>} placement="top">
          <div>Popover content</div>
        </Popover>
        <button>Other button</button>
      </>,
    );

    const trigger = screen.getByRole('button', { name: 'Trigger' });

    // Focus trigger to open popover
    await user.tab();
    expect(trigger).toHaveFocus();

    await waitFor(() => {
      expect(screen.getByRole('tooltip')).toBeInTheDocument();
    });

    // Tab away to blur
    await user.tab();

    await waitFor(
      () => {
        expect(screen.queryByRole('tooltip')).not.toBeInTheDocument();
      },
      { timeout: 1000 },
    );
  });

  it('should open on hover for mouse users', async () => {
    const user = userEvent.setup();

    render(
      <Popover trigger={<button>Trigger</button>} placement="top">
        <div>Popover content</div>
      </Popover>,
    );

    const trigger = screen.getByRole('button', { name: 'Trigger' });
    await user.hover(trigger);

    await waitFor(() => {
      expect(screen.getByRole('tooltip')).toBeInTheDocument();
      expect(screen.getByText('Popover content')).toBeInTheDocument();
    });
  });

  it('should close on unhover for mouse users', async () => {
    const user = userEvent.setup({ delay: null });

    render(
      <Popover trigger={<button>Trigger</button>} placement="top" hideDelay={0}>
        <div>Popover content</div>
      </Popover>,
    );

    const trigger = screen.getByRole('button', { name: 'Trigger' });
    await user.hover(trigger);

    await waitFor(() => {
      expect(screen.getByRole('tooltip')).toBeInTheDocument();
    });

    await user.unhover(trigger);

    await waitFor(
      () => {
        expect(screen.queryByRole('tooltip')).not.toBeInTheDocument();
      },
      { timeout: 1000 },
    );
  });

  it('should support controlled open state', () => {
    const reference = createRef<HTMLDivElement>();
    const { rerender } = render(
      <>
        <div ref={reference}>virtual element</div>
        <Popover virtualElement={reference} placement="top" isOpen={false}>
          <div>Popover content</div>
        </Popover>
      </>,
    );

    expect(screen.queryByRole('tooltip')).not.toBeInTheDocument();

    rerender(
      <>
        <div ref={reference}>virtual element</div>
        <Popover virtualElement={reference} placement="top" isOpen={true}>
          <div>Popover content</div>
        </Popover>
      </>,
    );

    expect(screen.getByRole('tooltip')).toBeInTheDocument();
  });

  it('should allow interactive content when isInteractive is true', async () => {
    const user = userEvent.setup({ delay: null });
    const handleClick = vi.fn();

    render(
      <Popover
        trigger={<button>Trigger</button>}
        placement="top"
        isInteractive={true}
        hideDelay={100}
      >
        <button onClick={handleClick}>Interactive button</button>
      </Popover>,
    );

    const trigger = screen.getByRole('button', { name: 'Trigger' });
    await user.hover(trigger);

    await waitFor(() => {
      expect(screen.getByRole('tooltip')).toBeInTheDocument();
    });

    const interactiveButton = screen.getByRole('button', { name: 'Interactive button' });
    await user.click(interactiveButton);

    expect(handleClick).toHaveBeenCalledOnce();
  });

  it('should maintain unique IDs for multiple popovers', async () => {
    const user = userEvent.setup();

    render(
      <>
        <Popover trigger={<button>Trigger 1</button>} placement="top">
          <div>Content 1</div>
        </Popover>
        <Popover trigger={<button>Trigger 2</button>} placement="top">
          <div>Content 2</div>
        </Popover>
      </>,
    );

    const trigger1 = screen.getByRole('button', { name: 'Trigger 1' });
    const trigger2 = screen.getByRole('button', { name: 'Trigger 2' });

    await user.hover(trigger1);

    await waitFor(() => {
      const id1 = trigger1.getAttribute('aria-describedby');
      expect(id1).toBeTruthy();
    });

    await user.unhover(trigger1);
    await user.hover(trigger2);

    await waitFor(() => {
      const id2 = trigger2.getAttribute('aria-describedby');
      expect(id2).toBeTruthy();

      // IDs should be different
      const id1 = trigger1.getAttribute('aria-describedby');
      expect(id1).not.toBe(id2);
    });
  });

  it('should clean up on unmount', async () => {
    const user = userEvent.setup();

    const { unmount } = render(
      <Popover trigger={<button>Trigger</button>} placement="top">
        <div>Popover content</div>
      </Popover>,
    );

    const trigger = screen.getByRole('button', { name: 'Trigger' });
    await user.hover(trigger);

    await waitFor(() => {
      expect(screen.getByRole('tooltip')).toBeInTheDocument();
    });

    unmount();

    // After unmount, tooltip should be gone
    expect(screen.queryByRole('tooltip')).not.toBeInTheDocument();
  });
});
