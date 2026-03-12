import { create } from 'zustand';
import type { PointDeduction, PredictionsStore } from '../types';

export type PersistenceMode = 'full' | 'storageOnly';
export type CompetitionTabId = 'standings' | 'fixtures';

interface CompetitionSessionData {
  predictions: PredictionsStore;
  deductions: PointDeduction[];
  deductionsCustomised: boolean;
  defaultDeductions: PointDeduction[];
  activeTab: CompetitionTabId;
  navigateToMatchId: number | null;
  deductionsModalOpen: boolean;
  summaryDismissed: boolean;
}

interface CompetitionSessionStoreState {
  sessions: Record<string, CompetitionSessionData>;
  initializeSession: (
    slug: string,
    initial: Pick<
      CompetitionSessionData,
      'predictions' | 'deductions' | 'deductionsCustomised' | 'defaultDeductions'
    >,
  ) => void;
  setPrediction: (slug: string, matchId: number, homeGoals: number, awayGoals: number) => void;
  removePrediction: (slug: string, matchId: number) => void;
  resetAllPredictions: (slug: string) => void;
  fillFromModel: (
    slug: string,
    modelPredictions: Record<string, { homeGoals: number; awayGoals: number }>,
  ) => void;
  updateDeduction: (slug: string, teamId: number, amount: number) => void;
  addDeduction: (slug: string, teamId: number, amount: number) => void;
  removeDeduction: (slug: string, teamId: number) => void;
  resetDeductions: (slug: string) => void;
  setActiveTab: (slug: string, tabId: CompetitionTabId) => void;
  setNavigateToMatchId: (slug: string, matchId: number | null) => void;
  setDeductionsModalOpen: (slug: string, isOpen: boolean) => void;
  dismissSummary: (slug: string) => void;
  resetSummaryDismissed: (slug: string) => void;
}

const nowIso = (): string => new Date().toISOString();

const emptyPredictions = (): PredictionsStore => ({
  predictions: {},
  lastModified: nowIso(),
});

const withSession = (
  sessions: Record<string, CompetitionSessionData>,
  slug: string,
  update: (session: CompetitionSessionData) => CompetitionSessionData,
): Record<string, CompetitionSessionData> => {
  const session = sessions[slug];
  if (!session) {
    return sessions;
  }

  return {
    ...sessions,
    [slug]: update(session),
  };
};

export const useCompetitionSessionStore = create<CompetitionSessionStoreState>((set) => ({
  sessions: {},

  initializeSession: (slug, initial) => {
    set((state) => {
      const existing = state.sessions[slug];
      if (existing) {
        return {
          sessions: {
            ...state.sessions,
            [slug]: {
              ...existing,
              defaultDeductions: initial.defaultDeductions,
            },
          },
        };
      }

      return {
        sessions: {
          ...state.sessions,
          [slug]: {
            predictions: initial.predictions,
            deductions: initial.deductions,
            deductionsCustomised: initial.deductionsCustomised,
            defaultDeductions: initial.defaultDeductions,
            activeTab: 'standings',
            navigateToMatchId: null,
            deductionsModalOpen: false,
            summaryDismissed: false,
          },
        },
      };
    });
  },

  setPrediction: (slug, matchId, homeGoals, awayGoals) => {
    set((state) => ({
      sessions: withSession(state.sessions, slug, (session) => ({
        ...session,
        predictions: {
          predictions: {
            ...session.predictions.predictions,
            [String(matchId)]: { homeGoals, awayGoals },
          },
          lastModified: nowIso(),
        },
      })),
    }));
  },

  removePrediction: (slug, matchId) => {
    set((state) => ({
      sessions: withSession(state.sessions, slug, (session) => {
        const updatedPredictions = { ...session.predictions.predictions };
        delete updatedPredictions[String(matchId)];

        return {
          ...session,
          predictions: {
            predictions: updatedPredictions,
            lastModified: nowIso(),
          },
        };
      }),
    }));
  },

  resetAllPredictions: (slug) => {
    set((state) => ({
      sessions: withSession(state.sessions, slug, (session) => ({
        ...session,
        predictions: emptyPredictions(),
      })),
    }));
  },

  fillFromModel: (slug, modelPredictions) => {
    set((state) => ({
      sessions: withSession(state.sessions, slug, (session) => ({
        ...session,
        predictions: {
          predictions: { ...modelPredictions },
          lastModified: nowIso(),
        },
      })),
    }));
  },

  updateDeduction: (slug, teamId, amount) => {
    set((state) => ({
      sessions: withSession(state.sessions, slug, (session) => ({
        ...session,
        deductionsCustomised: true,
        deductions: session.deductions.map((deduction) =>
          deduction.teamId === teamId ? { ...deduction, amount } : deduction,
        ),
      })),
    }));
  },

  addDeduction: (slug, teamId, amount) => {
    set((state) => ({
      sessions: withSession(state.sessions, slug, (session) => ({
        ...session,
        deductionsCustomised: true,
        deductions: [...session.deductions, { teamId, amount }],
      })),
    }));
  },

  removeDeduction: (slug, teamId) => {
    set((state) => ({
      sessions: withSession(state.sessions, slug, (session) => ({
        ...session,
        deductionsCustomised: true,
        deductions: session.deductions.filter((deduction) => deduction.teamId !== teamId),
      })),
    }));
  },

  resetDeductions: (slug) => {
    set((state) => ({
      sessions: withSession(state.sessions, slug, (session) => ({
        ...session,
        deductionsCustomised: false,
        deductions: session.defaultDeductions,
      })),
    }));
  },

  setActiveTab: (slug, tabId) => {
    set((state) => ({
      sessions: withSession(state.sessions, slug, (session) => ({
        ...session,
        activeTab: tabId,
      })),
    }));
  },

  setNavigateToMatchId: (slug, matchId) => {
    set((state) => ({
      sessions: withSession(state.sessions, slug, (session) => ({
        ...session,
        navigateToMatchId: matchId,
      })),
    }));
  },

  setDeductionsModalOpen: (slug, isOpen) => {
    set((state) => ({
      sessions: withSession(state.sessions, slug, (session) => ({
        ...session,
        deductionsModalOpen: isOpen,
      })),
    }));
  },

  dismissSummary: (slug) => {
    set((state) => ({
      sessions: withSession(state.sessions, slug, (session) => ({
        ...session,
        summaryDismissed: true,
      })),
    }));
  },

  resetSummaryDismissed: (slug) => {
    set((state) => ({
      sessions: withSession(state.sessions, slug, (session) => ({
        ...session,
        summaryDismissed: false,
      })),
    }));
  },
}));

export const createDefaultSession = (
  defaultDeductions: PointDeduction[],
): CompetitionSessionData => ({
  predictions: emptyPredictions(),
  deductions: defaultDeductions,
  deductionsCustomised: false,
  defaultDeductions,
  activeTab: 'standings',
  navigateToMatchId: null,
  deductionsModalOpen: false,
  summaryDismissed: false,
});

export type CompetitionSessionState = CompetitionSessionData;
