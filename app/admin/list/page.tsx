"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import dynamic from "next/dynamic"; // 1. Wajib import ini
import { getAllProducts, deleteProduct } from "../actions";

// 2. PINDAHKAN LOGIKA TABEL KE KOMPONEN INTERNAL
function AdminListTable() {
  const [products, setProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      try {
        const data = await getAllProducts();
        setProducts(data || []);
      } catch (e) {
        console.error("Gagal load data:", e);
      } finally {
        setLoading(false);
      }
    }
    load();
  }, []);

  const handleDelete = async (id: number, title: string) => {
    if (confirm(`Hapus "${title}" dari katalog?`)) {
      const res = await deleteProduct(id.toString());
      if (res.success) {
        setProducts(products.filter((p) => p.id !== id));
        alert("Terhapus! ✅");
      }
    }
  };

  if (loading) return (
    <div className="py-40 text-center">
      <div className="w-10 h-10 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
      <p className="text-gray-500 font-black uppercase tracking-widest text-[10px]">Membuka Database...</p>
    </div>
  );

  return (
    <div className="overflow-hidden rounded-[35px] border border-white/5 bg-[#111113] shadow-2xl">
      <table className="w-full text-left">
        <thead>
          <tr className="border-b border-white/5 bg-white/[0.02]">
            <th className="p-7 text-[10px] font-black uppercase tracking-widest text-gray-500 text-left">Produk</th>
            <th className="p-7 text-[10px] font-black uppercase tracking-widest text-gray-500 text-right">Aksi</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-white/5">
          {products.map((p) => (
            <tr key={p.id} className="hover:bg-white/[0.01] transition-all group">
              <td className="p-7 font-bold text-white group-hover:text-blue-400 transition-colors uppercase italic text-lg text-left">{p.title}</td>
              <td className="p-7 text-right">
                <div className="flex justify-end gap-3">
                  <Link href={`/admin/edit/${p.id}`} className="px-5 py-2.5 bg-white/5 hover:bg-blue-600 text-[10px] font-black text-gray-400 hover:text-white rounded-xl uppercase transition-all border border-white/5 italic">
                    Edit
                  </Link>
                  <button onClick={() => handleDelete(p.id, p.title)} className="px-5 py-2.5 bg-red-600/5 hover:bg-red-600 text-[10px] font-black text-red-900 hover:text-white rounded-xl uppercase transition-all border border-red-900/20 italic">
                    Hapus
                  </button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      {products.length === 0 && <p className="p-20 text-center text-gray-700 font-black uppercase text-xs">Gudang Kosong!</p>}
    </div>
  );
}

// 3. GUNAKAN DYNAMIC IMPORT DENGAN SSR: FALSE (INI OBATNYA!)
const DynamicAdminTable = dynamic(() => Promise.resolve(AdminListTable), {
  ssr: false, // Memaksa Next.js mengabaikan komponen ini saat proses Prerender Build
});

// 4. HALAMAN UTAMA (Wajib Export Default)
export default function AdminListPage() {
  return (
    <div className="min-h-screen bg-[#0a0a0c] text-white py-12 px-6">
      <div className="max-w-6xl mx-auto">
        
        {/* HEADER */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-12 text-left">
          <div className="flex items-center gap-4">
            <div className="h-10 w-1.5 bg-blue-600 rounded-full shadow-[0_0_15px_rgba(37,99,235,0.5)]"></div>
            <h1 className="text-4xl font-black italic tracking-tighter uppercase">
              Gudang <span className="text-blue-500">Produk</span>
            </h1>
          </div>
          <Link href="/admin/add" className="bg-white text-black font-black px-8 py-4 rounded-2xl hover:bg-blue-500 hover:text-white transition-all uppercase tracking-tighter italic">
            + Tambah Barang
          </Link>
        </div>

        {/* PANGGIL KOMPONEN DYNAMIC */}
        <DynamicAdminTable />

      </div>
    </div>
  );
}