/*
 * Example Supabase adapter (not wired up by default).
 *
 * 1. npm install @supabase/supabase-js
 * 2. Create a table:
 *      create table user_state (
 *        user_id uuid references auth.users primary key,
 *        key text not null,
 *        value jsonb not null,
 *        updated_at timestamptz default now()
 *      );
 *    with row-level security so users can only read/write their own rows.
 * 3. Set VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY, then in main.tsx:
 *      setPersistenceAdapter(createSupabaseAdapter(supabase, session.user.id));
 *
 * import type { SupabaseClient } from '@supabase/supabase-js';
 * import type { PersistenceAdapter } from './adapter';
 *
 * export const createSupabaseAdapter = (client: SupabaseClient, userId: string): PersistenceAdapter => ({
 *   async getItem(key) {
 *     const { data } = await client.from('user_state').select('value').eq('user_id', userId).eq('key', key).maybeSingle();
 *     return data ? JSON.stringify(data.value) : null;
 *   },
 *   async setItem(key, value) {
 *     await client.from('user_state').upsert({ user_id: userId, key, value: JSON.parse(value) });
 *   },
 *   async removeItem(key) {
 *     await client.from('user_state').delete().eq('user_id', userId).eq('key', key);
 *   },
 * });
 */
export {};
