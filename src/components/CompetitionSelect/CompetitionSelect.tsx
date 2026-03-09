import Select, { type StylesConfig, type SingleValue } from 'react-select';
import type { CompetitionConfig } from '../../competitions';
import {
  colorBgSurface,
  colorBgSurfaceHover,
  colorBgRowAlt,
  colorBorder,
  colorBorderMedium,
  colorFocus,
  colorFocusRing,
  colorTextPrimary,
  colorTextSecondary,
  fontFamily,
  shadowMd,
} from '../../theme.css';
import * as styles from './CompetitionSelect.css';

interface CompetitionOption {
  value: string;
  label: string;
  logo: string;
}

const OptionLabel = ({ logo, label }: { logo: string; label: string }) => (
  <div className={styles.optionContent}>
    <img src={logo} alt="" className={styles.optionLogo} />
    <span>{label}</span>
  </div>
);

const toOption = (c: CompetitionConfig): CompetitionOption => ({
  value: c.slug,
  label: c.name,
  logo: c.logo,
});

const selectStyles: StylesConfig<CompetitionOption, false> = {
  control: (base, state) => ({
    ...base,
    fontFamily,
    fontSize: 15,
    fontWeight: 500,
    backgroundColor: colorBgSurface,
    borderColor: state.isFocused ? colorFocus : colorBorder,
    borderRadius: 6,
    boxShadow: state.isFocused ? `0 0 0 2px ${colorFocusRing}` : 'none',
    cursor: 'pointer',
    minHeight: 38,
    '&:hover': {
      borderColor: colorBorderMedium,
    },
  }),
  singleValue: (base) => ({
    ...base,
    color: colorTextPrimary,
  }),
  option: (base, state) => ({
    ...base,
    display: 'flex',
    alignItems: 'center',
    fontSize: 15,
    fontWeight: 500,
    color: colorTextPrimary,
    backgroundColor: state.isSelected
      ? colorBgRowAlt
      : state.isFocused
        ? colorBgSurfaceHover
        : colorBgSurface,
    cursor: 'pointer',
    '&:active': {
      backgroundColor: colorBgRowAlt,
    },
  }),
  menu: (base) => ({
    ...base,
    borderRadius: 6,
    border: `1px solid ${colorBorder}`,
    boxShadow: shadowMd,
    overflow: 'hidden',
    zIndex: 10,
    backgroundColor: colorBgSurface,
  }),
  menuList: (base) => ({
    ...base,
    padding: 0,
  }),
  indicatorSeparator: () => ({
    display: 'none',
  }),
  dropdownIndicator: (base) => ({
    ...base,
    color: colorTextSecondary,
    '&:hover': {
      color: colorTextPrimary,
    },
  }),
};

interface CompetitionSelectProps {
  competitions: CompetitionConfig[];
  value: string;
  onChange: (slug: string) => void;
}

export const CompetitionSelect = ({ competitions, value, onChange }: CompetitionSelectProps) => {
  const options = competitions.map(toOption);
  const selected = options.find((o) => o.value === value) ?? null;

  const handleChange = (option: SingleValue<CompetitionOption>) => {
    if (option) {
      onChange(option.value);
    }
  };

  return (
    <Select<CompetitionOption, false>
      options={options}
      value={selected}
      onChange={handleChange}
      styles={selectStyles}
      formatOptionLabel={(option) => <OptionLabel logo={option.logo} label={option.label} />}
      isSearchable={false}
      aria-label="Select competition"
    />
  );
};
