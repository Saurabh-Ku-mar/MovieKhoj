export function approvedDomains():string[]{return (process.env.APPROVED_DOMAINS||"").split(",").map(s=>s.trim().toLowerCase()).filter(Boolean)}
/** Returns a normalized URL only if https and host is (a subdomain of) an approved domain. */
export function safeExternalUrl(raw:string):string|null{
 try{const u=new URL(raw);if(u.protocol!=="https:"||u.username||u.password)return null;
 const h=u.hostname.toLowerCase();
 return approvedDomains().some(d=>h===d||h.endsWith("."+d))?u.toString():null}catch{return null}}
