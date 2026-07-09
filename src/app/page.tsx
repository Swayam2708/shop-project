"use client";

import React, { useState, useEffect } from "react";
import {
  ArrowRight,
  Send,
  MessageCircle,
  Instagram,
  Facebook,
  Twitter,
  MapPin,
  Phone,
  Mail,
  Clock,
  Sparkles,
  Shield,
  Heart,
  Globe,
  Edit,
  Upload,
  RefreshCw,
  X,
  Lock,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import Navbar from "@/components/Navbar";
import ProductCard from "@/components/ProductCard";
import QuickViewModal from "@/components/QuickViewModal";
import { products as initialProducts, Product } from "@/data/products";

// Decorative Golden Filigree Corner Scroll Component
function GoldCorner({ className, flipX = false, flipY = false }: { className?: string; flipX?: boolean; flipY?: boolean }) {
  const transform = `${flipX ? "scaleX(-1)" : ""} ${flipY ? "scaleY(-1)" : ""}`.trim();
  return (
    <svg 
      className={className} 
      viewBox="0 0 100 100" 
      fill="none" 
      xmlns="http://www.w3.org/2000/svg"
      style={transform ? { transform } : undefined}
    >
      <path d="M 4,4 L 96,4 C 80,4 60,10 50,30 C 40,50 30,80 30,96 M 4,4 L 4,96 C 4,80 10,60 30,50 C 50,40 80,30 96,30" stroke="url(#corner-gold-gradient)" strokeWidth="1.5" strokeLinecap="round" opacity="0.45" />
      <path d="M 12,12 L 60,12 C 50,12 40,18 35,30 C 30,42 22,50 12,60 L 12,12" stroke="url(#corner-gold-gradient)" strokeWidth="1" strokeLinecap="round" opacity="0.35" />
      <circle cx="6" cy="6" r="2.5" fill="#dfba73" />
      <circle cx="20" cy="20" r="1.5" fill="#dfba73" opacity="0.7" />
      <defs>
        <linearGradient id="corner-gold-gradient" x1="0" y1="0" x2="100" y2="100" gradientUnits="userSpaceOnUse">
          <stop stopColor="#AA851C" />
          <stop offset="0.5" stopColor="#D4AF37" />
          <stop offset="1" stopColor="#F3E6C4" />
        </linearGradient>
      </defs>
    </svg>
  );
}

// Cute Cartoon Bal Ganesha Corner Sticker
function CuteGaneshaCorner({ className, flipX = false }: { className?: string; flipX?: boolean }) {
  const transform = flipX ? "scaleX(-1)" : "";
  return (
    <svg 
      className={className} 
      viewBox="0 0 100 100" 
      fill="none" 
      xmlns="http://www.w3.org/2000/svg"
      style={transform ? { transform } : undefined}
    >
      {/* Crown / Mukut */}
      <path d="M45 10 L50 2 L55 10 L52 20 L48 20 Z" fill="#D4AF37" stroke="#AA851C" strokeWidth="1" />
      <circle cx="50" cy="5" r="1.5" fill="#FFD700" />
      <path d="M42 20 H58 L55 25 H45 Z" fill="#b8912b" />
      
      {/* Big Cartoon Ears */}
      <circle cx="32" cy="42" r="14" fill="#FFEAA7" stroke="#D4AF37" strokeWidth="1.5" />
      <circle cx="68" cy="42" r="14" fill="#FFEAA7" stroke="#D4AF37" strokeWidth="1.5" />
      <path d="M26 42 C26 38 32 36 32 42" stroke="#AA851C" strokeWidth="1" />
      <path d="M74 42 C74 38 68 36 68 42" stroke="#AA851C" strokeWidth="1" />

      {/* Head / Face */}
      <circle cx="50" cy="44" r="16" fill="#FFEAA7" stroke="#D4AF37" strokeWidth="1.5" />

      {/* Tilak on Forehead */}
      <path d="M48 30 H52 V36 L50 40 L48 36 Z" fill="#D81B60" />
      <circle cx="50" cy="38" r="1" fill="#FFD700" />

      {/* Cute Big Cartoon Eyes */}
      <circle cx="43" cy="42" r="3.5" fill="#2D3436" />
      <circle cx="42" cy="41" r="1" fill="white" />
      <circle cx="57" cy="42" r="3.5" fill="#2D3436" />
      <circle cx="56" cy="41" r="1" fill="white" />

      {/* Cute Trunk (Sond) */}
      <path d="M50 48 C50 56 42 58 42 62 C42 65 45 67 48 67 C52 67 52 63 50 60" stroke="#D4AF37" strokeWidth="4.5" strokeLinecap="round" fill="none" />
      <path d="M50 48 C50 56 42 58 42 62 C42 65 45 67 48 67 C52 67 52 63 50 60" stroke="#FFEAA7" strokeWidth="2.5" strokeLinecap="round" fill="none" />

      {/* Sweet Smiling Mouth */}
      <path d="M37 46 Q39 48 41 46" stroke="#AA851C" strokeWidth="1" strokeLinecap="round" />
      <path d="M63 46 Q61 48 59 46" stroke="#AA851C" strokeWidth="1" strokeLinecap="round" />

      {/* Sparkles */}
      <path d="M12 18 L15 15 L18 18 L15 21 Z" fill="#FFD700" opacity="0.8" />
      <path d="M82 18 L85 15 L88 18 L85 21 Z" fill="#FFD700" opacity="0.8" />
    </svg>
  );
}

// Cute Smiling Gold Coin Cartoon Sticker
function CuteCoinCorner({ className, flipX = false }: { className?: string; flipX?: boolean }) {
  const transform = flipX ? "scaleX(-1)" : "";
  return (
    <svg 
      className={className} 
      viewBox="0 0 100 100" 
      fill="none" 
      xmlns="http://www.w3.org/2000/svg"
      style={transform ? { transform } : undefined}
    >
      <circle cx="50" cy="50" r="28" fill="#F1C40F" stroke="#F39C12" strokeWidth="2" />
      <circle cx="50" cy="50" r="23" stroke="#D35400" strokeWidth="1" strokeDasharray="3 2" />

      <circle cx="43" cy="46" r="3" fill="#2C3E50" />
      <circle cx="42" cy="45" r="0.8" fill="white" />
      <circle cx="57" cy="46" r="3" fill="#2C3E50" />
      <circle cx="56" cy="45" r="0.8" fill="white" />
      
      <path d="M47 52 Q50 56 53 52" stroke="#2C3E50" strokeWidth="1.5" strokeLinecap="round" fill="none" />

      <circle cx="39" cy="50" r="2" fill="#E74C3C" opacity="0.6" />
      <circle cx="61" cy="50" r="2" fill="#E74C3C" opacity="0.6" />

      <path d="M22 30 L25 24 L28 30 L25 36 Z" fill="#F39C12" />
      <path d="M72 70 L75 64 L78 70 L75 76 Z" fill="#F39C12" />
    </svg>
  );
}

export default function Home() {
  const [wishlist, setWishlist] = useState<Product[]>([]);
  const [cart, setCart] = useState<{ product: Product; quantity: number }[]>([]);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [isQuickViewOpen, setIsQuickViewOpen] = useState(false);
  const [activeCategory, setActiveCategory] = useState<string>("all");
  const [dbProducts, setDbProducts] = useState<Product[]>(initialProducts);

  // Real-time market rates simulation
  const [marketRates, setMarketRates] = useState({
    g24k: 7650,
    g22k: 7015,
    g18k: 5740,
    s999: 92,
    g24kDiff: 0.12,
    g22kDiff: 0.08,
    g18kDiff: -0.05,
    s999Diff: 0.35,
  });

  useEffect(() => {
    const interval = setInterval(() => {
      setMarketRates((prev) => {
        const randGoldChange = (Math.random() - 0.5) * 4;
        const randSilverChange = (Math.random() - 0.5) * 0.15;
        return {
          g24k: Math.round((prev.g24k + randGoldChange) * 10) / 10,
          g22k: Math.round((prev.g22k + randGoldChange * 0.9) * 10) / 10,
          g18k: Math.round((prev.g18k + randGoldChange * 0.8) * 10) / 10,
          s999: Math.round((prev.s999 + randSilverChange) * 100) / 100,
          g24kDiff: Math.round((prev.g24kDiff + randGoldChange * 0.005) * 100) / 100,
          g22kDiff: Math.round((prev.g22kDiff + randGoldChange * 0.004) * 100) / 100,
          g18kDiff: Math.round((prev.g18kDiff + randGoldChange * 0.003) * 100) / 100,
          s999Diff: Math.round((prev.s999Diff + randSilverChange * 0.015) * 100) / 100,
        };
      });
    }, 4000);
    return () => clearInterval(interval);
  }, []);

  // Gold Rate Calculator States
  const [calculatorCarat, setCalculatorCarat] = useState<"24k" | "22k" | "18k">("22k");
  const [calculatorWeight, setCalculatorWeight] = useState<number>(10);
  const goldPrices = {
    "24k": Math.round(marketRates.g24k),
    "22k": Math.round(marketRates.g22k),
    "18k": Math.round(marketRates.g18k),
  };

  // Swarna Gold Savings Scheme Planner States
  const [monthlySavingsInput, setMonthlySavingsInput] = useState<number>(5000);

  // Ambient Sitar Player States
  const [isSitarPlaying, setIsSitarPlaying] = useState(false);
  const sitarAudioRef = React.useRef<HTMLAudioElement | null>(null);

  // State to hold customized images & text edits from localStorage
  const [customizedImages, setCustomizedImages] = useState<Record<string, string>>({});
  const [customText, setCustomText] = useState<Record<string, string>>({});
  
  // Custom WhatsApp number configuration
  const [whatsAppNumber, setWhatsAppNumber] = useState("9936488845");

  // Design mode toggles
  const [isDesignMode, setIsDesignMode] = useState(false);

  // Contact Form State
  const [formState, setFormState] = useState({
    name: "",
    email: "",
    phone: "",
    message: "",
  });
  const [formSubmitted, setFormSubmitted] = useState(false);

  // Load all customizations from database on mount
  useEffect(() => {
    // Fetch products catalog from database
    fetch("/api/products")
      .then((res) => res.json())
      .then((data) => {
        if (data.success && data.products) {
          setDbProducts(data.products);
        }
      })
      .catch((err) => console.error("Failed to load products from server:", err));

    // Fetch custom content overrides
    fetch("/api/custom-content")
      .then((res) => res.json())
      .then((data) => {
        if (data.success && data.content) {
          const loadedCustoms: Record<string, string> = {};
          const loadedTexts: Record<string, string> = {};
          const savedWhatsApp = data.content["oj_custom_whatsapp"] || "9936488845";
          setWhatsAppNumber(savedWhatsApp);

          Object.entries(data.content).forEach(([key, val]) => {
            if (key.startsWith("oj_custom_img_")) {
              loadedCustoms[key.replace("oj_custom_img_", "")] = val as string;
            } else if (key.startsWith("oj_custom_txt_")) {
              loadedTexts[key.replace("oj_custom_txt_", "")] = val as string;
            } else {
              loadedTexts[key] = val as string;
            }
          });
          setCustomizedImages(loadedCustoms);
          setCustomText(loadedTexts);

          // Load baseline rates from database
          const db24k = data.content["oj_base_price_24k"];
          const db22k = data.content["oj_base_price_22k"];
          const db18k = data.content["oj_base_price_18k"];
          const dbSilver = data.content["oj_base_price_silver"];

          if (db24k || db22k || db18k || dbSilver) {
            setMarketRates((prev) => ({
              ...prev,
              g24k: parseFloat(db24k || "7650"),
              g22k: parseFloat(db22k || "7015"),
              g18k: parseFloat(db18k || "5740"),
              s999: parseFloat(dbSilver || "92"),
            }));
          } else {
            // Fetch live rates from our new MCX-linked API route
            fetch("/api/mcx-rates")
              .then((res) => res.json())
              .then((data) => {
                if (data.success && data.rates) {
                  setMarketRates((prev) => ({
                    ...prev,
                    g24k: data.rates.g24k,
                    g22k: data.rates.g22k,
                    g18k: data.rates.g18k,
                    s999: data.rates.s999,
                  }));
                }
              })
              .catch((err) => console.error("Failed to load live rates:", err));
          }
        }
      })
      .catch((err) => console.error("Failed to load custom content:", err));

    // Initialize sitar ambient background music loop
    sitarAudioRef.current = new Audio("https://www.soundhelix.com/examples/mp3/SoundHelix-Song-8.mp3");
    sitarAudioRef.current.loop = true;
    sitarAudioRef.current.volume = 0.25;
  }, []);

  // Save text changes in state & server database
  const handleTextChange = async (id: string, newText: string) => {
    setCustomText((prev) => ({ ...prev, [id]: newText }));
    try {
      await fetch("/api/custom-content", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ key: `oj_custom_txt_${id}`, value: newText }),
      });
    } catch (err) {
      console.error("Failed to save text edit to server:", err);
    }
  };

  // Set custom image and save in server database
  const handleUploadImage = async (id: string, base64: string) => {
    setCustomizedImages((prev) => ({ ...prev, [id]: base64 }));
    try {
      await fetch("/api/custom-content", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ key: `oj_custom_img_${id}`, value: base64 }),
      });
    } catch (err) {
      console.error("Failed to save image edit to server:", err);
    }
  };

  // Save WhatsApp number update
  const handleWhatsAppUpdate = async (num: string) => {
    const cleanNum = num.replace(/\s+/g, "").replace(/\+/g, "");
    setWhatsAppNumber(cleanNum);
    try {
      await fetch("/api/custom-content", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ key: "oj_custom_whatsapp", value: cleanNum }),
      });
    } catch (err) {
      console.error("Failed to save WhatsApp number to server:", err);
    }
  };

  // Reset all uploaded images & edited text to default settings
  const handleResetAllEdits = async () => {
    if (window.confirm("Are you sure you want to delete all text edits and custom photos, and restore initial defaults?")) {
      try {
        await fetch("/api/custom-content", {
          method: "DELETE",
        });
      } catch (err) {
        console.error("Failed to delete settings on server:", err);
      }
      setCustomizedImages({});
      setCustomText({});
      setWhatsAppNumber("9936488845");
      setIsDesignMode(false);
      window.location.reload();
    }
  };

  // Custom File Uploader for Section backgrounds/about section
  const handleBannerUpload = (e: React.ChangeEvent<HTMLInputElement>, elementId: string) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        if (typeof reader.result === "string") {
          handleUploadImage(elementId, reader.result);
        }
      };
      reader.readAsDataURL(file);
    }
  };

  // Map products to include database customizations
  const products = dbProducts.map((p) => ({
    ...p,
    image: customizedImages[p.id] || p.image,
  }));

  // Toggle wishlist
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

  // Remove from cart
  const handleRemoveFromCart = (id: string) => {
    setCart(cart.filter((item) => item.product.id !== id));
  };

  // Open quick view
  const handleOpenQuickView = (product: Product) => {
    setSelectedProduct(product);
    setIsQuickViewOpen(true);
  };

  // Send WhatsApp Inquiry (connect dynamically to current WhatsApp Number)
  const handleWhatsAppInquiry = (product: Product, quantity: number = 1) => {
    const pName = customText[`prod_name_${product.id}`] || product.name;
    const pPrice = customText[`prod_price_${product.id}`] || `$${product.price.toLocaleString()}`;

    const message = `Hello,\nI am interested in inquiring about your pure gold item:\n\n*Product:* ${pName}\n*ID:* ${product.id}\n*Quantity:* ${quantity}\n*Price:* ${pPrice}\n\nPlease share design details with me. Thank you!`;
    const encoded = encodeURIComponent(message);
    window.open(`https://wa.me/91${whatsAppNumber}?text=${encoded}`, "_blank");
  };

  // Generic WhatsApp Inquiry
  const handleGeneralWhatsApp = () => {
    const message = `Hello, I'd like to book a private gold jewelry consultation at Shahabad Hardoi.`;
    const encoded = encodeURIComponent(message);
    window.open(`https://wa.me/91${whatsAppNumber}?text=${encoded}`, "_blank");
  };

  // Handle Contact Form Submit and Save in Local Database
  const handleContactSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    // Create a new inquiry object
    const newInquiry = {
      name: formState.name,
      email: formState.email,
      phone: formState.phone,
      message: formState.message,
      date: new Date().toLocaleString(),
      interest: "Custom Gold Commission",
    };

    // Save to localStorage submissions array
    const existing = localStorage.getItem("oj_form_submissions");
    let submissionsList = [];
    if (existing) {
      try {
        submissionsList = JSON.parse(existing);
      } catch (err) {
        submissionsList = [];
      }
    }
    submissionsList.unshift(newInquiry); // Add to the top
    localStorage.setItem("oj_form_submissions", JSON.stringify(submissionsList));

    setFormSubmitted(true);
    setTimeout(() => {
      setFormSubmitted(false);
      setFormState({ name: "", email: "", phone: "", message: "" });
    }, 3500);
  };

  // Restrict Edit Website trigger to Owner Passcode
  const handleToggleDesignMode = () => {
    if (isDesignMode) {
      setIsDesignMode(false);
      return;
    }

    const enteredCode = window.prompt("Enter Owner Security Passcode to Edit Website:");
    const correctCode = localStorage.getItem("oj_admin_passcode") || "OJ2026";

    if (enteredCode === correctCode) {
      setIsDesignMode(true);
    } else if (enteredCode !== null) {
      alert("Access Denied: Incorrect Security Passcode.");
    }
  };

  // Filter products for the Best Sellers section tab
  const filteredBestSellers = products
    .filter((p) => p.category === "best-sellers")
    .filter((p) => activeCategory === "all" || p.subCategory.toLowerCase() === activeCategory.toLowerCase());

  // Dynamic values or defaults
  const customHeroBanner = customizedImages["hero_banner"];
  const customAboutImage = customizedImages["about_image"] || "https://images.unsplash.com/photo-1602751584552-8ba73aad10e1?q=80&w=800&auto=format&fit=crop";

  // Editable text styling outline
  const editOutlineClass = isDesignMode
    ? "border border-dashed border-amber-500/50 px-1.5 py-0.5 rounded-sm cursor-text focus:outline-none focus:ring-1 focus:ring-amber-500 bg-amber-500/5"
    : "";

  return (
    <div className="min-h-screen bg-luxury-gradient-light dark:bg-luxury-gradient-dark text-neutral-900 dark:text-neutral-100 relative overflow-hidden">
      {/* Sticky Premium Navbar */}
      <Navbar
        wishlist={wishlist}
        removeFromWishlist={(id) => setWishlist(wishlist.filter((item) => item.id !== id))}
        cart={cart}
        removeFromCart={handleRemoveFromCart}
        onOpenQuickView={handleOpenQuickView}
        onOpenInquiry={handleWhatsAppInquiry}
      />

      {/* Floating Ambient Glows */}
      <div className="absolute top-1/4 left-[-10%] w-[500px] h-[500px] bg-amber-500/5 blur-[150px] rounded-full animate-gold-glow pointer-events-none z-0" />
      <div className="absolute top-2/3 right-[-10%] w-[600px] h-[600px] bg-amber-500/5 blur-[180px] rounded-full animate-gold-glow pointer-events-none z-0" style={{ animationDelay: "-3s" }} />

      {/* 1. HERO SECTION */}
      <section id="home" className="relative h-screen flex items-center justify-center overflow-hidden">
        {/* Beautiful Decorative Corner Scrolls */}
        <GoldCorner className="absolute top-28 left-6 w-12 h-12 pointer-events-none z-20" />
        <GoldCorner className="absolute top-28 right-6 w-12 h-12 pointer-events-none z-20" flipX />
        <GoldCorner className="absolute bottom-6 left-6 w-12 h-12 pointer-events-none z-20" flipY />
        <GoldCorner className="absolute bottom-6 right-6 w-12 h-12 pointer-events-none z-20" flipX flipY />

        {/* Cute Cartoon auspicious stickers in corners */}
        <CuteGaneshaCorner className="absolute top-[160px] left-6 w-14 h-14 pointer-events-none z-20 animate-bounce" />
        <CuteCoinCorner className="absolute top-[160px] right-6 w-12 h-12 pointer-events-none z-20 animate-pulse" />

        {/* Background Banner or Video */}
        <div className="absolute inset-0 z-0 bg-neutral-950">
          {customHeroBanner ? (
            <img
              src={customHeroBanner}
              alt="Custom Gold Banner"
              className="w-full h-full object-cover brightness-[0.4]"
            />
          ) : (
            <video
              autoPlay
              loop
              muted
              playsInline
              className="w-full h-full object-cover brightness-[0.35] scale-105 animate-slow-pan"
            >
              <source
                src="https://player.vimeo.com/external/371433846.sd.mp4?s=236da2f3c054e08b15d0ec3efd8ec92a353d7f4b&profile_id=139&oauth2_token_id=57447761"
                type="video/mp4"
              />
            </video>
          )}
          {/* Champagne gold glow overlay */}
          <div className="absolute inset-0 bg-gradient-to-b from-neutral-950/30 via-[#dfba73]/10 to-neutral-950/90 pointer-events-none" />
        </div>

        {/* Hero Content */}
        <div className="relative z-10 text-center px-6 max-w-4xl mx-auto flex flex-col items-center">
          {isDesignMode && (
            <label className="mb-4 px-4 py-2 bg-neutral-900/90 border border-amber-400/30 hover:bg-neutral-800 text-amber-500 text-xs font-bold tracking-widest uppercase rounded-md cursor-pointer flex items-center gap-2">
              <Upload className="w-4 h-4" />
              Upload Hero Banner Photo
              <input
                type="file"
                accept="image/*"
                className="hidden"
                onChange={(e) => handleBannerUpload(e, "hero_banner")}
              />
            </label>
          )}

          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 1, ease: "easeOut" }}
            className="flex items-center gap-2 mb-4"
          >
            <Sparkles className="w-4 h-4 text-[#dfba73]" />
            <span 
              contentEditable={isDesignMode}
              suppressContentEditableWarning
              onBlur={(e) => handleTextChange("hero_badge", e.currentTarget.textContent || "")}
              className={`font-sans text-xs md:text-sm tracking-[0.4em] uppercase text-[#dfba73] font-bold ${editOutlineClass}`}
            >
              {customText["hero_badge"] || "EST. 2026 • PURE GOLD REDEFINED"}
            </span>
            <Sparkles className="w-4 h-4 text-[#dfba73]" />
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 35 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1] }}
            className="font-serif text-4xl sm:text-6xl md:text-7xl font-light tracking-wider text-white leading-none mb-6"
          >
            <span
              contentEditable={isDesignMode}
              suppressContentEditableWarning
              onBlur={(e) => handleTextChange("hero_title_l1", e.currentTarget.textContent || "")}
              className={`block mb-2 ${editOutlineClass}`}
            >
              {customText["hero_title_l1"] || "Pure Golden Legacies,"}
            </span>
            <span
              contentEditable={isDesignMode}
              suppressContentEditableWarning
              onBlur={(e) => handleTextChange("hero_title_l2", e.currentTarget.textContent || "")}
              className={`metallic-gold-shine font-normal ${editOutlineClass}`}
            >
              {customText["hero_title_l2"] || "Sculpted for the Modern Era."}
            </span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 25 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1.2, delay: 0.2, ease: "easeOut" }}
            className="font-sans text-sm md:text-base text-neutral-200 max-w-xl font-light tracking-wide leading-relaxed mb-10"
          >
            <span
              contentEditable={isDesignMode}
              suppressContentEditableWarning
              onBlur={(e) => handleTextChange("hero_subtitle", e.currentTarget.textContent || "")}
              className={editOutlineClass}
            >
              {customText["hero_subtitle"] || "Discover Omar Jewellers OJ. Modern Gen Z aesthetics meet 18k and 22k pure solid gold, forming hand-finished silhouettes that whisper absolute luxury."}
            </span>
          </motion.p>

          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 1, delay: 0.4, ease: "easeOut" }}
            className="flex flex-col sm:flex-row gap-4 w-full sm:w-auto"
          >
            <a
              href="#new-arrivals"
              className="px-8 py-4 bg-[#dfba73] hover:bg-[#c5a059] text-neutral-950 font-sans text-xs font-bold tracking-widest uppercase transition-all duration-300 rounded-sm flex items-center justify-center gap-2 shadow-lg shadow-[#dfba73]/10 hover:shadow-[#dfba73]/20"
            >
              Explore Gold Arrivals
              <ArrowRight className="w-4 h-4" />
            </a>
            <button
              onClick={handleGeneralWhatsApp}
              className="px-8 py-4 border border-neutral-200/30 hover:border-[#dfba73] hover:bg-white/5 text-white font-sans text-xs font-bold tracking-widest uppercase transition-all duration-300 rounded-sm backdrop-blur-sm"
            >
              Book Private Consultation
            </button>
          </motion.div>
        </div>

        {/* Scroll Indicator */}
        <div className="absolute bottom-10 left-1/2 transform -translate-x-1/2 flex flex-col items-center gap-2">
          <span className="font-sans text-[10px] tracking-[0.3em] uppercase text-white/60">
            Scroll To Explore
          </span>
          <div className="w-px h-10 bg-gradient-to-b from-white/60 to-transparent animate-pulse" />
        </div>
      </section>

      {/* TODAY'S SHOWROOM METAL RATES WIDGET */}
      <section className="py-16 md:py-24 px-6 md:px-12 max-w-7xl mx-auto z-10 relative">
        <div className="bg-white/40 dark:bg-[#0F0E0B]/40 border border-[#dfba73]/15 p-8 md:p-12 rounded-sm shadow-luxury-glow backdrop-blur-md relative overflow-hidden">
          {/* Filigree Corner Accents */}
          <GoldCorner className="absolute top-2 left-2 w-8 h-8 pointer-events-none opacity-30" />
          <GoldCorner className="absolute bottom-2 right-2 w-8 h-8 pointer-events-none opacity-30" flipX flipY />
          
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 pb-8 border-b border-[#dfba73]/10">
            <div>
              <span className="font-sans text-[10px] text-[#dfba73] tracking-[0.3em] uppercase font-bold block">
                Official Live Board
              </span>
              <h3 className="font-serif text-2xl md:text-3xl tracking-wide text-neutral-900 dark:text-neutral-100 mt-1">
                Today's Showroom Metal Rates
              </h3>
              <p className="font-sans text-xs text-neutral-500 mt-1">
                Daily verified market rates of Shahabad Chowk, Hardoi. (Assured 100% BIS Hallmarked Purity)
              </p>
            </div>
            <div className="text-right shrink-0">
              <span className="inline-flex items-center gap-1.5 px-3.5 py-1.5 bg-green-500/5 border border-green-500/20 rounded-full text-[9px] text-green-600 dark:text-green-400 font-sans tracking-widest uppercase font-bold">
                <span className="w-1.5 h-1.5 rounded-full bg-green-500 animate-ping" />
                Live Updated
              </span>
            </div>
          </div>

          <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 pt-8 text-center">
            {/* 24K Gold Card */}
            <div className="bg-neutral-50/40 dark:bg-neutral-900/10 border border-[#dfba73]/10 p-6 rounded-sm relative group hover:border-[#dfba73]/30 transition-all duration-300 shadow-sm hover:shadow-luxury-gold">
              <span className="text-[10px] font-sans font-bold uppercase tracking-widest text-neutral-400">Gold 24K</span>
              <p className="text-[9px] font-sans text-neutral-500 mt-0.5">99.9% Pure Fine Gold</p>
              <h4 className="font-serif text-xl sm:text-2xl text-neutral-900 dark:text-white mt-3 font-semibold">
                ₹{Math.round(marketRates.g24k).toLocaleString()} <span className="text-xs text-neutral-400">/ g</span>
              </h4>
              <span className={`inline-block text-[10px] font-bold font-mono mt-1 ${marketRates.g24kDiff >= 0 ? "text-green-500" : "text-red-500"}`}>
                {marketRates.g24kDiff >= 0 ? "▲" : "▼"}{Math.abs(marketRates.g24kDiff).toFixed(2)}%
              </span>
            </div>

            {/* 22K Gold Card */}
            <div className="bg-neutral-50/40 dark:bg-neutral-900/10 border border-[#dfba73]/10 p-6 rounded-sm relative group hover:border-[#dfba73]/30 transition-all duration-300 shadow-sm hover:shadow-luxury-gold">
              <span className="text-[10px] font-sans font-bold uppercase tracking-widest text-[#dfba73]">Gold 22K</span>
              <p className="text-[9px] font-sans text-neutral-500 mt-0.5">91.6% Pure Jeweller Gold</p>
              <h4 className="font-serif text-xl sm:text-2xl text-neutral-900 dark:text-white mt-3 font-semibold">
                ₹{Math.round(marketRates.g22k).toLocaleString()} <span className="text-xs text-neutral-400">/ g</span>
              </h4>
              <span className={`inline-block text-[10px] font-bold font-mono mt-1 ${marketRates.g22kDiff >= 0 ? "text-green-500" : "text-red-500"}`}>
                {marketRates.g22kDiff >= 0 ? "▲" : "▼"}{Math.abs(marketRates.g22kDiff).toFixed(2)}%
              </span>
            </div>

            {/* 18K Gold Card */}
            <div className="bg-neutral-50/40 dark:bg-neutral-900/10 border border-[#dfba73]/10 p-6 rounded-sm relative group hover:border-[#dfba73]/30 transition-all duration-300 shadow-sm hover:shadow-luxury-gold">
              <span className="text-[10px] font-sans font-bold uppercase tracking-widest text-neutral-400">Gold 18K</span>
              <p className="text-[9px] font-sans text-neutral-500 mt-0.5">75% Pure Designer Gold</p>
              <h4 className="font-serif text-xl sm:text-2xl text-neutral-900 dark:text-white mt-3 font-semibold">
                ₹{Math.round(marketRates.g18k).toLocaleString()} <span className="text-xs text-neutral-400">/ g</span>
              </h4>
              <span className={`inline-block text-[10px] font-bold font-mono mt-1 ${marketRates.g18kDiff >= 0 ? "text-green-500" : "text-red-500"}`}>
                {marketRates.g18kDiff >= 0 ? "▲" : "▼"}{Math.abs(marketRates.g18kDiff).toFixed(2)}%
              </span>
            </div>

            {/* 999 Silver Card */}
            <div className="bg-neutral-50/40 dark:bg-neutral-900/10 border border-[#dfba73]/10 p-6 rounded-sm relative group hover:border-[#dfba73]/30 transition-all duration-300 shadow-sm hover:shadow-luxury-gold">
              <span className="text-[10px] font-sans font-bold uppercase tracking-widest text-neutral-400">Silver 999</span>
              <p className="text-[9px] font-sans text-neutral-500 mt-0.5">99.9% Pure Fine Silver</p>
              <h4 className="font-serif text-xl sm:text-2xl text-neutral-900 dark:text-white mt-3 font-semibold">
                ₹{Math.round(marketRates.s999).toLocaleString()} <span className="text-xs text-neutral-400">/ g</span>
              </h4>
              <span className={`inline-block text-[10px] font-bold font-mono mt-1 ${marketRates.s999Diff >= 0 ? "text-green-500" : "text-red-500"}`}>
                {marketRates.s999Diff >= 0 ? "▲" : "▼"}{Math.abs(marketRates.s999Diff).toFixed(2)}%
              </span>
            </div>
          </div>

          <div className="mt-8 flex flex-col sm:flex-row sm:items-center justify-between gap-4 pt-4 border-t border-[#dfba73]/10 text-[9px] uppercase tracking-widest text-neutral-400 font-sans font-semibold">
            <span>Official Showroom Board • Omar Jewellers OJ</span>
            <span className="text-neutral-500">Government Certified BIS Hallmark Standards</span>
          </div>
        </div>
      </section>

      {/* 2. NEW ARRIVALS */}
      <motion.section
        initial={{ opacity: 0, y: 60 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-100px" }}
        transition={{ duration: 0.8, ease: "easeOut" }}
        id="new-arrivals"
        className="py-32 md:py-44 px-6 md:px-12 max-w-7xl mx-auto z-10 relative"
      >
        <div className="text-center mb-16">
          <span 
            contentEditable={isDesignMode}
            suppressContentEditableWarning
            onBlur={(e) => handleTextChange("new_arr_sub", e.currentTarget.textContent || "")}
            className={`font-sans text-xs text-[#dfba73] tracking-[0.3em] uppercase font-bold inline-block ${editOutlineClass}`}
          >
            {customText["new_arr_sub"] || "The Pure Gold Edit"}
          </span>
          <h2 
            contentEditable={isDesignMode}
            suppressContentEditableWarning
            onBlur={(e) => handleTextChange("new_arr_title", e.currentTarget.textContent || "")}
            className={`font-serif text-3xl md:text-5xl font-light text-neutral-900 dark:text-neutral-100 mt-2 ${editOutlineClass}`}
          >
            {customText["new_arr_title"] || "New Gold Arrivals"}
          </h2>
          <p className="font-sans text-xs md:text-sm text-neutral-500 dark:text-neutral-400 mt-4 max-w-md mx-auto leading-relaxed">
            <span
              contentEditable={isDesignMode}
              suppressContentEditableWarning
              onBlur={(e) => handleTextChange("new_arr_desc", e.currentTarget.textContent || "")}
              className={editOutlineClass}
            >
              {customText["new_arr_desc"] || "Freshly cast designs curated in rich 18k and 22k gold, showcasing brushed, hammered, and mirror finishes."}
            </span>
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {products
            .filter((p) => p.category === "new-arrivals")
            .map((product) => (
              <ProductCard
                key={product.id}
                product={product}
                isWishlisted={wishlist.some((item) => item.id === product.id)}
                onWishlistToggle={handleWishlistToggle}
                onQuickView={handleOpenQuickView}
                onAddToCart={handleAddToCart}
                isDesignMode={isDesignMode}
                onUploadPhoto={handleUploadImage}
                onEditText={handleTextChange}
                customText={customText}
              />
            ))}
        </div>
      </motion.section>

      {/* 3. BEST SELLERS */}
      <motion.section
        initial={{ opacity: 0, y: 60 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-100px" }}
        transition={{ duration: 0.8, ease: "easeOut" }}
        id="best-sellers"
        className="bg-white/5 dark:bg-neutral-950/15 border-y border-[#dfba73]/10 py-32 md:py-44 px-6 md:px-12 z-10 relative"
      >
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-16">
            <div className="mb-6 md:mb-0">
              <span 
                contentEditable={isDesignMode}
                suppressContentEditableWarning
                onBlur={(e) => handleTextChange("best_sell_sub", e.currentTarget.textContent || "")}
                className={`font-sans text-xs text-[#dfba73] tracking-[0.3em] uppercase font-bold inline-block ${editOutlineClass}`}
              >
                {customText["best_sell_sub"] || "Gold Statements"}
              </span>
              <h2 
                contentEditable={isDesignMode}
                suppressContentEditableWarning
                onBlur={(e) => handleTextChange("best_sell_title", e.currentTarget.textContent || "")}
                className={`font-serif text-3xl md:text-5xl font-light text-neutral-900 dark:text-neutral-100 mt-2 ${editOutlineClass}`}
              >
                {customText["best_sell_title"] || "Best Sellers"}
              </h2>
            </div>
            {/* Category Filter Tabs */}
            <div className="flex flex-wrap gap-2.5 font-sans text-xs tracking-wider uppercase">
              {["all", "rings", "necklaces", "earrings", "bracelets"].map((category) => (
                <button
                  key={category}
                  onClick={() => setActiveCategory(category)}
                  className={`px-5 py-2.5 border rounded-none tracking-widest uppercase transition-all duration-500 font-sans text-[10px] ${
                    activeCategory === category
                      ? "bg-[#dfba73] border-[#dfba73] text-neutral-950 font-bold"
                      : "border-[#dfba73]/15 hover:border-[#dfba73] text-neutral-800 dark:text-neutral-200 hover:bg-[#dfba73]/5"
                  }`}
                >
                  {category}
                </button>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            <AnimatePresence mode="popLayout">
              {filteredBestSellers.map((product) => (
                <ProductCard
                  key={product.id}
                  product={product}
                  isWishlisted={wishlist.some((item) => item.id === product.id)}
                  onWishlistToggle={handleWishlistToggle}
                  onQuickView={handleOpenQuickView}
                  onAddToCart={handleAddToCart}
                  isDesignMode={isDesignMode}
                  onUploadPhoto={handleUploadImage}
                  onEditText={handleTextChange}
                  customText={customText}
                />
              ))}
            </AnimatePresence>
          </div>
        </div>
      </motion.section>

      {/* 100% Certified Assurance (BIS Hallmark seals - Keep this high-trust section but remove calculators as requested) */}
      <motion.section
        initial={{ opacity: 0, y: 60 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-100px" }}
        transition={{ duration: 0.8 }}
        className="py-20 px-6 max-w-7xl mx-auto border-t border-[#dfba73]/10 z-10 relative"
      >
        <div className="text-center mb-12">
          <span className="font-sans text-xs text-[#dfba73] tracking-[0.3em] uppercase font-bold">
            100% Certified Assurance
          </span>
          <h2 className="font-serif text-3xl md:text-5xl font-light text-neutral-900 dark:text-neutral-100 mt-2">
            Pure Gold Hallmarking
          </h2>
          <p className="font-sans text-xs md:text-sm text-neutral-500 dark:text-neutral-400 mt-3 max-w-md mx-auto leading-relaxed">
            At Omar Jewellers, transparency is our primary pledge. Every golden silhouette displays the official four-part BIS Hallmark credentials stamped on the reverse side of the jewelry.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="p-6 border border-neutral-200 dark:border-neutral-800 bg-neutral-100 dark:bg-neutral-900/40 rounded-sm">
            <div className="flex items-center gap-3 mb-2">
              <div className="w-8 h-8 rounded-full bg-[#dfba73]/15 text-[#dfba73] flex items-center justify-center font-bold text-sm shrink-0 border border-[#dfba73]/20">
                ▲
              </div>
              <h4 className="font-serif text-sm text-neutral-900 dark:text-white font-medium">BIS Standard Mark</h4>
            </div>
            <p className="font-sans text-xs text-neutral-600 dark:text-neutral-400 leading-relaxed">
              Official triangular mark verified by the Bureau of Indian Standards proving authenticity.
            </p>
          </div>

          <div className="p-6 border border-neutral-200 dark:border-neutral-800 bg-neutral-100 dark:bg-neutral-900/40 rounded-sm">
            <div className="flex items-center gap-3 mb-2">
              <div className="w-8 h-8 rounded-full bg-[#dfba73]/15 text-[#dfba73] flex items-center justify-center font-serif text-xs font-bold shrink-0 border border-[#dfba73]/20">
                916
              </div>
              <h4 className="font-serif text-sm text-neutral-900 dark:text-white font-medium">Purity Grade (22K916)</h4>
            </div>
            <p className="font-sans text-xs text-neutral-600 dark:text-neutral-400 leading-relaxed">
              Confirms the precise percentage of pure solid gold content (e.g. 91.6% pure fine gold).
            </p>
          </div>

          <div className="p-6 border border-neutral-200 dark:border-neutral-800 bg-neutral-100 dark:bg-neutral-900/40 rounded-sm">
            <div className="flex items-center gap-3 mb-2">
              <div className="w-8 h-8 rounded-full bg-[#dfba73]/15 text-[#dfba73] flex items-center justify-center font-sans text-xs font-bold shrink-0 border border-[#dfba73]/20">
                ★
              </div>
              <h4 className="font-serif text-sm text-neutral-900 dark:text-white font-medium">Assaying Centre Mark</h4>
            </div>
            <p className="font-sans text-xs text-neutral-600 dark:text-neutral-400 leading-relaxed">
              The unique logo stamp of the certified lab that tested and assayed the jewelry piece.
            </p>
          </div>

          <div className="p-6 border border-neutral-200 dark:border-neutral-800 bg-neutral-100 dark:bg-neutral-900/40 rounded-sm">
            <div className="flex items-center gap-3 mb-2">
              <div className="w-8 h-8 rounded-full bg-[#dfba73]/15 text-[#dfba73] flex items-center justify-center font-mono text-[9px] font-bold shrink-0 border border-[#dfba73]/20">
                HUID
              </div>
              <h4 className="font-serif text-sm text-neutral-900 dark:text-white font-medium">Unique Alphanumeric ID</h4>
            </div>
            <p className="font-sans text-xs text-neutral-600 dark:text-neutral-400 leading-relaxed">
              A unique 6-digit laser ID code confirming trackable authenticity records in the government app.
            </p>
          </div>
        </div>
      </motion.section>

      {/* 4. BRIDAL COLLECTION */}
      <motion.section
        initial={{ opacity: 0, y: 60 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-100px" }}
        transition={{ duration: 0.8, ease: "easeOut" }}
        id="bridal"
        className="relative py-32 md:py-44 overflow-hidden z-10"
      >
        <div className="max-w-7xl mx-auto px-6 md:px-12 grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          <div className="lg:col-span-5">
            <span 
              contentEditable={isDesignMode}
              suppressContentEditableWarning
              onBlur={(e) => handleTextChange("bridal_sub", e.currentTarget.textContent || "")}
              className={`font-sans text-xs text-[#dfba73] tracking-[0.3em] uppercase font-bold inline-block ${editOutlineClass}`}
            >
              {customText["bridal_sub"] || "Golden Vows"}
            </span>
            <h2 
              contentEditable={isDesignMode}
              suppressContentEditableWarning
              onBlur={(e) => handleTextChange("bridal_title", e.currentTarget.textContent || "")}
              className={`font-serif text-4xl md:text-5xl font-light text-neutral-900 dark:text-neutral-100 mt-2 mb-6 ${editOutlineClass}`}
            >
              {customText["bridal_title"] || "The Gold Bridal Collection"}
            </h2>
            <p className="font-sans text-sm text-neutral-700 dark:text-neutral-300 font-light leading-relaxed mb-8">
              <span
                contentEditable={isDesignMode}
                suppressContentEditableWarning
                onBlur={(e) => handleTextChange("bridal_desc", e.currentTarget.textContent || "")}
                className={editOutlineClass}
              >
                {customText["bridal_desc"] || "A celebration of royal golden heritage. Handcrafted in solid 22k gold, our bridal collections display exquisite traditional detailing reimagined in minimalist shapes for the contemporary bride."}
              </span>
            </p>
            <div className="space-y-4 mb-8">
              <div className="flex gap-4">
                <div className="p-3 bg-[#dfba73]/10 border border-[#dfba73]/20 text-[#dfba73] rounded-full h-fit">
                  <Shield className="w-5 h-5" />
                </div>
                <div>
                  <h4 
                    contentEditable={isDesignMode}
                    suppressContentEditableWarning
                    onBlur={(e) => handleTextChange("bridal_b1_title", e.currentTarget.textContent || "")}
                    className={`font-serif text-lg text-neutral-900 dark:text-neutral-100 inline-block ${editOutlineClass}`}
                  >
                    {customText["bridal_b1_title"] || "BIS 916 Hallmarked Pure Gold"}
                  </h4>
                  <p className="font-sans text-xs text-neutral-500 dark:text-neutral-400 mt-1">
                    <span
                      contentEditable={isDesignMode}
                      suppressContentEditableWarning
                      onBlur={(e) => handleTextChange("bridal_b1_desc", e.currentTarget.textContent || "")}
                      className={editOutlineClass}
                    >
                      {customText["bridal_b1_desc"] || "Every wedding set is officially hallmarked and certified for purity and absolute assurance."}
                    </span>
                  </p>
                </div>
              </div>
              <div className="flex gap-4">
                <div className="p-3 bg-[#dfba73]/10 border border-[#dfba73]/20 text-[#dfba73] rounded-full h-fit">
                  <Globe className="w-5 h-5" />
                </div>
                <div>
                  <h4 
                    contentEditable={isDesignMode}
                    suppressContentEditableWarning
                    onBlur={(e) => handleTextChange("bridal_b2_title", e.currentTarget.textContent || "")}
                    className={`font-serif text-lg text-neutral-900 dark:text-neutral-100 inline-block ${editOutlineClass}`}
                  >
                    {customText["bridal_b2_title"] || "Hand-Carved Bespoke Commissions"}
                  </h4>
                  <p className="font-sans text-xs text-neutral-500 dark:text-neutral-400 mt-1">
                    <span
                      contentEditable={isDesignMode}
                      suppressContentEditableWarning
                      onBlur={(e) => handleTextChange("bridal_b2_desc", e.currentTarget.textContent || "")}
                      className={editOutlineClass}
                    >
                      {customText["bridal_b2_desc"] || "Co-create your dream gold collar alongside our master metalsmiths in private studio consultations."}
                    </span>
                  </p>
                </div>
              </div>
            </div>
            <button
              onClick={handleGeneralWhatsApp}
              className="inline-flex items-center gap-2 px-8 py-4 bg-[#dfba73] hover:bg-[#c5a059] text-neutral-950 font-sans text-xs font-bold tracking-widest uppercase transition-all duration-300"
            >
              Consult a Gold Couture Expert
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>

          <div className="lg:col-span-7 grid grid-cols-2 gap-4">
            {products
              .filter((p) => p.category === "bridal")
              .slice(0, 2)
              .map((product, idx) => (
                <div key={product.id} className={`flex flex-col ${idx === 1 ? "mt-8" : ""}`}>
                  <div className="relative group overflow-hidden border border-[#dfba73]/15 bg-neutral-950 aspect-[3/4]">
                    <img
                      src={product.image}
                      alt={product.name}
                      className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                    />
                    
                    {isDesignMode && (
                      <label className="absolute inset-0 bg-neutral-900/80 backdrop-blur-xs flex flex-col items-center justify-center text-[#dfba73] cursor-pointer z-10">
                        <Upload className="w-6 h-6 mb-1" />
                        <span className="font-sans text-[9px] uppercase font-bold">Change Bridal Photo</span>
                        <input
                          type="file"
                          accept="image/*"
                          className="hidden"
                          onChange={(e) => {
                            const file = e.target.files?.[0];
                            if (file) {
                              const r = new FileReader();
                              r.onloadend = () => {
                                if (typeof r.result === "string") handleUploadImage(product.id, r.result);
                              };
                              r.readAsDataURL(file);
                            }
                          }}
                        />
                      </label>
                    )}

                    <div className="absolute inset-0 bg-gradient-to-t from-neutral-950/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-end p-6">
                      <p 
                        contentEditable={isDesignMode}
                        suppressContentEditableWarning
                        onBlur={(e) => handleTextChange(`prod_name_${product.id}`, e.currentTarget.textContent || "")}
                        className={`font-serif text-lg text-white ${editOutlineClass}`}
                      >
                        {customText[`prod_name_${product.id}`] || product.name}
                      </p>
                      <p 
                        contentEditable={isDesignMode}
                        suppressContentEditableWarning
                        onBlur={(e) => handleTextChange(`prod_price_${product.id}`, e.currentTarget.textContent || "")}
                        className={`font-sans text-sm text-[#dfba73] font-bold mt-1 ${editOutlineClass}`}
                      >
                        {customText[`prod_price_${product.id}`] || `$${product.price.toLocaleString()}`}
                      </p>
                      <button
                        onClick={() => handleOpenQuickView(product)}
                        className="mt-4 w-full py-2 bg-[#dfba73] hover:bg-[#c5a059] text-neutral-950 font-sans text-[10px] font-bold tracking-widest uppercase transition-colors"
                      >
                        Quick View
                      </button>
                    </div>
                  </div>
                </div>
              ))}
          </div>
        </div>
      </motion.section>

      {/* 5. DAILY WEAR COLLECTION */}
      <motion.section
        initial={{ opacity: 0, y: 60 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-100px" }}
        transition={{ duration: 0.8, ease: "easeOut" }}
        id="daily-wear"
        className="py-32 md:py-44 px-6 md:px-12 max-w-7xl mx-auto border-t border-[#dfba73]/10 z-10 relative"
      >
        <div className="text-center mb-16">
          <span 
            contentEditable={isDesignMode}
            suppressContentEditableWarning
            onBlur={(e) => handleTextChange("daily_sub", e.currentTarget.textContent || "")}
            className={`font-sans text-xs text-[#dfba73] tracking-[0.3em] uppercase font-bold inline-block ${editOutlineClass}`}
          >
            {customText["daily_sub"] || "Everyday Gold"}
          </span>
          <h2 
            contentEditable={isDesignMode}
            suppressContentEditableWarning
            onBlur={(e) => handleTextChange("daily_title", e.currentTarget.textContent || "")}
            className={`font-serif text-3xl md:text-5xl font-light text-neutral-900 dark:text-neutral-100 mt-2 ${editOutlineClass}`}
          >
            {customText["daily_title"] || "Daily Gold Catalog"}
          </h2>
          <p className="font-sans text-xs md:text-sm text-neutral-500 dark:text-neutral-400 mt-4 max-w-md mx-auto leading-relaxed">
            <span
              contentEditable={isDesignMode}
              suppressContentEditableWarning
              onBlur={(e) => handleTextChange("daily_desc", e.currentTarget.textContent || "")}
              className={editOutlineClass}
            >
              {customText["daily_desc"] || "Dainty, stackable, and hypoallergenic. Solid gold essentials engineered for luxurious everyday comfort."}
            </span>
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {products
            .filter((p) => p.category === "daily-wear")
            .map((product) => (
              <ProductCard
                key={product.id}
                product={product}
                isWishlisted={wishlist.some((item) => item.id === product.id)}
                onWishlistToggle={handleWishlistToggle}
                onQuickView={handleOpenQuickView}
                onAddToCart={handleAddToCart}
                isDesignMode={isDesignMode}
                onUploadPhoto={handleUploadImage}
                onEditText={handleTextChange}
                customText={customText}
              />
            ))}
        </div>
      </motion.section>

      {/* 5.5 PURE STERLING SILVER COLLECTION (New requested feature) */}
      <motion.section
        initial={{ opacity: 0, y: 60 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-100px" }}
        transition={{ duration: 0.8, ease: "easeOut" }}
        id="silver-collection"
        className="py-32 md:py-44 px-6 md:px-12 max-w-7xl mx-auto border-t border-[#dfba73]/10 z-10 relative"
      >
        {/* Cute Cartoon corner ornaments for Silver collection */}
        <CuteCoinCorner className="absolute top-4 left-4 w-12 h-12 pointer-events-none opacity-40 animate-pulse" />
        <CuteGaneshaCorner className="absolute top-4 right-4 w-12 h-12 pointer-events-none opacity-40 animate-bounce" flipX />

        <div className="text-center mb-16">
          <span 
            contentEditable={isDesignMode}
            suppressContentEditableWarning
            onBlur={(e) => handleTextChange("silver_sub", e.currentTarget.textContent || "")}
            className={`font-sans text-xs text-neutral-400 dark:text-[#dfba73] tracking-[0.3em] uppercase font-bold inline-block ${editOutlineClass}`}
          >
            {customText["silver_sub"] || "925 Sterling Silver Edit"}
          </span>
          <h2 
            contentEditable={isDesignMode}
            suppressContentEditableWarning
            onBlur={(e) => handleTextChange("silver_title", e.currentTarget.textContent || "")}
            className={`font-serif text-3xl md:text-5xl font-light text-neutral-900 dark:text-neutral-100 mt-2 ${editOutlineClass}`}
          >
            {customText["silver_title"] || "Sterling Silver Collection"}
          </h2>
          <p className="font-sans text-xs md:text-sm text-neutral-500 dark:text-neutral-400 mt-4 max-w-md mx-auto leading-relaxed">
            <span
              contentEditable={isDesignMode}
              suppressContentEditableWarning
              onBlur={(e) => handleTextChange("silver_desc", e.currentTarget.textContent || "")}
              className={editOutlineClass}
            >
              {customText["silver_desc"] || "Pure hallmarked 925 sterling silver jewelry. Anti-tarnish, hypoallergenic creations crafted for brilliant luster."}
            </span>
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {products
            .filter((p) => p.category === "silver")
            .map((product) => (
              <ProductCard
                key={product.id}
                product={product}
                isWishlisted={wishlist.some((item) => item.id === product.id)}
                onWishlistToggle={handleWishlistToggle}
                onQuickView={handleOpenQuickView}
                onAddToCart={handleAddToCart}
                isDesignMode={isDesignMode}
                onUploadPhoto={handleUploadImage}
                onEditText={handleTextChange}
                customText={customText}
              />
            ))}
        </div>
      </motion.section>

      {/* 6. ABOUT SECTION */}
      <motion.section
        initial={{ opacity: 0, y: 60 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-100px" }}
        transition={{ duration: 0.8, ease: "easeOut" }}
        id="about"
        className="bg-[#dfba73]/3 dark:bg-neutral-950/10 py-32 md:py-44 border-y border-[#dfba73]/10 z-10 relative"
      >
        <div className="max-w-7xl mx-auto px-6 md:px-12 grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          <div className="relative aspect-square border border-[#dfba73]/25 overflow-hidden">
            <img
              src={customAboutImage}
              alt="Artisan Polishing Gold"
              className="w-full h-full object-cover scale-100 hover:scale-105 transition-transform duration-1000"
            />
            {isDesignMode && (
              <label className="absolute inset-0 bg-neutral-900/80 backdrop-blur-xs flex flex-col items-center justify-center text-amber-500 cursor-pointer z-10">
                <Upload className="w-8 h-8 mb-2 animate-bounce" />
                <span className="font-sans text-xs uppercase font-bold tracking-widest">Change About Photo</span>
                <input
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={(e) => handleBannerUpload(e, "about_image")}
                />
              </label>
            )}
            <div className="absolute inset-0 bg-gradient-to-tr from-neutral-950/40 via-transparent to-transparent" />
            <div className="absolute bottom-6 left-6 bg-[#FAF9F5]/95 dark:bg-neutral-950/95 border border-[#dfba73]/20 p-6 max-w-xs z-10">
              <span className="font-serif text-2xl text-gold font-light block">22 Karat</span>
              <span className="font-sans text-xs tracking-wider uppercase text-neutral-600 dark:text-neutral-400">
                Of Uncompromised Purity & Luster.
              </span>
            </div>
          </div>

          <div>
            <span 
              contentEditable={isDesignMode}
              suppressContentEditableWarning
              onBlur={(e) => handleTextChange("about_sub", e.currentTarget.textContent || "")}
              className={`font-sans text-xs text-[#dfba73] tracking-[0.3em] uppercase font-bold inline-block ${editOutlineClass}`}
            >
              {customText["about_sub"] || "Gold Alchemy"}
            </span>
            <h2 
              contentEditable={isDesignMode}
              suppressContentEditableWarning
              onBlur={(e) => handleTextChange("about_title", e.currentTarget.textContent || "")}
              className={`font-serif text-4xl md:text-5xl font-light text-neutral-900 dark:text-neutral-100 mt-2 mb-6 ${editOutlineClass}`}
            >
              {customText["about_title"] || "Omar Jewellers OJ"}
            </h2>
            <p className="font-sans text-sm text-neutral-700 dark:text-neutral-300 font-light leading-relaxed mb-6">
              <span
                contentEditable={isDesignMode}
                suppressContentEditableWarning
                onBlur={(e) => handleTextChange("about_desc1", e.currentTarget.textContent || "")}
                className={editOutlineClass}
              >
                {customText["about_desc1"] || "Founded on the values of trust, master craftsmanship, and absolute purity, **Omar Jewellers OJ** redefines precious metal couture for the self-expressive generation. We formulate our custom-alloyed **Champagne Gold** in-house to offer a warmer, softer metallic tone that glows beautifully on all skin tones."}
              </span>
            </p>
            <p className="font-sans text-sm text-neutral-700 dark:text-neutral-300 font-light leading-relaxed mb-8">
              <span
                contentEditable={isDesignMode}
                suppressContentEditableWarning
                onBlur={(e) => handleTextChange("about_desc2", e.currentTarget.textContent || "")}
                className={editOutlineClass}
              >
                {customText["about_desc2"] || "Every curve, twist, and hammered edge in our pure gold jewelry celebrates the fusion of traditional smithing heritage with modern Gen Z minimalism."}
              </span>
            </p>
            <div className="grid grid-cols-3 gap-4 border-t border-[#dfba73]/10 pt-8">
              <div>
                <span 
                  contentEditable={isDesignMode}
                  suppressContentEditableWarning
                  onBlur={(e) => handleTextChange("about_stat1_val", e.currentTarget.textContent || "")}
                  className={`font-serif text-2xl text-neutral-900 dark:text-neutral-100 inline-block ${editOutlineClass}`}
                >
                  {customText["about_stat1_val"] || "100%"}
                </span>
                <p 
                  contentEditable={isDesignMode}
                  suppressContentEditableWarning
                  onBlur={(e) => handleTextChange("about_stat1_lbl", e.currentTarget.textContent || "")}
                  className={`font-sans text-[10px] tracking-wider uppercase text-neutral-500 dark:text-neutral-400 mt-1 ${editOutlineClass}`}
                >
                  {customText["about_stat1_lbl"] || "Ethical Sourcing"}
                </p>
              </div>
              <div>
                <span 
                  contentEditable={isDesignMode}
                  suppressContentEditableWarning
                  onBlur={(e) => handleTextChange("about_stat2_val", e.currentTarget.textContent || "")}
                  className={`font-serif text-2xl text-neutral-900 dark:text-neutral-100 inline-block ${editOutlineClass}`}
                >
                  {customText["about_stat2_val"] || "Custom"}
                </span>
                <p 
                  contentEditable={isDesignMode}
                  suppressContentEditableWarning
                  onBlur={(e) => handleTextChange("about_stat2_lbl", e.currentTarget.textContent || "")}
                  className={`font-sans text-[10px] tracking-wider uppercase text-neutral-500 dark:text-neutral-400 mt-1 ${editOutlineClass}`}
                >
                  {customText["about_stat2_lbl"] || "Hammered Finishes"}
                </p>
              </div>
              <div>
                <span 
                  contentEditable={isDesignMode}
                  suppressContentEditableWarning
                  onBlur={(e) => handleTextChange("about_stat3_val", e.currentTarget.textContent || "")}
                  className={`font-serif text-2xl text-neutral-900 dark:text-neutral-100 inline-block ${editOutlineClass}`}
                >
                  {customText["about_stat3_val"] || "BIS 916"}
                </span>
                <p 
                  contentEditable={isDesignMode}
                  suppressContentEditableWarning
                  onBlur={(e) => handleTextChange("about_stat3_lbl", e.currentTarget.textContent || "")}
                  className={`font-sans text-[10px] tracking-wider uppercase text-neutral-500 dark:text-neutral-400 mt-1 ${editOutlineClass}`}
                >
                  {customText["about_stat3_lbl"] || "Purity Hallmark"}
                </p>
              </div>
            </div>
          </div>
        </div>
      </motion.section>

      {/* 6.5 MEET OUR FOUNDER (Large Owner Portrait Section - New Requested Feature) */}
      <motion.section
        initial={{ opacity: 0, y: 60 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-100px" }}
        transition={{ duration: 0.8, ease: "easeOut" }}
        className="py-24 px-6 max-w-7xl mx-auto z-10 relative border-b border-[#dfba73]/10"
      >
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          {/* Large portrait frame */}
          <div className="relative aspect-[3/4] md:max-h-[550px] border border-[#dfba73]/25 overflow-hidden group shadow-2xl bg-neutral-950">
            <img
              src={customizedImages["owner_big_photo"] || "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=600&auto=format&fit=crop"}
              alt="Mr. Yogesh Kumar Gupta - Founder"
              className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
            />
            {isDesignMode && (
              <label className="absolute inset-0 bg-neutral-900/80 backdrop-blur-xs flex flex-col items-center justify-center text-amber-500 cursor-pointer z-10">
                <Upload className="w-10 h-10 mb-2 animate-bounce" />
                <span className="font-sans text-xs uppercase font-bold tracking-widest text-center px-4">
                  Upload Large Owner Photo
                </span>
                <input
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={(e) => {
                    const file = e.target.files?.[0];
                    if (file) {
                      const r = new FileReader();
                      r.onloadend = () => {
                        if (typeof r.result === "string") handleUploadImage("owner_big_photo", r.result);
                      };
                      r.readAsDataURL(file);
                    }
                  }}
                />
              </label>
            )}
            <div className="absolute inset-0 bg-gradient-to-t from-neutral-950/40 via-transparent to-transparent pointer-events-none" />
          </div>

          {/* Founder Quotes */}
          <div className="space-y-6">
            <span className="font-sans text-xs text-[#dfba73] tracking-[0.3em] uppercase font-bold">
              The Visionary
            </span>
            <h2 className="font-serif text-4xl md:text-5xl font-light text-neutral-900 dark:text-neutral-100">
              Meet Our Founder
            </h2>
            
            <p className="font-sans text-sm text-neutral-700 dark:text-neutral-300 font-light leading-relaxed italic border-l-2 border-[#dfba73] pl-4">
              <span
                contentEditable={isDesignMode}
                suppressContentEditableWarning
                onBlur={(e) => handleTextChange("founder_quote_txt", e.currentTarget.textContent || "")}
                className={editOutlineClass}
              >
                {customText["founder_quote_txt"] || "“Jewellery is not merely an ornament; it is a timestamp of your legacy. When we hand-craft pure gold at Omar Jewellers OJ, we are shaping stories of love, heritage, and pride that will be passed down for generations.”"}
              </span>
            </p>

            <p className="font-sans text-sm text-neutral-700 dark:text-neutral-300 font-light leading-relaxed">
              <span
                contentEditable={isDesignMode}
                suppressContentEditableWarning
                onBlur={(e) => handleTextChange("founder_quote_desc", e.currentTarget.textContent || "")}
                className={editOutlineClass}
              >
                {customText["founder_quote_desc"] || "Under the guidance of Mr. Yogesh Kumar Gupta, our boutique has remained committed to absolute transparency, sourcing only BIS 916 hallmarked solid gold alloyed in-house. We strive to provide a modern, minimalist design approach suited for Gen Z self-expression without losing our traditional showroom roots."}
              </span>
            </p>

            <div className="pt-6">
              <h4 
                contentEditable={isDesignMode}
                suppressContentEditableWarning
                onBlur={(e) => handleTextChange("founder_sign_name", e.currentTarget.textContent || "")}
                className={`font-serif text-2xl text-[#dfba73] italic font-semibold ${editOutlineClass}`}
              >
                {customText["founder_sign_name"] || "Yogesh Kumar Gupta"}
              </h4>
              <p 
                contentEditable={isDesignMode}
                suppressContentEditableWarning
                onBlur={(e) => handleTextChange("founder_sign_title", e.currentTarget.textContent || "")}
                className={`font-sans text-[10px] uppercase tracking-widest text-neutral-500 dark:text-neutral-400 mt-1 font-bold ${editOutlineClass}`}
              >
                {customText["founder_sign_title"] || "Founder, Omar Jewellers OJ"}
              </p>
            </div>
          </div>
        </div>
      </motion.section>

      {/* 7. CUSTOMER REVIEWS */}
      <motion.section
        initial={{ opacity: 0, y: 60 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-100px" }}
        transition={{ duration: 0.8, ease: "easeOut" }}
        id="reviews"
        className="py-32 md:py-44 px-6 md:px-12 max-w-7xl mx-auto z-10 relative"
      >
        <div className="text-center mb-16">
          <span 
            contentEditable={isDesignMode}
            suppressContentEditableWarning
            onBlur={(e) => handleTextChange("rev_sub", e.currentTarget.textContent || "")}
            className={`font-sans text-xs text-[#dfba73] tracking-[0.3em] uppercase font-bold inline-block ${editOutlineClass}`}
          >
            {customText["rev_sub"] || "Testimonials"}
          </span>
          <h2 
            contentEditable={isDesignMode}
            suppressContentEditableWarning
            onBlur={(e) => handleTextChange("rev_title", e.currentTarget.textContent || "")}
            className={`font-serif text-3xl md:text-5xl font-light text-neutral-900 dark:text-neutral-100 mt-2 ${editOutlineClass}`}
          >
            {customText["rev_title"] || "Gold Collector Reviews"}
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {[
            {
              name: "Amara K.",
              role: "Verified Buyer",
              text: "“The Hammered Choker is an absolute dream! It’s light yet makes me feel like royalty. The gold color is so warm and different from typical brassy jewelry. A must-have!”",
              img: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=200&auto=format&fit=crop",
              id: "rev1"
            },
            {
              name: "Rohit S.",
              role: "Bespoke Bridal Client",
              text: "“Stunning craftsmanship. We ordered the Temple Floral Collar and customized the hanging gold beads. The team shared design blueprints on WhatsApp and completed the set perfectly.”",
              img: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=200&auto=format&fit=crop",
              id: "rev2"
            },
            {
              name: "Zoe L.",
              role: "Daily Wear Fan",
              text: "“I wear the Helix bracelet and sphere studs daily. They have been submerged in water, perfume, and still shine with that authentic luxury luster. OJ is my go-to for gold.”",
              img: "https://images.unsplash.com/photo-1517841905240-472988babdf9?q=80&w=200&auto=format&fit=crop",
              id: "rev3"
            }
          ].map((review, i) => (
            <motion.div
              whileHover={{ y: -6 }}
              transition={{ duration: 0.3 }}
              key={i}
              className="bg-white/40 dark:bg-[#0F0E0B]/40 border border-[#dfba73]/10 p-8 flex flex-col justify-between hover:border-[#dfba73] transition-all duration-300 relative group shadow-sm rounded-sm overflow-hidden"
            >
              {/* Corner Accents on Card */}
              <GoldCorner className="absolute top-1 left-1 w-6 h-6 pointer-events-none opacity-40" />
              <GoldCorner className="absolute bottom-1 right-1 w-6 h-6 pointer-events-none opacity-40" flipX flipY />

              <div>
                <div className="flex gap-1 mb-4">
                  {Array.from({ length: 5 }).map((_, idx) => (
                    <span key={idx} className="text-[#dfba73] text-sm">
                      ★
                    </span>
                  ))}
                </div>
                <p 
                  contentEditable={isDesignMode}
                  suppressContentEditableWarning
                  onBlur={(e) => handleTextChange(`rev_text_${review.id}`, e.currentTarget.textContent || "")}
                  className={`font-sans text-sm italic text-neutral-800 dark:text-neutral-200 leading-relaxed ${editOutlineClass}`}
                >
                  {customText[`rev_text_${review.id}`] || review.text}
                </p>
              </div>

              {/* Review Avatar Image Uploader */}
              <div className="flex items-center gap-4 mt-8 pt-4 border-t border-[#dfba73]/10">
                <div className="relative w-10 h-10 rounded-full overflow-hidden border border-[#dfba73]/25 shrink-0">
                  <img
                    src={customizedImages[`rev_avatar_${review.id}`] || review.img}
                    alt={review.name}
                    className="w-full h-full object-cover"
                  />
                  {isDesignMode && (
                    <label className="absolute inset-0 bg-neutral-900/80 backdrop-blur-xs flex items-center justify-center text-amber-500 cursor-pointer z-10">
                      <Upload className="w-3.5 h-3.5" />
                      <input
                        type="file"
                        accept="image/*"
                        className="hidden"
                        onChange={(e) => {
                          const file = e.target.files?.[0];
                          if (file) {
                            const r = new FileReader();
                            r.onloadend = () => {
                              if (typeof r.result === "string") handleUploadImage(`rev_avatar_${review.id}`, r.result);
                            };
                            r.readAsDataURL(file);
                          }
                        }}
                      />
                    </label>
                  )}
                </div>
                <div>
                  <h4 
                    contentEditable={isDesignMode}
                    suppressContentEditableWarning
                    onBlur={(e) => handleTextChange(`rev_name_${review.id}`, e.currentTarget.textContent || "")}
                    className={`font-serif text-base text-neutral-900 dark:text-neutral-100 font-semibold inline-block ${editOutlineClass}`}
                  >
                    {customText[`rev_name_${review.id}`] || review.name}
                  </h4>
                  <p 
                    contentEditable={isDesignMode}
                    suppressContentEditableWarning
                    onBlur={(e) => handleTextChange(`rev_role_${review.id}`, e.currentTarget.textContent || "")}
                    className={`font-sans text-[10px] tracking-wider uppercase text-neutral-500 dark:text-neutral-400 mt-0.5 ${editOutlineClass}`}
                  >
                    {customText[`rev_role_${review.id}`] || review.role}
                  </p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </motion.section>

      {/* 8. INSTAGRAM-STYLE GALLERY */}
      <section id="gallery" className="py-32 md:py-44 border-t border-[#dfba73]/10 bg-white/5 dark:bg-neutral-950/10 z-10 relative">
        <div className="text-center mb-16">
          <span 
            contentEditable={isDesignMode}
            suppressContentEditableWarning
            onBlur={(e) => handleTextChange("ig_sub", e.currentTarget.textContent || "")}
            className={`font-sans text-xs text-[#dfba73] tracking-[0.3em] uppercase font-bold inline-block ${editOutlineClass}`}
          >
            {customText["ig_sub"] || "Instagram Feed"}
          </span>
          <h2 
            contentEditable={isDesignMode}
            suppressContentEditableWarning
            onBlur={(e) => handleTextChange("ig_title", e.currentTarget.textContent || "")}
            className={`font-serif text-3xl md:text-5xl font-light text-neutral-900 dark:text-neutral-100 mt-2 ${editOutlineClass}`}
          >
            {customText["ig_title"] || "#OmarJewellersOJ"}
          </h2>
          <p className="font-sans text-xs md:text-sm text-neutral-500 dark:text-neutral-400 mt-2">
            <span
              contentEditable={isDesignMode}
              suppressContentEditableWarning
              onBlur={(e) => handleTextChange("ig_desc", e.currentTarget.textContent || "")}
              className={editOutlineClass}
            >
              {customText["ig_desc"] || "Tag us in your gold stacks to be featured."}
            </span>
          </p>
        </div>

        <div className="max-w-7xl mx-auto px-6 grid grid-cols-2 md:grid-cols-4 gap-4">
          {[
            "https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?q=80&w=500&auto=format&fit=crop",
            "https://images.unsplash.com/photo-1605100804763-247f67b3557e?q=80&w=500&auto=format&fit=crop",
            "https://images.unsplash.com/photo-1611591437281-460bfbe1220a?q=80&w=500&auto=format&fit=crop",
            "https://images.unsplash.com/photo-1635767798638-3e25273a8236?q=80&w=500&auto=format&fit=crop",
            "https://images.unsplash.com/photo-1603561591411-07134e71a2a9?q=80&w=500&auto=format&fit=crop",
            "https://images.unsplash.com/photo-1573408301185-9146fe634ad0?q=80&w=500&auto=format&fit=crop",
            "https://images.unsplash.com/photo-1535632066927-ab7c9ab60908?q=80&w=500&auto=format&fit=crop",
            "https://images.unsplash.com/photo-1599643477877-530eb83abc8e?q=80&w=500&auto=format&fit=crop"
          ].map((imgUrl, idx) => (
            <div
              key={idx}
              className="relative group block aspect-square overflow-hidden border border-[#dfba73]/10"
            >
              <img
                src={customizedImages[`gallery_${idx}`] || imgUrl}
                alt="Gold jewellery details"
                className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
              />

              {isDesignMode && (
                <label className="absolute inset-0 bg-neutral-900/80 backdrop-blur-xs flex flex-col items-center justify-center text-[#dfba73] cursor-pointer z-10">
                  <Upload className="w-5 h-5 mb-1" />
                  <span className="font-sans text-[9px] uppercase font-bold">Replace Post</span>
                  <input
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={(e) => {
                      const file = e.target.files?.[0];
                      if (file) {
                        const r = new FileReader();
                        r.onloadend = () => {
                          if (typeof r.result === "string") handleUploadImage(`gallery_${idx}`, r.result);
                        };
                        r.readAsDataURL(file);
                      }
                    }}
                  />
                </label>
              )}

              <div className="absolute inset-0 bg-neutral-950/50 opacity-0 group-hover:opacity-100 transition-all duration-300 flex items-center justify-center">
                <Instagram className="w-8 h-8 text-[#FAF9F5] hover:text-[#dfba73] hover:scale-110 transition-transform" />
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* 9. CONTACT / INQUIRY SECTION */}
      <motion.section
        initial={{ opacity: 0, y: 60 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-100px" }}
        transition={{ duration: 0.8, ease: "easeOut" }}
        id="contact"
        className="py-32 md:py-44 px-6 md:px-12 max-w-7xl mx-auto border-t border-[#dfba73]/10 z-10 relative"
      >
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">
          <div>
            <span 
              contentEditable={isDesignMode}
              suppressContentEditableWarning
              onBlur={(e) => handleTextChange("cont_sub", e.currentTarget.textContent || "")}
              className={`font-sans text-xs text-[#dfba73] tracking-[0.3em] uppercase font-bold inline-block ${editOutlineClass}`}
            >
              {customText["cont_sub"] || "Reach Out"}
            </span>
            <h2 
              contentEditable={isDesignMode}
              suppressContentEditableWarning
              onBlur={(e) => handleTextChange("cont_title", e.currentTarget.textContent || "")}
              className={`font-serif text-3xl md:text-5xl font-light text-neutral-900 dark:text-neutral-100 mt-2 mb-6 ${editOutlineClass}`}
            >
              {customText["cont_title"] || "Connect With Us"}
            </h2>
            <p className="font-sans text-sm text-neutral-700 dark:text-neutral-300 font-light leading-relaxed mb-8">
              <span
                contentEditable={isDesignMode}
                suppressContentEditableWarning
                onBlur={(e) => handleTextChange("cont_desc", e.currentTarget.textContent || "")}
                className={editOutlineClass}
              >
                {customText["cont_desc"] || "Have questions about custom sizing, gold weight, commissions, or booking a private viewing? Connect directly with our concierge team."}
              </span>
            </p>

            {/* Premium Owner Profile Card */}
            <div className="bg-[#dfba73]/5 border border-[#dfba73]/20 p-5 rounded-sm flex items-center gap-5 mb-8 relative group hover:border-[#dfba73]/50 transition-colors">
              <div className="relative w-16 h-16 rounded-full overflow-hidden border border-[#dfba73]/40 shrink-0 shadow-lg">
                <img
                  src={customizedImages["owner_photo"] || "https://images.unsplash.com/photo-1560250097-0b93528c311a?q=80&w=200&auto=format&fit=crop"}
                  alt="Mr. Yogesh Kumar Gupta"
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                />
                {isDesignMode && (
                  <label className="absolute inset-0 bg-neutral-900/85 backdrop-blur-xs flex flex-col items-center justify-center text-amber-500 cursor-pointer z-10 text-[9px] uppercase font-bold text-center">
                    <Upload className="w-4 h-4 mb-0.5" />
                    Upload
                    <input
                      type="file"
                      accept="image/*"
                      className="hidden"
                      onChange={(e) => {
                        const file = e.target.files?.[0];
                        if (file) {
                          const r = new FileReader();
                          r.onloadend = () => {
                            if (typeof r.result === "string") handleUploadImage("owner_photo", r.result);
                          };
                          r.readAsDataURL(file);
                        }
                      }}
                    />
                  </label>
                )}
              </div>
              <div>
                <h4 
                  contentEditable={isDesignMode}
                  suppressContentEditableWarning
                  onBlur={(e) => handleTextChange("owner_card_name", e.currentTarget.textContent || "")}
                  className={`font-serif text-base text-neutral-900 dark:text-neutral-100 font-bold ${editOutlineClass}`}
                >
                  {customText["owner_card_name"] || "Mr. Yogesh Kumar Gupta"}
                </h4>
                <p 
                  contentEditable={isDesignMode}
                  suppressContentEditableWarning
                  onBlur={(e) => handleTextChange("owner_card_role", e.currentTarget.textContent || "")}
                  className={`font-sans text-[10px] uppercase tracking-wider text-[#dfba73] font-semibold ${editOutlineClass}`}
                >
                  {customText["owner_card_role"] || "Managing Director & Boutique Founder"}
                </p>
                <p className="font-sans text-[10px] text-neutral-500 mt-0.5">
                  Shahabad Hardoi gold showroom headquarters
                </p>
              </div>
            </div>

            <div className="space-y-6">
              <div className="flex gap-4">
                <MapPin className="w-5 h-5 text-[#dfba73] shrink-0 mt-0.5" />
                <div>
                  <h4 
                    contentEditable={isDesignMode}
                    suppressContentEditableWarning
                    onBlur={(e) => handleTextChange("cont_lbl1", e.currentTarget.textContent || "")}
                    className={`font-serif text-base text-neutral-900 dark:text-neutral-100 inline-block ${editOutlineClass}`}
                  >
                    {customText["cont_lbl1"] || "Our Boutique Address"}
                  </h4>
                  <p className="font-sans text-xs text-neutral-500 dark:text-neutral-400 mt-1">
                    <span
                      contentEditable={isDesignMode}
                      suppressContentEditableWarning
                      onBlur={(e) => handleTextChange("cont_val1", e.currentTarget.textContent || "")}
                      className={editOutlineClass}
                    >
                      {customText["cont_val1"] || "Chowk, Shahabad, Hardoi, Uttar Pradesh, India"}
                    </span>
                  </p>
                </div>
              </div>
              <div className="flex gap-4">
                <Phone className="w-5 h-5 text-[#dfba73] shrink-0 mt-0.5" />
                <div>
                  <h4 
                    contentEditable={isDesignMode}
                    suppressContentEditableWarning
                    onBlur={(e) => handleTextChange("cont_lbl2", e.currentTarget.textContent || "")}
                    className={`font-serif text-base text-neutral-900 dark:text-neutral-100 inline-block ${editOutlineClass}`}
                  >
                    {customText["cont_lbl2"] || "Direct Showroom Contact"}
                  </h4>
                  <p className="font-sans text-xs text-neutral-500 dark:text-neutral-400 mt-1">
                    WhatsApp: +91 {whatsAppNumber}
                  </p>
                </div>
              </div>
              <div className="flex gap-4">
                <Mail className="w-5 h-5 text-[#dfba73] shrink-0 mt-0.5" />
                <div>
                  <h4 
                    contentEditable={isDesignMode}
                    suppressContentEditableWarning
                    onBlur={(e) => handleTextChange("cont_lbl3", e.currentTarget.textContent || "")}
                    className={`font-serif text-base text-neutral-900 dark:text-neutral-100 inline-block ${editOutlineClass}`}
                  >
                    {customText["cont_lbl3"] || "Email Support"}
                  </h4>
                  <p className="font-sans text-xs text-neutral-500 dark:text-neutral-400 mt-1">
                    <span
                      contentEditable={isDesignMode}
                      suppressContentEditableWarning
                      onBlur={(e) => handleTextChange("cont_val3", e.currentTarget.textContent || "")}
                      className={editOutlineClass}
                    >
                      {customText["cont_val3"] || "concierge@omarjewellers.com"}
                    </span>
                  </p>
                </div>
              </div>
              <div className="flex gap-4">
                <Clock className="w-5 h-5 text-[#dfba73] shrink-0 mt-0.5" />
                <div>
                  <h4 
                    contentEditable={isDesignMode}
                    suppressContentEditableWarning
                    onBlur={(e) => handleTextChange("cont_lbl4", e.currentTarget.textContent || "")}
                    className={`font-serif text-base text-neutral-900 dark:text-neutral-100 inline-block ${editOutlineClass}`}
                  >
                    {customText["cont_lbl4"] || "Boutique Hours"}
                  </h4>
                  <p className="font-sans text-xs text-neutral-500 dark:text-neutral-400 mt-1">
                    <span
                      contentEditable={isDesignMode}
                      suppressContentEditableWarning
                      onBlur={(e) => handleTextChange("cont_val4", e.currentTarget.textContent || "")}
                      className={editOutlineClass}
                    >
                      {customText["cont_val4"] || "Mon - Sat: 11:00 AM - 8:30 PM (IST)"}
                    </span>
                  </p>
                </div>
              </div>
            </div>

            {/* Premium WhatsApp Button connected directly to custom WhatsApp number */}
            <button
              onClick={handleGeneralWhatsApp}
              className="mt-10 inline-flex items-center gap-3 px-8 py-4 bg-[#dfba73] hover:bg-[#c5a059] text-neutral-950 font-sans text-xs font-bold tracking-widest uppercase transition-all duration-300 w-full sm:w-auto justify-center rounded-sm shadow-md"
            >
              <MessageCircle className="w-5 h-5" />
              Chat on WhatsApp
            </button>
          </div>

          <div>
            <div className="bg-white/30 dark:bg-neutral-900/30 border border-[#dfba73]/15 p-8 rounded-sm">
              <h3 
                contentEditable={isDesignMode}
                suppressContentEditableWarning
                onBlur={(e) => handleTextChange("inq_form_title", e.currentTarget.textContent || "")}
                className={`font-serif text-2xl text-neutral-900 dark:text-neutral-100 mb-1 inline-block ${editOutlineClass}`}
              >
                {customText["inq_form_title"] || "Gold Order Inquiry"}
              </h3>
              <p className="font-sans text-[9px] text-[#dfba73] uppercase tracking-wider font-semibold mb-6">
                ✈ Inquiry logs route directly to your backside admin console.
              </p>
              
              <form onSubmit={handleContactSubmit} className="space-y-6">
                <div>
                  <label className="block font-sans text-xs tracking-wider uppercase text-neutral-500 dark:text-neutral-400 mb-2 font-semibold">
                    Your Name
                  </label>
                  <input
                    type="text"
                    required
                    value={formState.name}
                    onChange={(e) => setFormState({ ...formState, name: e.target.value })}
                    className="w-full bg-white dark:bg-neutral-900 border border-gold/20 focus:border-[#dfba73] py-3 px-4 outline-none font-sans text-sm text-neutral-900 dark:text-neutral-100 transition-colors rounded-sm"
                    placeholder="Enter name"
                  />
                </div>
                <div>
                  <label className="block font-sans text-xs tracking-wider uppercase text-neutral-500 dark:text-neutral-400 mb-2 font-semibold">
                    Email Address
                  </label>
                  <input
                    type="email"
                    required
                    value={formState.email}
                    onChange={(e) => setFormState({ ...formState, email: e.target.value })}
                    className="w-full bg-white dark:bg-neutral-900 border border-gold/20 focus:border-[#dfba73] py-3 px-4 outline-none font-sans text-sm text-neutral-900 dark:text-neutral-100 transition-colors rounded-sm"
                    placeholder="Enter email"
                  />
                </div>
                <div>
                  <label className="block font-sans text-xs tracking-wider uppercase text-neutral-500 dark:text-neutral-400 mb-2 font-semibold">
                    Phone / WhatsApp Number
                  </label>
                  <input
                    type="tel"
                    required
                    value={formState.phone}
                    onChange={(e) => setFormState({ ...formState, phone: e.target.value })}
                    className="w-full bg-white dark:bg-neutral-900 border border-gold/20 focus:border-[#dfba73] py-3 px-4 outline-none font-sans text-sm text-neutral-900 dark:text-neutral-100 transition-colors rounded-sm"
                    placeholder="Enter Phone/WhatsApp (e.g. +91 99364 88845)"
                  />
                </div>
                <div>
                  <label className="block font-sans text-xs tracking-wider uppercase text-neutral-500 dark:text-neutral-400 mb-2 font-semibold">
                    Custom Requests & Details
                  </label>
                  <textarea
                    rows={4}
                    required
                    value={formState.message}
                    onChange={(e) => setFormState({ ...formState, message: e.target.value })}
                    className="w-full bg-white dark:bg-neutral-900 border border-gold/20 focus:border-[#dfba73] py-3 px-4 outline-none font-sans text-sm text-neutral-900 dark:text-neutral-100 transition-colors rounded-sm resize-none"
                    placeholder="Describe custom sizes, carat requirements, or catalog questions..."
                  />
                </div>

                <button
                  type="submit"
                  className="w-full py-4 bg-neutral-950 dark:bg-neutral-100 text-neutral-100 dark:text-neutral-950 border border-[#dfba73]/30 hover:bg-[#dfba73] hover:text-neutral-950 font-sans text-xs font-bold tracking-widest uppercase transition-all duration-300 flex items-center justify-center gap-2 rounded-sm"
                >
                  <Send className="w-4 h-4" />
                  Send Order Inquiry
                </button>
              </form>

              {formSubmitted && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="mt-4 p-3 bg-green-500/10 border border-green-500/30 text-green-600 dark:text-green-400 font-sans text-xs font-semibold text-center rounded-sm"
                >
                  Thank you! Inquiry logged in Backside Console.
                </motion.div>
              )}
            </div>
          </div>
        </div>
      </motion.section>

      {/* 10. FOOTER */}
      <footer className="bg-neutral-950 text-neutral-100 border-t border-[#dfba73]/15 py-16 px-6 z-10 relative">
        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-12">
          {/* Col 1: Brand Info */}
          <div>
            <span className="font-serif text-2xl tracking-[0.2em] text-[#dfba73] uppercase block">
              OMAR JEWELLERS
            </span>
            <span className="font-sans text-[10px] tracking-[0.45em] text-neutral-400 uppercase mt-0.5 block font-bold">
              OJ • LUXURY FINE GOLD
            </span>
            <p className="font-sans text-xs text-neutral-400 mt-6 leading-relaxed font-light">
              Crafting fine 18k and 22k gold masterpieces, customized bridal wear, and dainty everyday gold ornaments.
            </p>
            <p className="font-sans text-xs text-neutral-500 mt-4 leading-relaxed font-light">
              <strong>Owner:</strong> Mr. Yogesh Kumar Gupta<br />
              <strong>Store:</strong> Chowk, Shahabad, Hardoi
            </p>
          </div>

          {/* Col 2: Quick Links */}
          <div>
            <h4 className="font-serif text-lg text-[#dfba73] mb-6 font-medium">Gold Catalogs</h4>
            <ul className="space-y-3 font-sans text-xs text-neutral-400">
              {["New Arrivals", "Best Sellers", "Bridal Edit", "Daily Wear Catalog", "Our Story"].map((link) => (
                <li key={link}>
                  <a
                    href={`#${link.toLowerCase().replace(" ", "-")}`}
                    className="hover:text-[#dfba73] transition-colors block"
                  >
                    {link}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Col 3: Customer Care */}
          <div>
            <h4 className="font-serif text-lg text-[#dfba73] mb-6 font-medium">Concierge Services</h4>
            <ul className="space-y-3 font-sans text-xs text-neutral-400">
              <li>Booking Custom Fittings</li>
              <li>Gold Weight Guide</li>
              <li>Purity & Hallmarking Policy</li>
              <li>Global Secured Insured Shipping</li>
              <li>Boutique Locations</li>
            </ul>
          </div>

          {/* Col 4: Newsletter */}
          <div>
            <h4 className="font-serif text-lg text-[#dfba73] mb-6 font-medium">Newsletter</h4>
            <p className="font-sans text-xs text-neutral-400 mb-4 leading-relaxed">
              Subscribe to unlock VIP access to early gold drops and private sales.
            </p>
            <div className="flex border border-neutral-800 rounded-sm overflow-hidden focus-within:border-[#dfba73] transition-colors">
              <input
                type="email"
                placeholder="Your email address"
                className="bg-transparent text-xs py-3 px-4 outline-none w-full font-sans text-neutral-100"
              />
              <button className="bg-[#dfba73] hover:bg-[#c5a059] text-neutral-950 px-4 font-sans text-xs font-bold uppercase transition-colors">
                Join
              </button>
            </div>
            {/* Social icons */}
            <div className="flex gap-4 mt-6">
              <a href="#" className="p-2 border border-neutral-800 rounded-full hover:text-gold hover:border-gold transition-all">
                <Instagram className="w-4 h-4" />
              </a>
              <a href="#" className="p-2 border border-neutral-800 rounded-full hover:text-gold hover:border-gold transition-all">
                <Facebook className="w-4 h-4" />
              </a>
              <a href="#" className="p-2 border border-neutral-800 rounded-full hover:text-gold hover:border-gold transition-all">
                <Twitter className="w-4 h-4" />
              </a>
            </div>
          </div>
        </div>

        {/* Bottom border & copyright */}
        <div className="max-w-7xl mx-auto border-t border-neutral-800 mt-16 pt-8 flex flex-col sm:flex-row items-center justify-between font-sans text-[11px] text-neutral-500">
          <p>© 2026 Omar Jewellers OJ. All Rights Reserved.</p>
          <div className="flex gap-6 mt-4 sm:mt-0">
            <span className="hover:text-gold transition-colors cursor-pointer">Privacy Policy</span>
            <span className="hover:text-gold transition-colors cursor-pointer">Terms of Service</span>
            <span className="hover:text-[#dfba73] transition-colors cursor-pointer font-bold">
              <a href="/admin">Backside Console</a>
            </span>
          </div>
        </div>
      </footer>

      {/* Floating Design Studio Customizer Widget - Golden Pill Button */}
      <div className="fixed bottom-6 right-6 z-40 flex flex-col items-end gap-3 max-w-[320px]">
        <AnimatePresence>
          {isDesignMode && (
            <motion.div
              initial={{ opacity: 0, y: 10, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 10, scale: 0.95 }}
              className="bg-neutral-950/95 border border-[#dfba73]/40 text-neutral-100 p-4 shadow-2xl w-full flex flex-col gap-3 rounded-sm"
            >
              <h5 className="font-serif text-sm tracking-wide text-[#dfba73] border-b border-[#dfba73]/25 pb-1 flex items-center justify-between">
                <span>Owner Design Panel</span>
                <Lock className="w-3.5 h-3.5 text-[#dfba73]/60" />
              </h5>
              
              <p className="font-sans text-[10px] text-neutral-300 leading-normal">
                ✍ **Text Editing**: Click directly on any text block outlined in dashed gold lines to type and change it! Works inside Quick View modals too!
              </p>
              
              <p className="font-sans text-[10px] text-neutral-300 leading-normal">
                🖼 **Photo Editing**: Hover and click the upload button overlays on pictures (products, banners, reviews, owner avatar) to change them.
              </p>

              {/* WhatsApp Configurator */}
              <div className="border-t border-[#dfba73]/20 pt-2.5">
                <label className="block font-sans text-[9px] uppercase tracking-wider text-[#dfba73] font-bold mb-1">
                  Connect to WhatsApp Number:
                </label>
                <div className="flex items-center border border-neutral-800 rounded-sm overflow-hidden bg-neutral-900 focus-within:border-[#dfba73] transition-colors">
                  <span className="bg-neutral-800 px-2 py-1 font-sans text-xs text-neutral-400 border-r border-neutral-800">+91</span>
                  <input
                    type="text"
                    value={whatsAppNumber}
                    onChange={(e) => handleWhatsAppUpdate(e.target.value)}
                    placeholder="WhatsApp Phone"
                    className="bg-transparent text-xs py-1.5 px-2 outline-none w-full font-sans text-neutral-100"
                  />
                </div>
              </div>

              <div className="flex gap-2 border-t border-[#dfba73]/20 pt-3">
                <button
                  onClick={handleResetAllEdits}
                  className="flex-1 py-1.5 bg-neutral-900 border border-red-500/30 hover:bg-red-500/10 text-red-400 font-sans text-[9px] font-bold uppercase tracking-wider transition-colors flex items-center justify-center gap-1.5"
                >
                  <RefreshCw className="w-3.5 h-3.5" />
                  Reset Website
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        <button
          onClick={handleToggleDesignMode}
          className={`px-5 py-3 rounded-full shadow-2xl font-sans text-xs font-bold tracking-widest uppercase transition-all duration-300 flex items-center gap-2 border ${
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
              Edit Website
            </>
          )}
        </button>
        {/* Floating Sitar Ambient Music Player */}
        <button
          onClick={() => {
            if (isSitarPlaying) {
              sitarAudioRef.current?.pause();
            } else {
              sitarAudioRef.current?.play().catch((err) => console.log("Audio play blocked by browser:", err));
            }
            setIsSitarPlaying(!isSitarPlaying);
          }}
          className="fixed bottom-6 left-6 z-40 bg-neutral-950/95 border border-[#dfba73]/30 hover:border-[#dfba73] text-[#dfba73] px-4 py-2.5 rounded-full shadow-2xl flex items-center gap-2.5 transition-all text-[10px] uppercase tracking-widest font-bold font-sans hover:scale-105"
          title={isSitarPlaying ? "Mute Ambient Sitar" : "Play Ambient Sitar"}
        >
          <div className="flex gap-0.5 items-end h-3 w-4">
            {isSitarPlaying ? (
              <>
                <div className="w-[2.5px] bg-[#dfba73] animate-eq-bar-1 h-3" />
                <div className="w-[2.5px] bg-[#dfba73] animate-eq-bar-2 h-1.5" />
                <div className="w-[2.5px] bg-[#dfba73] animate-eq-bar-3 h-2" />
              </>
            ) : (
              <>
                <div className="w-[2.5px] bg-[#dfba73]/50 h-1" />
                <div className="w-[2.5px] bg-[#dfba73]/50 h-1" />
                <div className="w-[2.5px] bg-[#dfba73]/50 h-1" />
              </>
            )}
          </div>
          <span>{isSitarPlaying ? "Mute Sitar Ambient" : "Play Sitar Ambient"}</span>
        </button>
      </div>

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
