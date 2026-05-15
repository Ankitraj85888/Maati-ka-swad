/* =====================================================
   MAATI KA SWAD — Product Data Store
   Merges local rich data with live backend data
   ===================================================== */
'use strict';

// ── Local rich product data (descriptions, benefits, tags) ──
window.PRODUCTS_LOCAL = [
  // ─── PICKLES ─────────────────────────────────────
  {
    id: 1, name: "Aam Ka Achar", nameHi: "आम का अचार",
    slug: "mango-pickle",
    category: "pickles", categoryLabel: "Pickles",
    price: 149, mrp: 199, weight: "250g",
    rating: 4.8, reviews: 234, stock: 48,
    badge: "bestseller",
    description: "A timeless classic from grandmother's kitchen. Our Aam Ka Achar is made with hand-picked raw mangoes, carefully blended with sun-dried spices, mustard oil, and generations-old secret masalas. Every jar carries the aroma of a traditional Indian home.",
    ingredients: ["Raw Mango", "Mustard Oil", "Salt", "Fenugreek Seeds", "Fennel Seeds", "Red Chilli", "Turmeric", "Asafoetida", "Nigella Seeds"],
    benefits: [
      { icon: "🌿", title: "Rich in Vitamin C", desc: "Raw mangoes are a great source of vitamin C, boosting immunity." },
      { icon: "🔥", title: "Digestive Aid", desc: "Traditional spices like fenugreek aid in digestion." },
      { icon: "💯", title: "No Preservatives", desc: "Naturally preserved with salt and oil — no chemicals." },
      { icon: "👵", title: "Authentic Recipe", desc: "Made following a 3-generation-old family recipe." }
    ],
    tags: ["traditional", "no-preservatives", "bestseller", "mango"],
    images: ["assets/images/prod-mango-pickle.jpg"],
    emoji: "🥭", color: "#FF9A00", colorDark: "#E07000"
  },
  {
    id: 2, name: "Mix Veg Achar", nameHi: "मिक्स सब्जी अचार",
    slug: "mix-veg-pickle",
    category: "pickles", categoryLabel: "Pickles",
    price: 129, mrp: 179, weight: "250g",
    rating: 4.6, reviews: 187, stock: 35,
    badge: "new",
    description: "A vibrant medley of seasonal vegetables — carrot, cauliflower, turnip, and green chilli — pickled to perfection in a tangy, spicy mustard oil base. A colorful burst of flavors on your plate.",
    ingredients: ["Carrot", "Cauliflower", "Turnip", "Green Chilli", "Mustard Oil", "Salt", "Garlic", "Ginger"],
    benefits: [
      { icon: "🥕", title: "Nutrient-Rich Vegetables", desc: "Multiple vegetables provide a range of vitamins and minerals." },
      { icon: "🧄", title: "Immunity Booster", desc: "Garlic and ginger are known for their anti-microbial properties." },
      { icon: "💯", title: "No Artificial Colors", desc: "Natural colors from vegetables — nothing artificial." },
      { icon: "🌶️", title: "Good for Metabolism", desc: "Green chilli helps boost metabolism naturally." }
    ],
    tags: ["mix", "veg", "colorful", "tangy"],
    images: [], emoji: "🥗", color: "#4CAF50", colorDark: "#2E7D32"
  },
  {
    id: 3, name: "Lehsun Ka Achar", nameHi: "लहसुन का अचार",
    slug: "garlic-pickle",
    category: "pickles", categoryLabel: "Pickles",
    price: 159, mrp: 219, weight: "200g",
    rating: 4.7, reviews: 156, stock: 22,
    badge: "organic",
    description: "Bold, pungent, and utterly addictive. Our garlic pickle uses whole cloves of fresh garlic, marinated in a rich blend of spices and mustard oil for 15 days before jarring.",
    ingredients: ["Garlic Cloves", "Mustard Oil", "Red Chilli", "Salt", "Fenugreek", "Asafoetida", "Lemon Juice"],
    benefits: [
      { icon: "❤️", title: "Heart Healthy", desc: "Garlic is proven to support cardiovascular health." },
      { icon: "🛡️", title: "Anti-bacterial", desc: "Allicin in garlic has powerful anti-bacterial properties." },
      { icon: "💊", title: "Blood Pressure", desc: "Regular consumption may help regulate blood pressure." },
      { icon: "🧪", title: "Antioxidant-Rich", desc: "Packed with antioxidants that fight free radicals." }
    ],
    tags: ["garlic", "organic", "bold"],
    images: [], emoji: "🧄", color: "#9B59B6", colorDark: "#6C3483"
  },
  {
    id: 4, name: "Nimbu Ka Achar", nameHi: "नींबू का अचार",
    slug: "lemon-pickle",
    category: "pickles", categoryLabel: "Pickles",
    price: 99, mrp: 139, weight: "200g",
    rating: 4.5, reviews: 143, stock: 60,
    badge: null,
    description: "Tangy, citrusy, and incredibly refreshing. Our lemon pickle is sun-cured — whole lemons stuffed with spiced salt left to mature in the Indian sun for 21 days.",
    ingredients: ["Lemon", "Salt", "Red Chilli Powder", "Turmeric", "Cumin Seeds", "Fenugreek", "Black Pepper"],
    benefits: [
      { icon: "🍋", title: "Vitamin C Powerhouse", desc: "Lemon is one of the richest sources of Vitamin C." },
      { icon: "🌞", title: "Sun-Cured", desc: "Traditional sun-curing process enhances flavor and shelf life." },
      { icon: "✨", title: "Detoxifying", desc: "Lemon aids liver function and natural detoxification." }
    ],
    tags: ["lemon", "tangy", "sun-dried"],
    images: [], emoji: "🍋", color: "#F1C40F", colorDark: "#D4AC0D"
  },
  // ─── SPICES ──────────────────────────────────────
  {
    id: 5, name: "Garam Masala", nameHi: "गरम मसाला",
    slug: "garam-masala",
    category: "spices", categoryLabel: "Spices",
    price: 89, mrp: 129, weight: "100g",
    rating: 4.9, reviews: 312, stock: 75,
    badge: "bestseller",
    description: "The soul of Indian cooking. Our Garam Masala is a carefully calibrated blend of whole spices — slow-roasted and stone-ground to preserve their essential oils and full aroma.",
    ingredients: ["Cinnamon", "Cardamom", "Cloves", "Black Pepper", "Cumin", "Coriander", "Bay Leaf", "Nutmeg", "Star Anise", "Mace"],
    benefits: [
      { icon: "🔥", title: "Warming Properties", desc: "Strengthens digestion and improves metabolism." },
      { icon: "💨", title: "Freshly Ground", desc: "Stone-ground to maximum aroma — far superior to machine-ground." },
      { icon: "🌿", title: "No Additives", desc: "Pure spices only — no fillers, no starch, no artificial color." }
    ],
    tags: ["spice-blend", "aromatic", "stone-ground", "bestseller"],
    images: ["assets/images/prod-garam-masala.jpg"],
    emoji: "🌶️", color: "#C0392B", colorDark: "#922B21"
  },
  {
    id: 6, name: "Haldi Powder", nameHi: "हल्दी पाउडर",
    slug: "turmeric-powder",
    category: "spices", categoryLabel: "Spices",
    price: 69, mrp: 99, weight: "100g",
    rating: 4.7, reviews: 198, stock: 90,
    badge: "organic",
    description: "\"The Golden Spice.\" Our turmeric is sourced directly from Erode, Tamil Nadu — known for the world's finest turmeric. High curcumin content (4%+) for maximum health benefits.",
    ingredients: ["Pure Turmeric (Curcuma longa)"],
    benefits: [
      { icon: "🌟", title: "High Curcumin (4%+)", desc: "Our turmeric has more than double the curcumin of regular brands." },
      { icon: "🛡️", title: "Anti-inflammatory", desc: "Curcumin is one of the most powerful anti-inflammatory compounds." },
      { icon: "🌿", title: "100% Pure", desc: "No added starch, no lead chromate — lab tested for purity." }
    ],
    tags: ["organic", "pure", "high-curcumin"],
    images: [], emoji: "💛", color: "#F39C12", colorDark: "#D68910"
  },
  {
    id: 7, name: "Lal Mirch Powder", nameHi: "लाल मिर्च पाउडर",
    slug: "red-chilli-powder",
    category: "spices", categoryLabel: "Spices",
    price: 79, mrp: 109, weight: "100g",
    rating: 4.6, reviews: 167, stock: 55,
    badge: null,
    description: "Fiery, vibrant, and deeply flavorful. Made from sun-dried Byadgi and Kashmiri chilles — brilliant red color with moderate heat.",
    ingredients: ["Byadgi Chilli", "Kashmiri Chilli"],
    benefits: [
      { icon: "🌈", title: "Natural Red Color", desc: "Byadgi chilli gives rich color without excessive heat." },
      { icon: "🔥", title: "Metabolism Boost", desc: "Capsaicin naturally boosts metabolic rate." }
    ],
    tags: ["chilli", "byadgi", "kashmiri"],
    images: [], emoji: "🌶️", color: "#E74C3C", colorDark: "#B03A2E"
  },
  {
    id: 8, name: "Dhaniya Powder", nameHi: "धनिया पाउडर",
    slug: "coriander-powder",
    category: "spices", categoryLabel: "Spices",
    price: 59, mrp: 79, weight: "100g",
    rating: 4.5, reviews: 134, stock: 80,
    badge: null,
    description: "Mildly citrusy, earthy and warm. Our coriander seeds are slow-roasted until fragrant, then stone-ground for unmatched aroma.",
    ingredients: ["Coriander Seeds (Dhania)"],
    benefits: [
      { icon: "🫃", title: "Digestive Support", desc: "Coriander is widely used in Ayurveda for digestive health." },
      { icon: "❄️", title: "Cooling Properties", desc: "Coriander has natural cooling properties for the body." }
    ],
    tags: ["coriander", "stone-ground", "fresh"],
    images: [], emoji: "🌿", color: "#27AE60", colorDark: "#1E8449"
  },
  // ─── SNACKS ──────────────────────────────────────
  {
    id: 9, name: "Mathri", nameHi: "मठरी",
    slug: "mathri",
    category: "snacks", categoryLabel: "Snacks",
    price: 119, mrp: 159, weight: "200g",
    rating: 4.7, reviews: 221, stock: 40,
    badge: "bestseller",
    description: "The quintessential North Indian tea-time snack. Pure wheat flour, ghee, and carom seeds — hand-kneaded and slow-fried to achieve perfect crunchy, flaky texture.",
    ingredients: ["Wheat Flour", "Pure Ghee", "Carom Seeds (Ajwain)", "Cumin Seeds", "Salt", "Black Pepper"],
    benefits: [
      { icon: "🫙", title: "Made with Pure Ghee", desc: "We use only desi ghee — no dalda, no refined oil." },
      { icon: "🤍", title: "No Maida", desc: "Unlike commercial variants, we avoid refined flour (maida)." }
    ],
    tags: ["flaky", "ghee", "ajwain", "tea-snack"],
    images: ["assets/images/prod-mathri.jpg"],
    emoji: "🫓", color: "#D4A017", colorDark: "#A67C00"
  },
  {
    id: 10, name: "Namak Para", nameHi: "नमक पारे",
    slug: "namak-para",
    category: "snacks", categoryLabel: "Snacks",
    price: 99, mrp: 139, weight: "200g",
    rating: 4.5, reviews: 145, stock: 38,
    badge: null,
    description: "Diamond-shaped, airy, crispy, and lightly salted. A festival staple made with pure ghee and a hint of ajwain for that signature warm aftertaste.",
    ingredients: ["Wheat Flour", "Ghee", "Salt", "Carom Seeds", "Black Pepper", "Cumin"],
    benefits: [
      { icon: "🎊", title: "Festival Snack", desc: "A traditional staple at Diwali, Holi, and festivals." },
      { icon: "🤍", title: "Pure Ghee", desc: "Made with desi cow ghee for authentic taste." }
    ],
    tags: ["crispy", "light", "festival"],
    images: [], emoji: "🥨", color: "#C8A882", colorDark: "#8B6914"
  },
  {
    id: 11, name: "Besan Sev", nameHi: "बेसन सेव",
    slug: "besan-sev",
    category: "snacks", categoryLabel: "Snacks",
    price: 109, mrp: 149, weight: "200g",
    rating: 4.6, reviews: 178, stock: 50,
    badge: "new",
    description: "Thin, crunchy, golden sev made from fresh chickpea flour. A versatile snack — eat straight, sprinkle over chaat, or crush into a bhel.",
    ingredients: ["Chickpea Flour (Besan)", "Oil", "Salt", "Red Chilli", "Turmeric", "Carom Seeds"],
    benefits: [
      { icon: "💪", title: "High Protein (Chickpea)", desc: "Besan is a naturally high-protein flour." },
      { icon: "🚫", title: "No MSG", desc: "Zero MSG, zero artificial flavoring — pure besan taste." }
    ],
    tags: ["chickpea", "crunchy", "versatile"],
    images: [], emoji: "🟡", color: "#FFA500", colorDark: "#E65100"
  },
  {
    id: 12, name: "Chakli", nameHi: "चकली",
    slug: "chakli",
    category: "snacks", categoryLabel: "Snacks",
    price: 129, mrp: 179, weight: "200g",
    rating: 4.8, reviews: 203, stock: 25,
    badge: null,
    description: "Star-shaped spiral snacks from the Maharashtrian tradition. Rice flour and spices deep-fried to hollow, crisp perfection.",
    ingredients: ["Rice Flour", "Urad Dal Flour", "Sesame Seeds", "Cumin", "Red Chilli", "Salt", "Oil"],
    benefits: [
      { icon: "⭐", title: "Hollow & Crispy", desc: "Traditional press technique creates a perfectly light hollow inside." },
      { icon: "🎯", title: "Rich in Sesame", desc: "Sesame seeds add calcium and a nutty depth." }
    ],
    tags: ["rice-flour", "spiral", "maharashtrian"],
    images: [], emoji: "🍩", color: "#8D6E63", colorDark: "#5D4037"
  },
  // ─── SWEETS ──────────────────────────────────────
  {
    id: 13, name: "Ghee Ke Ladoo", nameHi: "घी के लड्डू",
    slug: "ghee-ladoo",
    category: "sweets", categoryLabel: "Sweets",
    price: 199, mrp: 259, weight: "250g",
    rating: 4.9, reviews: 287, stock: 30,
    badge: "bestseller",
    description: "The king of Indian sweets. Pure desi cow ghee, freshly roasted besan, fine sugar, and fragrant cardamom. Each ladoo hand-rolled with love.",
    ingredients: ["Besan", "Pure Desi Ghee", "Sugar", "Green Cardamom", "Cashews", "Almonds", "Raisins"],
    benefits: [
      { icon: "🐄", title: "Desi Cow Ghee", desc: "Made with A2 ghee from grass-fed desi cows — not refined butter." },
      { icon: "🎁", title: "Perfect Gift", desc: "Beautifully packaged — ideal for festivals, weddings, and gifting." }
    ],
    tags: ["ghee", "ladoo", "festival", "gift", "bestseller"],
    images: ["assets/images/prod-ghee-ladoo.jpg"],
    emoji: "✨", color: "#FFD700", colorDark: "#FFA000"
  },
  {
    id: 14, name: "Besan Ki Barfi", nameHi: "बेसन की बर्फी",
    slug: "besan-barfi",
    category: "sweets", categoryLabel: "Sweets",
    price: 179, mrp: 239, weight: "250g",
    rating: 4.7, reviews: 165, stock: 20,
    badge: null,
    description: "Smooth, dense, and melt-in-the-mouth. Slow-cooked for 45 minutes until perfectly caramelized, set in pure ghee. Topped with silver vark.",
    ingredients: ["Chickpea Flour", "Pure Ghee", "Sugar", "Cardamom", "Pistachio", "Silver Vark"],
    benefits: [
      { icon: "⏱️", title: "Slow-Cooked 45 Min", desc: "Patience is key — the slow roast gives it unmatched depth." },
      { icon: "💎", title: "Silver Vark Topped", desc: "Traditional silver leaf adds a touch of festive elegance." }
    ],
    tags: ["barfi", "chickpea", "silver-vark"],
    images: [], emoji: "🟤", color: "#8D6E63", colorDark: "#4E342E"
  },
  {
    id: 15, name: "Khajur Roll", nameHi: "खजूर रोल",
    slug: "khajur-roll",
    category: "sweets", categoryLabel: "Sweets",
    price: 219, mrp: 299, weight: "200g",
    rating: 4.8, reviews: 134, stock: 18,
    badge: "organic",
    description: "A naturally sweet, guilt-free indulgence. Made entirely from Medjool dates, roasted nuts, seeds, and cardamom — no refined sugar.",
    ingredients: ["Medjool Dates", "Almonds", "Cashews", "Walnut", "Pumpkin Seeds", "Cardamom", "Desiccated Coconut"],
    benefits: [
      { icon: "🚫", title: "Zero Refined Sugar", desc: "Sweetened entirely by dates — no added sugar whatsoever." },
      { icon: "🌱", title: "Diabetic-Friendly", desc: "Lower glycemic impact than traditional sugar sweets." }
    ],
    tags: ["no-sugar", "dates", "nuts", "healthy", "organic"],
    images: [], emoji: "🟤", color: "#6D4C41", colorDark: "#3E2723"
  },
  {
    id: 16, name: "Atta Pinni", nameHi: "आटा पिन्नी",
    slug: "atta-pinni",
    category: "sweets", categoryLabel: "Sweets",
    price: 189, mrp: 249, weight: "250g",
    rating: 4.7, reviews: 112, stock: 27,
    badge: null,
    description: "A Punjabi winter super-food. Whole wheat flour slow-roasted in desi ghee, mixed with jaggery, gond (edible gum), and warming spices. Traditionally given to new mothers for strength.",
    ingredients: ["Whole Wheat Flour", "Pure Ghee", "Jaggery", "Gond (Edible Gum)", "Dry Ginger Powder", "Cardamom", "Dry Fruits"],
    benefits: [
      { icon: "🤰", title: "Postpartum Nourishment", desc: "A traditional Ayurvedic food for strength after childbirth." },
      { icon: "🔥", title: "Warming Food", desc: "Dry ginger and gond generate internal heat — ideal in winter." }
    ],
    tags: ["punjabi", "atta", "jaggery", "gond", "winter"],
    images: [], emoji: "🌾", color: "#A1887F", colorDark: "#6D4C41"
  }
];

