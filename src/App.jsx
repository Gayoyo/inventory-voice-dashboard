import { BrowserRouter, Routes, Route } from "react-router-dom";
import { useState } from "react";
import DashboardLayout from "./layouts/DashboardLayout";
import Dashboard from "./pages/Dashboard";
import Report from "./pages/Report";
import Produk from "./pages/Produk";
import Penjualan from "./pages/Penjualan";
import ForecastingAnomali from "./pages/ForecastingAnomali";
import VoiceCommand from "./pages/VoiceCommand";

export default function App() {
  const [produk, setProduk] = useState([
    { id: 1, nama: "Produk A", kategori: "Minuman", harga: 10000, stok: 20 },
    { id: 2, nama: "Produk B", kategori: "Snack", harga: 5000, stok: 15 },
  ]);

  // ✅ tambahkan state penjualan
  const [penjualan, setPenjualan] = useState([]);

  return (
    <BrowserRouter>
      <Routes>
        <Route element={<DashboardLayout />}>
          <Route path="/" element={<Dashboard />} />
          <Route path="/report" element={<Report />} />

          {/* Produk Page */}
          <Route
            path="/produk"
            element={<Produk produk={produk} setProduk={setProduk} />}
          />

          {/* Penjualan Page */}
          <Route
            path="/penjualan"
            element={
              <Penjualan
                produk={produk}
                setProduk={setProduk}
                penjualan={penjualan}
                setPenjualan={setPenjualan}
              />
            }
          />

          {/* Forecasting + Anomali */}
          <Route path="/forecasting" element={<ForecastingAnomali />} />

          {/* Voice Command */}
          <Route
            path="/voice"
            element={<VoiceCommand produk={produk} setProduk={setProduk} />}
          />

          <Route path="/pengaturan" element={<div>Pengaturan Page</div>} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}
