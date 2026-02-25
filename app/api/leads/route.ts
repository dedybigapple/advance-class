import { NextRequest, NextResponse } from 'next/server';
import { getSupabaseServerClient } from '@/lib/supabase-server';

export async function GET() {
  const supabase = getSupabaseServerClient();
  const { data, error } = await supabase
    .from('leads')
    .select('*, contact:contacts(id,name,company)')
    .order('created_at', { ascending: false });

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json(data);
}

export async function POST(request: NextRequest) {
  const body = await request.json();
  const supabase = getSupabaseServerClient();

  const { data, error } = await supabase
    .from('leads')
    .insert([{ contact_id: body.contact_id, stage: body.stage ?? 'New', title: body.title, value: body.value ?? null }])
    .select('*')
    .single();

  if (error) return NextResponse.json({ error: error.message }, { status: 400 });
  return NextResponse.json(data, { status: 201 });
}

export async function PATCH(request: NextRequest) {
  const body = await request.json();
  const supabase = getSupabaseServerClient();
  const { data, error } = await supabase
    .from('leads')
    .update({ contact_id: body.contact_id, stage: body.stage, title: body.title, value: body.value ?? null })
    .eq('id', body.id)
    .select('*')
    .single();

  if (error) return NextResponse.json({ error: error.message }, { status: 400 });
  return NextResponse.json(data);
}

export async function DELETE(request: NextRequest) {
  const id = Number(new URL(request.url).searchParams.get('id'));
  const supabase = getSupabaseServerClient();
  const { error } = await supabase.from('leads').delete().eq('id', id);

  if (error) return NextResponse.json({ error: error.message }, { status: 400 });
  return NextResponse.json({ ok: true });
}
