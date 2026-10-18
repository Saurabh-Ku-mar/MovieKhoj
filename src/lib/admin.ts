import {cookies} from "next/headers";import {createClient} from "@supabase/supabase-js";
export const svc=()=>createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!,process.env.SUPABASE_SERVICE_ROLE_KEY!,{auth:{persistSession:false}});
export async function getAdmin():Promise<string|null>{
 const t=cookies().get("mk_admin")?.value;if(!t||!process.env.SUPABASE_SERVICE_ROLE_KEY)return null;
 const {data,error}=await svc().auth.getUser(t);const e=data?.user?.email?.toLowerCase();
 const ok=(process.env.ADMIN_EMAILS||"").toLowerCase().split(",").map(s=>s.trim()).filter(Boolean);
 return !error&&e&&ok.includes(e)?e:null}
export async function requireAdmin(){const a=await getAdmin();if(!a)throw new Error("Unauthorized");return a}
