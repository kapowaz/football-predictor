import {
  createContext,
  forwardRef,
  cloneElement,
  useCallback,
  useContext,
  useEffect,
  useId,
  useRef,
  useState,
  useLayoutEffect,
  type JSX,
} from 'react';
import {
  arrow,
  autoUpdate,
  flip,
  FloatingArrow,
  offset,
  safePolygon,
  shift,
  useDismiss,
  useFloating,
  useFocus,
  useHover,
  useRole,
  useInteractions,
  useTransitionStyles,
  FloatingPortal,
  type FloatingPortalProps,
  type Placement,
} from '@floating-ui/react';
import * as styles from './Popover.css';

export type { Placement };

export interface SharedPopoverProps {
  /**
   * Should the popover be open? Implicitly means the popover visibility is
   * controlled; if omitted, the popover target will control visibility
   */
  isOpen?: boolean;

  /**
   * Set to true if you want the tooltip to stay long enough so the user can
   * move mouse over content to select text or click a link
   */
  isInteractive?: boolean;

  /**
   * Placement of the Popover relative to the trigger content
   */
  placement?: Placement;

  /**
   * Transition duration for hide/show effects, in milliseconds
   */
  transitionDuration?: number;

  /**
   * Additional delay before hiding the popover after mouseout, in milliseconds
   */
  hideDelay?: number;

  /**
   * Virtual element to anchor the popover to instead of the trigger
   */
  virtualElement?: React.RefObject<Element | null>;

  /**
   * DOM element or ID to render the portal into, falls back to document.body
   */
  portalContainer?: FloatingPortalProps['root'];
}

export interface PopoverWithTriggerProps extends SharedPopoverProps {
  /**
   * Content used to trigger the Popover being displayed
   */
  trigger: JSX.Element;

  /**
   * Content to render within the Popover
   */
  children: JSX.Element;

  /**
   * When using a Trigger prop, there shouldn’t be a content prop
   */
  content?: never;

  /**
   * When using a Trigger prop, the prop is uncontrolled, so no isOpen prop should be provided.
   */
  isOpen?: never;
}

export interface PopoverWithContentProps extends SharedPopoverProps {
  /**
   * Content to render within the Popover
   */
  content: JSX.Element | string;

  /**
   * Children to use as the trigger for the Popover
   */
  children: JSX.Element;

  /**
   * When using a Content prop, there shouldn’t be a trigger prop
   */
  trigger?: never;

  /**
   * When using a Trigger prop, the prop is uncontrolled, so no isOpen prop should be provided.
   */
  isOpen?: never;
}

export interface ControlledPopoverProps extends SharedPopoverProps {
  /**
   * When controlled, there is no trigger prop
   */
  trigger?: never;

  /**
   * Equally, when controlled there is no content prop since we can just use children
   */
  content?: never;

  /**
   * Virtual element to anchor the popover to instead of the trigger is required in this case
   */
  virtualElement: React.RefObject<Element | null>;

  /**
   * Children to use as the trigger for the Popover
   */
  children: JSX.Element;

  /**
   * Controlled popover requires the isOpen prop to be provided
   */
  isOpen: boolean;
}

export type PopoverProps =
  | PopoverWithTriggerProps
  | PopoverWithContentProps
  | ControlledPopoverProps;

interface PopoverGroupContextValue {
  activeId: string | null;
  setActiveId: (id: string | null) => void;
}

const PopoverGroupContext = createContext<PopoverGroupContextValue | null>(null);

export const PopoverGroup = ({ children }: { children: React.ReactNode }) => {
  const [activeId, setActiveId] = useState<string | null>(null);
  return (
    <PopoverGroupContext.Provider value={{ activeId, setActiveId }}>
      {children}
    </PopoverGroupContext.Provider>
  );
};

const POPOVER_OFFSET = 8;

const getMiddleware = ({
  placement,
  arrowRef,
}: {
  placement?: Placement;
  arrowRef: React.RefObject<null>;
}) => {
  const BOUNDARY_ELEMENT_ID = 'floating-boundary';
  const _flip = flip({
    // Ensure we flip to the perpendicular axis if it doesn't fit
    // on narrow viewports.
    crossAxis: 'alignment',
    fallbackAxisSideDirection: 'end',
    boundary: document.getElementById(BOUNDARY_ELEMENT_ID) ?? undefined,
  });

  const middleware = placement?.includes('-') ? [_flip, shift()] : [shift(), _flip];

  // the order of middleware is important!
  // `arrow` should almost always be at the end
  // see https://floating-ui.com/docs/arrow#order
  return [
    offset(POPOVER_OFFSET),
    ...middleware,
    arrow({
      element: arrowRef,
    }),
  ];
};

