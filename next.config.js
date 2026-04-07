/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'via.placeholder.com',
      },
      {
        protocol: 'https',
        hostname: '**.supabase.co', // Untuk gambar dari Supabase Storage
      },
      {
        protocol: 'https',
        hostname: '**.shopee.co.id', // Jaga-jaga kalau pakai link Shopee
      },
      {
        protocol: 'https',
        hostname: '**.tokopedia.net', // Jaga-jaga kalau pakai link Tokopedia
      },
    ],
  },
};

export default nextConfig;