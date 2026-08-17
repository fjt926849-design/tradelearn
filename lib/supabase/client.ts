import { createClient, type SupabaseClient } from "@supabase/supabase-js";

let client: SupabaseClient | null = null;

/**
 * 返回浏览器端 Supabase client（单例）。
 *
 * 未配置 env（URL 或 anon key 为空 / 仍是占位符）时返回 null，
 * 调用方据此降级为纯 localStorage，不报错、不阻塞学习流程。
 */
export function getSupabase(): SupabaseClient | null {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  if (!url || !anonKey) return null;
  // 占位符未替换时视为未配置
  if (url.startsWith("YOUR_") || anonKey.startsWith("YOUR_")) return null;

  if (!client) {
    client = createClient(url, anonKey);
  }
  return client;
}
