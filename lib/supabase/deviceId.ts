const STORAGE_KEY = "tradelearn-user-id";

/** 无 crypto.randomUUID 时兜底生成一个 v4 格式 uuid */
function fallbackUuid(): string {
  return "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g, (c) => {
    const r = (Math.random() * 16) | 0;
    const v = c === "x" ? r : (r & 0x3) | 0x8;
    return v.toString(16);
  });
}

/**
 * 获取/生成匿名设备 ID（uuid）。
 *
 * 当前无登录系统，用它充当所有表里的 user_id；
 * 未来接 Supabase Auth 后，登录时用 auth.users.id 替换即可（两者同为 uuid）。
 */
export function getDeviceId(): string {
  if (typeof window === "undefined") return "";
  try {
    const existing = window.localStorage.getItem(STORAGE_KEY);
    if (existing) return existing;

    const id =
      typeof crypto !== "undefined" && "randomUUID" in crypto
        ? crypto.randomUUID()
        : fallbackUuid();
    window.localStorage.setItem(STORAGE_KEY, id);
    return id;
  } catch {
    return "";
  }
}
