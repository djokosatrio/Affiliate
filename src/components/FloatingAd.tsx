"use client";

import { useState, useEffect } from "react";
import Image from "next/image";

export default function FloatingAd({ product }: { product: any }) {
  const [isVisible, setIsVisible] = useState(false);
  const [isClosed, setIsClosed] = useState(false);

  useEffect(() => {
    // Muncul setelah 3 detik
    const timer = setTimeout(() => {
      if (!isClosed) setIsVisible(true);
    }, 3000);
    return () => clearTimeout(timer);
  }, [isClosed]);

  if (isClosed || !isVisible || !product) return null;

  return (
    <div className="fixed bottom-6 right-6 z-[100] max-w-[280px] md:max-w-[350px] animate-in slide-in-from-bottom-10 duration-500">
      <div className="relative bg-[#111318] border border-blue-500/20 rounded-[1.5rem] p-4 shadow-[0_20px_50px_rgba(0,0,0,0.8)] overflow-hidden group">
        
        {/* Tombol Close */}
        <button onClick={() => setIsClosed(true)} className="absolute top-2 right-3 text-gray-500 hover:text-white text-2xl z-20">&times;</button>

        <div className="flex flex-col">
          <div className="flex items-center gap-2 mb-3">
            <span className="bg-red-600 text-[8px] font-black text-white px-2 py-0.5 rounded uppercase animate-pulse">Hot Review 🔥</span>
          </div>

          <div className="flex gap-4 items-center">
            {/* Gambar Produk */}
            <div className="relative w-16 h-16 md:w-20 md:h-20 shrink-0 rounded-xl overflow-hidden bg-black">
              <Image 
                src={product.images[0]} 
                alt="Promo"
                fill
                className="object-cover group-hover:scale-110 transition-transform duration-500"
                unoptimized
              />
            </div>

            <div className="flex flex-col min-w-0">
              <h4 className="text-white text-[10px] md:text-sm font-black uppercase leading-tight mb-1 truncate">
                {product.title}
              </h4>
              <p className="text-blue-400 text-xs md:text-base font-black mb-2">
                Rp {product.price.toLocaleString("id-ID")}
              </p>
              
              <a 
                href={`/#prod-${product.id}`} // Langsung panggil ID produk
                onClick={() => setIsVisible(false)}
                className="inline-block text-center bg-blue-600 hover:bg-white text-white hover:text-blue-600 text-[9px] font-black py-2 px-3 rounded-lg transition-all uppercase"
              >
                GAS CEK 🚀
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}