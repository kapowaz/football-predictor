import { render, cleanup } from '@testing-library/react';
import { afterEach, describe, it, expect } from 'vitest';
import { Sparkline } from './Sparkline';

const Wrapper = ({ children }: { children: React.ReactNode }) => (
  <div style={{ width: 152, height: 48 }}>{children}</div>
);

describe('Sparkline', () => {
  afterEach(cleanup);

  it('renders a responsive container', () => {
    const { container } = render(
      <Wrapper>
        <Sparkline data={[5, 4, 3, 2, 1]} teamCount={20} trend="positive" />
      </Wrapper>,
    );

    expect(container.querySelector('.recharts-responsive-container')).toBeInTheDocument();
  });

  it('renders with a single data point without crashing', () => {
    const { container } = render(
      <Wrapper>
        <Sparkline data={[10]} teamCount={20} trend="stable" />
      </Wrapper>,
    );

    expect(container.querySelector('.recharts-responsive-container')).toBeInTheDocument();
  });

  it('renders with empty data without crashing', () => {
    const { container } = render(
      <Wrapper>
        <Sparkline data={[]} teamCount={20} trend="stable" />
      </Wrapper>,
    );

    expect(container.querySelector('.recharts-responsive-container')).toBeInTheDocument();
  });
});
