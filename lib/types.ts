export type LeadStage = 'New' | 'Contacted' | 'Qualified' | 'Proposal' | 'Won' | 'Lost';
export type TaskStatus = 'todo' | 'done';

export type Contact = {
  id: number;
  name: string;
  phone: string | null;
  email: string | null;
  company: string | null;
  source: string | null;
  tags: string[];
  created_at: string;
  updated_at: string;
};

export type Lead = {
  id: number;
  contact_id: number;
  stage: LeadStage;
  title: string;
  value: number | null;
  created_at: string;
  updated_at: string;
  contact?: Pick<Contact, 'id' | 'name' | 'company'>;
};

export type Task = {
  id: number;
  title: string;
  due_date: string | null;
  status: TaskStatus;
  contact_id: number | null;
  lead_id: number | null;
  created_at: string;
  updated_at: string;
};

export type Note = {
  id: number;
  contact_id: number;
  body: string;
  created_at: string;
};
