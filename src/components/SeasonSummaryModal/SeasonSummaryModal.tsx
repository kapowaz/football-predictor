import { useState, useEffect, useRef } from 'react';
import { AbstractText, Confetti, Modal } from '@kapowaz/components';
import type { ModalAction } from '@kapowaz/components';
import { Share } from '@kapowaz/icons';
import type { TeamStanding } from '../../types';
import type { CompetitionConfig, ZoneType } from '../../data/competitions';
import { groupStandingsByZone } from '../../utils/zones';
import { generateShareText } from '../../utils/share';
import { hasConfettiShown, markConfettiShown } from '../../utils/storage';
import { TeamRow } from './TeamRow';
import * as styles from './SeasonSummaryModal.css';

interface SeasonSummaryModalProps {
  /** Final standings for the season. */
  standings: TeamStanding[];
  /** Whether the modal is currently open. */
  isOpen: boolean;
  /** Callback fired when the modal is closed. */
  onClose: () => void;
  /** Competition configuration (name, zones, season, etc.). */
  competition: CompetitionConfig;
  /** Pre-rendered standings image files for sharing. */
  standingsImageFiles?: { top: File; bottom: File } | null;
  /** Whether the standings image is still being rendered. */
  isRenderingStandingsImage?: boolean;
}

const toOrderedShareFiles = (files: { top: File; bottom: File }): [File, File] => {
  const candidates = [files.top, files.bottom];
  const topFile = candidates.find((file) => file.name.includes('-top'));
  const bottomFile = candidates.find((file) => file.name.includes('-bottom'));

  if (topFile && bottomFile) {
    return [topFile, bottomFile];
  }

  return [files.top, files.bottom];
};

const zoneLabelStyles: Record<ZoneType, string> = {
  champions: styles.championsLabel,
  promotion: styles.promotedLabel,
  playoff: styles.playoffsLabel,
  championsLeague: styles.championsLeagueLabel,
  europaLeague: styles.europaLeagueLabel,
  conferenceLeague: styles.conferenceLeagueLabel,
  relegation: styles.relegatedLabel,
};

/** Approximate modal open animation duration (delay + transition) in ms. */
const MODAL_ANIMATION_DURATION_MS = 300;
const CONFETTI_POST_ANIMATION_DELAY_MS = 1000;

export const SeasonSummaryModal = ({
  standings,
  isOpen,
  onClose,
  competition,
  standingsImageFiles,
}: SeasonSummaryModalProps) => {
  const [showConfetti, setShowConfetti] = useState(false);
  const confettiTimeoutRef = useRef<number | undefined>(undefined);
  const hasShareApi = typeof navigator.share === 'function';

  useEffect(() => {
    if (!isOpen) {
      window.clearTimeout(confettiTimeoutRef.current);
      return;
    }

    if (hasConfettiShown(competition.slug)) return;

    confettiTimeoutRef.current = window.setTimeout(() => {
      setShowConfetti(true);
      markConfettiShown(competition.slug);
    }, MODAL_ANIMATION_DURATION_MS + CONFETTI_POST_ANIMATION_DELAY_MS);

    return () => window.clearTimeout(confettiTimeoutRef.current);
  }, [isOpen, competition.slug]);

  const champion = standings[0];
  const zoneGroups = groupStandingsByZone(standings, competition.zones);
  const relegationZone = zoneGroups.find((g) => g.zone.type === 'relegation');
  const nonRelegationZones = zoneGroups.filter((g) => g.zone.type !== 'relegation');

  const handleShare = async () => {
    try {
      const shareData: ShareData = {
        title: competition.fullTitle,
        text: generateShareText(standings, competition),
      };

      if (standingsImageFiles) {
        // Explicitly lock share order: top half first, bottom half second.
        const orderedImageFiles = toOrderedShareFiles(standingsImageFiles);
        try {
          if (navigator.canShare?.({ files: orderedImageFiles })) {
            shareData.files = orderedImageFiles;
          }
        } catch {
          // Ignore image processing errors and fall back to text-only sharing.
        }
      }

      await navigator.share(shareData);
    } catch {
      // User cancelled or share failed
    }
  };

  const actions: ModalAction[] = hasShareApi
    ? [{ type: 'primary' as const, label: 'Share your Predictions', icon: Share, onClick: handleShare }]
    : [];

  return (
    <>
      <Modal
        isOpen={isOpen}
        onRequestClose={onClose}
        contentLabel="Season Summary"
        heading={
          <span className={styles.modalHeading}>
            <img
              src={competition.logo}
              alt=""
              aria-hidden="true"
              className={styles.competitionLogo}
            />
            {competition.name} {competition.season}
          </span>
        }
        actions={actions}
      >
        <AbstractText
          tagName="h3"
          className={styles.championHeading}
          fontSize="xxl"
          fontWeight="bold"
        >
          Congratulations <span className={styles.championName}>{champion?.team.name}!</span>
        </AbstractText>

        {nonRelegationZones.map(({ zone, teams }) => {
          const isGridZone = zone.type === 'playoff' || zone.type === 'championsLeague';

          return (
            <div key={zone.name} className={styles.section}>
              <AbstractText
                tagName="div"
                className={zoneLabelStyles[zone.type] ?? styles.sectionLabel}
                fontSize="sm"
                fontWeight="semibold"
                textTransform="uppercase"
                letterSpacing="wide"
              >
                {zone.label}
              </AbstractText>
              <div className={isGridZone ? styles.teamListGrid : styles.teamList}>
                {teams.map((s) => (
                  <TeamRow key={s.team.id} standing={s} />
                ))}
              </div>
            </div>
          );
        })}

        {relegationZone && (
          <div className={styles.section}>
            <AbstractText
              tagName="div"
              className={styles.relegatedLabel}
              fontSize="sm"
              fontWeight="semibold"
              textTransform="uppercase"
              letterSpacing="wide"
            >
              {relegationZone.zone.label}
            </AbstractText>
            <div className={styles.teamList}>
              {relegationZone.teams.map((s) => (
                <TeamRow key={s.team.id} standing={s} />
              ))}
            </div>
          </div>
        )}
      </Modal>
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
    </>
  );
};
