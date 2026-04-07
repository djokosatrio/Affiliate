"use client"; // Wajib karena ada interaksi Supabase di sisi client

export const dynamic = "force-dynamic";

import { useState, useRef, Suspense } from "react";
import { supabase } from "@/src/lib/supabase";
import { saveProduct } from "../actions";

// Komponen Form Utama
function AdminForm() {
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState("");
  const formRef = useRef<HTMLFormElement>(null);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);
    setStatus("Sedang memproses... ⏳");

    const formData = new FormData(e.currentTarget);
    const files = formData.getAll("images") as File[];
    const uploadedUrls: string[] = [];

    try {
      if (files.length === 0 || files[0].size === 0) throw new Error("Pilih minimal satu gambar!");

      for (const file of files) {
        const fileName = `${Date.now()}-${file.name.replace(/\s+/g, "-")}`;
        const { error: uploadError } = await supabase.storage
          .from("product-images")
          .upload(fileName, file);

        if (uploadError) throw uploadError;

        const { data: urlData } = supabase.storage
          .from("product-images")
          .getPublicUrl(fileName);

        uploadedUrls.push(urlData.publicUrl);
      }

      const res = await saveProduct({
        title: formData.get("title") as string,
        description: formData.get("desc") as string,
        price: parseFloat(formData.get("price") as string),
        category: formData.get("category") as string,
        url: formData.get("url") as string,
        images: uploadedUrls,
      });

      if (res.success) {
        setStatus("✅ Berhasil! Produk sudah tayang di beranda.");
        formRef.current?.reset();
      } else {
        throw new Error("Gagal simpan ke database.");
      }

    } catch (err: any) {
      setStatus(`❌ Error: ${err.message}`);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen bg-[#0a0a0c] text-white py-12 px-4">
      <div className="max-w-3xl mx-auto bg-[#121418] p-10 rounded-[2.5rem] border border-white/5 shadow-2xl">
        <h1 className="text-4xl font-black mb-10 bg-gradient-to-r from-blue-400 to-purple-500 bg-clip-text text-transparent italic text-center tracking-tighter">
          ADMIN KERE HORE
        </h1>

        {status && (
          <div className={`mb-8 p-5 rounded-2xl text-center font-black uppercase tracking-widest border ${
            status.includes('✅') ? 'bg-green-500/10 border-green-500/20 text-green-400' : 'bg-red-500/10 border-red-500/20 text-red-400'
          }`}>
            {status}
          </div>
        )}

        <form ref={formRef} onSubmit={handleSubmit} className="space-y-6 text-left">
          <div className="grid md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="text-[10px] font-black text-gray-500 uppercase tracking-widest ml-1">Link Affiliate</label>
              <input name="url" className="w-full p-4 bg-[#1a1a1e] border border-white/5 rounded-2xl outline-none focus:border-blue-500" placeholder="https://shope.ee/..." required />
            </div>
            <div className="space-y-2">
              <label className="text-[10px] font-black text-gray-500 uppercase tracking-widest ml-1">Kategori</label>
              <input name="category" className="w-full p-4 bg-[#1a1a1e] border border-white/5 rounded-2xl outline-none focus:border-blue-500" placeholder="Fashion Pria" required />
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-[10px] font-black text-gray-500 uppercase tracking-widest ml-1">Nama Produk</label>
            <input name="title" className="w-full p-4 bg-[#1a1a1e] border border-white/5 rounded-2xl outline-none focus:border-blue-500" placeholder="Contoh: Celana Jogger DISAI" required />
          </div>

          <div className="space-y-2">
            <label className="text-[10px] font-black text-gray-500 uppercase tracking-widest ml-1">Review Singkat</label>
            <textarea name="desc" className="w-full p-4 bg-[#1a1a1e] border border-white/5 rounded-2xl h-32 outline-none focus:border-blue-500 resize-none" placeholder="Tulis review jujur kamu di sini..." required />
          </div>

          <div className="space-y-2">
            <label className="text-[10px] font-black text-gray-500 uppercase tracking-widest ml-1">Harga (Angka Saja)</label>
            <input name="price" type="number" className="w-full p-4 bg-[#1a1a1e] border border-white/5 rounded-2xl outline-none focus:border-blue-500" placeholder="89000" required />
          </div>

          <div className="space-y-2">
            <label className="text-[10px] font-black text-gray-500 uppercase tracking-widest ml-1">Upload Foto Produk</label>
            <input name="images" type="file" multiple accept="image/*" className="w-full p-4 bg-[#1a1a1e] border-2 border-dashed border-white/10 rounded-2xl file:bg-blue-600 file:border-0 file:rounded-xl file:text-white file:font-bold file:px-4 file:py-2" required />
          </div>

          <button type="submit" disabled={loading} className="w-full bg-blue-600 hover:bg-blue-500 p-6 rounded-2xl font-black text-xl italic transition-all shadow-[0_10px_40px_rgba(37,99,235,0.2)] disabled:opacity-50 uppercase tracking-tighter">
            {loading ? "SABAR, LAGI SIMPAN... ⏳" : "PUBLISH PRODUK 🚀"}
          </button>
        </form>
      </div>
    </div>
  );
}

// Komponen Export dengan Suspense
export default function AdminPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-[#0a0a0c] flex items-center justify-center text-white font-black uppercase tracking-widest">Memuat Dashboard Admin...</div>}>
      <AdminForm />
    </Suspense>
  );
}