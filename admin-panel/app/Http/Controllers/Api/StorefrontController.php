<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Category;
use App\Models\Product;
use App\Models\ProductVariant; // NEW: Added this import
use App\Models\Order;
use App\Models\OrderItem;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use App\Models\PromotionTile;
use App\Models\Banner;

class StorefrontController extends Controller
{

    public function getNavigation()
    {
        // Grab categories that have the switch turned ON, and eager load their children
        $navCategories = Category::where('is_in_nav', true)
            ->whereNull('parent_id') // Only get main categories for the top bar
            ->with('children')
            ->get();
            
        return response()->json($navCategories);
    }
    public function getHomepageData()
    {
        // 1. Fetch Dynamic Homepage Settings (Announcement, Review Toggle, Featured Cat ID)
        $settings = DB::table('homepage_settings')->first();

        // 2. Map Banners & Promo Tiles (Existing - Optional blocks)
        $banners = Banner::where('is_active', true)->orderBy('priority', 'asc')->get()->map(fn($b) => [
            'image' => asset('storage/' . $b->image_path),
            'link' => $b->button_link,
        ]);

        $promoTiles = PromotionTile::where('is_active', true)->orderBy('priority', 'asc')->take(9)->get()->map(fn($t) => [
            'title' => $t->title,
            'discount_text' => $t->discount_text,
            'image' => asset('storage/' . $t->image_path),
            'link' => $t->button_link,
        ]);

        // 3. Reusable Product Mapper (Updated to read relationships!)
        $mapProduct = function ($product) {
            // Safely extract the image_url from the related image models
            $extractedImages = [];
            if ($product->images) {
                foreach ($product->images as $img) {
                    $extractedImages[] = $img->image_url ?? null;
                }
            }

            return [
                'id' => $product->id,
                'name' => $product->name,
                'slug' => $product->slug,
                'price' => $product->base_price,
                // Send the raw filenames to Next.js so our regex can catch them!
                'images' => array_filter($extractedImages), 
                'total_sold' => $product->total_sales_count,
            ];
        };

        // 4. Automated Product Sections
        
        // ENTERPRISE LOGIC: Bestsellers (Added 'images' to eager loading)
        $bestSellers = Product::orderBy('total_sales_count', 'desc')
            ->with(['category', 'images'])->take(4)->get()->map($mapProduct);

        // ENTERPRISE LOGIC: New Arrivals (Added 'images' to eager loading)
        $newArrivals = Product::where('is_new_arrival', true)
            ->orderBy('created_at', 'desc')
            ->with(['category', 'images'])->take(4)->get()->map($mapProduct);
            
        // ENTERPRISE LOGIC: Featured Products (Added 'images' to eager loading)
        $featuredProducts = Product::where('is_featured', true)
            ->with(['category', 'images'])->take(4)->get()->map($mapProduct);

        // 5. Featured Category Data (The "Premium Bullet Journal" look)
        $featuredCategoryBlock = null;
        if ($settings && $settings->featured_category_id) {
            $featuredCat = Category::find($settings->featured_category_id);
            if ($featuredCat) {
                $featuredCategoryBlock = [
                    'name' => $featuredCat->name,
                    'slug' => $featuredCat->slug,
                    // Added 'images' to eager loading here too!
                    'products' => $featuredCat->products()->with('images')->take(4)->get()->map($mapProduct),
                ];
            }
        }

        // 6. Dynamic Categories (Existing)
        $categories = Category::take(9)->get()->map(fn($c) => [
            'name' => $c->name,
            'slug' => $c->slug,
            'image' => $c->image ? asset('storage/' . $c->image) : null,
        ]);

        return response()->json([
            'settings' => [
                'announcement' => [
                    'active' => $settings->is_announcement_active ?? false,
                    'text' => $settings->announcement_text ?? '',
                    'bg_color' => $settings->announcement_bg_color ?? '#1E3A8A', // Blue
                ],
                'reviews_active' => $settings->is_reviews_section_active ?? true,
            ],
            'banners' => $banners,
            'promo_tiles' => $promoTiles,
            'new_arrivals' => $newArrivals,
            'best_sellers' => $bestSellers,
            'featured_products' => $featuredProducts,
            'featured_category_block' => $featuredCategoryBlock,
            'categories' => $categories // Pulling from DB
        ]);
    }

