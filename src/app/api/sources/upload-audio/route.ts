import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

export const runtime = 'nodejs';

const MAX_TRANSCRIPT_LENGTH = 25000; // match document truncation
const WHISPER_MAX_SIZE_MB = 25;

function truncate(text: string, max: number): string {
  if (!text || text.length <= max) return text;
  return text.slice(0, max) + '\n\n[... truncated for length ...]';
}

function safeForDb(s: string | null): string | null {
  if (s == null || typeof s !== 'string') return s;
  const noControl = s.replace(/[\x00-\x08\x0B\x0C\x0E-\x1F\x7F]/g, ' ');
  return noControl.replace(/[\uD800-\uDFFF]/g, '');
}

export async function POST(req: Request) {
  try {
    const apiKey = process.env.OPENAI_API_KEY?.trim();
    if (!apiKey) {
      return NextResponse.json(
        { message: 'OPENAI_API_KEY is not set. Add it in Settings or .env.local to use audio transcription.' },
        { status: 503 }
      );
    }

    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
    if (!supabaseUrl || !supabaseAnonKey) {
      return NextResponse.json({ message: 'Server configuration missing' }, { status: 500 });
    }

    const authHeader = req.headers.get('Authorization');
    const token = authHeader?.replace(/^Bearer\s+/i, '').trim();
    if (!token) {
      return NextResponse.json({ message: 'Not authenticated' }, { status: 401 });
    }

    const supabase = createClient(supabaseUrl, supabaseAnonKey, {
      global: { headers: { Authorization: `Bearer ${token}` } },
    });
    const { data: { user }, error: authError } = await supabase.auth.getUser();
    if (authError || !user) {
      return NextResponse.json({ message: 'Not authenticated' }, { status: 401 });
    }

    const formData = await req.formData();
    const projectId = formData.get('projectId');
    const files = formData.getAll('files') as File[];
    if (!projectId || typeof projectId !== 'string' || !projectId.trim()) {
      return NextResponse.json({ message: 'projectId is required' }, { status: 400 });
    }
    if (!files?.length) {
      return NextResponse.json({ message: 'At least one audio file is required' }, { status: 400 });
    }

    const results: { id: string; name: string; type: string; content: string | null }[] = [];

    for (const file of files) {
      if (!(file instanceof File)) continue;
      const name = file.name || 'Audio';
      const sizeMB = file.size / (1024 * 1024);
      if (sizeMB > WHISPER_MAX_SIZE_MB) {
        return NextResponse.json(
          { message: `File "${name}" is too large (max ${WHISPER_MAX_SIZE_MB} MB).` },
          { status: 400 }
        );
      }

      let transcript: string | null = null;
      try {
        const form = new FormData();
        form.set('file', file);
        form.set('model', 'whisper-1');
        const whisperRes = await fetch('https://api.openai.com/v1/audio/transcriptions', {
          method: 'POST',
          headers: { Authorization: `Bearer ${apiKey}` },
          body: form,
        });
        if (!whisperRes.ok) {
          const errBody = await whisperRes.text();
          console.error('Whisper API error:', whisperRes.status, errBody);
          throw new Error(whisperRes.status === 401 ? 'Invalid OpenAI API key' : errBody || 'Transcription failed');
        }
        const data = await whisperRes.json();
        transcript = typeof data?.text === 'string' ? data.text.trim() : null;
      } catch (e) {
        const msg = e instanceof Error ? e.message : 'Transcription failed';
        console.warn('Transcription error for', name, msg);
        return NextResponse.json(
          { message: `Transcription failed for "${name}": ${msg}` },
          { status: 502 }
        );
      }

      const content = transcript ? truncate(transcript, MAX_TRANSCRIPT_LENGTH) : null;
      const displayName = name.replace(/\.[^.]+$/, '');
      const sourceName = content ? `Audio: ${displayName}` : `Audio: ${displayName} (no speech detected)`;

      const { data: row, error } = await supabase
        .from('sources')
        .insert({
          name: sourceName,
          type: 'transcript',
          selected: true,
          project_id: projectId.trim(),
          user_id: user.id,
          content: safeForDb(content),
        })
        .select('id, name, type, content')
        .single();

      if (error) {
        console.error('Insert source error:', error);
        return NextResponse.json({ message: error.message || 'Failed to save source' }, { status: 500 });
      }
      results.push({
        id: row.id,
        name: row.name,
        type: row.type,
        content: row.content ?? null,
      });
    }

    return NextResponse.json(results);
  } catch (error: unknown) {
    console.error('Upload audio error:', error);
    const message = error instanceof Error ? error.message : 'Upload failed';
    return NextResponse.json({ message }, { status: 500 });
  }
}
