import featuresJson from './features.json';

interface Features {
  /**
   * Model-generated ("AI") predictions. When false, the UI hides the action
   * that fills fixtures from model predictions, and the predictions script
   * and deploy workflow skip regeneration.
   */
  aiPredictions: boolean;
  /**
   * Default state of "genuine" mode, which removes the teams listed in
   * `src/data/genuine.ts` from the season. Users can toggle it in the Point
   * Deductions modal; the non-default state persists as `?genuine=<bool>`.
   */
  genuine: boolean;
  /**
   * The "Run In" and "Relegation" pages. When false, their tabs are hidden
   * and their routes redirect to the competition's standings page.
   */
  runInAndRelegation: boolean;
  /**
   * Points-threshold labels on zone dividers (e.g. "Champions ≥ 103 pts").
   * When false, thresholds are not computed and no labels are shown.
   */
  zoneThresholdLabels: boolean;
}

/**
 * Feature flags, sourced from `src/data/features.json` so that the app,
 * Node/Python scripts and GitHub workflows share a single definition.
 */
export const features: Features = featuresJson;