window.CATEGORIES = [
  { id: "pickles", name: "Pickles", nameHi: "अचार", emoji: "🥭", count: 4, image: "assets/images/cat-pickles.jpg", color: "#FF9A00", desc: "Hand-crafted with sun-dried spices" },
  { id: "spices",  name: "Spices",  nameHi: "मसाले", emoji: "🌶️", count: 4, image: "assets/images/cat-spices.jpg",  color: "#E74C3C", desc: "Stone-ground for maximum aroma" },
  { id: "snacks",  name: "Snacks",  nameHi: "नमकीन", emoji: "🫓", count: 4, image: "assets/images/cat-snacks.jpg",  color: "#D4A017", desc: "Fried in pure desi ghee" },
  { id: "sweets",  name: "Sweets",  nameHi: "मिठाई", emoji: "✨", count: 4, image: "assets/images/cat-sweets.jpg",  color: "#FFD700", desc: "Made with love and pure ghee" }
];

window.TESTIMONIALS = [
  { id: 1, name: "Priya Sharma",  location: "Delhi",     initials: "PS", rating: 5, text: "The mango pickle is EXACTLY like my nani's recipe. I've been searching for years and finally found it. It brings back the most beautiful memories of childhood summers." },
  { id: 2, name: "Rajesh Gupta", location: "Mumbai",    initials: "RG", rating: 5, text: "Ordered the Garam Masala and Ghee Ladoos together. Both are outstanding. The masala fragrance hit me when I opened the package — I was transported to a real Indian kitchen." },
  { id: 3, name: "Sunita Mehta", location: "Pune",      initials: "SM", rating: 5, text: "I was skeptical buying food online but Maati Ka Swad changed my mind. The Mathri is better than what I used to get in Old Delhi market. Genuinely home-made taste." },
  { id: 4, name: "Anita Reddy",  location: "Hyderabad", initials: "AR", rating: 5, text: "The Khajur Roll is my new favourite healthy sweet. My diabetic father can also enjoy it! Great quality, beautiful packaging, and delivered fresh. Will keep ordering!" },
  { id: 5, name: "Vikram Singh", location: "Jaipur",    initials: "VS", rating: 5, text: "Bought the festival combo as a gift for Diwali. Everyone loved it! The presentation is beautiful and the taste even more so. Maati Ka Swad is now my go-to for gifting." },
  { id: 6, name: "Kavita Nair",  location: "Bangalore", initials: "KN", rating: 5, text: "Living in Bangalore and missing Rajasthani food was my biggest struggle. Maati Ka Swad's Namak Para and pickles fill that gap perfectly. Authentic, pure, and delicious!" }
];

