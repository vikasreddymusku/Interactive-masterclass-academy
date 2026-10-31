/* Tinitiate Dashboard Tutor — one shared loader for all interactive learning pages */
(()=>{'use strict';
 const script=document.currentScript||document.querySelector('script[data-tutor-loader]');
 if(!script)return;
 const marker='/dashboard-tutor/client/tour.js';
 const siteRoot=new URL(script.src.slice(0,script.src.indexOf(marker)+1));
 const page=decodeURIComponent(location.pathname).replace(siteRoot.pathname,'').replace(/^\/+/, '');
 const id=page.replace(/\.html$/,'').replace(/[^a-zA-Z0-9]+/g,'-').replace(/^-|-$/g,'').toLowerCase();
 if(!page.endsWith('.html'))return;
 const base=new URL('assets/dashboard-tutorials/'+id+'.mp4',siteRoot);
 const metadata=new URL('assets/dashboard-tutorials/'+id+'.json',siteRoot);
 const endpoint=new URL('__tutor/api/record',siteRoot);
 function dom(tag,attrs={},text=''){const e=document.createElement(tag);for(const [k,v]of Object.entries(attrs)){if(k==='class')e.className=v;else e.setAttribute(k,v);}if(text)e.textContent=text;return e;}
 async function start(){if(document.getElementById('tutor-video-panel'))return;
  const main=document.querySelector('main')||document.body;
  let anchor=document.querySelector('main #dashboard')||document.querySelector('main #sec-dag-simulator')||document.querySelector('main #workflow')||document.querySelector('main #player');
  if(!anchor){const candidates=[...main.querySelectorAll('section,article,[id]')].filter(el=>el.querySelectorAll('button,input,select,textarea').length>=2);anchor=candidates.sort((a,b)=>b.querySelectorAll('button,input,select,textarea').length-a.querySelectorAll('button,input,select,textarea').length)[0]||main.firstElementChild;}
  if(!anchor)return;
  const panel=dom('section',{id:'tutor-video-panel','aria-label':'Guided dashboard tutorial'});
  panel.innerHTML=`<div class="tutor-panel-heading"><div><span class="tutor-eyebrow">TINITIATE AI · GUIDED TUTORIAL</span><h2>Dashboard Walkthrough</h2><p>Watch the instructor demonstrate this interactive dashboard before trying it yourself.</p></div><button type="button" class="tutor-record" id="tutor-record"><span aria-hidden="true">●</span> Record Tutorial</button></div><div class="tutor-video-shell" id="tutor-video-shell"><div class="tutor-empty" id="tutor-empty"><div class="tutor-video-symbol" aria-hidden="true">▷</div><strong>Your guided tutorial video will appear here</strong><span>Select Record Tutorial to automatically demonstrate this dashboard.</span></div></div><p class="tutor-status" id="tutor-status" role="status" aria-live="polite"></p>`;
  main.insertBefore(panel,anchor===main?main.firstChild:anchor);
  const button=panel.querySelector('#tutor-record'),status=panel.querySelector('#tutor-status'),shell=panel.querySelector('#tutor-video-shell');
  const showVideo=()=>{shell.textContent='';const video=dom('video',{controls:'',playsinline:'',preload:'metadata','aria-label':'Recorded dashboard tutorial'});video.src=base.href+'?v='+Date.now();shell.appendChild(video);button.innerHTML='<span aria-hidden="true">●</span> Re-record Tutorial';status.textContent='Tutorial recorded. Watch it above, then explore the interactive dashboard below.';};
  try{const response=await fetch(metadata.href,{cache:'no-cache'});if(response.ok){const result=await response.json();if(result.status==='complete')showVideo();}}catch{}
  button.addEventListener('click',async()=>{
   if(button.disabled)return;button.disabled=true;button.textContent='Preparing recorder…';status.textContent='Scanning dashboard and preparing recording. Do not close this tab.';
   try{
    const r=await fetch(endpoint.href,{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({page})});
    if(!r.ok){const err=await r.json().catch(()=>({}));throw Error(err.error||`HTTP ${r.status} — run the local authoring server to record`);}
    const job=await r.json();const url=new URL('__tutor/api/jobs/'+encodeURIComponent(job.id),siteRoot);
    let complete=false;
    for(let n=0;n<3000;n++){
      await new Promise(resolve=>setTimeout(resolve,1200));
      const poll=await fetch(url.href,{cache:'no-store'});if(!poll.ok)throw Error('Unable to query recording progress');
      const state=await poll.json();status.textContent=state.state==='recording'?`Recording ${state.completed+1} of ${state.total}: ${state.step||'Dashboard demonstration'}`:state.state==='narrating'?'Generating voice-over…':state.state==='rendering'?'Combining video and narration…':`Recording status: ${state.state}`;
      if(state.state==='complete'){showVideo();complete=true;break;}
      if(state.state==='failed')throw Error(state.error||'Recording failed');
    }
    if(!complete)throw Error('Polling timed out; check the local recording server');
   }catch(err){status.textContent=`Recording unavailable: ${err.message}. On a published static site, tutorial videos remain watchable; only the local authoring service can create them.`;}
   finally{button.disabled=false;if(!shell.querySelector('video'))button.innerHTML='<span aria-hidden="true">●</span> Record Tutorial';}
  });
 }
 const css=new URL('dashboard-tutor/client/tour.css',siteRoot);const link=dom('link',{rel:'stylesheet',href:css.href});document.head.appendChild(link);
 if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',start,{once:true});else start();
})();
