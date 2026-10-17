import { render, screen } from '@testing-library/react';
import { MemoryRouter, Route, Routes, useLocation } from 'react-router-dom';
import { describe, expect, it } from 'vitest';

import { CompetitionRedirect } from './CompetitionRedirect';

const ShowLocation = () => {
  const { pathname, search } = useLocation();
  return <p>{`${pathname}${search}`}</p>;
};

describe('CompetitionRedirect', () => {
  it('redirects to the standings page and keeps the query string', () => {
    render(
      <MemoryRouter
        initialEntries={[
          '/run-in/premier-league/?predictions=abc&genuine=false',
        ]}
      >
        <Routes>
          <Route path="run-in/:slug/" element={<CompetitionRedirect />} />
          <Route path=":slug/" element={<ShowLocation />} />
        </Routes>
      </MemoryRouter>,
    );

    expect(
      screen.getByText('/premier-league/?predictions=abc&genuine=false'),
    ).toBeInTheDocument();
  });
});
