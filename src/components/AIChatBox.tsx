"use client";

import React, { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { MessageSquare, X, Send, Sparkles, Bot, User, MessageCircle, ChevronDown, RefreshCw } from "lucide-react";

interface Message {
  id: string;
  sender: "user" | "ai";
  text: string;
  timestamp: string;
  action?: {
    type: "whatsapp" | "link";
    label: string;
    href: string;
  };
}

interface AIChatBoxProps {
  whatsAppNumber?: string;
  language?: "en" | "hi";
}

export default function AIChatBox({ whatsAppNumber = "9936488845", language = "en" }: AIChatBoxProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [input, setInput] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const [unreadCount, setUnreadCount] = useState(1);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const initialGreeting: Message = {
    id: "welcome-1",
    sender: "ai",
    text: language === "hi"
      ? "नमस्ते! 👋 मैं ओमर ज्वैलर्स ओजे का एआई गोल्ड कंसीयर्ज हूँ। आप मुझसे आज के सोने-चांदी के भाव, बीआईएस हॉलमार्क शुद्धता, कस्टम आभूषण ऑर्डर या हमारे शाहाबाद चौक शोरूम के बारे में कुछ भी पूछ सकते हैं!"
      : "Welcome to Omar Jewellers OJ! ✨ I am your AI Gold Concierge. Feel free to ask about today's live metal rates, 100% BIS hallmarked purity, custom jewellery commissions, or our Shahabad Chowk showroom!",
    timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
  };

  const [messages, setMessages] = useState<Message[]>([initialGreeting]);

  useEffect(() => {
    if (isOpen && unreadCount > 0) {
      setUnreadCount(0);
    }
  }, [isOpen]);

  useEffect(() => {
    if (isOpen) {
      messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages, isTyping, isOpen]);

  // Intelligent AI Knowledge Response Engine
  const generateAIResponse = (userQuery: string): { text: string; action?: Message["action"] } => {
    const query = userQuery.toLowerCase().trim();

    // Check for Rates / Price queries
    if (query.includes("rate") || query.includes("price") || query.includes("भाव") || query.includes("रेट") || query.includes("आज का") || query.includes("gold rate") || query.includes("silver rate")) {
      return {
        text: language === "hi"
          ? "📊 **आज के लाइव शोरूम भाव (शाहाबाद चौक):**\n\n• **२४K सोना (९९.९% शुद्ध):** ~₹7,450 / ग्राम\n• **२२K सोना (९१.६% आभूषण सोना):** ~₹6,950 / ग्राम\n• **१८K सोना (७५% डिज़ाइनर सोना):** ~₹5,750 / ग्राम\n• **९९९ फाइन चांदी:** ~₹88.50 / ग्राम\n\n*हमारे सभी उत्पाद 100% सरकारी बीआईएस हॉलमार्क प्रमाणित हैं!*"
          : "📊 **Today's Official Showroom Board Rates (Shahabad Chowk):**\n\n• **24K Gold (99.9% Fine):** ~₹7,450 / g\n• **22K Gold (91.6% Jeweller Gold):** ~₹6,950 / g\n• **18K Gold (75% Designer Gold):** ~₹5,750 / g\n• **999 Fine Silver:** ~₹88.50 / g\n\n*All our ornaments carry 100% official BIS Hallmark certification!*",
        action: {
          type: "whatsapp",
          label: "Book Rate Guarantee on WhatsApp",
          href: `https://wa.me/91${whatsAppNumber}?text=${encodeURIComponent("Hi Omar Jewellers, I want to confirm today's live gold rate for my purchase.")}`
        }
      };
    }

    // Check for Location / Address / Showroom Hours
    if (query.includes("where") || query.includes("location") || query.includes("address") || query.includes("kaha") || query.includes("पता") || query.includes("दुकान") || query.includes("timing") || query.includes("hour")) {
      return {
        text: language === "hi"
          ? "📍 **हमारा आधिकारिक शोरूम पता:**\n\n**ओमर ज्वैलर्स ओजे**\nमुख्य चौक, शाहाबाद, जिला हरदोई, उत्तर प्रदेश (भारत)।\n\n⏰ **खुलने का समय:**\nसोमवार - शनिवार: सुबह 11:00 बजे से रात 8:30 बजे तक (IST)।\n\nमार्गदर्शन या निजी विजिट के लिए आप हमें सीधे कॉल या व्हाट्सएप कर सकते हैं!"
          : "📍 **Our Luxury Boutique Address:**\n\n**Omar Jewellers OJ**\nMain Chowk, Shahabad, District Hardoi, Uttar Pradesh, India.\n\n⏰ **Boutique Hours:**\nMonday - Saturday: 11:00 AM - 8:30 PM (IST).\n\nFeel free to reach out directly on WhatsApp for private showroom viewing appointments!",
        action: {
          type: "whatsapp",
          label: "Get Location on WhatsApp",
          href: `https://wa.me/91${whatsAppNumber}?text=${encodeURIComponent("Hi Omar Jewellers, please send me the showroom Google Maps location.")}`
        }
      };
    }

    // Custom Commission / Making Charges / Discounts
    if (query.includes("custom") || query.includes("order") || query.includes("making") || query.includes("discount") || query.includes("offer") || query.includes("बनवाई") || query.includes("छूट") || query.includes("ऑर्डर")) {
      return {
        text: language === "hi"
          ? "✨ **विशेष उत्सव ऑफ़र और कस्टम आभूषण:**\n\n• हम इन-हाउस मिश्रित विशेष **शैम्पेन गोल्ड (Champagne Gold)** और २२K आभूषण कस्टमाइज़ करते हैं।\n• हमारे विशेष कोड **OJGOLD10** का उपयोग करके बनवाई शुल्क (Making Charges) पर **10% की सीधी छूट** प्राप्त करें!\n• हम आपकी पसंद के चित्र या व्हाट्सएप डिज़ाइन के अनुसार सटीक आभूषण तैयार करते हैं।"
          : "✨ **Bespoke Commissions & Festive Offers:**\n\n• We specialize in custom Champagne Gold and 22K hallmarked couture.\n• Enjoy an exclusive **10% OFF Making Charges** using coupon code **OJGOLD10**!\n• Send us your custom Pinterest, Instagram, or WhatsApp designs and our master smiths will craft them to exact dimensions.",
        action: {
          type: "whatsapp",
          label: "Claim 10% OFF Making Offer",
          href: `https://wa.me/91${whatsAppNumber}?text=${encodeURIComponent("Hi Omar Jewellers, I want to claim the 10% OFF Festive Gift Card (Code: OJGOLD10) for custom order.")}`
        }
      };
    }

    // Girvi / Udhaar / Loan queries
    if (query.includes("girvi") || query.includes("udhaar") || query.includes("girwi") || query.includes("loan") || query.includes("गिरवी") || query.includes("उधारी") || query.includes("ब्याज")) {
      return {
        text: language === "hi"
          ? "📑 **गिरवी (Girvi) और उधारी खाता सेवा:**\n\n• हम सुरक्षित और गोपनीय सोने/चांदी के आभूषणों पर गिरवी ऋण (Pledge Loans) सुविधा प्रदान करते हैं।\n• पारदर्शी मासिक/वार्षिक ब्याज गणना (साधारण एवं चक्रवृद्धि)।\n• ग्राहक अपने संपूर्ण खाते और पारिवारिक रिकॉर्ड की डिजिटल रसीद प्राप्त कर सकते हैं।"
          : "📑 **Girvi (Pledge Loans) & Credit Ledger:**\n\n• Secure, confidential pledge loans against solid gold & silver ornaments.\n• Transparent simple & compound interest tracking options.\n• Full digital family ledger tracking with instant print statement receipts.",
        action: {
          type: "whatsapp",
          label: "Inquire about Girvi Ledger",
          href: `https://wa.me/91${whatsAppNumber}?text=${encodeURIComponent("Hi Omar Jewellers, I have an inquiry regarding Girvi / Udhaar accounts.")}`
        }
      };
    }

    // Purity / Hallmark / Certificate
    if (query.includes("purity") || query.includes("hallmark") || query.includes("bis") || query.includes("pure") || query.includes("शुद्धता") || query.includes("गारंटी")) {
      return {
        text: language === "hi"
          ? "🛡️ **100% शुद्धता एवं बीआईएस हॉलमार्क गारंटी:**\n\n• ओमर ज्वैलर्स ओजे का हर आभूषण सरकारी बीआईएस (BIS 916 / 750) हॉलमार्क लेजर मुहर के साथ आता है।\n• हम 100% नैतिक स्रोतों से प्राप्त शुद्ध सोने का उपयोग करते हैं।"
          : "🛡️ **100% BIS Hallmark Guarantee:**\n\n• Every ornament from Omar Jewellers OJ is stamped with official government BIS 916 (22K) or BIS 750 (18K) laser hallmarks.\n• Guaranteed purity with 100% transparent buy-back and exchange values.",
      };
    }

    // Founder / Owner
    if (query.includes("owner") || query.includes("founder") || query.includes("yogesh") || query.includes("gupta") || query.includes("मालिक")) {
      return {
        text: language === "hi"
          ? "👑 **हमारे संस्थापक:**\n\nओमर ज्वैलर्स ओजे के संस्थापक एवं प्रबंध निदेशक **श्री योगेश कुमार गुप्ता** हैं। उनके दूरदर्शी मार्गदर्शन में हमारा बुटीक पूर्ण पारदर्शिता और उत्कृष्ट शिल्प कौशल के लिए प्रसिद्ध है।"
          : "👑 **Boutique Leadership:**\n\nOmar Jewellers OJ is founded and managed by **Mr. Yogesh Kumar Gupta**. Under his leadership, our boutique maintains uncompromised purity and master gold craftsmanship.",
      };
    }

    // Default Fallback
    return {
      text: language === "hi"
        ? "धन्यवाद! हमारे आभूषण विशेषज्ञों से सीधे बात करने के लिए, या कस्टम ऑर्डर डिज़ाइन भेजने के लिए, आप हमसे व्हाट्सएप पर तुरंत जुड़ सकते हैं:"
        : "Thank you for reaching out! To consult directly with our master goldsmiths or send custom design references, connect with us on WhatsApp:",
      action: {
        type: "whatsapp",
        label: "Chat Directly on WhatsApp",
        href: `https://wa.me/91${whatsAppNumber}?text=${encodeURIComponent(`Hi Omar Jewellers, I have a question: ${userQuery}`)}`
      }
    };
  };

  const handleSend = (textToSend?: string) => {
    const messageText = textToSend || input;
    if (!messageText.trim()) return;

    const userMessage: Message = {
      id: `user-${Date.now()}`,
      sender: "user",
      text: messageText,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    setMessages((prev) => [...prev, userMessage]);
    if (!textToSend) setInput("");
    setIsTyping(true);

    // Simulate AI thinking and typing response
    setTimeout(() => {
      const response = generateAIResponse(messageText);
      const aiMessage: Message = {
        id: `ai-${Date.now()}`,
        sender: "ai",
        text: response.text,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        action: response.action,
      };
      setMessages((prev) => [...prev, aiMessage]);
      setIsTyping(false);
    }, 700);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      handleSend();
    }
  };

  const quickQuestions = language === "hi" ? [
    "💰 आज का सोने का भाव?",
    "✨ 10% बनवाई छूट कोड?",
    "📍 शोरूम का पता और समय?",
    "🛡️ बीआईएस हॉलमार्क शुद्धता?",
    "📑 गिरवी और उधारी नियम?"
  ] : [
    "💰 Today's Gold Rates?",
    "✨ 10% OFF Making Offer?",
    "📍 Showroom Address?",
    "🛡️ BIS Hallmark Purity?",
    "📑 Girvi / Loan Rules?"
  ];

  return (
    <div className="fixed bottom-6 right-6 z-50 font-sans">
      {/* Floating Chat Trigger Button */}
      <AnimatePresence>
        {!isOpen && (
          <motion.button
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0, opacity: 0 }}
            whileHover={{ scale: 1.08 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setIsOpen(true)}
            className="relative group p-4 bg-gradient-to-r from-neutral-950 via-[#1a1105] to-neutral-950 border border-[#dfba73]/40 rounded-full shadow-[0_0_30px_rgba(223,186,115,0.25)] flex items-center justify-center text-[#dfba73] hover:border-[#dfba73] transition-all cursor-pointer"
            aria-label="Open AI Concierge Chat"
          >
            {/* Ambient Gold Pulse Ring */}
            <div className="absolute inset-0 rounded-full border border-[#dfba73]/30 animate-ping pointer-events-none opacity-40" />

            <Bot className="w-6 h-6 text-[#dfba73] group-hover:rotate-12 transition-transform duration-300" />

            {/* Unread Badge */}
            {unreadCount > 0 && (
              <span className="absolute -top-1 -right-1 w-5 h-5 bg-[#dfba73] text-neutral-950 font-bold text-[10px] rounded-full flex items-center justify-center border border-neutral-950 shadow-md">
                1
              </span>
            )}

            {/* Tooltip on Hover */}
            <span className="absolute right-full mr-3 px-3 py-1.5 bg-neutral-950/90 border border-[#dfba73]/30 text-[#dfba73] text-[10px] font-bold tracking-wider uppercase rounded-md whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none shadow-lg">
              ✨ OJ AI Concierge
            </span>
          </motion.button>
        )}
      </AnimatePresence>

      {/* Main Glassmorphic Chat Window */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 40, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 40, scale: 0.95 }}
            transition={{ duration: 0.3, ease: "easeOut" }}
            className="w-[92vw] sm:w-[380px] h-[540px] max-h-[82vh] bg-gradient-to-b from-neutral-950/95 via-neutral-900/95 to-neutral-950/95 border border-[#dfba73]/30 rounded-2xl shadow-2xl backdrop-blur-xl flex flex-col overflow-hidden relative"
          >
            {/* Chat Window Header */}
            <div className="p-4 bg-[#140b0c] border-b border-[#dfba73]/20 flex items-center justify-between z-10">
              <div className="flex items-center gap-3">
                <div className="relative w-10 h-10 rounded-full border border-[#dfba73]/40 bg-neutral-900 flex items-center justify-center p-1">
                  <Bot className="w-5 h-5 text-[#dfba73]" />
                  <span className="absolute bottom-0 right-0 w-2.5 h-2.5 bg-green-500 rounded-full border border-neutral-950" />
                </div>
                <div>
                  <h3 className="font-serif text-sm font-semibold text-white tracking-wide flex items-center gap-1.5">
                    OJ AI Concierge
                    <Sparkles className="w-3.5 h-3.5 text-[#dfba73]" />
                  </h3>
                  <p className="font-sans text-[9px] text-[#dfba73] tracking-widest uppercase font-bold">
                    Omar Jewellers • Instant Support
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-1">
                <button
                  onClick={() => setMessages([initialGreeting])}
                  className="p-1.5 text-neutral-400 hover:text-[#dfba73] transition-colors rounded-lg"
                  title="Clear Chat History"
                >
                  <RefreshCw className="w-4 h-4" />
                </button>
                <button
                  onClick={() => setIsOpen(false)}
                  className="p-1.5 text-neutral-400 hover:text-white transition-colors rounded-lg"
                  aria-label="Close Chat"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>

            {/* Messages Scroll Area */}
            <div className="flex-grow p-4 overflow-y-auto space-y-4 scrollbar-thin scrollbar-thumb-[#dfba73]/20">
              {messages.map((msg) => (
                <motion.div
                  key={msg.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className={`flex flex-col ${msg.sender === "user" ? "items-end" : "items-start"}`}
                >
                  <div className="flex items-end gap-2 max-w-[85%]">
                    {msg.sender === "ai" && (
                      <div className="w-6 h-6 rounded-full border border-[#dfba73]/30 bg-neutral-900 flex items-center justify-center shrink-0 mb-1">
                        <Bot className="w-3.5 h-3.5 text-[#dfba73]" />
                      </div>
                    )}

                    <div
                      className={`p-3 rounded-2xl text-xs leading-relaxed ${
                        msg.sender === "user"
                          ? "bg-[#dfba73] text-neutral-950 font-medium rounded-br-none shadow-md"
                          : "bg-white/5 border border-[#dfba73]/15 text-neutral-100 rounded-bl-none backdrop-blur-xs"
                      }`}
                    >
                      <div className="whitespace-pre-wrap">{msg.text}</div>

                      {/* Action Button inside AI response if present */}
                      {msg.action && (
                        <a
                          href={msg.action.href}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="mt-3 inline-flex items-center gap-2 px-3 py-1.5 bg-[#dfba73] hover:bg-[#c5a059] text-neutral-950 text-[10px] font-bold tracking-wider uppercase rounded-md transition-all shadow-sm"
                        >
                          <MessageCircle className="w-3.5 h-3.5" />
                          {msg.action.label}
                        </a>
                      )}
                    </div>

                    {msg.sender === "user" && (
                      <div className="w-6 h-6 rounded-full border border-neutral-700 bg-neutral-800 flex items-center justify-center shrink-0 mb-1">
                        <User className="w-3.5 h-3.5 text-neutral-300" />
                      </div>
                    )}
                  </div>
                  <span className="text-[8px] text-neutral-500 mt-1 px-1">{msg.timestamp}</span>
                </motion.div>
              ))}

              {/* Typing Indicator */}
              {isTyping && (
                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex items-center gap-2">
                  <div className="w-6 h-6 rounded-full border border-[#dfba73]/30 bg-neutral-900 flex items-center justify-center shrink-0">
                    <Bot className="w-3.5 h-3.5 text-[#dfba73]" />
                  </div>
                  <div className="px-3 py-2 bg-white/5 border border-[#dfba73]/15 rounded-2xl rounded-bl-none flex items-center gap-1.5">
                    <span className="w-1.5 h-1.5 bg-[#dfba73] rounded-full animate-bounce" />
                    <span className="w-1.5 h-1.5 bg-[#dfba73] rounded-full animate-bounce [animation-delay:0.2s]" />
                    <span className="w-1.5 h-1.5 bg-[#dfba73] rounded-full animate-bounce [animation-delay:0.4s]" />
                  </div>
                </motion.div>
              )}
              <div ref={messagesEndRef} />
            </div>

            {/* Quick Suggestion Chips */}
            <div className="px-3 py-2 bg-neutral-950/80 border-t border-[#dfba73]/10 flex gap-2 overflow-x-auto scrollbar-none">
              {quickQuestions.map((q, idx) => (
                <button
                  key={idx}
                  onClick={() => handleSend(q)}
                  className="px-2.5 py-1 bg-[#dfba73]/10 hover:bg-[#dfba73]/20 border border-[#dfba73]/25 text-[#dfba73] text-[9px] font-semibold tracking-wider rounded-full whitespace-nowrap transition-colors shrink-0 cursor-pointer"
                >
                  {q}
                </button>
              ))}
            </div>

            {/* Chat Input Field */}
            <div className="p-3 bg-[#140b0c] border-t border-[#dfba73]/20 flex items-center gap-2">
              <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder={language === "hi" ? "पूछें: सोने के भाव, हॉलमार्क, पता..." : "Ask AI: rates, hallmarking, showroom..."}
                className="flex-grow bg-white/5 border border-[#dfba73]/20 focus:border-[#dfba73] px-3.5 py-2.5 text-xs text-white placeholder:text-neutral-500 rounded-xl outline-none transition-colors font-sans"
              />
              <button
                onClick={() => handleSend()}
                disabled={!input.trim()}
                className="p-2.5 bg-[#dfba73] hover:bg-[#c5a059] disabled:opacity-40 text-neutral-950 rounded-xl transition-all font-bold cursor-pointer"
                aria-label="Send Message"
              >
                <Send className="w-4 h-4" />
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
