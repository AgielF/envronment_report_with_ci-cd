# Tahap 1: Gunakan versi 'slim' (Debian-based) untuk menghindari bentrok esbuild Vite
FROM node:20-slim AS builder
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .

# --- PERBAIKAN: INTEGRASI VARIABEL BUILD DARI GITHUB ACTIONS ---
# Menangkap argumen yang disuntikkan oleh deploy.yml saat build
ARG VITE_API_URL
ARG VITE_CDN_URL
# Mengubahnya menjadi Environment Variable agar bisa dibaca oleh Vite
ENV VITE_API_URL=$VITE_API_URL
ENV VITE_CDN_URL=$VITE_CDN_URL
# ---------------------------------------------------------------

RUN npm run build 

# Tahap 2: Tahap Nginx tetap menggunakan Alpine karena sangat aman dan kecil
FROM nginx:alpine
RUN rm -rf /usr/share/nginx/html/*
COPY --from=builder /app/dist /usr/share/nginx/html

# --- INTEGRASI KONFIGURASI NGINX ---
# Salin file nginx.conf dari lokal ke dalam sistem Nginx di container
COPY nginx.conf /etc/nginx/conf.d/default.conf
# -----------------------------------

EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]