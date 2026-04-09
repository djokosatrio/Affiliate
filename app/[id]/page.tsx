import { notFound } from "next/navigation";
import HomePage from "../page";
import { prisma } from "@/src/lib/prisma";

// Fungsi ini menangkap angka di URL (misal kerehore.online/12)
export default async function ProductRedirectPage({ 
  params 
}: { 
  params: Promise<{ id: string }> 
}) {
  const resolvedParams = await params;
  const id = resolvedParams.id;

  // 1. Validasi: Apakah ID di URL itu angka?
  const numericId = Number(id);
  if (isNaN(numericId)) {
    // Kalau user ngetik /abc atau link aneh lainnya, langsung lempar ke 404
    return notFound();
  }

  // 2. Validasi: Apakah ID tersebut beneran ada di Database?
  const productExists = await prisma.product.findUnique({
    where: { id: numericId },
    select: { id: true } // Cek ID-nya saja biar kencang
  });

  // Jika produk tidak ditemukan di database
  if (!productExists) {
    return notFound();
  }

  // 3. Jika OK, panggil HomePage dan buka pop-up otomatis lewat autoId
  return <HomePage searchParams={Promise.resolve({ autoId: id })} />;
}