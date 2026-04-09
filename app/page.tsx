export const dynamic = "force-dynamic";

import { Suspense } from "react";
import { prisma } from "@/src/lib/prisma";
import ProductCard from "@/src/components/ProductCard";
import LoadMoreButton from "@/src/components/LoadMoreButton";

type SearchParams = { 
  q?: string; 
  autoId?: string;
  page?: string;
};

export default async function HomePage(props: { 
  searchParams: Promise<SearchParams>; 
}) {
  return (
    <div className="max-w-7xl mx-auto px-4 md:px-6 py-6 md:py-10">
      
      {/* === DAFTAR PRODUK === */}
      <Suspense fallback={
        <div className="flex flex-col items-center justify-center py-40">
          <div className="w-12 h-12 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mb-6"></div>
          <p className="text-gray-500 font-black uppercase tracking-[0.5em] text-[10px] animate-pulse">Menghubungkan ke Gudang...</p>
        </div>
      }>
        <ProductList searchParams={props.searchParams} />
      </Suspense>
    </div>
  );
}

// Komponen Daftar Produk
async function ProductList({ searchParams }: { searchParams: Promise<SearchParams> }) {
  const params = await searchParams;
  const query = params?.q || "";
  const autoId = params?.autoId || "";
  
  // Logic Pagination
  const currentPage = Number(params?.page) || 1;
  const pageSize = 12;

  const products = await prisma.product.findMany({
    where: query ? {
      OR: [
        { title: { contains: query, mode: "insensitive" } },
        { description: { contains: query, mode: "insensitive" } },
        { category: { contains: query, mode: "insensitive" } },
      ],
    } : {},
    orderBy: { createdAt: 'desc' },
    take: pageSize * currentPage,
  });

  const totalInDb = await prisma.product.count({
    where: query ? {
      OR: [
        { title: { contains: query, mode: "insensitive" } },
        { description: { contains: query, mode: "insensitive" } },
      ],
    } : {},
  });

  const hasMore = products.length < totalInDb;

  return (
    <>
      {/* Label & Status (Hanya Judul Katalog & Deskripsi Kecil) */}
      <div className="mb-8 md:mb-12 flex items-end justify-between border-b border-white/5 pb-8">
        <div className="flex items-center gap-4">
          <div className="h-8 md:h-12 w-2 bg-blue-600 rounded-full shadow-[0_0_20px_rgba(37,99,235,0.5)]"></div>
          <div>
            <h2 className="text-2xl md:text-4xl font-black text-white italic uppercase tracking-tighter">
              {query ? `Hasil Cari: "${query}"` : "Katalog Terbaru"}
            </h2>
            <p className="text-gray-500 text-[8px] md:text-[11px] font-bold uppercase tracking-[0.3em] mt-2 leading-relaxed">
              Review Produk Pilihan • Harga Kere Kualitas Hore • Rekomendasi Netizen
            </p>
          </div>
        </div>
        
        <div className="hidden sm:block text-right">
          <p className="text-blue-500 font-black text-3xl leading-none">{totalInDb}</p>
          <p className="text-gray-700 text-[9px] font-black uppercase tracking-widest">Items Ready</p>
        </div>
      </div>

    {/* Grid Kartu Produk */}
<div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-4 md:gap-6 items-start">
  {products.map((p) => (
    <ProductCard 
      key={p.id} 
      product={p} 
      autoOpen={autoId === String(p.id)} 
    />
  ))}
</div>

      {/* Tombol Load More */}
      {hasMore && (
        <div className="mt-20 mb-10 flex justify-center">
          <LoadMoreButton currentPage={currentPage} />
        </div>
      )}

      {/* State Jika Kosong */}
      {products.length === 0 && (
        <div className="text-center py-40 border-2 border-dashed border-white/5 rounded-[3rem] mt-10 bg-[#0d0f12]/50">
          <p className="text-gray-600 text-lg font-medium italic mb-2">"Wah, barangnya nggak ada di radar Kere Hore..."</p>
          <p className="text-blue-500 text-[10px] font-black uppercase tracking-widest">Coba cari kata kunci lain maszeh!</p>
        </div>
      )}
    </>
  );
}