"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { getAllProducts, deleteProduct, updateProduct } from "../actions";
import { supabase } from "@/src/lib/supabase";

export default function ListTableContent() {
  const [products, setProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [addingImageId, setAddingImageId] = useState<number | null>(null);
  const [quickLink, setQuickLink] = useState("");

  useEffect(() => { loadData(); }, []);

  async function loadData() {
    setLoading(true);
    try {
      const data = await getAllProducts();
      // SORTIR: 1. No Foto, 2. Klik terbanyak
      const sorted = (data || []).sort((a, b) => {
        if ((a.images?.length || 0) === 0) return -1;
        if ((b.images?.length || 0) === 0) return 1;
        return (b.clicks || 0) - (a.clicks || 0);
      });
      setProducts(sorted);
    } catch (err) {
      console.error("Gagal ambil data:", err);
    } finally {
      setLoading(false);
    }
  }

  const handleQuickAdd = async (product: any) => {
    if (!quickLink.trim()) return;
    try {
      const updatedImages = [...(product.images || []), quickLink.trim()];
      const res = await updateProduct(product.id.toString(), { ...product, images: updatedImages });
      if (res.success) {
        setProducts(products.map(p => p.id === product.id ? { ...p, images: updatedImages } : p));
        setAddingImageId(null); 
        setQuickLink("");
      }
    } catch (err) { alert("Gagal!"); }
  };

  const handleDelete = async (id: number, title: string, images: string[]) => {
    if (confirm(`Hapus "${title}"?`)) {
      const fileNames = images.filter(u => u.includes('supabase')).map(u => u.split("/").pop()!);
      if (fileNames.length > 0) await supabase.storage.from("product-images").remove(fileNames);
      await deleteProduct(id.toString());
      setProducts(products.filter(p => p.id !== id));
    }
  };

  if (loading) return <div className="py-20 text-center text-blue-500 font-black italic animate-pulse uppercase tracking-[0.4em]">Loading Database...</div>;

  return (
    <div className="max-w-6xl mx-auto py-6 font-sans">
      
      {/* HEADER - TOMBOL IMPORT SUDAH KEMBALI */}
      <div className="flex flex-col sm:flex-row justify-between items-center mb-8 bg-[#121418] p-6 rounded-[2.5rem] border border-white/5 shadow-2xl gap-4">
        <div className="ml-4">
          <h2 className="text-[10px] font-black uppercase text-gray-500 tracking-[0.3em] italic leading-none">Inventory Analytics</h2>
          <div className="flex items-center gap-2 mt-2">
            <span className="text-[8px] font-bold text-blue-500 uppercase tracking-widest italic">{products.length} Items Total</span>
          </div>
        </div>
        
        {/* GRUP TOMBOL ACTION */}
        <div className="flex items-center gap-3">
          <Link href="/admin/add" className="bg-blue-600 hover:bg-blue-500 text-white px-7 py-3.5 rounded-2xl font-black italic text-[10px] uppercase transition-all shadow-lg shadow-blue-900/20">
            + ADD PRODUCT
          </Link>
          <Link href="/admin/import" className="bg-white/5 hover:bg-white/10 text-white px-7 py-3.5 rounded-2xl font-black italic text-[10px] uppercase transition-all border border-white/10 flex items-center gap-2">
            <span>📦</span> IMPORT CSV
          </Link>
        </div>
      </div>

      <div className="overflow-hidden rounded-[2.5rem] border border-white/5 bg-[#111113] shadow-2xl">
        <table className="w-full text-left">
          <thead>
            <tr className="border-b border-white/5 bg-white/[0.02]">
              <th className="p-7 text-[10px] font-black uppercase text-gray-600 italic tracking-widest px-10">Product Details</th>
              <th className="p-7 text-[10px] font-black uppercase text-gray-600 italic tracking-widest text-center">Status</th>
              <th className="p-7 text-[10px] font-black uppercase text-gray-600 italic tracking-widest text-center">Popularity</th>
              <th className="p-7 text-[10px] font-black uppercase text-gray-600 italic tracking-widest text-right px-10">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-white/5">
            {products.map((p) => {
              const hasImg = p.images && p.images.length > 0;
              const lastClickDate = p.lastClickedAt 
                ? new Date(p.lastClickedAt).toLocaleString('id-ID', { 
                    timeZone: 'Asia/Jakarta', 
                    day: '2-digit', month: 'short', hour: '2-digit', minute: '2-digit', hour12: false 
                  }).replace(/\./g, ':')
                : "NO ACTIVITY";

              return (
                <tr key={p.id} className="group hover:bg-white/[0.01] transition-all">
                  <td className="p-7 px-10">
                    <div className="flex flex-col">
                      <span className="font-black text-white uppercase italic text-sm group-hover:text-blue-500 transition-colors line-clamp-1">{p.title}</span>
                      <span className="text-[9px] text-gray-600 font-bold mt-1 tracking-widest uppercase italic">RP {p.price.toLocaleString("id-ID")}</span>
                    </div>
                  </td>

                  <td className="p-7 text-center">
                    <div className="flex flex-col items-center gap-2">
                      <span className={`px-4 py-1.5 rounded-full text-[8px] font-black uppercase italic tracking-widest border ${hasImg ? 'bg-green-500/10 text-green-500 border-green-500/10' : 'bg-red-500/10 text-red-500 border-red-500/10 animate-pulse'}`}>
                        {hasImg ? '✅ READY' : '❌ NO IMAGE'}
                      </span>
                      {!hasImg && addingImageId !== p.id && (
                        <button onClick={() => setAddingImageId(p.id)} className="text-[8px] font-black text-blue-500 underline uppercase italic">+ QUICK ADD</button>
                      )}
                      {addingImageId === p.id && (
                        <div className="flex gap-1 mt-2">
                          <input autoFocus className="bg-black border border-blue-500/50 rounded-lg px-2 py-1 text-[9px] text-white w-24 outline-none" placeholder="Link..." value={quickLink} onChange={(e) => setQuickLink(e.target.value)} onKeyDown={(e) => e.key === 'Enter' && handleQuickAdd(p)} />
                          <button onClick={() => handleQuickAdd(p)} className="bg-blue-600 text-white px-2 rounded-lg text-[8px] font-black">OK</button>
                        </div>
                      )}
                    </div>
                  </td>

                  <td className="p-7">
                    <div className="flex flex-col items-center gap-2">
                      <div className="bg-blue-600 text-white px-5 py-1.5 rounded-full shadow-[0_5px_15px_rgba(37,99,235,0.4)]">
                        <span className="text-[10px] font-black italic tracking-tighter">{p.clicks || 0} CLICKS</span>
                      </div>
                      <div className="flex flex-col items-center">
                        <span className="text-[6px] font-black text-gray-600 uppercase tracking-[0.2em]">Last Clicked</span>
                        <span className="text-[8px] font-black text-blue-400 uppercase italic mt-0.5">{lastClickDate}</span>
                      </div>
                    </div>
                  </td>

                  <td className="p-7 text-right px-10">
                    <div className="flex justify-end gap-2 text-white">
                      <Link href={`/admin/edit/${p.id}`} className="px-4 py-2 bg-blue-600/10 hover:bg-blue-600 rounded-xl text-[9px] font-black uppercase italic text-blue-500 hover:text-white transition-all border border-blue-500/20">Edit</Link>
                      <button onClick={() => handleDelete(p.id, p.title, p.images)} className="px-4 py-2 bg-red-600/5 hover:bg-red-600 rounded-xl text-[9px] font-black uppercase italic text-red-500 hover:text-white transition-all border border-red-900/10">Hapus</button>
                    </div>
                  </td>
                </tr>
              )
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}