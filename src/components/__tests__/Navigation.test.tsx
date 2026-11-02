import { describe, expect, it } from 'vitest';
import { render, screen, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { createMemoryRouter, RouterProvider } from 'react-router-dom';
import { ThemeProvider } from '@/components/common/ThemeProvider';
import { AppLayout } from '@/components/navigation/AppLayout';
import { NAV_ITEMS } from '@/data/navigation';

function renderLayout(path = '/') {
  const router = createMemoryRouter(
    [{ path: '/', element: <AppLayout />, children: [{ index: true, element: <p>Home page</p> }, { path: 'planner', element: <p>Planner page</p> }, { path: '*', element: <p>Other page</p> }] }],
    { initialEntries: [path] },
  );
  render(<ThemeProvider><RouterProvider router={router} /></ThemeProvider>);
}

describe('navigation', () => {
  it('lists all 13 sections in the desktop sidebar', () => {
    renderLayout();
    const nav = screen.getAllByRole('navigation', { name: 'Main navigation' })[0];
    for (const item of NAV_ITEMS) expect(within(nav).getByRole('link', { name: item.label })).toBeInTheDocument();
  });
  it('shows a mobile bottom bar that is hidden on large screens', () => {
    renderLayout();
    const bar = screen.getByRole('navigation', { name: 'Quick navigation' });
    expect(bar).toHaveClass('lg:hidden');
    expect(within(bar).getByRole('link', { name: /Plan/ })).toBeInTheDocument();
  });
  it('opens the mobile menu and navigates', async () => {
    renderLayout();
    await userEvent.click(screen.getByRole('button', { name: 'Open navigation menu' }));
    const dialog = await screen.findByRole('dialog');
    await userEvent.click(within(dialog).getByRole('link', { name: 'Dive Planner' }));
    expect(await screen.findByText('Planner page')).toBeInTheDocument();
    expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
  });
  it('marks the active route', () => {
    renderLayout('/planner');
    const nav = screen.getAllByRole('navigation', { name: 'Main navigation' })[0];
    expect(within(nav).getByRole('link', { name: 'Dive Planner' })).toHaveAttribute('aria-current', 'page');
  });
  it('offers a skip link to main content', () => {
    renderLayout();
    expect(screen.getByRole('link', { name: 'Skip to content' })).toHaveAttribute('href', '#main');
  });
});
