import { render, screen } from '@testing-library/react';
import HomePage from '../pages/index';

describe('HomePage', () => {
  it('visar svenska rubriker', () => {
    render(<HomePage />);
    expect(screen.getByText('Svensk SEO-plattform')).toBeInTheDocument();
    expect(screen.getByText('Projektöversikt')).toBeInTheDocument();
  });
});
