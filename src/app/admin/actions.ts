"use server";
import {cookies} from "next/headers";import {revalidatePath} from "next/cache";import {createClient} from "@supabase/supabase-js";
import {requireAdmin,svc} from "@/lib/admin";import {safeExternalUrl} from "@/lib/url";import {tmdbMovie} from "@/lib/tmdb";
const s=(f:FormData,k:string)=>String(f.get(k)||"").trim();
const slugify=(t:string)=>t.toLowerCase().replace(/[^a-z0-9]+/g,"-").replace(/^-|-$/g,"").slice(0,80);
export async function login(f:FormData){
 const c=createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!,process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,{auth:{persistSession:false}});
 const {data}=await c.auth.signInWithPassword({email:s(f,"email"),password:s(f,"password")});
 if(data.session)cookies().set("mk_admin",data.session.access_token,{httpOnly:true,secure:process.env.NODE_ENV==="production",sameSite:"strict",path:"/admin",maxAge:3600});
 revalidatePath("/admin")}
export async function logout(){cookies().delete({name:"mk_admin",path:"/admin"});revalidatePath("/admin")}
export async function saveMovie(f:FormData){await requireAdmin();
 const t=await tmdbMovie(Number(s(f,"tmdb_id"))||0);const title=s(f,"title")||t?.title||"";if(!title)return;
 const row={title,slug:s(f,"slug")||slugify(title),original_title:s(f,"original_title")||t?.original_title||null,
 release_year:Number(s(f,"year"))||t?.release_year||null,overview:s(f,"overview")||t?.overview||null,language:s(f,"language")||t?.language||null,
 genres:s(f,"genres")?s(f,"genres").split(",").map(x=>x.trim()):t?.genres||[],poster_path:s(f,"poster_path")||t?.poster_path||null,
 trailer_url:s(f,"trailer_url")||t?.trailer_url||null,featured:f.get("featured")==="on",published:f.get("published")==="on",updated_at:new Date().toISOString()};
 await svc().from("movies").upsert(row,{onConflict:"slug"});revalidatePath("/");revalidatePath("/admin")}
export async function togglePublish(f:FormData){await requireAdmin();
 await svc().from("movies").update({published:s(f,"to")==="1"}).eq("id",s(f,"id"));revalidatePath("/");revalidatePath("/admin")}
export async function deleteMovie(f:FormData){await requireAdmin();await svc().from("movies").delete().eq("id",s(f,"id"));revalidatePath("/");revalidatePath("/admin")}
export async function addLink(f:FormData){await requireAdmin();const u=safeExternalUrl(s(f,"url"));if(!u)return; // rejects non-https / unapproved domains
 await svc().from("external_links").insert({movie_id:s(f,"movie_id"),provider_name:s(f,"provider"),destination_url:u,approved:true,authorized_status:"verified_by_admin"});revalidatePath("/admin")}
export async function disableLink(f:FormData){await requireAdmin();await svc().from("external_links").update({active:false}).eq("id",s(f,"id"));revalidatePath("/admin")}
