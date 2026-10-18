import {notFound} from "next/navigation";import type {Metadata} from "next";import Link from "next/link";import {getMovie} from "@/lib/movies";import Share from "@/components/Share";
export const revalidate=300;
export async function generateMetadata({params}:{params:{slug:string}}):Promise<Metadata>{const m=await getMovie(params.slug);if(!m)return{title:"Not found"};
 return{title:m.title,description:(m.overview||"").slice(0,155),alternates:{canonical:`/movie/${m.slug}`},openGraph:{title:m.title,description:(m.overview||"").slice(0,155),type:"video.movie",images:m.poster_path?[`https://image.tmdb.org/t/p/w500${m.poster_path}`]:[]},twitter:{card:"summary_large_image"}}}
export default async function Page({params}:{params:{slug:string}}){const m=await getMovie(params.slug);if(!m)notFound();
 return(<article><h1 className="text-3xl font-bold">{m.title}</h1><p className="text-gray-400">{m.release_year} · {m.language} · {m.genres.join(", ")}</p>
 <p className="my-4 max-w-2xl">{m.overview}</p>
 <Link href={`/go/${m.slug}`} className="inline-block rounded-lg bg-accent px-6 py-3 font-bold">WATCH NOW</Link><Share title={m.title}/></article>)}
