import { beforeEach, describe, expect, it } from 'vitest';
import { render, screen, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { createMemoryRouter, RouterProvider } from 'react-router-dom';
import { ThemeProvider } from '@/components/common/ThemeProvider';
import { AppLayout } from '@/components/navigation/AppLayout';
import { TABS, activeTab } from '@/data/navigation';
import { useAppStore } from '@/store/useAppStore';

function renderLayout(path = '/') {
  const router = createMemoryRouter(
    [{ path: '/', element: <AppLayout />, children: [{ index: true, element: <p>Home page</p> }, { path: 'dive', element: <p>Dive page</p> }, { path: 'planner', element: <p>Planner page</p> }, { path: '*', element: <p>Other page</p> }] }],
    { initialEntries: [path] },
  );
  render(<ThemeProvider><RouterProvider router={router} /></ThemeProvider>);
}

describe('navigation', () => {
  beforeEach(() => useAppStore.setState({ onboarded: true }));

  it('uses five primary tabs', () => {
    expect(TABS.map((t) => t.label)).toEqual(['Home', 'Learn', 'Dive', 'Explore', 'Profile']);
  });

  it('maps secondary screens to their tab', () => {
    expect(activeTab('/planner').label).toBe('Dive');
    expect(activeTab('/open-water/ow-03').label).toBe('Learn');
    expect(activeTab('/marine-life').label).toBe('Explore');
    expect(activeTab('/settings').label).toBe('Profile');
    expect(activeTab('/').label).toBe('Home');
  });

  it('shows a mobile tab bar that is hidden on large screens', () => {
    renderLayout();
    const bar = screen.getByRole('navigation', { name: 'Tab bar' });
    expect(bar).toHaveClass('lg:hidden');
    expect(within(bar).getAllByRole('link')).toHaveLength(5);
    expect(within(bar).getByRole('link', { name: 'Home' })).toHaveAttribute('aria-current', 'page');
  });

  it('navigates between tabs', async () => {
    renderLayout();
    const bar = screen.getByRole('navigation', { name: 'Tab bar' });
    await userEvent.click(within(bar).getByRole('link', { name: 'Dive' }));
    expect(await screen.findByText('Dive page')).toBeInTheDocument();
    expect(within(bar).getByRole('link', { name: 'Dive' })).toHaveAttribute('aria-current', 'page');
  });

  it('highlights the parent tab and nests its screens in the sidebar', () => {
    renderLayout('/planner');
    const bar = screen.getByRole('navigation', { name: 'Tab bar' });
    expect(within(bar).getByRole('link', { name: 'Dive' })).toHaveAttribute('aria-current', 'page');
    const sidebar = screen.getByRole('navigation', { name: 'Main navigation' });
    expect(within(sidebar).getByRole('link', { name: 'Dive Planner' })).toHaveAttribute('aria-current', 'page');
    expect(within(sidebar).queryByRole('link', { name: 'Open Water' })).not.toBeInTheDocument();
  });

  it('offers a skip link to main content', () => {
    renderLayout();
    expect(screen.getByRole('link', { name: 'Skip to content' })).toHaveAttribute('href', '#main');
  });
});

describe('first-time experience', () => {
  it('shows onboarding until completed and saves the profile', async () => {
    useAppStore.setState({ onboarded: false });
    renderLayout();
    const dialog = screen.getByRole('dialog', { name: /Welcome to/ });
    await userEvent.click(within(dialog).getByRole('button', { name: 'Continue' }));
    await userEvent.type(await screen.findByLabelText('First name'), 'Alex');
    await userEvent.click(screen.getByRole('radio', { name: 'Advanced Open Water Diver' }));
    await userEvent.click(screen.getByRole('button', { name: 'Continue' }));
    await userEvent.click(await screen.findByRole('button', { name: 'Not Now' }));
    expect(useAppStore.getState().onboarded).toBe(true);
    expect(useAppStore.getState().profile).toMatchObject({ name: 'Alex', certification: 'advanced-open-water' });
    expect(screen.queryByRole('dialog', { name: /Welcome|About|conditions/ })).not.toBeInTheDocument();
  });
});
