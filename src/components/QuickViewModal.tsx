"use client";

import React, { useState } from "react";
import { X, Heart, ShoppingBag, Send, Check, Edit3, Upload } from "lucide-react";
import { Product } from "@/data/products";
import { motion, AnimatePresence } from "framer-motion";

interface QuickViewModalProps {
  product: Product | null;
  isOpen: boolean;
  onClose: () => void;
  isWishlisted: boolean;
  onWishlistToggle: (product: Product) => void;
  onAddToCart: (product: Product) => void;
  onInquiry: (product: Product, quantity: number) => void;
  isDesignMode?: boolean;
  onEditText?: (key: string, text: string) => void;
  onUploadPhoto?: (id: string, base64: string) => void;
  customText?: Record<string, string>;
}

export default function QuickViewModal({
  product,
  isOpen,
  onClose,
  isWishlisted,
  onWishlistToggle,
  onAddToCart,
  onInquiry,
  isDesignMode = false,
  onEditText,
  onUploadPhoto,
  customText = {},
}: QuickViewModalProps) {
  const [quantity, setQuantity] = useState(1);
  const [activeTab, setActiveTab] = useState<"description" | "specifications">("description");

  if (!product) return null;

  // Customized text mappings
  const displayName = customText[`prod_name_${product.id}`] || product.name;
  const displaySubCat = customText[`prod_subcat_${product.id}`] || product.subCategory;
  const displayPrice = customText[`prod_price_${product.id}`] || `$${product.price.toLocaleString()}`;
  const displayDesc = customText[`prod_desc_${product.id}`] || product.description;
  const displayMaterials = customText[`prod_mat_${product.id}`] || product.materials;

  // Extremely premium editor outline styling
  const editOutlineClass = isDesignMode
    ? "relative border border-dashed border-[#dfba73]/40 hover:border-[#dfba73] px-2 py-1 rounded-sm cursor-text focus:outline-none focus:ring-1 focus:ring-[#dfba73] bg-[#dfba73]/5 hover:bg-[#dfba73]/10 transition-all duration-300 group/edit"
    : "";

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 overflow-y-auto perspective-1000">
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 0.75 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-neutral-950/85 backdrop-blur-xs"
          />

          {/* Modal Container */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9, rotateX: 8, y: 15 }}
            animate={{ opacity: 1, scale: 1, rotateX: 0, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, rotateX: -8, y: 15 }}
            transition={{ type: "spring", stiffness: 300, damping: 25 }}
            className="relative w-full max-w-4xl bg-neutral-900 border border-[#dfba73]/25 shadow-2xl overflow-hidden z-10 grid grid-cols-1 md:grid-cols-2 rounded-sm"
          >
            {/* Close Button */}
            <motion.button
              onClick={onClose}
              whileHover={{ rotate: 90 }}
              transition={{ duration: 0.3 }}
              className="absolute top-4 right-4 p-2 bg-neutral-950/80 border border-[#dfba73]/20 hover:border-[#dfba73] text-neutral-300 hover:text-[#dfba73] rounded-full transition-colors z-20"
              aria-label="Close modal"
            >
              <X className="w-4 h-4" />
            </motion.button>

            {/* Left Column: Image - Animated slide-in from left with Design Mode Uploader */}
            <motion.div 
              initial={{ opacity: 0, x: -30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.1 }}
              className="relative h-72 md:h-full bg-neutral-950 border-r border-[#dfba73]/15 overflow-hidden"
            >
              <img
                src={product.image}
                alt={displayName}
                className="w-full h-full object-cover transition-transform duration-1000 hover:scale-105"
              />
              
              {isDesignMode && onUploadPhoto && (
                <label className="absolute inset-0 bg-neutral-900/80 backdrop-blur-xs flex flex-col items-center justify-center text-[#dfba73] cursor-pointer z-10">
                  <Upload className="w-8 h-8 mb-2 animate-bounce" />
                  <span className="font-sans text-[10px] tracking-widest uppercase font-bold text-center px-4">
                    Upload New Gold Photo
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
                          if (typeof r.result === "string") onUploadPhoto(product.id, r.result);
                        };
                        r.readAsDataURL(file);
                      }
                    }}
                  />
                </label>
              )}
              <div className="absolute inset-0 bg-gradient-to-t from-neutral-950/40 via-transparent to-transparent pointer-events-none" />
            </motion.div>

            {/* Right Column: Content */}
            <motion.div 
              initial={{ opacity: 0, x: 30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.15 }}
              className="p-6 md:p-8 flex flex-col justify-between max-h-[85vh] md:max-h-[600px] overflow-y-auto text-neutral-100"
            >
              <div>
                <div className="flex flex-col mb-1">
                  <div className="flex items-center gap-2">
                    <span 
                      contentEditable={isDesignMode}
                      suppressContentEditableWarning
                      onBlur={(e) => onEditText && onEditText(`prod_subcat_${product.id}`, e.currentTarget.textContent || "")}
                      className={`font-sans text-[10px] text-[#dfba73] tracking-[0.2em] uppercase font-semibold ${editOutlineClass}`}
                    >
                      OJ • {displaySubCat}
                    </span>
                    {isDesignMode && (
                      <span className="text-[9px] text-[#dfba73] uppercase tracking-wider font-bold animate-pulse">
                        (Edit Enabled)
                      </span>
                    )}
                  </div>
                </div>

                <h2 
                  contentEditable={isDesignMode}
                  suppressContentEditableWarning
                  onBlur={(e) => onEditText && onEditText(`prod_name_${product.id}`, e.currentTarget.textContent || "")}
                  className={`font-serif text-2xl md:text-3xl text-white font-light tracking-wide ${editOutlineClass}`}
                >
                  {displayName}
                  {isDesignMode && (
                    <Edit3 className="w-3.5 h-3.5 absolute top-1 right-1.5 opacity-30 group-hover/edit:opacity-100 transition-opacity text-[#dfba73]" />
                  )}
                </h2>
                
                <div className="flex items-center gap-4 mt-3 pb-4 border-b border-[#dfba73]/15">
                  <p 
                    contentEditable={isDesignMode}
                    suppressContentEditableWarning
                    onBlur={(e) => onEditText && onEditText(`prod_price_${product.id}`, e.currentTarget.textContent || "")}
                    className={`font-sans text-xl font-bold text-white inline-block ${editOutlineClass}`}
                  >
                    {displayPrice}
                    {isDesignMode && (
                      <Edit3 className="w-3.5 h-3.5 absolute top-1 right-1.5 opacity-30 group-hover/edit:opacity-100 transition-opacity text-[#dfba73]" />
                    )}
                  </p>
                  <div className="flex items-center gap-1 bg-[#dfba73]/15 px-2.5 py-0.5 border border-[#dfba73]/20 rounded-sm">
                    <span className="text-[#dfba73] text-xs">★</span>
                    <span className="font-sans text-xs font-semibold text-[#dfba73]">
                      {product.rating}
                    </span>
                  </div>
                </div>

                {/* Tabs */}
                <div className="flex gap-6 mt-6 border-b border-[#dfba73]/15 pb-2">
                  <button
                    onClick={() => setActiveTab("description")}
                    className={`font-sans text-xs tracking-widest uppercase font-semibold pb-1.5 transition-all duration-300 relative ${
                      activeTab === "description"
                        ? "text-[#dfba73]"
                        : "text-neutral-400 hover:text-white"
                    }`}
                  >
                    Description
                    {activeTab === "description" && (
                      <motion.div
                        layoutId="modalTabLine"
                        className="absolute bottom-0 left-0 w-full h-[1.5px] bg-[#dfba73]"
                      />
                    )}
                  </button>
                  <button
                    onClick={() => setActiveTab("specifications")}
                    className={`font-sans text-xs tracking-widest uppercase font-semibold pb-1.5 transition-all duration-300 relative ${
                      activeTab === "specifications"
                        ? "text-[#dfba73]"
                        : "text-neutral-400 hover:text-white"
                    }`}
                  >
                    Craftsmanship Details
                    {activeTab === "specifications" && (
                      <motion.div
                        layoutId="modalTabLine"
                        className="absolute bottom-0 left-0 w-full h-[1.5px] bg-[#dfba73]"
                      />
                    )}
                  </button>
                </div>

                {/* Tab Contents */}
                <div className="py-4 text-sm text-neutral-300">
                  {activeTab === "description" ? (
                    <div className="space-y-4">
                      <p 
                        contentEditable={isDesignMode}
                        suppressContentEditableWarning
                        onBlur={(e) => onEditText && onEditText(`prod_desc_${product.id}`, e.currentTarget.textContent || "")}
                        className={`font-sans text-xs md:text-sm text-neutral-300 leading-relaxed font-light ${editOutlineClass}`}
                      >
                        {displayDesc}
                        {isDesignMode && (
                          <Edit3 className="w-3.5 h-3.5 absolute top-1 right-1.5 opacity-30 group-hover/edit:opacity-100 transition-opacity text-[#dfba73]" />
                        )}
                      </p>
                      <p className="font-sans text-xs text-neutral-500 dark:text-neutral-400 mt-3 font-semibold">
                        Materials:{" "}
                        <span 
                          contentEditable={isDesignMode}
                          suppressContentEditableWarning
                          onBlur={(e) => onEditText && onEditText(`prod_mat_${product.id}`, e.currentTarget.textContent || "")}
                          className={editOutlineClass}
                        >
                          {displayMaterials}
                          {isDesignMode && (
                            <Edit3 className="w-3 h-3 absolute top-1 right-1 opacity-30 group-hover/edit:opacity-100 transition-opacity text-[#dfba73]" />
                          )}
                        </span>
                      </p>
                    </div>
                  ) : (
                    <ul className="space-y-2">
                      {product.details.map((detail, index) => {
                        const displayDetail = customText[`prod_detail_${product.id}_${index}`] || detail;
                        return (
                          <li
                            key={index}
                            className="font-sans text-xs text-neutral-300 flex items-center gap-2"
                          >
                            <Check className="w-3.5 h-3.5 text-[#dfba73] shrink-0" />
                            <span
                              contentEditable={isDesignMode}
                              suppressContentEditableWarning
                              onBlur={(e) => onEditText && onEditText(`prod_detail_${product.id}_${index}`, e.currentTarget.textContent || "")}
                              className={editOutlineClass}
                            >
                              {displayDetail}
                              {isDesignMode && (
                                <Edit3 className="w-3 h-3 absolute top-0.5 right-0.5 opacity-30 group-hover/edit:opacity-100 transition-opacity text-[#dfba73]" />
                              )}
                            </span>
                          </li>
                        );
                      })}
                    </ul>
                  )}
                </div>
              </div>

              <div>
                {/* Quantity selector */}
                <div className="flex items-center gap-4 mb-6">
                  <span className="font-sans text-xs font-semibold tracking-wider text-neutral-400 uppercase">
                    Quantity:
                  </span>
                  <div className="flex items-center border border-[#dfba73]/25 rounded-sm bg-neutral-950">
                    <button
                      onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                      className="px-3.5 py-1.5 text-neutral-300 hover:text-[#dfba73] transition-colors font-sans text-sm font-bold"
                    >
                      -
                    </button>
                    <span className="px-4 py-1.5 text-white font-sans text-xs font-bold">
                      {quantity}
                    </span>
                    <button
                      onClick={() => setQuantity((q) => q + 1)}
                      className="px-3.5 py-1.5 text-neutral-300 hover:text-[#dfba73] transition-colors font-sans text-sm font-bold"
                    >
                      +
                    </button>
                  </div>
                </div>

                {/* Action CTA Buttons */}
                <div className="flex flex-col gap-3">
                  <div className="grid grid-cols-5 gap-3">
                    <button
                      onClick={() => onAddToCart({ ...product })}
                      className="col-span-4 py-3.5 bg-neutral-950 hover:bg-neutral-800 text-white border border-[#dfba73]/30 font-sans text-xs font-bold tracking-widest uppercase transition-all duration-300 flex items-center justify-center gap-2 rounded-sm shadow-md shimmer-hover"
                    >
                      <ShoppingBag className="w-4 h-4 text-[#dfba73]" />
                      Add to Shopping Bag
                    </button>
                    <button
                      onClick={() => onWishlistToggle(product)}
                      className={`py-3.5 border border-[#dfba73]/30 font-sans text-xs flex items-center justify-center transition-all duration-300 rounded-sm ${
                        isWishlisted
                          ? "bg-[#dfba73] text-neutral-950"
                          : "bg-transparent text-neutral-300 hover:bg-[#dfba73]/10"
                      }`}
                      title={isWishlisted ? "Wishlisted" : "Add to Wishlist"}
                    >
                      <Heart className={`w-4 h-4 ${isWishlisted ? "fill-neutral-950" : ""}`} />
                    </button>
                  </div>

                  <button
                    onClick={() => onInquiry(product, quantity)}
                    className="w-full py-3.5 bg-[#dfba73] hover:bg-[#c5a059] text-neutral-950 font-sans text-xs font-bold tracking-widest uppercase transition-all duration-300 flex items-center justify-center gap-2 rounded-sm shadow-lg shadow-[#dfba73]/10"
                  >
                    <Send className="w-4 h-4" />
                    Inquire on WhatsApp (Custom Pricing)
                  </button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
