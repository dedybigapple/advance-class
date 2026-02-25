import { NextResponse } from 'next/server';
import { getSupabaseServerClient } from '@/lib/supabase-server';

export async function GET() {
  const supabase = getSupabaseServerClient();
  const monthStart = new Date();
  monthStart.setDate(1);
  monthStart.setHours(0, 0, 0, 0);

  const today = new Date();
  const todayDate = today.toISOString().slice(0, 10);

  const [
    totalLeads,
    qualifiedLeads,
    wonThisMonth,
    tasksDueToday,
  ] = await Promise.all([
    supabase.from('leads').select('*', { count: 'exact', head: true }),
    supabase.from('leads').select('*', { count: 'exact', head: true }).eq('stage', 'Qualified'),
    supabase.from('leads').select('*', { count: 'exact', head: true }).eq('stage', 'Won').gte('updated_at', monthStart.toISOString()),
    supabase.from('tasks').select('*', { count: 'exact', head: true }).eq('due_date', todayDate).eq('status', 'todo'),
  ]);

  return NextResponse.json({
    totalLeads: totalLeads.count ?? 0,
    qualifiedLeads: qualifiedLeads.count ?? 0,
    wonThisMonth: wonThisMonth.count ?? 0,
    tasksDueToday: tasksDueToday.count ?? 0,
  });
}
