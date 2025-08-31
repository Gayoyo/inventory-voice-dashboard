export default function ChartCard({ title, children }) {
  return (
    <div className="bg-white p-4 rounded-xl shadow-sm border border-slate-200">
      <h3 className="text-sm font-medium text-slate-500 mb-2">{title}</h3>
      <div className="h-64">{children}</div>
    </div>
  );
}
