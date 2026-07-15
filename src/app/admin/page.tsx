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
  Lock,
  CheckSquare,
  Calculator,
  Sparkles,
  Download,
  Printer,
  ArrowUpDown,
  AlertTriangle
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

// Live Simple & Compound Interest Calculator for Girvi
function calculateGirviInterest(record: GirviRecord, customFrom?: string, customTo?: string) {
  const principal = parseFloat(record.amount || "0");
  const rate = parseFloat(record.interestRate || "0");
  
  if (isNaN(principal) || isNaN(rate)) {
    return { days: 0, months: 0, extraDays: 0, interest: 0, total: isNaN(principal) ? 0 : principal, baseInterest: 0, additionsInterest: 0, totalPrincipal: principal };
  }

  const fromDateStr = customFrom || record.date;
  const toDateStr = customTo || new Date().toISOString().split("T")[0];

  const pledgedDate = new Date(fromDateStr);
  const targetDate = new Date(toDateStr);
  
  if (isNaN(pledgedDate.getTime()) || isNaN(targetDate.getTime())) {
    return { days: 0, months: 0, extraDays: 0, interest: 0, total: principal, baseInterest: 0, additionsInterest: 0, totalPrincipal: principal };
  }
  
  const timeDiff = targetDate.getTime() - pledgedDate.getTime();
  const daysElapsed = Math.max(0, Math.floor(timeDiff / (1000 * 3600 * 24)));
  
  const monthsElapsed = daysElapsed / 30.4368;
  const yearsElapsed = daysElapsed / 365.2425;

  let baseInterest = 0;
  
  if (record.interestType === "simple") {
    if (record.interestPeriod === "monthly") {
      baseInterest = principal * (rate / 100) * monthsElapsed;
    } else {
      baseInterest = principal * (rate / 100) * yearsElapsed;
    }
  } else {
    if (record.interestPeriod === "monthly") {
      baseInterest = principal * (Math.pow(1 + rate / 100, monthsElapsed) - 1);
    } else {
      baseInterest = principal * (Math.pow(1 + rate / 100, yearsElapsed) - 1);
    }
  }

  // Calculate interest on additions
  let additionsInterest = 0;
  let additionsTotalPrincipal = 0;

  if (record.amountAdditions && record.amountAdditions.length > 0) {
    record.amountAdditions.forEach(add => {
      const addAmt = parseFloat(add.amount || "0");
      if (isNaN(addAmt) || addAmt <= 0) return;
      additionsTotalPrincipal += addAmt;

      const addDate = new Date(add.date);
      if (isNaN(addDate.getTime())) return;

      const addTimeDiff = targetDate.getTime() - addDate.getTime();
      const addDaysElapsed = Math.max(0, Math.floor(addTimeDiff / (1000 * 3600 * 24)));
      const addMonthsElapsed = addDaysElapsed / 30.4368;
      const addYearsElapsed = addDaysElapsed / 365.2425;

      let addInterest = 0;
      if (record.interestType === "simple") {
        if (record.interestPeriod === "monthly") {
          addInterest = addAmt * (rate / 100) * addMonthsElapsed;
        } else {
          addInterest = addAmt * (rate / 100) * addYearsElapsed;
        }
      } else {
        if (record.interestPeriod === "monthly") {
          addInterest = addAmt * (Math.pow(1 + rate / 100, addMonthsElapsed) - 1);
        } else {
          addInterest = addAmt * (Math.pow(1 + rate / 100, addYearsElapsed) - 1);
        }
      }
      additionsInterest += addInterest;
    });
  }

  const totalInterest = baseInterest + additionsInterest;
  const totalPrincipal = principal + additionsTotalPrincipal;

  return {
    days: daysElapsed,
    months: Math.floor(monthsElapsed),
    extraDays: Math.floor(daysElapsed % 30.4368),
    interest: isNaN(totalInterest) ? 0 : Math.round(totalInterest),
    total: isNaN(totalInterest) ? totalPrincipal : Math.round(totalPrincipal + totalInterest),
    baseInterest: Math.round(baseInterest),
    additionsInterest: Math.round(additionsInterest),
    totalPrincipal: totalPrincipal
  };
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
  discount?: string;
  paid?: string;
  dues: string;
  date: string;
  notes?: string;
  aadhaar?: string;
  familyGroupId?: string;
  familyRelationship?: string;
}

interface GirviRecord {
  id: string;
  name: string;
  sonOf: string;
  phone: string;
  village: string;
  ornaments: { name: string; weight: string }[];
  amount: string;       // Loan Given
  interestRate: string; // Interest Rate (%)
  interestPeriod: "monthly" | "yearly";
  interestType: "simple" | "compound";
  date: string;         // Pledged Date
  status: "active" | "released";
  releasedDate?: string;
  notes?: string;
  aadhaar?: string;
  familyGroupId?: string;
  familyRelationship?: string;
  amountAdditions?: { id: string; amount: string; date: string; }[];
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
  const [globalSearchQuery, setGlobalSearchQuery] = useState("");
  const [selectedCustomerProfile, setSelectedCustomerProfile] = useState<string | null>(null);
  const [newEntryItems, setNewEntryItems] = useState<{ ornament: string; weight: string }[]>([{ ornament: "", weight: "" }]);
  const [newEntryAmount, setNewEntryAmount] = useState("");
  const [newEntryDiscount, setNewEntryDiscount] = useState("");
  const [newEntryPaid, setNewEntryPaid] = useState("");
  const [selectedUdhaar, setSelectedUdhaar] = useState<UdhaarRecord | null>(null);

  // Girvi state
  const [girviRecords, setGirviRecords] = useState<GirviRecord[]>([]);
  const [girviSearchQuery, setGirviSearchQuery] = useState("");
  const [girviHistorySearchQuery, setGirviHistorySearchQuery] = useState("");
  const [newGirviItems, setNewGirviItems] = useState<{ ornament: string; weight: string }[]>([{ ornament: "", weight: "" }]);
  const [selectedGirvi, setSelectedGirvi] = useState<GirviRecord | null>(null);
  const [calcFromDate, setCalcFromDate] = useState("");
  const [calcToDate, setCalcToDate] = useState("");

  // Principal additions & edit states
  const [selectedGirviForEdit, setSelectedGirviForEdit] = useState<GirviRecord | null>(null);
  const [isSaving, setIsSaving] = useState(false);
  const [editOrnaments, setEditOrnaments] = useState<{ name: string; weight: string }[]>([]);
  const [editAdditions, setEditAdditions] = useState<{ id: string; amount: string; date: string; }[]>([]);
  const [newAddAmount, setNewAddAmount] = useState("");
  const [newAddDate, setNewAddDate] = useState("");

  // Stand-alone Groww-Style Calculator states
  const [calcPrincipal, setCalcPrincipal] = useState("100000");
  const [calcRate, setCalcRate] = useState("2");
  const [calcPeriod, setCalcPeriod] = useState<"monthly" | "yearly">("monthly");
  const [calcType, setCalcType] = useState<"simple" | "compound">("simple");
  const [calcFrom, setCalcFrom] = useState(new Date().toISOString().split("T")[0]);
  const [calcTo, setCalcTo] = useState(new Date().toISOString().split("T")[0]);

