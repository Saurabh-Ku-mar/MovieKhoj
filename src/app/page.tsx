import Link from "next/link";import Image from "next/image";import {listMovies,poster} from "@/lib/movies";
export const revalidate=300;
export default async function Home({searchParams}:{searchParams:{q?:string}}){
 let movies;try{movies=await listMovies(searchParams.q)}catch{return <p role="alert">Something went wrong loading movies. Please retry.</p>}
 return(<><h1 className="text-2xl font-bold mb-4">{searchParams.q?`Results for “${searchParams.q}”`:"Movies"}</h1>
 {movies.length===0&&<p>No movies found.</p>}
 <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">{movies.map(m=>(<Link key={m.slug} href={`/movie/${m.slug}`} className="rounded-xl bg-card overflow-hidden hover:ring-2 ring-brand">
 {poster(m.poster_path)?<Image src={poster(m.poster_path)!} alt={m.title} width={342} height={513} loading="lazy"/>:<div className="aspect-[2/3] grid place-items-center text-gray-500">No poster</div>}
 <div className="p-3"><h2 className="font-semibold">{m.title}</h2><p className="text-xs text-gray-400">{m.release_year} · {m.language} · {m.genres[0]}</p></div></Link>))}</div></>)}
