export const dynamic = "force-dynamic";

import Link from "next/link";

export default function NotFound() {
  return (
    <div className="min-h-[60vh] flex flex-col items-center justify-center text-center px-6">
      <h1 className="text-9xl font-black text-white/10 absolute -z-10 tracking-tighter">
        404
      </h1>
      
      <div className="relative z-10">
        <h2 className="text-4xl md:text-6xl font-black bg-gradient-to-r from-blue-400 to-purple-500 bg-clip-text text-transparent italic tracking-tighter uppercase mb-4">
          Waduh, Kesasar!
        </h2>
        <p className="text-gray-500 font-bold tracking-widest uppercase text-xs mb-8">
          Halaman yang kamu cari nggak ada di gudang Kere Hore.
        </p>
        
        <Link 
          href="/" 
          className="inline-block bg-blue-600 hover:bg-blue-500 text-white font-black px-8 py-4 rounded-2xl transition-all shadow-[0_10px_30px_rgba(37,99,235,0.3)] uppercase tracking-tighter italic"
        >
          Balik ke Beranda 🚀
        </Link>
      </div>
    </div>
  );
}