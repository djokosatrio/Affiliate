"use client";

import { useState, useEffect, Suspense } from "react";
import Link from "next/link";
import { getAllProducts, deleteProduct } from "../actions";

// 1. KOMPONEN ISI (Logika Utama)
function AdminListContent() {
  const [products, setProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

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

  const handleDelete = async (id: number, title: string) => {
    if (confirm(`Hapus "${title}" dari katalog?`)) {
      try {
        const res = await deleteProduct(id.toString());
        if (res.success) {
          setProducts(products.filter((p) => p.id !== id));
          alert("Barang terhapus! ✅");
        }
      } catch (error) {
        alert("Gagal hapus!");
      }
    }
  };

  if (loading) {
    return (
      <div className="text-center py-40">
        <div className="w-12 h-12 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-6"></div>
        <p className="text-gray-500 font-black uppercase tracking-[0.3em] text-[10px]">Membuka Database...</p>
      </div>
    );
  }

  return (
    <div className="overflow-hidden rounded-[35px] border border-white/5 bg-[#111113] shadow-2xl text-left">
      <table className="w-full text-left border-collapse">
        <thead>
          <tr className="border-b border-white/5 bg-white/[0.02]">
            <th className="p-7 text-[10px] font-black uppercase tracking-[0.4em] text-gray-500">Nama Barang</th>
            <th className="p-7 text-[10px] font-black uppercase tracking-[0.4em] text-gray-500 text-right">Aksi</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-white/5">
          {products.map((p) => (
            <tr key={p.id} className="hover:bg-white/[0.01] transition-all group">
              <td className="p-7 font-bold text-white group-hover:text-blue-400 uppercase italic text-lg">{p.title}</td>
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
      {products.length === 0 && <p className="p-20 text-center text-gray-700 font-black uppercase text-xs">Kosong!</p>}
    </div>
  );
}

// 2. HALAMAN UTAMA (Wajib Export Default dengan Suspense)
export default function AdminListPage() {
  return (
    <div className="min-h-screen bg-[#0a0a0c] text-white py-12 px-6">
      <div className="max-w-6xl mx-auto">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-12 text-left">
          <div className="flex items-center gap-4">
            <div className="h-10 w-1.5 bg-blue-600 rounded-full"></div>
            <h1 className="text-4xl font-black italic tracking-tighter uppercase">
              Gudang <span className="text-blue-500">Produk</span>
            </h1>
          </div>
          <Link href="/admin/add" className="bg-white text-black font-black px-8 py-4 rounded-2xl hover:bg-blue-500 hover:text-white transition-all uppercase tracking-tighter italic">
            + Tambah Barang
          </Link>
        </div>

        {/* INI KUNCI AGAR BUILD BERHASIL: BUNGKUS DENGAN SUSPENSE */}
        <Suspense fallback={<p className="text-center text-white">Loading Admin List...</p>}>
          <AdminListContent />
        </Suspense>
      </div>
    </div>
  );
}