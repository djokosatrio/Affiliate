"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { getProductById, updateProduct } from "../../actions";
import { supabase } from "@/src/lib/supabase";
import Image from "next/image";

export default function EditPage() {
  const { id } = useParams();
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [status, setStatus] = useState("");
  const [formData, setFormData] = useState<any>(null);
  const [currentImages, setCurrentImages] = useState<string[]>([]);
  
  // State untuk menampung file mana saja yang mau dihapus dari Storage
  const [imagesToDelete, setImagesToDelete] = useState<string[]>([]);

  useEffect(() => {
    async function loadData() {
      const product = await getProductById(id as string);
      if (product) {
        setFormData({
          title: product.title,
          desc: product.description,
          price: product.price,
          category: product.category,
          url: product.affiliateUrl,
        });
        setCurrentImages(product.images || []);
      }
      setLoading(false);
    }
    loadData();
  }, [id]);

  // Fungsi untuk hapus dari tampilan UI saja (ditampung dulu)
  const handleRemoveImagePreview = (imgUrl: string, index: number) => {
    // Masukkan ke daftar hapus
    setImagesToDelete((prev) => [...prev, imgUrl]);
    // Hilangkan dari tampilan
    setCurrentImages((prev) => prev.filter((_, i) => i !== index));
  };

  async function handleUpdate(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);
    setStatus("Lagi update data... ⏳");

    const form = e.currentTarget;
    const fileInput = form.querySelector('input[type="file"]') as HTMLInputElement;
    const files = Array.from(fileInput.files || []);
    
    let updatedImages = [...currentImages];

    try {
      // 1. PROSES HAPUS FILE DARI SUPABASE STORAGE (Hanya yang tadi di-klik 'X')
      if (imagesToDelete.length > 0) {
        for (const imgUrl of imagesToDelete) {
          const fileName = imgUrl.split("/").pop(); // Ambil nama file dari URL
          if (fileName) {
            await supabase.storage.from("product-images").remove([fileName]);
          }
        }
      }

      // 2. UPLOAD FILE BARU (Jika ada)
      if (files.length > 0 && files[0].size > 0) {
        for (const file of files) {
          const fileName = `${Date.now()}-${file.name.replace(/\s+/g, "-")}`;
          await supabase.storage.from("product-images").upload(fileName, file);
          const { data } = supabase.storage.from("product-images").getPublicUrl(fileName);
          updatedImages.push(data.publicUrl);
        }
      }

      // 3. UPDATE DATABASE
      const res = await updateProduct(id as string, {
        title: formData.title,
        description: formData.desc,
        price: parseFloat(formData.price),
        category: formData.category,
        url: formData.url,
        images: updatedImages 
      });

      if (res.success) {
        setStatus("✅ Berhasil Diupdate! Data & Storage Bersih.");
        setTimeout(() => { window.location.reload(); }, 1000);
      }
    } catch (err) {
      console.error(err);
      setStatus("❌ Gagal update.");
    } finally {
      setLoading(false);
    }
  }

  if (loading && !formData) return <div className="text-white text-center py-20">Loading Data...</div>;

  return (
    <div className="min-h-screen bg-[#0a0a0c] text-white py-12 px-4">
      <div className="max-w-3xl mx-auto bg-[#121418] p-8 md:p-12 rounded-[3rem] border border-gray-800 shadow-2xl">
        <h1 className="text-2xl font-black mb-8 text-orange-500 italic uppercase">Edit Gallery & Link ✏️</h1>
        
        <form onSubmit={handleUpdate} className="space-y-6">
          
          {/* MANAGE FOTO */}
          <div className="space-y-4">
            <p className="text-[10px] font-bold text-gray-500 uppercase tracking-widest ml-2">Foto Saat Ini ({currentImages.length})</p>
            <div className="grid grid-cols-3 md:grid-cols-5 gap-4 bg-black/30 p-4 rounded-3xl border border-gray-800">
              {currentImages.map((img, idx) => (
                <div key={idx} className="relative aspect-square rounded-xl overflow-hidden border border-gray-700 group">
                  <Image src={img} alt="preview" fill className="object-cover" unoptimized />
                  <button 
                    type="button" 
                    onClick={() => handleRemoveImagePreview(img, idx)} 
                    className="absolute top-1 right-1 bg-red-600 text-white w-5 h-5 rounded-full text-[10px] font-bold opacity-0 group-hover:opacity-100 transition-opacity"
                  >
                    ✕
                  </button>
                </div>
              ))}
              {currentImages.length === 0 && <p className="text-xs text-gray-600 col-span-full py-4 text-center">Tidak ada foto.</p>}
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-[10px] font-bold text-gray-500 uppercase ml-2">Link Affiliate Shopee</label>
            <input 
              value={formData.url || ""} 
              onChange={e => setFormData({...formData, url: e.target.value})}
              className="w-full p-4 bg-gray-900 border border-gray-800 rounded-2xl outline-none focus:border-orange-500 transition-all text-blue-400" 
              placeholder="https://shope.ee/..." 
            />
          </div>

          <div className="space-y-2">
            <label className="text-[10px] font-bold text-gray-500 uppercase ml-2">Nama Produk</label>
            <input value={formData.title} onChange={e => setFormData({...formData, title: e.target.value})} className="w-full p-4 bg-gray-900 border border-gray-800 rounded-2xl outline-none focus:border-orange-500" />
          </div>
          
          <div className="space-y-2">
            <label className="text-[10px] font-bold text-gray-500 uppercase ml-2">Ulasan (Description)</label>
            <textarea value={formData.desc} onChange={e => setFormData({...formData, desc: e.target.value})} className="w-full p-4 bg-gray-900 border border-gray-800 rounded-2xl h-48 outline-none focus:border-orange-500 resize-none" />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <input type="number" value={formData.price} onChange={e => setFormData({...formData, price: e.target.value})} className="p-4 bg-gray-900 border border-gray-800 rounded-2xl outline-none" />
            <input value={formData.category} onChange={e => setFormData({...formData, category: e.target.value})} className="p-4 bg-gray-900 border border-gray-800 rounded-2xl outline-none" />
          </div>

          <div className="p-6 bg-blue-600/5 rounded-3xl border border-dashed border-blue-500/20 space-y-2">
            <p className="text-[10px] font-bold text-blue-500 uppercase">Tambah Foto Baru</p>
            <input type="file" multiple className="block w-full text-xs text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:bg-blue-600 file:text-white" />
          </div>

          <button type="submit" disabled={loading} className="w-full bg-orange-600 hover:bg-orange-500 p-6 rounded-2xl font-black text-xl shadow-xl shadow-orange-600/20 transition-all active:scale-95">
            {loading ? "PROSES UPDATE..." : "UPDATE SEKARANG 🚀"}
          </button>
        </form>

        {status && (
          <div className={`mt-6 p-4 rounded-2xl text-center font-bold text-sm ${status.includes('✅') ? 'bg-green-500/10 text-green-400' : 'bg-red-500/10 text-red-400'}`}>
            {status}
          </div>
        )}
      </div>
    </div>
  );
}