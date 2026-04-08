"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { getAllProducts, deleteProduct } from "../actions";
import { supabase } from "@/src/lib/supabase"; // Pastikan path ke config supabase sudah benar

export default function ListTableContent() {
  const [products, setProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  // 1. Ambil semua data produk saat pertama kali load
  useEffect(() => {
    async function load() {
      try {
        const data = await getAllProducts();
        setProducts(data || []);
      } catch (e) {
        console.error("Gagal mengambil data:", e);
      } finally {
        setLoading(false);
      }
    }
    load();
  }, []);

  // 2. Fungsi Hapus (Storage + Database)
  const handleDelete = async (id: number, title: string, images: string[]) => {
    const isConfirmed = confirm(`Apakah Anda yakin ingin menghapus "${title}"?\nSemua foto di storage juga akan dihapus.`);

    if (isConfirmed) {
      try {
        // --- PROSES HAPUS DI SUPABASE STORAGE ---
        if (images && images.length > 0) {
          // Ambil nama file saja dari URL (Supabase butuh nama file, bukan full URL)
          const fileNames = images.map((url) => {
            const parts = url.split("/");
            return parts[parts.length - 1];
          });

          // Eksekusi penghapusan massal di bucket "product-images"
          const { error: storageError } = await supabase.storage
            .from("product-images")
            .remove(fileNames);

          if (storageError) {
            console.error("Gagal hapus gambar di storage:", storageError.message);
          }
        }

        // --- PROSES HAPUS DI DATABASE ---
        const res = await deleteProduct(id.toString());
        
        if (res.success) {
          // Update state UI agar baris yang dihapus hilang
          setProducts(products.filter((p) => p.id !== id));
        } else {
          alert("Gagal menghapus data dari database.");
        }
      } catch (error) {
        console.error("Error Sistem:", error);
        alert("Terjadi kesalahan saat menghapus.");
      }
    }
  };

  if (loading) return <div className="py-20 text-center font-black text-white tracking-widest">MEMUAT DATABASE...</div>;

  return (
    <div className="overflow-hidden rounded-[35px] border border-white/5 bg-[#111113] shadow-2xl">
      <table className="w-full text-left border-collapse">
        <thead>
          <tr className="border-b border-white/5 bg-white/[0.02]">
            <th className="p-7 text-[10px] font-black uppercase text-gray-500 tracking-widest">Nama Barang</th>
            <th className="p-7 text-[10px] font-black uppercase text-gray-500 text-right tracking-widest">Aksi</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-white/5">
          {products.length === 0 ? (
            <tr>
              <td colSpan={2} className="p-20 text-center text-gray-600 italic font-medium">
                Belum ada produk yang terdaftar.
              </td>
            </tr>
          ) : (
            products.map((p) => (
              <tr key={p.id} className="group hover:bg-white/[0.01] transition-colors">
                <td className="p-7">
                  <span className="font-bold text-white uppercase italic text-lg group-hover:text-orange-500 transition-colors">
                    {p.title}
                  </span>
                </td>
                <td className="p-7 text-right">
                  <div className="flex justify-end gap-3">
                    {/* Tombol Edit */}
                    <Link 
                      href={`/admin/edit/${p.id}`} 
                      className="px-6 py-3 bg-white/5 hover:bg-blue-600 text-[10px] font-black rounded-xl border border-white/5 italic text-white transition-all active:scale-95"
                    >
                      EDIT
                    </Link>
                    
                    {/* Tombol Hapus - Kirim ID, Title, dan Array Images */}
                    <button 
                      onClick={() => handleDelete(p.id, p.title, p.images || [])} 
                      className="px-6 py-3 bg-red-600/5 hover:bg-red-600 text-[10px] font-black text-red-500 hover:text-white rounded-xl border border-red-900/20 italic transition-all active:scale-95"
                    >
                      HAPUS
                    </button>
                  </div>
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
}