'use client';
import { useEffect, useState } from 'react';

export default function Home() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  const fetchData = async () => {
    try {
      setLoading(true);
      const res = await fetch('/api/airquality');
      const result = await res.json();
      setData(result);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
    const interval = setInterval(fetchData, 5 * 60 * 1000); // auto refresh setiap 5 minit
    return () => clearInterval(interval);
  }, []);

  return (
    <main className="min-h-screen flex flex-col items-center justify-center bg-gray-900 text-white p-6">
      <h1 className="text-2xl font-bold mb-4">Kampung Baru Air Quality (KL)</h1>

      {loading ? (
        <p>Loading data...</p>
      ) : data?.error ? (
        <p className="text-red-400">{data.error}</p>
      ) : (
        <div className="bg-gray-800 p-6 rounded-2xl shadow-lg text-center">
          <p className="text-lg">📍 {data.city}</p>
          <p className="text-4xl font-bold my-2">AQI: {data.aqi}</p>
          <p>Dominant Pollutant: {data.dominentpol}</p>
          <p className="text-sm text-gray-400 mt-2">Last update: {data.time}</p>
        </div>
      )}

      <button
        onClick={fetchData}
        className="mt-6 bg-blue-600 hover:bg-blue-700 px-4 py-2 rounded-lg"
      >
        🔄 Refresh
      </button>
    </main>
  );
}

