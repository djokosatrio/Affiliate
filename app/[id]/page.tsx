import HomePage from "../page";

// Fungsi ini menangkap angka di URL (misal /12)
export default async function ProductRedirectPage({ 
  params 
}: { 
  params: Promise<{ id: string }> 
}) {
  // WAJIB pakai await di Next.js versi terbaru
  const resolvedParams = await params;
  const id = resolvedParams.id;

  // Kita panggil HomePage dan kirim autoId lewat searchParams
  return <HomePage searchParams={Promise.resolve({ autoId: id })} />;
}