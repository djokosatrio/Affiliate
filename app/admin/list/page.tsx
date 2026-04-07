"use client";

import React, { Suspense } from "react";
import Link from "next/link";
import dynamic from "next/dynamic";

// Import tabel secara dynamic (No-SSR) untuk menghindari prerender error
const ListTable = dynamic(() => import("./ListTable"), {
  ssr: false,
  loading: () => (
    <div className="py-20 text-center font-black animate-pulse text-gray-600 uppercase tracking-widest text-[10px]">
      Loading System...
    </div>
  ),
});

export default function AdminListPage() {
  return (
    <div className="min-h-screen bg-[#0a0a0c] text-white py-12 px-6">
      <div className="max-w-6xl mx-auto">
        
        {/* HEADER GUDANG */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-12 text-left">
          <div className="flex items-center gap-4">
            <div className="h-10 w-1.5 bg-blue-600 rounded-full shadow-[0_0_15px_rgba(37,99,235,0.5)]"></div>
            <h1 className="text-4xl font-black italic tracking-tighter uppercase text-white">
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

        {/* BUNGKUS DENGAN SUSPENSE */}
        <Suspense fallback={<div className="text-white uppercase font-black text-center py-20 text-[10px]">Syncing Database...</div>}>
          <ListTable />
        </Suspense>

      </div>
    </div>
  );
}