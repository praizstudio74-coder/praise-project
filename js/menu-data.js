// Praise Restaurant - Menu Database
// Inspired by authentic African culinary heritage & menu specifications

const MENU_DATA = [
  // --- RICE DISHES ---
  {
    id: "rice-1",
    name: "Signature Nigerian Jollof Rice",
    category: "rice",
    categoryName: "Rice Dishes",
    price: 5000,
    priceFormatted: "₦5,000",
    description: "Smoky firewood-infused long grain parboiled rice simmered in rich tomato, bell pepper, and scotch bonnet reduction. Served with golden fried plantains.",
    image: "https://images.unsplash.com/photo-1574484284002-952d92456975?auto=format&fit=crop&w=800&q=80",
    spiceLevel: "Medium",
    popular: true,
    isChefSpecial: true,
    calories: "620 kcal"
  },
  {
    id: "rice-2",
    name: "Savory Fried Rice",
    category: "rice",
    categoryName: "Rice Dishes",
    price: 5000,
    priceFormatted: "₦5,000",
    description: "Fragrant rice stir-fried with sweet corn, green peas, carrots, liver bits, and authentic African herb butter.",
    image: "https://images.unsplash.com/photo-1603133872878-684f208fb84b?auto=format&fit=crop&w=800&q=80",
    spiceLevel: "Mild",
    popular: true,
    isChefSpecial: false,
    calories: "580 kcal"
  },
  {
    id: "rice-3",
    name: "Native Village Rice",
    category: "rice",
    categoryName: "Rice Dishes",
    price: 14000,
    priceFormatted: "₦14,000",
    description: "Unpolished ofada rice simmered in pure bleached palm oil, smoked dried fish, fermented locust beans (iru), crayfish, and assorted meats.",
    image: "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&w=800&q=80",
    spiceLevel: "Hot",
    popular: true,
    isChefSpecial: true,
    calories: "720 kcal"
  },
  {
    id: "rice-4",
    name: "White Rice & Designer Ayamase Stew",
    category: "rice",
    categoryName: "Rice Dishes",
    price: 5000,
    priceFormatted: "₦5,000",
    description: "Steamed fluffy white rice paired with our legendary green bell pepper, bleached palm oil, and locust bean ofada sauce with boiled egg.",
    image: "https://images.unsplash.com/photo-1512058564366-18510be2db19?auto=format&fit=crop&w=800&q=80",
    spiceLevel: "Hot",
    popular: false,
    isChefSpecial: false,
    calories: "650 kcal"
  },
  {
    id: "rice-5",
    name: "Special Praise Seafood Rice",
    category: "rice",
    categoryName: "Rice Dishes",
    price: 14000,
    priceFormatted: "₦14,000",
    description: "Jumbo tiger prawns, calamari rings, and flaked croaker fish wok-tossed with aromatic seasoned basmati rice.",
    image: "https://images.unsplash.com/photo-1534422298391-e4f8c172dddb?auto=format&fit=crop&w=800&q=80",
    spiceLevel: "Medium",
    popular: false,
    isChefSpecial: true,
    calories: "690 kcal"
  },

  // --- SWALLOWS & SOUPS ---
  {
    id: "soup-1",
    name: "Royal Egusi Soup",
    category: "swallows",
    categoryName: "Swallows & Soups",
    price: 5000,
    priceFormatted: "₦5,000",
    description: "Hand-peeled ground melon seeds simmered with bitter leaf and ugwu greens, stockfish, smoked catfish, and beef tripe. Served with Pounded Yam.",
    image: "https://images.unsplash.com/photo-1547496502-affa22d38842?auto=format&fit=crop&w=800&q=80",
    spiceLevel: "Medium",
    popular: true,
    isChefSpecial: true,
    calories: "750 kcal"
  },
  {
    id: "soup-2",
    name: "Rich Vegetable Soup (Efo Riro)",
    category: "swallows",
    categoryName: "Swallows & Soups",
    price: 5000,
    priceFormatted: "₦5,000",
    description: "Fresh shoko and ugwu leaves cooked in rich bell pepper relish, seasoned with crayfish, pomo, shaki, and dried prawns.",
    image: "https://images.unsplash.com/photo-1540420773420-3366772f4999?auto=format&fit=crop&w=800&q=80",
    spiceLevel: "Medium",
    popular: true,
    isChefSpecial: false,
    calories: "590 kcal"
  },
  {
    id: "soup-3",
    name: "Traditional Oha Soup",
    category: "swallows",
    categoryName: "Swallows & Soups",
    price: 5000,
    priceFormatted: "₦5,000",
    description: "Authentic Igbo delicacy made with tender Oha leaves, cocoyam thickener, uziza seeds, palm fruit concentrate, and smoked meats.",
    image: "https://images.unsplash.com/photo-1505253758473-96b3015f2169?auto=format&fit=crop&w=800&q=80",
    spiceLevel: "Medium",
    popular: false,
    isChefSpecial: true,
    calories: "640 kcal"
  },
  {
    id: "soup-4",
    name: "Draw Okra & Seafood Soup",
    category: "swallows",
    categoryName: "Swallows & Soups",
    price: 5000,
    priceFormatted: "₦5,000",
    description: "Finely diced tender green okra cooked in aromatic seafood broth with crab, fresh prawns, and periwinkles.",
    image: "https://images.unsplash.com/photo-1582878826629-29b7ad1cdc43?auto=format&fit=crop&w=800&q=80",
    spiceLevel: "Mild",
    popular: false,
    isChefSpecial: false,
    calories: "520 kcal"
  },
  {
    id: "soup-5",
    name: "Nsala Soup (White Soup)",
    category: "swallows",
    categoryName: "Swallows & Soups",
    price: 5000,
    priceFormatted: "₦5,000",
    description: "Aromatic palm-oil-free broth thickened with yam paste, loaded with fresh Catfish and native spices (uda and utazi).",
    image: "https://images.unsplash.com/photo-1569718212165-3a8278d5f624?auto=format&fit=crop&w=800&q=80",
    spiceLevel: "Hot",
    popular: true,
    isChefSpecial: false,
    calories: "560 kcal"
  },
  {
    id: "soup-6",
    name: "Rich Ogbono & Bitterleaf Soup",
    category: "swallows",
    categoryName: "Swallows & Soups",
    price: 5000,
    priceFormatted: "₦5,000",
    description: "Slow-cooked wild African mango seeds (dika) blended with dried stockfish, cow leg, and shredded bitterleaf.",
    image: "https://images.unsplash.com/photo-1543339308-43e59d6b73a6?auto=format&fit=crop&w=800&q=80",
    spiceLevel: "Medium",
    popular: false,
    isChefSpecial: false,
    calories: "680 kcal"
  },

  // --- PEPPERED MEATS & FISH ---
  {
    id: "meat-1",
    name: "Crispy Peppered Chicken",
    category: "meats",
    categoryName: "Peppered Meats & Fish",
    price: 5000,
    priceFormatted: "₦5,000",
    description: "Succulent chicken drumsticks and thighs, deep-fried to golden perfection then wok-tossed in a vibrant habanero and sweet onion sauce.",
    image: "https://images.unsplash.com/photo-1626082927389-6cd097cdc6ec?auto=format&fit=crop&w=800&q=80",
    spiceLevel: "Hot",
    popular: true,
    isChefSpecial: true,
    calories: "480 kcal"
  },
  {
    id: "meat-2",
    name: "Fiery Peppered Goat Meat (Asun Style)",
    category: "meats",
    categoryName: "Peppered Meats & Fish",
    price: 7000,
    priceFormatted: "₦7,000",
    description: "Tender chunks of smoked goat meat sautéed with crushed chili peppers, bell peppers, garlic, and fresh green spring onions.",
    image: "https://images.unsplash.com/photo-1544025162-d76694265947?auto=format&fit=crop&w=800&q=80",
    spiceLevel: "Very Hot",
    popular: true,
    isChefSpecial: true,
    calories: "530 kcal"
  },
  {
    id: "meat-3",
    name: "Signature Gizdodo Platter",
    category: "meats",
    categoryName: "Peppered Meats & Fish",
    price: 5000,
    priceFormatted: "₦5,000",
    description: "The classic Nigerian marriage of tender peppered gizzards and sweet caramelized fried plantain cubes in spicy pepper reduction.",
    image: "https://images.unsplash.com/photo-1555939594-58d7cb561ad1?auto=format&fit=crop&w=800&q=80",
    spiceLevel: "Medium",
    popular: true,
    isChefSpecial: false,
    calories: "510 kcal"
  },
  {
    id: "meat-4",
    name: "Peppered Jumbo Turkey Wings",
    category: "meats",
    categoryName: "Peppered Meats & Fish",
    price: 7000,
    priceFormatted: "₦7,000",
    description: "Large prime turkey cutlets marinated in ginger, thyme, and garlic, glazed in thick caramel pepper sauce.",
    image: "https://images.unsplash.com/photo-1527477321074-6b26d83cfd42?auto=format&fit=crop&w=800&q=80",
    spiceLevel: "Hot",
    popular: false,
    isChefSpecial: false,
    calories: "620 kcal"
  },
  {
    id: "meat-5",
    name: "Whole Grilled Croaker Fish",
    category: "meats",
    categoryName: "Peppered Meats & Fish",
    price: 6000,
    priceFormatted: "₦6,000",
    description: "Fresh Atlantic croaker fish basted with Praise spicy herb sauce, char-grilled over natural coals, served with coleslaw.",
    image: "https://images.unsplash.com/photo-1519708227418-c8fd9a32b7a2?auto=format&fit=crop&w=800&q=80",
    spiceLevel: "Medium",
    popular: true,
    isChefSpecial: true,
    calories: "450 kcal"
  },

  // --- PEPPER SOUPS ---
  {
    id: "pep-1",
    name: "Authentic Catfish Pepper Soup (Point & Kill)",
    category: "peppersoup",
    categoryName: "Pepper Soups",
    price: 5000,
    priceFormatted: "₦5,000",
    description: "Fresh cut catfish simmered in our signature herbal broth infused with alligator pepper, calabash nutmeg, and wild scent leaves.",
    image: "https://images.unsplash.com/photo-1541832676-9b763b0239ab?auto=format&fit=crop&w=800&q=80",
    spiceLevel: "Hot",
    popular: true,
    isChefSpecial: true,
    calories: "340 kcal"
  },
  {
    id: "pep-2",
    name: "Slow-Braised Goat Meat Pepper Soup",
    category: "peppersoup",
    categoryName: "Pepper Soups",
    price: 5000,
    priceFormatted: "₦5,000",
    description: "Tender bone-in goat meat slow-simmered for 4 hours with traditional West African restorative healing spices.",
    image: "https://images.unsplash.com/photo-1547592166-23ac45744acd?auto=format&fit=crop&w=800&q=80",
    spiceLevel: "Hot",
    popular: true,
    isChefSpecial: false,
    calories: "390 kcal"
  },
  {
    id: "pep-3",
    name: "Full Catfish Pepper Soup Pot",
    category: "peppersoup",
    categoryName: "Pepper Soups",
    price: 20000,
    priceFormatted: "₦20,000",
    description: "Generous whole 2kg fresh catfish cooked in a banquet claypot with double herbs, peppered stock, and boiled plantains.",
    image: "https://images.unsplash.com/photo-1534939561126-855b8675edd7?auto=format&fit=crop&w=800&q=80",
    spiceLevel: "Hot",
    popular: false,
    isChefSpecial: true,
    calories: "820 kcal"
  },

  // --- PASTA & SIDES ---
  {
    id: "pasta-1",
    name: "Praise Special Spaghetti",
    category: "pasta",
    categoryName: "Pasta & Sides",
    price: 14000,
    priceFormatted: "₦14,000",
    description: "Al dente spaghetti tossed in rich beef bolognese, sweet bell peppers, sweet corn, and garnished with roasted chicken.",
    image: "https://images.unsplash.com/photo-1551183053-bf91a1d81141?auto=format&fit=crop&w=800&q=80",
    spiceLevel: "Medium",
    popular: true,
    isChefSpecial: false,
    calories: "680 kcal"
  },
  {
    id: "pasta-2",
    name: "Loaded Meaty Pasta",
    category: "pasta",
    categoryName: "Pasta & Sides",
    price: 13000,
    priceFormatted: "₦13,000",
    description: "Loaded with succulent prawns, shredded tender beef, diced chicken, and crisp garden vegetables in herb sauce.",
    image: "https://images.unsplash.com/photo-1621996346565-e3d5d6281691?auto=format&fit=crop&w=800&q=80",
    spiceLevel: "Mild",
    popular: false,
    isChefSpecial: true,
    calories: "740 kcal"
  },
  {
    id: "pasta-3",
    name: "Golden Fried Ripe Plantains (Dodo)",
    category: "pasta",
    categoryName: "Pasta & Sides",
    price: 2000,
    priceFormatted: "₦2,000",
    description: "Sweet naturally ripe yellow plantains sliced and fried to caramelized golden perfection. The quintessential African side.",
    image: "https://images.unsplash.com/photo-1528735602780-2552fd46c7af?auto=format&fit=crop&w=800&q=80",
    spiceLevel: "None",
    popular: true,
    isChefSpecial: false,
    calories: "280 kcal"
  },
  {
    id: "pasta-4",
    name: "Boiled Yam & Rich Egg Sauce",
    category: "pasta",
    categoryName: "Pasta & Sides",
    price: 5000,
    priceFormatted: "₦5,000",
    description: "Puna white yam cubes served with vibrant scrambled egg stew cooked with fresh plum tomatoes, onions, and scotch bonnet.",
    image: "https://images.unsplash.com/photo-1525351484163-7529414344d8?auto=format&fit=crop&w=800&q=80",
    spiceLevel: "Mild",
    popular: false,
    isChefSpecial: false,
    calories: "510 kcal"
  },

  // --- DRINKS & REFRESHMENTS ---
  {
    id: "drink-1",
    name: "Artisanal Healthy Zobo Infusion",
    category: "drinks",
    categoryName: "Beverages & Drinks",
    price: 2000,
    priceFormatted: "₦2,000",
    description: "Chilled organic hibiscus calyces steeped with fresh ginger, cloves, fresh pineapple juice, and natural dates. Refreshingly revitalizing.",
    image: "https://images.unsplash.com/photo-1513558161293-cdaf765ed2fd?auto=format&fit=crop&w=800&q=80",
    spiceLevel: "None",
    popular: true,
    isChefSpecial: true,
    calories: "95 kcal"
  },
  {
    id: "drink-2",
    name: "Velvety Tiger Nut Milk (Kunu Aya)",
    category: "drinks",
    categoryName: "Beverages & Drinks",
    price: 3500,
    priceFormatted: "₦3,500",
    description: "Creamy plant milk hand-extracted from tiger nuts, blended with dried dates, coconut flesh, and hints of ginger root.",
    image: "https://images.unsplash.com/photo-1556881286-fc6915169721?auto=format&fit=crop&w=800&q=80",
    spiceLevel: "None",
    popular: true,
    isChefSpecial: false,
    calories: "180 kcal"
  },
  {
    id: "drink-3",
    name: "Fresh Tropical Sunrise Smoothie",
    category: "drinks",
    categoryName: "Beverages & Drinks",
    price: 3000,
    priceFormatted: "₦3,000",
    description: "A velvety blend of sweet Nigerian mango, ripe papaya, banana, and passion fruit with crushed ice.",
    image: "https://images.unsplash.com/photo-1505252585461-04db1eb84625?auto=format&fit=crop&w=800&q=80",
    spiceLevel: "None",
    popular: false,
    isChefSpecial: false,
    calories: "160 kcal"
  },
  {
    id: "drink-4",
    name: "Greek Yogurt Berry Parfait",
    category: "drinks",
    categoryName: "Beverages & Drinks",
    price: 3500,
    priceFormatted: "₦3,500",
    description: "Creamy Greek yogurt layered with granola, fresh strawberries, chia seeds, and pure mountain blossom honey.",
    image: "https://images.unsplash.com/photo-1488477181946-6428a0291777?auto=format&fit=crop&w=800&q=80",
    spiceLevel: "None",
    popular: false,
    isChefSpecial: false,
    calories: "240 kcal"
  }
];

