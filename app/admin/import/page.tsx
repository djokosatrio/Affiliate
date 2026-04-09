"use client";

import { useState } from "react";
import { saveProduct } from "../actions"; 
import Papa from "papaparse";

export default function ImportPage() {
  const [loading, setLoading] = useState(false);
  const [logs, setLogs] = useState<string[]>([]);
  const [progress, setProgress] = useState({ current: 0, total: 0 });

  const addLog = (msg: string) => {
    setLogs((prev) => [msg, ...prev].slice(0, 10)); 
  };

  const handleCSV = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setLoading(true);
    setLogs(["Memulai proses deteksi dan pembacaan file..."]);

    Papa.parse(file, {
      header: true,
      skipEmptyLines: true,
      complete: async (results) => {
        const rows = results.data as any[];
        setProgress({ current: 0, total: rows.length });
        
        let success = 0;
        let failed = 0;

        for (let i = 0; i < rows.length; i++) {
          const row = rows[i];
          
          try {
            // 1. DETEKSI LINK & MARKETPLACE
            const offerLink = row["Offer Link"] || row["Product Link"] || row["Link Produk"] || "";
            let detectedCategory = "Lainnya";

            if (offerLink.includes("shopee") || offerLink.includes("shope.ee")) {
              detectedCategory = "Shopee";
            } else if (offerLink.includes("tokopedia") || offerLink.includes("tkp.me") || offerLink.includes("tokopedia.link")) {
              detectedCategory = "Tokopedia";
            }

            // 2. ADAPTASI JUDUL (Shopee: Item Name, Tokopedia: Product Name)
            const title = row["Item Name"] || row["Product Name"] || row["Nama Produk"] || "Produk Tanpa Nama";

            // 3. BERSIHKAN HARGA
            const rawPrice = String(row["Price"] || row["Product Price"] || row["Harga"] || "0");
            // Hilangkan karakter non-angka kecuali koma/titik
            let cleanPrice = parseFloat(rawPrice.replace(/[^\d,.]/g, "").replace(",", "."));
            
            // Handle format "RB" ala Shopee (misal 12,5RB)
            if (rawPrice.toUpperCase().includes("RB")) {
              cleanPrice = cleanPrice * 1000;
            }

            // 4. SIMPAN KE DATABASE
            const res = await saveProduct({
              title: title,
              description: `Toko: ${row["Shop Name"] || row["Store Name"] || row["Nama Toko"] || "-"} | Import Otomatis`,
              price: cleanPrice || 0,
              category: detectedCategory,
              url: offerLink,
              images: [], // Gambar tetap harus input manual/edit nanti
            });

            if (res.success) {
              success++;
              addLog(`✅ [${detectedCategory}]: ${title.substring(0, 25)}...`);
            } else {
              failed++;
              addLog(`⚠️ Gagal Simpan: ${title.substring(0, 25)}`);
            }
          } catch (err) {
            failed++;
            addLog(`❌ Error baris ke-${i + 1}`);
          }

          setProgress((prev) => ({ ...prev, current: i + 1 }));
        }

        addLog(`🎉 SELESAI! ${success} Berhasil, ${failed} Gagal.`);
        setLoading(false);
      },
    });
  };

  return (
    <div className="max-w-4xl mx-auto p-6 min-h-screen font-sans">
      {/* HEADER */}
      <div className="mb-10 text-center">
        <h1 className="text-4xl md:text-5xl font-black italic tracking-tighter text-white uppercase bg-gradient-to-b from-white to-gray-500 bg-clip-text text-transparent">
          Mass Import
        </h1>
        <p className="text-blue-500 text-[10px] font-black uppercase tracking-[0.4em] mt-4 animate-pulse">
          Smart Marketplace Detection Engine
        </p>
      </div>

      {/* UPLOAD BOX */}
      <div className="bg-[#121418] border-2 border-dashed border-white/5 rounded-[3rem] p-12 flex flex-col items-center justify-center transition-all hover:border-blue-500/30 group shadow-2xl relative overflow-hidden">
        <div className="absolute inset-0 bg-blue-600/5 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none" />
        
        <div className="w-24 h-24 bg-white/5 rounded-full flex items-center justify-center text-4xl mb-6 group-hover:scale-110 group-hover:bg-blue-600/20 transition-all duration-500 shadow-inner">
          📦
        </div>
        
        <h2 className="text-white font-black text-2xl mb-2 italic uppercase tracking-tighter">Tarik CSV Kamu</h2>
        <p className="text-gray-500 text-[10px] text-center max-w-xs mb-10 font-bold uppercase tracking-widest leading-relaxed">
          Mendukung Laporan Affiliate <br /> 
          <span className="text-orange-500">Shopee</span> & <span className="text-green-500">Tokopedia</span>
        </p>
        
        <label className="relative z-10 bg-white text-black hover:bg-blue-600 hover:text-white px-12 py-5 rounded-2xl font-black text-xs uppercase italic cursor-pointer transition-all active:scale-95 disabled:opacity-50 shadow-[0_10px_30px_rgba(255,255,255,0.1)] hover:shadow-blue-500/40">
          {loading ? "PROCESSING..." : "PILIH FILE SEKARANG"}
          <input type="file" accept=".csv" className="hidden" onChange={handleCSV} disabled={loading} />
        </label>
      </div>

      {/* PROGRESS BAR */}
      {progress.total > 0 && (
        <div className="mt-12 space-y-4 bg-white/[0.02] p-8 rounded-[2rem] border border-white/5">
          <div className="flex justify-between text-[10px] font-black text-gray-500 uppercase tracking-[0.3em]">
            <span className="flex items-center gap-2">
              <span className="w-2 h-2 bg-blue-500 rounded-full animate-ping" />
              Status Import
            </span>
            <span className="text-white">{progress.current} / {progress.total}</span>
          </div>
          <div className="w-full h-3 bg-black rounded-full overflow-hidden p-[2px] border border-white/5">
            <div 
              className="h-full bg-gradient-to-r from-blue-600 to-indigo-500 rounded-full transition-all duration-300 shadow-[0_0_15px_rgba(37,99,235,0.5)]" 
              style={{ width: `${(progress.current / progress.total) * 100}%` }}
            ></div>
          </div>
        </div>
      )}

      {/* LIVE LOGS */}
      {logs.length > 0 && (
        <div className="mt-8 bg-[#0d0d0f] rounded-[2.5rem] p-8 border border-white/5 shadow-inner">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-[10px] font-black text-gray-600 uppercase tracking-[0.5em]">Activity Engine</h3>
            <div className="flex gap-1">
              <div className="w-1.5 h-1.5 rounded-full bg-red-500/50" />
              <div className="w-1.5 h-1.5 rounded-full bg-yellow-500/50" />
              <div className="w-1.5 h-1.5 rounded-full bg-green-500/50" />
            </div>
          </div>
          <div className="space-y-3">
            {logs.map((log, i) => (
              <div key={i} className="text-[10px] font-bold text-gray-500 font-mono flex items-center gap-3 border-b border-white/[0.02] pb-2">
                <span className="text-blue-900">[{progress.current + i}]</span>
                {log}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}