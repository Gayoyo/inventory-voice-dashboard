import Sidebar from "../components/Sidebar";
import { Outlet } from "react-router-dom";
import { useState } from "react";

export default function DashboardLayout() {
  const [listening, setListening] = useState(false);

  const handleVoiceCommand = () => {
    const SpeechRecognition =
      window.SpeechRecognition || window.webkitSpeechRecognition;

    if (!SpeechRecognition) {
      alert("Browser kamu belum support Speech Recognition 😢");
      return;
    }

    const recognition = new SpeechRecognition();
    recognition.lang = "id-ID"; // bahasa Indonesia
    recognition.continuous = false;
    recognition.interimResults = false;

    recognition.onstart = () => {
      setListening(true);
      console.log("🎤 Mulai mendengarkan...");
    };

    recognition.onresult = (event) => {
      const transcript = event.results[0][0].transcript.toLowerCase();
      console.log("🗣️ Terdengar:", transcript);

      // contoh command sederhana
      if (transcript.includes("produk")) {
        window.location.href = "/produk";
      } else if (transcript.includes("penjualan")) {
        window.location.href = "/penjualan";
      } else if (transcript.includes("laporan")) {
        window.location.href = "/report";
      } else {
        alert(`Tidak ada perintah cocok: ${transcript}`);
      }
    };

    recognition.onend = () => {
      setListening(false);
      console.log("🛑 Berhenti mendengarkan.");
    };

    recognition.start();
  };

  return (
    <div className="flex h-screen bg-slate-100">
      {/* Sidebar */}
      <Sidebar />

      {/* Main Content */}
      <div className="flex flex-col flex-1">
        {/* Navbar */}
        <header className="h-16 bg-white shadow flex items-center justify-between px-6">
          <h1 className="text-xl font-bold text-slate-700">Dashboard</h1>

          {/* Voice Button */}
          <button
            onClick={handleVoiceCommand}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg transition ${
              listening
                ? "bg-red-600 text-white hover:bg-red-700"
                : "bg-indigo-600 text-white hover:bg-indigo-700"
            }`}
          >
            {listening ? "🛑 Stop Listening" : "🎤 Voice Command"}
          </button>
        </header>

        {/* Halaman Content */}
        <main className="flex-1 overflow-y-auto p-6">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