    public function getProducts(Request $request)
    {
        // 1. Start a query for products
        $query = \App\Models\Product::query()->with('images'); // Load images too

        // (We will add the price/color/size filtering logic here in the next step!)

        // 2. Paginate to 20 products per page
        $products = $query->latest()->paginate(20);

        // 3. Grab categories for the left sidebar filter
        $categories = \App\Models\Category::withCount('products')->get();

        return response()->json([
            'products' => $products,
            'categories' => $categories,
        ]);
    }

    public function getProduct($slug)
    {
        // NEW: Eager load 'variants' so the frontend can display real colors/sizes
        $product = Product::where('slug', $slug)->with(['category', 'variants'])->firstOrFail();

        $images = is_string($product->images) ? json_decode($product->images, true) : $product->images;
        $imageUrls = collect($images)->map(fn($img) => asset('storage/' . $img))->toArray();

        return response()->json([
            'id' => $product->id,
            'name' => $product->name,
            'description' => $product->description,
            'price' => $product->base_price,
            
            // SMART STOCK LOGIC: Use variant total if variants exist, otherwise use base stock!
            'stock' => $product->variants->isNotEmpty() 
                ? $product->variants->sum('stock_quantity') 
                : $product->stock_quantity,
            'category' => $product->category->name ?? 'Uncategorized',
            'images' => $imageUrls,
            'variants' => $product->variants // NEW: Send the variants to Next.js!
        ]);
    }

    public function getCategoryProducts($slug)
    {
        $category = Category::where('slug', $slug)->firstOrFail();

        $products = Product::where('category_id', $category->id)
            ->get()
            ->map(function ($product) {
                $images = is_string($product->images) ? json_decode($product->images, true) : $product->images;
                $imageUrls = collect($images)->map(fn($img) => asset('storage/' . $img))->toArray();

                return [
                    'id' => $product->id,
                    'name' => $product->name,
                    'slug' => $product->slug,
                    'price' => $product->base_price,
                    'images' => $imageUrls,
                    'primary_image' => $imageUrls[0] ?? null,
                ];
            });

        return response()->json([
            'category_name' => $category->name,
            'products' => $products
        ]);
    }

    public function search(Request $request)
    {
        $query = $request->get('query');
        $lowercaseQuery = strtolower($query);

        $products = Product::where(DB::raw('LOWER(name)'), 'LIKE', "%{$lowercaseQuery}%")
            ->orWhere(DB::raw('LOWER(description)'), 'LIKE', "%{$lowercaseQuery}%")
            ->with('category')
            ->limit(5)
            ->get()
            ->map(function ($product) {
                $images = is_string($product->images) ? json_decode($product->images, true) : $product->images;
                return [
                    'name' => $product->name,
                    'slug' => $product->slug,
                    'price' => $product->base_price,
                    'image' => isset($images[0]) ? asset('storage/' . $images[0]) : 'https://placehold.co/100x100/f8fafc/60a5fa?text=Item', 
                ];
            });

        return response()->json($products);
    }

