export default function Topbar() {
  return (
    <header className="h-16 bg-white border-b border-slate-200 flex items-center px-6 justify-between">
      <input
        type="text"
        placeholder="Search..."
        className="px-4 py-2 border border-slate-300 rounded-lg w-64 focus:outline-none focus:ring focus:ring-blue-300"
      />
      <div className="flex items-center space-x-4">
        <span className="font-medium">Admin</span>
        <img
          src="https://via.placeholder.com/32"
          alt="profile"
          className="w-8 h-8 rounded-full"
        />
      </div>
    </header>
  );
}
