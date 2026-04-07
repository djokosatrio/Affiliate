export const dynamic = "force-dynamic";

import React, { Suspense } from "react";
import AdminFormClient from "@/app/admin/add/AdminFormClient";

export default function AdminPage() {
  return (
    <div className="min-h-screen bg-[#0a0a0c] text-white py-12 px-4">
      <div className="max-w-3xl mx-auto bg-[#121418] p-10 rounded-[2.5rem] border border-white/5 shadow-2xl">
        <h1 className="text-4xl font-black mb-10 bg-gradient-to-r from-blue-400 to-purple-500 bg-clip-text text-transparent italic text-center tracking-tighter">
          ADMIN KERE HORE
        </h1>

        {/* Suspense sangat krusial di sini agar build worker tidak crash */}
        <Suspense fallback={<div className="text-center py-20 font-black animate-pulse uppercase tracking-widest text-gray-600">Menyiapkan Form...</div>}>
          <AdminFormClient />
        </Suspense>
      </div>
    </div>
  );
}