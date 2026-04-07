export const dynamic = "force-dynamic";

import React, { Suspense } from "react";
import { prisma } from "@/src/lib/prisma";
import Link from "next/link";

// --- 1. KOMPONEN UTAMA ---
export default function AdminListPage() {
  return (
    <div className="min-h-screen bg-[#0a0a0c] text-white py-12 px-6">
      <div className="max-w-6xl mx-auto">
        
        {/* Header List */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-12">
          <div className="flex items-center gap-4">
            <div className="h-10 w-1.5 bg-blue-600 rounded-full shadow-[0_0_15px_rgba(37,99,235,0.5)]"></div>
            <h1 className="text-4xl font-black italic tracking-tighter uppercase">
              Daftar <span className="text-blue-500">Produk</span>
            </h1>
          </div>
          
          <Link 
            href="/admin/add" 
            className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-500 hover:to-purple-500 text-white font-black px-8 py-4 rounded-2xl transition-all shadow-lg uppercase tracking-tighter italic text-center"
          >
            + Tambah Produk Baru
          </Link>
        </div>

        {/* Suspense untuk handle async data agar build tidak error */}
        <Suspense fallback={<div className="text-center py-20 text-gray-500 font-bold animate-pulse">MEMUAT GUDANG KERE HORE...</div>}>
          <ProductTable />
        </Suspense>
      </div>
    </div>
  );
}

// --- 2. KOMPONEN TABLE (LOGIKA AMBIL DATA) ---
async function ProductTable() {
  const products = await prisma.product.findMany({
    orderBy: { createdAt: "desc" },
  });

  if (products.length === 0) {
    return (
      <div className="text-center py-20 bg-[#111113] rounded-[30px] border border-white/5">
        <p className="text-gray-500 italic font-bold uppercase tracking-widest text-sm">Gudang masih kosong melompong!</p>
      </div>
    );
  }

  return (
    <div className="overflow-hidden rounded-[30px] border border-white/5 bg-[#111113] shadow-2xl">
      <table className="w-full text-left border-collapse">
        <thead>
          <tr className="border-b border-white/5 bg-white/[0.02]">
            <th className="p-6 text-[10px] font-black uppercase tracking-[0.3em] text-gray-500">Produk</th>
            <th className="p-6 text-[10px] font-black uppercase tracking-[0.3em] text-gray-500">Kategori</th>
            <th className="p-6 text-[10px] font-black uppercase tracking-[0.3em] text-gray-500">Harga</th>
            <th className="p-6 text-[10px] font-black uppercase tracking-[0.3em] text-gray-500 text-right">Aksi</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-white/5">
          {products.map((p) => (
            <tr key={p.id} className="hover:bg-white/[0.01] transition-colors group">
              <td className="p-6">
                <div className="font-bold text-white group-hover:text-blue-400 transition-colors uppercase tracking-tight italic">
                  {p.title}
                </div>
              </td>
              <td className="p-6">
                <span className="px-3 py-1 bg-blue-600/10 text-blue-500 text-[10px] font-black rounded-lg border border-blue-500/20 uppercase tracking-widest">
                  {p.category}
                </span>
              </td>
              <td className="p-6 font-mono text-sm text-gray-400">
                Rp {p.price.toLocaleString("id-ID")}
              </td>
              <td className="p-6 text-right">
                <div className="flex justify-end gap-3">
                  <button className="text-[10px] font-black text-gray-500 hover:text-white uppercase tracking-widest transition-colors">
                    Edit
                  </button>
                  <span className="text-gray-800">|</span>
                  <button className="text-[10px] font-black text-red-900 hover:text-red-500 uppercase tracking-widest transition-colors">
                    Hapus
                  </button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}