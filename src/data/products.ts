export interface Product {
  id: string;
  name: string;
  category: "new-arrivals" | "best-sellers" | "bridal" | "daily-wear" | "silver";
  subCategory: string;
  price: number;
  rating: number;
  image: string;
  description: string;
  details: string[];
  materials: string;
}

export const products: Product[] = [
  {
    id: "oj-001",
    name: "Aura Hammered Gold Choker",
    category: "new-arrivals",
    subCategory: "Necklaces",
    price: 2100,
    rating: 4.9,
    image: "https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?q=80&w=800&auto=format&fit=crop",
    description: "An exquisite 22k solid gold collar necklace featuring a hand-hammered texture that catches the light with organic brilliance. The ultimate statement of modern Gen Z luxury.",
    materials: "22k Pure Gold, Hand-Textured finish",
    details: ["Collar diameter: 14.5cm", "Width: 8mm", "Weight: 24.5g", "Custom secure box clasp"]
  },
  {
    id: "oj-002",
    name: "Sculpted Wave Ring",
    category: "new-arrivals",
    subCategory: "Rings",
    price: 1150,
    rating: 5.0,
    image: "https://images.unsplash.com/photo-1605100804763-247f67b3557e?q=80&w=800&auto=format&fit=crop",
    description: "A fluid, undulating wave design cast in 18k solid champagne gold. Features a mirror-polish interior and a soft satin exterior for a refined tactile contrast.",
    materials: "18k Champagne Gold",
    details: ["Band width: 3.2mm to 6mm (variable)", "Comfort-fit curved interior", "Hand-finished polish", "Ethically refined gold"]
  },
  {
    id: "oj-003",
    name: "Crescent Gold Hoops",
    category: "new-arrivals",
    subCategory: "Earrings",
    price: 950,
    rating: 4.8,
    image: "https://images.unsplash.com/photo-1630019852942-f89202989a59?q=80&w=800&auto=format&fit=crop",
    description: "Sculpted crescent hoop earrings in 18k gold with a high-shine finish. Hollowed interior ensures comfortable, weightless daily wear.",
    materials: "18k Champagne Gold",
    details: ["Diameter: 25mm", "Width: 4mm", "Weight: 6.2g per pair", "Hollow structure for comfort"]
  },
  {
    id: "oj-004",
    name: "OJ Signature Dome Band",
    category: "best-sellers",
    subCategory: "Rings",
    price: 1350,
    rating: 4.9,
    image: "https://images.unsplash.com/photo-1602751584552-8ba73aad10e1?q=80&w=800&auto=format&fit=crop",
    description: "Our signature chunky gold dome ring. Re-imagined with a lighter, hollow core and a highly polished reflective finish that pairs perfectly with stackable bands.",
    materials: "18k Champagne Gold",
    details: ["Band width: 6.5mm at peak", "Weight: 8.4g", "Embossed interior 'OJ' brand hallmark", "Scratch-resistant coating"]
  },
  {
    id: "oj-005",
    name: "Artisan Hammered Gold Cuff",
    category: "best-sellers",
    subCategory: "Bracelets",
    price: 3400,
    rating: 5.0,
    image: "https://images.unsplash.com/photo-1611591437281-460bfbe1220a?q=80&w=800&auto=format&fit=crop",
    description: "A wide, striking statement cuff hand-formed from solid gold sheet. Features slightly flared edges and a micro-hammered pattern that whispers ancient luxury.",
    materials: "18k Solid Gold",
    details: ["Cuff width: 1.5 inches", "Adjustable open-back fit", "Total weight: 32g", "Crafted by master metalsmiths"]
  },
  {
    id: "oj-006",
    name: "Filigree Gold Chandelier Drops",
    category: "best-sellers",
    subCategory: "Earrings",
    price: 1850,
    rating: 4.7,
    image: "https://images.unsplash.com/photo-1635767798638-3e25273a8236?q=80&w=800&auto=format&fit=crop",
    description: "Intricately detailed chandelier drop earrings featuring traditional wire-wrapped gold filigree in a contemporary silhouette.",
    materials: "22k Champagne Gold",
    details: ["Length: 45mm", "Weight: 10.4g per pair", "Secure post with friction backs", "Hand-assembled links"]
  },
  {
    id: "oj-007",
    name: "Royal Heritage 22k Choker",
    category: "bridal",
    subCategory: "Sets",
    price: 14500,
    rating: 5.0,
    image: "https://images.unsplash.com/photo-1599643477877-530eb83abc8e?q=80&w=800&auto=format&fit=crop",
    description: "A masterpiece of gold craftsmanship. A solid 22k gold bridal choker featuring detailed hand-engraving, intricate beadwork, and satin-finished gold plates.",
    materials: "22k Solid Gold",
    details: ["Adjustable golden thread dori closure", "Necklace weight: 88g", "Includes matching drop earrings (18g)", "Traditional heirloom design"]
  },
  {
    id: "oj-008",
    name: "Eternity Hand-Carved Gold Band",
    category: "bridal",
    subCategory: "Rings",
    price: 2600,
    rating: 4.9,
    image: "https://images.unsplash.com/photo-1535632066927-ab7c9ab60908?q=80&w=800&auto=format&fit=crop",
    description: "An unbroken gold band intricately hand-carved with dynamic geometric patterns, reflecting light from all facets. A timeless bond cast in pure 22k gold.",
    materials: "22k Gold",
    details: ["Band width: 5.5mm", "Hand-carved facets", "Thickness: 1.8mm", "Comfort-fit interior profile"]
  },
  {
    id: "oj-009",
    name: "Temple Floral Cascade Collar",
    category: "bridal",
    subCategory: "Sets",
    price: 11200,
    rating: 4.8,
    image: "https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?q=80&w=800&auto=format&fit=crop",
    description: "A gorgeous cascade of hand-formed gold flowers and hanging droplets. Made with 22k gold with soft brushed, matte, and highly polished contrasting layers.",
    materials: "22k Gold",
    details: ["Set includes: Collar necklace & earrings", "Necklace weight: 72g", "Hand-polished highlights", "Ships in signature leather vault case"]
  },
  {
    id: "oj-010",
    name: "Minimalist Gold Twist Band",
    category: "daily-wear",
    subCategory: "Rings",
    price: 450,
    rating: 4.7,
    image: "https://images.unsplash.com/photo-1605100804763-247f67b3557e?q=80&w=800&auto=format&fit=crop",
    description: "A dainty, stackable band crafted to resemble two strands of fine gold wire twisted together. Crafted for layering or as a subtle daily accent.",
    materials: "14k Solid Gold",
    details: ["Band width: 1.5mm", "Weight: 1.8g", "Perfect for multi-ring stacks", "Scratch-resistant finish"]
  },
  {
    id: "oj-011",
    name: "Helix Link Gold Bracelet",
    category: "daily-wear",
    subCategory: "Bracelets",
    price: 820,
    rating: 4.8,
    image: "https://images.unsplash.com/photo-1573408301185-9146fe634ad0?q=80&w=800&auto=format&fit=crop",
    description: "A contemporary link bracelet featuring geometric helix links in champagne gold. Offers a clean, structured silhouette perfect for everyday wear.",
    materials: "14k Champagne Gold",
    details: ["Length: 6.5 inches + 1 inch extension", "Lobster clasp closure", "Width: 3.5mm", "Engraved logo tag"]
  },
  {
    id: "oj-012",
    name: "Petite Gold Sphere Studs",
    category: "daily-wear",
    subCategory: "Earrings",
    price: 380,
    rating: 4.9,
    image: "https://images.unsplash.com/photo-1506630448388-4e683c67ddb0?q=80&w=800&auto=format&fit=crop",
    description: "High-polish solid gold spheres resting on 14k gold posts. Sleek, classic, and completely sleep-safe. Essential for any jewelry capsule.",
    materials: "14k Solid Gold",
    details: ["Sphere diameter: 5mm", "Solid construction", "Secure push-back posts", "Hypoallergenic backings"]
  },
  // Sterling Silver Collection
  {
    id: "oj-silver-001",
    name: "Royal Sterling Silver Payal",
    category: "silver",
    subCategory: "Anklets",
    price: 220,
    rating: 4.9,
    image: "https://images.unsplash.com/photo-1535632066927-ab7c9ab60908?q=80&w=500&auto=format&fit=crop",
    description: "Traditional Indian wedding anklet set hand-crafted in 925 sterling silver with micro-carved bells (Ghungroo) that create a soft musical chime.",
    materials: "925 Sterling Silver, Anti-tarnish coating",
    details: ["Length: 10.2 inches", "Total weight: 64g per pair", "Secure hook closure", "Hand-assembled links"]
  },
  {
    id: "oj-silver-002",
    name: "Oxidized Temple Jhumkas",
    category: "silver",
    subCategory: "Earrings",
    price: 120,
    rating: 4.8,
    image: "https://images.unsplash.com/photo-1635767798638-3e25273a8236?q=80&w=500&auto=format&fit=crop",
    description: "Stunning temple earrings made from 925 silver with detailed carvings of Goddess Lakshmi, oxidized to highlight the antique craftsmanship.",
    materials: "925 Sterling Silver, Oxidized finish",
    details: ["Length: 55mm", "Weight: 18.2g per pair", "Secure post push-back", "Includes dangling silver beads"]
  },
  {
    id: "oj-silver-003",
    name: "Auspicious 999 Silver Coin (50g)",
    category: "silver",
    subCategory: "Coins",
    price: 80,
    rating: 5.0,
    image: "https://images.unsplash.com/photo-1607604276583-eef5d076aa5f?q=80&w=500&auto=format&fit=crop",
    description: "Pure 99.9% fine silver coin featuring embossed motifs of Lord Ganesha and Goddess Lakshmi. Perfect for Diwali puja, gifting, and investments.",
    materials: "999 Fine Silver",
    details: ["Weight: 50.0 grams", "Diameter: 44mm", "BIS Certified purity hallmark", "Arrives in premium acrylic capsule"]
  },
  {
    id: "oj-silver-004",
    name: "Sterling Silver Curb Chain",
    category: "silver",
    subCategory: "Necklaces",
    price: 90,
    rating: 4.7,
    image: "https://images.unsplash.com/photo-1599643477877-530eb83abc8e?q=80&w=500&auto=format&fit=crop",
    description: "A solid sterling silver curb link chain. Diamond-cut edges catch the light, offering a clean polished look for modern daily outfits.",
    materials: "925 Sterling Silver",
    details: ["Length: 20 inches", "Width: 4.5mm", "Weight: 22g", "Heavy-duty lobster clasp"]
  },
  {
    id: "oj-silver-005",
    name: "Sterling Silver Designer Twist Ring",
    category: "silver",
    subCategory: "Rings",
    price: 110,
    rating: 4.8,
    image: "https://images.unsplash.com/photo-1605100804763-247f67b3557e?q=80&w=500&auto=format&fit=crop",
    description: "An elegant, minimalist sterling silver twist ring with a high-shine polish. Comfort-fit interior makes it perfect for daily wear.",
    materials: "925 Sterling Silver",
    details: ["Band width: 3.0mm", "High polish finish", "Comfort curve inside", "Sizing options available"]
  },
  {
    id: "oj-silver-006",
    name: "Traditional Silver Bichhiya (Toe Rings)",
    category: "silver",
    subCategory: "Toe Rings",
    price: 65,
    rating: 4.9,
    image: "https://images.unsplash.com/photo-1602751584552-8ba73aad10e1?q=80&w=500&auto=format&fit=crop",
    description: "A beautiful set of hand-crafted silver toe rings featuring traditional filigree work, adjustable open-back loops.",
    materials: "925 Sterling Silver",
    details: ["Includes 1 pair of toe rings", "Adjustable open band", "Lightweight comfortable shape", "Anti-tarnish finished coating"]
  },
  {
    id: "oj-silver-007",
    name: "Luxury Silver Pooja Thali Set",
    category: "silver",
    subCategory: "Pooja Set",
    price: 480,
    rating: 5.0,
    image: "https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?q=80&w=500&auto=format&fit=crop",
    description: "A complete puja set crafted in pure silver, including a thali plate, diya cup, incense stand, and kumkum bowl.",
    materials: "80% Pure Silver",
    details: ["Plate diameter: 8 inches", "Total set weight: 180g", "Exquisite flower carvings", "BIS hallmarked assurance"]
  },
  {
    id: "oj-silver-008",
    name: "999 Pure Silver Ganesha Idol",
    category: "silver",
    subCategory: "Idols",
    price: 350,
    rating: 5.0,
    image: "https://images.unsplash.com/photo-1608962914070-dfd3744663aa?q=80&w=500&auto=format&fit=crop",
    description: "Exquisitely detailed Ganesha Idol crafted in 99.9% fine silver. Perfect for pooja altars, home decor, and divine gifting.",
    materials: "999 Fine Silver, Antique finish",
    details: ["Height: 3.5 inches", "Weight: 85.0g", "BIS hallmarked purity stamp", "Arrives in velvet lined showcase box"]
  },
  {
    id: "oj-silver-009",
    name: "Sterling Silver Royal Kundan Payal",
    category: "silver",
    subCategory: "Anklets",
    price: 165,
    rating: 4.9,
    image: "https://images.unsplash.com/photo-1535632066927-ab7c9ab60908?q=80&w=500&auto=format&fit=crop",
    description: "Exquisite pair of anklets embellished with royal Kundan stones, fine micro-pearl drops, and detailed silver work.",
    materials: "925 Sterling Silver, Kundan stone",
    details: ["Includes 1 pair of anklets", "Traditional hook lock", "Purity certificate included", "Total length: 10.5 inches"]
  },
  {
    id: "oj-silver-010",
    name: "999 Fine Silver Lakshmi & Ganesha Combo Coin (20g)",
    category: "silver",
    subCategory: "Coins",
    price: 95,
    rating: 5.0,
    image: "https://images.unsplash.com/photo-1607604276583-eef5d076aa5f?q=80&w=500&auto=format&fit=crop",
    description: "Double-sided auspicious coin featuring Lakshmi and Ganesha in ultra-relief minting. Packed in a tamper-proof card.",
    materials: "999 Fine Silver",
    details: ["Weight: 20.0 grams", "Diameter: 38mm", "Serialized assay certificate", "Ideal for Diwali pooja and gifting"]
  },
  {
    id: "oj-silver-011",
    name: "Traditional Royal Silver Bichhiya Set (4 Pieces)",
    category: "silver",
    subCategory: "Toe Rings",
    price: 85,
    rating: 4.8,
    image: "https://images.unsplash.com/photo-1602751584552-8ba73aad10e1?q=80&w=500&auto=format&fit=crop",
    description: "A complete set of four adjustable toe rings decorated with traditional floral carvings and auspicious red gemstones.",
    materials: "925 Sterling Silver",
    details: ["Includes 4 toe rings", "Adjustable open bands", "Skin friendly anti-tarnish coating", "Gift box included"]
  },
  {
    id: "oj-silver-012",
    name: "999 Pure Silver Saraswati Idol",
    category: "silver",
    subCategory: "Idols",
    price: 290,
    rating: 4.9,
    image: "https://images.unsplash.com/photo-1608962914070-dfd3744663aa?q=80&w=500&auto=format&fit=crop",
    description: "Highly detailed miniature idol of Goddess Saraswati playing the veena, beautifully carved from 99.9% pure solid silver.",
    materials: "999 Fine Silver",
    details: ["Height: 3.0 inches", "Weight: 68g", "Hallmarked purity assurance", "Arrives in premium packaging"]
  },
  {
    id: "oj-silver-013",
    name: "Sterling Silver Royal Peacock Kada",
    category: "silver",
    subCategory: "Bracelets",
    price: 245,
    rating: 4.9,
    image: "https://images.unsplash.com/photo-1611591437281-460bfbe1220a?q=80&w=500&auto=format&fit=crop",
    description: "An adjustable antique finish kada featuring double peacock head motifs and detailed silver wire carvings.",
    materials: "925 Sterling Silver, Oxidized finish",
    details: ["Diameter: 6.2cm (adjustable)", "Weight: 38g", "Traditional design", "Anti-tarnish coating"]
  },
  {
    id: "oj-silver-014",
    name: "Oxidized Silver Royal Peacock Jhumkas",
    category: "silver",
    subCategory: "Earrings",
    price: 135,
    rating: 4.8,
    image: "https://images.unsplash.com/photo-1635767798638-3e25273a8236?q=80&w=500&auto=format&fit=crop",
    description: "Traditional peacock-shaped jhumka earrings featuring delicate dome drops and mini silver bead hangings.",
    materials: "925 Sterling Silver",
    details: ["Length: 5.5cm", "Weight: 14g per pair", "Secure push back closure", "Hand-assembled links"]
  },
  {
    id: "oj-silver-015",
    name: "999 Fine Silver Lakshmi & Ganesha Combo Coin (50g)",
    category: "silver",
    subCategory: "Coins",
    price: 220,
    rating: 5.0,
    image: "https://images.unsplash.com/photo-1607604276583-eef5d076aa5f?q=80&w=500&auto=format&fit=crop",
    description: "Heavy auspicious silver coin representing wealth and prosperity, embossed with Laxmi-Ganesh motifs.",
    materials: "999 Fine Silver",
    details: ["Weight: 50.0 grams", "Diameter: 50mm", "Govt approved assay mark", "Comes in premium wooden gift box"]
  },
  {
    id: "oj-silver-016",
    name: "Sterling Silver Delicate Choker Necklace",
    category: "silver",
    subCategory: "Necklaces",
    price: 380,
    rating: 4.7,
    image: "https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?q=80&w=500&auto=format&fit=crop",
    description: "A gorgeous modern silver choker with teardrop silver dangles that sit beautifully on the collarbone.",
    materials: "925 Sterling Silver",
    details: ["Length: 14 inches + 2 inches extender", "Weight: 18.5g", "Lobster clasp lock", "BIS 925 stamped"]
  }
];
