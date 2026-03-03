import {
  useFloating,
  useClick,
  useDismiss,
  useRole,
  useInteractions,
  FloatingOverlay,
  FloatingFocusManager,
} from '@floating-ui/react';
import { useCallback, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import type { TeamStanding } from '../../types';
import { Confetti } from '../Confetti';
import { Button } from '../Button';
import { ShareIcon } from '../icons';
import { getCrest } from '../../assets/crests';
import * as styles from './SeasonSummaryModal.css';

interface SeasonSummaryModalProps {
  standings: TeamStanding[];
  isOpen: boolean;
  onClose: () => void;
}

const TeamRow = ({ standing }: { standing: TeamStanding }) => {
  return (
    <div className={styles.teamRow}>
      <img src={getCrest(standing.team.crest)} alt={standing.team.name} className={styles.crest} />
      <span className={styles.teamName}>{standing.team.name}</span>
    </div>
  );
};

export const SeasonSummaryModal = ({ standings, isOpen, onClose }: SeasonSummaryModalProps) => {
  const { refs, context } = useFloating({
    open: isOpen,
    onOpenChange: (open) => {
      if (!open) onClose();
    },
  });

  const click = useClick(context);
  const dismiss = useDismiss(context, { outsidePressEvent: 'mousedown' });
  const role = useRole(context, { role: 'dialog' });
  const [showConfetti, setShowConfetti] = useState(isOpen);
  const [prevIsOpen, setPrevIsOpen] = useState(isOpen);
  const hasShareApi = typeof navigator.share === 'function';

  if (isOpen !== prevIsOpen) {
    setPrevIsOpen(isOpen);
    if (isOpen) {
      setShowConfetti(true);
    }
  }

  const { getFloatingProps } = useInteractions([click, dismiss, role]);

  const floatingRef = useCallback(
    (node: HTMLDivElement | null) => {
      refs.setFloating(node);
    },
    [refs],
  );

  const champion = standings[0];
  const promoted = standings.slice(0, 2);
  const playoffs = standings.slice(2, 6);
  const relegated = standings.slice(21, 24);

  const handleShare = async () => {
    const lines = [
      `⚽ **EFL Championship 2025/26 Predictions**`,
      ``,
      `🏆 Champions: ${champion?.team.name}`,
      `⬆️ Promoted: ${promoted.map((s) => s.team.name).join(', ')}`,
      `🔀 Playoffs: ${playoffs.map((s) => s.team.name).join(', ')}`,
      `⬇️ Relegated: ${relegated.map((s) => s.team.name).join(', ')}\n\n`,
    ];

    try {
      await navigator.share({
        title: 'EFL Championship 2025/26 Predictions',
        text: lines.join('\n'),
        url: window.location.href,
      });
    } catch {
      // User cancelled or share failed
    }
  };

  return (
    <div className={styles.container}>
      {showConfetti && (
        <Confetti
          isLooping={false}
          particleDensity={20}
          size={5}
          gravity={3}
          yStartOffset={0.8}
          onAnimationComplete={() => setShowConfetti(false)}
        />
      )}
      <AnimatePresence>
        {isOpen && (
          <FloatingOverlay lockScroll>
            <motion.div
              className={styles.overlay}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3 }}
            >
              <FloatingFocusManager context={context}>
                <motion.div
                  ref={floatingRef}
                  className={styles.modal}
                  initial={{ opacity: 0, scale: 0.9, y: 20 }}
                  animate={{ opacity: 1, scale: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.9, y: 20 }}
                  transition={{ type: 'spring', damping: 25, stiffness: 300 }}
                  {...getFloatingProps()}
                >
                  {champion && (
                    <img
                      src={getCrest(champion.team.crest)}
                      alt=""
                      className={styles.backgroundCrest}
                      aria-hidden="true"
                    />
                  )}

                  <button className={styles.closeButton} onClick={onClose} aria-label="Close">
                    ✕
                  </button>

                  <h2 className={styles.championHeading}>
                    Congratulations
                    <br />
                    <span className={styles.championName}>{champion?.team.name}!</span>
                  </h2>

                  <p className={styles.championSubheading}>
                    EFL Championship Champions 2025/26!<span className={styles.asterisk}>*</span>
                  </p>
                  <p className={styles.predictionParagraph}>*This is only a prediction…</p>

                  <hr className={styles.divider} />

                  <div className={styles.section}>
                    <div className={styles.promotedLabel}>Promoted</div>
                    <div className={styles.teamList}>
                      {promoted.map((s) => (
                        <TeamRow key={s.team.id} standing={s} />
                      ))}
                    </div>
                  </div>

                  <div className={styles.section}>
                    <div className={styles.playoffsLabel}>Playoffs</div>
                    <div className={styles.teamList}>
                      {playoffs.map((s) => (
                        <TeamRow key={s.team.id} standing={s} />
                      ))}
                    </div>
                  </div>

                  <hr className={styles.divider} />

                  <div className={styles.section}>
                    <div className={styles.relegatedLabel}>Relegated</div>
                    <div className={styles.teamList}>
                      {relegated.map((s) => (
                        <TeamRow key={s.team.id} standing={s} />
                      ))}
                    </div>
                  </div>

                  {hasShareApi && (
                    <div className={styles.shareButtonWrapper}>
                      <Button variant="success" onClick={handleShare}>
                        <ShareIcon size={14} />
                        Share your Predictions
                      </Button>
                    </div>
                  )}
                </motion.div>
              </FloatingFocusManager>
            </motion.div>
          </FloatingOverlay>
        )}
      </AnimatePresence>
    </div>
  );
};
