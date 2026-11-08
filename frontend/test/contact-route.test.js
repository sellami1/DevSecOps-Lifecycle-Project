import { afterEach, describe, expect, it, vi } from 'vitest';
import { POST } from '../app/api/contact/route';

afterEach(() => {
  vi.restoreAllMocks();
});

describe('contact API proxy', () => {
  it('rejects oversized payloads before forwarding to Express', async () => {
    const fetchMock = vi.spyOn(globalThis, 'fetch');
    const request = new Request('http://localhost/api/contact', {
      method: 'POST',
      headers: { 'content-type': 'application/json' },
      body: 'x'.repeat(10 * 1024 + 1),
    });

    const response = await POST(request);

    expect(response.status).toBe(413);
    expect(await response.json()).toMatchObject({
      error: { code: 'PAYLOAD_TOO_LARGE' },
    });
    expect(fetchMock).not.toHaveBeenCalled();
  });
});
