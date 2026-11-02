import { describe, expect, it } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MemoryRouter } from 'react-router-dom';
import DiveReadiness from '@/pages/DiveReadiness';
import { useAppStore } from '@/store/useAppStore';

describe('dive readiness checklist UI', () => {
  it('ticks items, updates progress and persists to the store', async () => {
    useAppStore.getState().resetChecklist();
    render(<MemoryRouter><DiveReadiness /></MemoryRouter>);
    expect(screen.getByText('Checklist not started')).toBeInTheDocument();
    await userEvent.click(screen.getByLabelText(/Feeling physically fit/));
    expect(useAppStore.getState().checklist['p-fit']).toBe(true);
    expect(screen.getAllByText('Critical checks outstanding').length).toBeGreaterThan(0);
  });
});
