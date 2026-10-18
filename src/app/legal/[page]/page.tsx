import {notFound} from "next/navigation";
const c=process.env.CONTACT_EMAIL||"(set CONTACT_EMAIL)";
const P:Record<string,[string,string]>={
about:["About Us","MovieKhoj is a movie discovery and link directory run alongside the SAUR 404 Instagram page. We list movie information and point to external pages. We do not host, stream or own films and hold no distribution rights."],
contact:["Contact Us",`For questions or copyright complaints, email ${c}.`],
privacy:["Privacy Policy","We do not require accounts for browsing. We store aggregate counts of Watch Now clicks (movie and provider only, no personal identifiers). Third-party ad or analytics services, if enabled later, will be listed here and only loaded with consent. Edit this text to match your actual setup."],
terms:["Terms of Service","Use of this site is at your own risk. Content is informational. External sites are governed by their own terms."],
copyright:["Copyright and Takedown",`If you own rights in content linked here, email ${c} with the page URL, your contact details and proof of ownership. We review reports and disable disputed links promptly (Admin → Disable link). Adding a disclaimer does not make unauthorized content lawful; links to infringing content are not permitted.`],
"external-links":["External Links Disclaimer","Watch Now buttons lead to third-party sites. We list only links an administrator has reviewed, but we do not control them and cannot guarantee availability or legality in your region."],
"affiliate":["Affiliate Disclosure","If we add affiliate links they will be clearly labelled and may earn us a commission at no extra cost to you."]};
export function generateStaticParams(){return Object.keys(P).map(page=>({page}))}
export default function L({params}:{params:{page:string}}){const p=P[params.page];if(!p)notFound();
 return <article className="max-w-2xl"><h1 className="text-2xl font-bold mb-3">{p[0]}</h1><p>{p[1]}</p><p className="mt-4 text-xs text-gray-500">Template text, not legal advice. Have it reviewed before launch.</p></article>}
