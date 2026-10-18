const H=()=>process.env.TMDB_READ_TOKEN?{Authorization:`Bearer ${process.env.TMDB_READ_TOKEN}`}:null;
export async function tmdbMovie(id:number){const h=H();if(!h)return null; // graceful fallback: admin fills fields manually
 try{const r=await fetch(`https://api.themoviedb.org/3/movie/${id}?append_to_response=videos`,{headers:h,next:{revalidate:86400}});
 if(r.status===429||!r.ok)return null;const d=await r.json();
 const yt=d.videos?.results?.find((v:any)=>v.site==="YouTube"&&v.type==="Trailer");
 return{title:d.title as string,original_title:d.original_title as string,release_year:d.release_date?+d.release_date.slice(0,4):null,overview:d.overview as string,
 language:d.original_language as string,genres:(d.genres||[]).map((g:any)=>g.name) as string[],poster_path:d.poster_path as string|null,
 trailer_url:yt?`https://www.youtube.com/watch?v=${yt.key}`:null}}catch{return null}}
