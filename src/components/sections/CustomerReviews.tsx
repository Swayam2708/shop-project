import React from "react";
import Image from "next/image";
import { Upload } from "lucide-react";
import { motion } from "framer-motion";
import GoldCorner from "../GoldCorner";

interface CustomerReviewsProps {
  isDesignMode: boolean;
  editOutlineClass: string;
  customText: Record<string, string>;
  customizedImages: Record<string, string>;
  handleTextChange: (key: string, val: string) => void;
  handleUploadImage: (key: string, base64: string) => void;
  compressImage: (file: File, maxDim: number) => Promise<string | null>;
  t: (en: string, hi: string, key?: string) => string;
}

export default function CustomerReviews({
  isDesignMode,
  editOutlineClass,
  customText,
  customizedImages,
  handleTextChange,
  handleUploadImage,
  compressImage,
  t,
}: CustomerReviewsProps) {
  const reviews = [
    {
      name: t("Amara K.", "अमारा के."),
      role: t("Verified Buyer", "सत्यापित खरीदार"),
      text: t("“The Hammered Choker is an absolute dream! It’s light yet makes me feel like royalty. The gold color is so warm and different from typical brassy jewelry. A must-have!”", "“नक्काशीदार चोकर एक बिल्कुल सपने जैसा है! यह हल्का है फिर भी मुझे शाही महसूस कराता है। सोने का रंग बहुत गर्म है और आम पीतल के आभूषणों से बिल्कुल अलग है। बेहद खूबसूरत!”", "rev_text_rev1"),
      img: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=200&auto=format&fit=crop",
      id: "rev1"
    },
    {
      name: t("Rohit S.", "रोहित एस."),
      role: t("Bespoke Bridal Client", "कस्टम दुल्हन सेट ग्राहक"),
      text: t("“Stunning craftsmanship. We ordered the Temple Floral Collar and customized the hanging gold beads. The team shared design blueprints on WhatsApp and completed the set perfectly.”", "“शानदार शिल्प कौशल। हमने टेंपल फ्लोरल कॉलर का ऑर्डर दिया और लटकने वाले सोने के मोतियों को कस्टमाइज़ किया। टीम ने व्हाट्सएप पर डिज़ाइन ब्लूप्रिंट साझा किए और सेट को पूरी तरह से पूरा किया।”", "rev_text_rev2"),
      img: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=200&auto=format&fit=crop",
      id: "rev2"
    },
    {
      name: t("Zoe L.", "ज़ो एल."),
      role: t("Daily Wear Fan", "दैनिक उपयोग आभूषण प्रशंसक"),
      text: t("“I wear the Helix bracelet and sphere studs daily. They have been submerged in water, perfume, and still shine with that authentic luxury luster. OJ is my go-to for gold.”", "“मैं रोजाना हेलिक्स ब्रेसलेट और स्फीयर स्टड्स पहनती हूं। वे पानी और परफ्यूम के संपर्क में आने के बाद भी प्रामाणिक लग्जरी चमक के साथ चमकते हैं। सोने के लिए ओजे मेरा पसंदीदा है।”", "rev_text_rev3"),
      img: "https://images.unsplash.com/photo-1517841905240-472988babdf9?q=80&w=200&auto=format&fit=crop",
      id: "rev3"
    }
  ];

  return (
    <motion.section
      initial={{ opacity: 0, y: 60 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-100px" }}
      transition={{ duration: 0.8, ease: "easeOut" }}
      id="reviews"
      className="py-16 md:py-36 px-4 md:px-12 max-w-7xl mx-auto z-10 relative"
    >
      <div className="text-center mb-16">
        <span 
          contentEditable={isDesignMode}
          suppressContentEditableWarning
          onBlur={(e) => handleTextChange("rev_sub", e.currentTarget.textContent || "")}
          className={`font-sans text-xs text-[#dfba73] tracking-[0.3em] uppercase font-bold inline-block ${editOutlineClass}`}
        >
          {t("Testimonials", "प्रशंसापत्र", "rev_sub")}
        </span>
        <h2 
          contentEditable={isDesignMode}
          suppressContentEditableWarning
          onBlur={(e) => handleTextChange("rev_title", e.currentTarget.textContent || "")}
          className={`font-serif text-3xl md:text-5xl font-light text-neutral-900 dark:text-neutral-100 mt-2 ${editOutlineClass}`}
        >
          {t("Gold Collector Reviews", "स्वर्ण संग्रहकर्ता समीक्षाएं", "rev_title")}
        </h2>
      </div>

      <div className="flex overflow-x-auto md:grid md:grid-cols-3 gap-6 md:gap-8 scrollbar-none snap-x snap-mandatory pb-4 w-full">
        {reviews.map((review, i) => (
          <motion.div
            whileHover={{ y: -6 }}
            transition={{ duration: 0.3 }}
            key={i}
            className="w-[290px] sm:w-[340px] md:w-auto shrink-0 snap-center bg-white/40 dark:bg-[#0F0E0B]/40 border border-[#dfba73]/10 p-8 flex flex-col justify-between hover:border-[#dfba73] transition-all duration-300 relative group shadow-sm rounded-sm overflow-hidden"
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
                <Image
                  src={customizedImages[`rev_avatar_${review.id}`] || review.img}
                  alt={review.name}
                  width={40}
                  height={40}
                  className="w-full h-full object-cover"
                />
                {isDesignMode && (
                  <label className="absolute inset-0 bg-neutral-900/80 backdrop-blur-xs flex items-center justify-center text-amber-500 cursor-pointer z-10">
                    <Upload className="w-3.5 h-3.5" />
                    <input
                      type="file"
                      accept="image/*"
                      className="hidden"
                      aria-label={`Upload replacement avatar for ${review.name}`}
                      onChange={async (e) => {
                        const file = e.target.files?.[0];
                        if (file) {
                          const compressed = await compressImage(file, 300); // 300px maximum resolution for avatar images
                          if (compressed) {
                            handleUploadImage(`rev_avatar_${review.id}`, compressed);
                          }
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
  );
}
