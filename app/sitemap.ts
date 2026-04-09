import { MetadataRoute } from 'next';
import { prisma } from "@/src/lib/prisma";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = "https://www.kerehore.online";

  try {
    // Ambil data produk menggunakan kolom yang benar-benar ada di schema.prisma
    const products = await prisma.product.findMany({
      select: { 
        id: true, 
        createdAt: true // Menggunakan createdAt karena updatedAt tidak ada di schema
      },
    });

    const productEntries = products.map((p) => ({
      url: `${baseUrl}/?autoId=${p.id}`,
      lastModified: p.createdAt, // Pakai tanggal produk dibuat
      changeFrequency: 'weekly' as const,
      priority: 0.8,
    }));

    return [
      {
        url: baseUrl,
        lastModified: new Date(),
        changeFrequency: 'daily' as const,
        priority: 1.0,
      },
      ...productEntries,
    ];
  } catch (error) {
    console.error("Sitemap Error:", error);
    return [
      {
        url: baseUrl,
        lastModified: new Date(),
      },
    ];
  }
}