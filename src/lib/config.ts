// src/lib/config.ts

export const APP_CONFIG = {
  // Gunakan NEXT_PUBLIC agar bisa dibaca di Client Component (browser)
  API_URL: process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001",
  
  // Pengaturan UI
  APP_NAME: "Katalog Produk Premium",
  ITEMS_PER_PAGE: 8,
  
  // Pengaturan Kontak (Opsional)
  SUPPORT_EMAIL: "admin@tokoanda.com"
};