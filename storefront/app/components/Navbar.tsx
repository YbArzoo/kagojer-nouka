'use client';
import { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import SearchBar from './SearchBar';
import { useCart } from '../store/useCart';

export default function Navbar({ categories = [] }: { categories?: any[] }) {
  const cartItems = useCart((state) => state.items);
  const totalItems = cartItems.reduce((total, item) => total + item.quantity, 0);
  
  // State for mobile menu
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  // Filter categories that should appear in the nav strip
  const navCategories = categories.filter((c) => c.is_in_nav);

  return (
    <nav className="sticky top-0 z-50 flex flex-col">
      {/* --- TOP WHITE HEADER --- */}
      <div className="bg-white/80 backdrop-blur-xl border-b border-slate-100 shadow-sm relative z-20">
        <div className="max-w-7xl mx-auto px-4 md:px-6 h-16 md:h-24 flex items-center justify-between gap-4 md:gap-12">
          
          {/* Mobile Menu Toggle */}
          <button 
            className="md:hidden p-2 -ml-2 text-slate-600 hover:text-brand-blue transition-colors"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          >
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor" className="w-6 h-6">
              <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25H12" />
            </svg>
          </button>

          {/* Logo Area (Fixed Image Warnings!) */}
          <Link href="/" className="flex items-center gap-2 md:gap-3.5 group shrink-0">
            <div className="relative w-9 h-9 md:w-12 md:h-12 flex items-center justify-center p-2 rounded-xl md:rounded-2xl bg-gradient-to-br from-brand-mint/50 to-brand-blue/50 group-hover:rotate-12 transition-transform duration-500 shadow-md">
               <Image 
                  src="/logo.png" 
                  alt="Kagojer Nouka Logo" 
                  fill 
                  sizes="(max-width: 768px) 36px, 48px"
                  className="object-contain p-1" 
               />
            </div>
            <span className="hidden sm:block text-lg md:text-xl font-black text-slate-900 tracking-tight uppercase">
              Kagojer <span className="text-brand-blue italic">Nouka</span>
            </span>
          </Link>

          {/* Search (Desktop Only) */}
          <div className="hidden md:block flex-1 max-w-lg">
            <SearchBar />
          </div>

          {/* Links & Live Cart Badge */}
          <div className="flex items-center gap-4 md:gap-10 font-bold text-xs md:text-[13px] uppercase tracking-wider text-slate-500">
            <Link href="/" className="hidden md:block hover:text-brand-blue transition-colors">Home</Link>
            <Link href="/shop" className="hidden md:block hover:text-brand-blue transition-colors">Shop</Link>
            
            <Link href="/cart" className="relative p-2 md:p-3 bg-slate-100 rounded-xl md:rounded-2xl hover:bg-brand-blue hover:text-white transition-all group">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-5 h-5 md:w-6 md:h-6">
                <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 10.5V6a3.75 3.75 0 1 0-7.5 0v4.5m11.356-1.993 1.263 12c.07.665-.45 1.243-1.119 1.243H4.25a1.125 1.125 0 0 1-1.12-1.243l1.264-12A1.125 1.125 0 0 1 5.513 7.5h12.974c.576 0 1.059.435 1.119 1.007ZM8.625 10.5a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Zm7.5 0a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Z" />
              </svg>
              
              {totalItems > 0 && (
                <span className="absolute -top-1.5 -right-1.5 bg-brand-blue text-white text-[9px] md:text-[10px] w-4 h-4 md:w-5 md:h-5 rounded-full flex items-center justify-center border-2 md:border-4 border-white font-black group-hover:bg-slate-900">
                  {totalItems}
                </span>
              )}
            </Link>
          </div>
        </div>
      </div>

{/* --- MEGA MENU NAVIGATION STRIP (Desktop Only) --- */}
      <div className="hidden md:block w-full bg-[#5fa5fa] shadow-md relative z-10">
        <div className="max-w-7xl mx-auto px-4">
          <ul className="flex items-center justify-center gap-10 py-3">
            
            {/* Always keep a link to all products */}
            <li>
              <Link href="/shop" className="text-xs font-bold text-white hover:text-blue-100 uppercase tracking-wider transition-colors">
                All Products
              </Link>
            </li>

            {/* Dynamically Map Categories from Laravel */}
            {navCategories.map((category: any) => (
              <li key={category.slug} className="group static">
                <Link 
                  href={`/category/${category.slug}`} 
                  className="text-xs font-bold text-white hover:text-blue-100 uppercase tracking-wider flex items-center gap-1 cursor-pointer py-2 transition-colors"
                >
                  {category.name}
                </Link>

                {/* THE MEGA DROPDOWN (Only opens on hover if there are sub-categories) */}
                {category.children && category.children.length > 0 && (
                  <div className="absolute top-full left-0 w-full hidden group-hover:block bg-white shadow-2xl border-t-2 border-[#5fa5fa] z-50">
                    <div className="max-w-7xl mx-auto px-8 py-10 flex gap-12">
                      
                      {/* Sub-Categories List */}
                      <div className="flex-1 grid grid-cols-4 gap-8">
                        <div>
                          <h3 className="font-black text-[#5fa5fa] uppercase tracking-widest mb-4 border-b-2 border-slate-100 pb-2">
                            {category.name}
                          </h3>
                          <ul className="space-y-3">
                            {category.children.map((child: any) => (
                              <li key={child.slug}>
                                <Link href={`/category/${child.slug}`} className="text-sm font-medium text-slate-500 hover:text-[#5fa5fa] transition-colors">
                                  {child.name}
                                </Link>
                              </li>
                            ))}
                          </ul>
                        </div>
                      </div>

                      {/* Category Preview Image */}
                      {/* Category Preview Image (God Mode) */}
                      {category.image && (
                        <div className="w-72 h-64 relative rounded-xl overflow-hidden bg-slate-100 flex-shrink-0 group/image shadow-inner">
                          
                          <img 
                            src={(() => {
                              const raw = JSON.stringify(category.image);
                              const match = raw.match(/[a-zA-Z0-9_.\-\/\\]+\.(png|jpg|jpeg|webp|gif)/i);
                              
                              if (match) {
                                  const exactFilename = match[0].replace(/\\/g, '/').split('/').pop();
                                  return `http://127.0.0.1:8000/media/categories/${exactFilename}`;
                              }
                              
                              return "https://via.placeholder.com/800x800.png?text=Explore";
                            })()}
                            className="object-cover w-full h-full group-hover/image:scale-105 transition-transform duration-700" 
                            alt={category.name}
                          />

                          <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent flex items-end p-5">
                             <span className="text-white font-black uppercase tracking-widest text-lg drop-shadow-md">
                               Explore {category.name}
                             </span>
                          </div>
                        </div>
                      )}

                    </div>
                  </div>
                )}
              </li>
            ))}
            
          </ul>
        </div>
      </div>

      {/* --- Mobile Dropdown Menu (Existing) --- */}
      {isMobileMenuOpen && (
        <div className="md:hidden absolute top-full left-0 w-full bg-white border-b border-slate-100 shadow-2xl pb-4 z-50">
          <div className="px-4 pt-4 pb-2">
            <SearchBar />
          </div>
          <div className="flex flex-col font-bold text-sm uppercase tracking-wider text-slate-600">
            <Link href="/" onClick={() => setIsMobileMenuOpen(false)} className="px-6 py-4 border-b border-slate-50 hover:text-brand-blue hover:bg-slate-50">Home</Link>
            <Link href="/shop" onClick={() => setIsMobileMenuOpen(false)} className="px-6 py-4 border-b border-slate-50 hover:text-brand-blue hover:bg-slate-50">Shop All</Link>
            
            {/* Show dynamic categories in mobile menu too */}
            {navCategories.map((category: any) => (
               <Link key={category.slug} href={`/category/${category.slug}`} onClick={() => setIsMobileMenuOpen(false)} className="px-6 py-4 border-b border-slate-50 hover:text-brand-blue hover:bg-slate-50">
                 {category.name}
               </Link>
            ))}
          </div>
        </div>
      )}
    </nav>
  );
}