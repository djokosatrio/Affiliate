"use client";

import { useState, useEffect, useRef } from "react";
import { useParams, useRouter } from "next/navigation";
import { getProductById, updateProduct } from "../../actions";
import { supabase } from "@/src/lib/supabase";

export default function EditPage() {
  const { id } = useParams();
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [status, setStatus] = useState("");
  const [combinedImages, setCombinedImages] = useState<string[]>([]);
  const [linkInput, setLinkInput] = useState("");
  const formRef = useRef<HTMLFormElement>(null);

  const [formData, setFormData] = useState({
    title: "",
    desc: "",
    price: "",
    category: "",
    url: "",
  });

  // Ambil data produk lama saat pertama kali buka
  useEffect(() => {
    async function loadData() {
      const product = await getProductById(id as string);
      if (product) {
        setFormData({
          title: product.title,
          desc: product.description,
          price: product.price.toString(),
          category: product.category,
          url: product.affiliateUrl,
        });
        setCombinedImages(product.images || []);
      }
      setLoading(false);
    }
    loadData();
  }, [id]);

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;
    setLoading(true);
    setStatus("Uploading... ☁️");
    try {
      for (const file of Array.from(files)) {
        const fileName = `${Date.now()}-${file.name.replace(/\s+/g, "-")}`;
        const { error } = await supabase.storage.from("product-images").upload(fileName, file);
        if (error) throw error;
        const { data } = supabase.storage.from("product-images").getPublicUrl(fileName);
        setCombinedImages((prev) => [...prev, data.publicUrl]);
      }
      setStatus("✅ Upload Berhasil!");
    } catch (err: any) {
      setStatus(`❌ Gagal: ${err.message}`);
    } finally { setLoading(false); }
  };

  const addLink = () => {
    if (linkInput.trim() !== "") {
      setCombinedImages((prev) => [...prev, linkInput.trim()]);
      setLinkInput("");
    }
  };

  const removeImage = (index: number) => {
    setCombinedImages(combinedImages.filter((_, i) => i !== index));
  };

  async function handleUpdate(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);
    setStatus("Saving changes... ⚡");

    try {
      const res = await updateProduct(id as string, {
        title: formData.title,
        description: formData.desc,
        price: parseFloat(formData.price),
        category: formData.category,
        url: formData.url,
        images: combinedImages,
      });

      if (res.success) {
        setStatus("✅ Produk Berhasil Diupdate!");
        setTimeout(() => router.push("/admin/list"), 1500);
      }
    } catch (err: any) {
      setStatus(`❌ Error: ${err.message}`);
    } finally { setLoading(false); }
  }

  if (loading && !formData.title) return <div className="text-white text-center py-20 font-black italic uppercase tracking-widest">Memuat Data...</div>;

  return (
    <div className="max-w-4xl mx-auto pb-20 px-4 pt-10 font-sans">
      {/* STATUS NOTIFICATION - Identik dengan Add */}
      {status && (
        <div className="fixed top-5 left-1/2 -translate-x-1/2 z-50">
          <div className="bg-blue-600 text-white px-8 py-3 rounded-full shadow-[0_0_30px_rgba(37,99,235,0.5)] font-black text-[10px] uppercase tracking-widest italic border border-white/20">
            {status}
          </div>
        </div>
      )}

      <div className="flex items-center justify-between mb-10 px-4">
        <div>
          <h1 className="text-4xl font-black italic text-white uppercase tracking-tighter leading-none">Edit <span className="text-blue-600">Product</span></h1>
          <p className="text-[10px] font-bold text-gray-500 uppercase tracking-widest mt-2 italic tracking-[0.2em]">Update your review and link</p>
        </div>
        <button onClick={() => router.back()} className="text-[10px] font-black uppercase text-gray-600 hover:text-white transition-all tracking-[0.2em] border-b border-gray-800 hover:border-white">KEMBALI</button>
      </div>

      <form ref={formRef} onSubmit={handleUpdate} className="space-y-6">
        
        {/* MEDIA SECTION (GALLERY) - Identik dengan Add */}
        <div className="p-8 bg-[#121418] rounded-[2.5rem] border border-white/5 space-y-6 shadow-2xl">
          <div className="flex justify-between items-center px-2">
            <h3 className="text-gray-500 font-black text-[10px] uppercase tracking-[0.2em] italic">Product Gallery</h3>
            <span className="text-[9px] text-blue-500 font-black uppercase italic tracking-widest">{combinedImages.length} ASSETS</span>
          </div>
          
          <div className="flex flex-col sm:flex-row gap-3">
            <input 
              value={linkInput}
              onChange={(e) => setLinkInput(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), addLink())}
              className="flex-1 p-5 bg-black/40 border border-white/10 rounded-2xl text-sm outline-none focus:border-blue-600 text-gray-300 transition-all shadow-inner"
              placeholder="Paste New Image URL..."
            />
            <button type="button" onClick={addLink} className="bg-blue-600 hover:bg-blue-500 px-8 py-5 rounded-2xl text-[10px] font-black uppercase italic transition-all text-white shadow-lg shadow-blue-900/20">
              ADD LINK
            </button>
          </div>

          <div className="flex items-center gap-4 py-2">
            <div className="flex-grow border-t border-white/5"></div>
            <label className="flex-shrink-0 cursor-pointer group">
              <span className="bg-white/5 hover:bg-white/10 border border-white/10 px-6 py-3 rounded-full text-[9px] font-bold text-gray-400 uppercase tracking-widest transition-all inline-block">
                UPLOAD FROM DEVICE ☁️
              </span>
              <input type="file" multiple className="hidden" onChange={handleFileUpload} accept="image/*" />
            </label>
            <div className="flex-grow border-t border-white/5"></div>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
            {combinedImages.map((img, idx) => (
              <div key={idx} className="relative aspect-square bg-black rounded-[1.8rem] overflow-hidden border border-white/5 group shadow-2xl">
                <img 
                  src={img.includes('supabase') ? img : `https://images.weserv.nl/?url=${encodeURIComponent(img)}&w=300&h=300&fit=cover`} 
                  alt="preview" referrerPolicy="no-referrer" className="object-cover w-full h-full group-hover:scale-110 transition-transform duration-700 opacity-80 group-hover:opacity-100" 
                />
                <button 
                  type="button" onClick={() => removeImage(idx)} 
                  className="absolute top-2 right-2 bg-red-600 w-7 h-7 rounded-full text-[10px] flex items-center justify-center shadow-lg text-white hover:bg-red-500 transition-colors z-10"
                >✕</button>
                <div className="absolute bottom-2 left-2 px-2 py-1 bg-black/80 backdrop-blur-md rounded-lg text-[7px] font-black text-white uppercase tracking-tighter">
                  {img.includes('supabase') ? 'Storage' : 'External'}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* INPUT DATA DETAILS - Identik dengan Add */}
        <div className="grid md:grid-cols-2 gap-6">
          <div className="space-y-2">
            <label className="text-[10px] font-black text-gray-500 uppercase ml-5 tracking-[0.2em]">Affiliate URL</label>
            <input value={formData.url} onChange={e => setFormData({...formData, url: e.target.value})} className="w-full p-6 bg-[#121418] border border-white/5 rounded-[2rem] text-sm text-blue-400 outline-none focus:border-blue-600 transition-all shadow-inner" required />
          </div>
          <div className="space-y-2">
            <label className="text-[10px] font-black text-gray-500 uppercase ml-5 tracking-[0.2em]">Category</label>
            <input value={formData.category} onChange={e => setFormData({...formData, category: e.target.value})} className="w-full p-6 bg-[#121418] border border-white/5 rounded-[2rem] text-sm text-white outline-none focus:border-blue-600 transition-all shadow-inner" required />
          </div>
        </div>

        <div className="space-y-2">
          <label className="text-[10px] font-black text-gray-500 uppercase ml-5 tracking-[0.2em]">Product Title</label>
          <input value={formData.title} onChange={e => setFormData({...formData, title: e.target.value})} className="w-full p-6 bg-[#121418] border border-white/5 rounded-[2rem] text-sm text-white outline-none focus:border-blue-600 transition-all shadow-inner uppercase italic font-bold" required />
        </div>

        <div className="space-y-2">
          <label className="text-[10px] font-black text-gray-500 uppercase ml-5 tracking-[0.2em]">Short Review</label>
          <textarea value={formData.desc} onChange={e => setFormData({...formData, desc: e.target.value})} className="w-full p-6 bg-[#121418] border border-white/5 rounded-[2rem] h-44 text-sm text-white outline-none focus:border-blue-600 transition-all resize-none shadow-inner" required />
        </div>

        <div className="space-y-2">
          <label className="text-[10px] font-black text-gray-500 uppercase ml-5 tracking-[0.2em]">Price (Numeric Only)</label>
          <input type="number" value={formData.price} onChange={e => setFormData({...formData, price: e.target.value})} className="w-full p-6 bg-[#121418] border border-white/5 rounded-[2rem] text-sm text-white outline-none focus:border-blue-600 transition-all shadow-inner" required />
        </div>

        {/* SAVE BUTTON - Identik dengan Add */}
        <div className="pt-6">
          <button 
            type="submit" 
            disabled={loading} 
            className="w-full bg-blue-600 p-8 rounded-[2.5rem] font-black text-2xl italic uppercase tracking-tighter transition-all hover:bg-blue-500 shadow-[0_20px_60px_rgba(37,99,235,0.3)] disabled:opacity-50 text-white active:scale-95 border border-white/10"
          >
            {loading ? "SAVING..." : "UPDATE PRODUCT 🚀"}
          </button>
        </div>
      </form>
    </div>
  );
}