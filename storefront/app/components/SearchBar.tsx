'use client';
import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';

export default function SearchBar() {
    const [query, setQuery] = useState('');
    const [results, setResults] = useState([]);

    useEffect(() => {
    // We clear results first for a cleaner experience
        setResults([]);

        if (query.length > 2) {
        console.log("Searching for:", query); // Check your browser console!
        fetch(`${process.env.NEXT_PUBLIC_API_URL}/search?query=${query}`)
            .then(res => {
            if (!res.ok) throw new Error('Network response was not ok');
            return res.json();
            })
            .then(data => {
            console.log("Search results:", data);
            setResults(data);
            })
            .catch(error => {
            console.error("Search fetch error:", error);
            setResults([]); // Clear results on error
            });
        }
    }, [query]);

    return (
        <div className="relative w-full">
            <div className="relative">
                <input 
                    type="text"
                    placeholder="Search for treasures..."
                    // Added text-gray-900 to ensure the text is visible!
                    className="w-full px-6 py-3 rounded-full bg-slate-100/50 border border-slate-200 text-gray-900 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-300 focus:bg-white transition-all text-sm"
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                />
                <div className="absolute right-4 top-3 text-gray-400">
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-5 h-5">
                        <path strokeLinecap="round" strokeLinejoin="round" d="m21 21-5.197-5.197m0 0A7.5 7.5 0 1 0 5.196 5.196a7.5 7.5 0 0 0 10.607 10.607Z" />
                    </svg>
                </div>
            </div>
            
            {results.length > 0 && (
                <div className="absolute top-full mt-4 w-full bg-white rounded-[2rem] shadow-2xl border border-slate-100 overflow-hidden z-50 p-2">
                    {results.map((product: any) => (
                        <Link 
                            key={product.slug} 
                            href={`/product/${product.slug}`}
                            onClick={() => setQuery('')}
                            className="flex items-center gap-4 p-3 hover:bg-slate-50 rounded-2xl transition-colors"
                        >
                            <div className="relative w-12 h-12 rounded-xl overflow-hidden bg-slate-100">
                                <Image src={product.image} alt={product.name} fill className="object-cover" />
                            </div>
                            <div>
                                <p className="font-bold text-gray-800 text-sm leading-none">{product.name}</p>
                                <p className="text-blue-500 text-xs font-bold mt-1">৳{product.price}</p>
                            </div>
                        </Link>
                    ))}
                </div>
            )}
        </div>
    );
}