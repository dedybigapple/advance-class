import { ReactNode } from 'react';
import { BottomNav } from './BottomNav';

export function PageShell({ title, children, cta }: { title: string; children: ReactNode; cta?: ReactNode }) {
  return (
    <main className="mx-auto min-h-screen max-w-3xl px-4 pb-28 pt-4">
      <header className="mb-4 flex items-center justify-between">
        <h1 className="text-2xl font-bold">{title}</h1>
      </header>
      {children}
      {cta ? <div className="fixed bottom-20 right-4 z-30">{cta}</div> : null}
      <BottomNav />
    </main>
  );
}
