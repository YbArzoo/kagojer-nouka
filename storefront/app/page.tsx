/* eslint-disable @next/next/no-img-element */
import Image from "next/image";
import Link from "next/link";

// --- API FETCH ---
async function getHomepageData() {
  const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/homepage`, {
    next: { revalidate: 60 },
  });
  if (!res.ok) return null; 
  return res.json();
}

// --- REUSABLE COMPONENTS ---
const ProductCard = ({ product }: { product: any }) => (
  <Link href={`/product/${product.slug}`} className="group block flex flex-col h-full">
    <div className="relative aspect-[4/5] w-full overflow-hidden bg-white mb-4 border border-slate-100 rounded-lg">
      
      {/* INDESTRUCTIBLE HTML IMG TAG */}
      <img 
        src={(() => {
          // God Mode: Stringify the ENTIRE product object to hunt down the image file!
          const raw = JSON.stringify(product);
          const match = raw.match(/[a-zA-Z0-9_.\-\/\\]+\.(png|jpg|jpeg|webp|gif)/i);
          
          if (match) {
              const exactFilename = match[0].replace(/\\/g, '/').split('/').pop();
              return `http://127.0.0.1:8000/product-gallery/${exactFilename}`;
          }
          
          // NEW FIX: Use the reliable placeholder server!
          return "https://placehold.co/400x500/f8fafc/5fa5fa?text=No+Image";
        })()}
        className="object-cover w-full h-full p-2 group-hover:scale-105 transition-transform duration-700" 
        alt={product.name}
      />

    </div>
    <div className="flex flex-col flex-grow">
      <h3 className="text-sm font-bold text-slate-800 line-clamp-2 mb-1 group-hover:text-[#5fa5fa] transition-colors">{product.name}</h3>
      {product.total_sold > 0 && (
         <p className="text-xs text-slate-400 mb-2 font-medium">{product.total_sold} quantities sold</p> 
      )}
      <p className="text-[#5fa5fa] font-black mt-auto text-lg">৳{product.price || product.base_price}</p>
    </div>
  </Link>
);

const SectionHeading = ({ title, subtitle }: { title: string, subtitle?: string }) => (
  <div className="text-center mb-10">
    {/* Removed font-serif, added font-black to match logo */}
    <h2 className="text-2xl md:text-4xl font-black text-slate-900 mb-2 tracking-tight">{title}</h2>
    {subtitle && <p className="text-slate-500 text-sm tracking-wide font-medium">{subtitle}</p>}
    {/* Changed line color to brand hex */}
    <div className="w-16 h-[4px] rounded-full bg-[#5fa5fa] mx-auto mt-4"></div>
  </div>
);

