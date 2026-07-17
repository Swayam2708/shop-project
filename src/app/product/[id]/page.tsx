"use client";

import React, { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import Navbar from "@/components/Navbar";
import ProductCard from "@/components/ProductCard";
import QuickViewModal from "@/components/QuickViewModal";
import { products as initialProducts, Product } from "@/data/products";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowLeft, Heart, ShoppingBag, MessageCircle, ShieldCheck, Truck, RefreshCw, Star, Edit, Lock, X, Upload } from "lucide-react";
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

export default function ProductDetailPage() {
  const params = useParams();
  const id = params?.id ? (params.id as string) : "";

  // Core data states
  const [dbProducts, setDbProducts] = useState<Product[]>(initialProducts);
  const [customText, setCustomText] = useState<Record<string, string>>({});
  const [customizedImages, setCustomizedImages] = useState<Record<string, string>>({});
  const [wishlist, setWishlist] = useState<Product[]>([]);
  const [cart, setCart] = useState<{ product: Product; quantity: number }[]>([]);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [isQuickViewOpen, setIsQuickViewOpen] = useState(false);

  // Selected details page product
  const [product, setProduct] = useState<Product | null>(null);

  // Design studio state variables
  const [isDesignMode, setIsDesignMode] = useState(false);

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
          
          const found = data.products.find((p: Product) => p.id === id);
          if (found) {
            setProduct(found);
            setBasePrice(found.price);
            setLivePrice(found.price);
            
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
    fetchCustomContent();
  }, [id]);

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
      .catch((err) => console.error("Product details failed to load customized overrides:", err));
  };

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

    // Prefill price from customText override if edited
    const customPriceStr = customText[`prod_price_${product.id}`];
    let initialPrice = basePrice;
    if (customPriceStr) {
      const cleanNum = customPriceStr.replace(/[^0-9]/g, "");
      if (cleanNum) initialPrice = parseInt(cleanNum);
    }

    let computed = initialPrice;

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
  }, [selectedMetal, selectedPurity, selectedStone, basePrice, product, customText]);

  // Logic to save items in Recently Viewed list
  const saveToRecentlyViewed = (current: Product, allProds: Product[]) => {
    if (typeof window === "undefined") return;

    const savedIds = localStorage.getItem("oj_recently_viewed");
    let currentIds: string[] = savedIds ? JSON.parse(savedIds) : [];

    currentIds = currentIds.filter((x) => x !== current.id);
    currentIds.unshift(current.id);

    const trimmed = currentIds.slice(0, 5);
    localStorage.setItem("oj_recently_viewed", JSON.stringify(trimmed));

    const fullProds = trimmed
      .map((tid) => allProds.find((p) => p.id === tid))
      .filter((p): p is Product => p !== undefined && p.id !== current.id);
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
      console.error("Product page failed to save text edit:", err);
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
      console.error("Product page failed to save image upload:", err);
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

  const compressImage = (file: File, maxDim: number = 800): Promise<string> => {
    return new Promise((resolve) => {
      const img = new Image();
      img.src = URL.createObjectURL(file);
      img.onload = () => {
        let width = img.width;
        let height = img.height;
        if (width > maxDim || height > maxDim) {
          const ratio = Math.min(maxDim / width, maxDim / height);
          width = Math.round(width * ratio);
          height = Math.round(height * ratio);
        }
        const canvas = document.createElement("canvas");
        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext("2d");
        if (ctx) {
          ctx.drawImage(img, 0, 0, width, height);
          const compressedBase64 = canvas.toDataURL("image/jpeg", 0.7);
          resolve(compressedBase64);
        } else {
          resolve("");
        }
        URL.revokeObjectURL(img.src);
      };
      img.onerror = () => {
        resolve("");
      };
    });
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      const compressed = await compressImage(file, 800);
      if (compressed) {
        handleUploadImage(product!.id, compressed);
      }
    }
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
  const displayImage = customizedImages[product.id] || product.image;

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
                src={activeImage || displayImage}
                alt={displayName}
                className="w-full h-full object-contain p-4 bg-neutral-950/20 transition-transform duration-1000 hover:scale-105"
              />
              
              {/* Design Mode Photo Uploader Overlay */}
              {isDesignMode && (
                <label className="absolute inset-0 bg-neutral-900/80 backdrop-blur-xs flex flex-col items-center justify-center text-amber-500 cursor-pointer z-10">
                  <Upload className="w-10 h-10 mb-2 animate-bounce" />
                  <span className="font-sans text-xs tracking-widest uppercase font-bold text-center px-4">
                    Replace Main Gold Photo
                  </span>
                  <input
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={handleFileChange}
                  />
                </label>
              )}

              <div className="absolute top-4 left-4 px-2 py-0.5 bg-[#dfba73] text-neutral-950 text-[9px] font-extrabold tracking-wider uppercase rounded-sm z-10">
                BIS Hallmarked 22k/18k
              </div>
            </div>

            {/* Thumbnail list */}
            <div className="grid grid-cols-4 gap-3">
              {[displayImage, gallery[1], gallery[2], gallery[3]].map((imgUrl, index) => (
                <button
                  key={index}
                  onClick={() => setActiveImage(imgUrl || "")}
                  className={`aspect-square overflow-hidden border bg-neutral-950 rounded-sm transition-all ${
                    (activeImage || displayImage) === imgUrl ? "border-[#dfba73] ring-1 ring-[#dfba73]" : "border-neutral-800 hover:border-[#dfba73]/45"
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
              
              <h1
                contentEditable={isDesignMode}
                suppressContentEditableWarning
                onBlur={(e) => handleTextChange(`prod_name_${product.id}`, e.currentTarget.textContent || "")}
                className={`font-serif text-3xl md:text-4xl font-light text-white tracking-wide leading-tight ${isDesignMode ? "border border-dashed border-amber-500/40 px-2 py-1 rounded-sm cursor-text" : ""}`}
              >
                {displayName}
              </h1>
              
              <div className="flex items-center gap-4 mt-3 pb-4 border-b border-[#dfba73]/10">
                {/* Dynamic Calculated Live Price */}
                <div className="flex items-center gap-1">
                  {isDesignMode ? (
                    <span
                      contentEditable={true}
                      suppressContentEditableWarning
                      onBlur={(e) => handleTextChange(`prod_price_${product.id}`, e.currentTarget.textContent || "")}
                      className="font-sans text-2xl font-bold text-white border border-dashed border-amber-500/40 px-2 rounded-sm cursor-text"
                    >
                      {customText[`prod_price_${product.id}`] || `₹${product.price.toLocaleString()}`}
                    </span>
                  ) : (
                    <span className="font-sans text-2xl font-bold text-white">
                      ₹{livePrice.toLocaleString()}
                    </span>
                  )}
                </div>
                
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
                <span
                  contentEditable={isDesignMode}
                  suppressContentEditableWarning
                  onBlur={(e) => handleTextChange(`prod_mat_${product.id}`, e.currentTarget.textContent || "")}
                  className={`text-xs font-semibold text-white ${isDesignMode ? "border border-dashed border-amber-500/40 px-1 rounded-sm cursor-text" : ""}`}
                >
                  {displayMaterials}
                </span>
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
            <p
              contentEditable={isDesignMode}
              suppressContentEditableWarning
              onBlur={(e) => handleTextChange(`prod_desc_${product.id}`, e.currentTarget.textContent || "")}
              className={`font-sans text-xs md:text-sm text-neutral-400 leading-relaxed font-light ${isDesignMode ? "border border-dashed border-amber-500/40 p-2 rounded-sm cursor-text" : ""}`}
            >
              {displayDesc}
            </p>

            {/* Premium Option Selector widgets */}
            <div className="space-y-6 bg-neutral-950/30 border border-[#dfba73]/10 p-6 rounded-sm">
              <h3 className="font-serif text-sm text-white tracking-wider border-b border-[#dfba73]/10 pb-2">
                Custom Options
              </h3>

              {/* Ring Size Option */}
              {product.subCategory.toLowerCase() === "rings" && (
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
                            : "border-neutral-800 text-neutral-450 hover:border-[#dfba73]/30 hover:text-white"
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
                  isDesignMode={isDesignMode}
                  onEditText={handleTextChange}
                  onUploadPhoto={handleUploadImage}
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
                  isDesignMode={isDesignMode}
                  onEditText={handleTextChange}
                  onUploadPhoto={handleUploadImage}
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
                Click any title, description or price directly to customize, or replace the photo.
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
