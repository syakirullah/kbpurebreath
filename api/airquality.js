export default async function handler(req, res) {
  const lat = req.query.lat || '3.1579'; // Default: Kuala Lumpur
  const lon = req.query.lon || '101.7118';
  const token = 'demo'; // Tukar nanti kalau guna API sebenar

  try {
    const response = await fetch(
      `https://api.waqi.info/feed/geo:${lat};${lon}/?token=${token}`
    );
    const data = await response.json();

    if (data.status === 'ok') {
      res.status(200).json({
        city: data.data.city.name,
        aqi: data.data.aqi,
        dominentpol: data.data.dominentpol,
        time: data.data.time.s,
      });
    } else {
      res.status(400).json({ error: 'Data not found' });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Server error' });
  }
}
