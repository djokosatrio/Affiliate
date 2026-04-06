"use client";

import { useEffect, useState } from "react";
import Image from "next/image";

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

  const PRODUCTS_PER_PAGE = 8;

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const res = await fetch("http://localhost:3001/products");
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
  }, []);

  // Filter, Search, Sort
  useEffect(() => {
    let temp = [...products];

    // Filter
    if (selectedCategory !== "All") {
      temp = temp.filter(p => p.category === selectedCategory);
    }
    // Search
    if (searchTerm.trim() !== "") {
      const term = searchTerm.toLowerCase();
      temp = temp.filter(
        p => p.title.toLowerCase().includes(term) || p.description.toLowerCase().includes(term)
      );
    }
    // Sort
    temp.sort((a, b) => {
      const priceA = Number(a.price);
      const priceB = Number(b.price);
      return sortPrice === "asc" ? priceA - priceB : priceB - priceA;
    });

    setFilteredProducts(temp);
    setCurrentPage(1); // reset page saat filter/search/sort berubah
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
      <div className="max-w-7xl mx-auto mb-6 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-4xl font-black tracking-tight bg-gradient-to-r from-blue-400 to-indigo-400 bg-clip-text text-transparent">
            Katalog Produk
          </h1>
          <p className="text-gray-500 mt-2 font-medium">Temukan detail produk terbaik pilihan kami.</p>
        </div>

        {/* Filters + Sort */}
        <div className="flex flex-col sm:flex-row gap-2">
          <select
            value={selectedCategory}
            onChange={e => setSelectedCategory(e.target.value)}
            className="px-3 py-2 rounded bg-gray-800 text-white border border-gray-700"
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
            className="px-3 py-2 rounded bg-gray-800 text-white border border-gray-700"
          />

          <select
            value={sortPrice}
            onChange={e => setSortPrice(e.target.value as "asc" | "desc")}
            className="px-3 py-2 rounded bg-gray-800 text-white border border-gray-700"
          >
            <option value="asc">Harga: Rendah → Tinggi</option>
            <option value="desc">Harga: Tinggi → Rendah</option>
          </select>
        </div>
      </div>

      {/* Produk Grid */}
      <div className="max-w-7xl mx-auto grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
        {loading
          ? Array.from({ length: PRODUCTS_PER_PAGE }).map((_, i) => (
              <div key={i} className="bg-gray-900/50 rounded-[2.5rem] h-[500px] animate-pulse border border-gray-800"></div>
            ))
          : paginatedProducts.map((p) => {
              const isExpanded = expandedIds.has(p.id);
              return (
                <div
                  key={p.id}
                  className="group flex flex-col bg-[#121418] border border-gray-800/40 rounded-[2.5rem] overflow-hidden hover:border-blue-500/30 transition-all duration-500 hover:shadow-[0_30px_60px_-15px_rgba(0,0,0,0.8)]"
                >
                  {/* Image */}
                  <div className="relative h-72 w-full overflow-hidden bg-gray-900">
                    <Image
                      src={p.image}
                      alt={p.title}
                      fill
                      className="object-cover transition-transform duration-700 group-hover:scale-110"
                      loading="lazy"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-[#121418] via-transparent to-transparent opacity-90" />
                  </div>

                  {/* Content */}
                  <div className="p-7 flex flex-col flex-grow -mt-12 relative z-10">
                    <span className="text-[10px] font-bold text-indigo-400 uppercase tracking-[0.25em] mb-3">
                      {p.category}
                    </span>
                    <h3 className="text-xl font-bold leading-tight mb-3 group-hover:text-blue-400 transition-colors line-clamp-1">
                      {p.title}
                    </h3>

                    {/* Expandable description */}
                    <div className="mb-6">
                      <p className={`text-gray-400 text-sm leading-relaxed font-light ${isExpanded ? '' : 'line-clamp-4'}`}>
                        {p.description || "Deskripsi tidak tersedia"}
                      </p>
                      {p.description && p.description.length > 80 && (
                        <button
                          className="text-blue-400 text-xs mt-1 underline"
                          onClick={() => toggleExpand(p.id)}
                        >
                          {isExpanded ? "Tutup" : "Selengkapnya"}
                        </button>
                      )}
                    </div>

                    {/* Bottom row */}
                    <div className="mt-auto pt-6 border-t border-gray-800/60 flex items-center justify-between">
                      <div className="flex flex-col">
                        <span className="text-[10px] text-gray-500 uppercase font-bold tracking-tighter">Harga Sekarang</span>
                        <p className="text-2xl font-black text-white tracking-tight">
                          <span className="text-blue-500 text-sm mr-1">Rp</span>
                          {Number(p.price).toLocaleString('id-ID')}
                        </p>
                      </div>
                      <a
                        href={p.affiliate_url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="group/btn"
                      >
                        <div className="bg-white hover:bg-blue-600 text-black hover:text-white w-12 h-12 rounded-2xl flex items-center justify-center transition-all duration-300 shadow-xl active:scale-90">
                          <svg 
                            xmlns="http://www.w3.org/2000/svg" 
                            viewBox="0 0 24 24" 
                            fill="currentColor" 
                            className="w-6 h-6"
                          >
                            <path fillRule="evenodd" d="M12.97 3.97a.75.75 0 011.06 0l7.5 7.5a.75.75 0 010 1.06l-7.5 7.5a.75.75 0 11-1.06-1.06l6.22-6.22H3a.75.75 0 010-1.5h16.19l-6.22-6.22a.75.75 0 010-1.06z" clipRule="evenodd" />
                          </svg>
                        </div>
                      </a>
                    </div>
                  </div>
                </div>
              );
            })}
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="max-w-7xl mx-auto mt-8 flex justify-center gap-2">
          {Array.from({ length: totalPages }, (_, i) => (
            <button
              key={i}
              onClick={() => setCurrentPage(i + 1)}
              className={`px-3 py-1 rounded ${
                currentPage === i + 1 ? "bg-blue-500 text-white" : "bg-gray-800 text-gray-300"
              }`}
            >
              {i + 1}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}