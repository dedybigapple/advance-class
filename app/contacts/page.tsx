'use client';

import { useEffect, useState } from 'react';
import { AddButton } from '@/components/AddButton';
import { PageShell } from '@/components/PageShell';
import type { Contact, Note } from '@/lib/types';

export default function ContactsPage() {
  const [contacts, setContacts] = useState<Contact[]>([]);
  const [notes, setNotes] = useState<Note[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [expandedId, setExpandedId] = useState<number | null>(null);
  const [editing, setEditing] = useState<Contact | null>(null);
  const [noteDraft, setNoteDraft] = useState('');
  const [draft, setDraft] = useState({ name: '', phone: '', email: '', company: '', source: '', tags: '' });

  async function load() {
    const [contactsRes, notesRes] = await Promise.all([fetch('/api/contacts'), fetch('/api/notes')]);
    setContacts(await contactsRes.json());
    setNotes(await notesRes.json());
  }

  useEffect(() => {
    load();
  }, []);

  async function createContact() {
    await fetch('/api/contacts', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(draft),
    });
    setDraft({ name: '', phone: '', email: '', company: '', source: '', tags: '' });
    setShowForm(false);
    load();
  }

  async function deleteContact(id: number) {
    await fetch(`/api/contacts?id=${id}`, { method: 'DELETE' });
    load();
  }

  async function updateContact() {
    if (!editing) return;
    await fetch('/api/contacts', {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        ...editing,
        tags: editing.tags.join(', '),
      }),
    });
    setEditing(null);
    load();
  }

  async function addNote(contactId: number) {
    if (!noteDraft.trim()) return;
    await fetch('/api/notes', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ contact_id: contactId, body: noteDraft }),
    });
    setNoteDraft('');
    load();
  }

  return (
    <PageShell title="Contacts" cta={<AddButton onClick={() => setShowForm((v) => !v)} label="Add contact" />}>
      {showForm ? (
        <section className="card mb-4 space-y-3">
          <input className="input" placeholder="Name (required)" value={draft.name} onChange={(e) => setDraft((d) => ({ ...d, name: e.target.value }))} />
          <input className="input" placeholder="Phone" value={draft.phone} onChange={(e) => setDraft((d) => ({ ...d, phone: e.target.value }))} />
          <details>
            <summary className="cursor-pointer text-sm text-slate-500">Optional fields</summary>
            <div className="mt-2 space-y-2">
              <input className="input" placeholder="Email" value={draft.email} onChange={(e) => setDraft((d) => ({ ...d, email: e.target.value }))} />
              <input className="input" placeholder="Company" value={draft.company} onChange={(e) => setDraft((d) => ({ ...d, company: e.target.value }))} />
              <input className="input" placeholder="Source" value={draft.source} onChange={(e) => setDraft((d) => ({ ...d, source: e.target.value }))} />
              <input className="input" placeholder="Tags (comma separated)" value={draft.tags} onChange={(e) => setDraft((d) => ({ ...d, tags: e.target.value }))} />
            </div>
          </details>
          <button className="button-primary w-full" onClick={createContact} disabled={!draft.name}>Save contact</button>
        </section>
      ) : null}

      {editing ? (
        <section className="card mb-4 space-y-3 border-2 border-blue-200">
          <p className="text-sm font-semibold">Editing: {editing.name}</p>
          <input className="input" value={editing.name} onChange={(e) => setEditing((c) => (c ? { ...c, name: e.target.value } : null))} />
          <input className="input" value={editing.phone ?? ''} onChange={(e) => setEditing((c) => (c ? { ...c, phone: e.target.value } : null))} />
          <input className="input" value={editing.email ?? ''} onChange={(e) => setEditing((c) => (c ? { ...c, email: e.target.value } : null))} />
          <input className="input" value={editing.company ?? ''} onChange={(e) => setEditing((c) => (c ? { ...c, company: e.target.value } : null))} />
          <input className="input" value={editing.source ?? ''} onChange={(e) => setEditing((c) => (c ? { ...c, source: e.target.value } : null))} />
          <input
            className="input"
            value={editing.tags.join(', ')}
            onChange={(e) => setEditing((c) => (c ? { ...c, tags: e.target.value.split(',').map((t) => t.trim()).filter(Boolean) } : null))}
          />
          <div className="flex gap-2">
            <button className="button-primary flex-1" onClick={updateContact} disabled={!editing.name}>Save changes</button>
            <button className="button-muted flex-1" onClick={() => setEditing(null)}>Cancel</button>
          </div>
        </section>
      ) : null}

      <div className="space-y-3">
        {contacts.map((contact) => (
          <article key={contact.id} className="card space-y-2">
            <div className="flex items-start justify-between gap-2">
              <div>
                <p className="font-semibold">{contact.name}</p>
                <p className="text-sm text-slate-500">{contact.company ?? 'No company'} · {contact.phone ?? 'No phone'}</p>
              </div>
              <button className="button-muted" onClick={() => deleteContact(contact.id)}>Delete</button>
              <button className="button-muted" onClick={() => setEditing(contact)}>Edit</button>
            </div>
            <button className="text-sm font-medium text-brand" onClick={() => setExpandedId((id) => (id === contact.id ? null : contact.id))}>
              {expandedId === contact.id ? 'Hide notes' : 'Show notes'}
            </button>

            {expandedId === contact.id ? (
              <div className="rounded-xl bg-slate-50 p-3">
                <div className="mb-2 flex gap-2">
                  <input className="input" placeholder="Quick note..." value={noteDraft} onChange={(e) => setNoteDraft(e.target.value)} />
                  <button className="button-primary" onClick={() => addNote(contact.id)}>Add</button>
                </div>
                <ul className="space-y-2">
                  {notes.filter((note) => note.contact_id === contact.id).map((note) => (
                    <li key={note.id} className="rounded-lg bg-white p-2 text-sm text-slate-700 ring-1 ring-slate-200">
                      <p>{note.body}</p>
                      <p className="mt-1 text-xs text-slate-400">{new Date(note.created_at).toLocaleString()}</p>
                    </li>
                  ))}
                </ul>
              </div>
            ) : null}
          </article>
        ))}
      </div>
    </PageShell>
  );
}
