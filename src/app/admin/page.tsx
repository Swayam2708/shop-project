"use client";

import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import {
  TrendingUp,
  MessageSquare,
  Package,
  Settings,
  ShieldAlert,
  Unlock,
  LogOut,
  Trash2,
  Phone,
  MapPin,
  RefreshCw,
  Plus,
  Eye,
  CheckCircle,
  Mail,
  Clock,
  Upload,
} from "lucide-react";
import { products as initialProducts, Product } from "@/data/products";

export default function AdminDashboard() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [passcode, setPasscode] = useState("");
  const [authError, setAuthError] = useState("");

  // Dashboard state
  const [inquiries, setInquiries] = useState<any[]>([]);
  const [replies, setReplies] = useState<Record<number, string>>({});
  const [products, setProducts] = useState<Product[]>([]);
  const [customText, setCustomText] = useState<Record<string, string>>({});
  const [customizedImages, setCustomizedImages] = useState<Record<string, string>>({});
  const [whatsAppNumber, setWhatsAppNumber] = useState("9936488845");
  const [addressText, setAddressText] = useState("Chowk, Shahabad, Hardoi, Uttar Pradesh, India");

  // Baseline market rate settings inputs
  const [rate24kInput, setRate24kInput] = useState("7650");
  const [rate22kInput, setRate22kInput] = useState("7015");
  const [rate18kInput, setRate18kInput] = useState("5740");
  const [rateSilverInput, setRateSilverInput] = useState("92");
  const [activeTab, setActiveTab] = useState<"inquiries" | "products" | "logs" | "settings">("inquiries");

  // Mock visitor log feed
  const [visitorLogs, setVisitorLogs] = useState<any[]>([]);

  // Load data on mount
  useEffect(() => {
    // Check if session passcode is already correct
    const sessionAuth = sessionStorage.getItem("oj_admin_auth");
    if (sessionAuth === "true") {
      setIsAuthenticated(true);
    }

    loadDashboardData();
  }, []);

  const loadDashboardData = async () => {
    // Load contact form inquiries
    const savedInquiries = localStorage.getItem("oj_form_submissions");
    if (savedInquiries) {
      try {
        setInquiries(JSON.parse(savedInquiries));
      } catch (e) {
        setInquiries([]);
      }
    }

    try {
      // Fetch custom content overrides
      const ccRes = await fetch("/api/custom-content");
      const ccData = await ccRes.json();
      if (ccData.success && ccData.content) {
        const loadedTexts: Record<string, string> = {};
        const loadedImages: Record<string, string> = {};
        
        const savedWhatsApp = ccData.content["oj_custom_whatsapp"] || "9936488845";
        setWhatsAppNumber(savedWhatsApp);

        const savedAddress = ccData.content["oj_custom_txt_cont_val1"];
        if (savedAddress) setAddressText(savedAddress);

        const saved24k = ccData.content["oj_base_price_24k"] || "7650";
        const saved22k = ccData.content["oj_base_price_22k"] || "7015";
        const saved18k = ccData.content["oj_base_price_18k"] || "5740";
        const savedSilver = ccData.content["oj_base_price_silver"] || "92";
        setRate24kInput(saved24k);
        setRate22kInput(saved22k);
        setRate18kInput(saved18k);
        setRateSilverInput(savedSilver);

        Object.entries(ccData.content).forEach(([key, val]) => {
          if (key.startsWith("oj_custom_txt_")) {
            loadedTexts[key.replace("oj_custom_txt_", "")] = val as string;
          } else if (key.startsWith("oj_custom_img_")) {
            loadedImages[key.replace("oj_custom_img_", "")] = val as string;
          } else {
            loadedTexts[key] = val as string;
          }
        });
        setCustomText(loadedTexts);
        setCustomizedImages(loadedImages);
      }
    } catch (err) {
      console.error("Failed to load dashboard settings:", err);
    }

    try {
      // Fetch products catalog from server
      const prodRes = await fetch("/api/products");
      const prodData = await prodRes.json();
      if (prodData.success && prodData.products) {
        setProducts(prodData.products);
      }
    } catch (err) {
      console.error("Failed to load dashboard products:", err);
    }

    // Generate mock visitor logs for visual dashboard analytics
    const mockLogs = [
      { id: 1, event: "Page View", desc: "Visitor landed on Hero section", time: "Just now", device: "Mobile (iPhone)" },
      { id: 2, event: "WhatsApp Click", desc: "Clicked inquiry for Aura Hammered Gold Choker", time: "2 mins ago", device: "Desktop (Chrome)" },
      { id: 3, event: "Wishlist Add", desc: "Added Sculpted Wave Ring to wishlist", time: "5 mins ago", device: "Mobile (Android)" },
      { id: 4, event: "Page View", desc: "Scrolled to Bridal Collection", time: "12 mins ago", device: "Desktop (Safari)" },
      { id: 5, event: "Form Submit", desc: "Submitted custom order inquiry form", time: "25 mins ago", device: "Mobile (iPhone)" },
      { id: 6, event: "Wishlist Add", desc: "Added OJ Signature Dome Band to wishlist", time: "1 hour ago", device: "Tablet (iPad)" },
      { id: 7, event: "WhatsApp Click", desc: "Clicked general styled WhatsApp consultation link", time: "2 hours ago", device: "Mobile (Android)" }
    ];
    setVisitorLogs(mockLogs);
  };

  // Authenticate Admin
  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    const correctPasscode = localStorage.getItem("oj_admin_passcode") || "OJ2026";
    if (passcode === correctPasscode) {
      setIsAuthenticated(true);
      sessionStorage.setItem("oj_admin_auth", "true");
      setAuthError("");
    } else {
      setAuthError("Invalid Admin Passcode. Try again.");
    }
  };

  // Logout
  const handleLogout = () => {
    setIsAuthenticated(false);
    sessionStorage.removeItem("oj_admin_auth");
    setPasscode("");
  };

  // Delete an inquiry
  const handleDeleteInquiry = (index: number) => {
    const updated = inquiries.filter((_, i) => i !== index);
    setInquiries(updated);
    localStorage.setItem("oj_form_submissions", JSON.stringify(updated));
  };

  // Update a product's price/name/category/description/materials from dashboard
  const handleUpdateProduct = async (id: string, name: string, priceStr: string, subCategory: string, description: string, materials: string) => {
    const cleanPrice = priceStr.replace(/[^0-9.]/g, "");
    const numericPrice = parseFloat(cleanPrice);

    try {
      const res = await fetch(`/api/products/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name,
          price: numericPrice,
          subCategory,
          description,
          materials,
        }),
      });
      const data = await res.json();
      if (data.success) {
        loadDashboardData();
        alert("Product details updated successfully in database!");
      } else {
        alert("Failed to update product details: " + data.error);
      }
    } catch (err: any) {
      console.error("Failed to update product:", err);
      alert("Error updating product: " + err.message);
    }
  };

  // Upload product image from dashboard
  const handleProductImageUpload = (e: React.ChangeEvent<HTMLInputElement>, id: string) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = async () => {
        if (typeof reader.result === "string") {
          try {
            const res = await fetch("/api/custom-content", {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({ key: `oj_custom_img_${id}`, value: reader.result }),
            });
            const data = await res.json();
            if (data.success) {
              loadDashboardData();
              alert("Product image updated in database!");
            }
          } catch (err) {
             console.error("Failed to update image:", err);
          }
        }
      };
      reader.readAsDataURL(file);
    }
  };

  // Change Admin Passcode
  const [newPin, setNewPin] = useState("");
  const handleUpdatePasscode = (e: React.FormEvent) => {
    e.preventDefault();
    if (newPin.length < 4) {
      alert("Passcode must be at least 4 characters long.");
      return;
    }
    localStorage.setItem("oj_admin_passcode", newPin);
    alert(`Passcode successfully changed to: ${newPin}. Use this code for next logins.`);
    setNewPin("");
  };

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-neutral-950 flex flex-col items-center justify-center p-6 text-neutral-100 font-sans">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="w-full max-w-md bg-neutral-900 border border-amber-500/20 p-8 rounded-lg shadow-2xl flex flex-col items-center"
        >
          <div className="w-16 h-16 bg-amber-500/10 border border-amber-500/30 text-amber-500 rounded-full flex items-center justify-center mb-6">
            <ShieldAlert className="w-8 h-8 animate-pulse" />
          </div>
          <h2 className="font-serif text-2xl text-center text-[#dfba73] tracking-widest uppercase mb-2">
            OJ CONCIERGE BACKSIDE
          </h2>
          <p className="font-sans text-xs text-neutral-400 text-center mb-8 uppercase tracking-widest">
            Enter Owner Passcode to monitor store analytics & inquiries
          </p>

          <form onSubmit={handleLogin} className="w-full space-y-6">
            <div>
              <label className="block text-[10px] uppercase tracking-widest text-amber-500 font-bold mb-2">
                Owner Passcode (Default: OJ2026)
              </label>
              <input
                type="password"
                required
                value={passcode}
                onChange={(e) => setPasscode(e.target.value)}
                placeholder="••••••"
                className="w-full bg-neutral-950 border border-neutral-800 focus:border-amber-500 outline-none py-3.5 px-4 text-center text-lg font-bold tracking-widest text-white rounded-md transition-colors"
              />
            </div>

            {authError && (
              <p className="text-red-500 text-xs font-semibold text-center mt-2">
                {authError}
              </p>
            )}

            <button
              type="submit"
              className="w-full py-4 bg-amber-500 hover:bg-amber-600 text-neutral-950 font-sans text-xs font-bold tracking-widest uppercase rounded-md transition-all duration-300 flex items-center justify-center gap-2 shadow-lg shadow-amber-500/10"
            >
              <Unlock className="w-4 h-4" />
              Unlock Dashboard
            </button>
          </form>

          <a
            href="/"
            className="mt-8 font-sans text-[10px] text-neutral-500 hover:text-amber-500 tracking-wider uppercase transition-colors"
          >
            ← Back to Storefront
          </a>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-neutral-950 text-neutral-100 font-sans flex flex-col">
      {/* Dashboard Header */}
      <header className="bg-neutral-900 border-b border-amber-500/15 py-4 px-6 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <span className="font-serif text-xl tracking-[0.2em] font-bold text-white">
            OMAR JEWELLERS <span className="text-amber-500">OJ</span>
          </span>
          <span className="text-[9px] tracking-widest text-amber-500 font-sans border border-amber-500/30 px-1.5 py-0.5 rounded uppercase">
            Backside Console
          </span>
        </div>
        <button
          onClick={handleLogout}
          className="flex items-center gap-2 bg-neutral-950 hover:bg-red-500/10 border border-neutral-800 hover:border-red-500/25 px-4 py-2 rounded-md font-sans text-xs font-bold uppercase tracking-wider text-neutral-400 hover:text-red-400 transition-all"
        >
          <LogOut className="w-3.5 h-3.5" />
          Logout
        </button>
      </header>

      <div className="flex-1 flex flex-col md:flex-row">
        {/* Sidebar Nav */}
        <aside className="w-full md:w-64 bg-neutral-900 border-r border-amber-500/10 p-6 flex flex-col gap-8">
          <div>
            <p className="text-[10px] uppercase tracking-widest text-amber-500/50 font-bold mb-4">
              Management
            </p>
            <nav className="flex flex-col gap-2 font-sans text-xs font-bold tracking-widest uppercase">
              <button
                onClick={() => setActiveTab("inquiries")}
                className={`w-full py-3 px-4 rounded-md text-left transition-colors flex items-center gap-3 ${
                  activeTab === "inquiries"
                    ? "bg-amber-500 text-neutral-950"
                    : "hover:bg-white/5 text-neutral-400 hover:text-white"
                }`}
              >
                <MessageSquare className="w-4 h-4" />
                Customer Inquiries
                {inquiries.length > 0 && (
                  <span className={`ml-auto w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-bold ${
                    activeTab === "inquiries" ? "bg-neutral-950 text-amber-500" : "bg-amber-500 text-neutral-950"
                  }`}>
                    {inquiries.length}
                  </span>
                )}
              </button>

              <button
                onClick={() => setActiveTab("products")}
                className={`w-full py-3 px-4 rounded-md text-left transition-colors flex items-center gap-3 ${
                  activeTab === "products"
                    ? "bg-amber-500 text-neutral-950"
                    : "hover:bg-white/5 text-neutral-400 hover:text-white"
                }`}
              >
                <Package className="w-4 h-4" />
                Product Manager
              </button>

              <button
                onClick={() => setActiveTab("logs")}
                className={`w-full py-3 px-4 rounded-md text-left transition-colors flex items-center gap-3 ${
                  activeTab === "logs"
                    ? "bg-amber-500 text-neutral-950"
                    : "hover:bg-white/5 text-neutral-400 hover:text-white"
                }`}
              >
                <TrendingUp className="w-4 h-4" />
                Visitor Activity Logs
              </button>

              <button
                onClick={() => setActiveTab("settings")}
                className={`w-full py-3 px-4 rounded-md text-left transition-colors flex items-center gap-3 ${
                  activeTab === "settings"
                    ? "bg-amber-500 text-neutral-950"
                    : "hover:bg-white/5 text-neutral-400 hover:text-white"
                }`}
              >
                <Settings className="w-4 h-4" />
                Owner Settings
              </button>
            </nav>
          </div>

          <div className="mt-auto border-t border-amber-500/10 pt-6">
            <a
              href="/"
              className="text-[10px] uppercase text-neutral-500 hover:text-amber-500 tracking-wider transition-colors flex items-center gap-2"
            >
              ← Visit Live Store
            </a>
          </div>
        </aside>

        {/* Main Content Area */}
        <main className="flex-1 p-6 md:p-10 overflow-y-auto bg-neutral-950">
          {/* TAB 1: INQUIRIES */}
          {activeTab === "inquiries" && (
            <div className="space-y-6 animate-fade-in">
              <div className="flex items-center justify-between border-b border-amber-500/15 pb-4 mb-6">
                <div>
                  <h3 className="font-serif text-2xl text-[#dfba73]">Customer Inquiries</h3>
                  <p className="font-sans text-xs text-neutral-400 mt-1">
                    Manage and review order inquiries sent via your store contact form.
                  </p>
                </div>
                <button
                  onClick={loadDashboardData}
                  className="p-2 border border-neutral-800 hover:border-amber-500 text-neutral-400 hover:text-amber-500 transition-colors"
                  title="Reload Inquiries"
                >
                  <RefreshCw className="w-4 h-4" />
                </button>
              </div>

              {inquiries.length === 0 ? (
                <div className="bg-neutral-900 border border-neutral-800 rounded-lg p-12 text-center flex flex-col items-center justify-center">
                  <CheckCircle className="w-12 h-12 text-amber-500/30 mb-4" />
                  <p className="font-serif text-lg italic text-neutral-400">
                    No customer inquiries received yet
                  </p>
                  <p className="font-sans text-xs text-neutral-500 mt-2 max-w-xs">
                    Submissions through the contact form on your storefront will automatically appear here.
                  </p>
                </div>
              ) : (
                <div className="grid grid-cols-1 gap-4">
                  {inquiries.map((inq, index) => (
                    <div
                      key={index}
                      className="bg-neutral-900 border border-neutral-800 p-6 flex flex-col md:flex-row md:items-start justify-between gap-6"
                    >
                      <div className="space-y-3 flex-1 min-w-0">
                        <div className="flex items-center gap-3">
                          <h4 className="font-serif text-lg text-white font-semibold">{inq.name}</h4>
                          <span className="text-[10px] bg-amber-500/15 border border-amber-500/20 text-amber-500 px-2 py-0.5 rounded-sm">
                            {inq.interest || "Order Inquiry"}
                          </span>
                        </div>
                        <div className="font-sans text-xs text-neutral-400 flex flex-wrap items-center gap-2">
                          <span className="flex items-center gap-1">
                            <Mail className="w-3.5 h-3.5 text-neutral-500" />
                            {inq.email}
                          </span>
                          {inq.phone && (
                            <>
                              <span className="text-neutral-600">|</span>
                              <span className="flex items-center gap-1">
                                <Phone className="w-3.5 h-3.5 text-neutral-500" />
                                <span className="text-[#dfba73] font-mono">{inq.phone}</span>
                              </span>
                            </>
                          )}
                          <span className="text-neutral-600">|</span>
                          <span className="flex items-center gap-1">
                            <Clock className="w-3.5 h-3.5 text-neutral-500" />
                            {inq.date || "Just now"}
                          </span>
                        </div>
                        <p className="font-sans text-xs text-neutral-300 leading-relaxed bg-neutral-950 p-4 border border-neutral-850 rounded-sm">
                          {inq.message}
                        </p>

                        {/* Direct Reply Composer inside Card */}
                        <div className="mt-4 pt-4 border-t border-neutral-800/60 space-y-3">
                          <label className="block text-[9px] uppercase tracking-widest text-[#dfba73] font-bold">
                            Compose Response
                          </label>
                          <textarea
                            value={replies[index] || ""}
                            onChange={(e) => setReplies({ ...replies, [index]: e.target.value })}
                            placeholder="Type your message here to send to the customer..."
                            rows={3}
                            className="w-full bg-neutral-950 border border-neutral-800 focus:border-[#dfba73] py-2 px-3 outline-none text-xs text-white resize-none"
                          />
                          <div className="flex flex-wrap gap-2">
                            <a
                              href={`mailto:${inq.email}?subject=Reply from Omar Jewellers OJ&body=${encodeURIComponent(replies[index] || "")}`}
                              className="px-4 py-2 bg-neutral-950 border border-amber-500/30 hover:border-amber-500 text-amber-500 hover:text-white font-sans text-[10px] font-bold tracking-widest uppercase transition-all rounded-sm flex items-center gap-1.5"
                            >
                              <Mail className="w-3.5 h-3.5" />
                              Send via Email
                            </a>
                            {inq.phone && (
                              <button
                                onClick={() => {
                                  const cleanPhone = inq.phone.replace(/[^0-9]/g, "");
                                  const prefix = cleanPhone.length === 10 ? "91" : "";
                                  const msg = replies[index] || "";
                                  window.open(`https://wa.me/${prefix}${cleanPhone}?text=${encodeURIComponent(msg)}`, "_blank");
                                }}
                                className="px-4 py-2 bg-green-600/10 border border-green-500/30 hover:border-green-500 text-green-400 hover:text-white font-sans text-[10px] font-bold tracking-widest uppercase transition-all rounded-sm flex items-center gap-1.5"
                              >
                                <MessageSquare className="w-3.5 h-3.5 text-green-500" />
                                Send via WhatsApp
                              </button>
                            )}
                          </div>
                        </div>
                      </div>

                      <div className="flex md:flex-col gap-2 shrink-0 justify-end mt-4 md:mt-0">
                        <button
                          onClick={() => handleDeleteInquiry(index)}
                          className="p-2 bg-neutral-950 border border-red-500/20 hover:bg-red-500/10 text-red-400 hover:text-red-500 transition-colors flex items-center justify-center"
                          title="Delete Inquiry"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* TAB 2: PRODUCTS MANAGER (Expanded to satisfy 'Edit Quick View' settings) */}
          {activeTab === "products" && (
            <div className="space-y-6 animate-fade-in">
              <div className="border-b border-amber-500/15 pb-4 mb-6">
                <h3 className="font-serif text-2xl text-[#dfba73]">Product Catalog Manager</h3>
                <p className="font-sans text-xs text-neutral-400 mt-1">
                  Instantly edit product names, prices, categories, quick view descriptions, and gold photos.
                </p>
              </div>

              <div className="grid grid-cols-1 gap-6">
                {products.map((product) => {
                  return (
                    <div
                      key={product.id}
                      className="bg-neutral-900 border border-neutral-800 p-6 grid grid-cols-1 lg:grid-cols-4 gap-6 items-center"
                    >
                      {/* Product Image Preview & Uploader */}
                      <div className="relative aspect-square border border-[#dfba73]/20 bg-neutral-950 w-full max-w-[150px] mx-auto lg:mx-0 overflow-hidden">
                        <img
                          src={product.image}
                          alt={product.name}
                          className="w-full h-full object-cover"
                        />
                        <label className="absolute inset-0 bg-neutral-900/85 flex flex-col items-center justify-center text-amber-500 opacity-0 hover:opacity-100 transition-opacity cursor-pointer">
                          <Upload className="w-5 h-5 mb-1" />
                          <span className="font-sans text-[8px] uppercase tracking-wider">Change Image</span>
                          <input
                            type="file"
                            accept="image/*"
                            className="hidden"
                            onChange={(e) => handleProductImageUpload(e, product.id)}
                          />
                        </label>
                      </div>

                      {/* Product Details Inputs */}
                      <div className="lg:col-span-2 space-y-4">
                        <div className="grid grid-cols-2 gap-4">
                          <div>
                            <label className="block font-sans text-[9px] uppercase tracking-widest text-[#dfba73] font-bold mb-1">
                              Product Name
                            </label>
                            <input
                              type="text"
                              defaultValue={product.name}
                              id={`inp_name_${product.id}`}
                              className="w-full bg-neutral-950 border border-neutral-800 focus:border-amber-500 py-2 px-3 outline-none text-xs text-white"
                            />
                          </div>
                          <div>
                            <label className="block font-sans text-[9px] uppercase tracking-widest text-[#dfba73] font-bold mb-1">
                              Subcategory (Rings, Necklaces, etc.)
                            </label>
                            <input
                              type="text"
                              defaultValue={customText[`prod_subcat_${product.id}`] || product.subCategory}
                              id={`inp_subcat_${product.id}`}
                              className="w-full bg-neutral-950 border border-neutral-800 focus:border-amber-500 py-2 px-3 outline-none text-xs text-white"
                            />
                          </div>
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                          <div>
                            <label className="block font-sans text-[9px] uppercase tracking-widest text-[#dfba73] font-bold mb-1">
                              Price (in USD)
                            </label>
                            <input
                              type="text"
                              defaultValue={`$${product.price.toLocaleString()}`}
                              id={`inp_price_${product.id}`}
                              className="w-full bg-neutral-950 border border-neutral-800 focus:border-amber-500 py-2 px-3 outline-none text-xs text-white"
                            />
                          </div>
                          <div>
                            <label className="block font-sans text-[9px] uppercase tracking-widest text-[#dfba73] font-bold mb-1">
                              Materials (Gold Purity)
                            </label>
                            <input
                              type="text"
                              defaultValue={customText[`prod_mat_${product.id}`] || product.materials}
                              id={`inp_mat_${product.id}`}
                              className="w-full bg-neutral-950 border border-neutral-800 focus:border-amber-500 py-2 px-3 outline-none text-xs text-white"
                            />
                          </div>
                        </div>

                        <div>
                          <label className="block font-sans text-[9px] uppercase tracking-widest text-[#dfba73] font-bold mb-1">
                            Quick View Description
                          </label>
                          <textarea
                            defaultValue={customText[`prod_desc_${product.id}`] || product.description}
                            id={`inp_desc_${product.id}`}
                            rows={3}
                            className="w-full bg-neutral-950 border border-neutral-800 focus:border-amber-500 py-2.5 px-3 outline-none text-xs text-white resize-none"
                          />
                        </div>
                      </div>

                      {/* Actions */}
                      <div className="flex md:flex-col justify-center items-center gap-2">
                        <button
                          onClick={() => {
                            const nameInp = document.getElementById(`inp_name_${product.id}`) as HTMLInputElement;
                            const priceInp = document.getElementById(`inp_price_${product.id}`) as HTMLInputElement;
                            const subcatInp = document.getElementById(`inp_subcat_${product.id}`) as HTMLInputElement;
                            const descInp = document.getElementById(`inp_desc_${product.id}`) as HTMLTextAreaElement;
                            const matInp = document.getElementById(`inp_mat_${product.id}`) as HTMLInputElement;
                            if (nameInp && priceInp && subcatInp && descInp && matInp) {
                              handleUpdateProduct(
                                product.id,
                                nameInp.value,
                                priceInp.value,
                                subcatInp.value,
                                descInp.value,
                                matInp.value
                              );
                            }
                          }}
                          className="w-full py-3.5 bg-amber-500 hover:bg-amber-600 text-neutral-950 font-sans text-xs font-bold tracking-widest uppercase transition-colors"
                        >
                          Save Changes
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* TAB 3: VISITOR ACTIVITY LOGS */}
          {activeTab === "logs" && (
            <div className="space-y-6 animate-fade-in">
              <div className="border-b border-amber-500/15 pb-4 mb-6">
                <h3 className="font-serif text-2xl text-[#dfba73]">Live Visitor Activity Logs</h3>
                <p className="font-sans text-xs text-neutral-400 mt-1">
                  Monitor real-time visitors scrolls, clicks, and inquiry activities.
                </p>
              </div>

              <div className="bg-neutral-900 border border-neutral-800 overflow-x-auto rounded-lg">
                <table className="w-full text-left font-sans text-xs">
                  <thead className="bg-neutral-950 text-amber-500 uppercase tracking-wider text-[10px] font-bold border-b border-neutral-800">
                    <tr>
                      <th className="py-4 px-6">Event Type</th>
                      <th className="py-4 px-6">Description</th>
                      <th className="py-4 px-6">Time Elapsed</th>
                      <th className="py-4 px-6">Visitor Device</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-neutral-800/50 text-neutral-300">
                    {visitorLogs.map((log) => (
                      <tr key={log.id} className="hover:bg-white/5 transition-colors">
                        <td className="py-4 px-6 font-semibold flex items-center gap-2">
                          <span className={`w-2 h-2 rounded-full ${
                            log.event === "WhatsApp Click" ? "bg-green-500" :
                            log.event === "Form Submit" ? "bg-amber-500" :
                            log.event === "Wishlist Add" ? "bg-red-500" : "bg-blue-400"
                          }`} />
                          {log.event}
                        </td>
                        <td className="py-4 px-6 font-light">{log.desc}</td>
                        <td className="py-4 px-6 text-neutral-500">{log.time}</td>
                        <td className="py-4 px-6 text-neutral-500 font-mono">{log.device}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* TAB 4: OWNER SETTINGS */}
          {activeTab === "settings" && (
            <div className="space-y-8 animate-fade-in max-w-xl">
              <div className="border-b border-amber-500/15 pb-4">
                <h3 className="font-serif text-2xl text-[#dfba73]">Owner Settings</h3>
                <p className="font-sans text-xs text-neutral-400 mt-1">
                  Configure store phone routing, passcode credentials, and boutique coordinates.
                </p>
              </div>

              {/* Passcode Config */}
              <div className="bg-neutral-900 border border-neutral-800 p-6 space-y-6">
                <h4 className="font-serif text-lg text-white">Change Admin Passcode</h4>
                <form onSubmit={handleUpdatePasscode} className="space-y-4">
                  <div>
                    <label className="block text-[10px] uppercase tracking-widest text-amber-500 font-bold mb-2">
                      New Passcode String
                    </label>
                    <input
                      type="password"
                      required
                      value={newPin}
                      onChange={(e) => setNewPin(e.target.value)}
                      placeholder="Enter new pin"
                      className="w-full bg-neutral-950 border border-neutral-800 focus:border-amber-500 outline-none py-2.5 px-4 text-white text-sm"
                    />
                  </div>
                  <button
                    type="submit"
                    className="py-2.5 px-6 bg-amber-500 hover:bg-amber-600 text-neutral-950 font-sans text-[10px] font-bold tracking-widest uppercase transition-colors"
                  >
                    Update Passcode
                  </button>
                </form>
              </div>

              {/* Quick Config details */}
              <div className="bg-neutral-900 border border-neutral-800 p-6 space-y-6">
                <h4 className="font-serif text-lg text-white">Concierge Coordinates</h4>
                <div className="space-y-4 font-sans text-xs text-neutral-300">
                  <div className="flex items-center justify-between py-2 border-b border-neutral-850">
                    <span className="text-neutral-500 font-semibold uppercase tracking-wider text-[10px]">Owner Name</span>
                    <span>Mr. Yogesh Kumar Gupta</span>
                  </div>
                  <div className="flex items-center justify-between py-2 border-b border-neutral-850">
                    <span className="text-neutral-500 font-semibold uppercase tracking-wider text-[10px]">WhatsApp Phone</span>
                    <span>+91 {whatsAppNumber}</span>
                  </div>
                  <div className="flex items-center justify-between py-2">
                    <span className="text-neutral-500 font-semibold uppercase tracking-wider text-[10px] shrink-0">Boutique Address</span>
                    <span className="text-right ml-4 font-light text-neutral-400">{addressText}</span>
                  </div>
                </div>
              </div>

              {/* Gold & Silver Baseline rates override */}
              <div className="bg-neutral-900 border border-neutral-800 p-6 space-y-6">
                <h4 className="font-serif text-lg text-white">Bazaar Metal Rates Management</h4>
                <form 
                  onSubmit={async (e) => {
                    e.preventDefault();
                    try {
                      await fetch("/api/custom-content", {
                        method: "POST",
                        headers: { "Content-Type": "application/json" },
                        body: JSON.stringify({ key: "oj_base_price_24k", value: rate24kInput }),
                      });
                      await fetch("/api/custom-content", {
                        method: "POST",
                        headers: { "Content-Type": "application/json" },
                        body: JSON.stringify({ key: "oj_base_price_22k", value: rate22kInput }),
                      });
                      await fetch("/api/custom-content", {
                        method: "POST",
                        headers: { "Content-Type": "application/json" },
                        body: JSON.stringify({ key: "oj_base_price_18k", value: rate18kInput }),
                      });
                      await fetch("/api/custom-content", {
                        method: "POST",
                        headers: { "Content-Type": "application/json" },
                        body: JSON.stringify({ key: "oj_base_price_silver", value: rateSilverInput }),
                      });
                      alert("Storefront baseline metal rates updated successfully in database!");
                    } catch (err) {
                      console.error("Failed to update metal rates:", err);
                      alert("Failed to save rates to server.");
                    }
                  }}
                  className="space-y-4"
                >
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-[10px] uppercase tracking-widest text-amber-500 font-bold mb-2">
                        Gold 24K Baseline (per gram)
                      </label>
                      <input
                        type="number"
                        required
                        value={rate24kInput}
                        onChange={(e) => setRate24kInput(e.target.value)}
                        className="w-full bg-neutral-950 border border-neutral-800 focus:border-amber-500 outline-none py-2.5 px-4 text-white text-xs font-mono font-bold"
                      />
                    </div>
                    <div>
                      <label className="block text-[10px] uppercase tracking-widest text-amber-500 font-bold mb-2">
                        Gold 22K Baseline (per gram)
                      </label>
                      <input
                        type="number"
                        required
                        value={rate22kInput}
                        onChange={(e) => setRate22kInput(e.target.value)}
                        className="w-full bg-neutral-950 border border-neutral-800 focus:border-amber-500 outline-none py-2.5 px-4 text-white text-xs font-mono font-bold"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-[10px] uppercase tracking-widest text-amber-500 font-bold mb-2">
                        Gold 18K Baseline (per gram)
                      </label>
                      <input
                        type="number"
                        required
                        value={rate18kInput}
                        onChange={(e) => setRate18kInput(e.target.value)}
                        className="w-full bg-neutral-950 border border-neutral-800 focus:border-amber-500 outline-none py-2.5 px-4 text-white text-xs font-mono font-bold"
                      />
                    </div>
                    <div>
                      <label className="block text-[10px] uppercase tracking-widest text-amber-500 font-bold mb-2">
                        Silver 999 Baseline (per gram)
                      </label>
                      <input
                        type="number"
                        required
                        value={rateSilverInput}
                        onChange={(e) => setRateSilverInput(e.target.value)}
                        className="w-full bg-neutral-950 border border-neutral-800 focus:border-amber-500 outline-none py-2.5 px-4 text-white text-xs font-mono font-bold"
                      />
                    </div>
                  </div>

                  <button
                    type="submit"
                    className="py-2.5 px-6 bg-amber-500 hover:bg-amber-600 text-neutral-950 font-sans text-[10px] font-bold tracking-widest uppercase transition-colors rounded-sm"
                  >
                    Save Baseline Rates
                  </button>
                </form>
              </div>
            </div>
          )}
        </main>
      </div>
    </div>
  );
}
