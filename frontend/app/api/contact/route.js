import { NextResponse } from 'next/server';

const maxBodyBytes = 10 * 1024;

async function readBody(request) {
  const contentLength = Number(request.headers.get('content-length'));
  if (Number.isFinite(contentLength) && contentLength > maxBodyBytes) return null;
  if (!request.body) return '';

  const reader = request.body.getReader();
  const decoder = new TextDecoder();
  let body = '';
  let bytesRead = 0;

  while (true) {
    const { done, value } = await reader.read();
    if (done) return body + decoder.decode();

    bytesRead += value.byteLength;
    if (bytesRead > maxBodyBytes) {
      await reader.cancel();
      return null;
    }

    body += decoder.decode(value, { stream: true });
  }
}

export async function POST(request) {
  const apiUrl = process.env.API_URL || 'http://localhost:4000';
  const body = await readBody(request);
  if (body === null) {
    return NextResponse.json(
      { error: { code: 'PAYLOAD_TOO_LARGE', message: 'Request body exceeds 10 KB.' } },
      { status: 413 },
    );
  }

  try {
    const response = await fetch(`${apiUrl}/api/contact`, {
      method: 'POST',
      headers: { 'content-type': request.headers.get('content-type') || 'application/json' },
      body,
      cache: 'no-store',
    });
    const responseBody = await response.json();

    return NextResponse.json(responseBody, { status: response.status });
  } catch {
    return NextResponse.json(
      { error: { code: 'API_UNAVAILABLE', message: 'The contact service is unavailable.' } },
      { status: 502 },
    );
  }
}
