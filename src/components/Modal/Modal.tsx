import { useCallback, type ReactNode } from 'react';
import {
  useFloating,
  useDismiss,
  useRole,
  useInteractions,
  FloatingOverlay,
  FloatingFocusManager,
  FloatingPortal,
} from '@floating-ui/react';
import { AnimatePresence, motion } from 'framer-motion';
import { clsx } from 'clsx';
import * as styles from './Modal.css';

interface ModalProps {
  /** Whether the modal is currently visible */
  isOpen: boolean;
  /** Called when the modal requests to close (dismiss, overlay click, etc.) */
  onClose: () => void;
  children: ReactNode;
  /** CSS class applied to the modal panel (controls sizing, padding, etc.) */
  className?: string;
  /**
   * Where to place initial focus when the modal opens.
   * Pass `-1` to focus the floating container itself (no visible focus ring),
   * or a ref to a specific element. Defaults to the first tabbable element.
   */
  initialFocus?: number | React.MutableRefObject<HTMLElement | null>;
}

export const Modal = ({ isOpen, onClose, children, className, initialFocus }: ModalProps) => {
  const { refs, context } = useFloating({
    open: isOpen,
    onOpenChange: (open) => {
      if (!open) onClose();
    },
  });

  const dismiss = useDismiss(context, { outsidePressEvent: 'mousedown' });
  const role = useRole(context, { role: 'dialog' });
  const { getFloatingProps } = useInteractions([dismiss, role]);

  const floatingRef = useCallback(
    (node: HTMLDivElement | null) => {
      refs.setFloating(node);
    },
    [refs],
  );

  return (
    <FloatingPortal>
      <AnimatePresence>
        {isOpen && (
          <FloatingOverlay lockScroll className={styles.overlay}>
            <motion.div
              className={styles.backdrop}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3 }}
            >
              <FloatingFocusManager context={context} initialFocus={initialFocus}>
                <motion.div
                  ref={floatingRef}
                  className={clsx(styles.panel, className)}
                  initial={{ opacity: 0, scale: 0.9, y: 20 }}
                  animate={{ opacity: 1, scale: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.9, y: 20 }}
                  transition={{ type: 'spring', damping: 25, stiffness: 300 }}
                  {...getFloatingProps()}
                >
                  {children}
                </motion.div>
              </FloatingFocusManager>
            </motion.div>
          </FloatingOverlay>
        )}
      </AnimatePresence>
    </FloatingPortal>
  );
};
