import { prisma } from "@/src/lib/prisma";
import { APP_CONFIG } from "@/src/lib/config";
import ProductCard from "@/src/components/ProductCard";
import FilterSection from "@/src/components/FilterSection";

// 1. Pastikan fungsi diawali dengan 'export default async function' a
// 2. Pastikan ada kurung kurawal buka '{' di akhir baris ini
export default async function HomePage(props: {
  searchParams: Promise<{ q?: string; cat?: string; sort?: string }>;
}) {
  // Buka isi searchParams (Wajib untuk Next.js 15+)
  const params = await props.searchParams;
  const query = params.q || "";
  const category = params.cat || "All";
  const sort = params.sort === "desc" ? "desc" : "asc";

  // Ambil Data dari DB
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
    orderBy: { price: sort as any },
  });

  // Ambil Daftar Kategori untuk Filter
  const categoriesRaw = await prisma.product.findMany({
    select: { category: true },
    distinct: ["category"],
  });
const categories = ["All", ...categoriesRaw.map((c: { category: string }) => c.category)];
  // Pastikan RETURN berada di dalam fungsi
  return (
    <main className="min-h-screen bg-[#0a0a0c] text-white p-8">
      <div className="max-w-7xl mx-auto">
        <header className="mb-12 flex flex-col md:flex-row justify-between items-end gap-6">
          <div>
            <h1 className="text-5xl font-black bg-gradient-to-r from-blue-400 to-purple-500 bg-clip-text text-transparent">
              {APP_CONFIG.APP_NAME}
            </h1>
            <p className="text-gray-400 mt-2">Rekomendasi Produk Pilihan Netizen Indonesia 🇮🇩</p>
          </div>
          <FilterSection categories={categories} />
        </header>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {products.map((p) => (
            <ProductCard key={p.id} product={p} />
          ))}
        </div>

        {products.length === 0 && (
          <div className="text-center py-20 text-gray-500 italic">
            Belum ada produk untuk ditampilkan.
          </div>
        )}
      </div>
    </main>
  );
} // <--- PASTIKAN ADA KURUNG TUTUP INI DI AKHIR FILE