const fs = require('node:fs');
const fsp = fs.promises;

async function download(url, dest) {
  const res = await fetch(url);
  if (!res.ok) throw new Error('fetch ' + url + ' ' + res.status);
  const buf = Buffer.from(await res.arrayBuffer());
  await fsp.writeFile(dest, buf);
}

async function run() {
  const base = 'https://bmcorebolt1.vercel.app';
  const html = await (await fetch(base)).text();
  const m = html.match(/\/assets\/index-[A-Za-z0-9]+\.js/);
  if (!m) process.exit(0);
  const asset = m[0];
  const js = await (await fetch(base + asset)).text();
  const urls = Array.from(new Set((js.match(/https:\/\/images\.pexels\.com[^\s"'\\)]+/g) || [])));
  await fsp.mkdir('public/hero', { recursive: true });
  const map = {};
  let i = 0;
  for (const u of urls) {
    i++;
    const name = 'img_' + String(i).padStart(2, '0') + '.jpg';
    const dest = 'public/hero/' + name;
    try { await download(u, dest); } catch {}
    map[u] = '/hero/' + name;
  }
  await fsp.writeFile('public/hero/map.json', JSON.stringify(urls, null, 2));
  await fsp.writeFile('public/hero/map.local.json', JSON.stringify(map, null, 2));

  const rewrite = `(function(){
    function rewrite(map){
      function loc(u){return map[u]||u}
      function fix(){
        document.querySelectorAll('img[src]').forEach(function(i){
          var s=i.getAttribute('src'); var p=loc(s); if(p!==s) i.setAttribute('src',p);
        });
        document.querySelectorAll('[style*="background"],[style*="url("]').forEach(function(el){
          var s=el.getAttribute('style')||'';
          el.setAttribute('style', s.replace(/https:\\/\\/images\\.pexels\\.com[^"') ]+/g, function(m){ return loc(m); }));
        });
      }
      if(document.readyState!=='loading'){fix()}else{document.addEventListener('DOMContentLoaded',fix)}
      new MutationObserver(fix).observe(document.documentElement,{subtree:true,attributes:true,attributeFilter:['src','style']})
    }
    fetch('/hero/map.local.json',{cache:'no-store'}).then(function(r){return r.json()}).then(rewrite).catch(function(){})
  })();`;
  await fsp.writeFile('public/hero-rewrite.js', rewrite);

  let idx = await fsp.readFile('index.html','utf8');
  if (!/hero-rewrite\.js/.test(idx)) {
    idx = idx.replace('</head>', `<script src="/hero-rewrite.js?v=${Date.now()}"></script></head>`);
    await fsp.writeFile('index.html', idx);
  }

  const vercel = {
    ignoreCommand: "bash -lc 'if [ \"$VERCEL_ENV\" = \"production\" ] && [ \"$VERCEL_GIT_COMMIT_REF\" != \"bmc-vercel\" ]; then exit 0; else exit 1; fi'",
    headers: [
      { source: "/sw.js", headers: [{ key: "Cache-Control", value: "no-cache, no-store, must-revalidate" }] },
      { source: "/", headers: [{ key: "Cache-Control", value: "no-store, max-age=0" }] },
      { source: "/(.*).html", headers: [{ key: "Cache-Control", value: "no-store, max-age=0" }] },
      { source: "/hero/(.*)", headers: [{ key: "Cache-Control", value: "public, max-age=31536000, immutable" }] },
      { source: "/hero-rewrite.js", headers: [{ key: "Cache-Control", value: "no-store, max-age=0" }] }
    ]
  };
  await fsp.writeFile('vercel.json', JSON.stringify(vercel, null, 2));
}
run().catch(()=>process.exit(0));
