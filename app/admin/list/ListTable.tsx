"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { getAllProducts, deleteProduct } from "../actions";

export default function ListTable() {
  const [products, setProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      try {
        const data = await getAllProducts();
        setProducts(data || []);
      } catch (e) {
        console.error("Fetch error:", e);
      } finally {
        setLoading(false);
      }
    }
    load();
  }, []);

  const handleDelete = async (id: number, title: string) => {
    if (confirm(`Hapus "${title}"?`)) {
      const res = await deleteProduct(id.toString());
      if (res.success) {
        setProducts(products.filter((p) => p.id !== id));
      }
    }
  };

  if (loading) return <div className="py-20 text-center text-gray-500 uppercase font-black text-[10px]">Membuka Database...</div>;

  return (
    <div className="overflow-hidden rounded-[35px] border border-white/5 bg-[#111113] shadow-2xl">
      <table className="w-full text-left">
        <thead>
          <tr className="border-b border-white/5 bg-white/[0.02]">
            <th className="p-7 text-[10px] font-black uppercase tracking-widest text-gray-500 text-left">Produk</th>
            <th className="p-7 text-[10px] font-black uppercase tracking-widest text-gray-500 text-right">Manajemen</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-white/5">
          {products.map((p) => (
            <tr key={p.id} className="hover:bg-white/[0.01] transition-all group">
              <td className="p-7 font-bold text-white uppercase italic text-lg text-left">{p.title}</td>
              <td className="p-7 text-right">
                <div className="flex justify-end gap-3">
                  <Link href={`/admin/edit/${p.id}`} className="px-5 py-2.5 bg-white/5 hover:bg-blue-600 text-[10px] font-black text-gray-400 hover:text-white rounded-xl transition-all border border-white/5 italic">Edit</Link>
                  <button onClick={() => handleDelete(p.id, p.title)} className="px-5 py-2.5 bg-red-600/5 hover:bg-red-600 text-[10px] font-black text-red-900 hover:text-white rounded-xl transition-all border border-red-900/20 italic">Hapus</button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}