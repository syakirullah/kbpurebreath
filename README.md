KB Pure Breath — Live AQI (Kampung Baru, KL)

Files included:
- index.html (frontend)
- style.css
- script.js (fetches /api/fetchData)
- api/fetchData.js (Vercel serverless proxy to OpenAQ)
- vercel.json (Vercel config)
- package.json

Deployment steps:
1. Create a GitHub repo (or use your existing empty repo).
2. Upload these files to the repo root.
3. In Vercel: Import project from GitHub (choose this repo). Framework: Other. Deploy.
4. After deploy, open the site URL. The frontend calls /api/fetchData hosted in the same project.
5. If you want different coordinates, edit api/fetchData.js LAT/LON variables and redeploy.

Notes:
- AQI is an ESTIMATE computed from PM values using EPA breakpoints (for quick public guidance).
- OpenAQ station coverage varies; if no nearby stations exist, PM values may be null.
