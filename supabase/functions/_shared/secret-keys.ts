
export function secretKeys(): Record<string, string> {
  const raw = Deno.env.get('SUPABASE_SECRET_KEYS')
  if (!raw) {
    throw new Error(
      'SUPABASE_SECRET_KEYS is not set — create publishable and secret API keys for the project',
    )
  }
  return JSON.parse(raw) as Record<string, string>
}

export function secretKey(): string {
  const [key] = Object.values(secretKeys())
  if (!key) throw new Error('SUPABASE_SECRET_KEYS holds no keys')
  return key
}

export function sentSecretKey(request: Request): boolean {
  const keys = Object.values(secretKeys())
  const sent = request.headers.get('apikey')
  return sent !== null && keys.includes(sent)
}
