"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";

export default function ProductCard({ product }: { product: any }) {
  const [activeImage, setActiveImage] = useState(product.images[0]);
  const [showModal, setShowModal] = useState(false);
  const [zoomIndex, setZoomIndex] = useState(0);

  const openZoom = (img: string) => {
    const index = product.images.indexOf(img);
    setZoomIndex(index !== -1 ? index : 0);
    setShowModal(true);
    document.body.style.overflow = 'hidden';
  };

  const closeZoom = () => {
    setShowModal(false);
    document.body.style.overflow = 'unset';
  };

  const nextZoom = (e: React.MouseEvent) => {
    e.stopPropagation(); 
    setZoomIndex((prev) => (prev + 1) % product.images.length);
  };

  const prevZoom = (e: React.MouseEvent) => {
    e.stopPropagation();
    setZoomIndex((prev) => (prev - 1 + product.images.length) % product.images.length);
  };

  return (
    <>
      <div className="group flex flex-col h-full bg-[#121418] border border-gray-800/40 rounded-[2.5rem] overflow-hidden hover:border-blue-500/30 transition-all duration-500 shadow-xl">
        
        {/* === 1. GAMBAR UTAMA === */}
        <div className="relative h-64 w-full overflow-hidden bg-gray-900 cursor-zoom-in">
          <Image
            src={activeImage || "/placeholder.png"}
            alt={product.title}
            fill
            className="object-cover transition-transform duration-700 hover:scale-105"
            onClick={() => openZoom(activeImage)} 
            unoptimized
          />
          <div onClick={() => openZoom(activeImage)} className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
            <span className="bg-black/60 px-4 py-2 rounded-full text-white text-[10px] font-bold border border-white/10 backdrop-blur-sm uppercase tracking-widest">🔍 Zoom Review</span>
          </div>
        </div>

        {/* === 2. THUMBNAILS === */}
        <div className="flex gap-2 p-4 overflow-x-auto no-scrollbar bg-[#0d0f12]">
          {product.images.map((img: string, idx: number) => (
            <button
              key={idx}
              onClick={() => setActiveImage(img)}
              className={`relative h-10 w-10 flex-shrink-0 rounded-lg overflow-hidden border-2 transition-all ${
                activeImage === img ? "border-blue-500 scale-105" : "border-gray-800 opacity-40 hover:opacity-100"
              }`}
            >
              <Image src={img} alt="thumb" fill className="object-cover" unoptimized />
            </button>
          ))}
        </div>
        
        {/* === 3. INFO PRODUK === */}
        <div className="p-6 pt-2 flex flex-col flex-grow">
          
          <div className="mb-3">
            <span className="bg-blue-600/10 text-blue-400 text-[9px] font-black uppercase tracking-[0.2em] px-3 py-1 rounded-full border border-blue-600/20">
              {product.category || "Review"}
            </span>
          </div>

          {/* Judul: Tetap bisa diklik ke detail */}
          <Link href={`/product/${product.id}`}>
            <h3 className="text-lg font-bold text-white hover:text-blue-400 transition-colors uppercase tracking-tight leading-tight min-h-[3rem]">
              {product.title}
            </h3>
          </Link>
          
          {/* Deskripsi: TIDAK BISA DIKLIK & TIDAK DIPOTONG (Line-clamp dibuang) */}
          {/* Kita kasih min-h supaya di beranda tetap sejajar */}
          <div className="text-gray-400 text-sm mt-4 leading-relaxed whitespace-pre-line min-h-[5rem]">
            {product.description}
          </div>

          {/* === 4. HARGA & TOMBOL (DIPAKSA DI PALING BAWAH) === */}
          <div className="mt-auto pt-6">
            <div className="flex items-center justify-between mb-4">
              <div className="flex flex-col">
                <span className="text-[10px] text-gray-600 font-bold uppercase tracking-widest">Harga </span>
                <p className="text-2xl font-black text-blue-400">
                  Rp {product.price.toLocaleString("id-ID")}
                </p>
              </div>
            </div>
            
            <a 
              href={product.affiliateUrl} 
              target="_blank" 
              className="block w-full text-center bg-blue-600 hover:bg-blue-500 text-white font-black py-4 rounded-2xl transition-all shadow-lg shadow-blue-600/20 active:scale-95"
            >
              GAS BELI SEKARANG 🛒
            </a>
          </div>
        </div>
      </div>

      {/* === 5. MODAL ZOOM === */}
      {showModal && (
        <div className="fixed inset-0 z-[999] bg-black/95 backdrop-blur-md flex items-center justify-center" onClick={closeZoom}>
          <button className="absolute top-8 right-8 text-white/50 hover:text-white text-5xl font-light">×</button>
          {product.images.length > 1 && (
            <button onClick={prevZoom} className="absolute left-4 md:left-10 bg-white/5 hover:bg-white/10 text-white w-14 h-14 rounded-full flex items-center justify-center text-2xl border border-white/10">‹</button>
          )}
          <div className="relative w-full max-w-5xl h-[80vh]" onClick={(e) => e.stopPropagation()}>
            <Image src={product.images[zoomIndex]} alt="Zoom" fill className="object-contain animate-in zoom-in duration-300" unoptimized />
          </div>
          {product.images.length > 1 && (
            <button onClick={nextZoom} className="absolute right-4 md:right-10 bg-white/5 hover:bg-white/10 text-white w-14 h-14 rounded-full flex items-center justify-center text-2xl border border-white/10">›</button>
          )}
        </div>
      )}
    </>
  );
}