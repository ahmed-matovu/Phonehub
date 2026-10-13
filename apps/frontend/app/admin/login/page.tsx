'use client';

import { FormEvent, useState } from 'react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';

export default function AdminLoginPage() {
  const router = useRouter();
  const [password, setPassword] = useState('');
  const [message, setMessage] = useState('');
  const [submitting, setSubmitting] = useState(false);

  async function signIn(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setSubmitting(true);
    setMessage('');
    try {
      const response = await fetch('/api/admin/session', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ password }),
      });
      const result = await response.json();
      if (!response.ok) throw new Error(result.error ?? 'Unable to sign in');
      router.replace('/admin');
    } catch (error) {
      setMessage(error instanceof Error ? error.message : 'Unable to sign in');
      setSubmitting(false);
    }
  }

  return (
    <main className="admin-login-page">
      <a className="brand-wrap" href="/">
        <Image className="brand-logo" src="/electronic-hub-logo.svg" alt="" width={40} height={40} />
        <span className="brand-name">Electronic Hub</span>
      </a>
      <section className="admin-login-panel">
        <p className="eyebrow">Private access</p>
        <h1>Admin sign in</h1>
        <p>Sign in to manage the store catalog.</p>
        <form onSubmit={signIn}>
          <label htmlFor="admin-password">Admin password</label>
          <input id="admin-password" type="password" autoComplete="current-password" required maxLength={256} value={password} onChange={(event) => setPassword(event.target.value)} />
          {message && <p className="admin-login-error" role="alert">{message}</p>}
          <button className="button primary" type="submit" disabled={submitting}>{submitting ? 'Signing in…' : 'Sign in'}</button>
        </form>
      </section>
    </main>
  );
}