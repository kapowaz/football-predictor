import Select, { type StylesConfig, type SingleValue } from 'react-select';
import type { CompetitionConfig } from '../../competitions';
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

const themeVar = (v: string) => v;

const selectStyles: StylesConfig<CompetitionOption, false> = {
  control: (base, state) => ({
    ...base,
    fontFamily: themeVar('var(--fontFamily)'),
    fontSize: 15,
    fontWeight: 500,
    backgroundColor: '#ffffff',
    borderColor: state.isFocused ? '#3b82f6' : '#e5e7eb',
    borderRadius: 6,
    boxShadow: state.isFocused ? '0 0 0 2px rgba(59, 130, 246, 0.2)' : 'none',
    cursor: 'pointer',
    minHeight: 38,
    '&:hover': {
      borderColor: '#9ca3af',
    },
  }),
  singleValue: (base) => ({
    ...base,
    color: '#1f2937',
  }),
  option: (base, state) => ({
    ...base,
    display: 'flex',
    alignItems: 'center',
    fontSize: 15,
    fontWeight: 500,
    color: '#1f2937',
    backgroundColor: state.isSelected
      ? '#e5e7eb'
      : state.isFocused
        ? '#f9fafb'
        : '#ffffff',
    cursor: 'pointer',
    '&:active': {
      backgroundColor: '#e5e7eb',
    },
  }),
  menu: (base) => ({
    ...base,
    borderRadius: 6,
    border: '1px solid #e5e7eb',
    boxShadow: '0 2px 6px rgba(0, 0, 0, 0.1)',
    overflow: 'hidden',
    zIndex: 10,
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
    color: '#6b7280',
    '&:hover': {
      color: '#1f2937',
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
