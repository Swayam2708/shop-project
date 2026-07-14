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
  Search,
  BookOpen,
  Calendar,
  DollarSign,
  UserCheck,
} from "lucide-react";
import { products as initialProducts, Product } from "@/data/products";

// Secure SHA-256 Client-Side Hashing Utility
async function hashPasscode(input: string): Promise<string> {
  if (typeof window === "undefined" || !window.crypto || !window.crypto.subtle) {
    // Fallback if environment doesn't support subtle crypto (e.g. server rendering)
    return input;
  }
  const encoder = new TextEncoder();
  const data = encoder.encode(input);
  const hashBuffer = await window.crypto.subtle.digest("SHA-256", data);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  const hashHex = hashArray.map(b => b.toString(16).padStart(2, "0")).join("");
  return hashHex;
}

interface UdhaarRecord {
  id: string;
  name: string;
  sonOf: string;
  phone: string;
  village: string;
  ornament: string; // for compatibility
  weight: string;   // for compatibility
  ornaments?: { name: string; weight: string }[]; // multiple products support!
  amount: string;
  dues: string;
  date: string;
  notes?: string;
}

export default function AdminDashboard() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [passcode, setPasscode] = useState("");
  const [dbPasscode, setDbPasscode] = useState("OJ2026");
  const [authError, setAuthError] = useState("");

  // Dashboard state
  const [inquiries, setInquiries] = useState<any[]>([]);
  const [replies, setReplies] = useState<Record<number, string>>({});
  const [products, setProducts] = useState<Product[]>([]);
  const [customText, setCustomText] = useState<Record<string, string>>({});
  const [customizedImages, setCustomizedImages] = useState<Record<string, string>>({});
  const [whatsAppNumber, setWhatsAppNumber] = useState("9936488845");
  const [addressText, setAddressText] = useState("Chowk, Shahabad, Hardoi, Uttar Pradesh, India");

  // Udhaar Notebook state
  const [udhaarRecords, setUdhaarRecords] = useState<UdhaarRecord[]>([]);
  const [udhaarSearchQuery, setUdhaarSearchQuery] = useState("");
  const [newEntryItems, setNewEntryItems] = useState<{ ornament: string; weight: string }[]>([{ ornament: "", weight: "" }]);
  const [newEntryAmount, setNewEntryAmount] = useState("");
  const [newEntryDiscount, setNewEntryDiscount] = useState("");
  const [newEntryPaid, setNewEntryPaid] = useState("");
  const [selectedUdhaar, setSelectedUdhaar] = useState<UdhaarRecord | null>(null);

  // Baseline market rate settings inputs
  const [rate24kInput, setRate24kInput] = useState("7650");
  const [rate22kInput, setRate22kInput] = useState("7015");
  const [rate18kInput, setRate18kInput] = useState("5740");
  const [rateSilverInput, setRateSilverInput] = useState("92");
  const [activeTab, setActiveTab] = useState<"inquiries" | "products" | "logs" | "settings" | "udhaar">("inquiries");

  // Mock visitor log feed
  const [visitorLogs, setVisitorLogs] = useState<any[]>([]);

  // Database connectivity status
  const [dbConnected, setDbConnected] = useState<boolean | null>(null);
  const [dbError, setDbError] = useState<string>("");

  // Load data on mount
  useEffect(() => {
    // Check if session passcode is already correct
    const sessionAuth = sessionStorage.getItem("oj_admin_auth");
    if (sessionAuth === "true") {
      setIsAuthenticated(true);
    }

    loadDashboardData();

    // Verify database connectivity
    fetch("/api/db-check", { cache: "no-store" })
      .then((res) => res.json())
      .then((data) => {
        if (data.connected) {
          setDbConnected(true);
        } else {
          setDbConnected(false);
          setDbError(data.error || "Failed to reach database server.");
        }
      })
      .catch((err) => {
        setDbConnected(false);
        setDbError(err.message || "Failed to call status API.");
      });
  }, []);

  const loadDashboardData = async () => {
    // Load Udhaar Ledger Notebook
    const savedUdhaar = localStorage.getItem("oj_udhaar_records");
    if (savedUdhaar) {
      try {
        setUdhaarRecords(JSON.parse(savedUdhaar));
      } catch (e) {
        setUdhaarRecords([]);
      }
    } else {
      const initialUdhaar: UdhaarRecord[] = [
        { 
          id: "1", 
          name: "Ramesh Kumar", 
          sonOf: "Shri Lal Chand", 
          phone: "9876543210", 
          village: "Shahabad", 
          ornament: "Gold Kada", 
          weight: "12.4g", 
          ornaments: [
            { name: "Gold Kada", weight: "12.4g" },
            { name: "Gold Ring", weight: "5.8g" }
          ],
          amount: "127000", 
          discount: "2000",
          paid: "80000",
          dues: "45000", 
          date: "2026-07-10", 
          notes: "Promised to clear by next crop cycle" 
        },
        { 
          id: "2", 
          name: "Suresh Gupta", 
          sonOf: "Shri Ram Gupta", 
          phone: "9451234567", 
          village: "Todorpur", 
          ornament: "Silver Payal Set", 
          weight: "120g", 
          ornaments: [
            { name: "Silver Payal Set", weight: "120g" }
          ],
          amount: "9500", 
          discount: "500",
          paid: "9000",
          dues: "0", 
          date: "2026-07-08", 
          notes: "Fully Paid" 
        },
        { 
          id: "3", 
          name: "Rajesh Singh", 
          sonOf: "Shri Pratap Singh", 
          phone: "8877665544", 
          village: "Chowk", 
          ornament: "Gold Ring", 
          weight: "5.8g", 
          ornaments: [
            { name: "Gold Ring", weight: "5.8g" },
            { name: "Gold Chain", weight: "10.5g" }
          ],
          amount: "105000", 
          discount: "3000",
          paid: "90000",
          dues: "12000", 
          date: "2026-07-12", 
          notes: "Dues pending" 
        }
      ];
      setUdhaarRecords(initialUdhaar);
      localStorage.setItem("oj_udhaar_records", JSON.stringify(initialUdhaar));
    }

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
      const ccRes = await fetch("/api/custom-content", { cache: "no-store" });
      const ccData = await ccRes.json();
      if (ccData.success && ccData.content) {
        const loadedTexts: Record<string, string> = {};
        const loadedImages: Record<string, string> = {};
        
        const savedPasscode = ccData.content["oj_admin_passcode"];
        if (savedPasscode) setDbPasscode(savedPasscode);

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
      const prodRes = await fetch("/api/products", { cache: "no-store" });
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
  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    const typedHash = await hashPasscode(passcode);
    const defaultHash = await hashPasscode("OJ2026");
    const correctHash = dbPasscode.length === 64 
      ? dbPasscode 
      : (dbPasscode === "OJ2026" ? defaultHash : await hashPasscode(dbPasscode));

    if (typedHash === correctHash) {
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
  const handleUpdatePasscode = async (e: React.FormEvent) => {
    e.preventDefault();
    if (newPin.length < 4) {
      alert("Passcode must be at least 4 characters long.");
      return;
    }
    try {
      const hashedPin = await hashPasscode(newPin);
      const res = await fetch("/api/custom-content", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ key: "oj_admin_passcode", value: hashedPin }),
      });
      const data = await res.json();
      if (data.success) {
        setDbPasscode(hashedPin);
        localStorage.setItem("oj_admin_passcode", hashedPin);
        alert(`Passcode successfully updated and securely hashed in the database!`);
        setNewPin("");
      } else {
        alert("Failed to update passcode in database: " + data.error);
      }
    } catch (err: any) {
      alert("Error updating passcode: " + err.message);
    }
  };

  // Udhaar Notebook Handlers
  const handleAddUdhaar = (e: React.FormEvent) => {
    e.preventDefault();
    const nameInput = (document.getElementById("ud_name") as HTMLInputElement)?.value || "";
    const sonOfInput = (document.getElementById("ud_sonOf") as HTMLInputElement)?.value || "";
    const phoneInput = (document.getElementById("ud_phone") as HTMLInputElement)?.value || "";
    const villageInput = (document.getElementById("ud_village") as HTMLInputElement)?.value || "";
    const amountInput = (document.getElementById("ud_amount") as HTMLInputElement)?.value || "0";
    const discountInput = (document.getElementById("ud_discount") as HTMLInputElement)?.value || "0";
    const paidInput = (document.getElementById("ud_paid") as HTMLInputElement)?.value || "0";
    const duesInput = (document.getElementById("ud_dues") as HTMLInputElement)?.value || "0";
    const notesInput = (document.getElementById("ud_notes") as HTMLTextAreaElement)?.value || "";

    const activeOrnaments = newEntryItems.filter(item => item.ornament.trim() !== "");
    if (activeOrnaments.length === 0) {
      alert("❌ Please add at least one product and weight in the form!");
      return;
    }

    const newRecord: UdhaarRecord = {
      id: Date.now().toString(),
      name: nameInput,
      sonOf: sonOfInput,
      phone: phoneInput,
      village: villageInput,
      ornament: activeOrnaments[0].ornament, // fallback compatibility
      weight: activeOrnaments[0].weight,     // fallback compatibility
      ornaments: activeOrnaments,
      amount: amountInput,
      discount: discountInput,
      paid: paidInput,
      dues: duesInput,
      date: new Date().toISOString().split("T")[0],
      notes: notesInput
    };

    const updated = [...udhaarRecords, newRecord];
    setUdhaarRecords(updated);
    localStorage.setItem("oj_udhaar_records", JSON.stringify(updated));

    // Reset form & state
    (document.getElementById("ud_form") as HTMLFormElement)?.reset();
    setNewEntryItems([{ ornament: "", weight: "" }]);
    setNewEntryAmount("");
    setNewEntryDiscount("");
    setNewEntryPaid("");
    alert("🎉 Udhaar Entry with multiple products added successfully to the notebook!");
  };

  const handleDeleteUdhaar = (id: string) => {
    if (window.confirm("Are you sure you want to permanently delete this Udhaar record?")) {
      const updated = udhaarRecords.filter(r => r.id !== id);
      setUdhaarRecords(updated);
      localStorage.setItem("oj_udhaar_records", JSON.stringify(updated));
    }
  };

  const handleRecordPayment = (id: string) => {
    const payAmount = window.prompt("Enter payment amount received (in ₹):");
    if (payAmount === null) return;
    const amt = parseFloat(payAmount);
    if (isNaN(amt) || amt <= 0) {
      alert("Invalid payment amount entered.");
      return;
    }

    const updated = udhaarRecords.map(r => {
      if (r.id === id) {
        const currentDues = parseFloat(r.dues || "0");
        const currentPaid = parseFloat(r.paid || "0");
        const newDues = Math.max(0, currentDues - amt);
        const newPaid = currentPaid + amt;
        return {
          ...r,
          dues: newDues.toString(),
          paid: newPaid.toString(),
          notes: newDues === 0 ? "Fully Paid" : `${r.notes || ""}. Received payment ₹${amt} on ${new Date().toISOString().split("T")[0]}`
        };
      }
      return r;
    });

    setUdhaarRecords(updated);
    localStorage.setItem("oj_udhaar_records", JSON.stringify(updated));
    alert("💸 Payment recorded successfully! Dues updated.");
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

              <button
                onClick={() => setActiveTab("udhaar")}
                className={`w-full py-3 px-4 rounded-md text-left transition-colors flex items-center gap-3 ${
                  activeTab === "udhaar"
                    ? "bg-amber-500 text-neutral-950"
                    : "hover:bg-white/5 text-neutral-400 hover:text-white"
                }`}
              >
                <BookOpen className="w-4 h-4" />
                Udhaar Notebook
                {udhaarRecords.filter(r => parseFloat(r.dues || "0") > 0).length > 0 && (
                  <span className={`ml-auto w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-bold ${
                    activeTab === "udhaar" ? "bg-neutral-950 text-amber-500" : "bg-red-500 text-white"
                  }`}>
                    {udhaarRecords.filter(r => parseFloat(r.dues || "0") > 0).length}
                  </span>
                )}
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
          {/* Database Connectivity Status Alert */}
          {dbConnected === false && (
            <div className="mb-8 p-6 bg-red-500/10 border border-red-500/25 rounded-md flex flex-col md:flex-row md:items-center justify-between gap-4 animate-pulse-subtle">
              <div className="space-y-1">
                <div className="flex items-center gap-2 text-red-400 font-bold text-sm">
                  <ShieldAlert className="w-5 h-5 shrink-0" />
                  DATABASE CONNECTION ERROR
                </div>
                <p className="font-sans text-xs text-neutral-300">
                  The Admin Panel edits are not saving permanently because the server database is offline or not configured. 
                  Please verify your <code>DATABASE_URL</code> variable is set correctly in your Vercel Project Settings.
                </p>
                {dbError && (
                  <p className="font-mono text-[10px] text-red-500/80 bg-black/40 p-2 rounded mt-2 max-w-2xl overflow-x-auto">
                    Error detail: {dbError}
                  </p>
                )}
              </div>
              <a 
                href="https://vercel.com" 
                target="_blank" 
                rel="noreferrer" 
                className="shrink-0 py-2.5 px-5 bg-red-500/20 hover:bg-red-500/35 border border-red-500/30 hover:border-red-500 text-red-200 font-sans text-[10px] font-bold tracking-widest uppercase transition-all rounded-sm text-center"
              >
                Configure Vercel Settings
              </a>
            </div>
          )}
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

              {/* Festive Promo Card/Banner Content Override */}
              <div className="bg-neutral-900 border border-neutral-800 p-6 space-y-6">
                <h4 className="font-serif text-lg text-white">Festive Offer & Gift Card Management</h4>
                <form
                  onSubmit={async (e) => {
                    e.preventDefault();
                    const festiveSub = (document.getElementById("inp_festive_sub") as HTMLInputElement)?.value;
                    const festiveTitle1 = (document.getElementById("inp_festive_title_1") as HTMLInputElement)?.value;
                    const festiveTitle2 = (document.getElementById("inp_festive_title_2") as HTMLInputElement)?.value;
                    const festiveDesc = (document.getElementById("inp_festive_desc") as HTMLTextAreaElement)?.value;
                    const festiveCode = (document.getElementById("inp_festive_code") as HTMLInputElement)?.value;
                    const festivePct = (document.getElementById("inp_festive_pct") as HTMLInputElement)?.value;
                    const festiveSubCard = (document.getElementById("inp_festive_sub_card") as HTMLInputElement)?.value;
                    const festiveBless = (document.getElementById("inp_festive_bless") as HTMLInputElement)?.value;
                    const festiveLoc = (document.getElementById("inp_festive_loc") as HTMLInputElement)?.value;

                    try {
                      const payload = [
                        { key: "oj_custom_txt_festive_sub", value: festiveSub },
                        { key: "oj_custom_txt_festive_title_l1", value: festiveTitle1 },
                        { key: "oj_custom_txt_festive_title_l2", value: festiveTitle2 },
                        { key: "oj_custom_txt_festive_desc", value: festiveDesc },
                        { key: "oj_custom_txt_festive_code", value: festiveCode },
                        { key: "oj_custom_txt_festive_card_pct", value: festivePct },
                        { key: "oj_custom_txt_festive_card_sub", value: festiveSubCard },
                        { key: "oj_custom_txt_festive_card_bless", value: festiveBless },
                        { key: "oj_custom_txt_festive_card_loc", value: festiveLoc },
                      ];

                      for (const item of payload) {
                        await fetch("/api/custom-content", {
                          method: "POST",
                          headers: { "Content-Type": "application/json" },
                          body: JSON.stringify(item),
                        });
                      }

                      // Update local state
                      setCustomText((prev) => {
                        const updated = { ...prev };
                        payload.forEach(item => {
                          const id = item.key.replace("oj_custom_txt_", "");
                          updated[id] = item.value;
                        });
                        return updated;
                      });

                      alert("Festive discount banner and gift card copy updated successfully!");
                    } catch (err) {
                      console.error("Failed to save festive settings:", err);
                      alert("Failed to save festive settings to server.");
                    }
                  }}
                  className="space-y-4"
                >
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-[10px] uppercase tracking-widest text-amber-500 font-bold mb-2">
                        Promo Code
                      </label>
                      <input
                        type="text"
                        required
                        id="inp_festive_code"
                        defaultValue={customText["festive_code"] || "OJGOLD10"}
                        className="w-full bg-neutral-950 border border-neutral-800 focus:border-amber-500 outline-none py-2.5 px-4 text-white text-xs font-mono font-bold"
                      />
                    </div>
                    <div>
                      <label className="block text-[10px] uppercase tracking-widest text-amber-500 font-bold mb-2">
                        Gift Card Discount %
                      </label>
                      <input
                        type="text"
                        required
                        id="inp_festive_pct"
                        defaultValue={customText["festive_card_pct"] || "10% OFF"}
                        className="w-full bg-neutral-950 border border-neutral-800 focus:border-amber-500 outline-none py-2.5 px-4 text-white text-xs font-bold"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-[10px] uppercase tracking-widest text-amber-500 font-bold mb-2">
                        Festive Card Subtitle
                      </label>
                      <input
                        type="text"
                        required
                        id="inp_festive_sub_card"
                        defaultValue={customText["festive_card_sub"] || "Festive Gold Gift Card"}
                        className="w-full bg-neutral-950 border border-neutral-800 focus:border-amber-500 outline-none py-2.5 px-4 text-white text-xs"
                      />
                    </div>
                    <div>
                      <label className="block text-[10px] uppercase tracking-widest text-amber-500 font-bold mb-2">
                        Invitation Subtitle
                      </label>
                      <input
                        type="text"
                        required
                        id="inp_festive_sub"
                        defaultValue={customText["festive_sub"] || "Exclusive Festive Invitation"}
                        className="w-full bg-neutral-950 border border-neutral-800 focus:border-amber-500 outline-none py-2.5 px-4 text-white text-xs"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-[10px] uppercase tracking-widest text-amber-500 font-bold mb-2">
                        Offer Title Line 1
                      </label>
                      <input
                        type="text"
                        required
                        id="inp_festive_title_1"
                        defaultValue={customText["festive_title_l1"] || "Celebrate OJ's Legacy"}
                        className="w-full bg-neutral-950 border border-neutral-800 focus:border-amber-500 outline-none py-2.5 px-4 text-white text-xs"
                      />
                    </div>
                    <div>
                      <label className="block text-[10px] uppercase tracking-widest text-amber-500 font-bold mb-2">
                        Offer Title Line 2
                      </label>
                      <input
                        type="text"
                        required
                        id="inp_festive_title_2"
                        defaultValue={customText["festive_title_l2"] || "Get 10% Off Making Charges"}
                        className="w-full bg-neutral-950 border border-neutral-800 focus:border-amber-500 outline-none py-2.5 px-4 text-white text-xs"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-[10px] uppercase tracking-widest text-amber-500 font-bold mb-2">
                      Offer Description Copy
                    </label>
                    <textarea
                      required
                      id="inp_festive_desc"
                      rows={3}
                      defaultValue={customText["festive_desc"] || "Indulge in the finest 18K and 22K hallmarked gold creations. This festive season, claim our digital Gift Card to enjoy an exclusive 10% discount on making charges for all bridal, daily wear, and custom order gold jewelry."}
                      className="w-full bg-neutral-950 border border-neutral-800 focus:border-amber-500 outline-none py-2.5 px-4 text-white text-xs resize-none"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-[10px] uppercase tracking-widest text-amber-500 font-bold mb-2">
                        Auspicious Blessing
                      </label>
                      <input
                        type="text"
                        required
                        id="inp_festive_bless"
                        defaultValue={customText["festive_card_bless"] || "शुभ लाभ"}
                        className="w-full bg-neutral-950 border border-neutral-800 focus:border-amber-500 outline-none py-2.5 px-4 text-white text-xs"
                      />
                    </div>
                    <div>
                      <label className="block text-[10px] uppercase tracking-widest text-amber-500 font-bold mb-2">
                        Location Restriction
                      </label>
                      <input
                        type="text"
                        required
                        id="inp_festive_loc"
                        defaultValue={customText["festive_card_loc"] || "Valid Shahabad Chowk"}
                        className="w-full bg-neutral-950 border border-neutral-800 focus:border-amber-500 outline-none py-2.5 px-4 text-white text-xs"
                      />
                    </div>
                  </div>

                  <button
                    type="submit"
                    className="py-2.5 px-6 bg-amber-500 hover:bg-amber-600 text-neutral-950 font-sans text-[10px] font-bold tracking-widest uppercase transition-colors rounded-sm"
                  >
                    Save Festive Settings
                  </button>
                </form>
              </div>

              {/* Boutique Brand & Content Settings */}
              <div className="bg-neutral-900 border border-neutral-800 p-6 space-y-6">
                <h4 className="font-serif text-lg text-white">Boutique Brand & Content Settings</h4>
                <form
                  onSubmit={async (e) => {
                    e.preventDefault();
                    const navLeft = (document.getElementById("inp_nav_left") as HTMLInputElement)?.value;
                    const navBlessings = (document.getElementById("inp_nav_blessings") as HTMLInputElement)?.value;
                    const navRight = (document.getElementById("inp_nav_right") as HTMLInputElement)?.value;
                    
                    const heroBadge = (document.getElementById("inp_hero_badge") as HTMLInputElement)?.value;
                    const heroTitle1 = (document.getElementById("inp_hero_title_1") as HTMLInputElement)?.value;
                    const heroTitle2 = (document.getElementById("inp_hero_title_2") as HTMLInputElement)?.value;
                    const heroSubtitle = (document.getElementById("inp_hero_subtitle") as HTMLTextAreaElement)?.value;
                    const heroVideoUrl = (document.getElementById("inp_hero_video_url") as HTMLInputElement)?.value;
                    const heroBannerUrl = (document.getElementById("inp_hero_banner_url") as HTMLInputElement)?.value;

                    const aboutSub = (document.getElementById("inp_about_sub") as HTMLInputElement)?.value;
                    const aboutTitle = (document.getElementById("inp_about_title") as HTMLInputElement)?.value;
                    const aboutDesc1 = (document.getElementById("inp_about_desc1") as HTMLTextAreaElement)?.value;
                    const aboutDesc2 = (document.getElementById("inp_about_desc2") as HTMLTextAreaElement)?.value;
                    const aboutImageUrl = (document.getElementById("inp_about_image_url") as HTMLInputElement)?.value;

                    const silverSub = (document.getElementById("inp_silver_sub") as HTMLInputElement)?.value;
                    const silverTitle = (document.getElementById("inp_silver_title") as HTMLInputElement)?.value;
                    const silverDesc = (document.getElementById("inp_silver_desc") as HTMLTextAreaElement)?.value;

                    const newArrSub = (document.getElementById("inp_new_arr_sub") as HTMLInputElement)?.value;
                    const newArrTitle = (document.getElementById("inp_new_arr_title") as HTMLInputElement)?.value;
                    const newArrDesc = (document.getElementById("inp_new_arr_desc") as HTMLTextAreaElement)?.value;

                    const bestSellSub = (document.getElementById("inp_best_sell_sub") as HTMLInputElement)?.value;
                    const bestSellTitle = (document.getElementById("inp_best_sell_title") as HTMLInputElement)?.value;

                    const founderQuote = (document.getElementById("inp_founder_quote") as HTMLTextAreaElement)?.value;
                    const founderName = (document.getElementById("inp_founder_name") as HTMLInputElement)?.value;
                    const founderRole = (document.getElementById("inp_founder_role") as HTMLInputElement)?.value;
                    const founderPhotoUrl = (document.getElementById("inp_founder_photo_url") as HTMLInputElement)?.value;
                    const founderBigPhotoUrl = (document.getElementById("inp_founder_big_photo_url") as HTMLInputElement)?.value;

                    const whatsappNum = (document.getElementById("inp_whatsapp_num") as HTMLInputElement)?.value;
                    const audioUrl = (document.getElementById("inp_audio_url") as HTMLInputElement)?.value;

                    try {
                      const payload = [
                        { key: "oj_custom_txt_nav_left_txt", value: navLeft },
                        { key: "oj_custom_txt_nav_blessings", value: navBlessings },
                        { key: "oj_custom_txt_nav_right_txt", value: navRight },
                        
                        { key: "oj_custom_txt_hero_badge", value: heroBadge },
                        { key: "oj_custom_txt_hero_title_l1", value: heroTitle1 },
                        { key: "oj_custom_txt_hero_title_l2", value: heroTitle2 },
                        { key: "oj_custom_txt_hero_subtitle", value: heroSubtitle },
                        { key: "oj_custom_txt_hero_video_url", value: heroVideoUrl },
                        { key: "oj_custom_txt_hero_banner_url", value: heroBannerUrl },

                        { key: "oj_custom_txt_about_sub", value: aboutSub },
                        { key: "oj_custom_txt_about_title", value: aboutTitle },
                        { key: "oj_custom_txt_about_desc1", value: aboutDesc1 },
                        { key: "oj_custom_txt_about_desc2", value: aboutDesc2 },
                        { key: "oj_custom_txt_about_image_url", value: aboutImageUrl },

                        { key: "oj_custom_txt_silver_sub", value: silverSub },
                        { key: "oj_custom_txt_silver_title", value: silverTitle },
                        { key: "oj_custom_txt_silver_desc", value: silverDesc },

                        { key: "oj_custom_txt_new_arr_sub", value: newArrSub },
                        { key: "oj_custom_txt_new_arr_title", value: newArrTitle },
                        { key: "oj_custom_txt_new_arr_desc", value: newArrDesc },

                        { key: "oj_custom_txt_best_sell_sub", value: bestSellSub },
                        { key: "oj_custom_txt_best_sell_title", value: bestSellTitle },

                        { key: "oj_custom_txt_founder_quote_txt", value: founderQuote },
                        { key: "oj_custom_txt_owner_card_name", value: founderName },
                        { key: "oj_custom_txt_owner_card_role", value: founderRole },
                        { key: "oj_custom_txt_owner_photo", value: founderPhotoUrl },
                        { key: "oj_custom_txt_owner_big_photo", value: founderBigPhotoUrl },

                        { key: "oj_custom_txt_whats_app_number", value: whatsappNum },
                        { key: "oj_custom_txt_audio_url", value: audioUrl },
                      ];

                      for (const item of payload) {
                        await fetch("/api/custom-content", {
                          method: "POST",
                          headers: { "Content-Type": "application/json" },
                          body: JSON.stringify(item),
                        });
                      }

                      // Update local state
                      setCustomText((prev) => {
                        const updated = { ...prev };
                        payload.forEach(item => {
                          const id = item.key.replace("oj_custom_txt_", "");
                          updated[id] = item.value;
                        });
                        return updated;
                      });

                      alert("Boutique brand info and media settings saved successfully!");
                    } catch (err) {
                      console.error("Failed to save brand settings:", err);
                      alert("Failed to save brand settings to server.");
                    }
                  }}
                  className="space-y-4"
                >
                  {/* Navbar Slogans */}
                  <div className="border-b border-neutral-800 pb-4">
                    <h5 className="font-serif text-sm text-[#dfba73] mb-3">Sacred Header Bar</h5>
                    <div className="grid grid-cols-2 gap-4 mb-3">
                      <div>
                        <label className="block text-[9px] uppercase tracking-widest text-neutral-400 font-bold mb-1.5">
                          Left Address Label
                        </label>
                        <input
                          type="text"
                          required
                          id="inp_nav_left"
                          defaultValue={customText["nav_left_txt"] || "SHAHABAD HARDOI CHOWK"}
                          className="w-full bg-neutral-950 border border-neutral-800 focus:border-amber-500 py-2 px-3 text-white text-xs"
                        />
                      </div>
                      <div>
                        <label className="block text-[9px] uppercase tracking-widest text-neutral-400 font-bold mb-1.5">
                          Right Purity Label
                        </label>
                        <input
                          type="text"
                          required
                          id="inp_nav_right"
                          defaultValue={customText["nav_right_txt"] || "100% BIS HALLMARKED PURE GOLD"}
                          className="w-full bg-neutral-950 border border-neutral-800 focus:border-amber-500 py-2 px-3 text-white text-xs"
                        />
                      </div>
                    </div>
                    <div>
                      <label className="block text-[9px] uppercase tracking-widest text-neutral-400 font-bold mb-1.5">
                        Central Blessings Slogans
                      </label>
                      <input
                        type="text"
                        required
                        id="inp_nav_blessings"
                        defaultValue={customText["nav_blessings"] || "ॐ श्री गणेशाय नमः • ॐ नमः शिवाय • शुभ लाभ"}
                        className="w-full bg-neutral-950 border border-neutral-800 focus:border-amber-500 py-2 px-3 text-white text-xs"
                      />
                    </div>
                  </div>

                  {/* Hero Banner Text & Media */}
                  <div className="border-b border-neutral-800 pb-4">
                    <h5 className="font-serif text-sm text-[#dfba73] mb-3">Hero Section Banner & Showcase</h5>
                    <div className="grid grid-cols-2 gap-4 mb-3">
                      <div>
                        <label className="block text-[9px] uppercase tracking-widest text-neutral-400 font-bold mb-1.5">
                          Hero Badge
                        </label>
                        <input
                          type="text"
                          required
                          id="inp_hero_badge"
                          defaultValue={customText["hero_badge"] || "EST. 2026 • PURE GOLD REDEFINED"}
                          className="w-full bg-neutral-950 border border-neutral-800 focus:border-amber-500 py-2 px-3 text-white text-xs"
                        />
                      </div>
                      <div>
                        <label className="block text-[9px] uppercase tracking-widest text-neutral-400 font-bold mb-1.5">
                          Showcase Video URL
                        </label>
                        <input
                          type="text"
                          required
                          id="inp_hero_video_url"
                          defaultValue={customText["hero_video_url"] || "https://player.vimeo.com/external/371433846.sd.mp4?s=236da2f3c054e08b15d0ec3efd8ec92a353d7f4b&profile_id=139&oauth2_token_id=57447761"}
                          className="w-full bg-neutral-950 border border-neutral-800 focus:border-amber-500 py-2 px-3 text-white text-xs font-mono"
                        />
                      </div>
                    </div>
                    <div className="mb-3">
                      <label className="block text-[9px] uppercase tracking-widest text-neutral-400 font-bold mb-1.5">
                        Showcase Photo Banner URL (Overrides video background if set)
                      </label>
                      <input
                        type="text"
                        required
                        id="inp_hero_banner_url"
                        defaultValue={customText["hero_banner_url"] || ""}
                        placeholder="Paste image URL (e.g. Unsplash link) to use an image instead of video"
                        className="w-full bg-neutral-950 border border-neutral-800 focus:border-amber-500 py-2 px-3 text-white text-xs font-mono"
                      />
                    </div>
                    <div className="grid grid-cols-2 gap-4 mb-3">
                      <div>
                        <label className="block text-[9px] uppercase tracking-widest text-neutral-400 font-bold mb-1.5">
                          Hero Title Line 1
                        </label>
                        <input
                          type="text"
                          required
                          id="inp_hero_title_1"
                          defaultValue={customText["hero_title_l1"] || "Pure Golden Legacies,"}
                          className="w-full bg-neutral-950 border border-neutral-800 focus:border-amber-500 py-2 px-3 text-white text-xs"
                        />
                      </div>
                      <div>
                        <label className="block text-[9px] uppercase tracking-widest text-neutral-400 font-bold mb-1.5">
                          Hero Title Line 2
                        </label>
                        <input
                          type="text"
                          required
                          id="inp_hero_title_2"
                          defaultValue={customText["hero_title_l2"] || "Sculpted for the Modern Era."}
                          className="w-full bg-neutral-950 border border-neutral-800 focus:border-amber-500 py-2 px-3 text-white text-xs"
                        />
                      </div>
                    </div>
                    <div>
                      <label className="block text-[9px] uppercase tracking-widest text-neutral-400 font-bold mb-1.5">
                        Hero Subtitle Description
                      </label>
                      <textarea
                        required
                        id="inp_hero_subtitle"
                        rows={2}
                        defaultValue={customText["hero_subtitle"] || "Discover Omar Jewellers OJ. Modern Gen Z aesthetics meet 18k and 22k pure solid gold, forming hand-finished silhouettes that whisper absolute luxury."}
                        className="w-full bg-neutral-950 border border-neutral-800 focus:border-amber-500 py-2 px-3 text-white text-xs resize-none"
                      />
                    </div>
                  </div>

                  {/* About Section details */}
                  <div className="border-b border-neutral-800 pb-4">
                    <h5 className="font-serif text-sm text-[#dfba73] mb-3">About Story & Heritage Section</h5>
                    <div className="grid grid-cols-2 gap-4 mb-3">
                      <div>
                        <label className="block text-[9px] uppercase tracking-widest text-neutral-400 font-bold mb-1.5">
                          About Subtitle
                        </label>
                        <input
                          type="text"
                          required
                          id="inp_about_sub"
                          defaultValue={customText["about_sub"] || "Gold Alchemy"}
                          className="w-full bg-neutral-950 border border-neutral-800 focus:border-amber-500 py-2 px-3 text-white text-xs"
                        />
                      </div>
                      <div>
                        <label className="block text-[9px] uppercase tracking-widest text-neutral-400 font-bold mb-1.5">
                          About Main Title
                        </label>
                        <input
                          type="text"
                          required
                          id="inp_about_title"
                          defaultValue={customText["about_title"] || "Omar Jewellers OJ"}
                          className="w-full bg-neutral-950 border border-neutral-800 focus:border-amber-500 py-2 px-3 text-white text-xs"
                        />
                      </div>
                    </div>
                    <div className="mb-3">
                      <label className="block text-[9px] uppercase tracking-widest text-neutral-400 font-bold mb-1.5">
                        About Showcase Photo URL
                      </label>
                      <input
                        type="text"
                        required
                        id="inp_about_image_url"
                        defaultValue={customText["about_image_url"] || "https://images.unsplash.com/photo-1602751584552-8ba73aad10e1?q=80&w=800&auto=format&fit=crop"}
                        className="w-full bg-neutral-950 border border-neutral-800 focus:border-amber-500 py-2 px-3 text-white text-xs font-mono"
                      />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-[9px] uppercase tracking-widest text-neutral-400 font-bold mb-1.5">
                          Heritage Paragraph 1
                        </label>
                        <textarea
                          required
                          id="inp_about_desc1"
                          rows={3}
                          defaultValue={customText["about_desc1"] || "Founded on the values of trust, master craftsmanship, and absolute purity, Omar Jewellers OJ redefines precious metal couture for the self-expressive generation..."}
                          className="w-full bg-neutral-950 border border-neutral-800 focus:border-amber-500 py-2 px-3 text-white text-xs resize-none"
                        />
                      </div>
                      <div>
                        <label className="block text-[9px] uppercase tracking-widest text-neutral-400 font-bold mb-1.5">
                          Heritage Paragraph 2
                        </label>
                        <textarea
                          required
                          id="inp_about_desc2"
                          rows={3}
                          defaultValue={customText["about_desc2"] || "Every silhouette is hallmarked with unique HUID codes laser-inscribed under central registry standards. Enjoy digital gold clarity linked directly to your order catalog."}
                          className="w-full bg-neutral-950 border border-neutral-800 focus:border-amber-500 py-2 px-3 text-white text-xs resize-none"
                        />
                      </div>
                    </div>
                  </div>

                  {/* Sterling Silver Collection settings */}
                  <div className="border-b border-neutral-800 pb-4">
                    <h5 className="font-serif text-sm text-[#dfba73] mb-3">Sterling Silver Collection Header</h5>
                    <div className="grid grid-cols-2 gap-4 mb-3">
                      <div>
                        <label className="block text-[9px] uppercase tracking-widest text-neutral-400 font-bold mb-1.5">
                          Silver Section Subtitle
                        </label>
                        <input
                          type="text"
                          required
                          id="inp_silver_sub"
                          defaultValue={customText["silver_sub"] || "925 Sterling Silver Edit"}
                          className="w-full bg-neutral-950 border border-neutral-800 focus:border-amber-500 py-2 px-3 text-white text-xs"
                        />
                      </div>
                      <div>
                        <label className="block text-[9px] uppercase tracking-widest text-neutral-400 font-bold mb-1.5">
                          Silver Section Main Title
                        </label>
                        <input
                          type="text"
                          required
                          id="inp_silver_title"
                          defaultValue={customText["silver_title"] || "Sterling Silver Collection"}
                          className="w-full bg-neutral-950 border border-neutral-800 focus:border-amber-500 py-2 px-3 text-white text-xs"
                        />
                      </div>
                    </div>
                    <div>
                      <label className="block text-[9px] uppercase tracking-widest text-neutral-400 font-bold mb-1.5">
                        Silver Section Description
                      </label>
                      <textarea
                        required
                        id="inp_silver_desc"
                        rows={2}
                        defaultValue={customText["silver_desc"] || "Pure hallmarked 925 sterling silver jewelry. Anti-tarnish, hypoallergenic creations crafted for brilliant luster."}
                        className="w-full bg-neutral-950 border border-neutral-800 focus:border-amber-500 py-2 px-3 text-white text-xs resize-none"
                      />
                    </div>
                  </div>

                  {/* New Arrivals & Best Sellers headings */}
                  <div className="border-b border-neutral-800 pb-4">
                    <h5 className="font-serif text-sm text-[#dfba73] mb-3">Gold Collections Titles</h5>
                    <div className="grid grid-cols-2 gap-4 mb-3">
                      <div>
                        <label className="block text-[9px] uppercase tracking-widest text-neutral-400 font-bold mb-1.5">
                          New Arrivals Subtitle
                        </label>
                        <input
                          type="text"
                          required
                          id="inp_new_arr_sub"
                          defaultValue={customText["new_arr_sub"] || "The Pure Gold Edit"}
                          className="w-full bg-neutral-950 border border-neutral-800 focus:border-amber-500 py-2 px-3 text-white text-xs"
                        />
                      </div>
                      <div>
                        <label className="block text-[9px] uppercase tracking-widest text-neutral-400 font-bold mb-1.5">
                          New Arrivals Main Title
                        </label>
                        <input
                          type="text"
                          required
                          id="inp_new_arr_title"
                          defaultValue={customText["new_arr_title"] || "New Gold Arrivals"}
                          className="w-full bg-neutral-950 border border-neutral-800 focus:border-amber-500 py-2 px-3 text-white text-xs"
                        />
                      </div>
                    </div>
                    <div className="mb-3">
                      <label className="block text-[9px] uppercase tracking-widest text-neutral-400 font-bold mb-1.5">
                        New Arrivals Description
                      </label>
                      <textarea
                        required
                        id="inp_new_arr_desc"
                        rows={2}
                        defaultValue={customText["new_arr_desc"] || "Freshly cast designs curated in rich 18k and 22k gold, showcasing brushed, hammered, and mirror finishes."}
                        className="w-full bg-neutral-950 border border-neutral-800 focus:border-amber-500 py-2 px-3 text-white text-xs resize-none"
                      />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-[9px] uppercase tracking-widest text-neutral-400 font-bold mb-1.5">
                          Best Sellers Subtitle
                        </label>
                        <input
                          type="text"
                          required
                          id="inp_best_sell_sub"
                          defaultValue={customText["best_sell_sub"] || "Gold Statements"}
                          className="w-full bg-neutral-950 border border-neutral-800 focus:border-amber-500 py-2 px-3 text-white text-xs"
                        />
                      </div>
                      <div>
                        <label className="block text-[9px] uppercase tracking-widest text-neutral-400 font-bold mb-1.5">
                          Best Sellers Main Title
                        </label>
                        <input
                          type="text"
                          required
                          id="inp_best_sell_title"
                          defaultValue={customText["best_sell_title"] || "Best Sellers"}
                          className="w-full bg-neutral-950 border border-neutral-800 focus:border-amber-500 py-2 px-3 text-white text-xs"
                        />
                      </div>
                    </div>
                  </div>

                  {/* Founder details */}
                  <div className="border-b border-neutral-800 pb-4">
                    <h5 className="font-serif text-sm text-[#dfba73] mb-3">Founder Profile Details</h5>
                    <div className="grid grid-cols-2 gap-4 mb-3">
                      <div>
                        <label className="block text-[9px] uppercase tracking-widest text-neutral-400 font-bold mb-1.5">
                          Founder Name
                        </label>
                        <input
                          type="text"
                          required
                          id="inp_founder_name"
                          defaultValue={customText["owner_card_name"] || "Mr. Yogesh Kumar Gupta"}
                          className="w-full bg-neutral-950 border border-neutral-800 focus:border-amber-500 py-2 px-3 text-white text-xs"
                        />
                      </div>
                      <div>
                        <label className="block text-[9px] uppercase tracking-widest text-neutral-400 font-bold mb-1.5">
                          Founder Title / Role
                        </label>
                        <input
                          type="text"
                          required
                          id="inp_founder_role"
                          defaultValue={customText["owner_card_role"] || "Managing Director & Boutique Founder"}
                          className="w-full bg-neutral-950 border border-neutral-800 focus:border-amber-500 py-2 px-3 text-white text-xs"
                        />
                      </div>
                    </div>
                    <div className="grid grid-cols-2 gap-4 mb-3">
                      <div>
                        <label className="block text-[9px] uppercase tracking-widest text-neutral-400 font-bold mb-1.5">
                          Small Avatar Photo URL (Round headshot)
                        </label>
                        <input
                          type="text"
                          required
                          id="inp_founder_photo_url"
                          defaultValue={customText["owner_photo"] || "https://images.unsplash.com/photo-1560250097-0b93528c311a?q=80&w=200&auto=format&fit=crop"}
                          className="w-full bg-neutral-950 border border-neutral-800 focus:border-amber-500 py-2 px-3 text-white text-xs font-mono"
                        />
                      </div>
                      <div>
                        <label className="block text-[9px] uppercase tracking-widest text-neutral-400 font-bold mb-1.5">
                          Large Founder Profile Image URL (Left side)
                        </label>
                        <input
                          type="text"
                          required
                          id="inp_founder_big_photo_url"
                          defaultValue={customText["owner_big_photo"] || "https://images.unsplash.com/photo-1573408301185-9146fe634ad0?q=80&w=800&auto=format&fit=crop"}
                          className="w-full bg-neutral-950 border border-neutral-800 focus:border-amber-500 py-2 px-3 text-white text-xs font-mono"
                        />
                      </div>
                    </div>
                    <div>
                      <label className="block text-[9px] uppercase tracking-widest text-neutral-400 font-bold mb-1.5">
                        Founder Quote Statement
                      </label>
                      <textarea
                        required
                        id="inp_founder_quote"
                        rows={3}
                        defaultValue={customText["founder_quote_txt"] || "“Jewellery is not merely an ornament; it is a timestamp of your legacy. When we hand-craft pure gold at Omar Jewellers OJ, we are shaping stories of love, heritage, and pride that will be passed down for generations.”"}
                        className="w-full bg-neutral-950 border border-neutral-800 focus:border-amber-500 py-2 px-3 text-white text-xs resize-none"
                      />
                    </div>
                  </div>

                  {/* Contact configurations */}
                  <div className="border-b border-neutral-800 pb-4">
                    <h5 className="font-serif text-sm text-[#dfba73] mb-3">Concierge Contact configurations</h5>
                    <div>
                      <label className="block text-[9px] uppercase tracking-widest text-neutral-400 font-bold mb-1.5">
                        WhatsApp Contact Number (No space/prefix, e.g. 9936488845)
                      </label>
                      <input
                        type="text"
                        required
                        id="inp_whatsapp_num"
                        defaultValue={customText["whats_app_number"] || "9936488845"}
                        className="w-full bg-neutral-950 border border-neutral-800 focus:border-amber-500 py-2 px-3 text-white text-xs"
                      />
                    </div>
                  </div>

                  {/* Ambient Music Source */}
                  <div>
                    <h5 className="font-serif text-sm text-[#dfba73] mb-3">Ambient Sound settings</h5>
                    <div className="space-y-3">
                      <div>
                        <label className="block text-[9px] uppercase tracking-widest text-neutral-400 font-bold mb-1.5">
                          Background Sitar/Flute Music Audio URL (Direct MP3 link)
                        </label>
                        <input
                          type="text"
                          required
                          id="inp_audio_url"
                          defaultValue={customText["audio_url"] || "https://archive.org/download/ICCR-474-AC/ICCR-474-AC.mp3"}
                          className="w-full bg-neutral-950 border border-neutral-800 focus:border-amber-500 py-2.5 px-4 text-white text-xs font-mono"
                        />
                      </div>
                      <div className="flex items-center gap-3">
                        <span className="text-neutral-500 font-sans text-[10px] tracking-wide uppercase font-bold">
                          Or upload audio file:
                        </span>
                        <label className="bg-amber-500/10 hover:bg-amber-500/20 text-amber-500 border border-amber-500/30 px-3.5 py-1.5 rounded text-[10px] uppercase font-bold tracking-widest cursor-pointer transition-all flex items-center gap-1.5">
                          <Upload className="w-3.5 h-3.5" /> Choose Audio File
                          <input
                            type="file"
                            accept="audio/*"
                            className="hidden"
                            onChange={(e) => {
                              const file = e.target.files?.[0];
                              if (file) {
                                // Check file size limit (limit to 10MB to avoid database bloat)
                                if (file.size > 10 * 1024 * 1024) {
                                  alert("❌ Audio file must be smaller than 10MB to avoid upload issues.");
                                  return;
                                }
                                const r = new FileReader();
                                r.onloadend = () => {
                                  if (typeof r.result === "string") {
                                    const input = document.getElementById("inp_audio_url") as HTMLInputElement;
                                    if (input) {
                                      input.value = r.result;
                                      alert("🎵 Audio file loaded successfully as Base64 data! Click 'Save Boutique Content' below to permanently save it to the database.");
                                    }
                                  }
                                };
                                r.readAsDataURL(file);
                              }
                            }}
                          />
                        </label>
                      </div>
                    </div>
                  </div>

                  <button
                    type="submit"
                    className="py-2.5 px-6 bg-amber-500 hover:bg-amber-600 text-neutral-950 font-sans text-[10px] font-bold tracking-widest uppercase transition-colors rounded-sm"
                  >
                    Save Boutique Content
                  </button>
                </form>
              </div>
            </div>
          )}

          {/* TAB 5: UDHAAR NOTEBOOK */}
          {activeTab === "udhaar" && (
            <div className="space-y-6 animate-fade-in">
              <div className="flex flex-col md:flex-row md:items-center justify-between border-b border-amber-500/15 pb-4 gap-4">
                <div>
                  <span className="font-sans text-[10px] text-amber-500 tracking-[0.3em] uppercase font-bold block">
                    Ledger Registry
                  </span>
                  <h2 className="font-serif text-3xl font-light text-white mt-1">
                    Udhaar Notebook (खाता बही)
                  </h2>
                  <p className="font-sans text-xs text-neutral-400 mt-1">
                    Track customer credits, village-wise accounts, gold weights, and record credit payments.
                  </p>
                </div>

                {/* Quick Stats Panel */}
                <div className="flex gap-4">
                  <div className="bg-neutral-900 border border-neutral-800 p-4 rounded-sm min-w-[120px] text-center">
                    <span className="text-[9px] uppercase tracking-wider text-neutral-400 font-bold block">Total Accounts</span>
                    <span className="font-serif text-xl text-white font-semibold block mt-1">{udhaarRecords.length}</span>
                  </div>
                  <div className="bg-neutral-900 border border-red-500/25 p-4 rounded-sm min-w-[140px] text-center">
                    <span className="text-[9px] uppercase tracking-wider text-red-400 font-bold block">Total Dues</span>
                    <span className="font-serif text-xl text-red-400 font-semibold block mt-1">
                      ₹{udhaarRecords.reduce((sum, r) => sum + parseFloat(r.dues || "0"), 0).toLocaleString()}
                    </span>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
                {/* Left: Add New Entry Form */}
                <div className="bg-neutral-900 border border-neutral-800 p-6 rounded-sm space-y-6">
                  <h3 className="font-serif text-lg text-[#dfba73] border-b border-neutral-800 pb-2 flex items-center gap-2">
                    <Plus className="w-4 h-4 text-[#dfba73]" />
                    New Ledger Entry
                  </h3>
                  
                  <form id="ud_form" onSubmit={handleAddUdhaar} className="space-y-4 font-sans text-xs text-neutral-300">
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-[9px] uppercase tracking-wider text-neutral-400 font-bold mb-1.5">
                          Customer Name *
                        </label>
                        <input
                          type="text"
                          required
                          id="ud_name"
                          placeholder="e.g. Ramesh Kumar"
                          className="w-full bg-neutral-950 border border-neutral-800 focus:border-amber-500 outline-none py-2 px-3 text-white text-xs"
                        />
                      </div>
                      <div>
                        <label className="block text-[9px] uppercase tracking-wider text-neutral-400 font-bold mb-1.5">
                          S/O or Husband *
                        </label>
                        <input
                          type="text"
                          required
                          id="ud_sonOf"
                          placeholder="Father / Husband Name"
                          className="w-full bg-neutral-950 border border-neutral-800 focus:border-amber-500 outline-none py-2 px-3 text-white text-xs"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-[9px] uppercase tracking-wider text-neutral-400 font-bold mb-1.5">
                          Phone Number *
                        </label>
                        <input
                          type="text"
                          required
                          id="ud_phone"
                          placeholder="Phone Number"
                          className="w-full bg-neutral-950 border border-neutral-800 focus:border-amber-500 outline-none py-2 px-3 text-white text-xs font-mono"
                        />
                      </div>
                      <div>
                        <label className="block text-[9px] uppercase tracking-wider text-neutral-400 font-bold mb-1.5">
                          Village / Address *
                        </label>
                        <input
                          type="text"
                          required
                          id="ud_village"
                          placeholder="e.g. Todorpur, Shahabad"
                          className="w-full bg-neutral-950 border border-neutral-800 focus:border-amber-500 outline-none py-2 px-3 text-white text-xs"
                        />
                      </div>
                    </div>

                    {/* Multiple Products and Weights Fields */}
                    <div className="space-y-3 pt-2 border-t border-neutral-800/60">
                      <div className="flex items-center justify-between">
                        <label className="block text-[9px] uppercase tracking-wider text-amber-500 font-bold">
                          Products & Weights List *
                        </label>
                        <button
                          type="button"
                          onClick={() => setNewEntryItems([...newEntryItems, { ornament: "", weight: "" }])}
                          className="text-[9px] uppercase tracking-wider bg-amber-500/10 hover:bg-amber-500/20 text-amber-500 py-1 px-2.5 rounded border border-amber-500/25 font-bold transition-all flex items-center gap-1 cursor-pointer"
                        >
                          <Plus className="w-3 h-3" /> Add Product
                        </button>
                      </div>

                      {newEntryItems.map((item, idx) => (
                        <div key={idx} className="flex gap-2 items-end bg-neutral-950/60 p-2.5 rounded border border-neutral-800/40 relative group/row">
                          <div className="flex-1 space-y-1.5">
                            <input
                              type="text"
                              required
                              value={item.ornament}
                              onChange={(e) => {
                                const updated = [...newEntryItems];
                                updated[idx].ornament = e.target.value;
                                setNewEntryItems(updated);
                              }}
                              placeholder="Product name (e.g. Gold Ring)"
                              className="w-full bg-neutral-950 border border-neutral-800 focus:border-amber-500 outline-none py-1.5 px-2.5 text-white text-xs"
                            />
                          </div>
                          <div className="w-24 space-y-1.5">
                            <input
                              type="text"
                              required
                              value={item.weight}
                              onChange={(e) => {
                                const updated = [...newEntryItems];
                                updated[idx].weight = e.target.value;
                                setNewEntryItems(updated);
                              }}
                              placeholder="Weight (e.g. 5.4g)"
                              className="w-full bg-neutral-950 border border-neutral-800 focus:border-amber-500 outline-none py-1.5 px-2.5 text-white text-xs font-mono"
                            />
                          </div>
                          {newEntryItems.length > 1 && (
                            <button
                              type="button"
                              onClick={() => setNewEntryItems(newEntryItems.filter((_, i) => i !== idx))}
                              className="p-1.5 bg-red-500/10 border border-red-500/20 text-red-400 hover:bg-red-500/20 rounded transition-colors"
                              title="Remove item"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          )}
                        </div>
                      ))}
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-[9px] uppercase tracking-wider text-neutral-400 font-bold mb-1.5">
                          Total Bill Value (₹) *
                        </label>
                        <input
                          type="number"
                          required
                          id="ud_amount"
                          value={newEntryAmount}
                          onChange={(e) => setNewEntryAmount(e.target.value)}
                          placeholder="e.g. 50000"
                          className="w-full bg-neutral-950 border border-neutral-800 focus:border-amber-500 outline-none py-2 px-3 text-white text-xs font-mono"
                        />
                      </div>
                      <div>
                        <label className="block text-[9px] uppercase tracking-wider text-neutral-400 font-bold mb-1.5">
                          Discount Given (₹)
                        </label>
                        <input
                          type="number"
                          id="ud_discount"
                          value={newEntryDiscount}
                          onChange={(e) => setNewEntryDiscount(e.target.value)}
                          placeholder="e.g. 2000"
                          className="w-full bg-neutral-950 border border-neutral-800 focus:border-amber-500 outline-none py-2 px-3 text-white text-xs font-mono"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-[9px] uppercase tracking-wider text-neutral-400 font-bold mb-1.5">
                          Amount Given / Paid (₹) *
                        </label>
                        <input
                          type="number"
                          required
                          id="ud_paid"
                          value={newEntryPaid}
                          onChange={(e) => setNewEntryPaid(e.target.value)}
                          placeholder="e.g. 30000"
                          className="w-full bg-neutral-950 border border-neutral-800 focus:border-amber-500 outline-none py-2 px-3 text-white text-xs font-mono"
                        />
                      </div>
                      <div>
                        <label className="block text-[9px] uppercase tracking-wider text-neutral-400 font-bold mb-1.5">
                          Pending Dues (₹) (Auto-calculated)
                        </label>
                        <input
                          type="number"
                          readOnly
                          id="ud_dues"
                          value={Math.max(0, parseFloat(newEntryAmount || "0") - parseFloat(newEntryDiscount || "0") - parseFloat(newEntryPaid || "0"))}
                          className="w-full bg-neutral-900 border border-neutral-800 text-[#dfba73] focus:outline-none py-2 px-3 text-xs font-mono font-bold cursor-not-allowed"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-[9px] uppercase tracking-wider text-neutral-400 font-bold mb-1.5">
                        Internal Ledger Notes
                      </label>
                      <textarea
                        id="ud_notes"
                        rows={2}
                        placeholder="e.g. Promised to clear on Diwali"
                        className="w-full bg-neutral-950 border border-neutral-800 focus:border-amber-500 outline-none py-2 px-3 text-white text-xs resize-none"
                      />
                    </div>

                    <button
                      type="submit"
                      className="w-full py-2.5 bg-amber-500 hover:bg-amber-600 text-neutral-950 font-sans text-[10px] font-bold tracking-widest uppercase transition-colors rounded-sm flex items-center justify-center gap-2 cursor-pointer"
                    >
                      <Plus className="w-4 h-4" />
                      Add to Notebook
                    </button>
                  </form>
                </div>

                {/* Right: Search & Table */}
                <div className="lg:col-span-2 space-y-4">
                  {/* Search bar */}
                  <div className="relative w-full">
                    <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-neutral-500">
                      <Search className="w-4 h-4" />
                    </span>
                    <input
                      type="text"
                      value={udhaarSearchQuery}
                      onChange={(e) => setUdhaarSearchQuery(e.target.value)}
                      placeholder="Search ledger by Name, S/O Name, Phone, Village, Ornament or Date..."
                      className="w-full bg-neutral-900 border border-neutral-800 focus:border-amber-500 hover:border-neutral-700 outline-none rounded-md py-3 pl-11 pr-6 text-xs font-sans text-white transition-all shadow-md"
                    />
                    {udhaarSearchQuery && (
                      <button
                        onClick={() => setUdhaarSearchQuery("")}
                        className="absolute inset-y-0 right-4 flex items-center text-neutral-500 hover:text-white text-[10px] uppercase font-bold font-sans"
                      >
                        Clear
                      </button>
                    )}
                  </div>

                  {/* Ledger Table */}
                  <div className="bg-neutral-900 border border-neutral-800 rounded-sm overflow-hidden">
                    <div className="overflow-x-auto">
                      <table className="w-full text-left font-sans text-xs border-collapse">
                        <thead>
                          <tr className="border-b border-neutral-800 bg-neutral-950 text-neutral-400 font-bold uppercase tracking-wider text-[9px]">
                            <th className="py-4 px-4 text-center">S.No</th>
                            <th className="py-4 px-4">Customer Details</th>
                            <th className="py-4 px-4">Village</th>
                            <th className="py-4 px-4">Purchase details</th>
                            <th className="py-4 px-4 text-right">Financials (₹)</th>
                            <th className="py-4 px-4 text-center">Actions</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-neutral-800/50">
                          {udhaarRecords
                            .filter((rec) => {
                              const query = udhaarSearchQuery.toLowerCase();
                              const matchesName = rec.name.toLowerCase().includes(query);
                              const matchesSonOf = rec.sonOf.toLowerCase().includes(query);
                              const matchesPhone = rec.phone.toLowerCase().includes(query);
                              const matchesVillage = rec.village.toLowerCase().includes(query);
                              const matchesDate = rec.date.toLowerCase().includes(query);
                              const matchesOrnament = rec.ornament.toLowerCase().includes(query) || 
                                (rec.ornaments && rec.ornaments.some(o => o.name.toLowerCase().includes(query)));
                              
                              return matchesName || matchesSonOf || matchesPhone || matchesVillage || matchesDate || matchesOrnament;
                            })
                            .map((rec, index) => {
                              const hasDues = parseFloat(rec.dues || "0") > 0;
                              return (
                                <tr key={rec.id} className="hover:bg-white/3 transition-colors">
                                  <td className="py-4 px-4 text-center font-mono text-neutral-500">
                                    {index + 1}
                                  </td>
                                  <td className="py-4 px-4">
                                    <div className="font-bold text-white text-sm">{rec.name}</div>
                                    <div className="text-neutral-400 text-[10px] mt-0.5">S/O: {rec.sonOf}</div>
                                    <div className="text-neutral-500 text-[10px] mt-0.5 font-mono">{rec.phone}</div>
                                  </td>
                                  <td className="py-4 px-4 text-neutral-300 font-medium">
                                    <div className="flex items-center gap-1">
                                      <MapPin className="w-3.5 h-3.5 text-amber-500/60" />
                                      {rec.village}
                                    </div>
                                  </td>
                                  <td className="py-4 px-4">
                                    {rec.ornaments && rec.ornaments.length > 0 ? (
                                      <div className="space-y-2">
                                        {rec.ornaments.map((item, idx) => (
                                          <div key={idx} className="border-b border-neutral-800/40 pb-1.5 last:border-0 last:pb-0">
                                            <div className="font-bold text-[#dfba73]">{item.name}</div>
                                            <div className="text-[10px] text-neutral-400 mt-0.5 font-sans">
                                              Weight: <span className="font-mono bg-neutral-950 px-1.5 py-0.5 rounded-sm border border-neutral-800/60 text-white font-bold">{item.weight}</span>
                                            </div>
                                          </div>
                                        ))}
                                      </div>
                                    ) : (
                                      <>
                                        <div className="font-bold text-[#dfba73]">{rec.ornament}</div>
                                        <div className="text-[10px] text-neutral-400 mt-0.5">
                                          Weight: <span className="font-mono bg-neutral-950 px-1.5 py-0.5 rounded-sm border border-neutral-800/60 text-white font-bold">{rec.weight}</span>
                                        </div>
                                      </>
                                    )}
                                    <div className="text-[9px] text-neutral-500 mt-2 flex items-center gap-1 font-mono">
                                      <Calendar className="w-3 h-3" />
                                      {rec.date}
                                    </div>
                                  </td>
                                  <td className="py-4 px-4 text-right space-y-0.5">
                                    <div className="font-mono text-neutral-400 text-[10px]">Total: ₹{parseFloat(rec.amount || "0").toLocaleString()}</div>
                                    <div className="font-mono text-neutral-400 text-[10px]">Discount: ₹{parseFloat(rec.discount || "0").toLocaleString()}</div>
                                    <div className="font-mono text-neutral-400 text-[10px]">Gave: ₹{parseFloat(rec.paid || "0").toLocaleString()}</div>
                                    <div className={`font-mono text-xs font-extrabold pt-1 border-t border-neutral-800/60 ${hasDues ? "text-red-400" : "text-green-400"}`}>
                                      {hasDues ? `Dues: ₹${parseFloat(rec.dues).toLocaleString()}` : "✓ Fully Paid"}
                                    </div>
                                    {rec.notes && (
                                      <div className="text-[9px] text-neutral-500 max-w-[150px] truncate pt-0.5" title={rec.notes}>
                                        {rec.notes}
                                      </div>
                                    )}
                                  </td>
                                  <td className="py-4 px-4 text-center">
                                    <div className="flex items-center justify-center gap-2">
                                      <button
                                        onClick={() => setSelectedUdhaar(rec)}
                                        className="p-1.5 bg-blue-500/10 border border-blue-500/20 text-blue-400 hover:bg-blue-500/20 rounded transition-colors"
                                        title="View Descriptive Ledger Entry"
                                      >
                                        <Eye className="w-3.5 h-3.5" />
                                      </button>
                                      {hasDues && (
                                        <button
                                          onClick={() => handleRecordPayment(rec.id)}
                                          className="p-1.5 bg-green-500/10 border border-green-500/20 text-green-400 hover:bg-green-500/20 rounded transition-colors"
                                          title="Record credit payment"
                                        >
                                          <DollarSign className="w-3.5 h-3.5" />
                                        </button>
                                      )}
                                      <button
                                        onClick={() => handleDeleteUdhaar(rec.id)}
                                        className="p-1.5 bg-red-500/10 border border-red-500/20 text-red-400 hover:bg-red-500/20 rounded transition-colors"
                                        title="Delete entry"
                                      >
                                        <Trash2 className="w-3.5 h-3.5" />
                                      </button>
                                    </div>
                                  </td>
                                </tr>
                              );
                            })}
                          {udhaarRecords.filter((rec) => {
                            const query = udhaarSearchQuery.toLowerCase();
                            const matchesName = rec.name.toLowerCase().includes(query);
                            const matchesSonOf = rec.sonOf.toLowerCase().includes(query);
                            const matchesPhone = rec.phone.toLowerCase().includes(query);
                            const matchesVillage = rec.village.toLowerCase().includes(query);
                            const matchesDate = rec.date.toLowerCase().includes(query);
                            const matchesOrnament = rec.ornament.toLowerCase().includes(query) || 
                              (rec.ornaments && rec.ornaments.some(o => o.name.toLowerCase().includes(query)));
                            
                            return matchesName || matchesSonOf || matchesPhone || matchesVillage || matchesDate || matchesOrnament;
                          }).length === 0 && (
                            <tr>
                              <td colSpan={6} className="py-12 px-4 text-center text-neutral-500">
                                No ledger records found matching your search.
                              </td>
                            </tr>
                          )}
                        </tbody>
                      </table>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
          {/* Detailed Udhaar Record View Modal */}
          {selectedUdhaar && (
            <div className="fixed inset-0 bg-black/85 backdrop-blur-md flex items-center justify-center p-4 z-50 animate-fade-in font-sans">
              <div className="bg-neutral-900 border border-amber-500/30 rounded-lg max-w-lg w-full overflow-hidden shadow-2xl flex flex-col max-h-[90vh]">
                {/* Modal Header */}
                <div className="bg-neutral-950 px-6 py-4 border-b border-neutral-800 flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <BookOpen className="w-5 h-5 text-amber-500" />
                    <h3 className="text-white text-sm font-serif font-semibold tracking-wide">
                      Detailed Customer Ledger Entry
                    </h3>
                  </div>
                  <button
                    onClick={() => setSelectedUdhaar(null)}
                    className="text-neutral-400 hover:text-white transition-colors text-xs font-mono uppercase tracking-wider bg-neutral-900 px-2.5 py-1 border border-neutral-800 rounded hover:border-neutral-700 cursor-pointer"
                  >
                    Close
                  </button>
                </div>

                {/* Modal Content Scrollable Area */}
                <div className="p-6 overflow-y-auto space-y-5 text-xs text-neutral-300">
                  {/* Customer Details Grid */}
                  <div className="grid grid-cols-2 gap-4 bg-neutral-950/60 p-4 rounded border border-neutral-800/40">
                    <div>
                      <span className="text-[9px] uppercase tracking-wider text-neutral-500 font-bold block mb-0.5">
                        Customer Name
                      </span>
                      <span className="text-white text-sm font-bold block">{selectedUdhaar.name}</span>
                    </div>
                    <div>
                      <span className="text-[9px] uppercase tracking-wider text-neutral-500 font-bold block mb-0.5">
                        Parentage (S/O or Husband)
                      </span>
                      <span className="text-neutral-200 font-medium block">{selectedUdhaar.sonOf || "N/A"}</span>
                    </div>
                    <div>
                      <span className="text-[9px] uppercase tracking-wider text-neutral-500 font-bold block mb-0.5">
                        Phone Number
                      </span>
                      <span className="text-neutral-200 font-mono block">{selectedUdhaar.phone || "N/A"}</span>
                    </div>
                    <div>
                      <span className="text-[9px] uppercase tracking-wider text-neutral-500 font-bold block mb-0.5">
                        Village / Address
                      </span>
                      <span className="text-neutral-200 font-medium block">{selectedUdhaar.village}</span>
                    </div>
                  </div>

                  {/* Ornaments Bought Details */}
                  <div className="space-y-2">
                    <h4 className="text-[9px] uppercase tracking-widest text-[#dfba73] font-extrabold flex items-center gap-1.5">
                      <Package className="w-3.5 h-3.5" /> Items & Weights Listing
                    </h4>
                    <div className="border border-neutral-800 rounded overflow-hidden">
                      <table className="w-full text-left border-collapse text-[11px]">
                        <thead>
                          <tr className="bg-neutral-950 border-b border-neutral-800 text-neutral-400 font-bold text-[9px] uppercase tracking-wider">
                            <th className="py-2.5 px-3">Product Name</th>
                            <th className="py-2.5 px-3 text-right">Ornament Weight</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-neutral-800/50 bg-neutral-950/20">
                          {selectedUdhaar.ornaments && selectedUdhaar.ornaments.length > 0 ? (
                            selectedUdhaar.ornaments.map((item, i) => (
                              <tr key={i} className="hover:bg-white/2">
                                <td className="py-2 px-3 text-white font-medium">{item.name}</td>
                                <td className="py-2 px-3 text-right font-mono text-[#dfba73] font-bold">{item.weight}</td>
                              </tr>
                            ))
                          ) : (
                            <tr>
                              <td className="py-2 px-3 text-white font-medium">{selectedUdhaar.ornament}</td>
                              <td className="py-2 px-3 text-right font-mono text-[#dfba73] font-bold">{selectedUdhaar.weight}</td>
                            </tr>
                          )}
                        </tbody>
                      </table>
                    </div>
                  </div>

                  {/* Financial Sheet Grid */}
                  <div className="space-y-2">
                    <h4 className="text-[9px] uppercase tracking-widest text-[#dfba73] font-extrabold flex items-center gap-1.5">
                      <DollarSign className="w-3.5 h-3.5" /> Ledger Financial Sheet
                    </h4>
                    <div className="grid grid-cols-4 gap-2 bg-neutral-950/40 p-3.5 rounded border border-neutral-800/40 text-center font-mono">
                      <div className="border-r border-neutral-800/60 pr-1">
                        <span className="text-[8px] uppercase tracking-wider text-neutral-500 font-bold block mb-1">
                          Total Bill
                        </span>
                        <span className="text-white text-xs font-bold">₹{parseFloat(selectedUdhaar.amount || "0").toLocaleString()}</span>
                      </div>
                      <div className="border-r border-neutral-800/60 px-1">
                        <span className="text-[8px] uppercase tracking-wider text-neutral-500 font-bold block mb-1">
                          Discount
                        </span>
                        <span className="text-neutral-400 text-xs">₹{parseFloat(selectedUdhaar.discount || "0").toLocaleString()}</span>
                      </div>
                      <div className="border-r border-neutral-800/60 px-1">
                        <span className="text-[8px] uppercase tracking-wider text-neutral-500 font-bold block mb-1">
                          Gave (Paid)
                        </span>
                        <span className="text-neutral-400 text-xs">₹{parseFloat(selectedUdhaar.paid || "0").toLocaleString()}</span>
                      </div>
                      <div className="pl-1">
                        <span className="text-[8px] uppercase tracking-wider text-neutral-500 font-bold block mb-1">
                          Outstanding
                        </span>
                        <span className={`text-xs font-extrabold ${parseFloat(selectedUdhaar.dues || "0") > 0 ? "text-red-400" : "text-green-400"}`}>
                          ₹{parseFloat(selectedUdhaar.dues || "0").toLocaleString()}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Logs & Transaction Notes */}
                  <div className="space-y-2">
                    <h4 className="text-[9px] uppercase tracking-widest text-neutral-400 font-extrabold flex items-center gap-1.5">
                      <Calendar className="w-3.5 h-3.5" /> Entry Date & Internal Ledger Logs
                    </h4>
                    <div className="bg-neutral-950/60 p-4 rounded border border-neutral-800/40 space-y-2">
                      <div className="flex justify-between items-center text-[10px] text-neutral-500 border-b border-neutral-800 pb-1.5">
                        <span>Original Purchase Date:</span>
                        <span className="font-mono text-white">{selectedUdhaar.date}</span>
                      </div>
                      <div>
                        <span className="text-[8px] uppercase tracking-wider text-neutral-500 font-bold block mb-1">
                          Logs & Transaction Notes:
                        </span>
                        <p className="text-[11px] leading-relaxed text-neutral-300 whitespace-pre-line font-sans">
                          {selectedUdhaar.notes || "No notes logged for this credit entry."}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Modal Footer */}
                <div className="bg-neutral-950 px-6 py-3 border-t border-neutral-800 flex justify-end">
                  <button
                    onClick={() => setSelectedUdhaar(null)}
                    className="py-1.5 px-4 bg-amber-500 hover:bg-amber-600 text-neutral-950 font-sans text-[9px] font-bold tracking-widest uppercase transition-colors rounded-sm cursor-pointer"
                  >
                    Done
                  </button>
                </div>
              </div>
            </div>
          )}
        </main>
      </div>
    </div>
  );
}
