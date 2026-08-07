import React from "react";
import Image from "next/image";
import { Upload } from "lucide-react";
import { motion } from "framer-motion";

interface MeetFounderProps {
  isDesignMode: boolean;
  editOutlineClass: string;
  customText: Record<string, string>;
  customizedImages: Record<string, string>;
  handleTextChange: (key: string, val: string) => void;
  handleUploadImage: (key: string, base64: string) => void;
  compressImage: (file: File, maxDim: number) => Promise<string | null>;
  t: (en: string, hi: string, key?: string) => string;
}

export default function MeetFounder({
  isDesignMode,
  editOutlineClass,
  customText,
  customizedImages,
  handleTextChange,
  handleUploadImage,
  compressImage,
  t,
}: MeetFounderProps) {
  return (
    <motion.section
      initial={{ opacity: 0, y: 60 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-100px" }}
      transition={{ duration: 0.8, ease: "easeOut" }}
      className="py-14 md:py-24 px-4 sm:px-6 md:px-12 max-w-7xl mx-auto z-10 relative border-b border-[#dfba73]/10"
    >
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
        {/* Large portrait frame */}
        <div className="relative aspect-[3/4] md:max-h-[550px] border border-[#dfba73]/25 overflow-hidden group shadow-2xl bg-neutral-950">
          {customizedImages["owner_big_photo"] ? (
            <Image
              src={customizedImages["owner_big_photo"]}
              alt="Mr. Yogesh Kumar Gupta - Founder"
              width={600}
              height={800}
              className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
            />
          ) : (
            <div className="w-full h-full flex flex-col items-center justify-center bg-neutral-950">
              <div className="w-20 h-20 rounded-full bg-[#dfba73]/10 border border-[#dfba73]/30 flex items-center justify-center mb-4">
                <span className="text-[#dfba73] font-serif text-3xl font-bold">Y</span>
              </div>
              <p className="text-neutral-600 text-xs tracking-widest uppercase font-sans">Upload Owner Photo</p>
            </div>
          )}

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
                aria-label="Upload replacement portrait photo of founder Mr. Yogesh Kumar Gupta"
                onChange={async (e) => {
                  const file = e.target.files?.[0];
                  if (file) {
                    const compressed = await compressImage(file, 800); // 800px maximum resolution for portrait frame
                    if (compressed) {
                      handleUploadImage("owner_big_photo", compressed);
                    }
                  }
                }}
              />
            </label>
          )}
          <div className="absolute inset-0 bg-gradient-to-t from-neutral-950/40 via-transparent to-transparent pointer-events-none" />
        </div>

        {/* Founder Quotes */}
        <div className="space-y-8">
          <div>
            <span className="font-sans text-xs text-[#dfba73] tracking-[0.3em] uppercase font-bold">
              {t("Meet Our Founder", "हमारे संस्थापक से मिलें")}
            </span>
            <blockquote 
              contentEditable={isDesignMode}
              suppressContentEditableWarning
              onBlur={(e) => handleTextChange("founder_quote_txt", e.currentTarget.textContent || "")}
              className={`font-serif text-xl sm:text-2xl italic text-neutral-800 dark:text-neutral-200 leading-relaxed font-light mt-4 ${editOutlineClass}`}
            >
              {t("“Jewellery is not merely an ornament; it is a timestamp of your legacy. When we hand-craft pure gold at Omar Jewellers OJ, we are shaping stories of love, heritage, and pride that will be passed down for generations.”", "“आभूषण केवल एक आभूषण नहीं है; यह आपकी विरासत का एक टाइमस्टैम्प है। जब हम ओमर ज्वैलर्स ओजे में शुद्ध सोने के आभूषण तैयार करते हैं, तो हम प्यार, विरासत और गौरव की कहानियों को आकार दे रहे होते हैं जो पीढ़ियों तक हस्तांतरित होती रहेंगी।”", "founder_quote_txt")}
            </blockquote>
          </div>

          <p 
            contentEditable={isDesignMode}
            suppressContentEditableWarning
            onBlur={(e) => handleTextChange("founder_quote_desc", e.currentTarget.textContent || "")}
            className={`font-sans text-xs sm:text-sm text-neutral-600 dark:text-neutral-400 leading-relaxed font-light ${editOutlineClass}`}
          >
            {t("Under the guidance of Mr. Yogesh Kumar Gupta, our boutique has remained committed to absolute transparency, sourcing only BIS 916 hallmarked solid gold alloyed in-house. We strive to provide a modern, minimalist design approach suited for Gen Z self-expression without losing our traditional showroom roots.", "श्री योगेश कुमार गुप्ता के मार्गदर्शन में, हमारा बुटीक पूर्ण पारदर्शिता के प्रति प्रतिबद्ध रहा है, केवल इन-हाउस तैयार किया गया बीआईएस 916 हॉलमार्क युक्त ठोस सोना ही प्रदान करता है। हम पारंपरिक शोरूम की जड़ों को खोए बिना जनरल-ज़ी की पसंद के अनुसार आधुनिक, न्यूनतम डिज़ाइन दृष्टिकोण प्रदान करने का प्रयास करते हैं।", "founder_quote_desc")}
          </p>

          <div className="border-t border-[#dfba73]/15 pt-6">
            <h4 
              contentEditable={isDesignMode}
              suppressContentEditableWarning
              onBlur={(e) => handleTextChange("founder_sign_name", e.currentTarget.textContent || "")}
              className={`font-serif text-lg text-neutral-900 dark:text-neutral-100 font-bold ${editOutlineClass}`}
            >
              {t("Yogesh Kumar Gupta", "योगेश कुमार गुप्ता", "founder_sign_name")}
            </h4>
            <p 
              contentEditable={isDesignMode}
              suppressContentEditableWarning
              onBlur={(e) => handleTextChange("founder_sign_title", e.currentTarget.textContent || "")}
              className={`font-sans text-[10px] tracking-wider uppercase text-neutral-500 dark:text-neutral-400 mt-1 ${editOutlineClass}`}
            >
              {t("Founder, Omar Jewellers OJ", "संस्थापक, ओमर ज्वैलर्स ओजे", "founder_sign_title")}
            </p>
          </div>
        </div>
      </div>
    </motion.section>
  );
}
