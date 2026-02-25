'use client';

import { FormEvent, useState } from 'react';
import { useRouter } from 'next/navigation';

export default function LoginPage() {
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  async function onSubmit(event: FormEvent) {
    event.preventDefault();
    setLoading(true);
    setError('');

    const response = await fetch('/api/auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ password }),
    });

    if (!response.ok) {
      setError('Wrong password. Ask your instructor for the class password.');
      setLoading(false);
      return;
    }

    router.push('/dashboard');
    router.refresh();
  }

  return (
    <main className="mx-auto flex min-h-screen max-w-md items-center px-4">
      <section className="card w-full">
        <h1 className="mb-2 text-2xl font-bold">CRM Lite Login</h1>
        <p className="mb-4 text-sm text-slate-600">Use the shared classroom password to enter.</p>
        <form onSubmit={onSubmit} className="space-y-3">
          <input
            type="password"
            className="input"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Class password"
            required
          />
          {error ? <p className="text-sm text-rose-600">{error}</p> : null}
          <button className="button-primary w-full" disabled={loading}>
            {loading ? 'Checking...' : 'Login'}
          </button>
        </form>
      </section>
    </main>
  );
}
