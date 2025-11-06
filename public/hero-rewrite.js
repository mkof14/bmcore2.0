(function(){
  const MAP_URL="/hero/map.local.json";
  const PEX=/https?:\/\/images\.pexels\.com\/[^"')\s]+/g;
  let map=null, seq=null;

  function pickLocal(){
    if(!seq){
      seq=[1,2,3,4,5,6,7,8,9,10,11,12,13,14].map(n=>`/hero/img_${String(n).padStart(2,'0')}.jpg`);
    }
    const i=Math.floor(Math.random()*seq.length);
    return seq[i];
  }

  function resolveFor(el, current){
    if(!current) return current;
    try{
      const url=new URL(current, location.origin);
      if(url.hostname!=="images.pexels.com") return current;
    }catch(e){ return current; }
    if(map){
      const id=(el.getAttribute('data-category-id')||'').trim();
      if(id && map[id]) return map[id];
    }
    return pickLocal();
  }

  function fixNode(el){
    if(el.tagName==="IMG"){
      const cur=el.getAttribute('src');
      const next=resolveFor(el, cur);
      if(next && next!==cur) el.setAttribute('src', next);
    }
    const style=el.getAttribute('style')||'';
    if(PEX.test(style)){
      const replaced=style.replace(PEX, m=>resolveFor(el,m));
      if(replaced!==style) el.setAttribute('style', replaced);
    }
    PEX.lastIndex=0;
  }

  function sweep(){
    document.querySelectorAll('img[src], [style*="background"], [style*="url("]').forEach(fixNode);
  }

  function start(){
    fetch(MAP_URL,{cache:'no-store'}).then(r=>r.json()).then(j=>{map=j;}).catch(()=>{map=null;});
    sweep();
    new MutationObserver(muts=>{
      for(const m of muts){
        if(m.type==="attributes"){ fixNode(m.target); }
        if(m.addedNodes) m.addedNodes.forEach(n=>{
          if(n.nodeType===1){ fixNode(n); n.querySelectorAll && n.querySelectorAll('*').forEach(fixNode); }
        });
      }
    }).observe(document.documentElement,{subtree:true,attributes:true,attributeFilter:['src','style','data-category-id'],childList:true});
    setInterval(sweep, 3000);
  }

  if(document.readyState!=="loading") start();
  else document.addEventListener("DOMContentLoaded", start);
})();
