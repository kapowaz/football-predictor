import featuresJson from './features.json';

interface Features {
  /**
   * Model-generated ("AI") predictions. When false, the UI hides the action
   * that fills fixtures from model predictions, and the predictions script
   * and deploy workflow skip regeneration.
   */
  aiPredictions: boolean;
}

/**
 * Feature flags, sourced from `src/data/features.json` so that the app,
 * Node/Python scripts and GitHub workflows share a single definition.
 */
export const features: Features = featuresJson;
