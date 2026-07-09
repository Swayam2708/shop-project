"use client";

import { useEffect, useRef, useState } from "react";
import { X, Heart, MessageSquare, Send, Check } from "lucide-react";
import { trackActivity } from "@/lib/tracker";

interface Product {
  id: string;
  name: string;
  price: string;
  category: string;
  image: string;
  description: string;
  details: string[];
}

interface ProductModalProps {
  product: Product;
  onClose: () => void;
  onAddToWishlist: (id: string) => void;
  isWishlisted: boolean;
}

export default function ProductModal({
  product,
  onClose,
  onAddToWishlist,
  isWishlisted,
}: ProductModalProps) {
  const [inquiryName, setInquiryName] = useState("");
  const [inquiryMessage, setInquiryMessage] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const startTimeRef = useRef<number>(0);

  // Time-spent tracking on mount & unmount
  useEffect(() => {
    startTimeRef.current = Date.now();
    
    // Track product view click on entry
    trackActivity({
      eventType: "PRODUCT_VIEW",
      productName: product.name,
      pageName: `/product/${product.id}`,
      metadata: { action: "open_modal" },
    });

    return () => {
      // Calculate duration in seconds
      const endTime = Date.now();
      const durationSeconds = Math.round((endTime - startTimeRef.current) / 1000);
      
      if (durationSeconds > 0) {
        trackActivity({
          eventType: "TIME_SPENT",
          productName: product.name,
          pageName: `/product/${product.id}`,
          duration: durationSeconds,
          metadata: { action: "close_modal" },
        });
      }
    };
  }, [product.id, product.name]);

  // Handle WhatsApp direct message click
  const handleWhatsAppInquiry = () => {
    trackActivity({
      eventType: "WHATSAPP_CLICK",
      productName: product.name,
      pageName: `/product/${product.id}`,
      metadata: { contact: "whatsapp_modal" },
    });
    
    const message = `Hi OJ, I am interested in your premium "${product.name}" (${product.price}). Could I get more details?`;
    const encoded = encodeURIComponent(message);
    const phoneNumber = "919999999999"; // Admin phone number
    window.open(`https://wa.me/${phoneNumber}?text=${encoded}`, "_blank");
  };

  // Submit quick inquiry form
  const handleInquirySubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!inquiryName.trim()) return;

    setLoading(true);
    
    // Log tracking event for form submission
    await trackActivity({
      eventType: "FORM_SUBMIT",
      productName: product.name,
      pageName: `/product/${product.id}`,
      metadata: {
        name: inquiryName,
        message: inquiryMessage,
        type: "product_modal_inquiry",
      },
    });

    // Simulate database update/API request time
    setTimeout(() => {
      setLoading(false);
      setSubmitted(true);
      setInquiryName("");
      setInquiryMessage("");
      setTimeout(() => setSubmitted(false), 3000);
    }, 800);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm transition-opacity duration-300">
      {/* Modal Card */}
      <div className="relative w-full max-w-4xl max-h-[90vh] overflow-y-auto rounded-2xl bg-[#FAF9F6] border border-[#dfba73]/30 shadow-2xl transition-all duration-300 md:grid md:grid-cols-2">
        
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 z-10 p-2 rounded-full bg-[#111111]/80 text-[#FAF9F6] hover:bg-[#dfba73] transition-colors duration-200"
          aria-label="Close modal"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Product Image Section */}
        <div className="relative h-72 md:h-full min-h-[300px] bg-[#F5F2EB] flex items-center justify-center overflow-hidden">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={product.image}
            alt={product.name}
            className="w-full h-full object-cover object-center transform hover:scale-105 transition-transform duration-700"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/30 via-transparent to-transparent"></div>
          <span className="absolute bottom-4 left-4 text-xs font-semibold tracking-wider text-white uppercase bg-[#111111]/80 px-3 py-1 rounded-full border border-[#dfba73]/40">
            {product.category}
          </span>
        </div>

        {/* Content Section */}
        <div className="p-6 md:p-8 flex flex-col justify-between">
          <div>
            <div className="flex justify-between items-start gap-4">
              <h2 className="font-serif text-2xl md:text-3xl text-[#111111] leading-tight">
                {product.name}
              </h2>
              <button
                onClick={() => {
                  onAddToWishlist(product.id);
                  trackActivity({
                    eventType: "WISHLIST_ADD",
                    productName: product.name,
                    pageName: `/product/${product.id}`,
                    metadata: { wishlisted: !isWishlisted },
                  });
                }}
                className={`p-2.5 rounded-full border transition-all duration-300 ${
                  isWishlisted
                    ? "bg-[#dfba73]/10 border-[#dfba73] text-[#dfba73]"
                    : "border-black/10 hover:border-[#dfba73] text-black/60 hover:text-[#dfba73]"
                }`}
              >
                <Heart className={`w-5 h-5 ${isWishlisted ? "fill-current" : ""}`} />
              </button>
            </div>

            <p className="text-xl font-medium text-[#dfba73] mt-2 tracking-wide font-sans">
              {product.price}
            </p>

            <div className="mt-4 border-t border-[#dfba73]/15 pt-4">
              <h4 className="text-xs font-semibold tracking-widest text-[#111111]/50 uppercase mb-2">
                The Story
              </h4>
              <p className="text-[#111111]/80 text-sm leading-relaxed">
                {product.description}
              </p>
            </div>

            <div className="mt-4">
              <h4 className="text-xs font-semibold tracking-widest text-[#111111]/50 uppercase mb-2">
                Details & Materials
              </h4>
              <ul className="text-sm text-[#111111]/70 space-y-1">
                {product.details.map((detail, idx) => (
                  <li key={idx} className="flex items-start gap-2">
                    <span className="text-[#dfba73] mt-1">•</span>
                    <span>{detail}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* Inquiry / Action Section */}
          <div className="mt-6 pt-6 border-t border-[#dfba73]/15">
            <div className="grid grid-cols-2 gap-3 mb-4">
              <button
                onClick={handleWhatsAppInquiry}
                className="w-full flex items-center justify-center gap-2 py-3 px-4 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg text-xs font-semibold tracking-wider uppercase transition-colors duration-200"
              >
                <MessageSquare className="w-4 h-4 fill-current" />
                WhatsApp
              </button>
              <button
                onClick={() => {
                  const target = document.getElementById("inquiry-form-section");
                  if (target) {
                    onClose();
                    target.scrollIntoView({ behavior: "smooth" });
                  }
                }}
                className="w-full py-3 px-4 bg-[#111111] hover:bg-[#dfba73] text-[#FAF9F6] rounded-lg text-xs font-semibold tracking-wider uppercase border border-[#dfba73]/20 transition-all duration-300"
              >
                Inquire Form
              </button>
            </div>

            {/* Inline Quick Inquiry */}
            <form onSubmit={handleInquirySubmit} className="space-y-2 mt-4 bg-[#F5F2EB] p-3.5 rounded-xl border border-black/5">
              <h4 className="text-[11px] font-semibold tracking-widest text-[#111111]/60 uppercase mb-1">
                Quick Portal Inquiry
              </h4>
              <div className="flex gap-2">
                <input
                  type="text"
                  placeholder="Your Name"
                  required
                  value={inquiryName}
                  onChange={(e) => setInquiryName(e.target.value)}
                  className="flex-1 text-xs bg-white border border-[#dfba73]/20 focus:border-[#dfba73] focus:ring-1 focus:ring-[#dfba73] outline-none px-3 py-2 rounded-md text-[#111111]"
                />
                <button
                  type="submit"
                  disabled={loading}
                  className="bg-[#dfba73] hover:bg-[#d4af37] disabled:bg-[#dfba73]/50 text-white p-2 rounded-md transition-colors duration-200"
                >
                  {submitted ? <Check className="w-4 h-4" /> : <Send className="w-4 h-4" />}
                </button>
              </div>
              <input
                type="text"
                placeholder="Questions or preferences? (optional)"
                value={inquiryMessage}
                onChange={(e) => setInquiryMessage(e.target.value)}
                className="w-full text-xs bg-white border border-[#dfba73]/20 focus:border-[#dfba73] focus:ring-1 focus:ring-[#dfba73] outline-none px-3 py-2 rounded-md text-[#111111]"
              />
              {submitted && (
                <p className="text-[10px] text-emerald-600 font-medium mt-1">
                  Inquiry sent! Our admin will contact you shortly.
                </p>
              )}
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
