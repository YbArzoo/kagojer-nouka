/* eslint-disable @next/next/no-img-element */
'use client';

import { useEffect, useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useCart } from '../store/useCart';

export default function CartPage() {
  const [mounted, setMounted] = useState(false);
  const { items, addItem, decreaseItem, removeItem, getTotal } = useCart();

  // --- UPDATED STATE ---
  const [activeCoupon, setActiveCoupon] = useState<{code: string, type: string, value: number, is_free_shipping: boolean, minimum_spend: number | null} | null>(null);
  const [couponCode, setCouponCode] = useState('');
  const [couponMessage, setCouponMessage] = useState({ type: '', text: '' });
  const [isApplying, setIsApplying] = useState(false);

  // Calculate subtotal at the top so our Hook can watch it safely
  const subtotal = getTotal();

  // --- NEW: AUTO-REMOVE COUPON IF SUBTOTAL DROPS TOO LOW ---
  useEffect(() => {
    if (activeCoupon?.minimum_spend && subtotal < activeCoupon.minimum_spend) {
      setActiveCoupon(null);
      localStorage.removeItem('kagojer_coupon'); // NEW: Destroy it if they drop below minimum spend!
      setCouponMessage({ type: 'error', text: `Coupon removed: Minimum spend of ৳${activeCoupon.minimum_spend} required.` });
    }
  }, [subtotal, activeCoupon]);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return <div className="min-h-screen bg-slate-50"></div>;

  // --- REAL-TIME MATH ENGINE ---
  const baseShipping = subtotal > 0 ? 60 : 0; 
  
  // If the active coupon has free shipping, set shipping to 0!
  const shipping = activeCoupon?.is_free_shipping ? 0 : baseShipping;

  let rawDiscount = 0;
  if (activeCoupon) {
      if (activeCoupon.type === 'fixed') {
          rawDiscount = activeCoupon.value;
      } else if (activeCoupon.type === 'percentage') {
          rawDiscount = (subtotal * activeCoupon.value) / 100;
      }
  }

  // Cap it instantly so it never exceeds subtotal
  const effectiveDiscount = Math.min(rawDiscount, subtotal);
  const finalTotal = subtotal - effectiveDiscount + shipping;

  // --- API CALL ---
  const handleApplyCoupon = async () => {
    if (!couponCode.trim()) return;
    setIsApplying(true);
    setCouponMessage({ type: '', text: '' });

    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/apply-coupon`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ code: couponCode, subtotal: subtotal }) // Passing subtotal for minimum spend check
      });

      const data = await res.json();

      if (res.ok) {
        const couponData = { 
            code: data.code, 
            type: data.type, 
            value: Number(data.value),
            is_free_shipping: data.is_free_shipping,
            minimum_spend: data.minimum_spend ? Number(data.minimum_spend) : null
        };
        setActiveCoupon(couponData);
        // NEW: Save the sticky note for the Checkout page!
        localStorage.setItem('kagojer_coupon', JSON.stringify(couponData)); 
        
        setCouponMessage({ type: 'success', text: `✨ Coupon applied successfully!` });
        setCouponCode('');
      }
    } catch (error) {
      setCouponMessage({ type: 'error', text: 'Connection error. Try again.' });
    } finally {
      setIsApplying(false);
    }
  };

  const handleRemoveCoupon = () => {
    setActiveCoupon(null);
    localStorage.removeItem('kagojer_coupon'); // NEW: Destroy the sticky note
    setCouponMessage({ type: '', text: '' });
  };

  // --- EMPTY CART STATE ---
  if (items.length === 0) {
    return (
      <main className="min-h-[70vh] flex flex-col items-center justify-center bg-slate-50 px-6">
        <div className="w-48 h-48 relative mb-8 opacity-50 grayscale">
          <Image src="/logo.png" alt="Empty Cart" fill className="object-contain" />
        </div>
        <h1 className="text-3xl font-black text-slate-800 mb-4 tracking-tight">Your boat is empty! ⛵</h1>
        <p className="text-slate-500 mb-8 font-medium">Looks like you haven't added any aesthetic treasures yet.</p>
        <Link href="/category/file" className="btn-branding">
          Start Shopping
        </Link>
      </main>
    );
  }

  // --- FILLED CART STATE ---
  return (
    <main className="min-h-screen bg-slate-50 py-12 px-6">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-4xl font-black text-slate-900 mb-10 tracking-tight">Shopping Bag</h1>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
          
          <div className="lg:col-span-2 space-y-6">
            {items.map((item) => (
              <div key={item.uniqueId} className="flex flex-col sm:flex-row items-center gap-6 bg-white p-6 rounded-[2rem] border border-slate-100 shadow-sm hover:shadow-lg hover:shadow-blue-50/50 transition-all">
                
                <div className="relative w-28 h-28 rounded-2xl overflow-hidden bg-slate-50 border border-slate-100 flex-shrink-0">
                  <img 
                    src={(() => {
                      const raw = JSON.stringify(item.image || '');
                      const match = raw.match(/[a-zA-Z0-9_.\-\/\\]+\.(png|jpg|jpeg|webp|gif)/i);
                      if (match) {
                          const exactFilename = match[0].replace(/\\/g, '/').split('/').pop();
                          return `http://127.0.0.1:8000/product-gallery/${exactFilename}`;
                      }
                      return "https://placehold.co/400x500/f8fafc/5fa5fa?text=No+Image";
                    })()}
                    className="object-cover w-full h-full" 
                    alt={item.name} 
                  />
                </div>

                <div className="flex-1 text-center sm:text-left">
                  <h3 className="text-lg font-bold text-slate-800 leading-tight mb-2">{item.name}</h3>
                  <p className="text-brand-blue font-black text-xl">৳{item.price}</p>
                </div>

                <div className="flex items-center gap-4 bg-slate-50 p-2 rounded-2xl border border-slate-100">
                  <button onClick={() => decreaseItem(item.uniqueId)} className="w-8 h-8 flex items-center justify-center bg-white rounded-xl font-black text-slate-600 shadow-sm hover:text-brand-blue transition-colors">-</button>
                  <span className="w-6 text-center font-bold text-slate-800">{item.quantity}</span>
                  <button onClick={() => addItem({ ...item, quantity: 1 })} className="w-8 h-8 flex items-center justify-center bg-white rounded-xl font-black text-slate-600 shadow-sm hover:text-brand-blue transition-colors">+</button>
                </div>

                <button onClick={() => removeItem(item.uniqueId)} className="p-3 text-red-400 hover:text-red-600 hover:bg-red-50 rounded-xl transition-colors">
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-6 h-6">
                    <path strokeLinecap="round" strokeLinejoin="round" d="m14.74 9-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 0 1-2.244 2.077H8.084a2.25 2.25 0 0 1-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 0 0-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 0 1 3.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 0 0-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 0 0-7.5 0" />
                  </svg>
                </button>
              </div>
            ))}
          </div>

          <div className="bg-white p-8 rounded-[2.5rem] border border-slate-100 shadow-xl shadow-blue-50/50 h-fit sticky top-32">
            <h2 className="text-xl font-black text-slate-900 mb-8 uppercase tracking-widest">Order Summary</h2>
            
            <div className="space-y-4 text-slate-600 font-medium mb-8">
              <div className="flex justify-between">
                <span>Subtotal</span>
                <span className="font-bold text-slate-900">৳{subtotal.toFixed(2)}</span>
              </div>

              {effectiveDiscount > 0 && (
                 <div className="flex justify-between text-emerald-500">
                   <span className="flex items-center gap-2">
                     Discount ({activeCoupon?.code})
                     <button onClick={handleRemoveCoupon} className="text-xs bg-red-100 text-red-500 px-2 py-0.5 rounded-full hover:bg-red-200 transition-colors">Remove</button>
                   </span>
                   <span className="font-bold">- ৳{effectiveDiscount.toFixed(2)}</span>
                 </div>
              )}

              {/* NEW FREE SHIPPING UI */}
              <div className="flex justify-between items-center">
                <span>Shipping (Inside Dhaka)</span>
                {activeCoupon?.is_free_shipping ? (
                   <div className="flex items-center gap-2">
                     <span className="line-through text-slate-300 text-sm">৳{baseShipping.toFixed(2)}</span>
                     <span className="font-bold text-emerald-500 bg-emerald-50 px-2 py-1 rounded-lg border border-emerald-100">FREE</span>
                   </div>
                ) : (
                   <span className="font-bold text-slate-900">৳{shipping.toFixed(2)}</span>
                )}
              </div>
            </div>

            <div className="mb-8 pt-6 border-t border-slate-100">
               {!activeCoupon ? (
                 <div className="flex gap-2">
                   <input 
                     type="text" 
                     value={couponCode}
                     onChange={(e) => setCouponCode(e.target.value.toUpperCase())}
                     placeholder="Discount Code" 
                     className="flex-1 bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm font-bold focus:outline-none focus:border-brand-blue"
                   />
                   <button 
                     onClick={handleApplyCoupon}
                     disabled={isApplying || !couponCode}
                     className="bg-slate-900 text-white px-5 rounded-xl font-bold text-sm hover:bg-brand-blue transition-colors disabled:opacity-50"
                   >
                     {isApplying ? '...' : 'Apply'}
                   </button>
                 </div>
               ) : null}
               
               {couponMessage.text && (
                 <p className={`mt-3 text-sm font-bold ${couponMessage.type === 'error' ? 'text-red-500' : 'text-emerald-500'}`}>
                   {couponMessage.text}
                 </p>
               )}
            </div>

            <div className="border-t border-slate-100 pt-6 mb-8 flex justify-between items-center">
              <span className="text-lg font-bold text-slate-800">Total</span>
              <span className="text-3xl font-black text-brand-blue">৳{finalTotal.toFixed(2)}</span>
            </div>

            <Link href="/checkout" className="block w-full py-5 text-center rounded-2xl font-black text-lg bg-slate-900 text-white shadow-xl shadow-slate-200 hover:bg-brand-blue hover:shadow-brand-blue/30 transition-all duration-300 active:scale-[0.98]">
            Proceed to Checkout
            </Link>
          </div>

        </div>
      </div>
    </main>
  );
}