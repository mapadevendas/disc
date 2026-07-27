type MagicLinkResponse = { error?: { message: string } | null };

export function createSupabaseBrowserClient() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  if (!url || !anonKey) return null;
  return {
    auth: {
      async signInWithOtp({ email, options }: { email: string; options?: { emailRedirectTo?: string } }): Promise<MagicLinkResponse> {
        const response = await fetch(`${url}/auth/v1/otp`, {
          method: 'POST',
          headers: { apikey: anonKey, Authorization: `Bearer ${anonKey}`, 'Content-Type': 'application/json' },
          body: JSON.stringify({ email, type: 'magiclink', options }),
        });
        if (!response.ok) return { error: { message: 'Não foi possível enviar o magic link pelo Supabase.' } };
        return { error: null };
      },
    },
  };
}
