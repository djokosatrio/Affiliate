"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { getAllProducts, deleteProduct } from "../actions";
import Image from "next/image";

export default function AdminListPage() {
  const [products, setProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadProducts();
  }, []);

  async function loadProducts() {
    const data = await getAllProducts();
    setProducts(data);
    setLoading(false);
  }

  async function handleDelete(id: string) {
    if (confirm("Yakin mau hapus produk ini, Sat? Gak bisa balik lagi lho.")) {
      const res = await deleteProduct(id);
      if (res.success) loadProducts();
    }
  }

  if (loading) return (
    <div className="min-h-screen bg-[#0a0a0c] flex items-center justify-center">
        <p className="text-blue-500 font-black animate-pulse">MEMUAT DAFTAR BARANG... 🛠️</p>
    </div>
  );

  return (
    <div className="min-h-screen bg-[#0a0a0c] text-white py-12 px-4 md:px-8">
      <div className="max-w-6xl mx-auto">
        
        {/* HEADER DENGAN TOMBOL ADD */}
        <div className="flex flex-col md:flex-row justify-between items-center mb-10 gap-6">
          <div>
            <h1 className="text-4xl font-black italic bg-gradient-to-r from-blue-500 to-cyan-400 bg-clip-text text-transparent uppercase tracking-tighter">
                Manage Produk
            </h1>
            <p className="text-gray-500 text-xs font-bold mt-1 tracking-widest uppercase">Total Koleksi: {products.length} Barang</p>
          </div>

          
          <Link 
            href="/admin/add" 
            className="group relative flex items-center gap-2 bg-blue-600 hover:bg-blue-500 text-white px-8 py-4 rounded-2xl font-black text-lg transition-all shadow-xl shadow-blue-600/20 active:scale-95"
          >
            <span className="text-2xl group-hover:rotate-90 transition-transform duration-300">+</span>
            TAMBAH BARANG BARU
          </Link>
        </div>

        {/* TABEL DAFTAR BARANG */}
        <div className="bg-[#121418] rounded-[2.5rem] border border-gray-800 overflow-hidden shadow-2xl">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead className="bg-gray-900/80 text-gray-500 text-[10px] uppercase tracking-[0.2em] font-black">
                <tr>
                  <th className="p-6">Produk</th>
                  <th className="p-6">Kategori</th>
                  <th className="p-6">Harga</th>
                  <th className="p-6 text-center">Aksi</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-800/50">
                {products.map((p) => (
                  <tr key={p.id} className="hover:bg-white/[0.02] transition-colors group">
                    <td className="p-6">
                      <div className="flex items-center gap-4">
                        {/* Preview foto kecil di list */}
                        <div className="relative w-12 h-12 rounded-lg overflow-hidden flex-shrink-0 border border-gray-800">
                            <Image 
                                src={p.images[0] || "/placeholder.png"} 
                                alt="thumb" 
                                fill 
                                className="object-cover"
                                unoptimized
                            />
                        </div>
                        <span className="font-bold text-gray-200 group-hover:text-blue-400 transition-colors line-clamp-1">
                            {p.title}
                        </span>
                      </div>
                    </td>
                    <td className="p-6">
                      <span className="bg-gray-800/50 text-gray-400 px-3 py-1 rounded-full text-[10px] font-bold border border-gray-700">
                        {p.category}
                      </span>
                    </td>
                    <td className="p-6">
                      <p className="text-blue-400 font-black text-sm">
                        Rp {p.price.toLocaleString("id-ID")}
                      </p>
                    </td>
                    <td className="p-6">
                      <div className="flex justify-center gap-2">
                        <Link 
                          href={`/admin/edit/${p.id}`}
                          className="px-4 py-2 bg-orange-600/10 text-orange-500 rounded-xl text-xs font-black hover:bg-orange-600 hover:text-white transition-all border border-orange-600/20"
                        >
                          EDIT ✏️
                        </Link>
                        <button 
                          onClick={() => handleDelete(p.id)}
                          className="px-4 py-2 bg-red-600/10 text-red-500 rounded-xl text-xs font-black hover:bg-red-600 hover:text-white transition-all border border-red-600/20"
                        >
                          HAPUS 🗑️
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
                
                {products.length === 0 && (
                  <tr>
                    <td colSpan={4} className="p-20 text-center text-gray-600 italic">
                      Belum ada barang di rak. Klik Tambah Barang Baru di atas!
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* TOMBOL BACK KE HOME */}
        <div className="mt-8 text-center">
            <Link href="/" className="text-gray-600 hover:text-gray-400 text-xs font-bold uppercase tracking-widest transition-colors">
                ← Kembali ke Beranda
            </Link>
        </div>
      </div>
    </div>
  );
}