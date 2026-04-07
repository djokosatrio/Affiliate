import { prisma } from "@/src/lib/prisma";
import ProductCard from "@/src/components/ProductCard";

// Definisi tipe untuk parameter pencarian dari URL
type SearchParams = { 
  q?: string; 
  cat?: string; 
  sort?: string; 
};

export default async function HomePage(props: { 
  searchParams: Promise<SearchParams>; 
}) {
  // Tunggu data params dari URL (Next.js 15+ style)
  const params = await props.searchParams;
  
  const query = params.q || "";
  const category = params.cat || "All";
  const sort: "asc" | "desc" = params.sort === "desc" ? "desc" : "asc";

  // LOGIKA AMBIL DATA: Mengambil data berdasarkan filter yang dikirim dari Layout
  const products = await prisma.product.findMany({
    where: {
      AND: [
        // Filter Kategori (Jika bukan 'All')
        category !== "All" ? { category } : {},
        // Filter Pencarian (Cek Judul dan Deskripsi)
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
    <div className="max-w-7xl mx-auto px-6 py-12">
      
      {/* STATUS BAR: Menampilkan info apa yang sedang dilihat user */}
      <div className="mb-10 flex flex-col gap-3">
        <div className="flex items-center gap-3">
          <div className="h-8 w-1.5 bg-gradient-to-b from-blue-400 to-purple-600 rounded-full shadow-[0_0_10px_rgba(59,130,246,0.5)]"></div>
          <h2 className="text-3xl font-black text-white italic uppercase tracking-tighter">
            {query ? `Hasil: "${query}"` : category === "All" ? "Katalog Terbaru" : category}
          </h2>
        </div>
        <p className="text-gray-500 text-xs font-bold tracking-[0.2em] uppercase ml-5">
          Ditemukan {products.length} Barang Pilihan
        </p>
      </div>

      {/* GRID PRODUK: Menampilkan kartu produk */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10">
        {products.map((p) => (
          <ProductCard key={p.id} product={p} />
        ))}
      </div>

      {/* TAMPILAN JIKA DATA KOSONG */}
      {products.length === 0 && (
        <div className="text-center py-40 border-2 border-dashed border-white/5 rounded-[40px] mt-10 bg-[#111111]/30">
          <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-white/5 mb-6">
            <svg className="w-10 h-10 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </div>
          <p className="text-gray-500 text-lg font-medium italic">
            "Yah, barangnya nggak ada di gudang Kere Hore..."
          </p>
          <p className="text-gray-700 text-sm mt-2 font-bold uppercase tracking-widest">
            Coba cari kata kunci lain
          </p>
        </div>
      )}
      
    </div>
  );
}