import { useState } from "react";
import * as XLSX from "xlsx";
import jsPDF from "jspdf";
import "jspdf-autotable";

export default function Penjualan({ produk, setProduk, penjualan, setPenjualan }) {
  const [form, setForm] = useState({ tanggal: "", produk: "", jumlah: "" });
  const [editingId, setEditingId] = useState(null);

  const [filter, setFilter] = useState({ start: "", end: "" });

  // 🔎 data penjualan setelah difilter
  const filteredPenjualan = penjualan.filter((p) => {
    if (!filter.start && !filter.end) return true;
    const tgl = new Date(p.tanggal);
    const start = filter.start ? new Date(filter.start) : null;
    const end = filter.end ? new Date(filter.end) : null;

    if (start && tgl < start) return false;
    if (end && tgl > end) return false;
    return true;
  });

  const hitungTotal = () => {
    const produkDipilih = produk.find((p) => p.nama === form.produk);
    if (produkDipilih && form.jumlah) return produkDipilih.harga * Number(form.jumlah);
    return 0;
  };

  const grandTotal = penjualan.reduce((sum, t) => sum + t.total, 0);

  // 📂 Export ke Excel (pakai data yg difilter)
  const exportExcel = () => {
    const ws = XLSX.utils.json_to_sheet(
      filteredPenjualan.map((p) => ({
        ID: p.id,
        Tanggal: p.tanggal,
        Produk: p.produk,
        Jumlah: p.jumlah,
        Total: p.total,
      }))
    );
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Penjualan");
    XLSX.writeFile(wb, "laporan_penjualan.xlsx");
  };

  // 📂 Export ke PDF (pakai data yg difilter)
  const exportPDF = () => {
    const doc = new jsPDF();
    doc.text("Laporan Penjualan", 14, 15);

    // kalau ada filter tampilkan periode
    if (filter.start || filter.end) {
      doc.text(
        `Periode: ${filter.start || "-"} s/d ${filter.end || "-"}`,
        14,
        25
      );
    }

    doc.autoTable({
      startY: filter.start || filter.end ? 35 : 25,
      head: [["ID", "Tanggal", "Produk", "Jumlah", "Total"]],
      body: filteredPenjualan.map((p) => [
        p.id,
        p.tanggal,
        p.produk,
        p.jumlah,
        `Rp ${p.total.toLocaleString()}`,
      ]),
    });
    doc.text(
      `Grand Total: Rp ${grandTotal.toLocaleString()}`,
      14,
      doc.lastAutoTable.finalY + 10
    );
    doc.save("laporan_penjualan.pdf");
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!form.tanggal || !form.produk || !form.jumlah) return;

    const produkDipilih = produk.find((p) => p.nama === form.produk);
    const jumlah = Number(form.jumlah);

    if (!produkDipilih) {
      alert("❌ Produk tidak ditemukan!");
      return;
    }

    if (editingId) {
      // 🔥 mode edit
      const transaksiLama = penjualan.find((t) => t.id === editingId);

      // balikin stok lama
      setProduk(
        produk.map((p) =>
          p.nama === transaksiLama.produk
            ? { ...p, stok: p.stok + transaksiLama.jumlah }
            : p
        )
      );

      if (produkDipilih.stok < jumlah) {
        alert("❌ Stok tidak mencukupi!");
        return;
      }

      const total = produkDipilih.harga * jumlah;
      const updated = penjualan.map((t) =>
        t.id === editingId ? { ...t, ...form, jumlah, total } : t
      );
      setPenjualan(updated);

      // kurangi stok baru
      setProduk(
        produk.map((p) =>
          p.nama === form.produk ? { ...p, stok: p.stok - jumlah } : p
        )
      );

      setEditingId(null);
    } else {
      // ✨ tambah transaksi baru
      if (produkDipilih.stok < jumlah) {
        alert("❌ Stok tidak mencukupi!");
        return;
      }

      const total = produkDipilih.harga * jumlah;

      const newPenjualan = {
        id: penjualan.length + 1,
        ...form,
        jumlah,
        total,
      };

      setPenjualan([...penjualan, newPenjualan]);

      // kurangi stok produk
      setProduk(
        produk.map((p) =>
          p.nama === form.produk ? { ...p, stok: p.stok - jumlah } : p
        )
      );
    }

    setForm({ tanggal: "", produk: "", jumlah: "" });
  };

  const handleDelete = (id) => {
    const transaksi = penjualan.find((t) => t.id === id);
    if (!transaksi) return;

    // balikin stok
    setProduk(
      produk.map((p) =>
        p.nama === transaksi.produk ? { ...p, stok: p.stok + transaksi.jumlah } : p
      )
    );

    // hapus transaksi
    setPenjualan(penjualan.filter((t) => t.id !== id));
  };

  const handleEdit = (transaksi) => {
    setForm({
      tanggal: transaksi.tanggal,
      produk: transaksi.produk,
      jumlah: transaksi.jumlah,
    });
    setEditingId(transaksi.id);
  };

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">🛒 Transaksi Penjualan</h1>

      {/* Form input penjualan */}
      <form onSubmit={handleSubmit} className="space-y-4 mb-6">
        <div>
          <label className="block mb-1">Tanggal</label>
          <input
            type="date"
            value={form.tanggal}
            onChange={(e) => setForm({ ...form, tanggal: e.target.value })}
            className="border p-2 rounded w-full"
          />
        </div>
        <div>
          <label className="block mb-1">Produk</label>
          <select
            value={form.produk}
            onChange={(e) => setForm({ ...form, produk: e.target.value })}
            className="border p-2 rounded w-full"
          >
            <option value="">-- Pilih Produk --</option>
            {produk.map((p) => (
              <option key={p.id} value={p.nama}>
                {p.nama} (stok: {p.stok})
              </option>
            ))}
          </select>
        </div>
        <div>
          <label className="block mb-1">Jumlah</label>
          <input
            type="number"
            value={form.jumlah}
            onChange={(e) => setForm({ ...form, jumlah: e.target.value })}
            className="border p-2 rounded w-full"
          />
        </div>
        <div>
          <strong>Total: Rp {hitungTotal().toLocaleString()}</strong>
        </div>
        <button
          type="submit"
          className={`px-4 py-2 rounded text-white ${
            editingId ? "bg-green-500" : "bg-blue-500"
          }`}
        >
          {editingId ? "Update" : "Simpan"}
        </button>
        {editingId && (
          <button
            type="button"
            onClick={() => {
              setForm({ tanggal: "", produk: "", jumlah: "" });
              setEditingId(null);
            }}
            className="ml-2 bg-gray-500 text-white px-4 py-2 rounded"
          >
            Batal
          </button>
        )}
      </form>
{/* 🔎 Filter tanggal */}
      <div className="flex gap-4 mb-4">
        <div>
          <label className="block text-sm">Dari Tanggal</label>
          <input
            type="date"
            value={filter.start}
            onChange={(e) => setFilter({ ...filter, start: e.target.value })}
            className="border p-2 rounded"
          />
        </div>
        <div>
          <label className="block text-sm">Sampai Tanggal</label>
          <input
            type="date"
            value={filter.end}
            onChange={(e) => setFilter({ ...filter, end: e.target.value })}
            className="border p-2 rounded"
          />
        </div>
      </div>

      {/* 🔽 Tabel Penjualan isi pakai filteredPenjualan */}
      <table className="w-full border mt-4">
        <thead>
          <tr className="bg-gray-100">
            <th className="border px-3 py-2">ID</th>
            <th className="border px-3 py-2">Tanggal</th>
            <th className="border px-3 py-2">Produk</th>
            <th className="border px-3 py-2">Jumlah</th>
            <th className="border px-3 py-2">Total</th>
          </tr>
        </thead>
        <tbody>
          {filteredPenjualan.map((p) => (
            <tr key={p.id}>
              <td className="border px-3 py-2">{p.id}</td>
              <td className="border px-3 py-2">{p.tanggal}</td>
              <td className="border px-3 py-2">{p.produk}</td>
              <td className="border px-3 py-2">{p.jumlah}</td>
              <td className="border px-3 py-2">Rp {p.total.toLocaleString()}</td>
                <button
                  onClick={() => handleEdit(p)}
                  className="bg-yellow-500 text-white px-2 py-1 rounded"
                >
                  Edit
                </button>
                <button
                  onClick={() => handleDelete(p.id)}
                  className="bg-red-500 text-white px-2 py-1 rounded"
                >
                  Hapus
                </button>
            </tr>
          ))}
          {penjualan.length === 0 && (
            <tr>
              <td colSpan="6" className="text-center p-4 text-gray-500">
                Belum ada transaksi
              </td>
            </tr>
          )}
        </tbody>
      </table>

      {/* 🔥 Grand Total */}
      <div className="mt-4 text-right font-bold text-lg">
        Grand Total: Rp {grandTotal.toLocaleString()}
      </div>

      {/* 📂 Tombol Export */}
      <div className="mt-4 flex justify-end gap-3">
        <button
          onClick={exportExcel}
          className="bg-green-600 text-white px-4 py-2 rounded"
        >
          Export Excel
        </button>
        <button
          onClick={exportPDF}
          className="bg-red-600 text-white px-4 py-2 rounded"
        >
          Export PDF
        </button>
      </div>
    </div>
  );
}