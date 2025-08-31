import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

export default function VoiceCommand({ produk, setProduk }) {
  const [listening, setListening] = useState(false);
  const [command, setCommand] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    const SpeechRecognition =
      window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SpeechRecognition) {
      alert("Browser tidak mendukung Voice Recognition");
      return;
    }

    const recognition = new SpeechRecognition();
    recognition.lang = "id-ID";
    recognition.continuous = true;

    recognition.onresult = (event) => {
      const text = event.results[event.results.length - 1][0].transcript;
      setCommand(text);
      handleCommand(text.toLowerCase());
    };

    if (listening) recognition.start();
    else recognition.stop();

    return () => recognition.stop();
  }, [listening]);

  // 🔊 feedback suara
  const speak = (text) => {
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = "id-ID";
    window.speechSynthesis.speak(utterance);
  };

  // 🎯 eksekusi perintah
  const handleCommand = (text) => {
    if (text.includes("buka produk")) {
      navigate("/produk");
      speak("Berpindah ke halaman produk");
    } else if (text.includes("buka penjualan")) {
      navigate("/penjualan");
      speak("Berpindah ke halaman penjualan");
    } else if (text.includes("buka laporan") || text.includes("buka report")) {
      navigate("/report");
      speak("Berpindah ke halaman laporan");
    } else if (text.includes("buka forecasting") || text.includes("buka ramalan")) {
      navigate("/forecasting");
      speak("Berpindah ke halaman forecasting");
    } else if (text.includes("buka anomali")) {
      navigate("/anomali");
      speak("Berpindah ke halaman anomali");
    } else if (text.includes("tambah produk")) {
      const newItem = {
        id: produk.length + 1,
        nama: "Produk Voice",
        kategori: "Voice",
        harga: 12345,
        stok: 10,
      };
      setProduk([...produk, newItem]);
      speak("Produk berhasil ditambahkan");
    } else if (text.includes("hapus produk pertama")) {
      if (produk.length > 0) {
        setProduk(produk.slice(1));
        speak("Produk pertama berhasil dihapus");
      } else {
        speak("Tidak ada produk untuk dihapus");
      }
    }
  };

  return (
    <div className="p-6 space-y-4">
      <h1 className="text-2xl font-bold">🎤 Voice Command</h1>
      <button
        onClick={() => setListening(!listening)}
        className={`px-4 py-2 rounded ${
          listening ? "bg-red-500 text-white" : "bg-green-500 text-white"
        }`}
      >
        {listening ? "Stop Listening" : "Start Listening"}
      </button>

      <p className="mt-4">
        Perintah terakhir: <span className="font-semibold">{command}</span>
      </p>
    </div>
  );
}
