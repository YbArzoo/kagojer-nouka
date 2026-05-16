# Kagojer Nouka ⛵✨

![Next.js](https://img.shields.io/badge/Next.js-14-black?style=for-the-badge&logo=next.js)
![Laravel](https://img.shields.io/badge/Laravel-11-FF2D20?style=for-the-badge&logo=laravel)
![Filament](https://img.shields.io/badge/Filament-v3-EAB308?style=for-the-badge&logo=laravel)
![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-38B2AC?style=for-the-badge&logo=tailwind-css)
![PostgreSQL](https://img.shields.io/badge/PostgreSQL-316192?style=for-the-badge&logo=postgresql)

Kagojer Nouka is a high-performance, headless e-commerce platform built for aesthetic stationery. Designed with a decoupled architecture, it features a blazingly fast Next.js storefront powered by a secure, enterprise-grade Laravel REST API and a robust Filament PHP admin dashboard.

---

## 🚀 Key Features

### 🛒 Advanced Transactional Checkout
* **Strict Inventory Validation:** Two-pass database transaction loops (`DB::beginTransaction`) ensure stock levels for both base products and complex variants (e.g., color/size) are perfectly validated before order creation, preventing overselling.
* **Variant-Aware Cart:** Dynamically calculates prices based on base product costs plus specific variant price adjustments.

### 🎟️ Reactive Marketing Engine
* **Real-Time Coupon Math:** Instant frontend calculation of fixed and percentage-based discounts.
* **Complex Rulesets:** Enforces `minimum_spend` limits and dynamic `is_free_shipping` overrides seamlessly.
* **State Syncing:** Persists active coupon rules across the Cart and Checkout pages using `localStorage` to ensure consistent financial totals.

### 📊 Enterprise Admin Dashboard (Filament v3)
* **Dynamic Order Routing:** Custom tabs to filter and track Active (Pending/Processing/Shipped), Delivered, and Cancelled orders in real-time.
* **Financial Analytics:** Read-only breakdowns of applied coupons, exact shipping fees, and final grand totals injected directly into the order view.
* **Catalog Management:** Full control over product variants, categories, promotional banners, and homepage feature tiles.

### ⚡ Optimized Data Aggregation
* **Single-Payload Homepage:** A centralized aggregator API serves all banners, promotional tiles, bestsellers, and categorized products in one optimized JSON response, minimizing client-side load times.
* **Smart Search:** Real-time dropdown search querying both product names and descriptions efficiently.

---

## 💻 Tech Stack

**Frontend (Storefront)**
* Framework: Next.js (React)
* Language: TypeScript
* Styling: Tailwind CSS
* State Management: React Hooks / Context (Zustand/Custom)

**Backend (Admin Panel & API)**
* Framework: Laravel (PHP)
* Database: PostgreSQL
* CMS/Admin: Filament PHP v3
* Architecture: Headless REST API

---

## 🛠️ Local Development Setup

This project is structured as a monorepo containing two separate applications: `admin-panel` (Backend) and `storefront` (Frontend).

### Prerequisites
* Node.js (v18+)
* PHP (v8.2+)
* Composer
* PostgreSQL

### 1. Backend Setup (Laravel)
cd admin-panel

# Install PHP dependencies
composer install

# Set up environment variables
cp .env.example .env

# Generate application key
php artisan key:generate

# Run database migrations and seeders
php artisan migrate --seed

# Link storage for images
php artisan storage:link

# Start the Laravel development server
php artisan serve


The API will run at http://127.0.0.1:8000/api
The Admin Panel is accessible at http://127.0.0.1:8000/admin


### 2. Frontend Setup (Next.js)

cd storefront

# Install Node dependencies
npm install

# Set up environment variables
cp .env.example .env.local
# Make sure NEXT_PUBLIC_API_URL=[http://127.0.0.1:8000/api](http://127.0.0.1:8000/api) in your .env.local

# Start the Next.js development server
npm run dev


The Storefront will run at http://localhost:3000


🤝 Author
[Y B Arzoo] Lead Full-Stack Developer [LinkedIn Profile Link: https://www.linkedin.com/in/y-b-arzoo/] • [Portfolio Link: https://yb-arzoo.vercel.app/]