// ── Merge backend data (live price/stock) into local data ──
window.PRODUCTS = [...window.PRODUCTS_LOCAL];

window.syncProductsFromBackend = async () => {
  try {
    const res  = await fetch('https://maati-ka-swad-backend.onrender.com/api/products');
    const data = await res.json();
    const apiProducts = data.products || data;
    if (!Array.isArray(apiProducts)) return;

    // Merge: update price, mrp, stock, badge from backend; keep local rich data
    window.PRODUCTS = window.PRODUCTS_LOCAL.map(local => {
      const live = apiProducts.find(p => p.id === local.id);
      if (!live) return local;
      return {
        ...local,
        price:  live.price  || local.price,
        mrp:    live.mrp    || local.mrp,
        stock:  live.stock  !== undefined ? live.stock : local.stock,
        badge:  live.badge  || local.badge,
        rating: live.rating || local.rating,
        reviews: live.reviews || local.reviews,
      };
    });

    // Also add any new backend products not in local data
    apiProducts.forEach(liveP => {
      const exists = window.PRODUCTS.find(p => p.id === liveP.id);
      if (!exists) {
        const ingredients = typeof liveP.ingredients === 'string'
          ? JSON.parse(liveP.ingredients || '[]')
          : (liveP.ingredients || []);
        window.PRODUCTS.push({
          id: liveP.id, name: liveP.name, nameHi: liveP.name_hi || '',
          slug: liveP.slug, category: liveP.category,
          categoryLabel: liveP.category.charAt(0).toUpperCase() + liveP.category.slice(1),
          price: liveP.price, mrp: liveP.mrp, weight: liveP.weight || '250g',
          rating: liveP.rating, reviews: liveP.reviews, stock: liveP.stock,
          badge: liveP.badge || null,
          description: liveP.description || '',
          ingredients, benefits: [], tags: [],
          images: [], emoji: liveP.emoji || '🍴', color: liveP.color || '#D4620A'
        });
      }
    });

    console.log(`✅ Products synced from backend (${window.PRODUCTS.length} products)`);
  } catch (err) {
    console.warn('⚠️ Backend sync failed, using local data:', err.message);
  }
};

// ── Helpers ──────────────────────────────────────────────
window.getProduct      = (id) => window.PRODUCTS.find(p => p.id === parseInt(id));
window.getByCategory   = (cat) => (!cat || cat === 'all') ? window.PRODUCTS : window.PRODUCTS.filter(p => p.category === cat);
window.searchProducts  = (query) => {
  const q = query.toLowerCase().trim();
  if (!q) return window.PRODUCTS;
  return window.PRODUCTS.filter(p =>
    p.name.toLowerCase().includes(q) ||
    (p.nameHi || '').includes(q) ||
    p.category.toLowerCase().includes(q) ||
    (p.tags || []).some(t => t.includes(q))
  );
};
window.getDiscount  = (price, mrp) => Math.round(((mrp - price) / mrp) * 100);
window.getStarHTML  = (rating) => {
  let html = '';
  for (let i = 1; i <= 5; i++) {
    if (i <= Math.floor(rating)) html += '<span class="star">★</span>';
    else if (i - 0.5 <= rating) html += '<span class="star">☆</span>';
    else html += '<span class="star empty">★</span>';
  }
  return html;
};
