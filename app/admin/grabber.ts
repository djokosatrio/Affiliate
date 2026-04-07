"use server";

import * as cheerio from "cheerio";

export async function grabShopeeData(url: string) {
  try {
    // 1. Ambil HTML dari link Shopee
    // Kita pakai User-Agent biar dikira manusia, bukan robot
    const response = await fetch(url, {
      headers: {
        "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
      },
    });

    if (!response.ok) throw new Error("Gagal akses link Shopee");

    const html = await response.text();
    const $ = cheerio.load(html);

    // 2. Ambil data dari Meta Tags (Open Graph)
    const title = $('meta[property="og:title"]').attr("content") || "";
    const image = $('meta[property="og:image"]').attr("content") || "";
    const description = $('meta[property="og:description"]').attr("content") || "";
    
    // Shopee biasanya naro harga di meta atau title, tapi agak tricky.
    // Kita ambil judul dan gambar aja dulu yang paling akurat.

    return {
      success: true,
      data: {
        title: title.split("|")[0].trim(), // Bersihin judul dari embel-embel "Shopee Indonesia"
        image,
        description
      }
    };
  } catch (error) {
    console.error("Grab Error:", error);
    return { success: false, message: "Gagal mengambil data. Shopee memblokir akses otomatis." };
  }
}