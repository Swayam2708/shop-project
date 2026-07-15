"use client";

import React, { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import Navbar from "@/components/Navbar";
import ProductCard from "@/components/ProductCard";
import QuickViewModal from "@/components/QuickViewModal";
import { products as initialProducts, Product } from "@/data/products";
import { motion } from "framer-motion";
import { ArrowLeft, Heart, ShoppingBag, MessageCircle, ShieldCheck, Truck, RefreshCw, Star, Info } from "lucide-react";
import Link from "next/link";

export default function ProductDetailPage() {
  const params = useParams();
  const router = useRouter();
  const id = params?.id ? (params.id as string) : "";

  // Core data states
  const [dbProducts, setDbProducts] = useState<Product[]>(initialProducts);
  const [customText, setCustomText] = useState<Record<string, string>>({});
  const [customizedImages, setCustomizedImages] = useState<Record<string, string>>({});
  const [wishlist, setWishlist] = useState<Product[]>([]);
  const [cart, setCart] = useState<{ product: Product; quantity: number }[]>([]);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [isQuickViewOpen, setIsQuickViewOpen] = useState(false);

  // Selected details page product (with overrides)
  const [product, setProduct] = useState<Product | null>(null);

  // Gallery slider state
  const [activeImage, setActiveImage] = useState<string>("");
  const [gallery, setGallery] = useState<string[]>([]);

  // Recently Viewed & Similar Products states
  const [recentlyViewed, setRecentlyViewed] = useState<Product[]>([]);
  const [similarProducts, setSimilarProducts] = useState<Product[]>([]);

  // Product customization option states
  const [selectedRingSize, setSelectedRingSize] = useState<string>("12");
  const [selectedMetal, setSelectedMetal] = useState<string>("champagne");
  const [selectedPurity, setSelectedPurity] = useState<string>("18k");
  const [selectedStone, setSelectedStone] = useState<string>("none");
  const [basePrice, setBasePrice] = useState<number>(0);
  const [livePrice, setLivePrice] = useState<number>(0);

  // Load wishlist, cart, customizations, and products
  useEffect(() => {
    // 1. Fetch wishlist & cart from localStorage
    if (typeof window !== "undefined") {
      const savedWish = localStorage.getItem("oj_wishlist");
      const savedCart = localStorage.getItem("oj_cart");
      if (savedWish) {
        try { setWishlist(JSON.parse(savedWish)); } catch (e) {}
      }
      if (savedCart) {
        try { setCart(JSON.parse(savedCart)); } catch (e) {}
      }
    }

    // 2. Fetch products
    fetch("/api/products", { cache: "no-store" })
      .then((res) => res.json())
      .then((data) => {
        if (data.success && data.products) {
          setDbProducts(data.products);
          
          // Find matching product
          const found = data.products.find((p: Product) => p.id === id);
          if (found) {
            setProduct(found);
            setBasePrice(found.price);
            setLivePrice(found.price);
            setActiveImage(found.image);
            
            // Build visual gallery
            setGallery([
              found.image,
              "https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?q=80&w=800&auto=format&fit=crop", // Close-up detail
              "https://images.unsplash.com/photo-1601121141461-9d6647bca1ed?q=80&w=800&auto=format&fit=crop", // Elegant gold layout
              "https://images.unsplash.com/photo-1543294001-f7cbfe92237e?q=80&w=800&auto=format&fit=crop"  // Presentation case
            ]);

            // Save to recently viewed lists
            saveToRecentlyViewed(found, data.products);

            // Fetch similar products in same subcategory (exclude current)
            const matched = data.products.filter((p: Product) => p.subCategory === found.subCategory && p.id !== found.id);
            setSimilarProducts(matched.slice(0, 4));
          }
        }
      })
      .catch((err) => console.error("Product details failed to load products:", err));

    // 3. Fetch customizations
    fetch("/api/custom-content", { cache: "no-store" })
      .then((res) => res.json())
      .then((data) => {
        if (data.success && data.content) {
          const loadedCustoms: Record<string, string> = {};
          const loadedTexts: Record<string, string> = {};
          Object.entries(data.content).forEach(([k, v]) => {
            if (k.startsWith("oj_custom_img_")) {
              loadedCustoms[k.replace("oj_custom_img_", "")] = v as string;
            } else if (k.startsWith("oj_custom_txt_")) {
              loadedTexts[k.replace("oj_custom_txt_", "")] = v as string;
            } else {
              loadedTexts[k] = v as string;
            }
          });
          setCustomizedImages(loadedCustoms);
          setCustomText(loadedTexts);
        }
      })
      .catch((err) => console.error("Product details failed to load customized overrides:", err));
  }, [id]);

  // Sync wishlist & cart changes
  useEffect(() => {
    if (typeof window !== "undefined") {
      localStorage.setItem("oj_wishlist", JSON.stringify(wishlist));
    }
  }, [wishlist]);

  useEffect(() => {
    if (typeof window !== "undefined") {
      localStorage.setItem("oj_cart", JSON.stringify(cart));
    }
  }, [cart]);

  // Calculate live option pricing multipliers
  useEffect(() => {
    if (!product) return;

    let computed = basePrice;

    // Metal modifiers
    if (selectedMetal === "platinum") computed += 25000;
    if (selectedMetal === "rose") computed += 2000;

    // Purity modifiers
    if (selectedPurity === "22k") computed += 8500;
    if (selectedPurity === "24k") computed += 15000;

    // Stone modifiers
    if (selectedStone === "vvs") computed += 45000;
    if (selectedStone === "ruby") computed += 12000;
    if (selectedStone === "emerald") computed += 15000;

    setLivePrice(computed);
  }, [selectedMetal, selectedPurity, selectedStone, basePrice, product]);

  // Logic to save items in Recently Viewed list
  const saveToRecentlyViewed = (current: Product, allProds: Product[]) => {
    if (typeof window === "undefined") return;

    const savedIds = localStorage.getItem("oj_recently_viewed");
    let currentIds: string[] = savedIds ? JSON.parse(savedIds) : [];

    // Filter out current ID to move it to the front
    currentIds = currentIds.filter((x) => x !== current.id);
    currentIds.unshift(current.id);

    // Limit to top 5
    const trimmed = currentIds.slice(0, 5);
    localStorage.setItem("oj_recently_viewed", JSON.stringify(trimmed));

    // Hydrate full products list for rendering
    const fullProds = trimmed
      .map((tid) => allProds.find((p) => p.id === tid))
      .filter((p): p is Product => p !== undefined && p.id !== current.id); // exclude current detail item
    setRecentlyViewed(fullProds);
  };

  // Toggle wishlist
  const handleWishlistToggle = (item: Product) => {
    if (wishlist.some((w) => w.id === item.id)) {
      setWishlist(wishlist.filter((w) => w.id !== item.id));
    } else {
      setWishlist([...wishlist, item]);
    }
  };

  // Add to cart
  const handleAddToCart = (item: Product) => {
    const existing = cart.find((c) => c.product.id === item.id);
    if (existing) {
      setCart(
        cart.map((c) =>
          c.product.id === item.id
            ? { ...c, quantity: c.quantity + 1 }
            : c
        )
      );
    } else {
      setCart([...cart, { product: item, quantity: 1 }]);
    }
  };

  const handleRemoveFromCart = (tid: string) => {
    setCart(cart.filter((c) => c.product.id !== tid));
  };

  const handleWhatsAppInquiry = (item: Product, qty: number = 1) => {
    const name = customText[`prod_name_${item.id}`] || item.name;
    const finalPrice = livePrice.toLocaleString();
    const msg = `Hello,\nI am interested in ordering this customized jewellery design:\n\n*Product:* ${name}\n*ID:* ${item.id}\n*Metal Type:* ${selectedMetal.toUpperCase()}\n*Gold Purity:* ${selectedPurity}\n*Stone Accents:* ${selectedStone.toUpperCase()}\n*Ring Size:* ${selectedRingSize}\n*Live Price Quote:* ₹${finalPrice}\n\nPlease confirm availability. Thank you!`;
    window.open(`https://wa.me/91${customText["whats_app_number"] || "9936488845"}?text=${encodeURIComponent(msg)}`, "_blank");
  };

  const handleOpenQuickView = (item: Product) => {
    setSelectedProduct(item);
    setIsQuickViewOpen(true);
  };

  if (!product) {
    return (
      <div className="min-h-screen bg-[#0d0405] text-neutral-100 flex flex-col justify-between items-center py-24">
        <div className="animate-pulse flex flex-col items-center gap-4">
          <div className="w-12 h-12 rounded-full border-2 border-gold border-t-transparent animate-spin" />
          <p className="font-serif text-lg text-gold tracking-widest">LOADING OJ DESIGNS...</p>
        </div>
      </div>
    );
  }

  // Hydrate fields with database customText overrides
  const displayName = customText[`prod_name_${product.id}`] || product.name;
  const displaySubCat = customText[`prod_subcat_${product.id}`] || product.subCategory;
  const displayMaterials = customText[`prod_mat_${product.id}`] || product.materials;
  const displayDesc = customText[`prod_desc_${product.id}`] || product.description;

  return (
    <div className="min-h-screen bg-[#0d0405] text-neutral-100 flex flex-col justify-between selection:bg-[#dfba73] selection:text-white font-sans">
      
      {/* Sticky Navbar */}
      <Navbar
        wishlist={wishlist}
        removeFromWishlist={(tid) => setWishlist(wishlist.filter((w) => w.id !== tid))}
        cart={cart}
        removeFromCart={handleRemoveFromCart}
        onOpenQuickView={handleOpenQuickView}
        onOpenInquiry={handleWhatsAppInquiry}
        customText={customText}
        activeCategory={product.subCategory.toLowerCase()}
      />

      {/* Main product details workspace */}
      <main className="flex-grow pt-[160px] pb-24 px-4 sm:px-6 md:px-12 max-w-7xl mx-auto w-full z-10 relative">
        
        {/* Navigation Breadcrumbs */}
        <div className="flex items-center justify-between mb-8 text-[11px] font-sans tracking-widest uppercase text-neutral-400">
          <div className="flex items-center gap-2">
            <Link href="/" className="hover:text-gold transition-colors">Home</Link>
            <span>→</span>
            <Link href={`/category/${product.subCategory.toLowerCase()}`} className="hover:text-gold transition-colors">{product.subCategory}</Link>
            <span>→</span>
            <span className="text-gold font-bold">{displayName}</span>
          </div>
          <Link href="/" className="flex items-center gap-1.5 hover:text-gold transition-colors text-gold">
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Back to Home</span>
          </Link>
        </div>

        {/* Dynamic Detail Workspace Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 mb-20">
          
          {/* Left Column: Premium Gallery with Thumbnails */}
          <div className="space-y-4">
            <div className="relative aspect-square bg-neutral-950 border border-[#dfba73]/15 overflow-hidden rounded-sm">
              <img
                src={activeImage || product.image}
                alt={displayName}
                className="w-full h-full object-cover transition-transform duration-1000 hover:scale-105"
              />
              <div className="absolute top-4 left-4 px-2 py-0.5 bg-[#dfba73] text-neutral-950 text-[9px] font-extrabold tracking-wider uppercase rounded-sm">
                BIS Hallmarked 22k/18k
              </div>
            </div>

            {/* Thumbnail list */}
            <div className="grid grid-cols-4 gap-3">
              {gallery.map((imgUrl, index) => (
                <button
                  key={index}
                  onClick={() => setActiveImage(imgUrl)}
                  className={`aspect-square overflow-hidden border bg-neutral-950 rounded-sm transition-all ${
                    activeImage === imgUrl ? "border-[#dfba73] ring-1 ring-[#dfba73]" : "border-neutral-800 hover:border-[#dfba73]/45"
                  }`}
                >
                  <img src={imgUrl} alt="Thumbnail view" className="w-full h-full object-cover" />
                </button>
              ))}
            </div>
          </div>

          {/* Right Column: Customization parameters, availability, and pricing */}
          <div className="space-y-8">
            <div>
              <span className="text-[10px] tracking-[0.25em] text-[#dfba73] font-sans font-bold uppercase block mb-1">
                OJ Custom Couture • {displaySubCat}
              </span>
              <h1 className="font-serif text-3xl md:text-4xl font-light text-white tracking-wide leading-tight">
                {displayName}
              </h1>
              
              <div className="flex items-center gap-4 mt-3 pb-4 border-b border-[#dfba73]/10">
                {/* Dynamic Calculated Live Price */}
                <span className="font-sans text-2xl font-bold text-white">
                  ₹{livePrice.toLocaleString()}
                </span>
                
                <div className="flex items-center gap-1 bg-[#dfba73]/15 px-2.5 py-0.5 border border-[#dfba73]/20 rounded-sm text-[#dfba73]">
                  <Star className="w-3.5 h-3.5 fill-current" />
                  <span className="font-sans text-xs font-semibold">{product.rating} Rating</span>
                </div>

                <span className="text-[10px] text-green-400 font-sans tracking-wider font-semibold uppercase">
                  ✓ Available in Stock
                </span>
              </div>
            </div>

            {/* Product Meta specs details list */}
            <div className="grid grid-cols-2 gap-4 font-sans text-[11px] text-neutral-300 border-b border-[#dfba73]/10 pb-4">
              <div>
                <span className="text-neutral-500 block uppercase tracking-wider">Product Code:</span>
                <span className="font-mono text-xs font-semibold text-white">{product.id.toUpperCase()}</span>
              </div>
              <div>
                <span className="text-neutral-500 block uppercase tracking-wider">Purity Rating:</span>
                <span className="text-xs font-semibold text-white">{displayMaterials}</span>
              </div>
              <div>
                <span className="text-neutral-500 block uppercase tracking-wider">Weight Class:</span>
                <span className="text-xs font-semibold text-white">
                  {product.details.find((d) => d.includes("Weight")) || "Standard weight (12-25g)"}
                </span>
              </div>
              <div>
                <span className="text-neutral-500 block uppercase tracking-wider">Certifications:</span>
                <span className="text-xs font-semibold text-white">BIS Hallmark 916 approved</span>
              </div>
            </div>

            {/* Description */}
            <p className="font-sans text-xs md:text-sm text-neutral-400 leading-relaxed font-light">
              {displayDesc}
            </p>

            {/* Premium Option Selector widgets */}
            <div className="space-y-6 bg-neutral-950/30 border border-[#dfba73]/10 p-6 rounded-sm">
              <h3 className="font-serif text-sm text-white tracking-wider border-b border-[#dfba73]/10 pb-2">
                Custom Options
              </h3>

              {/* Ring Size Option - Only for Rings subcategory */}
              {(product.subCategory.toLowerCase() === "rings" || slug === "rings") && (
                <div className="space-y-2">
                  <label className="block text-[10px] uppercase tracking-widest text-[#dfba73] font-bold">
                    Select Ring Size (Indian Standard): {selectedRingSize}
                  </label>
                  <div className="flex flex-wrap gap-2">
                    {["10", "12", "14", "16", "18", "20"].map((size) => (
                      <button
                        key={size}
                        onClick={() => setSelectedRingSize(size)}
                        className={`w-9 h-9 flex items-center justify-center text-xs font-semibold rounded-none border transition-all ${
                          selectedRingSize === size
                            ? "bg-[#dfba73] border-[#dfba73] text-neutral-950"
                            : "border-neutral-800 text-neutral-400 hover:border-[#dfba73]/30 hover:text-white"
                        }`}
                      >
                        {size}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Metal Customizer */}
              <div className="space-y-2">
                <label className="block text-[10px] uppercase tracking-widest text-[#dfba73] font-bold">
                  Metal Type: {selectedMetal.toUpperCase()}
                </label>
                <div className="flex gap-2">
                  {[
                    { id: "champagne", label: "Champagne Gold" },
                    { id: "rose", label: "Rose Gold" },
                    { id: "platinum", label: "Platinum Solid" },
                  ].map((m) => (
                    <button
                      key={m.id}
                      onClick={() => setSelectedMetal(m.id)}
                      className={`text-xs py-1.5 px-3 border transition-all ${
                        selectedMetal === m.id
                          ? "bg-[#dfba73]/15 border-[#dfba73] text-white font-semibold"
                          : "border-neutral-800 text-neutral-450 hover:border-[#dfba73]/30 hover:text-white"
                      }`}
                    >
                      {m.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Gold Purity Customizer */}
              <div className="space-y-2">
                <label className="block text-[10px] uppercase tracking-widest text-[#dfba73] font-bold">
                  Gold Purity Level: {selectedPurity}
                </label>
                <div className="flex gap-2">
                  {[
                    { id: "18k", label: "18k Gold" },
                    { id: "22k", label: "22k Gold (+₹8,500)" },
                    { id: "24k", label: "24k Pure (+₹15,000)" },
                  ].map((p) => (
                    <button
                      key={p.id}
                      onClick={() => setSelectedPurity(p.id)}
                      className={`text-xs py-1.5 px-3 border transition-all ${
                        selectedPurity === p.id
                          ? "bg-[#dfba73]/15 border-[#dfba73] text-white font-semibold"
                          : "border-neutral-800 text-neutral-450 hover:border-[#dfba73]/30 hover:text-white"
                      }`}
                    >
                      {p.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Stones/Accents options */}
              <div className="space-y-2">
                <label className="block text-[10px] uppercase tracking-widest text-[#dfba73] font-bold">
                  Stone Accents: {selectedStone.toUpperCase()}
                </label>
                <div className="flex gap-2 flex-wrap">
                  {[
                    { id: "none", label: "Plain Gold" },
                    { id: "vvs", label: "VVS Diamonds (+₹45,000)" },
                    { id: "ruby", label: "Ruby (+₹12,000)" },
                    { id: "emerald", label: "Emerald (+₹15,000)" },
                  ].map((s) => (
                    <button
                      key={s.id}
                      onClick={() => setSelectedStone(s.id)}
                      className={`text-xs py-1.5 px-3 border transition-all ${
                        selectedStone === s.id
                          ? "bg-[#dfba73]/15 border-[#dfba73] text-white font-semibold"
                          : "border-neutral-800 text-neutral-450 hover:border-[#dfba73]/30 hover:text-white"
                      }`}
                    >
                      {s.label}
                    </button>
                  ))}
                </div>
              </div>

            </div>

            {/* Action buttons */}
            <div className="flex flex-col sm:flex-row gap-4">
              <button
                onClick={() => handleAddToCart(product)}
                className="flex-1 py-4 bg-neutral-900 hover:bg-neutral-950 text-[#dfba73] border border-[#dfba73]/30 hover:border-[#dfba73] font-sans text-xs font-bold tracking-widest uppercase transition-colors flex items-center justify-center gap-2"
              >
                <ShoppingBag className="w-4 h-4" />
                <span>Add to Shopping Bag</span>
              </button>
              
              <button
                onClick={() => handleWhatsAppInquiry(product)}
                className="flex-1 py-4 bg-[#dfba73] hover:bg-[#c5a059] text-neutral-950 font-sans text-xs font-bold tracking-widest uppercase transition-colors flex items-center justify-center gap-2"
              >
                <MessageCircle className="w-4 h-4 fill-current" />
                <span>Custom Order Inquiry</span>
              </button>

              <button
                onClick={() => handleWishlistToggle(product)}
                className={`p-4 border transition-colors flex items-center justify-center ${
                  wishlist.some((w) => w.id === product.id)
                    ? "bg-[#dfba73]/10 border-[#dfba73] text-[#dfba73]"
                    : "border-neutral-800 text-neutral-400 hover:border-[#dfba73]/40 hover:text-white"
                }`}
                title="Save to Wishlist"
              >
                <Heart className="w-5 h-5 fill-current" />
              </button>
            </div>

            {/* Trust Assurances panel */}
            <div className="grid grid-cols-3 gap-4 pt-6 border-t border-[#dfba73]/10 font-sans text-[10px] text-neutral-400">
              <div className="flex flex-col items-center text-center gap-1">
                <ShieldCheck className="w-5 h-5 text-[#dfba73]" />
                <span className="font-bold text-white uppercase tracking-wider">BIS Hallmarked</span>
                <span>Government certified purity</span>
              </div>
              <div className="flex flex-col items-center text-center gap-1">
                <Truck className="w-5 h-5 text-[#dfba73]" />
                <span className="font-bold text-white uppercase tracking-wider">Insured Delivery</span>
                <span>Safe transport across India</span>
              </div>
              <div className="flex flex-col items-center text-center gap-1">
                <RefreshCw className="w-5 h-5 text-[#dfba73]" />
                <span className="font-bold text-white uppercase tracking-wider">Easy Exchange</span>
                <span>Lifetime exchange value support</span>
              </div>
            </div>

          </div>

        </div>

        {/* Similar Designs / Related designs */}
        {similarProducts.length > 0 && (
          <div className="border-t border-[#dfba73]/15 pt-16 mb-20">
            <div className="mb-8">
              <span className="text-[10px] tracking-[0.25em] text-[#dfba73] font-bold uppercase block mb-1">
                Recommended For You
              </span>
              <h2 className="font-serif text-2xl md:text-3xl font-light text-white tracking-wide">
                Similar Designs
              </h2>
            </div>
            
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
              {similarProducts.map((p) => (
                <ProductCard
                  key={p.id}
                  product={p}
                  isWishlisted={wishlist.some((w) => w.id === p.id)}
                  onWishlistToggle={handleWishlistToggle}
                  onQuickView={handleOpenQuickView}
                  onAddToCart={handleAddToCart}
                  isDesignMode={false}
                  customText={customText}
                />
              ))}
            </div>
          </div>
        )}

        {/* Recently Viewed Products */}
        {recentlyViewed.length > 0 && (
          <div className="border-t border-[#dfba73]/15 pt-16">
            <div className="mb-8">
              <span className="text-[10px] tracking-[0.25em] text-[#dfba73] font-bold uppercase block mb-1">
                Browse History
              </span>
              <h2 className="font-serif text-2xl md:text-3xl font-light text-white tracking-wide">
                Recently Viewed
              </h2>
            </div>
            
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
              {recentlyViewed.map((p) => (
                <ProductCard
                  key={p.id}
                  product={p}
                  isWishlisted={wishlist.some((w) => w.id === p.id)}
                  onWishlistToggle={handleWishlistToggle}
                  onQuickView={handleOpenQuickView}
                  onAddToCart={handleAddToCart}
                  isDesignMode={false}
                  customText={customText}
                />
              ))}
            </div>
          </div>
        )}

      </main>

      {/* Footer */}
      <footer className="bg-neutral-950 text-neutral-100 border-t border-[#dfba73]/15 py-14 md:py-24 px-4 sm:px-6 md:px-12 z-10 relative">
        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-8">
          <div>
            <h4 className="font-serif text-lg text-[#dfba73] mb-6 font-medium">Omar Jewellers</h4>
            <p className="font-sans text-xs text-neutral-400 leading-relaxed">
              Timeless metalsmithing since generations. Serving authentic BIS hallmarked gold and fine silver from Shahabad Hardoi.
            </p>
          </div>
          <div>
            <h4 className="font-serif text-lg text-[#dfba73] mb-6 font-medium">Boutique Coordinates</h4>
            <p className="font-sans text-xs text-neutral-400 leading-relaxed">
              Chowk, Shahabad, Hardoi,<br />Uttar Pradesh, India
            </p>
          </div>
          <div>
            <h4 className="font-serif text-lg text-[#dfba73] mb-6 font-medium">Store Timing</h4>
            <p className="font-sans text-xs text-neutral-400 leading-relaxed">
              Tuesday - Sunday<br />10:30 AM - 08:30 PM (Monday Closed)
            </p>
          </div>
          <div>
            <h4 className="font-serif text-lg text-[#dfba73] mb-6 font-medium">Support Hotline</h4>
            <p className="font-sans text-xs text-neutral-400 leading-relaxed">
              For any design customization or order helpline:<br />
              <span className="text-gold font-bold font-mono">9936488845</span>
            </p>
          </div>
        </div>
        <div className="max-w-7xl mx-auto border-t border-neutral-800 mt-16 pt-8 flex flex-col sm:flex-row items-center justify-between font-sans text-[11px] text-neutral-500 gap-4">
          <div>
            <p>© 2026 Omar Jewellers OJ. All Rights Reserved.</p>
            <p className="mt-1 text-neutral-500">
              Developed by <span className="text-[#dfba73] font-semibold">Swayam Omar (Web Developer)</span>
            </p>
            <p className="mt-0.5 text-neutral-500">
              For errors or issues with the site, contact: <span className="font-mono font-bold text-[#dfba73]">9580125697</span>
            </p>
          </div>
          <div className="flex gap-6 mt-4 sm:mt-0">
            <span className="hover:text-gold transition-colors cursor-pointer">Privacy Policy</span>
            <span className="hover:text-gold transition-colors cursor-pointer">Terms of Service</span>
            <span className="hover:text-[#dfba73] transition-colors cursor-pointer font-bold">
              <a href="/admin">Backside Console</a>
            </span>
          </div>
        </div>
      </footer>

      {/* Quick View Modal */}
      <QuickViewModal
        product={selectedProduct}
        isOpen={isQuickViewOpen}
        onClose={() => setIsQuickViewOpen(false)}
        isWishlisted={selectedProduct ? wishlist.some((item) => item.id === selectedProduct.id) : false}
        onWishlistToggle={handleWishlistToggle}
        onAddToCart={handleAddToCart}
        onInquiry={handleWhatsAppInquiry}
        isDesignMode={false}
        customText={customText}
      />

    </div>
  );
}