// Testimonials data
const TESTIMONIALS_DATA = [
  {
    id: 1,
    name: "Adeola Balogun",
    role: "Food Critic & Lifestyle Blogger",
    city: "Victoria Island, Lagos",
    avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80",
    rating: 5,
    date: "2 weeks ago",
    content: "Praise Restaurant is an absolute culinary treasure. Their Nigerian Jollof Rice possesses that rare, authentic firewood smokiness that takes you straight back to classic festive banquets. The Egusi soup was thick, rich, and loaded with tender assorted meats. Exceptional service and impeccable cleanliness!"
  },
  {
    id: 2,
    name: "Chukwuma Nwosu",
    role: "Managing Director, Apex Capital",
    city: "Lekki Phase 1, Lagos",
    avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=200&q=80",
    rating: 5,
    date: "1 month ago",
    content: "We hired Praise Restaurant to cater our corporate end-of-year executive banquet for 250 guests. The professionalism was world-class! Every single dish arrived piping hot, beautifully presented, and the live peppered meats station was the talk of the entire evening. Highly recommended!"
  },
  {
    id: 3,
    name: "Dr. Fatima Al-Hassan",
    role: "Cardiologist & Diners Club Member",
    city: "Ikoyi, Lagos",
    avatar: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=200&q=80",
    rating: 5,
    date: "3 weeks ago",
    content: "As someone who loves traditional African food without artificial flavor enhancers, Praise Restaurant exceeds every benchmark. Their Catfish Pepper Soup with fresh scent leaves was therapeutic and pure. Their Tiger Nut Milk is velvety perfection. A truly authentic five-star experience."
  },
  {
    id: 4,
    name: "Olumide & Funke Martins",
    role: "Newlyweds",
    city: "Ikeja GRA, Lagos",
    avatar: "https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?auto=format&fit=crop&w=200&q=80",
    rating: 5,
    date: "Just yesterday",
    content: "From the cozy ambient lighting in their dine-in lounge to the warm hospitality of the staff, dining here is always a joy. The Gizdodo and Grilled Croaker Fish are out of this world. We can never get enough!"
  }
];

