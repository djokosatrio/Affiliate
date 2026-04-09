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
    <div className="flex items-center w-full bg-[#1a1a1a] border border-white/10 rounded-xl md:rounded-2xl overflow-hidden shadow-inner group focus-within:border-blue-600 transition-all">
      
      <div className="flex-[1.5] min-w-0 flex items-center px-3 md:px-5 border-r border-white/5">
        <svg className="h-4 w-4 md:h-5 md:w-5 text-gray-500 mr-2 md:mr-3 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
        </svg>
        <input
          type="text"
          placeholder="Cari..."
          defaultValue={activeSearch}
          className="bg-transparent text-white text-[10px] md:text-base py-3 md:py-4 outline-none w-full placeholder-gray-600 min-w-0"
          onChange={(e) => updateFilter("q", e.target.value)}
        />
      </div>

      <div className="flex-1 min-w-0 bg-[#222222] flex items-center">
        <select 
          value={activeCat}
          onChange={(e) => updateFilter("cat", e.target.value)}
          className="bg-transparent text-blue-400 text-[9px] md:text-xs font-black uppercase tracking-tight md:tracking-widest outline-none cursor-pointer py-3 md:py-4 w-full text-center"
        >
          {categories.map((c) => (
            <option key={c} value={c} className="bg-[#1a1a1a] text-white">
              {c === "All" ? "SEMUA" : c.toUpperCase()}
            </option>
          ))}
        </select>
      </div>
    </div>
  );
}