"use client"; // Wajib pakai client karena ada interaksi klik & state

import { useState } from "react";
import Image from "next/image";

export default function ImageGallery({ images }: { images: string[] }) {
  // 1. State untuk gambar yang aktif di galeri
  const [activeImage, setActiveImage] = useState(images[0]);

  // 2. State untuk mengontrol apakah Modal Closeup terbuka
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Fungsi untuk membuka closeup
  const openCloseup = () => {
    setIsModalOpen(true);
    // Opsional: Matikan scroll body saat modal buka agar tidak goyang
    document.body.style.overflow = 'hidden';
  };

  // Fungsi untuk menutup closeup
  const closeCloseup = () => {
    setIsModalOpen(false);
    // Kembalikan scroll body
    document.body.style.overflow = 'unset';
  };

  return (
    <>
      <div className="flex flex-col gap-6 w-full">
        {/* === 1. GAMBAR UTAMA (BISA DIKLIK UNTUK CLOSEUP) === */}
        <button 
          onClick={openCloseup} // Klik untuk buka modal
          className="relative aspect-square w-full overflow-hidden rounded-[3rem] border border-gray-800 bg-[#121418] shadow-2xl group cursor-zoom-in"
          title="Klik untuk memperbesar"
        >
          <Image
            src={activeImage || "/placeholder.png"}
            alt="Product Detail"
            fill
            className="object-contain p-8 group-hover:scale-105 transition-transform duration-700"
            priority
          />
          {/* Efek Overlay saat Hover (Icon Zoom) */}
          <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
             <span className="text-white text-5xl">🔍</span>
          </div>
        </button>

        {/* === 2. DAFTAR GAMBAR KECIL (THUMBNAILS) === */}
        <div className="flex gap-4 overflow-x-auto pb-4 no-scrollbar">
          {images.map((img, index) => (
            <button
              key={index}
              onClick={() => setActiveImage(img)} // Ganti gambar aktif (bukan buka modal)
              className={`relative h-24 w-24 flex-shrink-0 overflow-hidden rounded-[1.5rem] border-2 transition-all duration-300 ${
                activeImage === img 
                  ? "border-blue-500 scale-110 shadow-lg shadow-blue-500/20" 
                  : "border-gray-800 opacity-50 hover:opacity-100"
              }`}
            >
              <Image
                src={img}
                alt={`View ${index + 1}`}
                fill
                className="object-cover"
              />
            </button>
          ))}
        </div>
      </div>

      {/* === 3. MODAL CLOSEUP (LIGHTBOX) === */}
      {isModalOpen && (
        <div 
          className="fixed inset-0 z-50 bg-black/95 backdrop-blur-sm flex items-center justify-center p-4 md:p-10 animate-fadeIn"
          onClick={closeCloseup} // Klik di mana saja di area hitam untuk menutup
        >
          {/* Tombol Tutup (X) */}
          <button 
            onClick={closeCloseup}
            className="absolute top-6 right-6 text-white/70 hover:text-white text-5xl font-bold z-50 transition-colors"
          >
            ×
          </button>
          
          {/* Wadah Gambar Closeup */}
          <div className="relative w-full h-full max-w-7xl max-h-[90vh]" onClick={(e) => e.stopPropagation()}>
             {/* e.stopPropagation agar klik di gambar tidak ikut menutup modal */}
            <Image
              src={activeImage}
              alt="Product Closeup"
              fill
              className="object-contain animate-zoomIn"
              priority
            />
          </div>
        </div>
      )}
    </>
  );
}