  // Toast Notification state
  const [toast, setToast] = useState<{ message: string; type: "success" | "error" } | null>(null);
  const showToast = (message: string, type: "success" | "error" = "success") => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 4000);
  };

  // Baseline market rate settings inputs
  const [rate24kInput, setRate24kInput] = useState("7650");
  const [rate22kInput, setRate22kInput] = useState("7015");
  const [rate18kInput, setRate18kInput] = useState("5740");
  const [rateSilverInput, setRateSilverInput] = useState("92");
  const [activeTab, setActiveTab] = useState<"inquiries" | "products" | "logs" | "settings" | "udhaar" | "girvi" | "calculator">("inquiries");

  // New product creation form states
  const [newProdId, setNewProdId] = useState("");
  const [newProdName, setNewProdName] = useState("");
  const [newProdCategory, setNewProdCategory] = useState("new-arrivals");
  const [newProdSubCategory, setNewProdSubCategory] = useState("Rings");
  const [newProdPrice, setNewProdPrice] = useState("");
  const [newProdMaterials, setNewProdMaterials] = useState("");
  const [newProdDesc, setNewProdDesc] = useState("");
  const [newProdDetails, setNewProdDetails] = useState("");
  const [newProdImage, setNewProdImage] = useState("");
  const [isFormOpen, setIsFormOpen] = useState(false);

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

  useEffect(() => {
    if (selectedGirvi) {
      setCalcFromDate(selectedGirvi.date);
      setCalcToDate(new Date().toISOString().split("T")[0]);
    }
  }, [selectedGirvi]);

  // Compiled statistics
  const getDashboardStats = () => {
    // 1. Total Customers (unique names across both datasets)
    const udhaarNames = udhaarRecords.map(r => (r.name || "").trim().toLowerCase());
    const girviNames = girviRecords.map(r => (r.name || "").trim().toLowerCase());
    const uniqueNamesSet = new Set([...udhaarNames, ...girviNames].filter(Boolean));
    const totalCustomers = uniqueNamesSet.size;

    // 2. Active Girvi count
    const activeGirviRecords = girviRecords.filter(r => r.status === "active");
    const activeGirviCount = activeGirviRecords.length;

    // 3. Active Udhaari count
    const activeUdhaarRecords = udhaarRecords.filter(r => parseFloat(r.dues || "0") > 0);
    const activeUdhaariCount = activeUdhaarRecords.length;

    // 4. Today's Transactions
    const todayStr = new Date().toISOString().split("T")[0];
    const udhaarToday = udhaarRecords.filter(r => r.date === todayStr).length;
    const girviToday = girviRecords.filter(r => r.date === todayStr || (r.status === "released" && r.releasedDate === todayStr)).length;
    const todayTransactions = udhaarToday + girviToday;

    // 5. Total Pending Amount (Dues in Udhaar + Active Girvi Loans + Active Girvi Interest)
    const pendingUdhaar = udhaarRecords.reduce((sum, r) => sum + (parseFloat(r.dues || "0") || 0), 0);
    const pendingGirviLoans = activeGirviRecords.reduce((sum, r) => sum + (parseFloat(r.amount || "0") || 0), 0);
    const pendingGirviInterest = activeGirviRecords.reduce((sum, r) => {
      const calc = calculateGirviInterest(r);
      return sum + (calc.interest || 0);
    }, 0);
    const totalPendingAmount = pendingUdhaar + pendingGirviLoans + pendingGirviInterest;

    // 6. Total Collection (Paid in Udhaar + Released Girvi values)
    const collectionUdhaar = udhaarRecords.reduce((sum, r) => sum + (parseFloat(r.paid || "0") || 0), 0);
    const releasedGirviRecords = girviRecords.filter(r => r.status === "released");
    const collectionGirvi = releasedGirviRecords.reduce((sum, r) => {
      const calc = calculateGirviInterest(r, undefined, r.releasedDate);
      return sum + (calc.total || 0);
    }, 0);
    const totalCollection = collectionUdhaar + collectionGirvi;

    // 7. Parse weights helper to parse things like "10.2g", "5.8 g", "120g"
    const parseWeight = (weightStr: string): number => {
      if (!weightStr) return 0;
      const clean = weightStr.replace(/[^0-9.]/g, "");
      return parseFloat(clean) || 0;
    };

    // 8. Total Gold Weight / Total Silver Weight
    let totalGoldWeight = 0;
    let totalSilverWeight = 0;

    // Sum from Udhaar
    udhaarRecords.forEach(r => {
      if (r.ornaments) {
        r.ornaments.forEach(o => {
          const w = parseWeight(o.weight);
          const nameLower = (o.name || "").toLowerCase();
          if (nameLower.includes("silver") || nameLower.includes("chandi") || nameLower.includes("payal")) {
            totalSilverWeight += w;
          } else {
            totalGoldWeight += w;
          }
        });
      }
    });

    // Sum from Girvi
    girviRecords.forEach(r => {
      if (r.ornaments) {
        r.ornaments.forEach(o => {
          const w = parseWeight(o.weight);
          const nameLower = (o.name || "").toLowerCase();
          if (nameLower.includes("silver") || nameLower.includes("chandi") || nameLower.includes("payal")) {
            totalSilverWeight += w;
          } else {
            totalGoldWeight += w;
          }
        });
      }
    });

    return {
      totalCustomers,
      activeGirviCount,
      activeUdhaariCount,
      todayTransactions,
      totalPendingAmount,
      totalCollection,
      totalGoldWeight: totalGoldWeight.toFixed(2),
      totalSilverWeight: totalSilverWeight.toFixed(2)
    };
  };

  const stats = getDashboardStats();

  const calculateStandaloneInterest = () => {
    const principal = parseFloat(calcPrincipal || "0");
    const rate = parseFloat(calcRate || "0");
    
    if (isNaN(principal) || isNaN(rate) || principal <= 0) {
      return { days: 0, months: 0, years: 0, interest: 0, total: principal, yearsPart: 0, monthsPart: 0, daysPart: 0 };
    }

    const fromDate = new Date(calcFrom);
    const toDate = new Date(calcTo);

    if (isNaN(fromDate.getTime()) || isNaN(toDate.getTime())) {
      return { days: 0, months: 0, years: 0, interest: 0, total: principal, yearsPart: 0, monthsPart: 0, daysPart: 0 };
    }

    const timeDiff = toDate.getTime() - fromDate.getTime();
    const daysElapsed = Math.max(0, Math.floor(timeDiff / (1000 * 3600 * 24)));
    
    const monthsElapsed = daysElapsed / 30.4368;
    const yearsElapsed = daysElapsed / 365.2425;

    let yearsPart = Math.floor(yearsElapsed);
    let remDays = daysElapsed - (yearsPart * 365.2425);
    let monthsPart = Math.floor(remDays / 30.4368);
    let daysPart = Math.round(remDays % 30.4368);

    let interest = 0;
    if (calcType === "simple") {
      if (calcPeriod === "monthly") {
        interest = principal * (rate / 100) * monthsElapsed;
      } else {
        interest = principal * (rate / 100) * yearsElapsed;
      }
    } else {
      if (calcPeriod === "monthly") {
        interest = principal * (Math.pow(1 + rate / 100, monthsElapsed) - 1);
      } else {
        interest = principal * (Math.pow(1 + rate / 100, yearsElapsed) - 1);
      }
    }

    return {
      days: daysElapsed,
      months: Math.floor(monthsElapsed),
      years: Math.floor(yearsElapsed),
      interest: isNaN(interest) ? 0 : Math.round(interest),
      total: isNaN(interest) ? principal : Math.round(principal + interest),
      yearsPart,
      monthsPart,
      daysPart
    };
  };

  const getUniqueCustomers = () => {
    const customersMap: Record<string, {
      name: string;
      sonOf: string;
      phone: string;
      village: string;
      aadhaar: string;
      familyGroupId: string;
      familyRelationship: string;
    }> = {};

    udhaarRecords.forEach(r => {
      const key = `${(r.name || "").trim().toLowerCase()}_${(r.phone || "").trim()}`;
      if (!customersMap[key]) {
        customersMap[key] = {
          name: r.name,
          sonOf: r.sonOf || "",
          phone: r.phone || "",
          village: r.village || "",
          aadhaar: r.aadhaar || "",
          familyGroupId: r.familyGroupId || "",
          familyRelationship: r.familyRelationship || ""
        };
      } else {
        if (!customersMap[key].aadhaar && r.aadhaar) customersMap[key].aadhaar = r.aadhaar;
        if (!customersMap[key].familyGroupId && r.familyGroupId) {
          customersMap[key].familyGroupId = r.familyGroupId;
          customersMap[key].familyRelationship = r.familyRelationship || "";
        }
      }
    });

    girviRecords.forEach(r => {
      const key = `${(r.name || "").trim().toLowerCase()}_${(r.phone || "").trim()}`;
      if (!customersMap[key]) {
        customersMap[key] = {
          name: r.name,
          sonOf: r.sonOf || "",
          phone: r.phone || "",
          village: r.village || "",
          aadhaar: r.aadhaar || "",
          familyGroupId: r.familyGroupId || "",
          familyRelationship: r.familyRelationship || ""
        };
      } else {
        if (!customersMap[key].aadhaar && r.aadhaar) customersMap[key].aadhaar = r.aadhaar;
        if (!customersMap[key].familyGroupId && r.familyGroupId) {
          customersMap[key].familyGroupId = r.familyGroupId;
          customersMap[key].familyRelationship = r.familyRelationship || "";
        }
      }
    });

    return Object.values(customersMap);
  };

  const getFilteredCustomers = () => {
    if (!globalSearchQuery.trim()) return [];
    const q = globalSearchQuery.toLowerCase().trim();
    const directory = getUniqueCustomers();

    return directory.filter(c => {
      const matchesName = (c.name || "").toLowerCase().includes(q);
      const matchesPhone = (c.phone || "").includes(q);
      const matchesAadhaar = (c.aadhaar || "").includes(q);
      
      const hasMatchingUdhaar = udhaarRecords.some(u => 
        (u.name || "").toLowerCase() === c.name.toLowerCase() && 
        u.id.includes(q)
      );
      const hasMatchingGirvi = girviRecords.some(g => 
        (g.name || "").toLowerCase() === c.name.toLowerCase() && 
        g.id.includes(q)
      );

      return matchesName || matchesPhone || matchesAadhaar || hasMatchingUdhaar || hasMatchingGirvi;
    });
  };

  const loadDashboardData = async () => {
    try {
      // 1. Fetch contact form inquiries from localStorage
      const savedInquiries = localStorage.getItem("oj_form_submissions");
      if (savedInquiries) {
        try {
          setInquiries(JSON.parse(savedInquiries));
        } catch (e) {
          setInquiries([]);
        }
      }

      // 2. Load from database APIs with legacy localStorage auto-sync
      const localUdhaarStr = localStorage.getItem("oj_udhaar_records");
      const localGirviStr = localStorage.getItem("oj_girvi_records");

      // Auto-sync Udhaar if present
      if (localUdhaarStr) {
        try {
          const localUdhaar = JSON.parse(localUdhaarStr);
          if (Array.isArray(localUdhaar) && localUdhaar.length > 0) {
            await fetch("/api/udhaar", {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify(localUdhaar)
            });
            // Clear local storage after successful sync
            localStorage.removeItem("oj_udhaar_records");
          }
        } catch (e) {
          console.error("Udhaar auto-sync failed:", e);
        }
      }

      // Auto-sync Girvi if present
      if (localGirviStr) {
        try {
          const localGirvi = JSON.parse(localGirviStr);
          if (Array.isArray(localGirvi) && localGirvi.length > 0) {
            await fetch("/api/girvi", {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify(localGirvi)
            });
            // Clear local storage after successful sync
            localStorage.removeItem("oj_girvi_records");
          }
        } catch (e) {
          console.error("Girvi auto-sync failed:", e);
        }
      }

      // Fetch fresh data from DB
      const udhaarRes = await fetch("/api/udhaar");
      const udhaarData = await udhaarRes.json();
      if (udhaarData.success) {
        setUdhaarRecords(udhaarData.records);
      }

      const girviRes = await fetch("/api/girvi");
      const girviData = await girviRes.json();
      if (girviData.success) {
        setGirviRecords(girviData.records);
      }
    } catch (err: any) {
      console.error("loadDashboardData failed:", err);
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

  // Update a product's price/name/category/description/materials/details from dashboard
  const handleUpdateProduct = async (id: string, name: string, priceStr: string, subCategory: string, description: string, materials: string, detailsStr: string) => {
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
          details: detailsStr ? detailsStr.split(",").map((d) => d.trim()).join(" | ") : "",
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

  // Add a new product to the database
  const handleCreateProduct = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newProdId || !newProdName || !newProdPrice) {
      alert("Please fill in Product ID, Name, and Price.");
      return;
    }

    try {
      const cleanPrice = newProdPrice.replace(/[^0-9.]/g, "");
      const res = await fetch("/api/products", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          id: newProdId,
          name: newProdName,
          category: newProdCategory,
          subCategory: newProdSubCategory,
          price: parseFloat(cleanPrice) || 0,
          materials: newProdMaterials,
          description: newProdDesc,
          details: newProdDetails ? newProdDetails.split(",").map((d) => d.trim()) : [],
          image: newProdImage || undefined,
        }),
      });

      const data = await res.json();
      if (data.success) {
        alert("New product card successfully added to database!");
        setNewProdId("");
        setNewProdName("");
        setNewProdPrice("");
        setNewProdMaterials("");
        setNewProdDesc("");
        setNewProdDetails("");
        setNewProdImage("");
        setIsFormOpen(false);
        loadDashboardData();
      } else {
        alert("Failed to add product: " + data.error);
      }
    } catch (err: any) {
      alert("Error adding product: " + err.message);
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
  const handleAddUdhaar = async (e: React.FormEvent) => {
    e.preventDefault();
    console.log("✏️ handleAddUdhaar triggered. Check isSaving state:", isSaving);
    if (isSaving) return;
    setIsSaving(true);

    try {
      const nameInput = (document.getElementById("ud_name") as HTMLInputElement)?.value || "";
      const sonOfInput = (document.getElementById("ud_sonOf") as HTMLInputElement)?.value || "";
      const phoneInput = (document.getElementById("ud_phone") as HTMLInputElement)?.value || "";
      const villageInput = (document.getElementById("ud_village") as HTMLInputElement)?.value || "";
      const amountInput = (document.getElementById("ud_amount") as HTMLInputElement)?.value || "0";
      const discountInput = (document.getElementById("ud_discount") as HTMLInputElement)?.value || "0";
      const paidInput = (document.getElementById("ud_paid") as HTMLInputElement)?.value || "0";
      const duesInput = (document.getElementById("ud_dues") as HTMLInputElement)?.value || "0";
      const notesInput = (document.getElementById("ud_notes") as HTMLTextAreaElement)?.value || "";
      const aadhaarInput = (document.getElementById("ud_aadhaar") as HTMLInputElement)?.value || "";
      const familyLinkVal = (document.getElementById("ud_family_link") as HTMLSelectElement)?.value || "";
      const relationshipInput = (document.getElementById("ud_relationship") as HTMLSelectElement)?.value || "";

      console.log("📋 Raw Form Input values:", {
        nameInput,
        sonOfInput,
        phoneInput,
        villageInput,
        amountInput,
        discountInput,
        paidInput,
        duesInput,
        notesInput,
        aadhaarInput,
        familyLinkVal,
        relationshipInput
      });

      // Validate numeric inputs safely
      const amt = parseFloat(amountInput.trim() || "0") || 0;
      const disc = parseFloat(discountInput.trim() || "0") || 0;
      const paid = parseFloat(paidInput.trim() || "0") || 0;

      console.log("🔢 Parsed numeric financials:", { amt, disc, paid });

      if (isNaN(amt) || amt < 0 || isNaN(disc) || disc < 0 || isNaN(paid) || paid < 0) {
        console.warn("⚠️ Numeric validation failed. Negative values or NaN detected.");
        showToast("❌ Dues and amount inputs must be valid positive numbers!", "error");
        setIsSaving(false);
        return;
      }

      if (aadhaarInput && !/^\d{12}$/.test(aadhaarInput)) {
        console.warn("⚠️ Aadhaar validation failed. Aadhaar is not 12 digits:", aadhaarInput);
        showToast("❌ Aadhaar Number must be exactly 12 digits!", "error");
        setIsSaving(false);
        return;
      }

      const activeOrnaments = newEntryItems.filter(item => item.ornament.trim() !== "");
      console.log("💎 Active ornaments identified:", activeOrnaments);

      if (activeOrnaments.length === 0) {
        console.warn("⚠️ Ornaments validation failed. Empty list.");
        showToast("❌ Please add at least one product and weight in the form!", "error");
        setIsSaving(false);
        return;
      }

      // Family link resolution
      let resolvedFamilyGroupId = "";
      if (familyLinkVal) {
        console.log("🔗 Resolving family link grouping for key ID:", familyLinkVal);
        const linkedGirvi = girviRecords.find(r => r.id === familyLinkVal);
        const linkedUdhaar = udhaarRecords.find(r => r.id === familyLinkVal);
        const linkedRecord = linkedGirvi || linkedUdhaar;
        if (linkedRecord) {
          if (linkedRecord.familyGroupId) {
            resolvedFamilyGroupId = linkedRecord.familyGroupId;
            console.log("🔗 Inherited existing familyGroupId:", resolvedFamilyGroupId);
          } else {
            resolvedFamilyGroupId = "fam_" + Date.now();
            console.log("🔗 Created new familyGroupId:", resolvedFamilyGroupId);
            linkedRecord.familyGroupId = resolvedFamilyGroupId;
            linkedRecord.familyRelationship = "Self";

            if (linkedGirvi) {
              const updatedL = { ...linkedGirvi, familyGroupId: resolvedFamilyGroupId, familyRelationship: "Self" };
              await fetch(`/api/girvi?id=${familyLinkVal}`, {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(updatedL)
              });
            } else if (linkedUdhaar) {
              const updatedL = { ...linkedUdhaar, familyGroupId: resolvedFamilyGroupId, familyRelationship: "Self" };
              await fetch(`/api/udhaar?id=${familyLinkVal}`, {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(updatedL)
              });
            }
          }
        }
      }

      const newRecord: UdhaarRecord = {
        id: Date.now().toString(),
        name: nameInput,
        sonOf: sonOfInput,
        phone: phoneInput,
        village: villageInput,
        ornament: activeOrnaments[0].ornament,
        weight: activeOrnaments[0].weight,
        ornaments: activeOrnaments.map(item => ({
          name: item.ornament,
          weight: item.weight
        })),
        amount: amountInput,
        discount: discountInput,
        paid: paidInput,
        dues: duesInput,
        date: new Date().toISOString().split("T")[0],
        notes: notesInput,
        aadhaar: aadhaarInput || undefined,
        familyGroupId: resolvedFamilyGroupId || undefined,
        familyRelationship: resolvedFamilyGroupId ? relationshipInput : undefined
      };

      console.log("🚀 Dispatching POST request to /api/udhaar with payload:", newRecord);

      const res = await fetch("/api/udhaar", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newRecord)
      });
      const data = await res.json();
      console.log("📡 API endpoint responded:", data);

      if (data.success) {
        console.log("✅ Udhaar record saved successfully. refreshing dashboard records.");
        loadDashboardData();
        showToast("Udhaari added successfully.", "success");
        // Reset form & state
        (document.getElementById("ud_form") as HTMLFormElement)?.reset();
        setNewEntryItems([{ ornament: "", weight: "" }]);
        setNewEntryAmount("");
        setNewEntryDiscount("");
        setNewEntryPaid("");
      } else {
        console.error("❌ Backend validation/prisma insertion failed:", data.error);
        showToast("❌ Failed to save Udhaar record: " + data.error, "error");
      }
    } catch (err: any) {
      console.error("❌ Exception caught inside handleAddUdhaar:", err);
      showToast("❌ Failed to save Udhaar record: " + err.message, "error");
    } finally {
      setIsSaving(false);
      console.log("🔓 isSaving state reset to false.");
    }
  };

  const handleDeleteUdhaar = async (id: string) => {
    if (window.confirm("Are you sure you want to permanently delete this Udhaar record from database?")) {
      try {
        const res = await fetch(`/api/udhaar?id=${id}`, {
          method: "DELETE"
        });
        const data = await res.json();
        if (data.success) {
          loadDashboardData();
          showToast("🗑️ Udhaar record deleted successfully!");
        } else {
          showToast("❌ Failed to delete record: " + data.error, "error");
        }
      } catch (err: any) {
        showToast("❌ Error deleting record: " + err.message, "error");
      }
    }
  };

  const handleRecordPayment = async (id: string) => {
    const payAmount = window.prompt("Enter payment amount received (in ₹):");
    if (payAmount === null) return;
    const amt = parseFloat(payAmount);
    if (isNaN(amt) || amt <= 0) {
      showToast("❌ Invalid payment amount entered.", "error");
      return;
    }

    const r = udhaarRecords.find(item => item.id === id);
    if (!r) return;

    const currentDues = parseFloat(r.dues || "0");
    const currentPaid = parseFloat(r.paid || "0");
    const newDues = Math.max(0, currentDues - amt);
    const newPaid = currentPaid + amt;

    const updatedRecord = {
      ...r,
      dues: newDues.toString(),
      paid: newPaid.toString(),
      notes: newDues === 0 ? "Fully Paid" : `${r.notes || ""}. Received payment ₹${amt} on ${new Date().toISOString().split("T")[0]}`
    };

    try {
      const res = await fetch(`/api/udhaar?id=${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(updatedRecord)
      });
      const data = await res.json();
      if (data.success) {
        loadDashboardData();
        showToast("💸 Payment recorded successfully in database!");
      } else {
        showToast("❌ Failed to record payment: " + data.error, "error");
      }
    } catch (err: any) {
      showToast("❌ Error recording payment: " + err.message, "error");
    }
  };

  // Girvi Handlers
  const handleAddGirvi = async (e: React.FormEvent) => {
    e.preventDefault();
    console.log("✏️ handleAddGirvi triggered. Check isSaving state:", isSaving);
    if (isSaving) return;
    setIsSaving(true);

    try {
      const nameVal = (document.getElementById("girvi_name") as HTMLInputElement)?.value || "";
      const sonOfVal = (document.getElementById("girvi_sonOf") as HTMLInputElement)?.value || "";
      const phoneVal = (document.getElementById("girvi_phone") as HTMLInputElement)?.value || "";
      const villageVal = (document.getElementById("girvi_village") as HTMLInputElement)?.value || "";
      const amountVal = (document.getElementById("girvi_amount") as HTMLInputElement)?.value || "0";
      const rateVal = (document.getElementById("girvi_rate") as HTMLInputElement)?.value || "0";
      const periodVal = (document.getElementById("girvi_period") as HTMLSelectElement)?.value as "monthly" | "yearly";
      const typeVal = (document.getElementById("girvi_type") as HTMLSelectElement)?.value as "simple" | "compound";
      const dateVal = (document.getElementById("girvi_date") as HTMLInputElement)?.value || new Date().toISOString().split("T")[0];
      const notesVal = (document.getElementById("girvi_notes") as HTMLTextAreaElement)?.value || "";
      const aadhaarVal = (document.getElementById("girvi_aadhaar") as HTMLInputElement)?.value || "";
      const familyLinkVal = (document.getElementById("girvi_family_link") as HTMLSelectElement)?.value || "";
      const relationshipVal = (document.getElementById("girvi_relationship") as HTMLSelectElement)?.value || "";

      console.log("📋 Raw Girvi Form Input values:", {
        nameVal,
        sonOfVal,
        phoneVal,
        villageVal,
        amountVal,
        rateVal,
        periodVal,
        typeVal,
        dateVal,
        notesVal,
        aadhaarVal,
        familyLinkVal,
        relationshipVal
      });

      // Validate numeric inputs safely
      const amt = parseFloat(amountVal.trim() || "0") || 0;
      const rate = parseFloat(rateVal.trim() || "0") || 0;

      console.log("🔢 Parsed numeric financials:", { amt, rate });

      if (isNaN(amt) || amt < 0 || isNaN(rate) || rate < 0) {
        console.warn("⚠️ Numeric validation failed. Negative values or NaN detected.");
        showToast("❌ Principal amount and interest rate must be positive numbers!", "error");
        setIsSaving(false);
        return;
      }

      if (aadhaarVal && !/^\d{12}$/.test(aadhaarVal)) {
        console.warn("⚠️ Aadhaar validation failed. Aadhaar is not 12 digits:", aadhaarVal);
        showToast("❌ Aadhaar Number must be exactly 12 digits!", "error");
        setIsSaving(false);
        return;
      }

      const activeOrnaments = newGirviItems.filter(item => item.ornament.trim() !== "");
      console.log("💎 Active ornaments identified:", activeOrnaments);

      if (activeOrnaments.length === 0) {
        console.warn("⚠️ Ornaments validation failed. Empty list.");
        showToast("❌ Please add at least one ornament with weight!", "error");
        setIsSaving(false);
        return;
      }

      // Family link resolution
      let resolvedFamilyGroupId = "";
      if (familyLinkVal) {
        console.log("🔗 Resolving family link grouping for key ID:", familyLinkVal);
        const linkedGirvi = girviRecords.find(r => r.id === familyLinkVal);
        const linkedUdhaar = udhaarRecords.find(r => r.id === familyLinkVal);
        const linkedRecord = linkedGirvi || linkedUdhaar;
        if (linkedRecord) {
          if (linkedRecord.familyGroupId) {
            resolvedFamilyGroupId = linkedRecord.familyGroupId;
            console.log("🔗 Inherited existing familyGroupId:", resolvedFamilyGroupId);
          } else {
            resolvedFamilyGroupId = "fam_" + Date.now();
            console.log("🔗 Created new familyGroupId:", resolvedFamilyGroupId);
            linkedRecord.familyGroupId = resolvedFamilyGroupId;
            linkedRecord.familyRelationship = "Self";

            if (linkedGirvi) {
              const updatedL = { ...linkedGirvi, familyGroupId: resolvedFamilyGroupId, familyRelationship: "Self" };
              await fetch(`/api/girvi?id=${familyLinkVal}`, {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(updatedL)
              });
            } else if (linkedUdhaar) {
              const updatedL = { ...linkedUdhaar, familyGroupId: resolvedFamilyGroupId, familyRelationship: "Self" };
              await fetch(`/api/udhaar?id=${familyLinkVal}`, {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(updatedL)
              });
            }
          }
        }
      }

      const newRecord: GirviRecord = {
        id: Date.now().toString(),
        name: nameVal,
        sonOf: sonOfVal,
        phone: phoneVal,
        village: villageVal,
        ornaments: activeOrnaments.map(item => ({
          name: item.ornament,
          weight: item.weight
        })),
        amount: amountVal,
        interestRate: rateVal,
        interestPeriod: periodVal,
        interestType: typeVal,
        date: dateVal,
        status: "active",
        notes: notesVal,
        aadhaar: aadhaarVal || undefined,
        familyGroupId: resolvedFamilyGroupId || undefined,
        familyRelationship: resolvedFamilyGroupId ? relationshipVal : undefined,
        amountAdditions: []
      };

      console.log("🚀 Dispatching POST request to /api/girvi with payload:", newRecord);

      const res = await fetch("/api/girvi", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newRecord)
      });
      const data = await res.json();
      console.log("📡 API endpoint responded:", data);

      if (data.success) {
        console.log("✅ Girvi record saved successfully. refreshing dashboard records.");
        loadDashboardData();
        showToast("Girvi added successfully.", "success");
        // Reset Form
        (document.getElementById("girvi_form") as HTMLFormElement)?.reset();
        setNewGirviItems([{ ornament: "", weight: "" }]);
      } else {
        console.error("❌ Backend validation/prisma insertion failed:", data.error);
        showToast("❌ Failed to save Girvi record: " + data.error, "error");
      }
    } catch (err: any) {
      console.error("❌ Exception caught inside handleAddGirvi:", err);
      showToast("❌ Failed to save Girvi record: " + err.message, "error");
    } finally {
      setIsSaving(false);
      console.log("🔓 isSaving state reset to false.");
    }
  };

  const handleReleaseGirvi = async (id: string) => {
    if (window.confirm("Close this Girvi entry? This will move it to the History log archive.")) {
      const r = girviRecords.find(item => item.id === id);
      if (!r) return;

      const updatedRecord = {
        ...r,
        status: "released" as const,
        releasedDate: new Date().toISOString().split("T")[0],
        notes: `${r.notes || ""}. Released and cleared on ${new Date().toISOString().split("T")[0]}`
      };

      try {
        const res = await fetch(`/api/girvi?id=${id}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(updatedRecord)
        });
        const data = await res.json();
        if (data.success) {
          loadDashboardData();
          showToast("🔒 Girvi released and successfully archived in History!");
        } else {
          showToast("❌ Failed to release Girvi: " + data.error, "error");
        }
      } catch (err: any) {
        showToast("❌ Error releasing Girvi: " + err.message, "error");
      }
    }
  };

  const handleDeleteGirviHistory = async (id: string) => {
    if (window.confirm("Are you sure you want to permanently delete this record from History?")) {
      try {
        const res = await fetch(`/api/girvi?id=${id}`, {
          method: "DELETE"
        });
        const data = await res.json();
        if (data.success) {
          loadDashboardData();
          showToast("🗑️ Girvi record permanently deleted from database!");
        } else {
          showToast("❌ Failed to delete record: " + data.error, "error");
        }
      } catch (err: any) {
        showToast("❌ Error deleting record: " + err.message, "error");
      }
    }
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
                Owner Passcode
              </label>
              <input
                type="password"
                required
                value={passcode}
                onChange={(e) => setPasscode(e.target.value)}
                placeholder="••••••"
                autoComplete="new-password"
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
    <div className="min-h-screen bg-slate-50 text-neutral-800 font-sans flex flex-col">
      {/* Dashboard Header */}
      <header className="bg-white border-b border-slate-200 py-4 px-6 flex items-center justify-between shadow-sm">
        <div className="flex items-center gap-3">
          <span className="font-serif text-xl tracking-[0.2em] font-bold text-neutral-900">
            OMAR JEWELLERS <span className="text-amber-500">OJ</span>
          </span>
          <span className="text-[9px] tracking-widest text-amber-600 font-sans border border-amber-500/30 bg-amber-50 px-1.5 py-0.5 rounded uppercase font-bold">
            Backside Console
          </span>
        </div>
        <button
          onClick={handleLogout}
          className="flex items-center gap-2 bg-slate-50 hover:bg-red-50 border border-slate-200 hover:border-red-200 px-4 py-2 rounded-md font-sans text-xs font-bold uppercase tracking-wider text-neutral-600 hover:text-red-600 transition-all"
        >
          <LogOut className="w-3.5 h-3.5" />
          Logout
        </button>
      </header>

      <div className="flex-1 flex flex-col md:flex-row">
        {/* Sidebar Nav */}
        <aside className="w-full md:w-64 bg-white border-r border-slate-200 p-6 flex flex-col gap-8 shadow-sm">
          <div>
            <p className="text-[10px] uppercase tracking-widest text-neutral-500 font-bold mb-4">
              Management
            </p>
            <nav className="flex flex-col gap-2 font-sans text-xs font-bold tracking-widest uppercase">
              <button
                onClick={() => setActiveTab("inquiries")}
                className={`w-full py-3 px-4 rounded-md text-left transition-colors flex items-center gap-3 ${
                  activeTab === "inquiries"
                    ? "bg-amber-500 text-neutral-950 shadow-sm"
                    : "hover:bg-slate-100 text-neutral-600 hover:text-neutral-950"
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
                    ? "bg-amber-500 text-neutral-950 shadow-sm"
                    : "hover:bg-slate-100 text-neutral-600 hover:text-neutral-950"
                }`}
              >
                <Package className="w-4 h-4" />
                Product Manager
              </button>

              <button
                onClick={() => setActiveTab("logs")}
                className={`w-full py-3 px-4 rounded-md text-left transition-colors flex items-center gap-3 ${
                  activeTab === "logs"
                    ? "bg-amber-500 text-neutral-950 shadow-sm"
                    : "hover:bg-slate-100 text-neutral-600 hover:text-neutral-950"
                }`}
              >
                <TrendingUp className="w-4 h-4" />
                Visitor Activity Logs
              </button>

              <button
                onClick={() => setActiveTab("settings")}
                className={`w-full py-3 px-4 rounded-md text-left transition-colors flex items-center gap-3 ${
                  activeTab === "settings"
                    ? "bg-amber-500 text-neutral-950 shadow-sm"
                    : "hover:bg-slate-100 text-neutral-600 hover:text-neutral-950"
                }`}
              >
                <Settings className="w-4 h-4" />
                Owner Settings
              </button>

              <button
                onClick={() => setActiveTab("udhaar")}
                className={`w-full py-3 px-4 rounded-md text-left transition-colors flex items-center gap-3 ${
                  activeTab === "udhaar"
                    ? "bg-amber-500 text-neutral-950 shadow-sm"
                    : "hover:bg-slate-100 text-neutral-600 hover:text-neutral-950"
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

              <button
                onClick={() => setActiveTab("girvi")}
                className={`w-full py-3 px-4 rounded-md text-left transition-colors flex items-center gap-3 ${
                  activeTab === "girvi"
                    ? "bg-amber-500 text-neutral-950 shadow-sm"
                    : "hover:bg-slate-100 text-neutral-600 hover:text-neutral-950"
                }`}
              >
                <UserCheck className="w-4 h-4" />
                Girvi Ledger (गिरवी)
                {girviRecords.filter(r => r.status === "active").length > 0 && (
                  <span className={`ml-auto w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-bold ${
                    activeTab === "girvi" ? "bg-neutral-950 text-amber-500" : "bg-amber-500 text-neutral-950"
                  }`}>
                    {girviRecords.filter(r => r.status === "active").length}
                  </span>
                )}
              </button>

              <button
                onClick={() => setActiveTab("calculator")}
                className={`w-full py-3 px-4 rounded-md text-left transition-colors flex items-center gap-3 ${
                  activeTab === "calculator"
                    ? "bg-amber-500 text-neutral-950 shadow-sm"
                    : "hover:bg-slate-100 text-neutral-600 hover:text-neutral-950"
                }`}
              >
                <Calculator className="w-4 h-4" />
                Interest Calculator
              </button>
            </nav>
          </div>

          <div className="mt-auto border-t border-slate-100 pt-6">
            <a
              href="/"
              className="text-[10px] uppercase text-neutral-450 hover:text-amber-500 tracking-wider transition-colors flex items-center gap-2 font-bold"
            >
              ← Visit Live Store
            </a>
          </div>
        </aside>

        {/* Main Content Area */}
        <main className="flex-1 p-6 md:p-10 overflow-y-auto bg-slate-50">
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
          {/* Top Level Summary Statistics Panel */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
            {/* Customers */}
            <div className="bg-white border border-slate-200 rounded-lg p-5 shadow-sm flex flex-col justify-between relative overflow-hidden group hover:border-amber-500/55 transition-all">
              <span className="text-[10px] uppercase tracking-wider text-neutral-500 font-bold block">Total Customers</span>
              <span className="font-serif text-2xl text-neutral-900 font-black block mt-2">{stats.totalCustomers}</span>
              <span className="text-[9px] text-neutral-450 mt-1 font-mono">Unique Profile Directory</span>
              <span className="absolute right-4 bottom-4 text-amber-500/10 group-hover:text-amber-500/20 transition-all font-serif font-black text-5xl">👤</span>
            </div>

            {/* Active Girvi */}
            <div className="bg-white border border-slate-200 rounded-lg p-5 shadow-sm flex flex-col justify-between relative overflow-hidden group hover:border-amber-500/55 transition-all">
              <span className="text-[10px] uppercase tracking-wider text-neutral-500 font-bold block">Active Girvi</span>
              <span className="font-serif text-2xl text-neutral-900 font-black block mt-2">{stats.activeGirviCount} Pledges</span>
              <span className="text-[9px] text-amber-600 mt-1 font-mono">Gold / Silver Loans</span>
              <span className="absolute right-4 bottom-4 text-amber-500/10 group-hover:text-amber-500/20 transition-all font-serif font-black text-5xl">💍</span>
            </div>

            {/* Active Udhaari */}
            <div className="bg-white border border-slate-200 rounded-lg p-5 shadow-sm flex flex-col justify-between relative overflow-hidden group hover:border-amber-500/55 transition-all">
              <span className="text-[10px] uppercase tracking-wider text-neutral-500 font-bold block">Active Udhaari</span>
              <span className="font-serif text-2xl text-neutral-900 font-black block mt-2">{stats.activeUdhaariCount} Accounts</span>
              <span className="text-[9px] text-red-600 mt-1 font-mono">Pending Store Credit</span>
              <span className="absolute right-4 bottom-4 text-amber-500/10 group-hover:text-amber-500/20 transition-all font-serif font-black text-5xl">📖</span>
            </div>

            {/* Today's Transactions */}
            <div className="bg-white border border-slate-200 rounded-lg p-5 shadow-sm flex flex-col justify-between relative overflow-hidden group hover:border-amber-500/55 transition-all">
              <span className="text-[10px] uppercase tracking-wider text-neutral-500 font-bold block">Today's Activity</span>
              <span className="font-serif text-2xl text-neutral-900 font-black block mt-2">{stats.todayTransactions} Transactions</span>
              <span className="text-[9px] text-green-600 mt-1 font-mono">Pledges, releases, payments</span>
              <span className="absolute right-4 bottom-4 text-amber-500/10 group-hover:text-amber-500/20 transition-all font-serif font-black text-5xl">⚡</span>
            </div>

            {/* Pending Amount */}
            <div className="bg-white border border-slate-200 rounded-lg p-5 shadow-sm flex flex-col justify-between relative overflow-hidden group hover:border-amber-500/55 transition-all">
              <span className="text-[10px] uppercase tracking-wider text-red-800 font-bold block">Total Pending Amount</span>
              <span className="font-serif text-xl text-red-650 font-black block mt-2">₹{stats.totalPendingAmount.toLocaleString()}</span>
              <span className="text-[9px] text-neutral-450 mt-1 font-mono">Dues + Principal + Live Interest</span>
              <span className="absolute right-4 bottom-4 text-amber-500/10 group-hover:text-amber-500/20 transition-all font-serif font-black text-5xl">💸</span>
            </div>

            {/* Total Collection */}
            <div className="bg-white border border-slate-200 rounded-lg p-5 shadow-sm flex flex-col justify-between relative overflow-hidden group hover:border-amber-500/55 transition-all">
              <span className="text-[10px] uppercase tracking-wider text-green-800 font-bold block">Total Collection</span>
              <span className="font-serif text-xl text-green-650 font-black block mt-2">₹{stats.totalCollection.toLocaleString()}</span>
              <span className="text-[9px] text-neutral-450 mt-1 font-mono">Paid Credit + Released Principal/Interest</span>
              <span className="absolute right-4 bottom-4 text-amber-500/10 group-hover:text-amber-500/20 transition-all font-serif font-black text-5xl">💰</span>
            </div>

            {/* Total Gold Weight */}
            <div className="bg-white border border-slate-200 rounded-lg p-5 shadow-sm flex flex-col justify-between relative overflow-hidden group hover:border-amber-500/55 transition-all">
              <span className="text-[10px] uppercase tracking-wider text-neutral-500 font-bold block">Gold Inventory Pledged</span>
              <span className="font-serif text-xl text-neutral-900 font-black block mt-2">{stats.totalGoldWeight}g</span>
              <span className="text-[9px] text-amber-700 mt-1 font-mono">Calculated Net Gold Weight</span>
              <span className="absolute right-4 bottom-4 text-amber-500/10 group-hover:text-amber-500/20 transition-all font-serif font-black text-5xl">🪙</span>
            </div>

            {/* Total Silver Weight */}
            <div className="bg-white border border-slate-200 rounded-lg p-5 shadow-sm flex flex-col justify-between relative overflow-hidden group hover:border-amber-500/55 transition-all">
              <span className="text-[10px] uppercase tracking-wider text-neutral-500 font-bold block">Silver Inventory Pledged</span>
              <span className="font-serif text-xl text-neutral-900 font-black block mt-2">{stats.totalSilverWeight}g</span>
              <span className="text-[9px] text-neutral-500 mt-1 font-mono">Calculated Net Silver Weight</span>
              <span className="absolute right-4 bottom-4 text-amber-500/10 group-hover:text-amber-500/20 transition-all font-serif font-black text-5xl">⛓️</span>
            </div>
          </div>

          {/* Global Smart Search Bar Card */}
          <div className="bg-white border border-slate-200 rounded-lg p-5 shadow-sm mb-8">
            <label className="block text-[10px] uppercase tracking-widest text-amber-700 font-bold mb-1.5 flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5" /> Intelligent Customer Directory Profile Search
            </label>
            <div className="relative">
              <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-neutral-400">
                <Search className="w-4 h-4" />
              </span>
              <input
                type="text"
                value={globalSearchQuery}
                onChange={(e) => setGlobalSearchQuery(e.target.value)}
                placeholder="Search global customer profile by Name, Phone, Aadhaar, Girvi ID, or Udhaar ID (supports partial match)..."
                className="w-full bg-slate-50 border border-slate-300 focus:border-amber-500 focus:ring-1 focus:ring-amber-500 outline-none rounded-md py-3 pl-11 pr-12 text-sm text-neutral-900 font-medium transition-all shadow-inner"
              />
              {globalSearchQuery && (
                <button
                  onClick={() => setGlobalSearchQuery("")}
                  className="absolute inset-y-0 right-4 flex items-center text-neutral-400 hover:text-neutral-900 text-xs font-bold"
                >
                  Clear
                </button>
              )}
            </div>

            {/* Global Search Results dropdown overlay */}
            {globalSearchQuery.trim() !== "" && (() => {
              const matched = getFilteredCustomers();
              return (
                <div className="mt-3 bg-white border border-slate-200 rounded-md shadow-lg divide-y divide-slate-100 overflow-hidden max-h-60 overflow-y-auto">
                  {matched.length === 0 ? (
                    <div className="p-4 text-xs text-neutral-500 text-center">
                      No matching customer profiles found.
                    </div>
                  ) : (
                    matched.map((c, i) => (
                      <button
                        key={i}
                        onClick={() => {
                          setSelectedCustomerProfile(`${c.name.trim().toLowerCase()}_${c.phone.trim()}`);
                          setGlobalSearchQuery("");
                        }}
                        className="w-full text-left p-3.5 hover:bg-slate-50 transition-colors flex items-center justify-between text-xs cursor-pointer"
                      >
                        <div>
                          <div className="font-bold text-neutral-950 text-sm">{c.name}</div>
                          <div className="text-neutral-500 text-[10px] mt-0.5">S/O: {c.sonOf} • Mobile: {c.phone} • Aadhaar: {c.aadhaar || "Not recorded"}</div>
                        </div>
                        <span className="text-[10px] text-amber-700 bg-amber-50 px-2 py-0.5 rounded border border-amber-500/20 font-bold uppercase tracking-wider">
                          View Combined Profile →
                        </span>
                      </button>
                    ))
                  )}
                </div>
              );
            })()}
          </div>

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

              {/* Add New Product Form Section */}
              <div className="space-y-4">
                <div className="flex justify-between items-center bg-neutral-900/60 border border-amber-500/10 p-4 rounded-sm">
                  <div>
                    <h4 className="font-serif text-base text-white">Need to expand your showroom catalog?</h4>
                    <p className="font-sans text-[11px] text-neutral-400">Create new dynamic items with pricing, materials description, and photos.</p>
                  </div>
                  <button
                    onClick={() => setIsFormOpen(!isFormOpen)}
                    className="py-2 px-4 bg-[#dfba73] hover:bg-[#c5a059] text-neutral-950 font-sans text-xs font-bold tracking-wider uppercase transition-colors"
                  >
                    {isFormOpen ? "Hide Form" : "Add New Design"}
                  </button>
                </div>

                {isFormOpen && (
                  <form 
                    onSubmit={handleCreateProduct}
                    className="bg-neutral-900 border border-[#dfba73]/30 p-6 rounded-sm space-y-4 animate-slide-up"
                  >
                    <div className="border-b border-[#dfba73]/15 pb-2 mb-2">
                      <h4 className="font-serif text-base text-[#dfba73]">Add New Product Card</h4>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div>
                        <label className="block font-sans text-[9px] uppercase tracking-widest text-[#dfba73] font-bold mb-1">
                          Product Code / ID (e.g. oj-013)
                        </label>
                        <input
                          type="text"
                          value={newProdId}
                          onChange={(e) => setNewProdId(e.target.value)}
                          placeholder="e.g. oj-013"
                          required
                          className="w-full bg-neutral-950 border border-neutral-800 focus:border-amber-500 py-2 px-3 outline-none text-xs text-white"
                        />
                      </div>
                      <div>
                        <label className="block font-sans text-[9px] uppercase tracking-widest text-[#dfba73] font-bold mb-1">
                          Product Name
                        </label>
                        <input
                          type="text"
                          value={newProdName}
                          onChange={(e) => setNewProdName(e.target.value)}
                          placeholder="e.g. Traditional Gold Choker"
                          required
                          className="w-full bg-neutral-950 border border-neutral-800 focus:border-amber-500 py-2 px-3 outline-none text-xs text-white"
                        />
                      </div>
                      <div>
                        <label className="block font-sans text-[9px] uppercase tracking-widest text-[#dfba73] font-bold mb-1">
                          Price (in INR)
                        </label>
                        <input
                          type="text"
                          value={newProdPrice}
                          onChange={(e) => setNewProdPrice(e.target.value)}
                          placeholder="e.g. 85000"
                          required
                          className="w-full bg-neutral-950 border border-neutral-800 focus:border-amber-500 py-2 px-3 outline-none text-xs text-white"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div>
                        <label className="block font-sans text-[9px] uppercase tracking-widest text-[#dfba73] font-bold mb-1">
                          Category Tag
                        </label>
                        <select
                          value={newProdCategory}
                          onChange={(e) => setNewProdCategory(e.target.value as any)}
                          className="w-full bg-neutral-950 border border-neutral-800 focus:border-amber-500 py-2 px-3 outline-none text-xs text-white"
                        >
                          <option value="new-arrivals">New Arrivals</option>
                          <option value="best-sellers">Best Sellers</option>
                          <option value="bridal">Bridal</option>
                          <option value="daily-wear">Daily Wear</option>
                          <option value="silver">Silver Jewellery</option>
                        </select>
                      </div>
                      <div>
                        <label className="block font-sans text-[9px] uppercase tracking-widest text-[#dfba73] font-bold mb-1">
                          Subcategory (Rings, Chains, etc.)
                        </label>
                        <input
                          type="text"
                          value={newProdSubCategory}
                          onChange={(e) => setNewProdSubCategory(e.target.value)}
                          placeholder="e.g. Necklaces"
                          required
                          className="w-full bg-neutral-950 border border-neutral-800 focus:border-amber-500 py-2 px-3 outline-none text-xs text-white"
                        />
                      </div>
                      <div>
                        <label className="block font-sans text-[9px] uppercase tracking-widest text-[#dfba73] font-bold mb-1">
                          Gold Purity / Materials
                        </label>
                        <input
                          type="text"
                          value={newProdMaterials}
                          onChange={(e) => setNewProdMaterials(e.target.value)}
                          placeholder="e.g. 22k Solid Gold"
                          className="w-full bg-neutral-950 border border-neutral-800 focus:border-amber-500 py-2 px-3 outline-none text-xs text-white"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block font-sans text-[9px] uppercase tracking-widest text-[#dfba73] font-bold mb-1">
                          Product Description (for Quick View / Details page)
                        </label>
                        <textarea
                          value={newProdDesc}
                          onChange={(e) => setNewProdDesc(e.target.value)}
                          placeholder="Write dynamic description..."
                          className="w-full h-20 bg-neutral-950 border border-neutral-800 focus:border-amber-500 py-2 px-3 outline-none text-xs text-white resize-none"
                        />
                      </div>
                      <div>
                        <label className="block font-sans text-[9px] uppercase tracking-widest text-[#dfba73] font-bold mb-1">
                          Specifications Details (comma separated, e.g. Weight: 14g, Width: 5mm)
                        </label>
                        <textarea
                          value={newProdDetails}
                          onChange={(e) => setNewProdDetails(e.target.value)}
                          placeholder="e.g. Weight: 12.5g, Diameter: 14cm"
                          className="w-full h-20 bg-neutral-950 border border-neutral-800 focus:border-amber-500 py-2 px-3 outline-none text-xs text-white resize-none"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block font-sans text-[9px] uppercase tracking-widest text-[#dfba73] font-bold mb-1">
                        Mock Image URL (optional, defaults to gold necklace placeholder)
                      </label>
                      <input
                        type="text"
                        value={newProdImage}
                        onChange={(e) => setNewProdImage(e.target.value)}
                        placeholder="e.g. https://images.unsplash.com/..."
                        className="w-full bg-neutral-950 border border-neutral-800 focus:border-amber-500 py-2 px-3 outline-none text-xs text-white"
                      />
                    </div>

                    <div className="flex justify-end gap-3 pt-2">
                      <button
                        type="button"
                        onClick={() => setIsFormOpen(false)}
                        className="py-2.5 px-6 bg-neutral-950 border border-neutral-800 hover:bg-neutral-800 text-white font-sans text-xs font-bold uppercase transition-colors"
                      >
                        Cancel
                      </button>
                      <button
                        type="submit"
                        className="py-2.5 px-6 bg-amber-500 hover:bg-amber-600 text-neutral-950 font-sans text-xs font-bold uppercase transition-colors"
                      >
                        Save Product Card
                      </button>
                    </div>
                  </form>
                )}
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
                              defaultValue={customText[`prod_name_${product.id}`] || product.name}
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
                              Price (in INR)
                            </label>
                            <input
                              type="text"
                              defaultValue={customText[`prod_price_${product.id}`] || `₹${product.price.toLocaleString()}`}
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
                          <div className="mt-3">
                            <label className="block font-sans text-[9px] uppercase tracking-widest text-[#dfba73] font-bold mb-1">
                              Specifications Details (comma separated)
                            </label>
                            <input
                              type="text"
                              defaultValue={product.details ? product.details.join(", ") : ""}
                              id={`inp_details_${product.id}`}
                              className="w-full bg-neutral-950 border border-neutral-800 focus:border-amber-500 py-2 px-3 outline-none text-xs text-white"
                            />
                          </div>
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
                            const detailsInp = document.getElementById(`inp_details_${product.id}`) as HTMLInputElement;
                            if (nameInp && priceInp && subcatInp && descInp && matInp && detailsInp) {
                              handleUpdateProduct(
                                product.id,
                                nameInp.value,
                                priceInp.value,
                                subcatInp.value,
                                descInp.value,
                                matInp.value,
                                detailsInp.value
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
                      autoComplete="new-password"
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
                  <div className="relative w-full">
                    <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-neutral-400">
                      <Search className="w-4 h-4" />
                    </span>
                    <input
                      type="text"
                      value={udhaarSearchQuery}
                      onChange={(e) => setUdhaarSearchQuery(e.target.value)}
                      placeholder="Search ledger by Name, S/O Name, Phone, Village, Ornament or Date..."
                      className="w-full bg-white border border-slate-300 focus:border-amber-500 focus:ring-1 focus:ring-amber-500 outline-none rounded-md py-3 pl-11 pr-6 text-sm text-neutral-900 transition-all shadow-sm"
                    />
                    {udhaarSearchQuery && (
                      <button
                        onClick={() => setUdhaarSearchQuery("")}
                        className="absolute inset-y-0 right-4 flex items-center text-neutral-400 hover:text-neutral-900 text-[10px] uppercase font-bold"
                      >
                        Clear
                      </button>
                    )}
                  </div>

                  {/* Ledger Table */}
                  <div className="bg-white border border-slate-200 rounded-md overflow-hidden shadow-sm">
                    <div className="overflow-x-auto">
                      <table className="w-full text-left font-sans text-xs border-collapse">
                        <thead>
                          <tr className="border-b border-slate-200 bg-slate-50 text-neutral-600 font-bold uppercase tracking-wider text-[10px]">
                            <th className="py-4 px-4 text-center">S.No</th>
                            <th className="py-4 px-4">Customer Details</th>
                            <th className="py-4 px-4">Village</th>
                            <th className="py-4 px-4">Purchase details</th>
                            <th className="py-4 px-4 text-right">Financials (₹)</th>
                            <th className="py-4 px-4 text-center">Actions</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100">
                          {udhaarRecords && udhaarRecords.length > 0 && udhaarRecords
                            .filter((rec) => {
                              const query = udhaarSearchQuery.toLowerCase();
                              const matchesName = (rec.name || "").toLowerCase().includes(query);
                              const matchesSonOf = (rec.sonOf || "").toLowerCase().includes(query);
                              const matchesPhone = (rec.phone || "").toLowerCase().includes(query);
                              const matchesVillage = (rec.village || "").toLowerCase().includes(query);
                              const matchesDate = (rec.date || "").toLowerCase().includes(query);
                              const matchesOrnament = (rec.ornament || "").toLowerCase().includes(query) || 
                                (rec.ornaments && rec.ornaments.some(o => (o.name || "").toLowerCase().includes(query)));
                              
                              return matchesName || matchesSonOf || matchesPhone || matchesVillage || matchesDate || matchesOrnament;
                            })
                            .map((rec, index) => {
                              const hasDues = parseFloat(rec.dues || "0") > 0;
                              return (
                                <tr key={rec.id} className="hover:bg-slate-50 border-b border-slate-100 transition-colors text-neutral-800">
                                  <td className="py-4 px-4 text-center font-mono text-neutral-400">
                                    {index + 1}
                                  </td>
                                  <td className="py-4 px-4">
                                    <div className="font-bold text-neutral-900 text-sm">{rec.name}</div>
                                    <div className="text-neutral-500 text-[10px] mt-0.5">S/O: {rec.sonOf}</div>
                                    <div className="text-neutral-500 text-[10px] mt-0.5 font-mono">{rec.phone}</div>
                                  </td>
                                  <td className="py-4 px-4 text-neutral-700 font-medium">
                                    <div className="flex items-center gap-1">
                                      <MapPin className="w-3.5 h-3.5 text-amber-500/60" />
                                      {rec.village}
                                    </div>
                                  </td>
                                  <td className="py-4 px-4">
                                    {rec.ornaments && rec.ornaments.length > 0 ? (
                                      <div className="space-y-2">
                                        {rec.ornaments.map((item, idx) => (
                                          <div key={idx} className="border-b border-slate-150 pb-1.5 last:border-0 last:pb-0">
                                            <div className="font-bold text-amber-800">{item.name || (item as any).ornament}</div>
                                            <div className="text-[10px] text-neutral-500 mt-0.5 font-sans">
                                              Weight: <span className="font-mono bg-slate-100 px-1.5 py-0.5 rounded-sm border border-slate-200 text-neutral-700 font-bold">{item.weight}</span>
                                            </div>
                                          </div>
                                        ))}
                                      </div>
                                    ) : (
                                      <>
                                        <div className="font-bold text-amber-800">{rec.ornament}</div>
                                        <div className="text-[10px] text-neutral-500 mt-0.5">
                                          Weight: <span className="font-mono bg-slate-100 px-1.5 py-0.5 rounded-sm border border-slate-200 text-neutral-700 font-bold">{rec.weight}</span>
                                        </div>
                                      </>
                                    )}
                                    <div className="text-[9px] text-neutral-500 mt-2 flex items-center gap-1 font-mono">
                                      <Calendar className="w-3 h-3" />
                                      {rec.date}
                                    </div>
                                  </td>
                                  <td className="py-4 px-4 text-right space-y-0.5">
                                    <div className="font-mono text-neutral-500 text-[10px]">Total: ₹{parseFloat(rec.amount || "0").toLocaleString()}</div>
                                    <div className="font-mono text-neutral-500 text-[10px]">Discount: ₹{parseFloat(rec.discount || "0").toLocaleString()}</div>
                                    <div className="font-mono text-green-700 text-[10px]">Gave: ₹{parseFloat(rec.paid || "0").toLocaleString()}</div>
                                    <div className={`font-mono text-xs font-extrabold pt-1 border-t border-slate-200 ${hasDues ? "text-red-650 font-black" : "text-green-650"}`}>
                                      {hasDues ? `Dues: ₹${(parseFloat(rec.dues || "0") || 0).toLocaleString()}` : "✓ Fully Paid"}
                                    </div>
                                    {rec.notes && (
                                      <div className="text-[9px] text-neutral-450 max-w-[150px] truncate pt-0.5" title={rec.notes}>
                                        {rec.notes}
                                      </div>
                                    )}
                                  </td>
                                  <td className="py-4 px-4 text-center">
                                    <div className="flex items-center justify-center gap-2">
                                      <button
                                        onClick={() => setSelectedUdhaar(rec)}
                                        className="p-1.5 bg-blue-50 border border-blue-200 text-blue-600 hover:bg-blue-100 rounded transition-colors"
                                        title="View Descriptive Ledger Entry"
                                      >
                                        <Eye className="w-3.5 h-3.5" />
                                      </button>
                                      {hasDues && (
                                        <button
                                          onClick={() => handleRecordPayment(rec.id)}
                                          className="p-1.5 bg-green-50 border border-green-200 text-green-700 hover:bg-green-100 rounded transition-colors"
                                          title="Record credit payment"
                                        >
                                          <DollarSign className="w-3.5 h-3.5" />
                                        </button>
                                      )}
                                      <button
                                        onClick={() => handleDeleteUdhaar(rec.id)}
                                        className="p-1.5 bg-red-50 border border-red-200 text-red-600 hover:bg-red-100 rounded transition-colors"
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
                            const matchesName = (rec.name || "").toLowerCase().includes(query);
                            const matchesSonOf = (rec.sonOf || "").toLowerCase().includes(query);
                            const matchesPhone = (rec.phone || "").toLowerCase().includes(query);
                            const matchesVillage = (rec.village || "").toLowerCase().includes(query);
                            const matchesDate = (rec.date || "").toLowerCase().includes(query);
                            const matchesOrnament = (rec.ornament || "").toLowerCase().includes(query) || 
                              (rec.ornaments && rec.ornaments.some(o => (o.name || "").toLowerCase().includes(query)));
                            
                            return matchesName || matchesSonOf || matchesPhone || matchesVillage || matchesDate || matchesOrnament;
                          }).length === 0 && (
                            <tr>
                              <td colSpan={6} className="py-12 px-4 text-center text-neutral-500 text-sm">
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

          {/* TAB 6: GIRVI LEDGER */}
          {activeTab === "girvi" && (
            <div className="space-y-6 animate-fade-in font-sans text-sm">
              <div className="flex flex-col md:flex-row md:items-center justify-between border-b border-slate-200 pb-4 gap-4">
                <div>
                  <span className="text-[10px] text-amber-600 tracking-[0.3em] uppercase font-bold block">
                    Pledging Registry
                  </span>
                  <h2 className="font-serif text-3xl font-bold text-neutral-900 mt-1">
                    Girvi Ledger (गिरवी बही)
                  </h2>
                  <p className="text-neutral-600 mt-1 text-sm">
                    Manage cash loans given against gold & silver ornaments, calculate live compound and simple interest, and archive closed cases.
                  </p>
                </div>

                <div className="flex gap-4">
                  <div className="bg-white border border-slate-200 p-4 rounded-md min-w-[120px] text-center shadow-sm">
                    <span className="text-[10px] uppercase tracking-wider text-neutral-500 font-bold block">Active Loans</span>
                    <span className="font-serif text-2xl text-neutral-900 font-extrabold block mt-1">
                      {girviRecords.filter(r => r.status === "active").length}
                    </span>
                  </div>
                  <div className="bg-white border border-amber-200 p-4 rounded-md min-w-[155px] text-center shadow-sm">
                    <span className="text-[10px] uppercase tracking-wider text-amber-700 font-bold block">Total Outflow</span>
                    <span className="font-serif text-2xl text-amber-600 font-extrabold block mt-1">
                      ₹{girviRecords.filter(r => r.status === "active").reduce((sum, r) => sum + parseFloat(r.amount || "0"), 0).toLocaleString()}
                    </span>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
                {/* Left: Pledging Form */}
                <div className="bg-white border border-slate-200 p-6 rounded-md space-y-6 shadow-sm">
                  <h3 className="font-serif text-lg text-amber-700 border-b border-slate-200 pb-2 flex items-center gap-2 font-bold">
                    <Lock className="w-4 h-4 text-amber-600" />
                    Pledge Ornaments (गिरवी रखें)
                  </h3>

                  <form id="girvi_form" onSubmit={handleAddGirvi} className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-[10px] uppercase tracking-wider text-neutral-600 font-bold mb-1.5">
                          Customer Name *
                        </label>
                        <input
                          type="text"
                          required
                          id="girvi_name"
                          placeholder="Name"
                          className="w-full bg-white border border-slate-300 focus:border-amber-500 focus:ring-1 focus:ring-amber-500 outline-none py-2.5 px-3 text-neutral-900 text-sm rounded-md transition-all shadow-sm"
                        />
                      </div>
                      <div>
                        <label className="block text-[10px] uppercase tracking-wider text-neutral-600 font-bold mb-1.5">
                          S/O / Husband Name *
                        </label>
                        <input
                          type="text"
                          required
                          id="girvi_sonOf"
                          placeholder="Parentage"
                          className="w-full bg-white border border-slate-300 focus:border-amber-500 focus:ring-1 focus:ring-amber-500 outline-none py-2.5 px-3 text-neutral-900 text-sm rounded-md transition-all shadow-sm"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-[10px] uppercase tracking-wider text-neutral-600 font-bold mb-1.5">
                          Phone Number
                        </label>
                        <input
                          type="text"
                          id="girvi_phone"
                          placeholder="Mobile"
                          className="w-full bg-white border border-slate-300 focus:border-amber-500 focus:ring-1 focus:ring-amber-500 outline-none py-2.5 px-3 text-neutral-900 text-sm rounded-md transition-all font-mono shadow-sm"
                        />
                      </div>
                      <div>
                        <label className="block text-[10px] uppercase tracking-wider text-neutral-600 font-bold mb-1.5">
                          Village / Town *
                        </label>
                        <input
                          type="text"
                          required
                          id="girvi_village"
                          placeholder="Location"
                          className="w-full bg-white border border-slate-300 focus:border-amber-500 focus:ring-1 focus:ring-amber-500 outline-none py-2.5 px-3 text-neutral-900 text-sm rounded-md transition-all shadow-sm"
                        />
                      </div>
                    </div>

                    <div className="space-y-2 border-t border-b border-slate-200 py-4">
                      <label className="block text-[10px] uppercase tracking-widest text-amber-700 font-bold">
                        Pledged Ornaments & Weights *
                      </label>
                      <div className="space-y-2">
                        {newGirviItems.map((item, idx) => (
                          <div key={idx} className="flex gap-2 items-center">
                            <div className="flex-1">
                              <input
                                type="text"
                                required
                                value={item.ornament}
                                onChange={(e) => {
                                  const updated = [...newGirviItems];
                                  updated[idx].ornament = e.target.value;
                                  setNewGirviItems(updated);
                                }}
                                placeholder="Ornament (e.g. Gold Jhumka)"
                                className="w-full bg-white border border-slate-300 focus:border-amber-500 focus:ring-1 focus:ring-amber-500 outline-none py-2 px-2.5 text-neutral-900 text-xs rounded-md shadow-sm"
                              />
                            </div>
                            <div className="w-24">
                              <input
                                type="text"
                                required
                                value={item.weight}
                                onChange={(e) => {
                                  const updated = [...newGirviItems];
                                  updated[idx].weight = e.target.value;
                                  setNewGirviItems(updated);
                                }}
                                placeholder="Weight (e.g. 10.2g)"
                                className="w-full bg-white border border-slate-300 focus:border-amber-500 focus:ring-1 focus:ring-amber-500 outline-none py-2 px-2.5 text-neutral-900 text-xs font-mono rounded-md shadow-sm"
                              />
                            </div>
                            {newGirviItems.length > 1 && (
                              <button
                                type="button"
                                onClick={() => setNewGirviItems(newGirviItems.filter((_, i) => i !== idx))}
                                className="p-1.5 bg-red-500/10 border border-red-500/20 text-red-500 hover:bg-red-500/20 rounded transition-colors"
                              >
                                <Trash2 className="w-3.5 h-3.5" />
                              </button>
                            )}
                          </div>
                        ))}
                      </div>
                      <button
                        type="button"
                        onClick={() => setNewGirviItems([...newGirviItems, { ornament: "", weight: "" }])}
                        className="w-full py-2 border border-dashed border-slate-300 hover:border-amber-500 hover:text-amber-600 text-neutral-600 bg-slate-50 hover:bg-amber-50/20 rounded-md text-[10px] uppercase font-bold tracking-wider transition-colors flex items-center justify-center gap-1.5"
                      >
                        <Plus className="w-3.5 h-3.5" /> Add Another Ornament
                      </button>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-[10px] uppercase tracking-wider text-neutral-600 font-bold mb-1.5">
                          Loan Money Given (₹) *
                        </label>
                        <input
                          type="number"
                          required
                          id="girvi_amount"
                          placeholder="Principal loan value"
                          className="w-full bg-white border border-slate-300 focus:border-amber-500 focus:ring-1 focus:ring-amber-500 outline-none py-2.5 px-3 text-neutral-900 text-sm rounded-md shadow-sm font-mono"
                        />
                      </div>
                      <div>
                        <label className="block text-[10px] uppercase tracking-wider text-neutral-600 font-bold mb-1.5">
                          Interest Rate (% value) *
                        </label>
                        <input
                          type="text"
                          required
                          id="girvi_rate"
                          placeholder="e.g. 2.0"
                          className="w-full bg-white border border-slate-300 focus:border-amber-500 focus:ring-1 focus:ring-amber-500 outline-none py-2.5 px-3 text-neutral-900 text-sm rounded-md shadow-sm font-mono"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-[10px] uppercase tracking-wider text-neutral-600 font-bold mb-1.5">
                          Interest Period
                        </label>
                        <select
                          id="girvi_period"
                          className="w-full bg-white border border-slate-300 focus:border-amber-500 outline-none py-2.5 px-3 text-neutral-900 text-sm rounded-md shadow-sm"
                        >
                          <option value="monthly">Per Month (मासिक)</option>
                          <option value="yearly">Per Year (वार्षिक)</option>
                        </select>
                      </div>
                      <div>
                        <label className="block text-[10px] uppercase tracking-wider text-neutral-600 font-bold mb-1.5">
                          Interest Type
                        </label>
                        <select
                          id="girvi_type"
                          className="w-full bg-white border border-slate-300 focus:border-amber-500 outline-none py-2.5 px-3 text-neutral-900 text-sm rounded-md shadow-sm"
                        >
                          <option value="simple">Simple Interest (साधारण ब्याज)</option>
                          <option value="compound">Compound Interest (चक्रवृद्धि ब्याज)</option>
                        </select>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 gap-4">
                      <div>
                        <label className="block text-[10px] uppercase tracking-wider text-neutral-600 font-bold mb-1.5">
                          Pledged Date *
                        </label>
                        <input
                          type="date"
                          required
                          id="girvi_date"
                          defaultValue={new Date().toISOString().split("T")[0]}
                          className="w-full bg-white border border-slate-300 focus:border-amber-500 focus:ring-1 focus:ring-amber-500 outline-none py-2.5 px-3 text-neutral-900 text-sm rounded-md shadow-sm font-mono"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-[10px] uppercase tracking-wider text-neutral-600 font-bold mb-1.5">
                        Internal Ledger Notes
                      </label>
                      <textarea
                        id="girvi_notes"
                        rows={2}
                        placeholder="Additional terms or comments"
                        className="w-full bg-white border border-slate-300 focus:border-amber-500 focus:ring-1 focus:ring-amber-500 outline-none py-2 px-3 text-neutral-900 text-xs rounded-md shadow-sm resize-none"
                      />
                    </div>

                    <button
                      type="submit"
                      className="w-full py-3 bg-amber-500 hover:bg-amber-600 text-neutral-950 font-sans text-xs font-bold tracking-widest uppercase transition-colors rounded-md flex items-center justify-center gap-2 cursor-pointer shadow-sm"
                    >
                      <Plus className="w-4 h-4" />
                      Add Girvi Entry
                    </button>
                  </form>
                </div>

                {/* Right: Search & Tables */}
                <div className="lg:col-span-2 space-y-6">
                  {/* Tab active entries registry */}
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <h4 className="font-serif text-xl font-bold text-neutral-900">Active Pledges Log (गिरवी चालू खाते)</h4>
                    </div>

                    <div className="relative w-full">
                      <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-neutral-400">
                        <Search className="w-4 h-4" />
                      </span>
                      <input
                        type="text"
                        value={girviSearchQuery}
                        onChange={(e) => setGirviSearchQuery(e.target.value)}
                        placeholder="Search active pledges by Name, S/O Name, Phone, Village, Ornament..."
                        className="w-full bg-white border border-slate-300 focus:border-amber-500 focus:ring-1 focus:ring-amber-500 outline-none rounded-md py-3 pl-11 pr-6 text-sm text-neutral-900 transition-all shadow-sm"
                      />
                      {girviSearchQuery && (
                        <button
                          onClick={() => setGirviSearchQuery("")}
                          className="absolute inset-y-0 right-4 flex items-center text-neutral-400 hover:text-neutral-900 text-[10px] uppercase font-bold"
                        >
                          Clear
                        </button>
                      )}
                    </div>

                    {/* Found matching Udhaar records alert for name/family search */}
                    {girviSearchQuery.trim() !== "" && (() => {
                      const q = girviSearchQuery.toLowerCase();
                      const matches = udhaarRecords.filter(u => 
                        (u.name || "").toLowerCase().includes(q) || 
                        (u.sonOf || "").toLowerCase().includes(q) ||
                        (u.village || "").toLowerCase().includes(q)
                      );
                      if (matches.length === 0) return null;
                      return (
                        <div className="bg-red-50 border border-red-200/85 p-4 rounded-md space-y-2 animate-fade-in shadow-sm">
                          <div className="flex items-center gap-2 text-red-800 font-bold text-xs uppercase tracking-wider">
                            <BookOpen className="w-4 h-4 shrink-0 text-red-600 animate-pulse" /> 
                            <span>⚠️ Linked Store Udhaar Accounts Found (उधार खाता मिलान)</span>
                          </div>
                          <div className="overflow-x-auto">
                            <table className="w-full text-left text-xs text-red-950 border-collapse">
                              <thead>
                                <tr className="border-b border-red-200 text-red-800 font-bold uppercase tracking-wider text-[10px]">
                                  <th className="py-2 px-1">Customer Details</th>
                                  <th className="py-2 px-1">Village</th>
                                  <th className="py-2 px-1 text-right">Outstanding Dues</th>
                                </tr>
                              </thead>
                              <tbody>
                                {matches.map(m => (
                                  <tr key={m.id} className="border-b border-red-100 last:border-0 hover:bg-red-100/30">
                                    <td className="py-2 px-1 font-bold">
                                      {m.name}
                                      <span className="text-[10px] text-red-750 block font-normal mt-0.5">S/O: {m.sonOf} | {m.phone || "N/A"}</span>
                                    </td>
                                    <td className="py-2 px-1 text-red-800">{m.village}</td>
                                    <td className="py-2 px-1 text-right font-bold font-mono text-red-650 text-sm">
                                      ₹{(parseFloat(m.dues || "0") || 0).toLocaleString()}
                                    </td>
                                  </tr>
                                ))}
                              </tbody>
                            </table>
                          </div>
                        </div>
                      );
                    })()}

                    <div className="bg-white border border-slate-200 rounded-md overflow-hidden shadow-sm">
                      <div className="overflow-x-auto">
                        <table className="w-full text-left font-sans text-sm border-collapse">
                          <thead>
                            <tr className="border-b border-slate-200 bg-slate-50 text-neutral-600 font-bold uppercase tracking-wider text-[10px]">
                              <th className="py-4 px-4 text-center">S.No</th>
                              <th className="py-4 px-4">Customer details</th>
                              <th className="py-4 px-4">Village</th>
                              <th className="py-4 px-4">Pledged Ornaments</th>
                              <th className="py-4 px-4 text-right">Loan & Interest</th>
                              <th className="py-4 px-4 text-center">Actions</th>
                            </tr>
                          </thead>
                          <tbody className="divide-y divide-neutral-800/50">
                            {girviRecords
                              .filter(r => r.status === "active")
                              .filter((rec) => {
                                const q = girviSearchQuery.toLowerCase();
                                const nameM = (rec.name || "").toLowerCase().includes(q);
                                const parentM = (rec.sonOf || "").toLowerCase().includes(q);
                                const phoneM = (rec.phone || "").toLowerCase().includes(q);
                                const villageM = (rec.village || "").toLowerCase().includes(q);
                                const ornamentsM = rec.ornaments && rec.ornaments.some(o => (o.name || "").toLowerCase().includes(q));
                                return nameM || parentM || phoneM || villageM || ornamentsM;
                              })
                              .map((rec, index) => {
                                const calc = calculateGirviInterest(rec);
                                return (
                                  <tr key={rec.id} className="hover:bg-slate-50 border-b border-slate-100 transition-colors text-neutral-800">
                                    <td className="py-4 px-4 text-center font-mono text-neutral-400">
                                      {index + 1}
                                    </td>
                                    <td className="py-4 px-4">
                                      <div className="font-bold text-neutral-900 text-sm">{rec.name}</div>
                                      <div className="text-neutral-500 text-xs mt-0.5">S/O: {rec.sonOf}</div>
                                      <div className="text-neutral-500 text-xs mt-0.5 font-mono">{rec.phone}</div>
                                    </td>
                                    <td className="py-4 px-4 text-neutral-700 font-medium">
                                      <div className="flex items-center gap-1">
                                        <MapPin className="w-3.5 h-3.5 text-amber-500/60" />
                                        {rec.village}
                                      </div>
                                    </td>
                                    <td className="py-4 px-4 text-neutral-700">
                                      <div className="space-y-1.5">
                                        {rec.ornaments && rec.ornaments.map((item, idx) => (
                                          <div key={idx} className="flex items-center gap-1.5">
                                            <span className="font-bold text-amber-800">{(item as any).name || (item as any).ornament}</span>
                                            <span className="text-[10px] font-mono bg-slate-100 px-1.5 py-0.5 rounded border border-slate-200 text-neutral-600 font-bold">{item.weight}</span>
                                          </div>
                                        ))}
                                      </div>
                                      <div className="text-[10px] text-neutral-500 mt-2 flex items-center gap-1 font-mono">
                                        <Calendar className="w-3 h-3" />
                                        {rec.date}
                                      </div>
                                    </td>
                                    <td className="py-4 px-4 text-right space-y-0.5">
                                      <div className="font-mono text-neutral-600 text-xs">Loan: ₹{(parseFloat(rec.amount || "0") || 0).toLocaleString()}</div>
                                      <div className="font-mono text-neutral-500 text-[10px]">Rate: {rec.interestRate || "0"}% ({rec.interestPeriod === "monthly" ? "mo" : "yr"})</div>
                                      <div className="font-mono text-amber-600 font-bold text-xs">Interest: ₹{(calc.interest || 0).toLocaleString()}</div>
                                      <div className="font-mono text-sm font-extrabold text-green-600 pt-1 border-t border-slate-200">
                                        Total: ₹{(calc.total || 0).toLocaleString()}
                                      </div>
                                    </td>
                                    <td className="py-4 px-4 text-center">
                                      <div className="flex items-center justify-center gap-1.5">
                                        <button
                                          onClick={() => setSelectedGirvi(rec)}
                                          className="p-1.5 bg-blue-50 border border-blue-200 text-blue-600 hover:bg-blue-100 rounded transition-colors"
                                          title="View Pledged Details & Live Interest"
                                        >
                                          <Eye className="w-3.5 h-3.5" />
                                        </button>
                                        <button
                                          onClick={() => handleReleaseGirvi(rec.id)}
                                          className="p-1.5 bg-green-50 border border-green-200 text-green-700 hover:bg-green-100 rounded transition-colors"
                                          title="Close Loan (Move to History)"
                                        >
                                          <CheckSquare className="w-3.5 h-3.5" />
                                        </button>
                                        <button
                                          onClick={() => {
                                            setSelectedGirviForEdit(rec);
                                            setNewAddDate(new Date().toISOString().split("T")[0]);
                                          }}
                                          className="p-1.5 bg-slate-50 border border-slate-200 text-neutral-600 hover:bg-slate-100 rounded transition-colors"
                                          title="Edit Details / Add Principal"
                                        >
                                          <Settings className="w-3.5 h-3.5" />
                                        </button>
                                        <button
                                          onClick={() => handleDeleteGirvi(rec.id)}
                                          className="p-1.5 bg-red-50 border border-red-200 text-red-600 hover:bg-red-100 rounded transition-colors"
                                          title="Delete Pledge Entry"
                                        >
                                          <Trash2 className="w-3.5 h-3.5" />
                                        </button>
                                      </div>
                                    </td>
                                  </tr>
                                );
                              })}
                            {girviRecords.filter(r => r.status === "active").filter((rec) => {
                              const q = girviSearchQuery.toLowerCase();
                              const nameM = (rec.name || "").toLowerCase().includes(q);
                              const parentM = (rec.sonOf || "").toLowerCase().includes(q);
                              const phoneM = (rec.phone || "").toLowerCase().includes(q);
                              const villageM = (rec.village || "").toLowerCase().includes(q);
                              const ornamentsM = rec.ornaments && rec.ornaments.some(o => (o.name || "").toLowerCase().includes(q));
                              return nameM || parentM || phoneM || villageM || ornamentsM;
                            }).length === 0 && (
                              <tr>
                                <td colSpan={6} className="py-12 px-4 text-center text-neutral-500 text-sm">
                                  No active pledged records found.
                                </td>
                              </tr>
                            )}
                          </tbody>
                        </table>
                      </div>
                    </div>
                  </div>

                  {/* History tab archive */}
                  <div className="space-y-4 pt-4 border-t border-slate-200">
                    <div>
                      <h4 className="font-serif text-xl font-bold text-neutral-850">Closed Pledges History (गिरवी बंद खाते इतिहास)</h4>
                      <p className="text-xs text-neutral-500">History record log of closed or released gold pledges.</p>
                    </div>

                    <div className="relative w-full">
                      <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-neutral-400">
                        <Search className="w-4 h-4" />
                      </span>
                      <input
                        type="text"
                        value={girviHistorySearchQuery}
                        onChange={(e) => setGirviHistorySearchQuery(e.target.value)}
                        placeholder="Search closed pledges history log..."
                        className="w-full bg-white border border-slate-300 focus:border-amber-500 focus:ring-1 focus:ring-amber-500 outline-none rounded-md py-2.5 pl-11 pr-6 text-sm text-neutral-900 transition-all shadow-sm"
                      />
                      {girviHistorySearchQuery && (
                        <button
                          onClick={() => setGirviHistorySearchQuery("")}
                          className="absolute inset-y-0 right-4 flex items-center text-neutral-450 hover:text-neutral-900 text-[10px] uppercase font-bold"
                        >
                          Clear
                        </button>
                      )}
                    </div>

                    <div className="bg-white border border-slate-200 rounded-md overflow-hidden shadow-sm">
                      <div className="overflow-x-auto">
                        <table className="w-full text-left font-sans text-sm border-collapse">
                          <thead>
                            <tr className="border-b border-slate-200 bg-slate-50 text-neutral-500 font-bold uppercase tracking-wider text-[10px]">
                              <th className="py-3 px-4 text-center">S.No</th>
                              <th className="py-3 px-4">Customer</th>
                              <th className="py-3 px-4">Village</th>
                              <th className="py-3 px-4">Ornaments</th>
                              <th className="py-3 px-4 text-right">Loan Value</th>
                              <th className="py-3 px-4 text-center">Actions</th>
                            </tr>
                          </thead>
                          <tbody className="divide-y divide-slate-100 text-neutral-700 bg-white">
                            {girviRecords
                              .filter(r => r.status === "released")
                              .filter((rec) => {
                                const q = girviHistorySearchQuery.toLowerCase();
                                const nameM = (rec.name || "").toLowerCase().includes(q);
                                const parentM = (rec.sonOf || "").toLowerCase().includes(q);
                                const phoneM = (rec.phone || "").toLowerCase().includes(q);
                                const villageM = (rec.village || "").toLowerCase().includes(q);
                                const ornamentsM = rec.ornaments && rec.ornaments.some(o => (o.name || "").toLowerCase().includes(q));
                                return nameM || parentM || phoneM || villageM || ornamentsM;
                              })
                              .map((rec, index) => (
                                <tr key={rec.id} className="hover:bg-slate-50/50 border-b border-slate-100 transition-colors">
                                  <td className="py-3 px-4 text-center font-mono text-neutral-400">
                                    {index + 1}
                                  </td>
                                  <td className="py-3 px-4">
                                    <div className="font-bold text-neutral-900 text-sm">{rec.name}</div>
                                    <div className="text-[10px] text-neutral-500">S/O: {rec.sonOf}</div>
                                  </td>
                                  <td className="py-3 px-4 text-neutral-600">
                                    {rec.village}
                                  </td>
                                  <td className="py-3 px-4">
                                    <div className="flex flex-wrap gap-1">
                                      {rec.ornaments && rec.ornaments.map((o, i) => (
                                        <span key={i} className="text-[10px] text-neutral-700 bg-slate-100 px-1.5 py-0.5 rounded border border-slate-200 font-bold">
                                          {o.name} ({o.weight})
                                        </span>
                                      ))}
                                    </div>
                                    <div className="text-[9px] text-neutral-500 font-mono mt-1">Closed on: {rec.releasedDate}</div>
                                  </td>
                                  <td className="py-3 px-4 text-right font-mono text-neutral-900 font-bold">
                                    ₹{(parseFloat(rec.amount || "0") || 0).toLocaleString()}
                                  </td>
                                  <td className="py-3 px-4 text-center">
                                    <div className="flex items-center justify-center gap-2">
                                      <button
                                        onClick={() => setSelectedGirvi(rec)}
                                        className="p-1 text-neutral-500 hover:text-blue-600 transition-colors"
                                        title="View historical log details"
                                      >
                                        <Eye className="w-3.5 h-3.5" />
                                      </button>
                                      <button
                                        onClick={() => handleDeleteGirviHistory(rec.id)}
                                        className="p-1 text-red-500 hover:text-red-700 transition-colors"
                                        title="Permanently Delete History Entry"
                                      >
                                        <Trash2 className="w-3.5 h-3.5" />
                                      </button>
                                    </div>
                                  </td>
                                </tr>
                              ))}
                            {girviRecords.filter(r => r.status === "released").filter((rec) => {
                              const q = girviHistorySearchQuery.toLowerCase();
                              const nameM = (rec.name || "").toLowerCase().includes(q);
                              const parentM = (rec.sonOf || "").toLowerCase().includes(q);
                              const phoneM = (rec.phone || "").toLowerCase().includes(q);
                              const villageM = (rec.village || "").toLowerCase().includes(q);
                              const ornamentsM = rec.ornaments && rec.ornaments.some(o => (o.name || "").toLowerCase().includes(q));
                              return nameM || parentM || phoneM || villageM || ornamentsM;
                            }).length === 0 && (
                              <tr>
                                <td colSpan={6} className="py-8 px-4 text-center text-neutral-600">
                                  No closed history archives found matching search.
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
            </div>
          )}

          {/* TAB 7: STANDALONE CALCULATOR */}
          {activeTab === "calculator" && (
            <div className="space-y-6 animate-fade-in font-sans">
              <div>
                <span className="font-sans text-[10px] text-amber-600 tracking-[0.3em] uppercase font-bold block">
                  Utility Tools
                </span>
                <h2 className="font-serif text-3xl font-bold text-neutral-850 mt-1">
                  Groww-Style Interest Calculator (ब्याज कैलकुलेटर)
                </h2>
                <p className="text-xs text-neutral-500 mt-1">
                  Perform instant simple or compound interest calculations for loans, gold pledges, or customer credit accounts.
                </p>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Left side inputs */}
                <div className="bg-white border border-slate-200 rounded-lg p-6 shadow-sm space-y-4 lg:col-span-1">
                  <h3 className="font-serif text-lg font-bold text-neutral-850 border-b border-slate-100 pb-3">Calculator Inputs</h3>

                  <div>
                    <label className="block text-[10px] uppercase tracking-widest text-neutral-600 font-bold mb-1.5">
                      Principal Loan Amount (₹) *
                    </label>
                    <input
                      type="number"
                      value={calcPrincipal}
                      onChange={(e) => setCalcPrincipal(e.target.value)}
                      placeholder="e.g. 100000"
                      className="w-full bg-slate-50 border border-slate-300 focus:border-amber-500 focus:ring-1 focus:ring-amber-500 outline-none py-2 px-3 text-neutral-900 text-sm font-mono font-bold rounded-md transition-all"
                    />
                  </div>

                  <div>
                    <label className="block text-[10px] uppercase tracking-widest text-neutral-600 font-bold mb-1.5">
                      Interest Rate (% rate) *
                    </label>
                    <input
                      type="number"
                      step="0.01"
                      value={calcRate}
                      onChange={(e) => setCalcRate(e.target.value)}
                      placeholder="e.g. 2"
                      className="w-full bg-slate-50 border border-slate-300 focus:border-amber-500 focus:ring-1 focus:ring-amber-500 outline-none py-2 px-3 text-neutral-900 text-sm font-mono font-bold rounded-md transition-all"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-[10px] uppercase tracking-widest text-neutral-600 font-bold mb-1.5">
                        Rate Period
                      </label>
                      <select
                        value={calcPeriod}
                        onChange={(e) => setCalcPeriod(e.target.value as "monthly" | "yearly")}
                        className="w-full bg-slate-50 border border-slate-300 focus:border-amber-500 focus:ring-1 focus:ring-amber-500 outline-none py-2 px-3 text-neutral-900 text-sm rounded-md transition-all"
                      >
                        <option value="monthly">Monthly (% प्रति माह)</option>
                        <option value="yearly">Yearly (% प्रति वर्ष)</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-[10px] uppercase tracking-widest text-neutral-600 font-bold mb-1.5">
                        Interest Type
                      </label>
                      <select
                        value={calcType}
                        onChange={(e) => setCalcType(e.target.value as "simple" | "compound")}
                        className="w-full bg-slate-50 border border-slate-300 focus:border-amber-500 focus:ring-1 focus:ring-amber-500 outline-none py-2 px-3 text-neutral-900 text-sm rounded-md transition-all"
                      >
                        <option value="simple">Simple (साधारण)</option>
                        <option value="compound">Compound (चक्रवृद्धि)</option>
                      </select>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-[10px] uppercase tracking-widest text-neutral-600 font-bold mb-1.5">
                        From Date
                      </label>
                      <input
                        type="date"
                        value={calcFrom}
                        onChange={(e) => setCalcFrom(e.target.value)}
                        className="w-full bg-slate-50 border border-slate-300 focus:border-amber-500 focus:ring-1 focus:ring-amber-500 outline-none py-2 px-3 text-neutral-900 text-sm rounded-md transition-all"
                      />
                    </div>
                    <div>
                      <label className="block text-[10px] uppercase tracking-widest text-neutral-600 font-bold mb-1.5">
                        To Date
                      </label>
                      <input
                        type="date"
                        value={calcTo}
                        onChange={(e) => setCalcTo(e.target.value)}
                        className="w-full bg-slate-50 border border-slate-300 focus:border-amber-500 focus:ring-1 focus:ring-amber-500 outline-none py-2 px-3 text-neutral-900 text-sm rounded-md transition-all"
                      />
                    </div>
                  </div>
                </div>

                {/* Right side outputs display */}
                <div className="bg-white border border-slate-200 rounded-lg p-6 shadow-sm flex flex-col justify-between lg:col-span-2 space-y-6">
                  <div>
                    <h3 className="font-serif text-lg font-bold text-neutral-850 border-b border-slate-100 pb-3">Calculation Breakdown</h3>

                    {/* Metric Grid */}
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-6">
                      <div className="bg-slate-50 p-4 rounded-md text-center border border-slate-100">
                        <span className="text-[9px] uppercase tracking-wider text-neutral-500 font-bold block">Principal</span>
                        <span className="font-serif text-lg text-neutral-900 font-extrabold block mt-1">
                          ₹{parseInt(calcPrincipal || "0").toLocaleString()}
                        </span>
                      </div>
                      <div className="bg-amber-50 p-4 rounded-md text-center border border-amber-100">
                        <span className="text-[9px] uppercase tracking-wider text-amber-800 font-bold block">Total Interest</span>
                        <span className="font-serif text-lg text-amber-700 font-extrabold block mt-1">
                          ₹{(() => {
                            const res = calculateStandaloneInterest();
                            return res.interest.toLocaleString();
                          })()}
                        </span>
                      </div>
                      <div className="bg-green-50 p-4 rounded-md text-center border border-green-100 col-span-2 md:col-span-2">
                        <span className="text-[9px] uppercase tracking-wider text-green-800 font-bold block">Maturity Amount</span>
                        <span className="font-serif text-xl text-green-700 font-black block mt-1">
                          ₹{(() => {
                            const res = calculateStandaloneInterest();
                            return res.total.toLocaleString();
                          })()}
                        </span>
                      </div>
                    </div>

                    {/* Time elapsed box */}
                    <div className="bg-slate-50 border border-slate-200/80 p-4 rounded-md mt-6 flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <Clock className="w-4 h-4 text-amber-500" />
                        <span className="text-xs text-neutral-600 font-medium">Time Period Elapsed:</span>
                      </div>
                      <span className="font-serif text-sm font-bold text-neutral-900">
                        {(() => {
                          const res = calculateStandaloneInterest();
                          return `${res.yearsPart} Years, ${res.monthsPart} Months, ${res.daysPart} Days (${res.days} Days)`;
                        })()}
                      </span>
                    </div>

                    {/* Groww-style Split Progress Bar */}
                    <div className="mt-8">
                      <span className="text-[10px] uppercase tracking-wider text-neutral-500 font-bold block mb-3">Value Share split</span>
                      <div className="h-6 w-full rounded-full bg-slate-100 overflow-hidden flex shadow-inner border border-slate-200">
                        {/* Principal Share */}
                        <div
                          style={{
                            width: `${Math.max(5, (parseInt(calcPrincipal || "0") / ((() => {
                              const res = calculateStandaloneInterest();
                              return res.total || 1;
                            })())) * 100)}%`
                          }}
                          className="bg-amber-600 h-full flex items-center justify-center text-[10px] text-white font-bold font-mono transition-all"
                        >
                          {Math.round((parseInt(calcPrincipal || "0") / ((() => {
                            const res = calculateStandaloneInterest();
                            return res.total || 1;
                          })())) * 100)}%
                        </div>
                        {/* Interest Share */}
                        <div
                          style={{
                            width: `${Math.min(95, (((() => {
                              const res = calculateStandaloneInterest();
                              return res.interest;
                            })()) / ((() => {
                              const res = calculateStandaloneInterest();
                              return res.total || 1;
                            })())) * 100)}%`
                          }}
                          className="bg-amber-400 h-full flex items-center justify-center text-[10px] text-neutral-950 font-bold font-mono transition-all"
                        >
                          {Math.round((((() => {
                            const res = calculateStandaloneInterest();
                            return res.interest;
                          })()) / ((() => {
                            const res = calculateStandaloneInterest();
                            return res.total || 1;
                          })())) * 100)}%
                        </div>
                      </div>

                      {/* Bar legends */}
                      <div className="flex gap-6 mt-4 text-[10px] font-sans font-bold uppercase tracking-wider text-neutral-500">
                        <div className="flex items-center gap-1.5">
                          <span className="w-3 h-3 bg-amber-600 rounded-sm"></span>
                          <span>Principal Loan Amount (₹{parseInt(calcPrincipal || "0").toLocaleString()})</span>
                        </div>
                        <div className="flex items-center gap-1.5">
                          <span className="w-3 h-3 bg-amber-400 rounded-sm"></span>
                          <span>Interest Earned (₹{(() => {
                            const res = calculateStandaloneInterest();
                            return res.interest.toLocaleString();
                          })()})</span>
                        </div>
                      </div>
                    </div>
                  </div>

                  <p className="text-[10px] text-neutral-400 italic pt-4 border-t border-slate-100">
                    * Groww Calculator computes interest daily where 1 year is treated as 365 days and months are averages (30.43 days). Compound interest compounds {calcPeriod === "monthly" ? "monthly" : "yearly"}.
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* Combined Customer Profile & Family Directory Sheet Modal */}
          {selectedCustomerProfile && (() => {
            const [profileName, profilePhone] = selectedCustomerProfile.split("_");
            const customerUdhaar = udhaarRecords.filter(r => (r.name || "").trim().toLowerCase() === profileName && (r.phone || "").trim() === profilePhone);
            const customerGirvi = girviRecords.filter(r => (r.name || "").trim().toLowerCase() === profileName && (r.phone || "").trim() === profilePhone);
            
            const mainRecord = customerUdhaar[0] || customerGirvi[0];
            if (!mainRecord) return null;

            // Summary Calculations
            const totalUdhaarAmount = customerUdhaar.reduce((sum, r) => sum + (parseFloat(r.amount || "0") || 0), 0);
            const totalUdhaarPaid = customerUdhaar.reduce((sum, r) => sum + (parseFloat(r.paid || "0") || 0), 0);
            const totalUdhaarDues = customerUdhaar.reduce((sum, r) => sum + (parseFloat(r.dues || "0") || 0), 0);
            
            const activeGirvi = customerGirvi.filter(g => g.status === "active");
            const totalGirviLoan = activeGirvi.reduce((sum, r) => sum + (parseFloat(r.amount || "0") || 0), 0);
            const totalGirviInterest = activeGirvi.reduce((sum, r) => sum + (calculateGirviInterest(r).interest || 0), 0);
            
            const grandTotalOutstanding = totalUdhaarDues + totalGirviLoan + totalGirviInterest;

            // Family Members Records
            const familyGroupId = mainRecord.familyGroupId;
            const familyUdhaar = familyGroupId ? udhaarRecords.filter(r => r.familyGroupId === familyGroupId && ((r.name || "").trim().toLowerCase() !== profileName || (r.phone || "").trim() !== profilePhone)) : [];
            const familyGirvi = familyGroupId ? girviRecords.filter(r => r.familyGroupId === familyGroupId && ((r.name || "").trim().toLowerCase() !== profileName || (r.phone || "").trim() !== profilePhone)) : [];

            return (
              <div className="fixed inset-0 bg-black/85 backdrop-blur-md flex items-center justify-center p-4 z-50 animate-fade-in font-sans overflow-y-auto">
                <div className="bg-white border border-slate-200 rounded-lg max-w-5xl w-full overflow-hidden shadow-2xl flex flex-col max-h-[90vh]">
                  {/* Header */}
                  <div className="bg-slate-50 px-6 py-4 border-b border-slate-200 flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <UserCheck className="w-5 h-5 text-amber-650 font-bold" />
                      <h3 className="text-neutral-900 text-sm font-serif font-bold tracking-wide uppercase">
                        Combined Customer Profile Directory
                      </h3>
                    </div>
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => window.print()}
                        className="text-neutral-600 hover:text-neutral-900 text-xs font-bold font-sans uppercase tracking-wider bg-white border border-slate-200 hover:border-slate-350 px-3 py-1.5 rounded transition-all flex items-center gap-1 shadow-sm cursor-pointer"
                      >
                        <Printer className="w-3.5 h-3.5" /> Print Statement
                      </button>
                      <button
                        onClick={() => setSelectedCustomerProfile(null)}
                        className="text-neutral-600 hover:text-neutral-900 text-xs font-bold font-sans uppercase tracking-wider bg-white border border-slate-200 hover:border-slate-350 px-3 py-1.5 rounded transition-all shadow-sm cursor-pointer"
                      >
                        Close Profile
                      </button>
                    </div>
                  </div>

                  {/* Body Scrollable */}
                  <div className="p-6 overflow-y-auto space-y-6 text-xs text-neutral-850 printable-customer-statement">
                    {/* Customer Info Card */}
                    <div className="bg-slate-50 p-5 rounded-lg border border-slate-200 grid grid-cols-1 md:grid-cols-4 gap-6">
                      <div>
                        <span className="text-[9px] uppercase tracking-wider text-neutral-500 font-bold block mb-1">Customer Name</span>
                        <span className="font-serif text-lg text-neutral-950 font-bold">{mainRecord.name}</span>
                      </div>
                      <div>
                        <span className="text-[9px] uppercase tracking-wider text-neutral-500 font-bold block mb-1">Father / Spouse S/O</span>
                        <span className="font-sans text-sm text-neutral-800 font-semibold">{mainRecord.sonOf || "N/A"}</span>
                      </div>
                      <div>
                        <span className="text-[9px] uppercase tracking-wider text-neutral-500 font-bold block mb-1">Mobile / Phone</span>
                        <span className="font-mono text-sm text-neutral-800 font-bold">{mainRecord.phone || "N/A"}</span>
                      </div>
                      <div>
                        <span className="text-[9px] uppercase tracking-wider text-neutral-500 font-bold block mb-1">Aadhaar Number</span>
                        <span className="font-mono text-sm text-neutral-800 font-bold">{mainRecord.aadhaar || "Not recorded"}</span>
                      </div>
                      <div className="col-span-1 md:col-span-2">
                        <span className="text-[9px] uppercase tracking-wider text-neutral-500 font-bold block mb-1">Village Address</span>
                        <span className="font-sans text-sm text-neutral-800 font-medium flex items-center gap-1">
                          <MapPin className="w-3.5 h-3.5 text-amber-600" /> {mainRecord.village || "N/A"}
                        </span>
                      </div>
                      <div className="col-span-1 md:col-span-2">
                        <span className="text-[9px] uppercase tracking-wider text-neutral-500 font-bold block mb-1">Family Group Code</span>
                        <span className="font-mono text-xs text-neutral-700 bg-amber-50 px-2 py-0.5 rounded border border-amber-200">
                          {mainRecord.familyGroupId || "No family link group registered"}
                        </span>
                      </div>
                    </div>

                    {/* Financial Summary Cards */}
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                      <div className="bg-slate-50 border border-slate-200 p-4 rounded-md text-center">
                        <span className="text-[9px] uppercase tracking-wider text-neutral-500 font-bold block">Total Udhaari (Dues)</span>
                        <span className="font-serif text-lg text-neutral-900 font-black block mt-1">₹{totalUdhaarDues.toLocaleString()}</span>
                      </div>
                      <div className="bg-slate-50 border border-slate-200 p-4 rounded-md text-center">
                        <span className="text-[9px] uppercase tracking-wider text-neutral-500 font-bold block">Total Girvi (Principal)</span>
                        <span className="font-serif text-lg text-neutral-900 font-black block mt-1">₹{totalGirviLoan.toLocaleString()}</span>
                      </div>
                      <div className="bg-slate-50 border border-slate-200 p-4 rounded-md text-center">
                        <span className="text-[9px] uppercase tracking-wider text-neutral-500 font-bold block">Live Pledged Interest</span>
                        <span className="font-serif text-lg text-amber-700 font-black block mt-1">₹{totalGirviInterest.toLocaleString()}</span>
                      </div>
                      <div className="bg-amber-50 border border-amber-200 p-4 rounded-md text-center">
                        <span className="text-[9px] uppercase tracking-wider text-amber-800 font-bold block">Total Outstanding Balance</span>
                        <span className="font-serif text-lg text-amber-850 font-extrabold block mt-1">₹{grandTotalOutstanding.toLocaleString()}</span>
                      </div>
                    </div>

                    {/* Udhaari Transactions Ledger */}
                    <div className="space-y-3">
                      <h4 className="font-serif text-base font-bold text-neutral-900 border-b border-slate-100 pb-2 flex items-center gap-1.5">
                        <BookOpen className="w-4 h-4 text-amber-600" /> Udhaari notebook Ledger Records
                      </h4>
                      {customerUdhaar.length === 0 ? (
                        <div className="text-center py-4 bg-slate-50 text-neutral-500 border border-slate-200 rounded">
                          No store credit records found for this customer.
                        </div>
                      ) : (
                        <div className="bg-white border border-slate-200 rounded overflow-hidden">
                          <table className="w-full text-left text-xs border-collapse">
                            <thead>
                              <tr className="bg-slate-50 border-b border-slate-200 text-neutral-600 uppercase font-bold tracking-wider text-[9px]">
                                <th className="py-2.5 px-3">Date</th>
                                <th className="py-2.5 px-3">Purchase details</th>
                                <th className="py-2.5 px-3 text-right">Bill Value</th>
                                <th className="py-2.5 px-3 text-right">Discount</th>
                                <th className="py-2.5 px-3 text-right">Paid</th>
                                <th className="py-2.5 px-3 text-right">Dues Outstanding</th>
                              </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-100 font-sans">
                              {customerUdhaar.map((r, idx) => (
                                <tr key={idx} className="hover:bg-slate-50/50">
                                  <td className="py-2 px-3 font-mono">{r.date}</td>
                                  <td className="py-2 px-3">
                                    <div className="font-bold text-neutral-800">{r.ornament}</div>
                                    <div className="text-[10px] text-neutral-500">{r.weight}</div>
                                  </td>
                                  <td className="py-2 px-3 text-right font-mono">₹{parseFloat(r.amount || "0").toLocaleString()}</td>
                                  <td className="py-2 px-3 text-right font-mono text-neutral-500">₹{parseFloat(r.discount || "0").toLocaleString()}</td>
                                  <td className="py-2 px-3 text-right font-mono text-green-700">₹{parseFloat(r.paid || "0").toLocaleString()}</td>
                                  <td className="py-2 px-3 text-right font-mono font-bold text-red-600">₹{parseFloat(r.dues || "0").toLocaleString()}</td>
                                </tr>
                              ))}
                            </tbody>
                          </table>
                        </div>
                      )}
                    </div>

                    {/* Girvi Pledges Ledger */}
                    <div className="space-y-3">
                      <h4 className="font-serif text-base font-bold text-neutral-900 border-b border-slate-100 pb-2 flex items-center gap-1.5">
                        <TrendingUp className="w-4 h-4 text-amber-600" /> Girvi Gold/Silver Pledge Records
                      </h4>
                      {customerGirvi.length === 0 ? (
                        <div className="text-center py-4 bg-slate-50 text-neutral-500 border border-slate-200 rounded">
                          No gold/silver pledge entries found for this customer.
                        </div>
                      ) : (
                        <div className="bg-white border border-slate-200 rounded overflow-hidden">
                          <table className="w-full text-left text-xs border-collapse">
                            <thead>
                              <tr className="bg-slate-50 border-b border-slate-200 text-neutral-600 uppercase font-bold tracking-wider text-[9px]">
                                <th className="py-2.5 px-3">Date</th>
                                <th className="py-2.5 px-3">Ornaments</th>
                                <th className="py-2.5 px-3 text-right">Loan Value</th>
                                <th className="py-2.5 px-3 text-center">Rate</th>
                                <th className="py-2.5 px-3 text-right">Live Interest</th>
                                <th className="py-2.5 px-3 text-center">Status</th>
                              </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-100 font-sans">
                              {customerGirvi.map((r, idx) => {
                                const isClosed = r.status === "released";
                                const calc = calculateGirviInterest(r, undefined, isClosed ? r.releasedDate : undefined);
                                return (
                                  <tr key={idx} className="hover:bg-slate-50/50">
                                    <td className="py-2 px-3 font-mono">
                                      {r.date}
                                      {isClosed && <div className="text-[8px] text-neutral-500 mt-0.5">Closed: {r.releasedDate}</div>}
                                    </td>
                                    <td className="py-2 px-3">
                                      <div className="flex flex-wrap gap-1">
                                        {r.ornaments && r.ornaments.map((o, oidx) => (
                                          <span key={oidx} className="bg-slate-100 text-neutral-700 px-1.5 py-0.5 rounded font-bold border border-slate-200 text-[9px]">
                                            {o.name} ({o.weight})
                                          </span>
                                        ))}
                                      </div>
                                    </td>
                                    <td className="py-2 px-3 text-right font-mono font-bold">₹{parseFloat(r.amount || "0").toLocaleString()}</td>
                                    <td className="py-2 px-3 text-center font-mono">{r.interestRate}% ({r.interestPeriod === "monthly" ? "pm" : "py"})</td>
                                    <td className="py-2 px-3 text-right font-mono text-amber-700 font-bold">₹{calc.interest.toLocaleString()}</td>
                                    <td className="py-2 px-3 text-center">
                                      <span className={`px-2 py-0.5 rounded text-[8px] font-bold uppercase tracking-wider ${
                                        isClosed ? "bg-slate-100 text-neutral-550 border border-slate-200" : "bg-green-50 text-green-700 border border-green-200"
                                      }`}>
                                        {r.status}
                                      </span>
                                    </td>
                                  </tr>
                                );
                              })}
                            </tbody>
                          </table>
                        </div>
                      )}
                    </div>

                    {/* Family Members Records Section */}
                    {familyGroupId && (familyUdhaar.length > 0 || familyGirvi.length > 0) && (
                      <div className="space-y-3 bg-amber-50/20 border border-amber-500/10 p-5 rounded-lg">
                        <h4 className="font-serif text-base font-bold text-amber-800 flex items-center gap-1.5">
                          <UserCheck className="w-4 h-4 text-amber-700" /> Linked Family Members Records (पारिवारिक खाता मिलान)
                        </h4>
                        <div className="bg-white border border-slate-200 rounded overflow-hidden">
                          <table className="w-full text-left text-xs border-collapse">
                            <thead>
                              <tr className="bg-slate-50 border-b border-slate-200 text-neutral-600 uppercase font-bold tracking-wider text-[9px]">
                                <th className="py-2.5 px-3">Family Member</th>
                                <th className="py-2.5 px-3">Relation</th>
                                <th className="py-2.5 px-3">Account Type</th>
                                <th className="py-2.5 px-3">Details</th>
                                <th className="py-2.5 px-3 text-right">Dues / Loan</th>
                              </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-100 font-sans">
                              {familyUdhaar.map((r, idx) => (
                                <tr key={`fud_${idx}`} className="hover:bg-slate-50/50">
                                  <td className="py-2 px-3">
                                    <div className="font-bold text-neutral-800">{r.name}</div>
                                    <div className="text-[9px] text-neutral-500">Phone: {r.phone}</div>
                                  </td>
                                  <td className="py-2 px-3">
                                    <span className="bg-slate-100 text-neutral-600 border border-slate-200 px-1.5 py-0.5 rounded font-bold uppercase text-[9px]">
                                      {r.familyRelationship || "Self"}
                                    </span>
                                  </td>
                                  <td className="py-2 px-3 text-red-650 font-bold uppercase tracking-wider text-[9px]">Udhaar Ledger</td>
                                  <td className="py-2 px-3">{r.ornament} ({r.weight})</td>
                                  <td className="py-2 px-3 text-right font-mono font-bold text-red-600">₹{parseFloat(r.dues || "0").toLocaleString()}</td>
                                </tr>
                              ))}
                              {familyGirvi.map((r, idx) => (
                                <tr key={`fgir_${idx}`} className="hover:bg-slate-50/50">
                                  <td className="py-2 px-3">
                                    <div className="font-bold text-neutral-800">{r.name}</div>
                                    <div className="text-[9px] text-neutral-500">Phone: {r.phone}</div>
                                  </td>
                                  <td className="py-2 px-3">
                                    <span className="bg-slate-100 text-neutral-600 border border-slate-200 px-1.5 py-0.5 rounded font-bold uppercase text-[9px]">
                                      {r.familyRelationship || "Self"}
                                    </span>
                                  </td>
                                  <td className="py-2 px-3 text-green-700 font-bold uppercase tracking-wider text-[9px]">Girvi Pledge</td>
                                  <td className="py-2 px-3">
                                    {r.ornaments && r.ornaments.map(o => `${o.name} (${o.weight})`).join(", ")}
                                  </td>
                                  <td className="py-2 px-3 text-right font-mono font-bold text-neutral-900">₹{parseFloat(r.amount || "0").toLocaleString()}</td>
                                </tr>
                              ))}
                            </tbody>
                          </table>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            );
          })()}

          {/* Edit Girvi Record & Manage Principal Additions Modal */}
          {selectedGirviForEdit && (() => {
            const handleSaveGirviEdit = async (e: React.FormEvent) => {
              e.preventDefault();
              setIsSaving(true);
              try {
                const res = await fetch(`/api/girvi?id=${selectedGirviForEdit.id}`, {
                  method: "PUT",
                  headers: { "Content-Type": "application/json" },
                  body: JSON.stringify(selectedGirviForEdit)
                });
                if (!res.ok) throw new Error("Failed to save Girvi modifications.");
                
                showToast("✨ Girvi record modified successfully!", "success");
                setSelectedGirviForEdit(null);
                await loadDashboardData();
              } catch (err: any) {
                showToast(`❌ Error: ${err.message || "Something went wrong"}`, "error");
              } finally {
                setIsSaving(false);
              }
            };

            const handleAddAddition = () => {
              const amount = newAddAmount.trim();
              const date = newAddDate.trim() || new Date().toISOString().split("T")[0];
              if (!amount || !date) {
                showToast("⚠️ Please enter both addition amount and date!", "error");
                return;
              }
              const additions = selectedGirviForEdit.amountAdditions || [];
              const updatedAdditions = [
                ...additions,
                { id: "add_" + Date.now(), amount, date }
              ];
              setSelectedGirviForEdit({
                ...selectedGirviForEdit,
                amountAdditions: updatedAdditions
              });
              setNewAddAmount("");
              setNewAddDate(new Date().toISOString().split("T")[0]);
            };

            const handleRemoveAddition = (id: string) => {
              const additions = selectedGirviForEdit.amountAdditions || [];
              setSelectedGirviForEdit({
                ...selectedGirviForEdit,
                amountAdditions: additions.filter(a => a.id !== id)
              });
            };

            return (
              <div className="fixed inset-0 bg-black/85 backdrop-blur-md flex items-center justify-center p-4 z-50 animate-fade-in font-sans overflow-y-auto">
                <div className="bg-white border border-slate-200 rounded-lg max-w-2xl w-full overflow-hidden shadow-2xl flex flex-col max-h-[90vh]">
                  {/* Header */}
                  <div className="bg-slate-50 px-6 py-4 border-b border-slate-200 flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Settings className="w-5 h-5 text-amber-600 animate-spin-slow" />
                      <h3 className="text-neutral-900 text-sm font-serif font-bold tracking-wide uppercase">
                        Modify Gold Pledge (Girvi) & Principal Top-ups
                      </h3>
                    </div>
                    <button
                      onClick={() => setSelectedGirviForEdit(null)}
                      className="text-neutral-600 hover:text-neutral-900 text-xs font-bold font-sans uppercase tracking-wider bg-white border border-slate-200 hover:border-slate-350 px-3 py-1.5 rounded transition-all shadow-sm cursor-pointer"
                    >
                      Cancel
                    </button>
                  </div>

                  <form onSubmit={handleSaveGirviEdit} className="p-6 overflow-y-auto space-y-6 text-xs text-neutral-850">
                    {/* Primary Demographics */}
                    <div className="space-y-3">
                      <h4 className="font-serif text-sm font-bold text-neutral-900 border-b border-slate-100 pb-1.5 uppercase tracking-wider text-amber-800">1. Customer Demographics</h4>
                      <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                        <div>
                          <label className="block text-[9px] uppercase tracking-wider text-neutral-500 font-bold mb-1">Customer Name</label>
                          <input
                            type="text"
                            value={selectedGirviForEdit.name}
                            onChange={(e) => setSelectedGirviForEdit({ ...selectedGirviForEdit, name: e.target.value })}
                            className="w-full bg-slate-50 border border-slate-300 focus:border-amber-500 focus:ring-1 focus:ring-amber-500 py-1.5 px-2.5 text-neutral-900 rounded font-medium"
                          />
                        </div>
                        <div>
                          <label className="block text-[9px] uppercase tracking-wider text-neutral-500 font-bold mb-1">Father / Spouse S/O</label>
                          <input
                            type="text"
                            value={selectedGirviForEdit.sonOf}
                            onChange={(e) => setSelectedGirviForEdit({ ...selectedGirviForEdit, sonOf: e.target.value })}
                            className="w-full bg-slate-50 border border-slate-300 focus:border-amber-500 focus:ring-1 focus:ring-amber-500 py-1.5 px-2.5 text-neutral-900 rounded font-medium"
                          />
                        </div>
                        <div>
                          <label className="block text-[9px] uppercase tracking-wider text-neutral-500 font-bold mb-1">Mobile / Phone</label>
                          <input
                            type="text"
                            value={selectedGirviForEdit.phone}
                            onChange={(e) => setSelectedGirviForEdit({ ...selectedGirviForEdit, phone: e.target.value })}
                            className="w-full bg-slate-50 border border-slate-300 focus:border-amber-500 focus:ring-1 focus:ring-amber-500 py-1.5 px-2.5 text-neutral-900 rounded font-mono font-medium"
                          />
                        </div>
                        <div>
                          <label className="block text-[9px] uppercase tracking-wider text-neutral-500 font-bold mb-1">Village Address</label>
                          <input
                            type="text"
                            value={selectedGirviForEdit.village}
                            onChange={(e) => setSelectedGirviForEdit({ ...selectedGirviForEdit, village: e.target.value })}
                            className="w-full bg-slate-50 border border-slate-300 focus:border-amber-500 focus:ring-1 focus:ring-amber-500 py-1.5 px-2.5 text-neutral-900 rounded font-medium"
                          />
                        </div>
                        <div>
                          <label className="block text-[9px] uppercase tracking-wider text-neutral-500 font-bold mb-1">Aadhaar Card No</label>
                          <input
                            type="text"
                            value={selectedGirviForEdit.aadhaar || ""}
                            onChange={(e) => setSelectedGirviForEdit({ ...selectedGirviForEdit, aadhaar: e.target.value })}
                            className="w-full bg-slate-50 border border-slate-300 focus:border-amber-500 focus:ring-1 focus:ring-amber-500 py-1.5 px-2.5 text-neutral-900 rounded font-mono font-medium"
                          />
                        </div>
                        <div>
                          <label className="block text-[9px] uppercase tracking-wider text-neutral-500 font-bold mb-1">Pledge Date</label>
                          <input
                            type="date"
                            value={selectedGirviForEdit.date}
                            onChange={(e) => setSelectedGirviForEdit({ ...selectedGirviForEdit, date: e.target.value })}
                            className="w-full bg-slate-50 border border-slate-300 focus:border-amber-500 focus:ring-1 focus:ring-amber-500 py-1.5 px-2.5 text-neutral-900 rounded font-medium"
                          />
                        </div>
                      </div>
                    </div>

                    {/* Financial Terms */}
                    <div className="space-y-3">
                      <h4 className="font-serif text-sm font-bold text-neutral-900 border-b border-slate-100 pb-1.5 uppercase tracking-wider text-amber-800">2. Financial Loan Terms</h4>
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                        <div>
                          <label className="block text-[9px] uppercase tracking-wider text-neutral-500 font-bold mb-1">Base Loan Value (₹)</label>
                          <input
                            type="number"
                            value={selectedGirviForEdit.amount}
                            onChange={(e) => setSelectedGirviForEdit({ ...selectedGirviForEdit, amount: e.target.value })}
                            className="w-full bg-slate-50 border border-slate-300 focus:border-amber-500 focus:ring-1 focus:ring-amber-500 py-1.5 px-2.5 text-neutral-900 rounded font-mono font-bold"
                          />
                        </div>
                        <div>
                          <label className="block text-[9px] uppercase tracking-wider text-neutral-500 font-bold mb-1">Interest Rate (%)</label>
                          <input
                            type="number"
                            step="0.01"
                            value={selectedGirviForEdit.interestRate}
                            onChange={(e) => setSelectedGirviForEdit({ ...selectedGirviForEdit, interestRate: e.target.value })}
                            className="w-full bg-slate-50 border border-slate-300 focus:border-amber-500 focus:ring-1 focus:ring-amber-500 py-1.5 px-2.5 text-neutral-900 rounded font-mono font-bold"
                          />
                        </div>
                        <div>
                          <label className="block text-[9px] uppercase tracking-wider text-neutral-500 font-bold mb-1">Rate Period</label>
                          <select
                            value={selectedGirviForEdit.interestPeriod}
                            onChange={(e) => setSelectedGirviForEdit({ ...selectedGirviForEdit, interestPeriod: e.target.value as any })}
                            className="w-full bg-slate-50 border border-slate-300 focus:border-amber-500 focus:ring-1 focus:ring-amber-500 py-1.5 px-2.5 text-neutral-900 rounded"
                          >
                            <option value="monthly">Monthly (% per month)</option>
                            <option value="yearly">Yearly (% per year)</option>
                          </select>
                        </div>
                        <div>
                          <label className="block text-[9px] uppercase tracking-wider text-neutral-500 font-bold mb-1">Interest Type</label>
                          <select
                            value={selectedGirviForEdit.interestType}
                            onChange={(e) => setSelectedGirviForEdit({ ...selectedGirviForEdit, interestType: e.target.value as any })}
                            className="w-full bg-slate-50 border border-slate-300 focus:border-amber-500 focus:ring-1 focus:ring-amber-500 py-1.5 px-2.5 text-neutral-900 rounded"
                          >
                            <option value="simple">Simple Interest</option>
                            <option value="compound">Compound Interest</option>
                          </select>
                        </div>
                      </div>
                    </div>

                    {/* Principal Additions Top-up Management */}
                    <div className="space-y-4 bg-slate-50 p-4 rounded-lg border border-slate-200">
                      <div>
                        <h4 className="font-serif text-sm font-bold text-neutral-900 uppercase tracking-wider text-amber-800">3. Principal Top-ups & Additions</h4>
                        <p className="text-[10px] text-neutral-500 mt-0.5">Top-up the loan principal at later dates. Interest calculates dynamically on addition dates.</p>
                      </div>

                      {/* Add Addition Inline Form */}
                      <div className="flex items-end gap-3 bg-white p-3.5 rounded border border-slate-200 shadow-sm">
                        <div className="flex-1">
                          <label className="block text-[9px] uppercase tracking-wider text-neutral-500 font-bold mb-1">Addition Principal (₹)</label>
                          <input
                            type="number"
                            value={newAddAmount}
                            onChange={(e) => setNewAddAmount(e.target.value)}
                            placeholder="e.g. 10000"
                            className="w-full bg-slate-50 border border-slate-300 focus:border-amber-500 focus:ring-1 focus:ring-amber-500 py-1.5 px-2.5 text-neutral-900 rounded font-mono font-medium"
                          />
                        </div>
                        <div>
                          <label className="block text-[9px] uppercase tracking-wider text-neutral-500 font-bold mb-1">Addition Date</label>
                          <input
                            type="date"
                            value={newAddDate}
                            onChange={(e) => setNewAddDate(e.target.value)}
                            className="w-full bg-slate-50 border border-slate-300 focus:border-amber-500 focus:ring-1 focus:ring-amber-500 py-1.5 px-2.5 text-neutral-900 rounded font-medium"
                          />
                        </div>
                        <button
                          type="button"
                          onClick={handleAddAddition}
                          className="bg-amber-500 hover:bg-amber-600 text-neutral-950 font-bold px-4 py-2 rounded transition-colors shadow-sm cursor-pointer"
                        >
                          Add Top-up
                        </button>
                      </div>

                      {/* List of additions */}
                      {(!selectedGirviForEdit.amountAdditions || selectedGirviForEdit.amountAdditions.length === 0) ? (
                        <div className="text-center py-2.5 text-neutral-550 text-[10px]">
                          No principal additions recorded for this pledge.
                        </div>
                      ) : (
                        <div className="bg-white border border-slate-200 rounded overflow-hidden">
                          <table className="w-full text-left text-xs border-collapse">
                            <thead>
                              <tr className="bg-slate-50 border-b border-slate-200 text-neutral-600 uppercase font-bold tracking-wider text-[9px]">
                                <th className="py-2 px-3">Date Added</th>
                                <th className="py-2 px-3 text-right">Addition Principal Value (₹)</th>
                                <th className="py-2 px-3 text-center">Action</th>
                              </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-100 font-sans">
                              {selectedGirviForEdit.amountAdditions.map((a, idx) => (
                                <tr key={a.id || idx} className="hover:bg-slate-50/50">
                                  <td className="py-1.5 px-3 font-mono">{a.date}</td>
                                  <td className="py-1.5 px-3 text-right font-mono font-bold">₹{parseInt(a.amount || "0").toLocaleString()}</td>
                                  <td className="py-1.5 px-3 text-center">
                                    <button
                                      type="button"
                                      onClick={() => handleRemoveAddition(a.id)}
                                      className="p-1 text-red-500 hover:text-red-700 transition-colors"
                                      title="Remove Addition"
                                    >
                                      <Trash2 className="w-3.5 h-3.5" />
                                    </button>
                                  </td>
                                </tr>
                              ))}
                            </tbody>
                          </table>
                        </div>
                      )}
                    </div>

                    <button
                      type="submit"
                      disabled={isSaving}
                      className="w-full py-3 bg-amber-500 hover:bg-amber-600 text-neutral-950 font-sans text-xs font-bold tracking-widest uppercase transition-colors rounded shadow-md flex items-center justify-center gap-1.5 cursor-pointer disabled:opacity-50"
                    >
                      {isSaving ? (
                        <>Saving Changes...</>
                      ) : (
                        <>Save Gold Pledge Corrections</>
                      )}
                    </button>
                  </form>
                </div>
              </div>
            );
          })()}

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
                                <td className="py-2 px-3 text-white font-medium">{item.name || (item as any).ornament}</td>
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
          {/* Detailed Girvi Record View Modal with Live Interest Calculator */}
          {selectedGirvi && (() => {
            const calc = calculateGirviInterest(selectedGirvi, calcFromDate, calcToDate);
            return (
              <div className="fixed inset-0 bg-black/85 backdrop-blur-md flex items-center justify-center p-4 z-50 animate-fade-in font-sans">
                <div className="bg-neutral-900 border border-amber-500/30 rounded-lg max-w-lg w-full overflow-hidden shadow-2xl flex flex-col max-h-[90vh]">
                  {/* Modal Header */}
                  <div className="bg-neutral-950 px-6 py-4 border-b border-neutral-800 flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Lock className="w-5 h-5 text-amber-500" />
                      <h3 className="text-white text-sm font-serif font-semibold tracking-wide">
                        Detailed Girvi Loan Account & Live Interest
                      </h3>
                    </div>
                    <button
                      onClick={() => setSelectedGirvi(null)}
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
                        <span className="text-white text-sm font-bold block">{selectedGirvi.name}</span>
                      </div>
                      <div>
                        <span className="text-[9px] uppercase tracking-wider text-neutral-500 font-bold block mb-0.5">
                          Parentage (S/O or Husband)
                        </span>
                        <span className="text-neutral-200 font-medium block">{selectedGirvi.sonOf || "N/A"}</span>
                      </div>
                      <div>
                        <span className="text-[9px] uppercase tracking-wider text-neutral-500 font-bold block mb-0.5">
                          Phone Number
                        </span>
                        <span className="text-neutral-200 font-mono block">{selectedGirvi.phone || "N/A"}</span>
                      </div>
                      <div>
                        <span className="text-[9px] uppercase tracking-wider text-neutral-500 font-bold block mb-0.5">
                          Village / Address
                        </span>
                        <span className="text-neutral-200 font-medium block">{selectedGirvi.village}</span>
                      </div>
                    </div>

                    {/* Pledged Ornaments Details */}
                    <div className="space-y-2">
                      <h4 className="text-[9px] uppercase tracking-widest text-[#dfba73] font-extrabold flex items-center gap-1.5">
                        <Package className="w-3.5 h-3.5" /> Pledged Gold/Silver Assets
                      </h4>
                      <div className="border border-neutral-800 rounded overflow-hidden">
                        <table className="w-full text-left border-collapse text-[11px]">
                          <thead>
                            <tr className="bg-neutral-950 border-b border-neutral-800 text-neutral-400 font-bold text-[9px] uppercase tracking-wider">
                              <th className="py-2.5 px-3">Ornament Name</th>
                              <th className="py-2.5 px-3 text-right">Ornament Weight</th>
                            </tr>
                          </thead>
                          <tbody className="divide-y divide-neutral-800/50 bg-neutral-950/20">
                            {selectedGirvi.ornaments.map((item, i) => (
                              <tr key={i} className="hover:bg-white/2">
                                <td className="py-2 px-3 text-white font-medium">{item.name || (item as any).ornament}</td>
                                <td className="py-2 px-3 text-right font-mono text-[#dfba73] font-bold">{item.weight}</td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    </div>

                    {/* Loan & Interest Calculation Sheet */}
                    <div className="space-y-2">
                      <h4 className="text-[9px] uppercase tracking-widest text-[#dfba73] font-extrabold flex items-center gap-1.5">
                        <TrendingUp className="w-3.5 h-3.5" /> Live Interest Calculations (ब्याज की गणना)
                      </h4>
                      <div className="bg-neutral-950/60 p-4 rounded border border-neutral-800/40 space-y-3.5">
                        {/* Custom Date Range Selector */}
                        <div className="grid grid-cols-2 gap-4 text-[10px] bg-neutral-900/50 p-2.5 rounded border border-neutral-800/80 mb-1">
                          <div>
                            <label className="block text-[8px] uppercase tracking-wider text-neutral-500 font-bold mb-1">
                              From Date (ब्याज प्रारंभ तिथि)
                            </label>
                            <input
                              type="date"
                              value={calcFromDate}
                              onChange={(e) => setCalcFromDate(e.target.value)}
                              className="w-full bg-neutral-950 border border-neutral-800 focus:border-amber-500 outline-none py-1.5 px-2 text-white font-mono text-xs rounded"
                            />
                          </div>
                          <div>
                            <label className="block text-[8px] uppercase tracking-wider text-neutral-500 font-bold mb-1">
                              To Date (ब्याज समाप्ति तिथि)
                            </label>
                            <input
                              type="date"
                              value={calcToDate}
                              onChange={(e) => setCalcToDate(e.target.value)}
                              className="w-full bg-neutral-950 border border-neutral-800 focus:border-amber-500 outline-none py-1.5 px-2 text-white font-mono text-xs rounded"
                            />
                          </div>
                        </div>

                        <div className="grid grid-cols-2 gap-4 text-[11px] border-b border-neutral-800 pb-2">
                          <div>
                            <span className="text-neutral-500 font-bold uppercase text-[8px] block">Loan Given</span>
                            <span className="text-white font-bold text-sm font-mono">₹{(parseFloat(selectedGirvi.amount || "0") || 0).toLocaleString()}</span>
                          </div>
                          <div>
                            <span className="text-neutral-500 font-bold uppercase text-[8px] block">Original Pledge Date</span>
                            <span className="text-white font-mono">{selectedGirvi.date}</span>
                          </div>
                        </div>

                        <div className="grid grid-cols-3 gap-2 text-center text-[10px]">
                          <div className="bg-neutral-900 border border-neutral-850 p-2 rounded">
                            <span className="text-neutral-500 font-bold block text-[8px] uppercase">Time Elapsed</span>
                            <span className="text-neutral-200 font-semibold block mt-0.5">{calc.months} mo, {calc.extraDays} days</span>
                          </div>
                          <div className="bg-neutral-900 border border-neutral-850 p-2 rounded">
                            <span className="text-neutral-500 font-bold block text-[8px] uppercase">Interest Rate</span>
                            <span className="text-neutral-200 font-semibold block mt-0.5">{selectedGirvi.interestRate}% ({selectedGirvi.interestPeriod === "monthly" ? "Month" : "Year"})</span>
                          </div>
                          <div className="bg-neutral-900 border border-neutral-850 p-2 rounded">
                            <span className="text-neutral-500 font-bold block text-[8px] uppercase">Calculation Type</span>
                            <span className="text-neutral-200 font-semibold block mt-0.5 capitalize">{selectedGirvi.interestType}</span>
                          </div>
                        </div>

                        <div className="grid grid-cols-2 gap-4 pt-2 border-t border-neutral-800 text-[11px]">
                          <div>
                            <span className="text-[#dfba73] font-bold block text-[9px] uppercase">Accumulated Interest</span>
                            <span className="text-amber-500 font-extrabold text-sm font-mono">₹{calc.interest.toLocaleString()}</span>
                          </div>
                          <div>
                            <span className="text-green-400 font-bold block text-[9px] uppercase">Total to Release</span>
                            <span className="text-green-400 font-extrabold text-sm font-mono">₹{calc.total.toLocaleString()}</span>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Historical Status Logs */}
                    <div className="space-y-2">
                      <h4 className="text-[9px] uppercase tracking-widest text-neutral-400 font-extrabold flex items-center gap-1.5">
                        <Calendar className="w-3.5 h-3.5" /> Ledger Status & Notes
                      </h4>
                      <div className="bg-neutral-950/60 p-4 rounded border border-neutral-800/40 space-y-2">
                        <div className="flex justify-between items-center text-[10px] text-neutral-500 border-b border-neutral-800 pb-1.5">
                          <span>Account Status:</span>
                          <span className={`font-bold uppercase ${selectedGirvi.status === "active" ? "text-amber-500" : "text-neutral-400"}`}>
                            {selectedGirvi.status === "active" ? "● Active Loan" : "✓ Released / Closed"}
                          </span>
                        </div>
                        {selectedGirvi.releasedDate && (
                          <div className="flex justify-between items-center text-[10px] text-neutral-500 border-b border-neutral-800 pb-1.5">
                            <span>Release Date:</span>
                            <span className="font-mono text-white">{selectedGirvi.releasedDate}</span>
                          </div>
                        )}
                        <div>
                          <span className="text-[8px] uppercase tracking-wider text-neutral-500 font-bold block mb-1">
                            Ledger Notes:
                          </span>
                          <p className="text-[11px] leading-relaxed text-neutral-300 whitespace-pre-line font-sans">
                            {selectedGirvi.notes || "No notes logged for this account."}
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Modal Footer */}
                  <div className="bg-neutral-950 px-6 py-3 border-t border-neutral-800 flex justify-end">
                    <button
                      onClick={() => setSelectedGirvi(null)}
                      className="py-1.5 px-4 bg-amber-500 hover:bg-amber-600 text-neutral-950 font-sans text-[9px] font-bold tracking-widest uppercase transition-colors rounded-sm cursor-pointer"
                    >
                      Done
                    </button>
                  </div>
                </div>
              </div>
            );
          })()}
        </main>
      </div>
    </div>
  );
}
