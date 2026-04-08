"use client";

import { useState, useRef } from "react";
import { supabase } from "@/src/lib/supabase";
import { saveProduct } from "../actions";

export default function AdminFormClient() {
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState("");
  const [combinedImages, setCombinedImages] = useState<string[]>([]);
  const [linkInput, setLinkInput] = useState("");
  const formRef = useRef<HTMLFormElement>(null);

  const addLink = () => {
    if (linkInput.trim() !== "") {
      setCombinedImages((prev) => [...prev, linkInput.trim()]);
      setLinkInput("");
    }
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    setLoading(true);
    setStatus("Uploading... ☁️");

    try {
      for (const file of Array.from(files)) {
        const fileName = `${Date.now()}-${file.name.replace(/\s+/g, "-")}`;
        const { error: uploadError } = await supabase.storage
          .from("product-images")
          .upload(fileName, file);

        if (uploadError) throw uploadError;

        const { data: urlData } = supabase.storage
          .from("product-images")
          .getPublicUrl(fileName);

        setCombinedImages((prev) => [...prev, urlData.publicUrl]);
      }
      setStatus("✅ Upload berhasil!");
    } catch (err: any) {
      setStatus(`❌ Gagal: ${err.message}`);
    } finally {
      setLoading(false);
    }
  };

  const removeImage = (index: number) => {
    setCombinedImages(combinedImages.filter((_, i) => i !== index));
  };

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (combinedImages.length === 0) {
      setStatus("❌ Masukkan minimal 1 gambar!");
      return;
    }

    setLoading(true);
    setStatus("Menyimpan... ⚡");

    const formData = new FormData(e.currentTarget);

    try {
      const res = await saveProduct({
        title: formData.get("title") as string,
        description: formData.get("desc") as string,
        price: parseFloat(formData.get("price") as string),
        category: formData.get("category") as string,
        url: formData.get("url") as string,
        images: combinedImages,
      });

      if (res.success) {
        setStatus("✅ Produk Berhasil Dipublish!");
        formRef.current?.reset();
        setCombinedImages([]);
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
    <div className="max-w-4xl mx-auto pb-20 px-4">
      {status && (
        <div className={`mb-8 p-4 rounded-2xl text-center font-bold uppercase border text-[10px] tracking-widest transition-all ${
          status.includes('✅') ? 'bg-green-500/10 border-green-500/20 text-green-400' : 'bg-red-500/10 border-red-500/20 text-red-400'
        }`}>
          {status}
        </div>
      )}

      <form ref={formRef} onSubmit={handleSubmit} className="space-y-6">
        
        {/* MEDIA SECTION */}
        <div className="p-6 bg-[#121418] rounded-[2rem] border border-white/5 space-y-6">
          <h3 className="text-blue-500 font-black text-[10px] uppercase tracking-widest italic">Gallery Assets</h3>
          
          {/* INPUT LINK GAMBAR */}
          <div className="space-y-3">
            <div className="flex flex-col sm:flex-row gap-2">
              <input 
                value={linkInput}
                onChange={(e) => setLinkInput(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), addLink())}
                className="flex-1 p-3.5 bg-black/40 border border-white/10 rounded-xl text-sm outline-none focus:border-blue-600 transition-all text-gray-200"
                placeholder="Paste Image URL (Shopee/External)"
              />
              <button type="button" onClick={addLink} className="bg-blue-600 hover:bg-blue-500 px-6 py-3.5 rounded-xl text-[11px] font-black uppercase italic transition-all active:scale-95">
                Add Link
              </button>
            </div>
          </div>

          {/* UPLOAD FILE (DIBUAT KECIL) */}
          <div className="flex items-center gap-4 py-2">
            <div className="flex-grow border-t border-white/5"></div>
            <label className="flex-shrink-0 cursor-pointer group">
              <span className="bg-white/5 hover:bg-white/10 border border-white/10 px-4 py-2 rounded-full text-[9px] font-bold text-gray-400 uppercase tracking-widest transition-all inline-block">
                Or Upload File ☁️
              </span>
              <input type="file" multiple className="hidden" onChange={handleFileUpload} accept="image/*" />
            </label>
            <div className="flex-grow border-t border-white/5"></div>
          </div>

          {/* GRID PREVIEW */}
          {combinedImages.length > 0 && (
            <div className="grid grid-cols-3 md:grid-cols-5 gap-3 pt-2">
              {combinedImages.map((img, idx) => (
                <div key={idx} className="relative group aspect-square bg-black rounded-2xl overflow-hidden border border-white/5 shadow-xl">
                  <img 
                    src={img.includes('supabase') ? img : `https://images.weserv.nl/?url=${encodeURIComponent(img)}&w=300&h=300&fit=cover`} 
                    alt="preview" 
                    referrerPolicy="no-referrer"
                    className="object-cover w-full h-full opacity-80 group-hover:opacity-100 transition-opacity" 
                  />
                  <button 
                    type="button"
                    onClick={() => removeImage(idx)}
                    className="absolute top-1.5 right-1.5 bg-red-600 w-6 h-6 rounded-full text-[10px] flex items-center justify-center shadow-lg hover:scale-110 transition-transform"
                  >✕</button>
                  <div className="absolute bottom-1.5 left-1.5 px-1.5 py-0.5 bg-black/80 rounded text-[6px] font-black text-white uppercase tracking-tighter">
                    {img.includes('supabase') ? 'Store' : 'Link'}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* DATA FORM */}
        <div className="grid md:grid-cols-2 gap-4">
          <input name="url" className="w-full p-4 bg-[#121418] border border-white/5 rounded-2xl text-sm outline-none focus:border-blue-600" placeholder="Affiliate URL" required />
          <input name="category" className="w-full p-4 bg-[#121418] border border-white/5 rounded-2xl text-sm outline-none focus:border-blue-600" placeholder="Category" required />
        </div>
        <input name="title" className="w-full p-4 bg-[#121418] border border-white/5 rounded-2xl text-sm outline-none focus:border-blue-600" placeholder="Product Title" required />
        <textarea name="desc" className="w-full p-4 bg-[#121418] border border-white/5 rounded-2xl h-32 text-sm outline-none focus:border-blue-600 resize-none" placeholder="Short Review" required />
        <input name="price" type="number" className="w-full p-4 bg-[#121418] border border-white/5 rounded-2xl text-sm outline-none focus:border-blue-600" placeholder="Price (Numeric)" required />

        <button 
          type="submit" 
          disabled={loading} 
          className="w-full bg-blue-600 p-5 rounded-[1.5rem] font-black text-xl italic uppercase tracking-tighter transition-all hover:bg-blue-500 shadow-[0_10px_40px_rgba(37,99,235,0.2)] disabled:opacity-50 active:scale-[0.98]"
        >
          {loading ? "SAVING..." : "PUBLISH NOW 🚀"}
        </button>
      </form>
    </div>
  );
}