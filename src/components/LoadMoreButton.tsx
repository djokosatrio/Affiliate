"use client";

import { useRouter, useSearchParams } from "next/navigation";

export default function LoadMoreButton({ currentPage }: { currentPage: number }) {
  const router = useRouter();
  const searchParams = useSearchParams();

  const handleLoadMore = () => {
    const params = new URLSearchParams(searchParams.toString());
    params.set("page", (currentPage + 1).toString());
    
    // scroll: false agar halaman tidak balik ke atas saat klik muat lebih banyak
    router.push(`?${params.toString()}`, { scroll: false });
  };

  return (
    <button 
      onClick={handleLoadMore}
      className="group relative px-10 py-5 bg-[#111318] border border-blue-600/30 rounded-2xl hover:border-blue-500 transition-all duration-300 active:scale-95"
    >
      <div className="flex items-center gap-3">
        <span className="text-white text-xs md:text-sm font-black uppercase tracking-[0.3em] italic">
          Muat Lebih Banyak
        </span>
        <span className="text-blue-500 animate-bounce">▼</span>
      </div>
      
      {/* Efek Glow */}
      <div className="absolute inset-0 bg-blue-600/5 blur-xl rounded-2xl group-hover:bg-blue-600/10 transition-all"></div>
    </button>
  );
}