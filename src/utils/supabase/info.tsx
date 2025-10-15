import { env } from "../env";

export const projectId = env.SUPABASE_URL?.split('//')[1]?.split('.')[0] || "";
export const publicAnonKey = env.SUPABASE_ANON_KEY || "";