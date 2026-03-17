import * as styles from './ColorPalettePage.css';

const COLOR_STEPS = [50, 100, 200, 300, 400, 500, 600, 700, 800, 900, 925, 950, 975] as const;

const COLOR_HUES = [
  'red',
  'orange',
  'amber',
  'yellow',
  'lime',
  'green',
  'emerald',
  'teal',
  'cyan',
  'sky',
  'blue',
  'indigo',
  'violet',
  'purple',
  'fuchsia',
  'pink',
  'rose',
  'slate',
  'gray',
  'zinc',
  'neutral',
  'stone',
  'mauve',
  'olive',
  'mist',
  'taupe',
] as const;

const contrastThreshold = 600;

export const ColorPalettePage = () => {
  return (
    <div className={styles.page}>
      <h1 className={styles.heading}>Tailwind Color Palette</h1>

      <div
        className={styles.grid}
        style={{
          gridTemplateColumns: `auto repeat(${COLOR_STEPS.length}, 1fr)`,
        }}
      >
        <div />
        {COLOR_STEPS.map((step) => (
          <div key={step} className={styles.headerCell}>
            {step}
          </div>
        ))}

        {COLOR_HUES.map((hue) => (
          <>
            <div key={`${hue}-label`} className={styles.hueLabel}>
              {hue}
            </div>
            {COLOR_STEPS.map((step) => {
              const textColor =
                step >= contrastThreshold
                  ? `var(--color-${hue}-50)`
                  : `var(--color-${hue}-900)`;

              return (
                <div
                  key={`${hue}-${step}`}
                  className={styles.swatch}
                  style={{
                    backgroundColor: `var(--color-${hue}-${step})`,
                  }}
                >
                  <span className={styles.swatchLabel} style={{ color: textColor }}>
                    {step}
                  </span>
                </div>
              );
            })}
          </>
        ))}
      </div>
    </div>
  );
};