    public function checkout(Request $request)
    {
        $request->validate([
            'customer_name' => 'required|string|max:255',
            'phone_number' => 'required|string|max:20',
            'shipping_address' => 'required|string',
            'items' => 'required|array',
            'items.*.id' => 'required|exists:products,id', // Keep this! We need the Product ID.
            'items.*.variant_id' => 'nullable|integer|exists:product_variants,id',
            'items.*.quantity' => 'required|integer|min:1',
            
            // New Columns
            'coupon_code' => 'nullable|string',
            'discount_amount' => 'nullable|numeric',
            'shipping_fee' => 'required|numeric',
            'total_amount' => 'required|numeric',
        ]);

        \Illuminate\Support\Facades\DB::beginTransaction();

        try {
            // 1. Loop to strictly check stock before creating anything
            foreach ($request->items as $item) {
                if (!empty($item['variant_id'])) {
                    // It has a variant (e.g., A4 Folder - Blue)
                    $variant = \App\Models\ProductVariant::with('product')->findOrFail($item['variant_id']);
                    if ($variant->stock_quantity < $item['quantity']) {
                        throw new \Exception("Not enough stock for {$variant->product->name} ({$variant->color}).");
                    }
                } else {
                    // It's a standard product with NO variants (e.g., Portable File Bag)
                    $product = \App\Models\Product::findOrFail($item['id']);
                    if ($product->stock_quantity < $item['quantity']) {
                        throw new \Exception("Not enough stock for {$product->name}.");
                    }
                }
            }

            // 2. Create the Order with the frontend's final math & coupon data!
            $order = \App\Models\Order::create([
                'customer_name' => $request->customer_name,
                'phone_number' => $request->phone_number,
                'shipping_address' => $request->shipping_address,
                'total_amount' => $request->total_amount, // Uses the exact Total from Next.js!
                'discount_amount' => $request->discount_amount ?? 0,
                'coupon_code' => $request->coupon_code,
                'status' => 'pending', 
            ]);

            // 3. Loop to insert items and deduct stock
            foreach ($request->items as $item) {
                
                if (!empty($item['variant_id'])) {
                    // Handle Variant Logic
                    $variant = \App\Models\ProductVariant::findOrFail($item['variant_id']);
                    $itemPrice = $variant->product->base_price + $variant->price_adjustment;

                    \App\Models\OrderItem::create([
                        'order_id' => $order->id,
                        'product_id' => $variant->product_id,
                        'product_variant_id' => $variant->id,
                        'quantity' => $item['quantity'],
                        'price_at_purchase' => $itemPrice,
                    ]);

                    $variant->decrement('stock_quantity', $item['quantity']);
                    
                } else {
                    // Handle Standard Product Logic
                    $product = \App\Models\Product::findOrFail($item['id']);
                    $itemPrice = $product->base_price;

                    \App\Models\OrderItem::create([
                        'order_id' => $order->id,
                        'product_id' => $product->id,
                        'product_variant_id' => null, // Explicitly save null!
                        'quantity' => $item['quantity'],
                        'price_at_purchase' => $itemPrice,
                    ]);

                    $product->decrement('stock_quantity', $item['quantity']);
                }
            }

            \Illuminate\Support\Facades\DB::commit();

            return response()->json([
                'message' => 'Order placed successfully!',
                'order_id' => $order->id
            ], 201);

        } catch (\Exception $e) {
            \Illuminate\Support\Facades\DB::rollBack();
            return response()->json(['message' => 'Order failed', 'error' => $e->getMessage()], 500);
        }
    }

    public function applyCoupon(Request $request)
    {
        $request->validate([
            'code' => 'required|string',
            'subtotal' => 'required|numeric'
        ]);

        // 1. Hunt for the coupon
        $coupon = \App\Models\Coupon::where('code', $request->code)
            ->where('is_active', true)
            ->first();

        // 2. Reject if invalid
        if (!$coupon) {
            return response()->json(['message' => 'Invalid or expired coupon code.'], 404);
        }

        // --- NEW: Check Minimum Spend ---
        if ($coupon->minimum_spend && $request->subtotal < $coupon->minimum_spend) {
            return response()->json([
                'message' => 'Minimum spend of ৳' . number_format($coupon->minimum_spend, 2) . ' required.'
            ], 400);
        }

        // 3. Send the RULES to Next.js so the frontend can do real-time math!
        return response()->json([
            'message' => 'Coupon applied successfully!',
            'code' => $coupon->code,
            'type' => $coupon->type,
            'value' => $coupon->value,
            'is_free_shipping' => (bool) $coupon->is_free_shipping,
            'minimum_spend' => $coupon->minimum_spend
        ]);
    }
}
