import { NextRequest, NextResponse } from 'next/server';
import { getSupabaseServerClient } from '@/lib/supabase-server';

export async function GET() {
  const supabase = getSupabaseServerClient();
  const { data, error } = await supabase.from('tasks').select('*').order('due_date', { ascending: true });

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json(data);
}

export async function POST(request: NextRequest) {
  const body = await request.json();
  const supabase = getSupabaseServerClient();
  const { data, error } = await supabase
    .from('tasks')
    .insert([{ title: body.title, due_date: body.due_date ?? null, status: body.status ?? 'todo', contact_id: body.contact_id ?? null, lead_id: body.lead_id ?? null }])
    .select('*')
    .single();

  if (error) return NextResponse.json({ error: error.message }, { status: 400 });
  return NextResponse.json(data, { status: 201 });
}

export async function PATCH(request: NextRequest) {
  const body = await request.json();
  const supabase = getSupabaseServerClient();
  const { data, error } = await supabase
    .from('tasks')
    .update({ title: body.title, due_date: body.due_date ?? null, status: body.status, contact_id: body.contact_id ?? null, lead_id: body.lead_id ?? null })
    .eq('id', body.id)
    .select('*')
    .single();

  if (error) return NextResponse.json({ error: error.message }, { status: 400 });
  return NextResponse.json(data);
}

export async function DELETE(request: NextRequest) {
  const id = Number(new URL(request.url).searchParams.get('id'));
  const supabase = getSupabaseServerClient();
  const { error } = await supabase.from('tasks').delete().eq('id', id);

  if (error) return NextResponse.json({ error: error.message }, { status: 400 });
  return NextResponse.json({ ok: true });
}
