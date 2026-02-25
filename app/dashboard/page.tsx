'use client';

import { useEffect, useState } from 'react';
import { PageShell } from '@/components/PageShell';
import { LogoutButton } from '@/components/LogoutButton';

type Metrics = {
  totalLeads: number;
  qualifiedLeads: number;
  wonThisMonth: number;
  tasksDueToday: number;
};

const empty: Metrics = { totalLeads: 0, qualifiedLeads: 0, wonThisMonth: 0, tasksDueToday: 0 };

export default function DashboardPage() {
  const [metrics, setMetrics] = useState<Metrics>(empty);

  useEffect(() => {
    fetch('/api/dashboard')
      .then((response) => response.json())
      .then((data) => setMetrics(data));
  }, []);

  return (
    <PageShell title="Dashboard">
      <div className="mb-4 flex justify-end">
        <LogoutButton />
      </div>
      <div className="grid grid-cols-2 gap-3">
        <article className="card">
          <p className="text-xs text-slate-500">Total leads</p>
          <p className="text-2xl font-bold">{metrics.totalLeads}</p>
        </article>
        <article className="card">
          <p className="text-xs text-slate-500">Qualified leads</p>
          <p className="text-2xl font-bold">{metrics.qualifiedLeads}</p>
        </article>
        <article className="card">
          <p className="text-xs text-slate-500">Won this month</p>
          <p className="text-2xl font-bold">{metrics.wonThisMonth}</p>
        </article>
        <article className="card">
          <p className="text-xs text-slate-500">Tasks due today</p>
          <p className="text-2xl font-bold">{metrics.tasksDueToday}</p>
        </article>
      </div>
      <section className="card mt-4">
        <h2 className="mb-2 text-lg font-semibold">Classroom tip</h2>
        <p className="text-sm text-slate-600">
          Start each day by clearing Tasks Due Today, then move every lead to the next stage with one tap.
        </p>
      </section>
    </PageShell>
  );
}
