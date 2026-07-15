"use client";

import React from "react";
import { Heart, Eye, ShoppingBag, Upload } from "lucide-react";
import { Product } from "@/data/products";
import { motion } from "framer-motion";

interface ProductCardProps {
  product: Product;
  isWishlisted: boolean;
  onWishlistToggle: (product: Product) => void;
  onQuickView: (product: Product) => void;
  onAddToCart: (product: Product) => void;
  isDesignMode?: boolean;
  onUploadPhoto?: (id: string, base64: string) => void;
  onEditText?: (key: string, text: string) => void;
  customText?: Record<string, string>;
}

export default function ProductCard({
  product,
  isWishlisted,
  onWishlistToggle,
  onQuickView,
  onAddToCart,
  isDesignMode = false,
  onUploadPhoto,
  onEditText,
  customText = {},
}: ProductCardProps) {
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file && onUploadPhoto) {
      const reader = new FileReader();
      reader.onloadend = () => {
        if (typeof reader.result === "string") {
          onUploadPhoto(product.id, reader.result);
        }
      };
      reader.readAsDataURL(file);
    }
  };

  // Get custom edits or fallbacks
  const displayName = customText[`prod_name_${product.id}`] || product.name;
  const displaySubCat = customText[`prod_subcat_${product.id}`] || product.subCategory;
  const displayPrice = customText[`prod_price_${product.id}`] || `₹${product.price.toLocaleString()}`;

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-50px" }}
      transition={{ duration: 0.4, ease: "easeOut" }}
      className="group relative bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 hover:border-[#dfba73] dark:hover:border-[#dfba73] p-4 transition-[border-color,box-shadow] duration-300 ease-out flex flex-col justify-between hover:shadow-xl hover:shadow-gold/5 transform-gpu"
    >
      <div className="relative overflow-hidden aspect-square border border-gold/10 bg-neutral-950 mb-4">
        {/* Zoom image */}
        <img
          src={product.image}
          alt={product.name}
          loading="lazy"
          className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
        />

        {/* Hover overlay icons */}
        <div className="absolute inset-0 bg-neutral-950/40 opacity-0 md:group-hover:opacity-100 transition-opacity duration-300 hidden md:flex items-center justify-center gap-3">
          <button
            onClick={() => onQuickView(product)}
            className="p-3 bg-white dark:bg-neutral-900 rounded-full text-neutral-900 dark:text-neutral-100 hover:bg-gold hover:text-neutral-950 transform translate-y-4 group-hover:translate-y-0 transition-all duration-300 shadow-lg"
            title="Quick View"
          >
            <Eye className="w-4 h-4" />
          </button>
          <button
            onClick={() => onAddToCart(product)}
            className="p-3 bg-white dark:bg-neutral-900 rounded-full text-neutral-900 dark:text-neutral-100 hover:bg-gold hover:text-neutral-950 transform translate-y-4 group-hover:translate-y-0 transition-all duration-300 delay-75 shadow-lg"
            title="Add to Bag"
          >
            <ShoppingBag className="w-4 h-4" />
          </button>
        </div>

        {/* Design Mode Photo Uploader */}
        {isDesignMode && (
          <label className="absolute inset-0 bg-neutral-900/80 backdrop-blur-xs flex flex-col items-center justify-center text-amber-500 cursor-pointer z-10">
            <Upload className="w-8 h-8 mb-2 animate-bounce" />
            <span className="font-sans text-[10px] tracking-widest uppercase font-bold text-center px-4">
              Upload Gold Photo
            </span>
            <input
              type="file"
              accept="image/*"
              className="hidden"
              onChange={handleFileChange}
            />
          </label>
        )}

        {/* Wishlist toggle */}
        <button
          onClick={() => onWishlistToggle(product)}
          className="absolute top-3 right-3 p-2 bg-white/95 dark:bg-neutral-900/95 backdrop-blur-sm rounded-full text-neutral-900 dark:text-neutral-100 hover:text-gold transition-colors shadow-md z-10"
        >
          <Heart
            className={`w-4 h-4 transition-colors ${
              isWishlisted ? "fill-gold text-gold" : "text-neutral-900 dark:text-neutral-100"
            }`}
          />
        </button>

        {/* Badge for category */}
        {product.category === "new-arrivals" && (
          <span className="absolute top-3 left-3 px-2 py-0.5 bg-gold/90 text-neutral-950 font-sans text-[9px] font-extrabold tracking-widest uppercase rounded-sm z-10">
            NEW
          </span>
        )}
        {product.category === "best-sellers" && (
          <span className="absolute top-3 left-3 px-2 py-0.5 bg-neutral-950/90 dark:bg-neutral-100/90 text-neutral-100 dark:text-neutral-950 font-sans text-[9px] font-extrabold tracking-widest uppercase rounded-sm border border-gold/20 z-10">
            BEST
          </span>
        )}
      </div>

      <div className="flex-grow flex flex-col justify-between mt-3">
        <div>
          <p 
            contentEditable={isDesignMode}
            suppressContentEditableWarning
            onBlur={(e) => onEditText && onEditText(`prod_subcat_${product.id}`, e.currentTarget.textContent || "")}
            className={`font-sans text-[10px] text-gold tracking-widest uppercase font-semibold inline-block ${
              isDesignMode ? "border border-dashed border-amber-500/40 px-1 rounded-sm cursor-text" : ""
            }`}
          >
            {displaySubCat}
          </p>
          <h4 
            contentEditable={isDesignMode}
            suppressContentEditableWarning
            onBlur={(e) => onEditText && onEditText(`prod_name_${product.id}`, e.currentTarget.textContent || "")}
            className={`font-serif text-base text-neutral-900 dark:text-neutral-100 mt-1 group-hover:text-gold transition-colors truncate ${
              isDesignMode ? "border border-dashed border-amber-500/40 px-1 rounded-sm cursor-text" : ""
            }`}
          >
            {displayName}
          </h4>
        </div>
        
        <div className="mt-4">
          <div className="flex items-center justify-between pt-2 border-t border-gold/10">
            <p 
              contentEditable={isDesignMode}
              suppressContentEditableWarning
              onBlur={(e) => onEditText && onEditText(`prod_price_${product.id}`, e.currentTarget.textContent || "")}
              className={`font-sans text-sm font-bold text-neutral-900 dark:text-neutral-100 ${
                isDesignMode ? "border border-dashed border-amber-500/40 px-1 rounded-sm cursor-text" : ""
              }`}
            >
              {displayPrice}
            </p>
            <div className="flex items-center gap-1">
              <span className="text-gold text-xs">★</span>
              <span className="font-sans text-xs text-neutral-800 dark:text-neutral-200 font-semibold">
                {product.rating}
              </span>
            </div>
          </div>

          {/* Mobile Action Buttons */}
          <div className="flex gap-2 mt-4 md:hidden">
            <button
              onClick={() => onQuickView(product)}
              className="flex-grow py-2 border border-gold/30 hover:border-gold/60 text-neutral-900 dark:text-neutral-200 hover:bg-gold hover:text-neutral-950 font-sans text-[10px] font-bold tracking-widest uppercase transition-all duration-300 flex items-center justify-center gap-1 rounded-sm active:scale-[0.98] cursor-pointer"
            >
              <Eye className="w-3.5 h-3.5" />
              Quick View
            </button>
            <button
              onClick={() => onAddToCart(product)}
              className="py-2 px-3 bg-gold text-neutral-950 font-sans text-[10px] tracking-widest uppercase hover:bg-amber-600 transition-all duration-300 flex items-center justify-center rounded-sm active:scale-[0.98] cursor-pointer"
              title="Add to Bag"
            >
              <ShoppingBag className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
