"use client";import {useState} from "react";
export default function Share({title}:{title:string}){const [ok,setOk]=useState(false);
 const url=()=>location.origin+location.pathname;
 return(<div className="flex gap-2 mt-4"><button className="rounded bg-card px-3 py-2" onClick={async()=>{try{await navigator.clipboard.writeText(url());setOk(true);setTimeout(()=>setOk(false),2000)}catch{}}}>{ok?"Copied!":"Copy link"}</button>
 <button className="rounded bg-card px-3 py-2" onClick={()=>navigator.share?navigator.share({title,url:url()}).catch(()=>{}):window.open(`https://wa.me/?text=${encodeURIComponent(title+" "+url())}`,"_blank","noopener")}>Share</button></div>)}
