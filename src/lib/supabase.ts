import { createClient } from "@supabase/supabase-js";

// 접속 주소와 공개 키는 .env.local 에 있다. (service_role / secret 키는 쓰지 않는다)
const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
const key = process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY;

if (!url || !key) {
  const missing = [
    !url && "NEXT_PUBLIC_SUPABASE_URL",
    !key && "NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY",
  ].filter(Boolean);
  throw new Error(
    `Supabase 환경 변수가 없어요: ${missing.join(", ")}. .env.local 에 넣고 개발 서버를 다시 켜 주세요.`,
  );
}

// 로그인이 없는 앱이라 로그인 세션은 저장하지 않는다
export const supabase = createClient(url, key, {
  auth: { persistSession: false, autoRefreshToken: false, detectSessionInUrl: false },
});
