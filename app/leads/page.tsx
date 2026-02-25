'use client';

import { useEffect, useState } from 'react';
import { AddButton } from '@/components/AddButton';
import { PageShell } from '@/components/PageShell';
import type { Contact, Lead, LeadStage } from '@/lib/types';

const stages: LeadStage[] = ['New', 'Contacted', 'Qualified', 'Proposal', 'Won', 'Lost'];

export default function LeadsPage() {
  const [leads, setLeads] = useState<Lead[]>([]);
  const [contacts, setContacts] = useState<Contact[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [draft, setDraft] = useState({ title: '', contact_id: '', stage: 'New' as LeadStage });

  async function load() {
    const [leadsRes, contactsRes] = await Promise.all([fetch('/api/leads'), fetch('/api/contacts')]);
    setLeads(await leadsRes.json());
    setContacts(await contactsRes.json());
  }

  useEffect(() => {
    load();
  }, []);

  async function createLead() {
    await fetch('/api/leads', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ ...draft, contact_id: Number(draft.contact_id) }),
    });
    setShowForm(false);
    setDraft({ title: '', contact_id: '', stage: 'New' });
    load();
  }

  async function quickMove(lead: Lead, stage: LeadStage) {
    await fetch('/api/leads', {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ ...lead, stage }),
    });
    load();
  }

  async function deleteLead(id: number) {
    await fetch(`/api/leads?id=${id}`, { method: 'DELETE' });
    load();
  }

  return (
    <PageShell
      title="Leads"
      cta={<AddButton onClick={() => setShowForm((v) => !v)} label="Add lead" />}
    >
      {showForm ? (
        <section className="card mb-4 space-y-3">
          <input
            className="input"
            placeholder="Lead title (required)"
            value={draft.title}
            onChange={(e) => setDraft((d) => ({ ...d, title: e.target.value }))}
          />
          <select
            className="input"
            value={draft.contact_id}
            onChange={(e) => setDraft((d) => ({ ...d, contact_id: e.target.value }))}
          >
            <option value="">Choose contact</option>
            {contacts.map((contact) => (
              <option key={contact.id} value={contact.id}>{contact.name}</option>
            ))}
          </select>
          <button className="button-primary w-full" onClick={createLead} disabled={!draft.title || !draft.contact_id}>
            Save lead
          </button>
        </section>
      ) : null}

      <div className="space-y-3">
        {leads.map((lead) => (
          <article key={lead.id} className="card">
            <div className="mb-2 flex items-center justify-between gap-2">
              <div>
                <p className="font-semibold">{lead.title}</p>
                <p className="text-sm text-slate-500">{lead.contact?.name ?? 'No contact'}</p>
              </div>
              <button className="button-muted" onClick={() => deleteLead(lead.id)}>Delete</button>
            </div>
            <div className="grid grid-cols-3 gap-2">
              {stages.map((stage) => (
                <button
                  key={stage}
                  onClick={() => quickMove(lead, stage)}
                  className={`rounded-lg px-2 py-2 text-xs ${lead.stage === stage ? 'bg-blue-100 text-blue-800' : 'bg-slate-100 text-slate-600'}`}
                >
                  {stage}
                </button>
              ))}
            </div>
          </article>
        ))}
      </div>
    </PageShell>
  );
}