export const Popover = forwardRef<HTMLElement, PopoverProps>(
  (
    {
      trigger: _trigger,
      content: _content,
      children,
      isOpen: isOpenControlled,
      isInteractive = false,
      placement = 'bottom',
      transitionDuration = 200,
      hideDelay = 500,
      virtualElement,
      portalContainer,
    },
    forwardedRef,
  ) => {
    const arrowRef = useRef(null);
    const closeTimer = useRef<number | undefined>(undefined);
    const popoverId = useId();
    const group = useContext(PopoverGroupContext);
    const [isOpenState, setOpen] = useState(isOpenControlled ?? false);
    const [isDelayedOpen, setDelayedOpen] = useState(isOpenControlled ?? false);
    const isOpen = isOpenControlled ?? isOpenState;
    const middleware = getMiddleware({ placement, arrowRef });

    useEffect(() => {
      if (group && group.activeId !== popoverId && isOpenState) {
        setOpen(false);
        clearTimeout(closeTimer.current);
        closeTimer.current = window.setTimeout(() => {
          setDelayedOpen(false);
        }, transitionDuration + hideDelay);
      }
    }, [group, group?.activeId, popoverId, isOpenState, transitionDuration, hideDelay]);

    const { context, refs, floatingStyles } = useFloating({
      open: isOpen,
      placement,
      onOpenChange: (open) => {
        setOpen(open);
        clearTimeout(closeTimer.current);

        if (!open) {
          closeTimer.current = window.setTimeout(() => {
            setDelayedOpen(open);
          }, transitionDuration + hideDelay);
        } else {
          setDelayedOpen(open);
          if (group) {
            group.setActiveId(popoverId);
          }
        }
      },
      middleware,
      whileElementsMounted: autoUpdate,
    });

    useLayoutEffect(() => {
      if (virtualElement && virtualElement.current !== null) {
        const domRect = virtualElement.current.getBoundingClientRect();

        refs.setPositionReference({
          getBoundingClientRect: () => {
            if (virtualElement.current !== null)
              return virtualElement.current.getBoundingClientRect();
            return domRect;
          },
          contextElement: virtualElement.current,
        });
      }
    }, [refs, virtualElement]);

    const { getReferenceProps, getFloatingProps } = useInteractions([
      useDismiss(context),
      useHover(context, {
        handleClose: isInteractive ? safePolygon() : undefined,
        move: false,
        delay: {
          open: 0,
          close: hideDelay,
        },
      }),
      useFocus(context),
      useRole(context),
    ]);

    const { styles: transitionStyles } = useTransitionStyles(context, {
      duration: transitionDuration,
      initial: ({ side }) => ({
        opacity: 0,
        transform:
          side === 'top' || side === 'bottom'
            ? `translateY(${POPOVER_OFFSET}px)`
            : `translateX(${POPOVER_OFFSET}px)`,
      }),
      open: ({ side }) => ({
        opacity: 1,
        transform: side === 'top' || side === 'bottom' ? `translateY(0)` : `translateX(0)`,
      }),
      close: ({ side }) => ({
        opacity: 0,
        transform:
          side === 'top' || side === 'bottom'
            ? `translateY(${POPOVER_OFFSET}px)`
            : `translateX(${POPOVER_OFFSET}px)`,
      }),
    });

    const handleRef = useCallback(
      (ref: HTMLElement | null) => {
        refs.setReference(ref);

        if (typeof forwardedRef === 'function') {
          forwardedRef(ref);
        } else if (forwardedRef) {
          forwardedRef.current = ref;
        }
      },
      [forwardedRef, refs],
    );

    /**
     * The interface of Popover supports two methods of usage where the children
     * can either represent the content of the popover, or the element to
     * trigger rendering the popover. Dependent on whether the trigger or
     * content prop is provided, the children prop will handle the other
     * scenario.
     *
     * Additionally, it also supports the use of a virtualElement prop to
     * control the position of the popover, and the isOpen prop for controlled
     * open/closed state. In the latter case, no trigger element is passed and
     * the children prop is used as the content of the popover (with the
     * virtualElement controlling the popover position)
     */
    const [trigger, content] = (() => {
      switch (true) {
        /**
         * If the popover is controlled, the trigger isn’t used at all
         */
        case typeof isOpenControlled !== 'undefined':
          return [undefined, children];

        /**
         * If a trigger prop was passed, use it as the trigger, and the children
         * as the popover content
         */
        case typeof _trigger !== 'undefined':
          return [_trigger, children];

        /**
         * Otherwise, use the children as the trigger element, and the content
         * prop as the popover content
         */
        default:
          return [children, _content];
      }
    })();

    return (
      <>
        {/* element to trigger displaying the popover */}
        {typeof trigger !== 'undefined' &&
          cloneElement(trigger, {
            ref: handleRef,
            tabIndex: 0,
            'aria-describedby': isOpen ? popoverId : undefined,
            ...getReferenceProps(),
          })}
        {/* content to render inside the popover when open */}
        {(isDelayedOpen || isOpen) && (
          <FloatingPortal root={portalContainer}>
            <div ref={refs.setFloating} style={floatingStyles} {...getFloatingProps()}>
              <div style={transitionStyles} className={styles.shadow}>
                <FloatingArrow className={styles.arrow} ref={arrowRef} context={context} />
                <div id={popoverId} role="tooltip" className={styles.container}>
                  {content}
                </div>
              </div>
            </div>
          </FloatingPortal>
        )}
      </>
    );
  },
);

Popover.displayName = 'Popover';
