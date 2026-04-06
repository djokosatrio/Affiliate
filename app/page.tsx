"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { APP_CONFIG } from "@/src/lib/config"; // <-- 1. Import Config Global

interface Product {
  id: number;
  title: string;
  description: string;
  price: string;
  image: string;
  affiliate_url: string;
  created_at: string;
  category: string;
}

export default function ProductsPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [filteredProducts, setFilteredProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [expandedIds, setExpandedIds] = useState<Set<number>>(new Set());
  const [selectedCategory, setSelectedCategory] = useState<string>("All");
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [sortPrice, setSortPrice] = useState<"asc" | "desc">("asc");
  const [currentPage, setCurrentPage] = useState<number>(1);

  // 2. Mengambil jumlah item per halaman dari config
  const PRODUCTS_PER_PAGE = APP_CONFIG.ITEMS_PER_PAGE;

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        // 3. Menggunakan API_URL dari config
        const res = await fetch(`${APP_CONFIG.API_URL}/products`);
        if (!res.ok) throw new Error(`HTTP error ${res.status}`);
        const data: Product[] = await res.json();
        setProducts(data);
      } catch (err) {
        console.error("Fetch error:", err);
        setProducts([]);
      } finally {
        setLoading(false);
      }
    };
    fetchProducts();
  }, []); // APP_CONFIG bersifat statis, tidak perlu masuk dependency array

  // Logic: Filter, Search, Sort
  useEffect(() => {
    let temp = [...products];

    if (selectedCategory !== "All") {
      temp = temp.filter(p => p.category === selectedCategory);
    }

    if (searchTerm.trim() !== "") {
      const term = searchTerm.toLowerCase();
      temp = temp.filter(
        p => p.title.toLowerCase().includes(term) || p.description.toLowerCase().includes(term)
      );
    }

    temp.sort((a, b) => {
      const priceA = Number(a.price);
      const priceB = Number(b.price);
      return sortPrice === "asc" ? priceA - priceB : priceB - priceA;
    });

    setFilteredProducts(temp);
    setCurrentPage(1); 
  }, [products, selectedCategory, searchTerm, sortPrice]);

  const toggleExpand = (id: number) => {
    setExpandedIds(prev => {
      const newSet = new Set(prev);
      if (newSet.has(id)) newSet.delete(id);
      else newSet.add(id);
      return newSet;
    });
  };

  const categories = ["All", ...Array.from(new Set(products.map(p => p.category)))];

  // Paginasi
  const totalPages = Math.ceil(filteredProducts.length / PRODUCTS_PER_PAGE);
  const paginatedProducts = filteredProducts.slice(
    (currentPage - 1) * PRODUCTS_PER_PAGE,
    currentPage * PRODUCTS_PER_PAGE
  );

  return (
    <div className="p-6 bg-[#0a0a0c] text-gray-100 min-h-screen">
      {/* Header + Filters */}
      <div className="max-w-7xl mx-auto mb-10 flex flex-col lg:flex-row lg:items-end lg:justify-between gap-6">
        <div>
          <h1 className="text-5xl font-black tracking-tight bg-gradient-to-r from-blue-400 via-indigo-400 to-purple-500 bg-clip-text text-transparent">
            {APP_CONFIG.APP_NAME} {/* 4. Nama Aplikasi dari config */}
          </h1>
          <p className="text-gray-500 mt-3 font-medium text-lg">Temukan detail produk terbaik pilihan kami.</p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 w-full lg:w-auto">
          <select
            value={selectedCategory}
            onChange={e => setSelectedCategory(e.target.value)}
            className="px-4 py-3 rounded-xl bg-gray-900 text-white border border-gray-800 focus:border-blue-500 outline-none transition-all"
          >
            {categories.map(cat => (
              <option key={cat} value={cat}>{cat}</option>
            ))}
          </select>

          <input
            type="text"
            placeholder="Cari produk..."
            value={searchTerm}
            onChange={e => setSearchTerm(e.target.value)}
            className="px-4 py-3 rounded-xl bg-gray-900 text-white border border-gray-800 focus:border-blue-500 outline-none transition-all"
          />

          <select
            value={sortPrice}
            onChange={e => setSortPrice(e.target.value as "asc" | "desc")}
            className="px-4 py-3 rounded-xl bg-gray-900 text-white border border-gray-800 focus:border-blue-500 outline-none transition-all"
          >
            <option value="asc">Harga: Terendah</option>
            <option value="desc">Harga: Tertinggi</option>
          </select>
        </div>
      </div>

      {/* Produk Grid */}
      <div className="max-w-7xl mx-auto grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
        {loading ? (
          Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="bg-gray-900/50 rounded-[2.5rem] h-[450px] animate-pulse border border-gray-800"></div>
          ))
        ) : paginatedProducts.length > 0 ? (
          paginatedProducts.map((p) => {
            const isExpanded = expandedIds.has(p.id);
            return (
              <div
                key={p.id}
                className="group flex flex-col bg-[#121418] border border-gray-800/40 rounded-[2.5rem] overflow-hidden hover:border-blue-500/30 transition-all duration-500 hover:shadow-[0_30px_60px_-15px_rgba(0,0,0,0.8)]"
              >
                <div className="relative h-64 w-full overflow-hidden bg-gray-900">
                  <Image
                    src={p.image}
                    alt={p.title}
                    fill
                    className="object-cover transition-transform duration-700 group-hover:scale-110"
                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 25vw"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#121418] via-transparent to-transparent opacity-80" />
                </div>

                <div className="p-7 flex flex-col flex-grow -mt-10 relative z-10">
                  <span className="text-[10px] font-bold text-indigo-400 uppercase tracking-[0.25em] mb-2">
                    {p.category}
                  </span>
                  <h3 className="text-xl font-bold leading-tight mb-3 group-hover:text-blue-400 transition-colors">
                    {p.title}
                  </h3>

                  <div className="mb-6">
                    <p className={`text-gray-400 text-sm leading-relaxed font-light ${isExpanded ? '' : 'line-clamp-3'}`}>
                      {p.description || "Deskripsi tidak tersedia"}
                    </p>
                    {p.description && p.description.length > 100 && (
                      <button
                        className="text-blue-400 text-xs mt-2 font-medium hover:text-blue-300 transition-colors"
                        onClick={() => toggleExpand(p.id)}
                      >
                        {isExpanded ? "← Tutup" : "Baca Selengkapnya"}
                      </button>
                    )}
                  </div>

                  <div className="mt-auto pt-6 border-t border-gray-800/60 flex items-center justify-between">
                    <div className="flex flex-col">
                      <span className="text-[10px] text-gray-500 uppercase font-bold tracking-wider">Harga</span>
                      <p className="text-2xl font-black text-white tracking-tight">
                        <span className="text-blue-500 text-sm mr-1">Rp</span>
                        {new Intl.NumberFormat('id-ID').format(Number(p.price))}
                      </p>
                    </div>
                    <a
                      href={p.affiliate_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="bg-white hover:bg-blue-600 text-black hover:text-white w-12 h-12 rounded-2xl flex items-center justify-center transition-all duration-300 shadow-xl active:scale-95"
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-6 h-6">
                        <path fillRule="evenodd" d="M12.97 3.97a.75.75 0 011.06 0l7.5 7.5a.75.75 0 010 1.06l-7.5 7.5a.75.75 0 11-1.06-1.06l6.22-6.22H3a.75.75 0 010-1.5h16.19l-6.22-6.22a.75.75 0 010-1.06z" clipRule="evenodd" />
                      </svg>
                    </a>
                  </div>
                </div>
              </div>
            );
          })
        ) : (
          <div className="col-span-full py-20 text-center">
            <p className="text-gray-500 text-xl italic">Produk tidak ditemukan...</p>
          </div>
        )}
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="max-w-7xl mx-auto mt-12 flex justify-center items-center gap-3">
          <button 
            disabled={currentPage === 1}
            onClick={() => setCurrentPage(prev => prev - 1)}
            className="p-2 rounded-lg bg-gray-800 disabled:opacity-30"
          >
            Prev
          </button>
          {Array.from({ length: totalPages }, (_, i) => (
            <button
              key={i}
              onClick={() => setCurrentPage(i + 1)}
              className={`w-10 h-10 rounded-xl font-bold transition-all ${
                currentPage === i + 1 ? "bg-blue-500 text-white shadow-lg shadow-blue-500/20" : "bg-gray-800 text-gray-400 hover:bg-gray-700"
              }`}
            >
              {i + 1}
            </button>
          ))}
          <button 
            disabled={currentPage === totalPages}
            onClick={() => setCurrentPage(prev => prev + 1)}
            className="p-2 rounded-lg bg-gray-800 disabled:opacity-30"
          >
            Next
          </button>
        </div>
      )}
    </div>
  );
}