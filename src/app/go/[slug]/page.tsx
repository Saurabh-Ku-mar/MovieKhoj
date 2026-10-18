import {notFound} from "next/navigation";import {createClient} from "@supabase/supabase-js";import {safeExternalUrl} from "@/lib/url";
export const dynamic="force-dynamic";export const metadata={robots:{index:false}};
export default async function Go({params}:{params:{slug:string}}){
 const url=process.env.NEXT_PUBLIC_SUPABASE_URL,key=process.env.SUPABASE_SERVICE_ROLE_KEY;if(!url||!key)notFound();
 const c=createClient(url,key);
 const {data:m}=await c.from("movies").select("id,title").eq("slug",params.slug).eq("published",true).maybeSingle();if(!m)notFound();
 const {data:l}=await c.from("external_links").select("provider_name,destination_url").eq("movie_id",m.id).eq("active",true).eq("approved",true).limit(1).maybeSingle();
 const dest=l&&safeExternalUrl(l.destination_url);
 if(!l||!dest)return <p className="p-6">Official viewing link not available yet.</p>;
 await c.from("watch_clicks").insert({movie_id:m.id,provider_name:l.provider_name});
 return(<div className="max-w-md mx-auto text-center space-y-4"><h1 className="text-xl font-bold">You are leaving MovieKhoj</h1>
 <p>“{m.title}” is available at <b>{l.provider_name}</b> ({new URL(dest).hostname}), an external site we do not control.</p>
 <a href={dest} rel="noopener noreferrer nofollow" className="inline-block rounded-lg bg-brand px-6 py-3 font-bold">Continue to {l.provider_name}</a></div>)}
