import { Link, useLocation } from "react-router-dom";

export default function Sidebar() {
  const location = useLocation();
  const menu = [
    { icon: "📦", label: "Dashboard", path: "/" },
    { icon: "🛒", label: "Produk", path: "/produk" },
    { icon: "📊", label: "Penjualan", path: "/penjualan" },
    { icon: "📈", label: "Report", path: "/report" },   // ✅ Tambahin Report di sini
    { icon: "🔍", label: "ForecastingAnomali", path: "/forecasting-anomali" },
    { icon: "⚙️", label: "Pengaturan", path: "/pengaturan" },
  ];

  return (
    <aside className="w-64 h-screen bg-gradient-to-b from-slate-900 to-slate-800 text-white shadow-lg flex flex-col">
      {/* Header */}
      <div className="px-6 py-4 font-bold text-2xl tracking-wide border-b border-slate-700">
        Inventory<span className="text-indigo-400">AI</span>
      </div>

      {/* Menu */}
      <nav className="flex-1 p-4 space-y-2">
        {menu.map((item, idx) => {
          const active = location.pathname === item.path;
          return (
            <Link
              key={idx}
              to={item.path}
              className={`flex items-center px-4 py-2 rounded-lg transition-all duration-200 ${
                active
                  ? "bg-indigo-600 text-white shadow-md"
                  : "text-slate-300 hover:bg-slate-700 hover:text-white"
              }`}
            >
              <span className="mr-3 text-lg">{item.icon}</span>
              <span className="font-medium">{item.label}</span>
            </Link>
          );
        })}
      </nav>

      {/* Footer */}
      <div className="p-4 border-t border-slate-700 text-sm text-slate-400">
        © {new Date().getFullYear()} InventoryAI
      </div>
    </aside>
  );
}