// Catering Packages
const CATERING_PACKAGES = [
  {
    id: "silver",
    name: "Silver Heritage Banquet",
    tagline: "Ideal for intimate celebrations, birthdays & team dinners",
    pricePerGuest: 8500,
    priceFormatted: "₦8,500 / guest",
    features: [
      "Choice of 2 Rice Dishes (Jollof / Fried Rice)",
      "Choice of 1 Traditional Soup with Pounded Yam",
      "Peppered Chicken & Fried Plantain (Dodo)",
      "Chilled Zobo Drink & Table Water",
      "Standard Buffet Warmers & Serving Utensils",
      "Professional Chafing Service Attendants"
    ],
    recommendedFor: "25 – 80 Guests"
  },
  {
    id: "gold",
    name: "Gold Celebration Feast",
    tagline: "Our most popular package for grand weddings & corporate galas",
    isPopular: true,
    pricePerGuest: 14500,
    priceFormatted: "₦14,500 / guest",
    features: [
      "Full African Rice Bar (Jollof, Fried & Native Village Rice)",
      "Choice of 2 Traditional Soups (Royal Egusi, Oha, or Efo Riro)",
      "Swallows: Pounded Yam, Semovita & Wheat",
      "Peppered Meats Trio: Chicken, Turkey & Asun Goat Meat",
      "Catfish Pepper Soup Appetizer Shot Bar",
      "Artisanal Tiger Nut Milk & Tropical Smoothies",
      "Uniformed Executive Service Staff & Bartenders",
      "Luxury Table Presentation & Floral Accents"
    ],
    recommendedFor: "80 – 300 Guests"
  },
  {
    id: "royal",
    name: "Imperial Royal African Gala",
    tagline: "Ultimate luxury multi-station African gastronomic experience",
    pricePerGuest: 22000,
    priceFormatted: "₦22,000 / guest",
    features: [
      "Live Open-Flame Charcoal Suya & Peppered Grill Station",
      "Full 5-Course African Gastronomy Experience",
      "Seafood Delicacies: Jumbo Prawns & Catfish Pepper Soup Claypot",
      "Complete Range of Traditional Soups & Artisanal Swallows",
      "Executive Beverage Bar with Mocktails, Zobo & Exotic Shakes",
      "Executive Chef Presence for Live Plating",
      "VIP Dedicated Captain & White-Glove Table Service",
      "Custom Printed Menu Cards with Event Branding"
    ],
    recommendedFor: "100 – 1000+ Guests"
  }
];

if (typeof module !== "undefined" && module.exports) {
  module.exports = { MENU_DATA, TESTIMONIALS_DATA, CATERING_PACKAGES };
}
