import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';

dotenv.config();

const DEFAULT_SUPABASE_URL = '';
const DEFAULT_SERVICE_ROLE_KEY = '';

const isValidHttpUrl = (urlStr?: string): boolean => {
  if (!urlStr || typeof urlStr !== 'string') return false;
  const trimmed = urlStr.trim();
  if (!trimmed.startsWith('http://') && !trimmed.startsWith('https://')) return false;
  try {
    const u = new URL(trimmed);
    return u.protocol === 'http:' || u.protocol === 'https:';
  } catch {
    return false;
  }
};

const rawUrl = process.env.SUPABASE_URL || process.env.VITE_SUPABASE_URL;
const rawKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

const supabaseUrl = isValidHttpUrl(rawUrl) ? rawUrl!.trim() : DEFAULT_SUPABASE_URL;
const supabaseServiceKey = rawKey && rawKey.trim().length > 0 && rawKey !== 'YOUR_SUPABASE_SERVICE_ROLE_KEY' ? rawKey.trim() : DEFAULT_SERVICE_ROLE_KEY;

export const supabaseAdmin = createClient(
  supabaseUrl,
  supabaseServiceKey,
  {
    auth: {
      autoRefreshToken: false,
      persistSession: false,
    },
  }
);

/**
 * Perform a real backend query against Supabase to verify connectivity
 */
export async function checkSupabaseConnectivity(): Promise<{
  connected: boolean;
  message: string;
  responseTimeMs?: number;
}> {
  const startTime = Date.now();
  try {
    const { error } = await supabaseAdmin.auth.getSession();
    const responseTimeMs = Date.now() - startTime;
    if (error) {
      return {
        connected: false,
        message: `Supabase Auth error: ${error.message}`,
        responseTimeMs,
      };
    }
    return {
      connected: true,
      message: 'Supabase service-role client connected and authenticated successfully',
      responseTimeMs,
    };
  } catch (err: any) {
    return {
      connected: false,
      message: `Supabase connection failed: ${err?.message || 'Unknown error'}`,
      responseTimeMs: Date.now() - startTime,
    };
  }
}
