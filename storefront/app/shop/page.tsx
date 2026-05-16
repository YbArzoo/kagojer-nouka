import Image from 'next/image';
import Link from 'next/link';

// Fetch the paginated products from Laravel
async function getShopData(page = 1) {
  const res = await fetch(`http://127.0.0.1:8000/api/products?page=${page}`, { 
    cache: 'no-store' // Keep this for dev so we see updates instantly!
  });
  if (!res.ok) return null;
  return res.json();
}

// ... keep your getShopData function at the top ...

export default async function ShopPage({ 
  searchParams 
}: { 
  searchParams: Promise<{ page?: string }> // 1. Tell TypeScript it's a Promise now
}) {
  // 2. "Unwrap" the Promise using await
  const resolvedParams = await searchParams;
  
  // 3. Now we can safely grab the page number!
  const currentPage = Number(resolvedParams.page) || 1;
  const data = await getShopData(currentPage);

  if (!data) return <div className="text-center py-20 font-bold text-slate-500">Loading products...</div>;

  const { products, categories } = data;

  return (
    <div className="max-w-7xl mx-auto px-4 py-12">
      {/* Page Header */}
      <div className="mb-10 pb-6 border-b border-slate-100 flex justify-between items-end">
        <div>
          <h1 className="text-3xl font-black text-slate-900 uppercase tracking-tight">All Products</h1>
          <p className="text-slate-500 mt-2 text-sm">Showing {products.from} - {products.to} of {products.total} items</p>
        </div>
        
        {/* Sort Dropdown */}
        <div className="flex items-center gap-2">
          <span className="text-sm font-bold text-slate-500 uppercase">Sort by:</span>
          <select className="border-slate-200 border rounded-lg text-sm font-medium py-2 px-4 focus:ring-[#5fa5fa] focus:border-[#5fa5fa]">
            <option>Alphabetically, A-Z</option>
            <option>Price, Low to High</option>
            <option>Price, High to Low</option>
          </select>
        </div>
      </div>

      <div className="flex flex-col md:flex-row gap-10">
        {/* LEFT SIDEBAR: FILTERS */}
        <aside className="w-full md:w-64 shrink-0">
          {/* Categories Filter */}
          <div className="mb-8">
            <h3 className="font-bold text-slate-900 mb-4 uppercase tracking-wider text-sm border-b pb-2">Product Type</h3>
            <ul className="space-y-3">
              {categories.map((category: any) => (
                <li key={category.id} className="flex items-center gap-3">
                  <input type="checkbox" className="rounded text-[#5fa5fa] focus:ring-[#5fa5fa] w-4 h-4 border-slate-300" />
                  <label className="text-sm text-slate-600 font-medium cursor-pointer flex-1">
                    {category.name} <span className="text-slate-400 text-xs ml-1">({category.products_count})</span>
                  </label>
                </li>
              ))}
            </ul>
          </div>

          {/* Price Filter */}
          <div className="mb-8">
            <h3 className="font-bold text-slate-900 mb-4 uppercase tracking-wider text-sm border-b pb-2">Price</h3>
            <div className="flex items-center gap-2">
              <div className="relative flex-1">
                <span className="absolute left-3 top-2.5 text-slate-400 text-sm">৳</span>
                <input type="number" placeholder="From" className="w-full border border-slate-200 rounded-lg pl-8 pr-3 py-2 text-sm focus:border-[#5fa5fa] focus:ring-1 focus:ring-[#5fa5fa]" />
              </div>
              <span className="text-slate-400">-</span>
              <div className="relative flex-1">
                <span className="absolute left-3 top-2.5 text-slate-400 text-sm">৳</span>
                <input type="number" placeholder="To" className="w-full border border-slate-200 rounded-lg pl-8 pr-3 py-2 text-sm focus:border-[#5fa5fa] focus:ring-1 focus:ring-[#5fa5fa]" />
              </div>
            </div>
          </div>
        </aside>

        {/* RIGHT SIDE: PRODUCT GRID */}
        <div className="flex-1">
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {products.data.map((product: any) => (
              <Link href={`/product/${product.slug}`} key={product.id} className="group">
                <div className="relative aspect-[4/5] bg-slate-50 rounded-2xl overflow-hidden mb-4 border border-slate-100 group-hover:shadow-lg transition-all">
                  
                  {/* USING STANDARD HTML IMG TO BYPASS ALL NEXT.JS ERRORS */}
                  <img 
                    src={(() => {
                      const raw = JSON.stringify(product.images || []);
                      // Simply look for anything that ends in an image extension
                      const match = raw.match(/[a-zA-Z0-9_.\-\/\\]+\.(png|jpg|jpeg|webp|gif)/i);
                      
                      if (match) {
                          let clean = match[0].replace(/\\\\/g, '/').replace(/\/\//g, '/');
                          // Guarantee it has the folder name
                          if (!clean.includes('product-gallery')) clean = 'product-gallery/' + clean;
                          
                          return `http://127.0.0.1:8000/media/${clean}`;
                      }
                      
                      // Using via.placeholder (PNG) instead of placehold.co (SVG) so the browser doesn't panic
                      return "https://via.placeholder.com/400x500.png?text=Item";
                    })()}
                    className="object-cover w-full h-full group-hover:scale-105 transition-transform duration-500" 
                    alt={product.name}
                  />

                  {product.is_new_arrival && (
                    <span className="absolute top-3 left-3 bg-[#5fa5fa] text-white text-[10px] font-black uppercase tracking-widest px-2 py-1 rounded-md">New</span>
                  )}
                </div>
                
                <h3 className="font-bold text-slate-800 text-sm mb-1 group-hover:text-[#5fa5fa] transition-colors">{product.name}</h3>
                <div className="flex items-center gap-2">
                  <span className="font-black text-[#5fa5fa]">৳{product.base_price}</span>
                </div>
              </Link>
            ))}
          </div>

          {/* PAGINATION CONTROLS */}
          {products.last_page > 1 && (
            <div className="mt-16 flex justify-center gap-2">
              {products.links.map((link: any, index: number) => (
                <Link 
                  key={index}
                  href={`/shop?page=${link.label.replace('&laquo; Previous', '').replace('Next &raquo;', '').trim()}`}
                  className={`w-10 h-10 flex items-center justify-center rounded-lg text-sm font-bold transition-colors ${link.active ? 'bg-[#5fa5fa] text-white' : 'bg-slate-50 text-slate-600 hover:bg-slate-100'} ${!link.url ? 'opacity-50 pointer-events-none' : ''}`}
                  dangerouslySetInnerHTML={{ __html: link.label }}
                />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}