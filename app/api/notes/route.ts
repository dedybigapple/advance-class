import { NextRequest, NextResponse } from 'next/server';
import { getSupabaseServerClient } from '@/lib/supabase-server';

export async function GET(request: NextRequest) {
  const contactId = Number(new URL(request.url).searchParams.get('contact_id'));
  const supabase = getSupabaseServerClient();
  const query = supabase.from('notes').select('*').order('created_at', { ascending: false });
  const { data, error } = contactId ? await query.eq('contact_id', contactId) : await query;

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json(data);
}

export async function POST(request: NextRequest) {
  const body = await request.json();
  const supabase = getSupabaseServerClient();
  const { data, error } = await supabase
    .from('notes')
    .insert([{ contact_id: body.contact_id, body: body.body }])
    .select('*')
    .single();

  if (error) return NextResponse.json({ error: error.message }, { status: 400 });
  return NextResponse.json(data, { status: 201 });
}

export async function DELETE(request: NextRequest) {
  const id = Number(new URL(request.url).searchParams.get('id'));
  const supabase = getSupabaseServerClient();
  const { error } = await supabase.from('notes').delete().eq('id', id);

  if (error) return NextResponse.json({ error: error.message }, { status: 400 });
  return NextResponse.json({ ok: true });
}
