import {listMovies} from "@/lib/movies";const base=process.env.NEXT_PUBLIC_SITE_URL||"http://localhost:3000";
export default async function sitemap(){const m=await listMovies().catch(()=>[]);return[{url:base},...m.filter(x=>!x.demo).map(x=>({url:`${base}/movie/${x.slug}`}))]}
