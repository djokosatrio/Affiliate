import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import React, { Suspense } from 'react'; // 1. Tambahkan Suspense di sini
import Image from 'next/image';
import FilterSection from "@/src/components/FilterSection";
import { prisma } from "@/src/lib/prisma";

const geistSans = Geist({ variable: "--font-geist-sans", subsets: ["latin"] });
const geistMono = Geist_Mono({ variable: "--font-geist-mono", subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Kere Hore Review",
  description: "Rekomendasi Produk Pilihan Netizen Indonesia",
};

export default async function RootLayout({ children }: { children: React.ReactNode }) {
  // Ambil data kategori dari database untuk Dropdown Filter
  const categoriesRaw = await prisma.product.findMany({
    select: { category: true },
    distinct: ["category"],
  });
  const categories = ["All", ...categoriesRaw.map((c) => c.category)];

  return (
    <html lang="en" className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}>
      <body className="min-h-full flex flex-col bg-[#0a0a0a] text-gray-100 font-sans">
        
        {/* --- HEADER PREMIUM --- */}
        <header className="sticky top-0 z-50 w-full bg-[#111111]/95 backdrop-blur-md border-b border-white/10 shadow-2xl">
          <div className="max-w-7xl mx-auto px-6 h-28 flex items-center justify-between gap-8">
            
            {/* 1. LOGO & NAMA BRAND */}
            <div className="flex items-center gap-6 shrink-0 cursor-pointer group">
              {/* CONTAINER LOGO */}
              <div className="relative w-20 h-20 rounded-full overflow-hidden transition-transform duration-300 group-hover:scale-110">
                <Image 
                  src="/logo.png" 
                  alt="Logo Kere Hore" 
                  fill 
                  className="object-cover"
                  priority 
                />
              </div>
              
              {/* Kontainer Teks Brand */}
              <div className="flex flex-col py-2"> 
                <h1 className="text-3xl md:text-5xl font-black bg-gradient-to-r from-blue-400 via-purple-500 to-indigo-400 bg-clip-text text-transparent tracking-tighter leading-[1.4] pt-1 px-1 -mb-2">
                  KERE HORE
                </h1>
                <p className="text-[10px] text-gray-500 font-bold tracking-[0.4em] uppercase italic ml-1">
                  Review Official
                </p>
              </div>
            </div>

            {/* 2. FILTER SECTION (DIBUNGKUS SUSPENSE AGAR BUILD AMAN) */}
            <div className="flex-1 flex justify-center max-w-4xl">
              {/* Kunci Perbaikan: FilterSection biasanya menggunakan useSearchParams(). 
                  Di Next.js 15/16, komponen ini WAJIB di dalam Suspense boundary 
                  agar tidak merusak proses prerendering halaman admin.
              */}
              <Suspense fallback={
                <div className="w-full max-w-md h-12 bg-white/5 animate-pulse rounded-2xl border border-white/10" />
              }>
                <FilterSection categories={categories} />
              </Suspense>
            </div>

            {/* Sisi kanan kosong agar layout tetap bersih & simetris */}
            <div className="w-20 hidden md:block"></div>
          </div>
        </header>

        {/* --- MAIN CONTENT --- */}
        <main className="flex-1 bg-transparent">
          {children}
        </main>

        {/* --- FOOTER --- */}
        <footer className="py-12 text-center border-t border-white/5 bg-[#0d0d0d]">
          <p className="text-gray-600 text-[10px] font-bold tracking-[0.4em] uppercase font-mono">
            © 2026 KERE HORE REVIEW • Kere Tapi Hore!
          </p>
        </footer>

      </body>
    </html>
  );
}