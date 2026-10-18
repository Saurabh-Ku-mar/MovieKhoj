import {getAdmin,svc} from "@/lib/admin";import {login,logout,saveMovie,togglePublish,deleteMovie,addLink,disableLink} from "./actions";
export const dynamic="force-dynamic";export const metadata={robots:{index:false}};
const I="rounded bg-card px-2 py-1 border border-white/10 w-full";const B="rounded bg-brand px-3 py-1";
export default async function Admin(){
 const a=await getAdmin();
 if(!a)return(<form action={login} className="max-w-xs mx-auto space-y-2"><h1 className="text-xl font-bold">Admin login</h1>
 <input name="email" type="email" required placeholder="Email" className={I}/><input name="password" type="password" required placeholder="Password" className={I}/><button className={B}>Sign in</button></form>);
 const db=svc();
 const [{data:movies},{data:links},{count:clicks}]=await Promise.all([db.from("movies").select("*").order("created_at",{ascending:false}),
 db.from("external_links").select("*").eq("active",true),db.from("watch_clicks").select("*",{count:"exact",head:true})]);
 const m=movies||[];
 return(<div className="space-y-8"><div className="flex justify-between"><h1 className="text-2xl font-bold">Dashboard</h1><form action={logout}><button className={B}>Logout ({a})</button></form></div>
 <p>Total: {m.length} · Published: {m.filter(x=>x.published).length} · Drafts: {m.filter(x=>!x.published).length} · Watch Now clicks: {clicks??0}</p>
 <form action={saveMovie} className="grid sm:grid-cols-2 gap-2 bg-card p-4 rounded-xl"><h2 className="sm:col-span-2 font-bold">Add / update movie (same slug updates)</h2>
 <input name="tmdb_id" placeholder="TMDB ID (optional, auto-fills blanks)" className={I}/><input name="title" placeholder="Title" className={I}/>
 <input name="slug" placeholder="slug (auto)" className={I}/><input name="original_title" placeholder="Original title" className={I}/>
 <input name="year" placeholder="Year" className={I}/><input name="language" placeholder="Language" className={I}/>
 <input name="genres" placeholder="Genres, comma separated" className={I}/><input name="poster_path" placeholder="/poster.jpg (TMDB path)" className={I}/>
 <input name="trailer_url" placeholder="Trailer URL" className={I}/><textarea name="overview" placeholder="Overview" className={I}/>
 <label><input type="checkbox" name="featured"/> Featured</label><label><input type="checkbox" name="published"/> Published</label><button className={B}>Save</button></form>
 {m.map(x=>(<div key={x.id} className="bg-card p-3 rounded-xl space-y-2"><div className="flex flex-wrap gap-2 items-center"><b>{x.title}</b><span className="text-gray-400">/{x.slug} · {x.published?"published":"draft"}</span>
 <form action={togglePublish}><input type="hidden" name="id" value={x.id}/><input type="hidden" name="to" value={x.published?"0":"1"}/><button className={B}>{x.published?"Unpublish":"Publish"}</button></form>
 <form action={deleteMovie}><input type="hidden" name="id" value={x.id}/><button className="rounded bg-accent px-3 py-1">Delete</button></form></div>
 {(links||[]).filter(l=>l.movie_id===x.id).map(l=>(<form key={l.id} action={disableLink} className="text-sm flex gap-2"><input type="hidden" name="id" value={l.id}/>{l.provider_name}: {l.destination_url}<button className="underline text-accent">Disable</button></form>))}
 <form action={addLink} className="flex gap-2 text-sm"><input type="hidden" name="movie_id" value={x.id}/><input name="provider" required placeholder="Provider" className={I}/><input name="url" required placeholder="https:// (approved domain only)" className={I}/><button className={B}>Add link</button></form></div>))}</div>)}
