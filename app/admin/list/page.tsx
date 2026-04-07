"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { getAllProducts, deleteProduct } from "../actions"; // Nama fungsi disesuaikan dengan actions.ts kamu

export default function AdminListPage() {
  const [products, setProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  // 1. Fungsi Ambil Data (Memanggil Server Action getAllProducts)
  async function loadData() {
    setLoading(true);
    try {
      const data = await getAllProducts(); 
      setProducts(data);
    } catch (error) {
      console.error("Gagal ambil data:", error);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadData();
  }, []);

  // 2. Fungsi Hapus (Memanggil Server Action deleteProduct)
  const handleDelete = async (id: string, title: string) => {
    if (confirm(`Hapus "${title}" dari katalog?`)) {
      try {
        const res = await deleteProduct(id);
        if (res.success) {
          setProducts(products.filter((p) => p.id !== id));
          alert("Barang sudah musnah dari gudang! ✅");
        } else {
          alert("Gagal hapus data di database.");
        }
      } catch (error) {
        alert("Terjadi kesalahan sistem!");
      }
    }
  };

  return (
    <div className="min-h-screen bg-[#0a0a0c] text-white py-12 px-6">
      <div className="max-w-6xl mx-auto">
        
        {/* HEADER */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-12">
          <div className="flex items-center gap-4">
            <div className="h-10 w-1.5 bg-blue-600 rounded-full shadow-[0_0_15px_rgba(37,99,235,0.5)]"></div>
            <h1 className="text-4xl font-black italic tracking-tighter uppercase">
              Gudang <span className="text-blue-500">Produk</span>
            </h1>
          </div>
          <Link 
            href="/admin/add" 
            className="bg-white text-black font-black px-8 py-4 rounded-2xl hover:bg-blue-500 hover:text-white transition-all uppercase tracking-tighter italic text-center"
          >
            + Tambah Barang
          </Link>
        </div>

        {loading ? (
          <div className="text-center py-40 border-2 border-dashed border-white/5 rounded-[40px]">
            <div className="w-10 h-10 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
            <p className="text-gray-500 font-black uppercase tracking-widest text-[10px]">Membongkar Brankas...</p>
          </div>
        ) : (
          <div className="overflow-hidden rounded-[35px] border border-white/5 bg-[#111113] shadow-2xl">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-white/5 bg-white/[0.02]">
                  <th className="p-7 text-[10px] font-black uppercase tracking-[0.4em] text-gray-500">Nama Produk</th>
                  <th className="p-7 text-[10px] font-black uppercase tracking-[0.4em] text-gray-500">Kategori</th>
                  <th className="p-7 text-[10px] font-black uppercase tracking-[0.4em] text-gray-500 text-right">Manajemen</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {products.map((p) => (
                  <tr key={p.id} className="hover:bg-white/[0.01] transition-all group">
                    <td className="p-7">
                      <div className="font-bold text-white group-hover:text-blue-400 transition-colors uppercase tracking-tight italic text-lg text-left">
                        {p.title}
                      </div>
                    </td>
                    <td className="p-7 text-left">
                      <span className="px-4 py-1.5 bg-blue-600/10 text-blue-500 text-[10px] font-black rounded-xl border border-blue-500/20 uppercase">
                        {p.category}
                      </span>
                    </td>
                    <td className="p-7 text-right">
                      <div className="flex justify-end gap-3">
                        <Link 
                          href={`/admin/edit/${p.id}`} 
                          className="px-5 py-2.5 bg-white/5 hover:bg-blue-600 text-[10px] font-black text-gray-400 hover:text-white rounded-xl uppercase transition-all border border-white/5 italic"
                        >
                          Edit
                        </Link>
                        <button 
                          onClick={() => handleDelete(p.id.toString(), p.title)}
                          className="px-5 py-2.5 bg-red-600/5 hover:bg-red-600 text-[10px] font-black text-red-900 hover:text-white rounded-xl uppercase transition-all border border-red-900/20 italic"
                        >
                          Hapus
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            {products.length === 0 && (
              <div className="text-center py-20 text-gray-700 font-black uppercase italic tracking-widest text-[10px]">Gudang Masih Kosong!</div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}