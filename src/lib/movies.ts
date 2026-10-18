import {createClient} from "@supabase/supabase-js";
export type Movie={slug:string;title:string;original_title?:string;release_year?:number;overview?:string;language?:string;genres:string[];poster_path?:string;demo?:boolean};
// Clearly labelled DEMO data, used only when Supabase is not configured.
const DEMO:Movie[]=[{slug:"demo-movie",title:"Demo Movie",release_year:2024,overview:"Demo content for local development. Configure Supabase to show real data.",language:"Hindi",genres:["Action"],demo:true}];
const db=()=>process.env.NEXT_PUBLIC_SUPABASE_URL&&process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY?createClient(process.env.NEXT_PUBLIC_SUPABASE_URL,process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY):null;
export async function listMovies(q?:string):Promise<Movie[]>{const c=db();if(!c)return DEMO;
 let r=c.from("movies").select("*").eq("published",true).order("release_year",{ascending:false}).limit(24);
 if(q){const s=q.replace(/[%,()]/g,"");r=r.or(`title.ilike.%${s}%,original_title.ilike.%${s}%,language.ilike.%${s}%`)}
 const {data,error}=await r;if(error)throw new Error("Could not load movies");return data as Movie[]}
export async function getMovie(slug:string):Promise<Movie|null>{const c=db();if(!c)return DEMO.find(m=>m.slug===slug)||null;
 const {data}=await c.from("movies").select("*").eq("slug",slug).eq("published",true).maybeSingle();return data as Movie|null}
export const poster=(p?:string)=>p?`https://image.tmdb.org/t/p/w342${p}`:null;
