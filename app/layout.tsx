import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import React, { Suspense } from 'react'; 
import Image from 'next/image';
import FilterSection from "@/src/components/FilterSection";
import FloatingAd from "@/src/components/FloatingAd"; 
import { prisma } from "@/src/lib/prisma";

const geistSans = Geist({ variable: "--font-geist-sans", subsets: ["latin"] });
const geistMono = Geist_Mono({ variable: "--font-geist-mono", subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Kere Hore Review | Rekomendasi Produk Viral Pilihan Netizen",
  description: "Cari barang viral harga kere tapi kualitas hore? Kere Hore Review tempatnya! Temukan review jujur produk TikTok dan Shopee harga miring di sini.",
  verification: {
    google: "a5y1t_UsKZXf2HgmHdB5_mQEF6ttbDAyOvBeAur6Uug", 
  },
  openGraph: {
    title: "Kere Hore Review - Kere Tapi Hore!",
    description: "Gudang Review Barang Viral Harga Miring Kualitas Mewah.",
    url: "https://www.kerehore.online",
    siteName: "Kere Hore Review",
    images: [{ url: "/logo.png" }],
    locale: "id_ID",
    type: "website",
  },
};

export default async function RootLayout({ children }: { children: React.ReactNode }) {
  
  // Ambil Produk Terbaru secara otomatis untuk iklan melayang
  // Ini jauh lebih aman daripada hardcode ID 12 yang mungkin sudah kamu hapus
  const featuredProduct = await prisma.product.findFirst({
    orderBy: { createdAt: 'desc' }
  });

  return (
    <html lang="id" className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}>
      <body className="min-h-full flex flex-col bg-[#0a0a0a] text-gray-100 font-sans overflow-x-hidden">
        
        {/* --- HEADER STICKY --- */}
        <header className="sticky top-0 z-50 w-full bg-[#111111]/95 backdrop-blur-md border-b border-white/10 shadow-2xl">
          <div className="max-w-7xl mx-auto px-4 md:px-6 py-3 md:py-0 md:h-28 flex flex-wrap md:flex-nowrap items-center justify-between gap-y-4 md:gap-8">
            
            {/* LOGO & BRAND */}
            <div className="flex items-center gap-3 md:gap-6 shrink-0 w-full md:w-auto">
              <div className="relative w-10 h-10 md:w-20 md:h-20 rounded-full overflow-hidden border border-white/5 shadow-lg">
                <Image src="/logo.png" alt="Logo Kere Hore" fill className="object-cover" priority />
              </div>
              
              <div className="flex flex-col"> 
                <h1 className="text-xl md:text-5xl font-black bg-gradient-to-r from-blue-400 via-purple-500 to-indigo-400 bg-clip-text text-transparent tracking-tighter leading-tight md:leading-[1.4]">
                  KERE HORE
                </h1>
                <p className="text-[7px] md:text-[10px] text-gray-500 font-bold tracking-[0.3em] uppercase italic ml-1 hidden md:block">
                  Review Official • Kere Tapi Hore!
                </p>
              </div>
            </div>

            {/* FILTER SECTION (Hanya Search) */}
            <div className="w-full md:flex-1 flex justify-center max-w-4xl min-w-0">
              {/* FilterSection sekarang tidak butuh props categories */}
              <Suspense fallback={<div className="w-full h-10 bg-white/5 animate-pulse rounded-xl" />}>
                <FilterSection />
              </Suspense>
            </div>

            <div className="hidden md:block w-20"></div>
          </div>
        </header>

        {/* --- MAIN CONTENT --- */}
        <main className="flex-1 bg-transparent">
          {children}
        </main>

        {/* --- IKLAN MELAYANG POJOK --- */}
        {featuredProduct && <FloatingAd product={featuredProduct} />}

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