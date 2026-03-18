import { useState, useEffect } from 'react';
import type { TeamStanding } from '../../types';
import type { CompetitionConfig, ZoneType } from '../../data/competitions';
import { groupStandingsByZone } from '../../utils/zones';
import { generateShareText } from '../../utils/share';
import { Modal } from '../Modal';
import { Confetti } from '../Confetti';
import { Button } from '../Button';
import { ShareIcon } from '../icons';
import { getCrest } from '../../assets/crests';
import { TeamRow } from './TeamRow';
import * as styles from './SeasonSummaryModal.css';

interface SeasonSummaryModalProps {
  standings: TeamStanding[];
  isOpen: boolean;
  onClose: () => void;
  competition: CompetitionConfig;
  standingsImageFiles?: { top: File; bottom: File } | null;
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

const CONFETTI_DELAY_MS = 200;

export const SeasonSummaryModal = ({
  standings,
  isOpen,
  onClose,
  competition,
  standingsImageFiles,
  isRenderingStandingsImage = false,
}: SeasonSummaryModalProps) => {
  const [showConfetti, setShowConfetti] = useState(false);
  const hasShareApi = typeof navigator.share === 'function';
  const isShareImageReady = Boolean(standingsImageFiles) && !isRenderingStandingsImage;

  useEffect(() => {
    if (!isOpen) return;

    const id = window.setTimeout(() => setShowConfetti(true), CONFETTI_DELAY_MS);
    return () => window.clearTimeout(id);
  }, [isOpen]);

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

  return (
    <>
      <Modal isOpen={isOpen} onClose={onClose} className={styles.modal} initialFocus={-1} shakeOnOpen>
        {champion && (
          <img
            src={getCrest(champion.team.crest)}
            alt=""
            className={styles.backgroundCrest}
            aria-hidden="true"
          />
        )}

        <div className={styles.contentLayer}>
          <button className={styles.closeButton} onClick={onClose} aria-label="Close">
            ✕
          </button>

          <h2 className={styles.championHeading}>
            Congratulations
            <br />
            <span className={styles.championName}>{champion?.team.name}!</span>
          </h2>

          <p className={styles.championSubheading}>
            <img
              src={competition.logo}
              alt=""
              aria-hidden="true"
              className={styles.competitionLogo}
            />
            <span>
              {competition.name}
              <br />
              Champions {competition.season}!
              <span className={styles.asterisk}>*</span>
            </span>
          </p>
          <p className={styles.predictionParagraph}>*This is only a prediction…</p>

          <div className={styles.scrollableContent}>
            <hr className={styles.divider} />

            {nonRelegationZones.map(({ zone, teams }) => (
              <div key={zone.name} className={styles.section}>
                <div className={zoneLabelStyles[zone.type] ?? styles.sectionLabel}>
                  {zone.label}
                </div>
                <div className={styles.teamList}>
                  {teams.map((s) => (
                    <TeamRow key={s.team.id} standing={s} />
                  ))}
                </div>
              </div>
            ))}

            {relegationZone && (
              <>
                <hr className={styles.divider} />
                <div className={styles.section}>
                  <div className={styles.relegatedLabel}>{relegationZone.zone.label}</div>
                  <div className={styles.teamList}>
                    {relegationZone.teams.map((s) => (
                      <TeamRow key={s.team.id} standing={s} />
                    ))}
                  </div>
                </div>
              </>
            )}
          </div>

          {hasShareApi && (
            <div className={styles.shareButtonWrapper}>
              <Button variant="success" onClick={handleShare} disabled={!isShareImageReady}>
                <ShareIcon size={14} />
                Share your Predictions
              </Button>
            </div>
          )}
        </div>
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
