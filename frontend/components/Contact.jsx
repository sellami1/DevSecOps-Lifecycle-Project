'use client';

import { useState } from 'react';

export default function Contact() {
  const [status, setStatus] = useState({ type: 'idle', message: '' });

  async function submitContact(event) {
    event.preventDefault();
    const form = event.currentTarget;
    setStatus({ type: 'sending', message: 'Sending your message…' });

    try {
      const response = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify(Object.fromEntries(new FormData(event.currentTarget))),
      });
      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error?.message || 'Unable to send your message.');
      }

      form.reset();
      setStatus({ type: 'success', message: 'Thanks — your message was sent.' });
    } catch (error) {
      setStatus({ type: 'error', message: error.message });
    }
  }

  return (
    <section className="section section-grid reveal" id="contact">
      <div className="section-label"><span className="section-number">05</span><h2>Contact</h2></div>
      <div className="section-body contact-panel">
        <div>
          <span className="mono">OPEN TO CONNECTIONS</span>
          <h3>Let&apos;s build secure delivery workflows.</h3>
          <p>Interested in DevOps, cloud-native platforms, and practical security automation.</p>
        </div>
        <form className="contact-form" onSubmit={submitContact}>
          <label>
            Name
            <input name="name" autoComplete="name" required maxLength={100} />
          </label>
          <label>
            Email
            <input name="email" type="email" autoComplete="email" required maxLength={254} />
          </label>
          <label>
            Message
            <textarea name="message" required minLength={10} maxLength={5000} rows={5} />
          </label>
          <button className="contact-link" type="submit" disabled={status.type === 'sending'}>
            {status.type === 'sending' ? 'Sending…' : 'Send message'} <span aria-hidden="true">↗</span>
          </button>
          <p aria-live="polite" role="status" data-status={status.type}>
            {status.message}
          </p>
        </form>
      </div>
    </section>
  );
}
