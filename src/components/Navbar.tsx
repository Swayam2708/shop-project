"use client";

import React, { useState, useEffect } from "react";
import { ShoppingBag, Heart, Menu, X, Search, Trash2, ArrowRight, Camera, Mic, User } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { Product } from "@/data/products";

interface NavbarProps {
  wishlist: Product[];
  removeFromWishlist: (id: string) => void;
  cart: { product: Product; quantity: number }[];
  removeFromCart: (id: string) => void;
  onOpenQuickView: (product: Product) => void;
  onOpenInquiry: (product: Product, quantity?: number) => void;
  customText?: Record<string, string>;
  activeCategory?: string;
  setActiveCategory?: (cat: string) => void;
}

export default function Navbar({
  wishlist,
  removeFromWishlist,
  cart,
  removeFromCart,
  onOpenQuickView,
  onOpenInquiry,
  customText = {},
  activeCategory = "all",
  setActiveCategory,
}: NavbarProps) {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isWishlistOpen, setIsWishlistOpen] = useState(false);
  const [isCartOpen, setIsCartOpen] = useState(false);

  // Real-time market rates simulation inside Navbar
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
    // Load baseline rates
    const base24k = localStorage.getItem("oj_base_price_24k");
    const base22k = localStorage.getItem("oj_base_price_22k");
    const base18k = localStorage.getItem("oj_base_price_18k");
    const baseSilver = localStorage.getItem("oj_base_price_silver");

    if (base24k || base22k || base18k || baseSilver) {
      // Use custom owner overrides
      setMarketRates((prev) => ({
        ...prev,
        g24k: parseFloat(base24k || "7650"),
        g22k: parseFloat(base22k || "7015"),
        g18k: parseFloat(base18k || "5740"),
        s999: parseFloat(baseSilver || "92"),
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

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 20) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const cartTotal = cart.reduce(
    (total, item) => total + item.product.price * item.quantity,
    0
  );

  return (
    <>
      <nav
        className={`fixed top-0 left-0 w-full z-40 transition-all duration-300 ${
          isScrolled
            ? "glass-scrolled shadow-md"
            : "glass"
        }`}
      >
        {/* ॐ Sacred Slogans & Auspicious Blessings Header Bar */}
        <div className="bg-neutral-950 border-b border-[#dfba73]/25 py-2 px-4 flex justify-between items-center text-[10px] sm:text-xs font-serif text-[#dfba73] tracking-[0.2em] relative uppercase z-50">
          <div className="flex items-center gap-1.5 shrink-0">
            <span className="text-sm font-bold animate-pulse text-[#dfba73] font-serif">ॐ</span>
            <span className="hidden md:inline font-sans text-[8px] text-neutral-400 tracking-wider font-semibold">
              {customText["nav_left_txt"] || "SHAHABAD HARDOI CHOWK"}
            </span>
          </div>
          <div className="text-center font-bold font-serif flex items-center gap-2 sm:gap-4 overflow-x-auto whitespace-nowrap px-2 scrollbar-none mx-auto text-[#dfba73] select-none text-[11px] sm:text-xs">
            <span>{customText["nav_blessings"] || "ॐ श्री गणेशाय नमः • ॐ नमः शिवाय • शुभ लाभ"}</span>
          </div>
          <div className="flex items-center gap-1.5 shrink-0">
            <span className="hidden md:inline font-sans text-[8px] text-neutral-400 tracking-wider font-semibold">
              {customText["nav_right_txt"] || "100% BIS HALLMARKED PURE GOLD"}
            </span>
            <span className="text-sm font-bold animate-pulse text-[#dfba73] font-serif">ॐ</span>
          </div>
        </div>

        {/* Live Market Gold & Silver Rates Ticker */}
        <div className="bg-[#dfba73]/10 border-b border-[#dfba73]/20 py-1.5 px-4 text-[9px] sm:text-xs font-sans tracking-wider text-neutral-800 dark:text-neutral-200 relative select-none overflow-hidden z-50">
          <div className="max-w-7xl mx-auto flex items-center justify-between gap-4">
            <div className="flex items-center gap-1.5 shrink-0">
              <span className="inline-block w-1.5 h-1.5 rounded-full bg-green-500 animate-ping shrink-0" />
              <span className="font-extrabold uppercase text-[8px] sm:text-[9px] text-[#b8912b] tracking-wider">LIVE HARDOI RATES:</span>
            </div>
            <div className="flex items-center gap-4 sm:gap-6 text-[9px] sm:text-[11px] font-mono overflow-x-auto whitespace-nowrap scrollbar-none py-0.5 mx-auto">
              <span className="flex items-center gap-1">
                Gold 24K: <span className="font-bold text-neutral-900 dark:text-white">₹{marketRates.g24k.toLocaleString()}/g</span>
                <span className={marketRates.g24kDiff >= 0 ? "text-green-500 font-bold" : "text-red-500 font-bold"}>
                  ({marketRates.g24kDiff >= 0 ? "▲" : "▼"}{Math.abs(marketRates.g24kDiff).toFixed(2)}%)
                </span>
              </span>
              <span className="text-[#dfba73]/30">|</span>
              <span className="flex items-center gap-1">
                Gold 22K: <span className="font-bold text-neutral-900 dark:text-white">₹{marketRates.g22k.toLocaleString()}/g</span>
                <span className={marketRates.g22kDiff >= 0 ? "text-green-500 font-bold" : "text-red-500 font-bold"}>
                  ({marketRates.g22kDiff >= 0 ? "▲" : "▼"}{Math.abs(marketRates.g22kDiff).toFixed(2)}%)
                </span>
              </span>
              <span className="text-[#dfba73]/30">|</span>
              <span className="flex items-center gap-1">
                Silver 999: <span className="font-bold text-neutral-900 dark:text-white">₹{marketRates.s999.toLocaleString()}/g</span>
                <span className={marketRates.s999Diff >= 0 ? "text-green-500 font-bold" : "text-red-500 font-bold"}>
                  ({marketRates.s999Diff >= 0 ? "▲" : "▼"}{Math.abs(marketRates.s999Diff).toFixed(2)}%)
                </span>
              </span>
            </div>
            <span className="hidden lg:inline text-[8px] text-neutral-400 uppercase tracking-widest font-semibold shrink-0">OJ STUDIO</span>
          </div>
        </div>

        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          {/* Mobile Menu Trigger */}
          <button
            onClick={() => setIsMobileMenuOpen(true)}
            className="md:hidden text-neutral-900 dark:text-neutral-100 hover:text-gold transition-colors"
            aria-label="Open menu"
          >
            <Menu className="w-6 h-6" />
          </button>

          {/* Logo */}
          <a href="#" className="flex items-center gap-3 select-none group">
            <img
              src="/logo.jpg"
              alt="Omar Jewellers Logo"
              className="w-10 h-10 rounded-full border border-gold/30 object-cover shadow-sm group-hover:border-gold transition-colors duration-300"
            />
            <div className="flex flex-col">
              <span className="font-serif text-lg md:text-xl font-light tracking-[0.2em] text-neutral-900 dark:text-neutral-100 group-hover:text-gold transition-colors duration-300">
                OMAR JEWELLERS
              </span>
              <span className="font-sans text-[9px] tracking-[0.35em] text-gold uppercase mt-0.5 font-bold">
                OJ • Luxury Gold
              </span>
            </div>
          </a>

          {/* Centered Search Pill (Tanishq Style) */}
          <div className="hidden md:flex flex-1 max-w-md mx-8 relative items-center">
            <div className="relative w-full">
              <span className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-neutral-400">
                <Search className="w-4 h-4" />
              </span>
              <input
                type="text"
                placeholder="Search for gold necklaces, diamond rings..."
                className="w-full bg-[#FAF9F5]/40 dark:bg-neutral-900/40 border border-neutral-200 dark:border-neutral-800 focus:border-gold hover:border-neutral-300 dark:hover:border-neutral-700 outline-none rounded-full py-2 pl-11 pr-20 text-xs font-sans text-neutral-900 dark:text-neutral-100 transition-all shadow-xs"
              />
              <div className="absolute inset-y-0 right-0 pr-4 flex items-center gap-3 text-neutral-400">
                <button className="hover:text-gold transition-colors" title="Search by photo">
                  <Camera className="w-4 h-4" />
                </button>
                <button className="hover:text-gold transition-colors" title="Search by voice">
                  <Mic className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>

          {/* Action Icons */}
          <div className="flex items-center space-x-4">
            {/* User Profile / Admin Link */}
            <a
              href="/admin"
              className="p-2 text-neutral-900 dark:text-neutral-100 hover:text-gold transition-colors"
              title="Admin Dashboard"
            >
              <User className="w-5 h-5" />
            </a>

            {/* Wishlist Button */}
            <button
              onClick={() => setIsWishlistOpen(true)}
              className="relative p-2 text-neutral-900 dark:text-neutral-100 hover:text-gold transition-colors"
              aria-label="Wishlist"
            >
              <Heart className="w-5 h-5" />
              {wishlist.length > 0 && (
                <motion.span
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  className="absolute top-0 right-0 w-4 h-4 bg-gold text-neutral-950 font-sans text-[9px] font-bold flex items-center justify-center rounded-full"
                >
                  {wishlist.length}
                </motion.span>
              )}
            </button>

            {/* Cart Button */}
            <button
              onClick={() => setIsCartOpen(true)}
              className="relative p-2 text-neutral-900 dark:text-neutral-100 hover:text-gold transition-colors"
              aria-label="Shopping Bag"
            >
              <ShoppingBag className="w-5 h-5" />
              {cart.length > 0 && (
                <motion.span
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  className="absolute top-0 right-0 w-4 h-4 bg-neutral-950 dark:bg-neutral-100 text-neutral-100 dark:text-neutral-950 border border-gold/40 font-sans text-[9px] font-bold flex items-center justify-center rounded-full"
                >
                  {cart.reduce((sum, i) => sum + i.quantity, 0)}
                </motion.span>
              )}
            </button>
          </div>
        </div>

        {/* Tanishq-Style Categories Menu Bar */}
        <div className="hidden md:block border-t border-neutral-200/50 dark:border-neutral-900/50 bg-[#FCFAF6] dark:bg-neutral-950 py-3 transition-colors duration-300">
          <div className="max-w-7xl mx-auto px-6 flex items-center justify-center gap-8 font-sans text-[11px] font-bold uppercase tracking-[0.18em] text-neutral-900/80 dark:text-neutral-100/80">
            {[
              { label: "All Jewellery", href: "#new-arrivals", cat: "all" },
              { label: "Gold Edit", href: "#best-sellers", cat: "rings" },
              { label: "Diamond Edit", href: "#best-sellers", cat: "necklaces" },
              { label: "Earrings", href: "#best-sellers", cat: "earrings" },
              { label: "Rings", href: "#best-sellers", cat: "rings" },
              { label: "Daily Wear", href: "#daily-wear", cat: "daily" },
              { label: "Bridal", href: "#bridal", cat: "bridal" },
              { label: "Silver", href: "#silver-collection", cat: "silver" },
              { label: "Heritage", href: "#about", cat: "about" },
              { label: "Contact", href: "#contact", cat: "contact" }
            ].map((item) => (
              <a
                key={item.label}
                href={item.href}
                onClick={() => {
                  if (setActiveCategory && item.cat !== "about" && item.cat !== "contact") {
                    setActiveCategory(item.cat);
                  }
                }}
                className={`hover:text-gold border-b border-transparent hover:border-gold pb-0.5 transition-all duration-300 ${
                  activeCategory === item.cat ? "text-gold border-gold" : ""
                }`}
              >
                {item.label}
              </a>
            ))}
          </div>
        </div>
      </nav>

      {/* Mobile Nav Drawer */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <>
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 0.5 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsMobileMenuOpen(false)}
              className="fixed inset-0 bg-neutral-950 z-50"
            />
            {/* Drawer */}
            <motion.div
              initial={{ x: "-100%" }}
              animate={{ x: 0 }}
              exit={{ x: "-100%" }}
              transition={{ type: "tween", duration: 0.4 }}
              className="fixed inset-y-0 left-0 w-80 bg-[#FAF9F5] dark:bg-neutral-950 border-r border-gold/10 z-50 p-6 flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between mb-12">
                  <div className="flex items-center gap-3">
                    <img
                      src="/logo.jpg"
                      alt="Omar Jewellers Logo"
                      className="w-11 h-11 rounded-full border border-gold/30 object-cover"
                    />
                    <div className="flex flex-col">
                      <span className="font-serif text-base tracking-[0.15em] font-light text-neutral-900 dark:text-neutral-100">
                        OMAR JEWELLERS
                      </span>
                      <span className="font-sans text-[8px] tracking-[0.4em] text-gold uppercase mt-0.5 font-bold">
                        OJ • LUXURY
                      </span>
                    </div>
                  </div>
                  <button
                    onClick={() => setIsMobileMenuOpen(false)}
                    className="text-neutral-900 dark:text-neutral-100 hover:text-gold"
                  >
                    <X className="w-6 h-6" />
                  </button>
                </div>

                <div className="flex flex-col space-y-6 font-sans text-base font-semibold tracking-widest uppercase">
                  {["home", "new-arrivals", "best-sellers", "bridal", "daily-wear", "about", "reviews", "gallery", "contact"].map((section) => (
                    <a
                      key={section}
                      href={`#${section}`}
                      onClick={() => setIsMobileMenuOpen(false)}
                      className="text-neutral-900 dark:text-neutral-100 hover:text-gold transition-colors flex items-center justify-between"
                    >
                      {section.replace("-", " ")}
                      <ArrowRight className="w-4 h-4 text-gold" />
                    </a>
                  ))}
                </div>
              </div>

              <div className="border-t border-gold/10 pt-6">
                <p className="font-sans text-xs text-neutral-500 dark:text-neutral-400 tracking-wider">
                  © 2026 Omar Jewellers OJ.
                  <br />
                  All Rights Reserved.
                </p>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* Wishlist Drawer */}
      <AnimatePresence>
        {isWishlistOpen && (
          <>
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 0.5 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsWishlistOpen(false)}
              className="fixed inset-0 bg-neutral-950 z-50"
            />
            {/* Drawer */}
            <motion.div
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ type: "tween", duration: 0.4 }}
              className="fixed inset-y-0 right-0 w-full sm:w-96 bg-[#FAF9F5] dark:bg-neutral-950 border-l border-gold/10 z-50 p-6 flex flex-col"
            >
              <div className="flex items-center justify-between border-b border-gold/10 pb-4 mb-6">
                <div className="flex items-center gap-2">
                  <Heart className="w-5 h-5 text-gold fill-gold" />
                  <h3 className="font-serif text-xl tracking-wider text-neutral-900 dark:text-neutral-100">
                    Your Wishlist
                  </h3>
                </div>
                <button
                  onClick={() => setIsWishlistOpen(false)}
                  className="text-neutral-900 dark:text-neutral-100 hover:text-gold"
                >
                  <X className="w-6 h-6" />
                </button>
              </div>

              {wishlist.length === 0 ? (
                <div className="flex-1 flex flex-col items-center justify-center text-center">
                  <Heart className="w-12 h-12 text-gold/30 mb-4" />
                  <p className="font-serif text-lg italic text-neutral-700 dark:text-neutral-300">
                    Your wishlist is empty
                  </p>
                  <button
                    onClick={() => setIsWishlistOpen(false)}
                    className="mt-6 px-6 py-2.5 bg-neutral-950 text-neutral-100 dark:bg-neutral-100 dark:text-neutral-950 border border-gold/30 font-sans text-xs tracking-widest uppercase hover:bg-gold hover:text-neutral-950 dark:hover:bg-gold transition-all duration-300"
                  >
                    Continue Browsing
                  </button>
                </div>
              ) : (
                <div className="flex-1 overflow-y-auto space-y-4 pr-1">
                  {wishlist.map((item) => (
                    <div
                      key={item.id}
                      className="flex items-center gap-4 bg-white/40 dark:bg-neutral-900/40 border border-gold/5 p-3 rounded-sm"
                    >
                      <img
                        src={item.image}
                        alt={item.name}
                        className="w-16 h-16 object-cover border border-gold/10 rounded-sm"
                      />
                      <div className="flex-1 min-w-0">
                        <h4 className="font-serif text-sm truncate text-neutral-900 dark:text-neutral-100">
                          {item.name}
                        </h4>
                        <p className="font-sans text-xs text-gold font-semibold mt-1">
                          ${item.price.toLocaleString()}
                        </p>
                        <div className="flex gap-3 mt-2">
                          <button
                            onClick={() => {
                              onOpenQuickView(item);
                              setIsWishlistOpen(false);
                            }}
                            className="font-sans text-[10px] tracking-wider uppercase text-neutral-500 dark:text-neutral-400 hover:text-gold transition-colors"
                          >
                            Quick View
                          </button>
                        </div>
                      </div>
                      <button
                        onClick={() => removeFromWishlist(item.id)}
                        className="text-red-500/70 hover:text-red-500 p-1"
                        aria-label="Remove item"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* Cart Drawer */}
      <AnimatePresence>
        {isCartOpen && (
          <>
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 0.5 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsCartOpen(false)}
              className="fixed inset-0 bg-neutral-950 z-50"
            />
            {/* Drawer */}
            <motion.div
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ type: "tween", duration: 0.4 }}
              className="fixed inset-y-0 right-0 w-full sm:w-96 bg-[#FAF9F5] dark:bg-neutral-950 border-l border-gold/10 z-50 p-6 flex flex-col"
            >
              <div className="flex items-center justify-between border-b border-gold/10 pb-4 mb-6">
                <div className="flex items-center gap-2">
                  <ShoppingBag className="w-5 h-5 text-gold" />
                  <h3 className="font-serif text-xl tracking-wider text-neutral-900 dark:text-neutral-100">
                    Your Shopping Bag
                  </h3>
                </div>
                <button
                  onClick={() => setIsCartOpen(false)}
                  className="text-neutral-900 dark:text-neutral-100 hover:text-gold"
                >
                  <X className="w-6 h-6" />
                </button>
              </div>

              {cart.length === 0 ? (
                <div className="flex-1 flex flex-col items-center justify-center text-center">
                  <ShoppingBag className="w-12 h-12 text-gold/30 mb-4" />
                  <p className="font-serif text-lg italic text-neutral-700 dark:text-neutral-300">
                    Your bag is empty
                  </p>
                  <button
                    onClick={() => setIsCartOpen(false)}
                    className="mt-6 px-6 py-2.5 bg-neutral-950 text-neutral-100 dark:bg-neutral-100 dark:text-neutral-950 border border-gold/30 font-sans text-xs tracking-widest uppercase hover:bg-gold hover:text-luxury-black dark:hover:bg-gold transition-all duration-300"
                  >
                    Explore Jewellery
                  </button>
                </div>
              ) : (
                <>
                  <div className="flex-1 overflow-y-auto space-y-4 pr-1">
                    {cart.map((item) => (
                      <div
                        key={item.product.id}
                        className="flex items-center gap-4 bg-white/40 dark:bg-neutral-900/40 border border-gold/5 p-3 rounded-sm"
                      >
                        <img
                          src={item.product.image}
                          alt={item.product.name}
                          className="w-16 h-16 object-cover border border-gold/10 rounded-sm"
                        />
                        <div className="flex-1 min-w-0">
                          <h4 className="font-serif text-sm truncate text-neutral-900 dark:text-neutral-100">
                            {item.product.name}
                          </h4>
                          <p className="font-sans text-xs text-neutral-500 dark:text-neutral-400">
                            Qty: {item.quantity}
                          </p>
                          <p className="font-sans text-xs text-gold font-semibold mt-1">
                            ${(item.product.price * item.quantity).toLocaleString()}
                          </p>
                        </div>
                        <button
                          onClick={() => removeFromCart(item.product.id)}
                          className="text-red-500/70 hover:text-red-500 p-1"
                          aria-label="Remove item"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    ))}
                  </div>

                  <div className="border-t border-gold/15 pt-6 mt-6">
                    <div className="flex items-center justify-between mb-4">
                      <span className="font-serif text-base text-neutral-900 dark:text-neutral-100">
                        Estimated Total
                      </span>
                      <span className="font-sans text-lg font-bold text-gold">
                        ${cartTotal.toLocaleString()}
                      </span>
                    </div>
                    <p className="font-sans text-[11px] text-neutral-500 dark:text-neutral-400 mb-6">
                      Tax and shipping calculated at checkout. Custom pricing for bulk gold configurations is available on WhatsApp.
                    </p>
                    <div className="flex flex-col gap-3">
                      <button
                        onClick={() => {
                          onOpenInquiry(cart[0].product);
                          setIsCartOpen(false);
                        }}
                        className="w-full py-3 bg-gold hover:bg-gold-dark text-neutral-950 font-sans text-xs font-bold tracking-widest uppercase transition-all duration-300 text-center flex items-center justify-center gap-2"
                      >
                        Inquire on WhatsApp
                      </button>
                      <button
                        onClick={() => setIsCartOpen(false)}
                        className="w-full py-3 border border-gold/30 hover:border-gold hover:bg-gold/5 font-sans text-xs font-bold tracking-widest uppercase text-neutral-900 dark:text-neutral-100 transition-all duration-300"
                      >
                        Keep Shopping
                      </button>
                    </div>
                  </div>
                </>
              )}
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
}
