"use client";

import { useState, useRef } from "react";
import { supabase } from "@/src/lib/supabase";
import { saveProduct } from "../actions";

export default function AdminPage() {
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
      // 1. Validasi File
      if (files[0].size === 0) throw new Error("Pilih minimal satu gambar!");

      // 2. Upload Semua Gambar ke Supabase
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

      // 3. Simpan Data Teks ke Prisma
      const res = await saveProduct({
        title: formData.get("title"),
        description: formData.get("desc"),
        price: parseFloat(formData.get("price") as string),
        category: formData.get("category"),
        url: formData.get("url"),
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
      <div className="max-w-3xl mx-auto bg-[#121418] p-10 rounded-[2.5rem] border border-gray-800 shadow-2xl">
        <h1 className="text-3xl font-black mb-8 bg-gradient-to-r from-blue-400 to-blue-600 bg-clip-text text-transparent italic text-center">
          ADMIN KERE HORE
        </h1>

        {status && (
          <div className={`mb-6 p-4 rounded-2xl text-center font-bold border ${
            status.includes('✅') ? 'bg-green-500/10 border-green-500/20 text-green-400' : 'bg-red-500/10 border-red-500/20 text-red-400'
          }`}>
            {status}
          </div>
        )}

        <form ref={formRef} onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-2">
            <label className="text-xs font-bold text-gray-500 uppercase">Link Affiliate</label>
            <input name="url" className="w-full p-4 bg-gray-900 border border-gray-800 rounded-2xl outline-none focus:border-blue-500" placeholder="https://shope.ee/..." required />
          </div>

          <div className="space-y-2">
            <label className="text-xs font-bold text-gray-500 uppercase">Nama Produk</label>
            <input name="title" className="w-full p-4 bg-gray-900 border border-gray-800 rounded-2xl outline-none focus:border-blue-500" placeholder="Contoh: Celana Jogger DISAI" required />
          </div>

          <div className="space-y-2">
            <label className="text-xs font-bold text-gray-500 uppercase">Review Singkat</label>
            <textarea name="desc" className="w-full p-4 bg-gray-900 border border-gray-800 rounded-2xl h-32 outline-none focus:border-blue-500 resize-none" placeholder="Tulis review jujur kamu di sini..." required />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="text-xs font-bold text-gray-500 uppercase">Harga (Angka)</label>
              <input name="price" type="number" className="w-full p-4 bg-gray-900 border border-gray-800 rounded-2xl outline-none" placeholder="89000" required />
            </div>
            <div className="space-y-2">
              <label className="text-xs font-bold text-gray-500 uppercase">Kategori</label>
              <input name="category" className="w-full p-4 bg-gray-900 border border-gray-800 rounded-2xl outline-none" placeholder="Fashion Pria" required />
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-xs font-bold text-gray-500 uppercase">Upload Foto Produk (Multiple)</label>
            <input name="images" type="file" multiple accept="image/*" className="w-full p-3 bg-gray-900 border border-gray-800 rounded-2xl file:bg-blue-600 file:border-0 file:rounded-xl file:text-white file:font-bold file:px-4 file:py-2" required />
          </div>

          <button type="submit" disabled={loading} className="w-full bg-blue-600 hover:bg-blue-500 p-6 rounded-2xl font-black text-xl transition-all shadow-xl shadow-blue-600/20 disabled:opacity-50">
            {loading ? "Sabar, Lagi Simpan... ⏳" : "PUBLISH PRODUK 🚀"}
          </button>
        </form>
      </div>
    </div>
  );
}