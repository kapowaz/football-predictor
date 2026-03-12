import type { ComponentProps, RefObject } from 'react';
import { CompetitionHeader } from '../CompetitionHeader';
import { TabBar } from '../TabBar';
import { StandingsTable } from '../StandingsTable/StandingsTable';
import { Button } from '../Button';
import { FixtureList } from '../FixtureList/FixtureList';
import { BrainIcon, ImageDownIcon, TrendingDownIcon } from '../icons';
import * as styles from './CompetitionPanels.css.ts';

type CompetitionHeaderProps = ComponentProps<typeof CompetitionHeader>;
type TabBarProps = ComponentProps<typeof TabBar>;
type StandingsTableProps = ComponentProps<typeof StandingsTable>;
type FixtureListProps = ComponentProps<typeof FixtureList>;

interface CompetitionPanelsProps {
  /** Page wrapper ref used for page-level animations. */
  pageContentRef: RefObject<HTMLDivElement | null>;
  /** Props passed through to the page header. */
  headerProps: CompetitionHeaderProps;
  /** Props passed through to the tab bar. */
  tabs: TabBarProps['tabs'];
  /** Currently active tab id. */
  activeTab: TabBarProps['activeTab'];
  /** Called when the selected tab changes. */
  onTabChange: TabBarProps['onTabChange'];
  /** Standings rows for the table. */
  standings: StandingsTableProps['standings'];
  /** Deduction markers keyed by team for table badges. */
  deductionMarkers: StandingsTableProps['deductionMarkers'];
  /** Competition promotion/relegation zones. */
  zones: StandingsTableProps['zones'];
  /** Deduction note labels and reasons shown in header. */
  deductionNotes: Array<{ label: string; reason: string }>;
  /** Called when clicking a standings prediction cell. */
  onPredictionClick: StandingsTableProps['onPredictionClick'];
  /** Downloads the generated standings image. */
  onDownloadStandingsImage: () => void;
  /** True while standings image generation is in progress. */
  isRenderingStandingsImage: boolean;
  /** Whether a standings image file currently exists. */
  hasStandingsImage: boolean;
  /** Opens the deductions modal. */
  onOpenDeductionsModal: () => void;
  /** Fixture list data and handlers. */
  fixtureListProps: FixtureListProps;
  /** Number of predicted fixtures currently set. */
  predictedCount: number;
  /** Whether all scheduled fixtures are predicted. */
  allScheduledPredicted: boolean;
  /** True when AI model predictions are available for this competition. */
  hasModelPredictions: boolean;
  /** Fills predictions from model output. */
  onFillFromModel: () => void;
  /** Clears all user predictions. */
  onResetPredictions: () => void;
}

export const CompetitionPanels = ({
  pageContentRef,
  headerProps,
  tabs,
  activeTab,
  onTabChange,
  standings,
  deductionMarkers,
  zones,
  deductionNotes,
  onPredictionClick,
  onDownloadStandingsImage,
  isRenderingStandingsImage,
  hasStandingsImage,
  onOpenDeductionsModal,
  fixtureListProps,
  predictedCount,
  allScheduledPredicted,
  hasModelPredictions,
  onFillFromModel,
  onResetPredictions,
}: CompetitionPanelsProps) => {
  return (
    <div ref={pageContentRef} className={styles.pageContent}>
      <CompetitionHeader {...headerProps} />

      <TabBar tabs={tabs} activeTab={activeTab} onTabChange={onTabChange} />

      <main className={styles.main}>
        <div
          className={`${styles.panel} ${activeTab !== 'standings' ? styles.hiddenOnMobile : ''}`}
        >
          <div className={styles.panelHeaderWithNotes}>
            <h2 className={styles.panelTitle}>Standings</h2>
            <div className={styles.panelHeaderDeductions}>
              {deductionNotes.length > 0 && (
                <div className={styles.deductionNotes}>
                  {deductionNotes.map((note) => (
                    <span
                      key={note.label}
                      className={styles.deductionNote}
                      title={note.reason || undefined}
                    >
                      {note.label}
                    </span>
                  ))}
                </div>
              )}
              <div className={styles.panelHeaderDeductionsButtons}>
                <Button
                  variant="success"
                  onClick={onDownloadStandingsImage}
                  disabled={!hasStandingsImage || isRenderingStandingsImage}
                >
                  <ImageDownIcon />
                  Download
                </Button>
                <Button variant="danger" onClick={onOpenDeductionsModal}>
                  <TrendingDownIcon size={14} className={styles.deductionsButtonIcon} />
                  Deductions
                </Button>
              </div>
            </div>
          </div>
          <StandingsTable
            standings={standings}
            deductionMarkers={deductionMarkers}
            zones={zones}
            onPredictionClick={onPredictionClick}
          />
        </div>

        <div
          className={`${styles.panelGuttered} ${activeTab !== 'fixtures' ? styles.hiddenOnMobile : ''}`}
        >
          <div className={styles.panelHeader}>
            <h2 className={styles.panelTitle}>Fixtures</h2>
            <div className={styles.panelHeaderActions}>
              {hasModelPredictions && !allScheduledPredicted && (
                <Button variant="success" onClick={onFillFromModel}>
                  <BrainIcon />
                  AI Predictions
                </Button>
              )}
              {predictedCount > 0 && (
                <Button variant="danger" onClick={onResetPredictions}>
                  Reset Predictions
                </Button>
              )}
            </div>
          </div>
          <FixtureList {...fixtureListProps} />
        </div>
      </main>
    </div>
  );
};
