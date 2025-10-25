// script.js — client-side logic
const API_BASE = '/api/fetchData'; // serverless endpoint (Vercel) — same project
const REFRESH_MS = 5 * 60 * 1000; // 5 minutes

const aqiValueEl = document.getElementById('aqiValue');
const aqiCategoryEl = document.getElementById('aqiCategory');
const aqiInfoEl = document.getElementById('aqiInfo');
const pm25El = document.getElementById('pm25');
const pm10El = document.getElementById('pm10');
const lastUpdatedEl = document.getElementById('lastUpdated');
const refreshBtn = document.getElementById('refreshBtn');

let labels = [], series25 = [], series10 = [];
const ctx = document.getElementById('pmChart').getContext('2d');
const chart = new Chart(ctx, {
  type: 'line',
  data: {
    labels,
    datasets: [
      { label: 'PM2.5 (µg/m³)', data: series25, tension:0.3, fill:true, backgroundColor:'rgba(38,166,154,0.08)', borderColor:'#26a69a', pointRadius:2 },
      { label: 'PM10 (µg/m³)', data: series10, tension:0.3, fill:true, backgroundColor:'rgba(74,160,230,0.06)', borderColor:'#4aa0e6', pointRadius:2 }
    ]
  },
  options: { responsive:true, maintainAspectRatio:false, scales:{ y:{ beginAtZero:true } } }
});

async function fetchData(){
  try{
    const res = await fetch(API_BASE);
    if(!res.ok) throw new Error('Fetch failed ' + res.status);
    const json = await res.json();
    if(json.error) throw new Error(json.error);

    const now = new Date();
    lastUpdatedEl.textContent = now.toLocaleString();

    const pm25 = json.pm25 !== null ? Number(json.pm25) : null;
    const pm10 = json.pm10 !== null ? Number(json.pm10) : null;
    const aqi = json.aqi !== null ? Number(json.aqi) : null;
    const cat = json.category || '—';

    aqiValueEl.textContent = aqi !== null ? aqi : '--';
    aqiCategoryEl.textContent = cat;
    aqiInfoEl.textContent = `PM2.5: ${pm25 !== null ? pm25.toFixed(1) : '--'} µg/m³ • PM10: ${pm10 !== null ? pm10.toFixed(1) : '--'} µg/m³`;
    pm25El.textContent = pm25 !== null ? pm25.toFixed(1) : '--';
    pm10El.textContent = pm10 !== null ? pm10.toFixed(1) : '--';

    // push chart
    const ts = now.toTimeString().split(' ')[0];
    labels.push(ts);
    series25.push(pm25 === null ? null : pm25);
    series10.push(pm10 === null ? null : pm10);
    if(labels.length > 24){ labels.shift(); series25.shift(); series10.shift(); }
    chart.update();
  }catch(err){
    console.error(err);
    aqiInfoEl.textContent = 'Live data unavailable.';
  }
}

refreshBtn.addEventListener('click', ()=>{ fetchData(); });

// seed with empty points
(function seed(){
  const now = Date.now();
  for(let i=12;i>0;i--){
    const t = new Date(now - i*5*60000); // 5-min steps
    labels.push(t.toTimeString().split(' ')[0]);
    series25.push(null); series10.push(null);
  }
  chart.update();
})();

// initial fetch + interval
fetchData();
setInterval(fetchData, REFRESH_MS);
