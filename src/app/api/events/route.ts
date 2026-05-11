import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.SUPABASE_SERVICE_ROLE_KEY!);

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const date = searchParams.get('date'); // ex: 2024-05-11

  const { data, error } = await supabase
    .from('events')
    .select('start_datetime')
    .gte('start_datetime', `${date}T00:00:00`)
    .lte('start_datetime', `${date}T23:59:59`);

  return NextResponse.json(data || []);
}