'use client';

import { useState, useEffect, useMemo } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { useCart } from '../../store/useCart';

export default function ProductPage() {
  const { slug } = useParams();
  const router = useRouter();
  const [product, setProduct] = useState<any>(null);
  const [mainImage, setMainImage] = useState('');
  const [isAdded, setIsAdded] = useState(false);
  
  // UI State for Variants & Quantity
  const [selectedColor, setSelectedColor] = useState<string | null>(null);
  const [selectedSize, setSelectedSize] = useState<string | null>(null);
  const [quantity, setQuantity] = useState(1);

  const addItem = useCart((state) => state.addItem);

  // --- 1. FETCH PRODUCT DATA ---
  useEffect(() => {
    fetch(`${process.env.NEXT_PUBLIC_API_URL}/products/${slug}?t=${new Date().getTime()}`, {
        cache: 'no-store' 
    })
      .then((res) => res.json())
      .then((data) => {
        setProduct(data);
        
        // Auto-select first variant if exists
        if (data.variants && data.variants.length > 0) {
            const firstColor = data.variants.find((v: any) => v.color)?.color;
            const firstSize = data.variants.find((v: any) => v.size)?.size;
            if (firstColor) setSelectedColor(firstColor);
            if (firstSize) setSelectedSize(firstSize);
        }
      })
      .catch(err => console.error("Error fetching product:", err));
  }, [slug]);

  // --- 2. EXTRACT ALL IMAGES (GOD MODE REGEX) ---
  const allGalleryImages = useMemo(() => {
      if (!product) return [];
      
      let rawDataList: any[] = [];
      // Grab main images
      if (product.images) rawDataList = [...product.images];
      // Grab variant images
      if (product.variants) {
          product.variants.forEach((v: any) => {
              if (v.image) rawDataList.push(v.image);
          });
      }

      // Parse with our indestructible regex
      const parsedUrls = rawDataList.map(rawImg => {
          const raw = JSON.stringify(rawImg);
          const match = raw.match(/[a-zA-Z0-9_.\-\/\\]+\.(png|jpg|jpeg|webp|gif)/i);
          if (match) {
              const exactFilename = match[0].replace(/\\/g, '/').split('/').pop();
              return `http://127.0.0.1:8000/product-gallery/${exactFilename}`;
          }
          return null;
      }).filter(Boolean) as string[];

      // Remove duplicates and return
      const uniqueImages = Array.from(new Set(parsedUrls));
      
      // Set the initial main image
      if (uniqueImages.length > 0 && !mainImage) {
          setMainImage(uniqueImages[0]);
      }
      
      return uniqueImages.length > 0 ? uniqueImages : ["https://placehold.co/600x600/f8fafc/60a5fa?text=No+Image"];
  }, [product]);

  // --- 3. VARIANT LOGIC ---
  const currentVariant = useMemo(() => {
      if (!product || !product.variants || product.variants.length === 0) return null;
      
      return product.variants.find((v: any) => {
          const colorMatch = selectedColor ? v.color === selectedColor : true;
          const sizeMatch = selectedSize ? v.size === selectedSize : true;
          return colorMatch && sizeMatch;
      });
  }, [product, selectedColor, selectedSize]);

  // --- 4. AUTO-SWITCH IMAGE ON COLOR CLICK ---
  useEffect(() => {
      if (currentVariant && currentVariant.image) {
          const raw = JSON.stringify(currentVariant.image);
          const match = raw.match(/[a-zA-Z0-9_.\-\/\\]+\.(png|jpg|jpeg|webp|gif)/i);
          if (match) {
              const exactFilename = match[0].replace(/\\/g, '/').split('/').pop();
              setMainImage(`http://127.0.0.1:8000/product-gallery/${exactFilename}`);
          }
      }
  }, [currentVariant]);

  const displayPrice = currentVariant 
      ? Number(product.price) + Number(currentVariant.price_adjustment)
      : product?.price;
      
  const displayStock = currentVariant ? currentVariant.stock_quantity : product?.stock;

  const handleAddToCart = () => {
    if (product.variants?.length > 0 && !currentVariant) {
        alert("Please select a valid color and size combination.");
        return;
    }

    addItem({
      id: product.id,
      uniqueId: currentVariant ? `${product.id}-${currentVariant.id}` : `${product.id}-base`,
      variant_id: currentVariant ? currentVariant.id : null,
      name: currentVariant 
          ? `${product.name} - ${currentVariant.color || ''} ${currentVariant.size || ''}`.trim()
          : product.name,
      price: displayPrice,
      image: mainImage,
      quantity: quantity, 
    });

    setIsAdded(true);
    setTimeout(() => setIsAdded(false), 2000);
  };

  if (!product) return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50">
      <div className="animate-pulse text-brand-blue font-bold tracking-widest uppercase">Unboxing the magic... ✨</div>
    </div>
  );

  const availableColors = Array.from(new Set(product.variants?.map((v: any) => v.color).filter(Boolean))) as string[];
  const availableSizes = Array.from(new Set(product.variants?.map((v: any) => v.size).filter(Boolean))) as string[];

  return (
    <main className="max-w-7xl mx-auto px-6 py-12 md:py-20 bg-slate-50">
      <button 
        onClick={() => router.back()}
        className="mb-8 flex items-center text-slate-400 hover:text-brand-blue transition-colors font-bold text-sm uppercase tracking-wider"
      >
        ← Back to Shop
      </button>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-start mb-24">
        
        {/* Left: Desktop Vertical Gallery + Main Image */}
        <div className="lg:col-span-7 flex flex-col-reverse md:flex-row gap-4 md:gap-6">
          <div className="flex md:flex-col gap-4 overflow-x-auto md:overflow-y-auto md:max-h-[600px] no-scrollbar py-1 md:w-24 shrink-0">
            {allGalleryImages.map((img: string, index: number) => (
              <button 
                key={index} 
                onClick={() => setMainImage(img)}
                className={`relative w-20 h-20 md:w-full md:h-24 rounded-2xl overflow-hidden border-2 transition-all duration-300 shrink-0 ${
                  mainImage === img ? 'border-brand-mint shadow-md scale-[1.02]' : 'border-transparent opacity-60 hover:opacity-100'
                }`}
              >
                <img src={img} alt={`view ${index + 1}`} className="object-cover w-full h-full" />
              </button>
            ))}
          </div>
          <div className="relative aspect-[4/5] w-full rounded-[2.5rem] overflow-hidden bg-white shadow-xl shadow-blue-50/50 border border-slate-100">
            <img src={mainImage} alt={product.name} className="object-cover w-full h-full" />
          </div>
        </div>

        {/* Right: The Buy Box */}
        <div className="lg:col-span-5 flex flex-col h-full sticky top-32">
          
          <div className="mb-6">
            <div className="flex items-center gap-2 mb-4">
               <span className="flex text-yellow-400 text-sm">★★★★★</span>
            </div>
            <h1 className="text-3xl md:text-4xl font-black text-slate-900 leading-tight mb-4 tracking-tight">
              {product.name}
            </h1>
            <div className="flex items-center gap-4">
              <p className="text-3xl font-black text-[#5fa5fa]">৳{displayPrice}</p>
            </div>
          </div>
          
          <p className="text-slate-500 text-sm leading-relaxed font-medium mb-8">
            {product.description || "Every piece of stationery tells a story. Add this aesthetic treasure to your collection today."}
          </p>

          <hr className="border-slate-100 mb-8" />

          {availableColors.length > 0 && (
            <div className="mb-6">
              <h3 className="text-xs font-black text-slate-900 uppercase mb-3 tracking-widest">Color: <span className="text-slate-500 font-medium">{selectedColor}</span></h3>
              <div className="flex flex-wrap gap-3">
                {availableColors.map(color => (
                  <button 
                    key={color}
                    onClick={() => setSelectedColor(color)}
                    className={`px-4 py-2 rounded-xl border-2 text-sm font-bold transition-all ${
                      selectedColor === color 
                      ? 'border-[#5fa5fa] bg-brand-mint/10 text-slate-900' 
                      : 'border-slate-100 text-slate-400 hover:border-slate-200'
                    }`}
                  >
                    {color}
                  </button>
                ))}
              </div>
            </div>
          )}

          {availableSizes.length > 0 && (
            <div className="mb-8">
              <h3 className="text-xs font-black text-slate-900 uppercase mb-3 tracking-widest">Size: <span className="text-slate-500 font-medium">{selectedSize}</span></h3>
              <div className="flex flex-wrap gap-3">
                {availableSizes.map(size => (
                  <button 
                    key={size}
                    onClick={() => setSelectedSize(size)}
                    className={`px-4 py-2 rounded-xl border-2 text-sm font-bold transition-all ${
                      selectedSize === size 
                      ? 'border-brand-blue bg-brand-blue/10 text-slate-900' 
                      : 'border-slate-100 text-slate-400 hover:border-slate-200'
                    }`}
                  >
                    {size}
                  </button>
                ))}
              </div>
            </div>
          )}

          <p className={`text-sm font-bold mb-4 ${displayStock > 0 ? 'text-emerald-500' : 'text-red-500'}`}>
              {displayStock > 0 ? `${displayStock} in stock ready to ship` : 'Currently Out of Stock'}
          </p>

          <div className="flex gap-4 mb-8">
             <div className="flex items-center justify-between bg-white border-2 border-slate-100 rounded-2xl px-4 py-2 w-32">
                <button onClick={() => setQuantity(Math.max(1, quantity - 1))} className="text-slate-400 hover:text-brand-blue text-xl font-bold">−</button>
                <span className="font-black text-slate-900">{quantity}</span>
                <button onClick={() => setQuantity(quantity + 1)} className="text-slate-400 hover:text-brand-blue text-xl font-bold">+</button>
             </div>

            <button 
              onClick={handleAddToCart}
              disabled={displayStock <= 0}
              className={`flex-1 py-4 rounded-2xl font-black text-lg transition-all duration-300 active:scale-[0.98] flex items-center justify-center gap-3 shadow-xl ${
                displayStock <= 0 
                  ? 'bg-slate-200 text-slate-400 cursor-not-allowed shadow-none'
                  : isAdded 
                    ? 'bg-emerald-400 text-white shadow-emerald-200 hover:bg-emerald-500' 
                    : 'bg-slate-900 text-white shadow-slate-200 hover:bg-[#5fa5fa] hover:shadow-brand-blue/30'
              }`}
            >
              {isAdded ? 'Added to Bag! ✨' : 'Add to Bag 🛍️'}
            </button>
          </div>
        </div>
      </div>
    </main>
  );
}