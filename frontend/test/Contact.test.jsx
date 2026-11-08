import { cleanup, fireEvent, render, screen, waitFor } from '@testing-library/react';
import { afterEach, describe, expect, it, vi } from 'vitest';
import Contact from '../components/Contact';

afterEach(() => {
  cleanup();
  vi.restoreAllMocks();
});

describe('Contact form', () => {
  it('submits the form to the same-origin API and reports success', async () => {
    const fetchMock = vi.spyOn(globalThis, 'fetch').mockResolvedValue({
      ok: true,
      json: async () => ({ message: 'Contact message received.' }),
    });
    render(<Contact />);

    fireEvent.change(screen.getByLabelText('Name'), { target: { value: 'Ada Lovelace' } });
    fireEvent.change(screen.getByLabelText('Email'), { target: { value: 'ada@example.com' } });
    fireEvent.change(screen.getByLabelText('Message'), {
      target: { value: 'Please contact me about secure delivery.' },
    });
    fireEvent.click(screen.getByRole('button', { name: /send message/i }));

    await waitFor(() => expect(screen.getByRole('status')).toHaveTextContent('your message was sent'));
    expect(fetchMock).toHaveBeenCalledWith('/api/contact', expect.objectContaining({
      method: 'POST',
      headers: { 'content-type': 'application/json' },
    }));
    expect(JSON.parse(fetchMock.mock.calls[0][1].body)).toEqual({
      name: 'Ada Lovelace',
      email: 'ada@example.com',
      message: 'Please contact me about secure delivery.',
    });
  });

  it('shows API validation errors instead of claiming success', async () => {
    vi.spyOn(globalThis, 'fetch').mockResolvedValue({
      ok: false,
      json: async () => ({ error: { message: 'Invalid contact submission.' } }),
    });
    render(<Contact />);

    fireEvent.change(screen.getByLabelText('Name'), { target: { value: 'Ada Lovelace' } });
    fireEvent.change(screen.getByLabelText('Email'), { target: { value: 'ada@example.com' } });
    fireEvent.change(screen.getByLabelText('Message'), {
      target: { value: 'Please contact me about secure delivery.' },
    });
    fireEvent.click(screen.getByRole('button', { name: /send message/i }));

    await waitFor(() => expect(screen.getByRole('status')).toHaveTextContent('Invalid contact submission.'));
    expect(screen.getByRole('status')).toHaveAttribute('data-status', 'error');
  });
});
