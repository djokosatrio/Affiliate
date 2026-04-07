"use client";
import { useRouter, useSearchParams } from "next/navigation";

export default function FilterSection({ categories }: { categories: string[] }) {
  const router = useRouter();
  const searchParams = useSearchParams();

  const updateFilter = (key: string, value: string) => {
    const params = new URLSearchParams(searchParams.toString());
    if (value) params.set(key, value);
    else params.delete(key);
    router.push(`?${params.toString()}`);
  };

  return (
    <div className="flex flex-wrap gap-3 w-full md:w-auto">
      <input
        type="text"
        placeholder="Cari produk..."
        className="bg-gray-900 border border-gray-800 p-2 rounded-lg outline-none focus:border-blue-500"
        onChange={(e) => updateFilter("q", e.target.value)}
      />
      <select 
        className="bg-gray-900 border border-gray-800 p-2 rounded-lg"
        onChange={(e) => updateFilter("cat", e.target.value)}
      >
        {categories.map((c) => <option key={c} value={c}>{c}</option>)}
      </select>
    </div>
  );
}