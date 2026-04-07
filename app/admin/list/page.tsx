"use client";

import React from "react";
import Link from "next/link";
import dynamic from "next/dynamic";

// Memanggil file ListTable yang baru kita buat dengan No-SSR
const DynamicTable = dynamic(() => import("./ListTable"), {
  ssr: false,
  loading: () => <div className="py-20 text-center text-gray-600 uppercase font-black text-[10px] tracking-widest">Inisialisasi Sistem...</div>
});

export default function AdminListPage() {
  return (
    <div className="min-h-screen bg-[#0a0a0c] text-white py-12 px-6">
      <div className="max-w-6xl mx-auto">
        
        {/* Header Tetap Statis & Aman */}
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

        {/* Tabel yang Berbahaya Bagi Build Dibuat Dinamis */}
        <DynamicTable />

      </div>
    </div>
  );
}