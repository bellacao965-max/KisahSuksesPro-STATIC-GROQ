// client-side logic: Google search iframe, quotes, YouTube mini, mock/Groq chat
const cfg = window.APP_CONFIG || {};
const YT_IDS = cfg.YOUTUBE_IDS || [];

function setQuote(text){
  document.getElementById('quote').textContent = text;
}

const QUOTES = [
  "Sukses bukan kunci kebahagiaan — kebahagiaan adalah kunci sukses.",
  "Kerja keras hari ini, cerita sukses esok hari.",
  "Jangan takut gagal; takutlah jika tidak pernah mencoba.",
  "Mulailah dari yang kecil, konsistenlah, dan lihat perubahan."
];

function nextQuote(){
  const q = QUOTES[Math.floor(Math.random()*QUOTES.length)];
  setQuote(q);
}

document.getElementById('next-quote').addEventListener('click', nextQuote);

// Google search
document.getElementById('search-btn').addEventListener('click', ()=>{
  const q = document.getElementById('q').value.trim();
  if(!q) return;
  const url = 'https://www.google.com/search?q=' + encodeURIComponent(q);
  document.getElementById('search-frame').src = url;
});

// YouTube mini random
let currentYT = null;
function openRandomYT(){
  if(!YT_IDS.length) return;
  const id = YT_IDS[Math.floor(Math.random()*YT_IDS.length)];
  currentYT = id;
  const wrap = document.getElementById('yt-mini');
  wrap.innerHTML = `<iframe src="https://www.youtube-nocookie.com/embed/${id}?autoplay=1&modestbranding=1" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>`;
}
document.getElementById('yt-next').addEventListener('click', openRandomYT);
openRandomYT(); // initial

// Chat AI - if GROQ_API_KEY provided, call Groq; otherwise mock reply
function appendChat(who, text){
  const el = document.createElement('div');
  el.textContent = who + ': ' + text;
  document.getElementById('chat-log').appendChild(el);
  document.getElementById('chat-log').scrollTop = document.getElementById('chat-log').scrollHeight;
}

async function sendChat(){
  const input = document.getElementById('chat-in');
  const msg = input.value.trim();
  if(!msg) return;
  appendChat('You', msg);
  input.value = '';
  appendChat('AI','...');

  const key = cfg.GROQ_API_KEY || "";
  const model = cfg.MODEL || "llama-3.1-8b-instant";

  if(!key){
    // mock behavior
    const reply = "Mock AI: " + msg.split("").reverse().join("");
    // replace last AI placeholder
    const nodes = document.getElementById('chat-log').childNodes;
    nodes[nodes.length-1].textContent = 'AI: ' + reply;
    document.getElementById('ai-status').textContent = 'AI: mock (no key)';
    return;
  }

  document.getElementById('ai-status').textContent = 'AI: calling Groq...';

  try{
    const res = await fetch("https://api.groq.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type":"application/json",
        "Authorization":"Bearer " + key
      },
      body: JSON.stringify({
        model: model,
        messages: [{role:"user", content: msg}]
      })
    });
    const j = await res.json();
    const reply = j?.choices?.[0]?.message?.content || j?.error?.message || 'No reply';
    const nodes = document.getElementById('chat-log').childNodes;
    nodes[nodes.length-1].textContent = 'AI: ' + reply;
    document.getElementById('ai-status').textContent = 'AI: done';
  }catch(e){
    const nodes = document.getElementById('chat-log').childNodes;
    nodes[nodes.length-1].textContent = 'AI: Error: ' + e;
    document.getElementById('ai-status').textContent = 'AI: error';
  }
}

document.getElementById('chat-send').addEventListener('click', sendChat);
document.getElementById('chat-in').addEventListener('keydown', (e)=>{ if(e.key==='Enter') sendChat(); });

// initialize quote
nextQuote();
