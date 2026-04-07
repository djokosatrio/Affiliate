export const dynamic = "force-dynamic";

import { prisma } from "@/src/lib/prisma";
import ProductCard from "@/src/components/ProductCard";
import { Suspense } from "react";

type SearchParams = { 
  q?: string; 
  cat?: string; 
  sort?: string; 
};

// Komponen Utama
export default async function HomePage(props: { 
  searchParams: Promise<SearchParams>; 
}) {
  return (
    <div className="max-w-7xl mx-auto px-6 py-12">
      <Suspense fallback={<div className="text-center py-20 text-gray-500 font-black uppercase tracking-widest animate-pulse">Menyiapkan Katalog...</div>}>
        <ProductGrid searchParams={props.searchParams} />
      </Suspense>
    </div>
  );
}

// Komponen Grid Produk (Logika Async dipisah agar lebih aman saat Build)
async function ProductGrid({ searchParams }: { searchParams: Promise<SearchParams> }) {
  const params = await searchParams;
  
  const query = params?.q || "";
  const category = params?.cat || "All";
  const sort: "asc" | "desc" = params?.sort === "desc" ? "desc" : "asc";

  const products = await prisma.product.findMany({
    where: {
      AND: [
        category !== "All" ? { category } : {},
        {
          OR: [
            { title: { contains: query, mode: "insensitive" } },
            { description: { contains: query, mode: "insensitive" } },
          ],
        },
      ],
    },
    orderBy: { 
      price: sort 
    },
  });

  return (
    <>
      {/* Status Bar */}
      <div className="mb-10 flex flex-col gap-3">
        <div className="flex items-center gap-3">
          <div className="h-8 w-1.5 bg-gradient-to-b from-blue-400 to-purple-600 rounded-full shadow-[0_0_15px_rgba(59,130,246,0.5)]"></div>
          <h2 className="text-3xl font-black text-white italic uppercase tracking-tighter">
            {query ? `Hasil: "${query}"` : category === "All" ? "Katalog Terbaru" : category}
          </h2>
        </div>
        <p className="text-gray-500 text-[10px] font-bold tracking-[0.3em] uppercase ml-5">
          Ditemukan {products.length} Barang Pilihan <span className="text-blue-500">Kere Hore</span>
        </p>
      </div>

      {/* Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10">
        {products.map((p) => (
          <ProductCard key={p.id} product={p} />
        ))}
      </div>

      {products.length === 0 && (
        <div className="text-center py-40 border-2 border-dashed border-white/5 rounded-[40px] mt-10 bg-[#111111]/30">
          <p className="text-gray-500 text-lg font-medium italic">
            "Yah, barangnya nggak ada di gudang Kere Hore..."
          </p>
        </div>
      )}
    </>
  );
}