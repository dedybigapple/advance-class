import { NextRequest, NextResponse } from 'next/server';
import { getSupabaseServerClient } from '@/lib/supabase-server';

export async function GET() {
  const supabase = getSupabaseServerClient();
  const { data, error } = await supabase.from('contacts').select('*').order('created_at', { ascending: false });

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json(data);
}

export async function POST(request: NextRequest) {
  const body = await request.json();
  const supabase = getSupabaseServerClient();

  const tags = typeof body.tags === 'string'
    ? body.tags.split(',').map((tag: string) => tag.trim()).filter(Boolean)
    : [];

  const { data, error } = await supabase
    .from('contacts')
    .insert([{ name: body.name, phone: body.phone ?? null, email: body.email ?? null, company: body.company ?? null, source: body.source ?? null, tags }])
    .select('*')
    .single();

  if (error) return NextResponse.json({ error: error.message }, { status: 400 });
  return NextResponse.json(data, { status: 201 });
}

export async function PATCH(request: NextRequest) {
  const body = await request.json();
  const supabase = getSupabaseServerClient();

  const updateData = {
    name: body.name,
    phone: body.phone ?? null,
    email: body.email ?? null,
    company: body.company ?? null,
    source: body.source ?? null,
    tags:
      typeof body.tags === 'string'
        ? body.tags.split(',').map((tag: string) => tag.trim()).filter(Boolean)
        : body.tags,
  };

  const { data, error } = await supabase.from('contacts').update(updateData).eq('id', body.id).select('*').single();
  if (error) return NextResponse.json({ error: error.message }, { status: 400 });

  return NextResponse.json(data);
}

export async function DELETE(request: NextRequest) {
  const id = Number(new URL(request.url).searchParams.get('id'));
  const supabase = getSupabaseServerClient();

  const { error } = await supabase.from('contacts').delete().eq('id', id);
  if (error) return NextResponse.json({ error: error.message }, { status: 400 });

  return NextResponse.json({ ok: true });
}
