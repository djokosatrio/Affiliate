"use server";

import { prisma } from "@/src/lib/prisma";
import { revalidatePath } from "next/cache";

// 1. SIMPAN PRODUK BARU (Create)
export async function saveProduct(data: any) {
  try {
    await prisma.product.create({
      data: {
        title: data.title,
        description: data.description,
        price: data.price,
        category: data.category,
        images: data.images, // Array URL dari Supabase
        affiliateUrl: data.url,
      },
    });

    revalidatePath("/"); 
    revalidatePath("/admin/list");
    return { success: true };
  } catch (error) {
    console.error("Save Error:", error);
    return { success: false };
  }
}

// 2. AMBIL SEMUA PRODUK (Untuk Halaman List)
export async function getAllProducts() {
  try {
    return await prisma.product.findMany({
      orderBy: { createdAt: 'desc' }
    });
  } catch (error) {
    console.error("GetAll Error:", error);
    return [];
  }
}

// 3. AMBIL DATA PRODUK BERDASARKAN ID (Untuk Form Edit)
export async function getProductById(id: string) {
  try {
    return await prisma.product.findUnique({
      where: { id: Number(id) }, // Konversi ke Number karena ID pake Int
    });
  } catch (error) {
    console.error("GetById Error:", error);
    return null;
  }
}

// 4. UPDATE DATA PRODUK (Edit)
export async function updateProduct(id: string, data: any) {
  try {
    await prisma.product.update({
      where: { id: Number(id) }, // Konversi ke Number karena ID pake Int
      data: {
        title: data.title,
        description: data.description,
        price: data.price,
        category: data.category,
        images: data.images,
        affiliateUrl: data.url,
      },
    });

    revalidatePath("/"); 
    revalidatePath(`/product/${id}`);
    revalidatePath("/admin/list");
    return { success: true };
  } catch (error) {
    console.error("Update Error:", error);
    return { success: false };
  }
}

// 5. HAPUS PRODUK (Delete)
export async function deleteProduct(id: string) {
  try {
    await prisma.product.delete({
      where: { id: Number(id) } // Konversi ke Number karena ID pake Int
    });
    revalidatePath("/");
    revalidatePath("/admin/list");
    return { success: true };
  } catch (error) {
    console.error("Delete Error:", error);
    return { success: false };
  }
}