import { useState } from "react";

export default function Produk({ produk, setProduk }) {
  const [form, setForm] = useState({
    nama: "",
    kategori: "",
    harga: "",
    stok: "",
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!form.nama || !form.kategori || !form.harga || !form.stok) return;

    const newProduk = {
      id: produk.length + 1,
      nama: form.nama,
      kategori: form.kategori,
      harga: Number(form.harga),
      stok: Number(form.stok),
    };

    setProduk([...produk, newProduk]);
    setForm({ nama: "", kategori: "", harga: "", stok: "" });
  };

  return (
    <div className="p-6 space-y-6">
      <h1 className="text-2xl font-bold">📦 Daftar Produk</h1>

      {/* Form Tambah Produk */}
      <form
        onSubmit={handleSubmit}
        className="bg-white shadow p-4 rounded-lg space-y-3"
      >
        <div className="grid grid-cols-2 gap-3">
          <input
            type="text"
            placeholder="Nama Produk"
            className="border p-2 rounded"
            value={form.nama}
            onChange={(e) => setForm({ ...form, nama: e.target.value })}
          />
          <input
            type="text"
            placeholder="Kategori"
            className="border p-2 rounded"
            value={form.kategori}
            onChange={(e) => setForm({ ...form, kategori: e.target.value })}
          />
          <input
            type="number"
            placeholder="Harga"
            className="border p-2 rounded"
            value={form.harga}
            onChange={(e) => setForm({ ...form, harga: e.target.value })}
          />
          <input
            type="number"
            placeholder="Stok"
            className="border p-2 rounded"
            value={form.stok}
            onChange={(e) => setForm({ ...form, stok: e.target.value })}
          />
        </div>
        <button
          type="submit"
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
        >
          ➕ Tambah Produk
        </button>
      </form>

      {/* Tabel Produk */}
      <div className="bg-white shadow p-4 rounded-lg">
        <table className="w-full border border-gray-200">
          <thead className="bg-gray-100">
            <tr>
              <th className="p-2 border">Nama</th>
              <th className="p-2 border">Kategori</th>
              <th className="p-2 border">Harga</th>
              <th className="p-2 border">Stok</th>
            </tr>
          </thead>
          <tbody>
            {produk.map((p) => (
              <tr key={p.id} className="text-center">
                <td className="p-2 border">{p.nama}</td>
                <td className="p-2 border">{p.kategori}</td>
                <td className="p-2 border">Rp {p.harga.toLocaleString()}</td>
                <td
                  className={`p-2 border ${
                    p.stok <= 5 ? "text-red-500 font-semibold" : ""
                  }`}
                >
                  {p.stok}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
