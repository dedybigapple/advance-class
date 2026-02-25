-- CRM Lite MVP schema + seed data
-- Run once in Supabase SQL Editor

create extension if not exists "pgcrypto";

create or replace function set_updated_at()
returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;

create table if not exists contacts (
  id bigserial primary key,
  name text not null,
  phone text,
  email text,
  company text,
  source text,
  tags text[] not null default '{}',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists leads (
  id bigserial primary key,
  contact_id bigint not null references contacts(id) on delete cascade,
  stage text not null check (stage in ('New', 'Contacted', 'Qualified', 'Proposal', 'Won', 'Lost')),
  title text not null,
  value numeric,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists tasks (
  id bigserial primary key,
  title text not null,
  due_date date,
  status text not null default 'todo' check (status in ('todo', 'done')),
  contact_id bigint references contacts(id) on delete set null,
  lead_id bigint references leads(id) on delete set null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists notes (
  id bigserial primary key,
  contact_id bigint not null references contacts(id) on delete cascade,
  body text not null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create trigger contacts_updated_at before update on contacts for each row execute function set_updated_at();
create trigger leads_updated_at before update on leads for each row execute function set_updated_at();
create trigger tasks_updated_at before update on tasks for each row execute function set_updated_at();
create trigger notes_updated_at before update on notes for each row execute function set_updated_at();

create index if not exists idx_leads_contact_id on leads(contact_id);
create index if not exists idx_leads_stage on leads(stage);
create index if not exists idx_tasks_contact_id on tasks(contact_id);
create index if not exists idx_tasks_lead_id on tasks(lead_id);
create index if not exists idx_tasks_status on tasks(status);
create index if not exists idx_tasks_due_date on tasks(due_date);
create index if not exists idx_notes_contact_id on notes(contact_id);

truncate notes, tasks, leads, contacts restart identity cascade;

insert into contacts (name, phone, email, company, source, tags) values
('Mia Johnson', '+1-202-555-0101', 'mia@northstar.io', 'Northstar Labs', 'Referral', '{hot,b2b}'),
('Noah Chen', '+1-202-555-0102', 'noah@acme.dev', 'Acme Dev', 'LinkedIn', '{saas}'),
('Ava Patel', '+1-202-555-0103', 'ava@orbit.co', 'Orbit Co', 'Inbound', '{startup,priority}'),
('Liam Garcia', '+1-202-555-0104', 'liam@sunrise.io', 'Sunrise Health', 'Conference', '{healthcare}');

insert into leads (contact_id, stage, title, value) values
(1, 'Qualified', 'Annual analytics package', 12000),
(2, 'Contacted', 'Website revamp proposal', 8000),
(3, 'Won', 'CRM onboarding sprint', 6000);

insert into tasks (title, due_date, status, contact_id, lead_id) values
('Call Mia about budget approval', current_date, 'todo', 1, 1),
('Send proposal draft to Noah', current_date + interval '1 day', 'todo', 2, 2),
('Kickoff call with Ava team', current_date - interval '1 day', 'done', 3, 3);

insert into notes (contact_id, body) values
(1, 'Asked for a quick ROI summary before Friday.'),
(2, 'Prefers WhatsApp follow-up in the afternoon.'),
(3, 'Very positive meeting. Ready to start next week.');
