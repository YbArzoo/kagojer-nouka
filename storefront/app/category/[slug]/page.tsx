'use client';

import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';

export default function CategoryPage() {
  const { slug } = useParams();
  const [data, setData] = useState<any>(null);

  useEffect(() => {
    fetch(`${process.env.NEXT_PUBLIC_API_URL}/categories/${slug}`)
      .then(res => res.json())
      .then(json => {
        setData({ 
          categoryName: json.category_name, 
          products: json.products 
        });
      })
      .catch(err => console.error("Error fetching category:", err));
  }, [slug]);

  if (!data) return <div className="min-h-[50vh] flex items-center justify-center text-brand-blue font-bold tracking-widest uppercase animate-pulse">Loading {slug} treasures... ✨</div>;

  return (
    // Reduced mobile padding from py-20 to py-10
    <main className="min-h-screen bg-slate-50 px-4 md:px-6 py-10 md:py-20">
      <div className="max-w-7xl mx-auto">
        
        {/* Adjusted header text size for mobile */}
        <header className="mb-8 md:mb-16">
          <h1 className="text-3xl md:text-5xl font-black text-slate-900 capitalize mb-2">{data.categoryName} Collection</h1>
          <p className="text-slate-500 uppercase tracking-widest text-[10px] md:text-xs font-bold">Kagojer Nouka Store</p>
        </header>

        {data.products.length > 0 ? (
          // Critical fix: grid-cols-2 for mobile, scaling up to 4 for desktop
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-8">
            {data.products.map((product: any) => (
              <Link href={`/product/${product.slug}`} key={product.id} className="product-card group block bg-white rounded-2xl md:rounded-[2rem] overflow-hidden shadow-sm hover:shadow-xl transition-all border border-transparent hover:border-brand-blue/20">
                
                {/* Image Container: Uses aspect ratio so it perfectly squares off on mobile */}
                <div className="relative aspect-[4/5] bg-slate-50 rounded-2xl overflow-hidden mb-4 border border-slate-100 group-hover:shadow-lg transition-all">
                  <Image 
                    src={(() => {
                      const raw = JSON.stringify(product.images || []);
                      const match = raw.match(/product-gallery[a-zA-Z0-9_.\-\/\\]+/);
                      
                      if (match) {
                          let clean = match[0].replace(/\\\\/g, '/').replace(/\/\//g, '/');
                          clean = clean.replace(/\/+$/, '');
                          // CHANGE IS HERE: Use /media/ instead of /storage/
                          return `http://127.0.0.1:8000/media/${clean}`;
                      }
                      
                      return "https://placehold.co/400x500/f8fafc/5fa5fa?text=Item";
                    })()}
                    fill 
                    className="object-cover group-hover:scale-105 transition-transform duration-500" 
                    alt={product.name}
                    unoptimized
                  />
                  {product.is_new_arrival && (
                    <span className="absolute top-3 left-3 bg-[#5fa5fa] text-white text-[10px] font-black uppercase tracking-widest px-2 py-1 rounded-md">New</span>
                  )}
                </div>
                
                {/* Reduced padding and text sizes for mobile cards */}
                <div className="p-4 md:p-6">
                  <h3 className="font-bold text-slate-800 text-sm md:text-lg mb-3 md:mb-4 truncate group-hover:text-brand-blue transition-colors">{product.name}</h3>
                  <div className="flex justify-between items-center">
                    <span className="text-lg md:text-2xl font-black text-slate-900">৳{product.price}</span>
                    <div className="bg-slate-900 text-white w-8 h-8 md:w-10 md:h-10 rounded-xl flex items-center justify-center group-hover:bg-brand-mint group-hover:text-slate-900 transition-colors shadow-md">
                      <span className="text-lg md:text-xl font-bold">+</span>
                    </div>
                  </div>
                </div>
                
              </Link>
            ))}
          </div>
        ) : (
          <div className="text-center py-16 md:py-24 bg-white rounded-[2rem] border-2 border-dashed border-slate-200">
            <p className="text-slate-400 font-medium italic px-6">We are currently restocking this category with kawaii items! Check back soon. 🌸</p>
          </div>
        )}
      </div>
    </main>
  );
}