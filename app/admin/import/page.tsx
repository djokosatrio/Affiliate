"use client";

import { useState } from "react";
import { saveProduct } from "../actions"; // Pastikan path action benar
import Papa from "papaparse";

export default function ImportPage() {
  const [loading, setLoading] = useState(false);
  const [logs, setLogs] = useState<string[]>([]);
  const [progress, setProgress] = useState({ current: 0, total: 0 });

  const addLog = (msg: string) => {
    setLogs((prev) => [msg, ...prev].slice(0, 10)); // Simpan 10 log terbaru
  };

  const handleCSV = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setLoading(true);
    setLogs(["Memulai proses pembacaan file..."]);

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
            // Bersihkan harga (Misal: 133,9RB -> 133900)
            const rawPrice = row["Price"] || "0";
            const cleanPrice = parseFloat(rawPrice.replace(/[^\d,]/g, "").replace(",", ".")) * (rawPrice.includes("RB") ? 1000 : 1);

            const res = await saveProduct({
              title: row["Item Name"] || "Produk Tanpa Nama",
              description: `Toko: ${row["Shop Name"] || "-"} | Penjualan: ${row["Sales"] || "0"}`,
              price: cleanPrice || 0,
              category: "Shopee Import",
              url: row["Offer Link"] || row["Product Link"] || "",
              images: [], // CSV Shopee tidak sedia gambar, nanti edit manual
            });

            if (res.success) {
              success++;
              addLog(`✅ Berhasil: ${row["Item Name"]?.substring(0, 30)}...`);
            } else {
              failed++;
            }
          } catch (err) {
            failed++;
            addLog(`❌ Gagal baris ke-${i + 1}`);
          }

          setProgress((prev) => ({ ...prev, current: i + 1 }));
        }

        addLog(`🎉 SELESAI! ${success} Berhasil, ${failed} Gagal.`);
        setLoading(false);
      },
    });
  };

  return (
    <div className="max-w-4xl mx-auto p-6 min-h-screen">
      {/* HEADER */}
      <div className="mb-10 text-center">
        <h1 className="text-4xl font-black italic tracking-tighter text-white uppercase">Mass Import</h1>
        <p className="text-gray-500 text-xs font-bold uppercase tracking-[0.3em] mt-2">Shopee Affiliate CSV Engine</p>
      </div>

      {/* UPLOAD BOX */}
      <div className="bg-[#121418] border-2 border-dashed border-white/5 rounded-[3rem] p-12 flex flex-col items-center justify-center transition-all hover:border-blue-500/30 group">
        <div className="w-20 h-20 bg-blue-600/10 rounded-full flex items-center justify-center text-3xl mb-6 group-hover:scale-110 transition-transform">📦</div>
        <h2 className="text-white font-black text-xl mb-2">Drop File CSV Kamu</h2>
        <p className="text-gray-500 text-xs text-center max-w-xs mb-8 font-medium">Pastikan file berasal dari laporan Shopee Affiliate agar kolomnya pas.</p>
        
        <label className="bg-blue-600 hover:bg-blue-500 text-white px-10 py-5 rounded-2xl font-black text-sm uppercase italic cursor-pointer transition-all active:scale-95 disabled:opacity-50">
          {loading ? "SEDANG PROSES..." : "PILIH FILE CSV"}
          <input type="file" accept=".csv" className="hidden" onChange={handleCSV} disabled={loading} />
        </label>
      </div>

      {/* PROGRESS BAR */}
      {progress.total > 0 && (
        <div className="mt-10 space-y-2">
          <div className="flex justify-between text-[10px] font-black text-gray-500 uppercase tracking-widest px-2">
            <span>Progress Import</span>
            <span>{Math.round((progress.current / progress.total) * 100)}%</span>
          </div>
          <div className="w-full h-4 bg-white/5 rounded-full overflow-hidden border border-white/5">
            <div 
              className="h-full bg-blue-600 transition-all duration-300 shadow-[0_0_20px_rgba(37,99,235,0.5)]" 
              style={{ width: `${(progress.current / progress.total) * 100}%` }}
            ></div>
          </div>
        </div>
      )}

      {/* LIVE LOGS */}
      {logs.length > 0 && (
        <div className="mt-10 bg-black/40 rounded-[2rem] p-6 border border-white/5">
          <h3 className="text-[10px] font-black text-gray-600 uppercase tracking-widest mb-4">Activity Logs</h3>
          <div className="space-y-2">
            {logs.map((log, i) => (
              <div key={i} className="text-[11px] font-medium text-gray-400 font-mono">
                {log}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}