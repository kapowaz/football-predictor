import { useRef, useEffect, useCallback } from 'react';
import { ConfettiParticle } from './ConfettiParticle';
import { Vector2 } from './utils';
import * as styles from './Confetti.css';

const PARTICLE_COLORS: string[] = [
  '#DE6666',
  '#E89344',
  '#E1B348',
  '#5BCF7C',
  '#4670DC',
  '#B670CE',
  '#76BBFE',
  '#EF91AE',
];

// Check if we're in a browser environment with requestAnimationFrame support
const canAnimate =
  typeof window !== 'undefined' && typeof window.requestAnimationFrame === 'function';

export interface ConfettiProps {
  /**
   * Does the particle effect loop forever or not?
   */
  isLooping?: boolean;

  /**
   * The particle density proportional to the viewport.
   */
  particleDensity?: number;

  /**
   * The rate at which particles should fall.
   */
  gravity?: number;

  /**
   * The vertical threshold at which particles should begin to fade out, where 0
   * is the very top of the screen and 1 is the very bottom (i.e. don't fade out
   * at all).
   */
  fadeThreshold?: number;

  /**
   * The vertical offset from which particles should begin falling, where 0 is
   * no offset and 1 is the y bounds size.
   */

  yStartOffset?: number;

  /**
   * A callback handler for when the animation ends, if the animation isn't
   * `isLooping`.
   */
  onAnimationComplete?: () => void;

  /**
   * The size of each confetti particle.
   */
  size?: number;
}

/**
 * Creates an animated confetti effect using `<canvas>`
 */
export const Confetti = ({
  isLooping = true,
  particleDensity = 10,
  gravity = 1,
  fadeThreshold = 1,
  yStartOffset = 0,
  onAnimationComplete,
  size = 5,
}: ConfettiProps) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const particlesRef = useRef<ConfettiParticle[]>([]);
  const animationRequestRef = useRef<number>(0);
  const lastTimeRef = useRef<number>(0);
  const updateRef = useRef<(timestamp: number) => void>(() => {});

  // Store callback refs to avoid stale closures in animation loop
  const isLoopingRef = useRef(isLooping);
  const onAnimationCompleteRef = useRef(onAnimationComplete);

  useEffect(() => {
    isLoopingRef.current = isLooping;
  }, [isLooping]);

  useEffect(() => {
    onAnimationCompleteRef.current = onAnimationComplete;
  }, [onAnimationComplete]);

  const stop = useCallback(() => {
    if (typeof window !== 'undefined') {
      cancelAnimationFrame(animationRequestRef.current);
    }
  }, []);

  // Set up the update function with delta time calculation
  useEffect(() => {
    updateRef.current = (timestamp: number) => {
      const canvas = canvasRef.current;
      if (!canvas) return;

      const context = canvas.getContext('2d');
      if (!context) return;

      // Calculate delta time in seconds (fall back to ~60fps for first frame)
      const deltaTime = lastTimeRef.current ? (timestamp - lastTimeRef.current) / 1000 : 1 / 60;
      lastTimeRef.current = timestamp;

      // Cap delta time to prevent large jumps (e.g., when tab becomes active)
      const cappedDeltaTime = Math.min(deltaTime, 0.1);

      context.clearRect(0, 0, canvas.width, canvas.height);

      particlesRef.current = particlesRef.current.filter((particle) => {
        return particle.render(cappedDeltaTime, context, !isLoopingRef.current);
      });

      if (particlesRef.current.length) {
        animationRequestRef.current = window.requestAnimationFrame(updateRef.current);
      } else {
        onAnimationCompleteRef.current?.();
        stop();
      }
    };
  }, [stop]);

  const resize = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const canvasParent = canvas.parentNode as HTMLElement;
    if (!canvasParent) return;

    const canvasWidth = canvasParent.offsetWidth;
    const canvasHeight = canvasParent.offsetHeight;
    const bounds = new Vector2(canvasWidth, canvasHeight);

    canvas.width = canvasWidth * window.devicePixelRatio;
    canvas.height = canvasHeight * window.devicePixelRatio;
    particlesRef.current.forEach((particle) => particle.resetBounds(bounds));
  }, []);

  const initialize = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const canvasParent = canvas.parentNode as HTMLElement;
    if (!canvasParent) return;

    const canvasWidth = canvasParent.offsetWidth;
    const canvasHeight = canvasParent.offsetHeight;
    const bounds = new Vector2(canvasWidth, canvasHeight);

    canvas.width = canvasWidth * window.devicePixelRatio;
    canvas.height = canvasHeight * window.devicePixelRatio;

    const particleCount = (particleDensity / 50) * canvasWidth;
    particlesRef.current = [];

    for (let i = 0; i < particleCount; i += 1) {
      const color = PARTICLE_COLORS[Math.round(Math.random() * (PARTICLE_COLORS.length - 1))];
      const particle = new ConfettiParticle(
        bounds,
        yStartOffset,
        gravity,
        color,
        fadeThreshold,
        size,
      );
      particlesRef.current.push(particle);
    }

    stop();
    lastTimeRef.current = 0; // Reset timestamp for fresh delta calculation
    animationRequestRef.current = window.requestAnimationFrame(updateRef.current);
    window.addEventListener('resize', resize);
  }, [particleDensity, yStartOffset, gravity, fadeThreshold, size, stop, resize]);

  useEffect(() => {
    if (canAnimate) {
      initialize();
    }

    return () => {
      stop();
      window.removeEventListener('resize', resize);
    };
  }, [initialize, stop, resize]);

  if (!canAnimate) {
    return null;
  }

  return <canvas className={styles.confetti} ref={canvasRef} />;
};
