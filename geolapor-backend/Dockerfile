# 1. Gunakan base image Node.js versi ringan (Alpine) untuk menghemat ukuran file
FROM node:20-alpine

# 2. Set direktori kerja di dalam container
WORKDIR /app

# 3. Salin daftar dependensi terlebih dahulu (package.json dan package-lock.json)
COPY package*.json ./

# 4. Install dependensi (hanya dependensi produksi agar container lebih ringan)
RUN npm install --production

# 5. Salin seluruh source code backend ke dalam direktori kerja container
COPY . .

# 6. Informasikan bahwa container ini akan mendengarkan di port 3000
EXPOSE 3000

# 7. Perintah utama untuk menjalankan aplikasi saat container dihidupkan
CMD ["node", "server.js"]