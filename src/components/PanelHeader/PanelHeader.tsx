import type { ReactNode } from 'react';
import { AbstractText } from '@kapowaz/components';
import * as styles from './PanelHeader.css';

export interface PanelHeaderProps {
  /** The heading text to display. */
  title: string;
  /** Optional content rendered on the right side of the header. */
  children?: ReactNode;
}

export const PanelHeader = ({ title, children }: PanelHeaderProps) => (
  <div className={styles.panelHeader}>
    <AbstractText
      tagName="h2"
      className={styles.panelTitle}
      fontSize="md"
      fontWeight="semibold"
    >
      {title}
    </AbstractText>
    {children}
  </div>
);
