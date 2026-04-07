"use client";
import { useRouter, useSearchParams } from "next/navigation";

export default function FilterSection({ categories }: { categories: string[] }) {
  const router = useRouter();
  const searchParams = useSearchParams();

  const activeCat = searchParams.get("cat") || "All";
  const activeSearch = searchParams.get("q") || "";

  const updateFilter = (key: string, value: string) => {
    const params = new URLSearchParams(searchParams.toString());
    if (value && value !== "All") {
      params.set(key, value);
    } else {
      params.delete(key);
    }
    router.push(`?${params.toString()}`);
  };

  return (
    <div className="flex items-center w-full max-w-4xl bg-[#1a1a1a] border border-white/10 rounded-2xl overflow-hidden shadow-inner group focus-within:border-blue-600 transition-all duration-300">
      
      {/* INPUT PENCARIAN (IKON JADI BIRU SAAT FOKUS) */}
      <div className="flex-1 flex items-center px-5 border-r border-white/5">
        <svg className="h-5 w-5 text-gray-500 group-focus-within:text-blue-500 transition-colors mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
        </svg>
        <input
          type="text"
          placeholder="Cari review produk..."
          defaultValue={activeSearch}
          className="bg-transparent text-white text-base py-4 outline-none w-full placeholder-gray-600"
          onChange={(e) => updateFilter("q", e.target.value)}
        />
      </div>

      {/* DROPDOWN KATEGORI (TEKS JADI BIRU) */}
      <div className="px-4 bg-[#222222] hover:bg-[#2a2a2a] transition-colors h-full flex items-center">
        <select 
          value={activeCat}
          onChange={(e) => updateFilter("cat", e.target.value)}
          className="bg-transparent text-blue-400 text-xs font-black uppercase tracking-widest outline-none cursor-pointer py-4 pr-2"
        >
          {categories.map((c) => (
            <option key={c} value={c} className="bg-[#1a1a1a] text-white">
              {c === "All" ? "SEMUA KATEGORI" : c.toUpperCase()}
            </option>
          ))}
        </select>
      </div>

    </div>
  );
}