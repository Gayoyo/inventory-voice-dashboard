// src/pages/ForecastingAnomali.jsx
import { useEffect, useState } from "react";
import {
  LineChart, Line, XAxis, YAxis, Tooltip, Legend, ResponsiveContainer,
} from "recharts";

export default function ForecastingAnomali() {
  const [forecastData, setForecastData] = useState([]);
  const [anomaliData, setAnomaliData] = useState([]);

  useEffect(() => {
    // 📊 dummy data
    const dummyForecast = [
      { bulan: "Jan", prediksi: 120, aktual: 130 },
      { bulan: "Feb", prediksi: 150, aktual: 400 }, // anomali
      { bulan: "Mar", prediksi: 170, aktual: 180 },
      { bulan: "Apr", prediksi: 200, aktual: 800 }, // anomali
      { bulan: "Mei", prediksi: 220, aktual: 210 },
    ];
    setForecastData(dummyForecast);

    // 🔎 deteksi anomali sederhana (selisih > 100)
    const detected = dummyForecast.filter((d) =>
      Math.abs(d.prediksi - d.aktual) > 100
    );
    setAnomaliData(detected);
  }, []);

  return (
    <div className="p-6 space-y-6">
      <h1 className="text-2xl font-bold">📈 Forecasting & 🚨 Anomali</h1>

      {/* Forecasting Chart */}
      <div className="bg-white p-4 shadow rounded-lg">
        <h2 className="text-lg font-semibold mb-2">Grafik Prediksi vs Aktual</h2>
        <ResponsiveContainer width="100%" height={300}>
          <LineChart data={forecastData}>
            <XAxis dataKey="bulan" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Line type="monotone" dataKey="prediksi" stroke="#8884d8" />
            <Line type="monotone" dataKey="aktual" stroke="#82ca9d" />
          </LineChart>
        </ResponsiveContainer>
      </div>

      {/* Tabel Anomali */}
      <div className="bg-white p-4 shadow rounded-lg">
        <h2 className="text-lg font-semibold mb-2">Daftar Anomali</h2>
        <table className="w-full border border-gray-200">
          <thead className="bg-gray-100">
            <tr>
              <th className="p-2 border">Bulan</th>
              <th className="p-2 border">Prediksi</th>
              <th className="p-2 border">Aktual</th>
              <th className="p-2 border">Selisih</th>
            </tr>
          </thead>
          <tbody>
            {anomaliData.length === 0 ? (
              <tr>
                <td colSpan="4" className="text-center p-2">
                  ✅ Tidak ada anomali
                </td>
              </tr>
            ) : (
              anomaliData.map((item, idx) => (
                <tr key={idx} className="text-center">
                  <td className="p-2 border">{item.bulan}</td>
                  <td className="p-2 border">{item.prediksi}</td>
                  <td className="p-2 border text-red-500 font-semibold">
                    {item.aktual}
                  </td>
                  <td className="p-2 border">
                    {Math.abs(item.prediksi - item.aktual)}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
