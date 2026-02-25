'use client';

import { useEffect, useState } from 'react';
import { AddButton } from '@/components/AddButton';
import { PageShell } from '@/components/PageShell';
import type { Contact, Lead, Task, TaskStatus } from '@/lib/types';

export default function TasksPage() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [contacts, setContacts] = useState<Contact[]>([]);
  const [leads, setLeads] = useState<Lead[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [draft, setDraft] = useState({ title: '', due_date: '', contact_id: '', lead_id: '' });

  async function load() {
    const [tasksRes, contactsRes, leadsRes] = await Promise.all([
      fetch('/api/tasks'),
      fetch('/api/contacts'),
      fetch('/api/leads'),
    ]);
    setTasks(await tasksRes.json());
    setContacts(await contactsRes.json());
    setLeads(await leadsRes.json());
  }

  useEffect(() => {
    load();
  }, []);

  async function createTask() {
    await fetch('/api/tasks', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        ...draft,
        status: 'todo',
        contact_id: draft.contact_id ? Number(draft.contact_id) : null,
        lead_id: draft.lead_id ? Number(draft.lead_id) : null,
      }),
    });
    setDraft({ title: '', due_date: '', contact_id: '', lead_id: '' });
    setShowForm(false);
    load();
  }

  async function toggle(task: Task, status: TaskStatus) {
    await fetch('/api/tasks', {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ ...task, status }),
    });
    load();
  }

  async function remove(id: number) {
    await fetch(`/api/tasks?id=${id}`, { method: 'DELETE' });
    load();
  }

  return (
    <PageShell title="Tasks" cta={<AddButton onClick={() => setShowForm((v) => !v)} label="Add task" />}>
      {showForm ? (
        <section className="card mb-4 space-y-3">
          <input className="input" placeholder="Task title" value={draft.title} onChange={(e) => setDraft((d) => ({ ...d, title: e.target.value }))} />
          <input type="date" className="input" value={draft.due_date} onChange={(e) => setDraft((d) => ({ ...d, due_date: e.target.value }))} />
          <details>
            <summary className="cursor-pointer text-sm text-slate-500">Link to contact or lead (optional)</summary>
            <div className="mt-2 space-y-2">
              <select className="input" value={draft.contact_id} onChange={(e) => setDraft((d) => ({ ...d, contact_id: e.target.value }))}>
                <option value="">No contact</option>
                {contacts.map((contact) => <option key={contact.id} value={contact.id}>{contact.name}</option>)}
              </select>
              <select className="input" value={draft.lead_id} onChange={(e) => setDraft((d) => ({ ...d, lead_id: e.target.value }))}>
                <option value="">No lead</option>
                {leads.map((lead) => <option key={lead.id} value={lead.id}>{lead.title}</option>)}
              </select>
            </div>
          </details>
          <button className="button-primary w-full" onClick={createTask} disabled={!draft.title}>Save task</button>
        </section>
      ) : null}

      <div className="space-y-3">
        {tasks.map((task) => (
          <article key={task.id} className="card">
            <div className="flex items-start justify-between gap-2">
              <div>
                <p className="font-semibold">{task.title}</p>
                <p className="text-sm text-slate-500">Due: {task.due_date ?? 'No due date'}</p>
              </div>
              <button className="button-muted" onClick={() => remove(task.id)}>Delete</button>
            </div>
            <div className="mt-3 flex gap-2">
              <button className={`button ${task.status === 'todo' ? 'bg-amber-100 text-amber-800' : 'bg-slate-100 text-slate-500'}`} onClick={() => toggle(task, 'todo')}>Todo</button>
              <button className={`button ${task.status === 'done' ? 'bg-emerald-100 text-emerald-800' : 'bg-slate-100 text-slate-500'}`} onClick={() => toggle(task, 'done')}>Done</button>
            </div>
          </article>
        ))}
      </div>
    </PageShell>
  );
}
