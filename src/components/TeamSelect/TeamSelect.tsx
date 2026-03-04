import Select, { type StylesConfig, type SingleValue } from 'react-select';
import type { Team } from '../../types';
import { getCrest } from '../../assets/crests';
import * as styles from './TeamSelect.css';

interface TeamOption {
  value: number;
  label: string;
  crest: string;
}

const OptionLabel = ({ crest, label }: { crest: string; label: string }) => (
  <div className={styles.optionContent}>
    {crest && <img src={crest} alt="" className={styles.optionCrest} />}
    <span>{label}</span>
  </div>
);

const toOption = (t: Team): TeamOption => ({
  value: t.id,
  label: t.name,
  crest: getCrest(t.crest),
});

const selectStyles: StylesConfig<TeamOption, false> = {
  control: (base, state) => ({
    ...base,
    fontSize: 14,
    fontWeight: 500,
    backgroundColor: '#ffffff',
    borderColor: state.isFocused ? '#3b82f6' : '#e0e0e0',
    borderRadius: 3,
    boxShadow: state.isFocused ? '0 0 0 2px rgba(59, 130, 246, 0.2)' : 'none',
    cursor: 'pointer',
    minHeight: 36,
    '&:hover': {
      borderColor: '#9ca3af',
    },
  }),
  singleValue: (base) => ({
    ...base,
    color: '#1f2937',
  }),
  placeholder: (base) => ({
    ...base,
    color: '#6b7280',
  }),
  option: (base, state) => ({
    ...base,
    display: 'flex',
    alignItems: 'center',
    fontSize: 14,
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
  }),
  menuPortal: (base) => ({
    ...base,
    zIndex: 1100,
  }),
  menuList: (base) => ({
    ...base,
    padding: 0,
    maxHeight: 200,
  }),
  indicatorSeparator: () => ({
    display: 'none',
  }),
  dropdownIndicator: (base) => ({
    ...base,
    padding: '6px',
    color: '#6b7280',
    '&:hover': {
      color: '#1f2937',
    },
  }),
};

interface TeamSelectProps {
  teams: Team[];
  value: number | '';
  onChange: (teamId: number | '') => void;
  placeholder?: string;
}

export const TeamSelect = ({
  teams,
  value,
  onChange,
  placeholder = 'Select a team…',
}: TeamSelectProps) => {
  const options = teams.map(toOption);
  const selected = value !== '' ? (options.find((o) => o.value === value) ?? null) : null;

  const handleChange = (option: SingleValue<TeamOption>) => {
    onChange(option ? option.value : '');
  };

  return (
    <Select<TeamOption, false>
      options={options}
      value={selected}
      onChange={handleChange}
      styles={selectStyles}
      formatOptionLabel={(option) => <OptionLabel crest={option.crest} label={option.label} />}
      placeholder={placeholder}
      isClearable
      menuPortalTarget={document.body}
      aria-label="Select team"
    />
  );
};
