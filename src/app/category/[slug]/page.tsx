"use client";

import React, { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import Navbar from "@/components/Navbar";
import ProductCard from "@/components/ProductCard";
import QuickViewModal from "@/components/QuickViewModal";
import { products as initialProducts, Product } from "@/data/products";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowLeft, SlidersHorizontal, Check, X, Edit, Lock, RefreshCw, Star } from "lucide-react";
import Link from "next/link";

// Secure SHA-256 Client-Side Hashing Utility
async function hashPasscode(input: string): Promise<string> {
  if (typeof window === "undefined" || !window.crypto || !window.crypto.subtle) {
    return input;
  }
  const encoder = new TextEncoder();
  const data = encoder.encode(input);
  const hashBuffer = await window.crypto.subtle.digest("SHA-256", data);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  const hashHex = hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
  return hashHex;
}

export default function CategoryPage() {
  const params = useParams();
  const slug = params?.slug ? (params.slug as string).toLowerCase() : "";

  // Core lists & custom edits states
  const [dbProducts, setDbProducts] = useState<Product[]>(initialProducts);
  const [customText, setCustomText] = useState<Record<string, string>>({});
  const [customizedImages, setCustomizedImages] = useState<Record<string, string>>({});
  const [wishlist, setWishlist] = useState<Product[]>([]);
  const [cart, setCart] = useState<{ product: Product; quantity: number }[]>([]);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [isQuickViewOpen, setIsQuickViewOpen] = useState(false);

  // Design studio state variables
  const [isDesignMode, setIsDesignMode] = useState(false);
  const [isStudioOpen, setIsStudioOpen] = useState(false);

  // Filter criteria states
  const [maxPrice, setMaxPrice] = useState<number>(300000);
  const [selectedPurity, setSelectedPurity] = useState<string>("all");
  const [selectedWeight, setSelectedWeight] = useState<string>("all");
  const [selectedMetal, setSelectedMetal] = useState<string>("all");
  const [selectedTag, setSelectedTag] = useState<string>("all");

  // Load wishlist, cart, and customization overrides
  useEffect(() => {
    // Load local wishlist & cart
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

    // Fetch database products
    fetch("/api/products", { cache: "no-store" })
      .then((res) => res.json())
      .then((data) => {
        if (data.success && data.products) {
          setDbProducts(data.products);
        }
      })
      .catch((err) => console.error("Category page failed to load products:", err));

    // Fetch customizations
    fetchCustomContent();
  }, []);

  const fetchCustomContent = () => {
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
      .catch((err) => console.error("Category page failed to load custom overrides:", err));
  };

  // Save wishlist and cart updates locally
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

  // Design studio authorization functions
  const handleToggleDesignMode = async () => {
    if (isDesignMode) {
      setIsDesignMode(false);
      return;
    }

    const enteredCode = window.prompt("Enter Owner Security Passcode to Edit Website:");
    if (enteredCode === null) return;

    const enteredHash = await hashPasscode(enteredCode);
    const defaultHash = await hashPasscode("OJ2026");
    const correctHash = customText["oj_admin_passcode"] || defaultHash;

    if (enteredHash === correctHash) {
      setIsDesignMode(true);
    } else {
      alert("Access Denied: Incorrect Security Passcode.");
    }
  };

  // Save text changes to database
  const handleTextChange = async (tid: string, newText: string) => {
    setCustomText((prev) => ({ ...prev, [tid]: newText }));
    try {
      await fetch("/api/custom-content", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ key: `oj_custom_txt_${tid}`, value: newText }),
      });
    } catch (err) {
      console.error("Category page failed to save text edit:", err);
    }
  };

  // Set custom image and save to database
  const handleUploadImage = async (tid: string, base64: string) => {
    setCustomizedImages((prev) => ({ ...prev, [tid]: base64 }));
    try {
      await fetch("/api/custom-content", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ key: `oj_custom_img_${tid}`, value: base64 }),
      });
    } catch (err) {
      console.error("Category page failed to save image upload:", err);
    }
  };

  const handleResetAllEdits = async () => {
    if (window.confirm("Are you sure you want to delete all text edits and custom photos, and restore initial defaults?")) {
      try {
        await fetch("/api/custom-content", { method: "DELETE" });
      } catch (err) {
        console.error("Failed to delete settings on server:", err);
      }
      setCustomizedImages({});
      setCustomText({});
      setIsDesignMode(false);
    }
  };

  // Map products to include database customizations
  const products = dbProducts.map((p) => ({
    ...p,
    image: customizedImages[p.id] || p.image,
  }));

  // Map category slug to display title
  const getCategoryTitle = () => {
    switch (slug) {
      case "gold-jewellery":
        return "Gold Jewellery Collection";
      case "silver-jewellery":
        return "Silver Jewellery Collection";
      case "rings":
        return "Exquisite Rings Collection";
      case "necklaces":
        return "Royal Necklaces & Chokers";
      case "earrings":
        return "Designer Earrings & Drops";
      case "bracelets":
        return "Artisan Bracelets & Cuffs";
      case "bangles":
        return "Heritage Bangles";
      case "chains":
        return "Classic Chains & Collars";
      case "pendants":
        return "Designer Pendants";
      default:
        return slug ? `${slug.charAt(0).toUpperCase() + slug.slice(1)} Collection` : "Jewellery Catalog";
    }
  };

  // Filter products dynamically
  const filteredProducts = products.filter((p) => {
    // 1. Category Filter
    if (slug === "gold-jewellery") {
      if (p.category === "silver") return false;
    } else if (slug === "silver-jewellery") {
      if (p.category !== "silver") return false;
    } else if (slug !== "") {
      const pSub = p.subCategory.toLowerCase();
      // Match singular/plural variances
      const matchSub = pSub === slug || 
                       pSub.replace("s", "") === slug.replace("s", "") ||
                       pSub.includes(slug) ||
                       slug.includes(pSub);
      if (!matchSub) return false;
    }

    // 2. Metal Type Filter
    if (selectedMetal === "gold" && p.category === "silver") return false;
    if (selectedMetal === "silver" && p.category !== "silver") return false;

    // 3. Price Filter (₹ conversion fallback)
    const customPrice = customText[`prod_price_${p.id}`];
    let priceVal = p.price;
    if (customPrice) {
      const cleanStr = customPrice.replace(/[^0-9]/g, "");
      if (cleanStr) priceVal = parseInt(cleanStr);
    }
    if (priceVal > maxPrice) return false;

    // 4. Gold Purity Filter (24k, 22k, 18k)
    if (selectedPurity !== "all") {
      const purityStr = (customText[`prod_mat_${p.id}`] || p.materials || "").toLowerCase();
      if (!purityStr.includes(selectedPurity)) return false;
    }

    // 5. Weight Filter (under 5g, 5-15g, above 15g)
    if (selectedWeight !== "all") {
      const detailsStr = (p.details || []).join(" ").toLowerCase();
      const weightMatch = detailsStr.match(/(\d+(\.\d+)?)\s*g/);
      if (weightMatch) {
        const weightVal = parseFloat(weightMatch[1]);
        if (selectedWeight === "light" && weightVal >= 5) return false;
        if (selectedWeight === "medium" && (weightVal < 5 || weightVal > 15)) return false;
        if (selectedWeight === "heavy" && weightVal <= 15) return false;
      } else {
        return false;
      }
    }

    // 6. Badges / Tag Filter (new-arrivals, best-sellers)
    if (selectedTag === "new" && p.category !== "new-arrivals") return false;
    if (selectedTag === "best" && p.category !== "best-sellers") return false;

    return true;
  });

  // Wishlist handler
  const handleWishlistToggle = (product: Product) => {
    if (wishlist.some((item) => item.id === product.id)) {
      setWishlist(wishlist.filter((item) => item.id !== product.id));
    } else {
      setWishlist([...wishlist, product]);
    }
  };

  // Add to cart
  const handleAddToCart = (product: Product) => {
    const existing = cart.find((item) => item.product.id === product.id);
    if (existing) {
      setCart(
        cart.map((item) =>
          item.product.id === product.id
            ? { ...item, quantity: item.quantity + 1 }
            : item
        )
      );
    } else {
      setCart([...cart, { product, quantity: 1 }]);
    }
  };

  const handleRemoveFromCart = (id: string) => {
    setCart(cart.filter((item) => item.product.id !== id));
  };

  const handleOpenQuickView = (product: Product) => {
    setSelectedProduct(product);
    setIsQuickViewOpen(true);
  };

  const handleWhatsAppInquiry = (product: Product, qty: number = 1) => {
    const name = customText[`prod_name_${product.id}`] || product.name;
    const priceStr = customText[`prod_price_${product.id}`] || `₹${product.price.toLocaleString()}`;
    const msg = `Hello,\nI am interested in inquiring about this jewellery item:\n\n*Product:* ${name}\n*ID:* ${product.id}\n*Quantity:* ${qty}\n*Price:* ${priceStr}\n\nPlease share design details. Thank you!`;
    window.open(`https://wa.me/91${customText["whats_app_number"] || "9936488845"}?text=${encodeURIComponent(msg)}`, "_blank");
  };

  return (
    <div className="min-h-screen bg-[#0d0405] text-neutral-100 flex flex-col justify-between selection:bg-[#dfba73] selection:text-white font-sans">
      
      {/* Sticky Navbar */}
      <Navbar
        wishlist={wishlist}
        removeFromWishlist={(id) => setWishlist(wishlist.filter((item) => item.id !== id))}
        cart={cart}
        removeFromCart={handleRemoveFromCart}
        onOpenQuickView={handleOpenQuickView}
        onOpenInquiry={handleWhatsAppInquiry}
        customText={customText}
        activeCategory={slug}
      />

      {/* Main Grid content */}
      <main className="flex-grow pt-[160px] pb-24 px-4 sm:px-6 md:px-12 max-w-7xl mx-auto w-full z-10 relative">
        
        {/* Breadcrumbs & Navigation Back Link */}
        <div className="flex items-center justify-between mb-8 text-[11px] font-sans tracking-widest uppercase text-neutral-400">
          <div className="flex items-center gap-2">
            <Link href="/" className="hover:text-gold transition-colors">Home</Link>
            <span>→</span>
            <span className="text-gold font-bold">{getCategoryTitle()}</span>
          </div>
          <Link href="/" className="flex items-center gap-1.5 hover:text-gold transition-colors text-gold">
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Back to Home</span>
          </Link>
        </div>

        {/* Title */}
        <div className="mb-12 border-b border-[#dfba73]/15 pb-6">
          <span className="font-sans text-[10px] text-[#dfba73] tracking-[0.3em] uppercase font-bold block mb-2">
            OJ Luxury Registry
          </span>
          <h1 className="font-serif text-3xl md:text-5xl font-light text-white tracking-wide">
            {getCategoryTitle()}
          </h1>
          <p className="font-sans text-xs md:text-sm text-neutral-400 mt-3 max-w-2xl leading-relaxed">
            Discover bespoke jewellery masterfully crafted in Shahabad Hardoi. Handcrafted signature details custom built in warm gold and sterling silver.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          
          {/* Left Column: Filter Sidebar Controls */}
          <div className="space-y-8 bg-neutral-950/40 border border-[#dfba73]/15 p-6 rounded-sm self-start">
            <div className="flex items-center gap-2 border-b border-[#dfba73]/10 pb-3">
              <SlidersHorizontal className="w-4 h-4 text-[#dfba73]" />
              <h3 className="font-serif text-base text-white tracking-wider">Refine Catalog</h3>
            </div>

            {/* Price Filter */}
            <div className="space-y-2">
              <label className="block text-[10px] uppercase tracking-widest text-[#dfba73] font-bold">
                Max Price: ₹{maxPrice.toLocaleString()}
              </label>
              <input
                type="range"
                min={500}
                max={300000}
                step={500}
                value={maxPrice}
                onChange={(e) => setMaxPrice(parseInt(e.target.value))}
                className="w-full accent-[#dfba73]"
              />
              <div className="flex justify-between text-[9px] font-mono text-neutral-500">
                <span>₹500</span>
                <span>₹3,00,000</span>
              </div>
            </div>

            {/* Metal Type Filter */}
            <div className="space-y-2">
              <label className="block text-[10px] uppercase tracking-widest text-[#dfba73] font-bold mb-1">
                Metal Type
              </label>
              <div className="flex flex-col gap-2">
                {[
                  { id: "all", label: "All Metals" },
                  { id: "gold", label: "Champagne Gold" },
                  { id: "silver", label: "Sterling Silver" },
                ].map((item) => (
                  <button
                    key={item.id}
                    onClick={() => setSelectedMetal(item.id)}
                    className={`text-left text-xs py-1.5 px-3 rounded-none border transition-all flex items-center justify-between ${
                      selectedMetal === item.id
                        ? "bg-[#dfba73]/15 border-[#dfba73] text-white font-semibold"
                        : "border-neutral-800 text-neutral-400 hover:border-[#dfba73]/30 hover:text-white"
                    }`}
                  >
                    <span>{item.label}</span>
                    {selectedMetal === item.id && <Check className="w-3.5 h-3.5 text-[#dfba73]" />}
                  </button>
                ))}
              </div>
            </div>

            {/* Purity Filter */}
            <div className="space-y-2">
              <label className="block text-[10px] uppercase tracking-widest text-[#dfba73] font-bold mb-1">
                Gold Purity
              </label>
              <div className="flex flex-col gap-2">
                {[
                  { id: "all", label: "All Purities" },
                  { id: "24k", label: "24k Pure Gold" },
                  { id: "22k", label: "22k Standard Gold" },
                  { id: "18k", label: "18k Champagne Gold" },
                ].map((item) => (
                  <button
                    key={item.id}
                    onClick={() => setSelectedPurity(item.id)}
                    className={`text-left text-xs py-1.5 px-3 rounded-none border transition-all flex items-center justify-between ${
                      selectedPurity === item.id
                        ? "bg-[#dfba73]/15 border-[#dfba73] text-white font-semibold"
                        : "border-neutral-800 text-neutral-400 hover:border-[#dfba73]/30 hover:text-white"
                    }`}
                  >
                    <span>{item.label}</span>
                    {selectedPurity === item.id && <Check className="w-3.5 h-3.5 text-[#dfba73]" />}
                  </button>
                ))}
              </div>
            </div>

            {/* Weight Filter */}
            <div className="space-y-2">
              <label className="block text-[10px] uppercase tracking-widest text-[#dfba73] font-bold mb-1">
                Weight Class
              </label>
              <div className="flex flex-col gap-2">
                {[
                  { id: "all", label: "All Weights" },
                  { id: "light", label: "Lightweight (Under 5g)" },
                  { id: "medium", label: "Standard (5g - 15g)" },
                  { id: "heavy", label: "Heavyweight (Above 15g)" },
                ].map((item) => (
                  <button
                    key={item.id}
                    onClick={() => setSelectedWeight(item.id)}
                    className={`text-left text-xs py-1.5 px-3 rounded-none border transition-all flex items-center justify-between ${
                      selectedWeight === item.id
                        ? "bg-[#dfba73]/15 border-[#dfba73] text-white font-semibold"
                        : "border-neutral-800 text-neutral-400 hover:border-[#dfba73]/30 hover:text-white"
                    }`}
                  >
                    <span>{item.label}</span>
                    {selectedWeight === item.id && <Check className="w-3.5 h-3.5 text-[#dfba73]" />}
                  </button>
                ))}
              </div>
            </div>

            {/* Collection / Badge Filter */}
            <div className="space-y-2">
              <label className="block text-[10px] uppercase tracking-widest text-[#dfba73] font-bold mb-1">
                Collection Tags
              </label>
              <div className="flex flex-col gap-2">
                {[
                  { id: "all", label: "All Collections" },
                  { id: "new", label: "New Arrivals" },
                  { id: "best", label: "Best Sellers" },
                ].map((item) => (
                  <button
                    key={item.id}
                    onClick={() => setSelectedTag(item.id)}
                    className={`text-left text-xs py-1.5 px-3 rounded-none border transition-all flex items-center justify-between ${
                      selectedTag === item.id
                        ? "bg-[#dfba73]/15 border-[#dfba73] text-white font-semibold"
                        : "border-neutral-800 text-neutral-400 hover:border-[#dfba73]/30 hover:text-white"
                    }`}
                  >
                    <span>{item.label}</span>
                    {selectedTag === item.id && <Check className="w-3.5 h-3.5 text-[#dfba73]" />}
                  </button>
                ))}
              </div>
            </div>

            {/* Reset Filters button */}
            <button
              onClick={() => {
                setMaxPrice(300000);
                setSelectedPurity("all");
                setSelectedWeight("all");
                setSelectedMetal("all");
                setSelectedTag("all");
              }}
              className="w-full py-2.5 bg-neutral-900 hover:bg-[#dfba73] text-[#dfba73] hover:text-neutral-950 border border-[#dfba73]/30 hover:border-transparent font-sans text-[10px] font-bold tracking-widest uppercase transition-colors"
            >
              Reset Filters
            </button>
          </div>

          {/* Right Column: Products Grid */}
          <div className="lg:col-span-3">
            {filteredProducts.length === 0 ? (
              <div className="py-24 text-center border border-[#dfba73]/15 bg-neutral-950/20 rounded-sm">
                <p className="font-serif text-lg text-neutral-400">No designs match your criteria</p>
                <p className="font-sans text-xs text-neutral-500 mt-2">Try adjusting price, weight class, or purity filters.</p>
              </div>
            ) : (
              <div className="grid grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
                <AnimatePresence mode="popLayout">
                  {isDesignMode && (
                    <motion.div
                      initial={{ opacity: 0, scale: 0.95 }}
                      animate={{ opacity: 1, scale: 1 }}
                      className="border-2 border-dashed border-[#dfba73]/30 hover:border-[#dfba73] p-6 flex flex-col items-center justify-center text-center bg-neutral-950/20 group relative transition-all duration-300 min-h-[300px]"
                    >
                      <button
                        onClick={async () => {
                          const newName = window.prompt("Enter new product design name:");
                          if (!newName) return;
                          const newPrice = window.prompt("Enter product price (in INR):");
                          if (!newPrice) return;
                          
                          // Format category tag clean title
                          const cleanPrice = parseFloat(newPrice.replace(/[^0-9.]/g, "")) || 0;
                          const generatedId = `oj-cust-${Date.now().toString().slice(-4)}`;
                          
                          try {
                            const res = await fetch("/api/products", {
                              method: "POST",
                              headers: { "Content-Type": "application/json" },
                              body: JSON.stringify({
                                id: generatedId,
                                name: newName,
                                category: slug === "silver-jewellery" ? "silver" : "new-arrivals",
                                subCategory: slug.charAt(0).toUpperCase() + slug.slice(1),
                                price: cleanPrice,
                                rating: 5.0,
                                materials: slug === "silver-jewellery" ? "925 Sterling Silver" : "22k Pure Gold",
                                description: "Handcrafted boutique luxury ornament design. Available for showroom custom order.",
                                details: ["Hallmark certified", "Customized order dori"],
                              }),
                            });
                            
                            const data = await res.json();
                            if (data.success) {
                              alert("Bespoke product card added to database catalog!");
                              // Refresh dynamic listing
                              fetch("/api/products", { cache: "no-store" })
                                .then((r) => r.json())
                                .then((d) => {
                                  if (d.success && d.products) {
                                    setDbProducts(d.products);
                                  }
                                });
                            }
                          } catch (err: any) {
                            alert("Failed to insert card: " + err.message);
                          }
                        }}
                        className="w-12 h-12 rounded-full bg-[#dfba73]/10 text-[#dfba73] hover:bg-[#dfba73] hover:text-neutral-950 font-sans text-xl font-bold flex items-center justify-center transition-all cursor-pointer shadow-lg mb-4"
                      >
                        +
                      </button>
                      <span className="font-serif text-sm text-white font-medium">Add New Design</span>
                      <p className="font-sans text-[10px] text-neutral-500 mt-2 px-4 leading-relaxed">
                        Instantly seed a custom product card into the {getCategoryTitle()} registry.
                      </p>
                    </motion.div>
                  )}
                  {filteredProducts.map((product) => (
                    <ProductCard
                      key={product.id}
                      product={product}
                      isWishlisted={wishlist.some((item) => item.id === product.id)}
                      onWishlistToggle={handleWishlistToggle}
                      onQuickView={handleOpenQuickView}
                      onAddToCart={handleAddToCart}
                      isDesignMode={isDesignMode}
                      onEditText={handleTextChange}
                      onUploadPhoto={handleUploadImage}
                      customText={customText}
                    />
                  ))}
                </AnimatePresence>
              </div>
            )}
          </div>

        </div>

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

      {/* Floating Design Studio Panel */}
      <div className="fixed bottom-6 right-6 z-50 flex flex-col items-end gap-3">
        <AnimatePresence>
          {isDesignMode && (
            <motion.div
              initial={{ opacity: 0, y: 15, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 15, scale: 0.95 }}
              className="bg-neutral-950/95 border border-[#dfba73]/30 p-4 shadow-2xl backdrop-blur-md rounded-sm w-56 flex flex-col gap-2"
            >
              <div className="flex items-center justify-between border-b border-[#dfba73]/15 pb-2">
                <span className="font-sans text-[9px] font-bold uppercase tracking-widest text-[#dfba73]">
                  Boutique Studio
                </span>
                <span className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse" />
              </div>
              <p className="font-sans text-[10px] text-neutral-400 leading-normal">
                Click any title or price directly to customize, or hover to replace images.
              </p>
              
              <div className="flex gap-2 border-t border-[#dfba73]/20 pt-3">
                <button
                  onClick={handleResetAllEdits}
                  className="flex-1 py-1.5 bg-neutral-900 border border-red-500/30 hover:bg-red-500/10 text-red-400 font-sans text-[9px] font-bold uppercase tracking-wider transition-colors flex items-center justify-center gap-1.5"
                >
                  <RefreshCw className="w-3.5 h-3.5" />
                  Reset Defaults
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        <button
          onClick={handleToggleDesignMode}
          className={`px-4 py-2.5 md:px-5 md:py-3 rounded-full shadow-2xl font-sans text-[10px] md:text-xs font-bold tracking-widest uppercase transition-all duration-300 flex items-center gap-2 border active:scale-[0.98] cursor-pointer ${
            isDesignMode
              ? "bg-red-600 border-red-500 text-white hover:bg-red-700 scale-105"
              : "bg-[#dfba73] border-[#dfba73] text-neutral-950 hover:bg-[#c5a059] hover:scale-105"
          }`}
          title={isDesignMode ? "Exit Design Mode" : "Design Mode: Customize Website"}
        >
          {isDesignMode ? (
            <>
              <X className="w-4 h-4" />
              Close Editor
            </>
          ) : (
            <>
              <Edit className="w-4 h-4" />
              Edit Page
            </>
          )}
        </button>
      </div>

      {/* Quick View Modal */}
      <QuickViewModal
        product={selectedProduct}
        isOpen={isQuickViewOpen}
        onClose={() => setIsQuickViewOpen(false)}
        isWishlisted={selectedProduct ? wishlist.some((item) => item.id === selectedProduct.id) : false}
        onWishlistToggle={handleWishlistToggle}
        onAddToCart={handleAddToCart}
        onInquiry={handleWhatsAppInquiry}
        isDesignMode={isDesignMode}
        onEditText={handleTextChange}
        onUploadPhoto={handleUploadImage}
        customText={customText}
      />

    </div>
  );
}
