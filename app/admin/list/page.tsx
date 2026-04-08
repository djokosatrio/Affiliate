"use client";

import React, { Suspense } from "react";
import Link from "next/link";
import dynamic from "next/dynamic";

// 1. Kita panggil komponen tabel secara dinamis agar Next.js 
// tidak mencoba melakukan 'Static Analysis' pada isinya saat build.
const DynamicTable = dynamic(() => import("./ListTableContent"), {
  ssr: false,
  loading: () => <p className="text-center py-20 text-gray-600 font-black">INITIALIZING SYSTEM...</p>
});

export default function AdminListPage() {
  return (
    <div className="min-h-screen bg-[#0a0a0c] text-white py-12 px-6">
      <div className="max-w-6xl mx-auto">
        
        {/* HEADER */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-12 text-left">
          <div className="flex items-center gap-4">
            <div className="h-10 w-1.5 bg-blue-600 rounded-full"></div>
            <h1 className="text-4xl font-black italic tracking-tighter uppercase">
              Gudang <span className="text-blue-500">Produk</span>
            </h1>
          </div>
          
        </div>

        {/* 2. BUNGKUS DENGAN SUSPENSE TINGKAT TINGGI */}
        <Suspense fallback={<div className="text-center py-20 font-black">BYPASSING PRERENDER...</div>}>
          <DynamicTable />
        </Suspense>

      </div>
    </div>
  );
}