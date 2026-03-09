import Select, { type StylesConfig, type SingleValue } from 'react-select';
import type { Team } from '../../types';
import { getCrest } from '../../assets/crests';
import {
  colorBgSurface,
  colorBgSurfaceHover,
  colorBgRowAlt,
  colorBorder,
  colorBorderInput,
  colorBorderMedium,
  colorFocus,
  colorFocusRing,
  colorTextPrimary,
  colorTextSecondary,
  shadowMd,
} from '../../theme.css';
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
    backgroundColor: colorBgSurface,
    borderColor: state.isFocused ? colorFocus : colorBorderInput,
    borderRadius: 3,
    boxShadow: state.isFocused ? `0 0 0 2px ${colorFocusRing}` : 'none',
    cursor: 'pointer',
    minHeight: 36,
    '&:hover': {
      borderColor: colorBorderMedium,
    },
  }),
  singleValue: (base) => ({
    ...base,
    color: colorTextPrimary,
  }),
  placeholder: (base) => ({
    ...base,
    color: colorTextSecondary,
  }),
  option: (base, state) => ({
    ...base,
    display: 'flex',
    alignItems: 'center',
    fontSize: 14,
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
    backgroundColor: colorBgSurface,
  }),
  menuPortal: (base) => ({
    ...base,
    zIndex: 1,
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
    color: colorTextSecondary,
    '&:hover': {
      color: colorTextPrimary,
    },
  }),
};

interface TeamSelectProps {
  teams: Team[];
  value: number | '';
  onChange: (teamId: number | '') => void;
  placeholder?: string;
  /** Where the dropdown menu should appear relative to the control. */
  menuPlacement?: 'auto' | 'bottom' | 'top';
}

export const TeamSelect = ({
  teams,
  value,
  onChange,
  placeholder = 'Select a team…',
  menuPlacement = 'auto',
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
      menuPlacement={menuPlacement}
      aria-label="Select team"
    />
  );
};
