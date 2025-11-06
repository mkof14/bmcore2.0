import { mkdir, writeFile, readFile } from 'node:fs/promises';
import { exec as _exec } from 'node:child_process';
import { promisify } from 'node:util';
const exec = promisify(_exec);

const base = 'https://bmcorebolt1.vercel.app';
const html = await (await fetch(base)).text();
const asset = (html.match(/\/assets\/index-[A-Za-z0-9]+\.js/)||[])[0]||'';
if(!asset) process.exit(0);

const js = await (await fetch(base+asset)).text();
const urls = Array.from(new Set(js.match(/https:\/\/images\.pexels\.com[^\s"'\\)]+/g)||[]));

await mkdir('public/hero',{recursive:true});
const map = {};
let i=0;
for(const u of urls){
  i++;
  const name=`img_${String(i).padStart(2,'0')}.jpg`;
  await exec(`curl -sL '${u}' -o 'public/hero/${name}'`);
  map[u]=`/hero/${name}`;
}

await writeFile('public/hero/map.json', JSON.stringify(urls,null,2));
await writeFile('public/hero/map.local.json', JSON.stringify(map,null,2));

const rewrite = `(function(){function r(m){function l(u){return m[u]||u}function f(){document.querySelectorAll('img[src]').forEach(function(i){var s=i.getAttribute('src');var p=l(s);if(p!==s)i.setAttribute('src',p)});document.querySelectorAll('[style*="background"],[style*="url("]').forEach(function(el){var s=el.getAttribute('style')||'';el.setAttribute('style',s.replace(/https:\\/\\/images\\.pexels\\.com[^\"' )]+/g,function(x){return l(x)}))})}if(document.readyState!=='loading'){f()}else{document.addEventListener('DOMContentLoaded',f)}new MutationObserver(f).observe(document.documentElement,{subtree:true,attributes:true,attributeFilter:['src','style']})}fetch('/hero/map.local.json',{cache:'no-store'}).then(function(x){return x.json()}).then(r).catch(function(){})})();`;
await writeFile('public/hero-rewrite.js', rewrite);

let idx = await readFile('index.html','utf8');
if(!/hero-rewrite\.js/.test(idx)){
  idx=idx.replace('</head>', `<script src="/hero-rewrite.js?v=${Date.now()}"></script></head>`);
  await writeFile('index.html', idx);
}

const vercel = {
  "ignoreCommand": "bash -lc 'if [ \"$VERCEL_ENV\" = \"production\" ] && [ \"$VERCEL_GIT_COMMIT_REF\" != \"bmc-vercel\" ]; then exit 0; else exit 1; fi'",
  "headers": [
    { "source": "/sw.js", "headers": [ { "key": "Cache-Control", "value": "no-cache, no-store, must-revalidate" } ] },
    { "source": "/", "headers": [ { "key": "Cache-Control", "value": "no-store, max-age=0" } ] },
    { "source": "/(.*).html", "headers": [ { "key": "Cache-Control", "value": "no-store, max-age=0" } ] },
    { "source": "/hero/(.*)", "headers": [ { "key": "Cache-Control", "value": "public, max-age=31536000, immutable" } ] },
    { "source": "/hero-rewrite.js", "headers": [ { "key": "Cache-Control", "value": "no-store, max-age=0" } ] }
  ]
};
await writeFile('vercel.json', JSON.stringify(vercel,null,2));
