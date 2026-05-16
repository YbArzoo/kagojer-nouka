import Link from 'next/link';

export default function Footer() {
  return (
    <footer className="bg-white border-t border-pink-50 pt-20 pb-10">
      <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 md:grid-cols-4 gap-12 mb-16">
        
        {/* Brand Story */}
        <div className="col-span-1 md:col-span-1">
          <h3 className="text-xl font-black text-gray-900 mb-6">Kagojer Nouka ⛵</h3>
          <p className="text-gray-500 text-sm leading-relaxed">
            Curating the finest aesthetic stationery from China for the dreamers in Bangladesh. Your desk deserves to be beautiful.
          </p>
        </div>

        {/* Quick Links */}
        <div>
          <h4 className="font-bold text-gray-900 mb-6 text-sm uppercase tracking-widest">Shop</h4>
          <ul className="space-y-4 text-sm text-gray-500">
            <li><Link href="/" className="hover:text-pink-500 transition-colors">New Arrivals</Link></li>
            <li><Link href="/category/file" className="hover:text-pink-500 transition-colors">Files & Folders</Link></li>
            <li><Link href="/" className="hover:text-pink-500 transition-colors">Best Sellers</Link></li>
          </ul>
        </div>

        {/* Support */}
        <div>
          <h4 className="font-bold text-gray-900 mb-6 text-sm uppercase tracking-widest">Support</h4>
          <ul className="space-y-4 text-sm text-gray-500">
            <li><Link href="/" className="hover:text-pink-500 transition-colors">Shipping Policy</Link></li>
            <li><Link href="/" className="hover:text-pink-500 transition-colors">Terms of Service</Link></li>
            <li><Link href="/" className="hover:text-pink-500 transition-colors">Contact Us</Link></li>
          </ul>
        </div>

        {/* Newsletter */}
        <div>
          <h4 className="font-bold text-gray-900 mb-6 text-sm uppercase tracking-widest">Newsletter</h4>
          <p className="text-gray-500 text-sm mb-4">Join the Kawaii club for early access to restocks.</p>
          <div className="flex gap-2">
            <input type="email" placeholder="Email" className="bg-pink-50 border-none rounded-xl px-4 py-2 text-sm flex-1 focus:ring-2 focus:ring-pink-200" />
            <button className="bg-gray-900 text-white px-4 py-2 rounded-xl text-xs font-bold uppercase hover:bg-pink-500 transition-colors">Join</button>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 pt-10 border-t border-pink-50 flex flex-col md:flex-row justify-between items-center gap-4">
        <p className="text-xs text-gray-400">© 2026 Kagojer Nouka. All rights reserved.</p>
        <div className="flex gap-6 text-xs text-gray-400 font-medium">
          <span>Dhaka, Bangladesh 🇧🇩</span>
        </div>
      </div>
    </footer>
  );
}