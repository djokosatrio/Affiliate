"use client";
import { useSearchParams } from "next/navigation";

export default function FilterSection() {
  const searchParams = useSearchParams();
  const activeSearch = searchParams.get("q") || "";

  const handleSearch = (value: string) => {
    const params = new URLSearchParams(searchParams.toString());
    if (value) {
      params.set("q", value);
    } else {
      params.delete("q");
    }
    // Refresh halaman untuk narik data hasil cari
    window.location.href = `/?${params.toString()}`;
  };

  return (
    <div className="w-full max-w-2xl mx-auto bg-[#1a1a1a] border border-white/10 rounded-2xl overflow-hidden shadow-2xl group focus-within:border-blue-600 transition-all">
      <div className="flex items-center px-5">
        <svg className="h-5 w-5 text-gray-500 mr-3 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
        </svg>
        <input
          type="text"
          placeholder="Cari racun murah di sini..."
          defaultValue={activeSearch}
          className="bg-transparent text-white text-sm md:text-base py-4 md:py-5 outline-none w-full placeholder-gray-600"
          onKeyDown={(e) => {
            if (e.key === "Enter") handleSearch((e.target as HTMLInputElement).value);
          }}
        />
        {activeSearch && (
          <button 
            onClick={() => handleSearch("")}
            className="text-gray-500 hover:text-white text-xs font-bold uppercase tracking-widest ml-2"
          >
            Clear
          </button>
        )}
      </div>
    </div>
  );
}