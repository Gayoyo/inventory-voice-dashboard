import { Line, Pie } from "react-chartjs-2";
import React, { useEffect, useState } from "react";
import VoiceCommand from "../pages/VoiceCommand";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  ArcElement,
} from "chart.js";
import StatCard from "../components/StatCard";
import ChartCard from "../components/ChartCard";

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  ArcElement
);

export default function Dashboard() {
  const [inventory, setInventory] = useState([]);

  const fetchInventory = async () => {
    const res = await fetch("http://localhost:5000/inventory");
    const data = await res.json();
    setInventory(data);
  };

  useEffect(() => {
    fetchInventory();
  }, []);

  // Dummy data untuk chart
  const lineData = {
    labels: ["Sen", "Sel", "Rab", "Kam", "Jum", "Sab", "Min"],
    datasets: [
      {
        label: "Penjualan",
        data: [12, 19, 8, 15, 22, 18, 25],
        borderColor: "#3B82F6",
        backgroundColor: "rgba(59, 130, 246, 0.2)",
        tension: 0.3,
        fill: true,
      },
    ],
  };

  const pieData = {
    labels: ["Elektronik", "Pakaian", "Makanan", "Lainnya"],
    datasets: [
      {
        data: [40, 25, 20, 15],
        backgroundColor: ["#3B82F6", "#10B981", "#F59E0B", "#EF4444"],
      },
    ],
  };

  return (
    <div className="p-6 space-y-6 w-full">
      <h1 className="text-2xl font-bold mb-4">📦 Inventory Dashboard</h1>
      {/* Table */}
      <table className="w-full border mt-4">
        <thead>
          <tr className="bg-gray-100">
            <th className="p-2 border">Produk</th>
            <th className="p-2 border">Lokasi</th>
            <th className="p-2 border">Jumlah</th>
          </tr>
        </thead>
        <tbody>
          {inventory.map((item) => (
            <tr key={item.id} className="border">
              <td className="p-2">{item.product}</td>
              <td className="p-2">{item.location}</td>
              <td className="p-2">{item.qty}</td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* Stats */}
      <div className="grid grid-cols-4 gap-4">
        <StatCard title="Total Produk" value={inventory.length} color="text-blue-500" />
        <StatCard
          title="Stok Rendah"
          value={inventory.filter((i) => i.qty < 5).length}
          color="text-red-500"
        />
        <StatCard title="Penjualan Bulan Ini" value="350" color="text-green-500" />
        <StatCard title="Alert Aktif" value="3" color="text-yellow-500" />
      </div>

      {/* Charts */}
      <div className="grid grid-cols-2 gap-4">
        <ChartCard title="Penjualan Harian">
          <Line data={lineData} />
        </ChartCard>
        <ChartCard title="Kategori Produk">
          <Pie data={pieData} />
        </ChartCard>
      </div>
    </div>
  );
}
