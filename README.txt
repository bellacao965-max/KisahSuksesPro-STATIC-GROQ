KisahSukses - Static app with client-side Groq option
-----------------------------------------------------

This is a static site (index.html, style.css, client.js, config.js).
It provides:
- Left: Google search iframe + Quote
- Center: Chat AI (client-side Groq if you supply GROQ_API_KEY in config.js; otherwise mock)
- Right: YouTube mini (random) + Game iframe

IMPORTANT SECURITY NOTE:
- Embedding your GROQ_API_KEY in config.js exposes it publicly. Any user with access to your site can view and reuse your key.
- Recommended: deploy a small server proxy to keep keys secret. This package includes client-side calls for simplicity because you requested static.
- If you want, I can provide a small server proxy (Node.js) that securely stores the key and forwards requests.

How to use:
1. Edit config.js and paste your GROQ_API_KEY (if you want real AI).
2. Upload the folder as a ZIP to Render (Static Site), Netlify, Vercel, or GitHub Pages.
3. Ensure index.html is at root and Publish Directory is "/".

