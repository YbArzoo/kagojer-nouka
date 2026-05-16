'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useCart } from '../store/useCart';
import Link from 'next/link';

export default function CheckoutPage() {
  const router = useRouter();
  const { items, getTotal, clearCart } = useCart();
  const [mounted, setMounted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  // NEW: State to hold the coupon passed from the cart
  const [activeCoupon, setActiveCoupon] = useState<{code: string, type: string, value: number, is_free_shipping: boolean, minimum_spend: number | null} | null>(null);

  // Form State
  const [formData, setFormData] = useState({
    customer_name: '',
    phone_number: '',
    shipping_address: '',
  });

  useEffect(() => {
    setMounted(true);
    if (items.length === 0) {
      router.push('/category/file');
    }

    // NEW: Grab the saved coupon from localStorage!
    const savedCoupon = localStorage.getItem('kagojer_coupon');
    if (savedCoupon) {
        try {
            const parsed = JSON.parse(savedCoupon);
            // Security check: Make sure subtotal still meets minimum spend
            if (!parsed.minimum_spend || getTotal() >= parsed.minimum_spend) {
                setActiveCoupon(parsed);
            } else {
                localStorage.removeItem('kagojer_coupon'); // Invalidated
            }
        } catch (e) {
            console.error("Failed to parse coupon");
        }
    }
  }, [items, router, getTotal]);

  if (!mounted || items.length === 0) return <div className="min-h-screen bg-slate-50" />;

  // --- REAL-TIME MATH ENGINE ---
  const subtotal = getTotal();
  const baseShipping = 60;
  const shipping = activeCoupon?.is_free_shipping ? 0 : baseShipping;

  let rawDiscount = 0;
  if (activeCoupon) {
      if (activeCoupon.type === 'fixed') {
          rawDiscount = activeCoupon.value;
      } else if (activeCoupon.type === 'percentage') {
          rawDiscount = (subtotal * activeCoupon.value) / 100;
      }
  }

  const effectiveDiscount = Math.min(rawDiscount, subtotal);
  const finalTotal = subtotal - effectiveDiscount + shipping;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/checkout`, {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          'Accept': 'application/json' 
        },
        body: JSON.stringify({
          ...formData,
          items: items.map(item => ({ 
            id: item.id, 
            variant_id: item.variant_id || null, 
            quantity: item.quantity 
          })),
          // NEW: Send the coupon data to your Laravel API!
          coupon_code: activeCoupon?.code || null,
          discount_amount: effectiveDiscount,
          shipping_fee: shipping,
          total_amount: finalTotal
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        console.error("LARAVEL ERROR:", errorData);
        throw new Error(errorData.message || errorData.error || 'Checkout failed on backend');
      }

      // Success! Clear the cart, destroy the coupon, and redirect
      clearCart();
      localStorage.removeItem('kagojer_coupon');
      alert("Order Placed Successfully! 🎉 The Kagojer Nouka team will pack it soon.");
      router.push('/'); 
      
    } catch (error: any) {
      console.error(error);
      alert(`Error: ${error.message}`); 
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <main className="min-h-screen bg-slate-50 py-12 px-6">
      <div className="max-w-4xl mx-auto">
        <Link href="/cart" className="text-slate-400 hover:text-[#5fa5fa] font-bold text-sm uppercase tracking-wider mb-8 inline-block transition-colors">
          ← Back to Cart
        </Link>
        
        <h1 className="text-4xl font-black text-slate-900 mb-10 tracking-tight">Checkout</h1>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          
          {/* Shipping Form */}
          <div className="bg-white p-8 rounded-[2.5rem] border border-slate-100 shadow-sm">
            <h2 className="text-xl font-black text-slate-800 mb-6">Shipping Details</h2>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label className="block text-xs font-bold text-slate-400 uppercase tracking-widest mb-2">Full Name</label>
                <input required type="text" className="w-full px-4 py-3 rounded-xl bg-slate-50 border border-slate-200 focus:ring-2 focus:ring-[#5fa5fa]/50 focus:border-[#5fa5fa] focus:outline-none transition-all text-slate-800 font-medium"
                  value={formData.customer_name} onChange={(e) => setFormData({...formData, customer_name: e.target.value})} 
                />
              </div>
              
              <div>
                <label className="block text-xs font-bold text-slate-400 uppercase tracking-widest mb-2">Phone Number</label>
                <input required type="tel" className="w-full px-4 py-3 rounded-xl bg-slate-50 border border-slate-200 focus:ring-2 focus:ring-[#5fa5fa]/50 focus:border-[#5fa5fa] focus:outline-none transition-all text-slate-800 font-medium"
                  value={formData.phone_number} onChange={(e) => setFormData({...formData, phone_number: e.target.value})} 
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-400 uppercase tracking-widest mb-2">Delivery Address</label>
                <textarea required rows={3} className="w-full px-4 py-3 rounded-xl bg-slate-50 border border-slate-200 focus:ring-2 focus:ring-[#5fa5fa]/50 focus:border-[#5fa5fa] focus:outline-none transition-all text-slate-800 font-medium"
                  value={formData.shipping_address} onChange={(e) => setFormData({...formData, shipping_address: e.target.value})} 
                />
              </div>

              <button disabled={isSubmitting} type="submit" className="w-full py-5 rounded-2xl font-black text-lg bg-slate-900 text-white shadow-xl shadow-slate-200 hover:bg-[#5fa5fa] hover:shadow-brand-blue/30 transition-all duration-300 active:scale-[0.98] mt-4 disabled:opacity-50">
                {isSubmitting ? 'Processing Order...' : `Confirm Order • ৳${finalTotal.toFixed(2)}`}
              </button>
            </form>
          </div>

          {/* Quick Order Summary */}
          <div className="bg-white p-8 rounded-[2.5rem] border border-slate-100 shadow-xl shadow-blue-50/50 h-fit">
            <h2 className="text-xl font-black text-slate-800 mb-6">Your Haul</h2>
            <div className="space-y-4 mb-6">
              {items.map(item => (
                <div key={item.uniqueId} className="flex justify-between items-center">
                  <span className="text-slate-600 font-medium text-sm">{item.quantity}x {item.name}</span>
                  <span className="text-slate-800 font-bold">৳{(item.price * item.quantity).toFixed(2)}</span>
                </div>
              ))}
            </div>

            <div className="border-t border-slate-100 pt-6 space-y-3">
              <div className="flex justify-between items-center text-sm">
                <span className="text-slate-500 font-medium">Subtotal</span>
                <span className="text-slate-800 font-bold">৳{subtotal.toFixed(2)}</span>
              </div>

              {/* NEW: Checkout Discount View */}
              {effectiveDiscount > 0 && (
                <div className="flex justify-between items-center text-sm text-emerald-500">
                  <span className="font-bold">Discount ({activeCoupon?.code})</span>
                  <span className="font-bold">- ৳{effectiveDiscount.toFixed(2)}</span>
                </div>
              )}

              {/* NEW: Checkout Free Shipping View */}
              <div className="flex justify-between items-center text-sm mb-2">
                <span className="text-slate-500 font-medium">Shipping</span>
                {activeCoupon?.is_free_shipping ? (
                  <span className="font-bold text-emerald-500">FREE</span>
                ) : (
                  <span className="text-slate-800 font-bold">৳{shipping.toFixed(2)}</span>
                )}
              </div>
            </div>

            <div className="border-t border-slate-100 pt-4 mt-4 flex justify-between items-center">
              <span className="text-slate-800 font-black text-lg">Total</span>
              <span className="text-[#5fa5fa] font-black text-3xl">৳{finalTotal.toFixed(2)}</span>
            </div>
          </div>

        </div>
      </div>
    </main>
  );
}