"use client";

import { useState, useEffect } from "react";
import Image from "next/image";

export default function ProductCard({ product, autoOpen }: { product: any, autoOpen?: boolean }) {
  // State untuk gambar yang sedang aktif dilihat
  const [activeImage, setActiveImage] = useState(product.images[0]);
  const [showModal, setShowModal] = useState(false);

  // Update activeImage jika product berubah
  useEffect(() => {
    setActiveImage(product.images[0]);
  }, [product]);

  useEffect(() => {
    if (autoOpen) {
      setShowModal(true);
      document.body.style.overflow = 'hidden';
    }
  }, [autoOpen]);

  const closeModal = () => {
    setShowModal(false);
    document.body.style.overflow = 'unset';
    if (autoOpen) {
      window.history.pushState(null, "", "/");
    }
  };

  const handleAffiliateClick = () => {
    fetch(`/api/clicks/${product.id}`, { method: "POST", keepalive: true })
      .catch(err => console.error("Tracking Error:", err));
  };

  return (
    <>
      {/* === KARTU GRID === */}
      <div 
        className="group flex flex-col h-full bg-[#121418] border border-gray-800/40 rounded-[1.2rem] md:rounded-[2rem] overflow-hidden hover:border-blue-500/30 transition-all duration-500 shadow-xl cursor-pointer" 
        onClick={() => { setShowModal(true); document.body.style.overflow = 'hidden'; }}
      >
        <div className="relative aspect-square w-full overflow-hidden bg-gray-900">
          <Image
            src={product.images[0] || "/placeholder.png"}
            alt={product.title}
            fill
            className="object-cover object-center transition-transform duration-700 md:hover:scale-110"
            unoptimized
          />
        </div>

        <div className="p-3 md:p-5 flex flex-col flex-grow">
          <div className="mb-2 flex">
            <span className="bg-blue-600 text-white text-[7px] md:text-[9px] font-black uppercase px-2 py-0.5 rounded-sm">
              {product.category || "REVIEW"}
            </span>
          </div>

          <h3 className="text-[10px] md:text-sm font-extrabold text-white uppercase leading-tight line-clamp-2 mb-2 min-h-[2.5em]">
            {product.title}
          </h3>

          {product.description && (
            <p className="text-[8px] md:text-[11px] text-gray-500 line-clamp-2 leading-relaxed mb-4 italic">
              {product.description}
            </p>
          )}

          <div className="mt-auto pt-3 border-t border-white/5">
            <p className="text-[12px] md:text-lg font-black text-blue-400">
              Rp {product.price.toLocaleString("id-ID")}
            </p>
            <div className="mt-2 text-[7px] md:text-[9px] text-blue-500 font-bold uppercase tracking-widest group-hover:text-white transition-colors">
              Klik Detail ➔
            </div>
          </div>
        </div>
      </div>

      {/* === MODAL POP-UP (DETAIL DENGAN MULTI-GAMBAR) === */}
      {showModal && (
        <div className="fixed inset-0 z-[999] bg-black/95 flex items-center justify-center p-2 md:p-10" onClick={closeModal}>
          <div className="relative w-full max-w-6xl max-h-[95vh] md:max-h-[90vh] bg-[#101216] border border-white/10 rounded-[1.5rem] md:rounded-[2.5rem] overflow-hidden shadow-2xl flex flex-col md:flex-row animate-in zoom-in duration-300" onClick={(e) => e.stopPropagation()}>
            
            <button onClick={closeModal} className="absolute top-4 right-5 text-white/50 hover:text-white text-3xl md:text-4xl z-50 p-2">&times;</button>
            
            {/* AREA GAMBAR (KIRI) */}
            <div className="flex-1 w-full md:w-1/2 flex flex-col bg-black/20 border-b md:border-b-0 md:border-r border-white/5">
              {/* Gambar Utama */}
              <div className="relative flex-grow h-64 md:h-[450px] w-full flex items-center justify-center p-4">
                <Image 
                  src={activeImage} 
                  alt={product.title} 
                  fill 
                  className="object-contain p-4 md:p-10" 
                  unoptimized 
                />
              </div>

              {/* LIST GAMBAR (THUMBNAILS) - Muncul jika gambar > 1 */}
              {product.images.length > 1 && (
                <div className="flex gap-3 p-4 bg-black/40 overflow-x-auto no-scrollbar justify-center border-t border-white/5">
                  {product.images.map((img: string, idx: number) => (
                    <button
                      key={idx}
                      onClick={() => setActiveImage(img)}
                      className={`relative w-12 h-12 md:w-20 md:h-20 rounded-xl overflow-hidden border-2 transition-all duration-300 flex-shrink-0 ${
                        activeImage === img ? "border-blue-600 scale-105 shadow-[0_0_15px_rgba(37,99,235,0.4)]" : "border-white/10 opacity-40 hover:opacity-100"
                      }`}
                    >
                      <Image src={img} alt={`Thumb ${idx}`} fill className="object-cover" unoptimized />
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* AREA DETAIL (KANAN) */}
            <div className="flex-1 w-full md:w-1/2 p-6 md:p-10 flex flex-col overflow-y-auto no-scrollbar">
              <div className="mb-4">
                <span className="bg-blue-600 text-white text-[9px] md:text-[11px] font-black uppercase px-3 py-1 rounded-sm">
                  {product.category || "REVIEW"}
                </span>
              </div>
              <h1 className="text-xl md:text-3xl font-black text-white uppercase mb-4 leading-tight">{product.title}</h1>
              
              <div className="text-gray-400 text-xs md:text-base mt-2 leading-relaxed whitespace-pre-line border-t border-white/5 pt-5 mb-8">
                {product.description}
              </div>

              <div className="mt-auto pt-6 border-t border-white/5 space-y-4">
                <div>
                  <p className="text-[10px] text-gray-600 font-bold uppercase mb-1">Harga Terbaik</p>
                  <p className="text-2xl md:text-4xl font-black text-blue-400">Rp {product.price.toLocaleString("id-ID")}</p>
                </div>
                
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <a href={product.affiliateUrl} target="_blank" onClick={handleAffiliateClick} className="bg-blue-600 hover:bg-white hover:text-blue-600 text-white text-center py-4 rounded-xl font-black transition-all border-2 border-blue-600 uppercase">
                    GAS BELI SEKARANG 🛒
                  </a>
                  <button onClick={closeModal} className="bg-transparent text-gray-400 hover:text-white border border-white/10 py-4 rounded-xl font-bold uppercase transition-all">
                    Racun Lainnya
                  </button>
                </div>
              </div>
            </div>

          </div>
        </div>
      )}
    </>
  );
}