// --- MAIN PAGE ---
export default async function Home() {
  const data = await getHomepageData();
  
  if (!data) return <div className="text-center py-20 font-bold text-slate-500">Unable to load homepage. Please check API connection.</div>

  const banners = data?.banners || [];
  const promo_tiles = data?.promo_tiles || [];
  const new_arrivals = data?.new_arrivals || [];
  const best_sellers = data?.best_sellers || [];
  const featured_products = data?.featured_products || [];
  const featured_category_block = data?.featured_category_block || null;
  const categories = data?.categories || [];
  
  // Safe fallback for settings 
  const settings = data?.settings || {
    announcement: { active: false, text: '', bg_color: '#5fa5fa' },
    reviews_active: false
  };
  
  const hero = banners[0] || null;

  return (
    <main className="min-h-screen bg-[#fafafa]">
      
      {/* 1. EDITABLE ANNOUNCEMENT BAR */}
      {settings?.announcement?.active && (
        <div style={{ backgroundColor: settings.announcement.bg_color }} className="text-white text-xs font-bold tracking-widest uppercase text-center py-3 px-4 shadow-sm">
          {settings.announcement.text}
        </div>
      )}

      {/* 2. DYNAMIC HERO BANNER */}
      {hero && (
        <section className="relative h-[50vh] md:h-[70vh] w-full flex items-center justify-center overflow-hidden">
          <Image src={hero.image} alt={hero.title} fill className="object-cover" priority />
          <div className="absolute inset-0 bg-black/30"></div>
          <div className="relative z-10 text-center px-4 max-w-3xl">
            {/* Removed font-serif, added font-black */}
            <h1 className="text-4xl md:text-7xl font-black text-white mb-4 drop-shadow-lg tracking-tight">
              {hero.title}
            </h1>
            <p className="text-md md:text-xl text-white/90 mb-8 font-bold tracking-widest uppercase drop-shadow-md">
              {hero.subtitle}
            </p>
            {/* Hover text color matches brand hex */}
            <Link href={hero.btn_link || "/shop"} className="border-2 border-white text-white hover:bg-white hover:text-[#5fa5fa] px-10 py-4 text-sm font-black tracking-widest uppercase transition-colors rounded-full shadow-lg">
              {hero.btn_text || "Shop Collection"}
            </Link>
          </div>
        </section>
      )}

      {/* 3. DYNAMIC CATEGORY GRID FROM DB */}
      {categories.length > 0 && (
        <section className="max-w-7xl mx-auto px-4 py-20">
          <SectionHeading title="Shop Our Collections" subtitle="Explore your favorite aesthetic supplies." />
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 auto-rows-[200px] md:auto-rows-[250px]">
             {categories.slice(0, 9).map((cat: any, index: number) => {
               const gridClasses = [
                'col-span-2 row-span-2', 
                '', 
                '', 
                'col-span-2', 
                '', 
                'row-span-2', 
                'col-span-2', 
                '', 
                'col-span-2' 
               ];
               const currentClass = gridClasses[index] || '';

               return (
                  <Link key={cat.name} href={`/category/${cat.slug}`} className={`${currentClass} relative group overflow-hidden bg-white border border-slate-100 rounded-3xl shadow-sm`}>
                    
                    {/* INDESTRUCTIBLE HTML IMG TAG FOR CATEGORIES */}
                    <img 
                      src={(() => {
                        const raw = JSON.stringify(cat);
                        const match = raw.match(/[a-zA-Z0-9_.\-\/\\]+\.(png|jpg|jpeg|webp|gif)/i);
                        
                        if (match) {
                            const exactFilename = match[0].replace(/\\/g, '/').split('/').pop();
                            // FIXED: Points to the 'categories' folder you created in VS Code!
                            return `http://127.0.0.1:8000/categories/${exactFilename}`;
                        }
                        
                        return "https://via.placeholder.com/800x800.png?text=Collection";
                      })()}
                      className="object-cover w-full h-full p-2 rounded-3xl group-hover:scale-105 transition-transform duration-700" 
                      alt={cat.name} 
                    />
                    
                    <div className="absolute inset-0 bg-black/10 group-hover:bg-[#5fa5fa]/30 transition-colors rounded-3xl"></div>
                    <div className="absolute inset-0 flex items-center justify-center p-4">
                        <h3 className="text-white text-center font-black text-2xl md:text-4xl tracking-tight drop-shadow-md">{cat.name}</h3>
                    </div>
                  </Link>
               );
             })}
          </div>
        </section>
      )}

      {/* 4. AUTOMATED NEW ARRIVALS */}
      {new_arrivals.length > 0 && (
        <section className="max-w-7xl mx-auto px-4 py-16">
          <SectionHeading title="Freshly Arrived" subtitle="New curations for your workspace." />
          <div className="grid grid-cols-2 md:grid-cols-4 gap-x-6 gap-y-10">
            {new_arrivals.map((product: any) => (
              <ProductCard key={`new-${product.id}`} product={product} />
            ))}
          </div>
        </section>
      )}

      {/* 5. VALUE PROPOSITION (Brand Hex Background) */}
      <section className="bg-[#5fa5fa] text-white py-24 mt-16 shadow-inner">
        <div className="max-w-6xl mx-auto px-4 text-center">
          {/* Removed font-serif, added font-black */}
          <h2 className="text-3xl md:text-5xl font-black mb-16 tracking-tight drop-shadow-sm">Crafted for Dreamers. Designed for Creators.</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
            <div className="flex flex-col items-center">
              <span className="text-5xl mb-6 drop-shadow-sm">✨</span>
              <h3 className="font-black tracking-widest uppercase mb-3 text-sm">Aesthetic Excellence</h3>
              <p className="text-white/90 text-sm leading-relaxed font-medium">Every piece is meticulously curated to bring beauty and inspiration directly to your workspace.</p>
            </div>
            <div className="flex flex-col items-center">
              <span className="text-5xl mb-6 drop-shadow-sm">🖋️</span>
              <h3 className="font-black tracking-widest uppercase mb-3 text-sm">Uncompromising Quality</h3>
              <p className="text-white/90 text-sm leading-relaxed font-medium">From bleed-resistant paper to smooth ink, we ensure your tools never hold creativity back.</p>
            </div>
            <div className="flex flex-col items-center">
              <span className="text-5xl mb-6 drop-shadow-sm">💝</span>
              <h3 className="font-black tracking-widest uppercase mb-3 text-sm">Thoughtful Details</h3>
              <p className="text-white/90 text-sm leading-relaxed font-medium">The tactile joy of premium materials curated right to the palm of your hand.</p>
            </div>
          </div>
        </div>
      </section>

      {/* 6. AUTOMATED BEST SELLERS */}
      {best_sellers.length > 0 && (
        <section className="max-w-7xl mx-auto px-4 py-24">
          <SectionHeading title="Trending Now" subtitle="Handpicked treasures loved by our dreamers." />
          <div className="grid grid-cols-2 md:grid-cols-4 gap-x-6 gap-y-10">
            {best_sellers.map((product: any) => (
              <ProductCard key={`best-${product.id}`} product={product} />
            ))}
          </div>
        </section>
      )}

      {/* 7. DYNAMIC FEATURED PRODUCTS */}
      {featured_products.length > 0 && (
        <section className="max-w-7xl mx-auto px-8 py-16 bg-white border border-slate-100 rounded-[3rem] mb-16 shadow-sm">
            <div className="flex justify-between items-end mb-12">
              <div>
                <h2 className="text-3xl md:text-4xl font-black text-slate-900 mb-2 tracking-tight">Editor's Choice</h2>
                <p className="text-slate-500 font-medium text-sm">Curated stationery for your collection.</p>
              </div>
              {/* Button uses brand hex */}
              <Link href="/category/all" className="w-14 h-14 rounded-full bg-[#5fa5fa] flex items-center justify-center hover:bg-slate-900 transition-colors shadow-lg group">
                <span className="text-white text-2xl font-bold group-hover:translate-x-1 transition-transform">→</span>
              </Link>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-x-6 gap-y-12">
              {featured_products.slice(0, 4).map((product: any) => (
                <ProductCard key={`feat-${product.id}`} product={product} />
              ))}
            </div>
        </section>
      )}

      {/* 8. FEATURED CATEGORY BLOCK */}
      {featured_category_block && featured_category_block.products.length > 0 && (
        <section className="max-w-7xl mx-auto px-8 py-20 bg-slate-50 border border-slate-100 rounded-[3rem] mb-16">
          <SectionHeading title={featured_category_block.name} subtitle="Featured collection from our curators." />
          <div className="grid grid-cols-2 md:grid-cols-4 gap-x-6 gap-y-10">
            {featured_category_block.products.map((product: any) => (
              <ProductCard key={`cat-${product.id}`} product={product} />
            ))}
          </div>
          <div className="text-center mt-12">
            <Link href={`/category/${featured_category_block.slug}`} className="inline-block border-2 border-[#5fa5fa] text-[#5fa5fa] hover:bg-[#5fa5fa] hover:text-white px-10 py-4 text-sm font-black tracking-widest uppercase rounded-full transition-colors">
              Explore {featured_category_block.name}
            </Link>
          </div>
        </section>
      )}

      {/* 9. OPTIONAL REVIEWS SECTION */}
      {settings?.reviews_active && (
        <section className="bg-white py-24 border-t border-slate-100">
          <div className="max-w-7xl mx-auto px-4">
            <SectionHeading title="Words from our Dreamers" />
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {[
                { text: "The quality of these journals is unmatched. The paper feels incredible and my pens never bleed through.", author: "Nafisa A." },
                { text: "Finally, an aesthetic stationery shop in BD that actually delivers premium items. My desk looks like a Pinterest board.", author: "Raihan M." },
                { text: "The tactile joy of premium materials curated right to the palm of your hand. Highly recommend!", author: "Samira K." }
              ].map((review, i) => (
                <div key={i} className="bg-[#fafafa] border border-slate-100 p-8 shadow-sm rounded-2xl">
                  {/* Stars in brand hex */}
                  <div className="text-[#5fa5fa] text-lg mb-4">★★★★★</div>
                  <p className="text-slate-600 font-medium italic mb-6 text-sm leading-relaxed">"{review.text}"</p>
                  <p className="text-slate-900 font-black text-xs tracking-widest uppercase">— {review.author}</p>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

    </main>
  );
}