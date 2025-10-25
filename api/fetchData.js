export default async function handler(req, res) {
  try {
    const city = "Kuala Lumpur"; // default city
    const response = await fetch(`https://api.openaq.org/v2/latest?city=${encodeURIComponent(city)}&limit=5`);
    const data = await response.json();

    if (!data.results || data.results.length === 0) {
      return res.status(404).json({ error: "No data found for Kuala Lumpur" });
    }

    // Combine PM2.5 and PM10 readings
    let pm25 = null;
    let pm10 = null;
    data.results.forEach((station) => {
      station.measurements.forEach((m) => {
        if (m.parameter === "pm25") pm25 = m.value;
        if (m.parameter === "pm10") pm10 = m.value;
      });
    });

    // Calculate simple AQI estimate (rough, not official)
    let aqi = null;
    if (pm25 !== null) aqi = Math.round((pm25 / 12) * 50); // basic linear estimate

    // Categorize AQI
    let category = "Good";
    if (aqi > 50 && aqi <= 100) category = "Moderate";
    else if (aqi > 100 && aqi <= 150) category = "Unhealthy for Sensitive Groups";
    else if (aqi > 150 && aqi <= 200) category = "Unhealthy";
    else if (aqi > 200 && aqi <= 300) category = "Very Unhealthy";
    else if (aqi > 300) category = "Hazardous";

    res.status(200).json({
      city: city,
      aqi,
      category,
      pm25,
      pm10,
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch data", details: error.message });
  }
}
