import { useEffect, useState } from "react";
import {
  BarChart,
  Bar,
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from "recharts";

export default function Report() {
  const [salesData, setSalesData] = useState([]);
  const [topProducts, setTopProducts] = useState([]);
  const [lowStock, setLowStock] = useState([]);

  useEffect(() => {
    // 🚀 nanti bisa ganti fetch ke backend (misalnya /report)
    setSalesData([
      { month: "Jan", total: 1200 },
      { month: "Feb", total: 1800 },
      { month: "Mar", total: 1400 },
      { month: "Apr", total: 2000 },
      { month: "Mei", total: 1700 },
      { month: "Jun", total: 2500 },
    ]);

    setTopProducts([
      { name: "Produk A", sold: 350 },
      { name: "Produk B", sold: 280 },
      { name: "Produk C", sold: 220 },
      { name: "Produk D", sold: 180 },
      { name: "Produk E", sold: 150 },
    ]);

    setLowStock([
      { name: "Produk X", stock: 5 },
      { name: "Produk Y", stock: 3 },
      { name: "Produk Z", stock: 2 },
    ]);
  }, []);

  const COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042", "#8884D8"];

  return (
    <div className="p-6 space-y-6">
      <h1 className="text-2xl font-bold">📊 Laporan Rekap</h1>

      {/* Chart Penjualan Bulanan */}
      <div className="bg-white dark:bg-gray-800 p-4 shadow rounded-lg">
  <h2 className="text-lg font-semibold mb-2 text-gray-700 dark:text-gray-200">
    Penjualan Bulanan
  </h2>
        <ResponsiveContainer width="100%" height={300}>
          <LineChart data={salesData}>
            <XAxis dataKey="month" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Line type="monotone" dataKey="total" stroke="#8884d8" />
          </LineChart>
        </ResponsiveContainer>
      </div>

      {/* Produk Terlaris */}
      <div className="bg-white p-4 shadow rounded-lg">
        <h2 className="text-lg font-semibold mb-2">Top 5 Produk Terlaris</h2>
        <ResponsiveContainer width="100%" height={300}>
          <PieChart>
            <Pie
              data={topProducts}
              dataKey="sold"
              nameKey="name"
              cx="50%"
              cy="50%"
              outerRadius={100}
              label
            >
              {topProducts.map((entry, index) => (
                <Cell
                  key={`cell-${index}`}
                  fill={COLORS[index % COLORS.length]}
                />
              ))}
            </Pie>
            <Tooltip />
            <Legend />
          </PieChart>
        </ResponsiveContainer>
      </div>

      {/* Stok Hampir Habis */}
      <div className="bg-white p-4 shadow rounded-lg">
        <h2 className="text-lg font-semibold mb-2">Stok Hampir Habis</h2>
        <table className="w-full border border-gray-200">
          <thead className="bg-gray-100">
            <tr>
              <th className="p-2 border">Produk</th>
              <th className="p-2 border">Sisa Stok</th>
            </tr>
          </thead>
          <tbody>
            {lowStock.map((item, idx) => (
              <tr key={idx} className="text-center">
                <td className="p-2 border">{item.name}</td>
                <td className="p-2 border text-red-500 font-semibold">
                  {item.stock}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
