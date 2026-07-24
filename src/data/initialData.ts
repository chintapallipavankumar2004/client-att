import {
  HeroBanner,
  AnnouncementItem,
  Category,
  AgeCategory,
  Product,
  Collection,
  Coupon,
  Order,
  Customer,
  Review,
  BlogPost,
  SiteSettings,
  HomepageSection
} from '../types';

export const initialBanners: HeroBanner[] = [
  {
    id: 'b1',
    desktopImage: 'https://images.unsplash.com/photo-1622290291468-a28f7a7dc6a8?auto=format&fit=crop&w=1600&q=80',
    mobileImage: 'https://images.unsplash.com/photo-1622290291468-a28f7a7dc6a8?auto=format&fit=crop&w=800&q=80',
    title: 'Festive Royal Collection 2026',
    subtitle: 'Handcrafted Heritage Ethnic Wear for Little Princes & Princesses',
    badgeText: 'FESTIVE EDITION',
    buttonText: 'Shop Festive Wear',
    buttonLink: '/shop?category=ethnic-wear',
    bgColor: '#fdf2f8',
    textColor: '#831843',
    priority: 1,
    active: true
  },
  {
    id: 'b2',
    desktopImage: 'https://images.unsplash.com/photo-1518831959646-742c3a14ebf7?auto=format&fit=crop&w=1600&q=80',
    mobileImage: 'https://images.unsplash.com/photo-1518831959646-742c3a14ebf7?auto=format&fit=crop&w=800&q=80',
    title: '100% Organic Bamboo & Cotton',
    subtitle: 'Cloud-Soft Essentials Gentle on Newborn Baby Skin',
    badgeText: 'BABY SAFE CERTIFIED',
    buttonText: 'Explore Organic',
    buttonLink: '/shop?category=organic-cotton',
    bgColor: '#f0fdf4',
    textColor: '#14532d',
    priority: 2,
    active: true
  },
  {
    id: 'b3',
    desktopImage: 'https://images.unsplash.com/photo-1519238263530-99bdd11df2ea?auto=format&fit=crop&w=1600&q=80',
    mobileImage: 'https://images.unsplash.com/photo-1519238263530-99bdd11df2ea?auto=format&fit=crop&w=800&q=80',
    title: 'Sunny Summer Playwear',
    subtitle: 'Breathable Frocks, Shorts Sets & Cute Dungarees',
    badgeText: 'NEW ARRIVALS',
    buttonText: 'Shop Summer',
    buttonLink: '/shop?category=summer-wear',
    bgColor: '#fffbeb',
    textColor: '#78350f',
    priority: 3,
    active: true
  },
  {
    id: 'b4',
    desktopImage: 'https://images.unsplash.com/photo-1543852786-1cf6624b9987?auto=format&fit=crop&w=1600&q=80',
    mobileImage: 'https://images.unsplash.com/photo-1543852786-1cf6624b9987?auto=format&fit=crop&w=800&q=80',
    title: 'Monsoon Splash & Jackets',
    subtitle: 'Cozy Rainwear, Fleece Hoodies & Windbreakers',
    badgeText: 'FLASHSALE 30% OFF',
    buttonText: 'View Flash Deals',
    buttonLink: '/shop?flash=true',
    bgColor: '#f0f9ff',
    textColor: '#0c4a6e',
    priority: 4,
    active: true
  }
];

export const initialAnnouncements: AnnouncementItem[] = [
  { id: 'a1', text: '✨ Free Express Shipping on orders above ₹999 across India!', active: true, speed: 25 },
  { id: 'a2', text: '🎉 Festival Special: Use Code TINY20 for Extra 20% OFF on all Ethnic Wear', active: true, speed: 25 },
  { id: 'a3', text: '🍼 100% Hypoallergenic Organic Cotton & Chemical-Free Dyes Guarantee', active: true, speed: 25 },
  { id: 'a4', text: '🎁 Free Premium Gift Wrapping & Personal Handwritten Card on All Orders', active: true, speed: 25 }
];

export const initialCategories: Category[] = [
  {
    id: 'c1',
    name: 'Summer Wear',
    slug: 'summer-wear',
    image: 'https://images.unsplash.com/photo-1519238263530-99bdd11df2ea?auto=format&fit=crop&w=600&q=80',
    icon: 'Sun',
    description: 'Lightweight, breathable cotton dresses, tees and shorts for hot summer days.',
    priority: 1,
    active: true,
    discountPercent: 15,
    isFeatured: true,
    productCount: 18
  },
  {
    id: 'c2',
    name: 'Ethnic & Party Wear',
    slug: 'ethnic-wear',
    image: 'https://images.unsplash.com/photo-1622290291468-a28f7a7dc6a8?auto=format&fit=crop&w=600&q=80',
    icon: 'Sparkles',
    description: 'Royal Silk Kurtas, Lehenga Cholis, Sherwanis and Party Dresses for grand celebrations.',
    priority: 2,
    active: true,
    discountPercent: 20,
    isFeatured: true,
    productCount: 24
  },
  {
    id: 'c3',
    name: 'Organic Cotton Baby',
    slug: 'organic-cotton',
    image: 'https://images.unsplash.com/photo-1518831959646-742c3a14ebf7?auto=format&fit=crop&w=600&q=80',
    icon: 'HeartHandshake',
    description: 'GOTS certified organic onesies, swaddles, sleepsuits and bibs.',
    priority: 3,
    active: true,
    discountPercent: 10,
    isFeatured: true,
    productCount: 15
  },
  {
    id: 'c4',
    name: 'Winter & Jackets',
    slug: 'winter-wear',
    image: 'https://images.unsplash.com/photo-1543852786-1cf6624b9987?auto=format&fit=crop&w=600&q=80',
    icon: 'Snowflake',
    description: 'Soft fleece coats, knitted sweaters, warm hoodies and padded vests.',
    priority: 4,
    active: true,
    discountPercent: 25,
    isFeatured: true,
    productCount: 12
  },
  {
    id: 'c5',
    name: 'Baby Essentials',
    slug: 'baby-essentials',
    image: 'https://images.unsplash.com/photo-1515488042361-ee00e0ddd4e4?auto=format&fit=crop&w=600&q=80',
    icon: 'Baby',
    description: 'Mittens, booties, caps, hooded towels and newborn hospital sets.',
    priority: 5,
    active: true,
    discountPercent: 12,
    isFeatured: true,
    productCount: 30
  },
  {
    id: 'c6',
    name: 'Night Wear & Loungewear',
    slug: 'night-wear',
    image: 'https://images.unsplash.com/photo-1596870230751-ebdfce98ec42?auto=format&fit=crop&w=600&q=80',
    icon: 'Moon',
    description: 'Cute printed pyjama sets, nightsuits and cozy sleep loungewear.',
    priority: 6,
    active: true,
    discountPercent: 15,
    isFeatured: true,
    productCount: 14
  }
];

export const initialAgeCategories: AgeCategory[] = [
  { id: 'a1', label: 'Newborn', range: '0-3M', active: true, priority: 1, badgeColor: 'bg-pink-100 text-pink-700 border-pink-200' },
  { id: 'a2', label: '3-6 Months', range: '3-6M', active: true, priority: 2, badgeColor: 'bg-purple-100 text-purple-700 border-purple-200' },
  { id: 'a3', label: '6-12 Months', range: '6-12M', active: true, priority: 3, badgeColor: 'bg-sky-100 text-sky-700 border-sky-200' },
  { id: 'a4', label: '1-2 Years', range: '1-2Y', active: true, priority: 4, badgeColor: 'bg-amber-100 text-amber-700 border-amber-200' },
  { id: 'a5', label: '2-4 Years', range: '2-4Y', active: true, priority: 5, badgeColor: 'bg-emerald-100 text-emerald-700 border-emerald-200' },
  { id: 'a6', label: '4-6 Years', range: '4-6Y', active: true, priority: 6, badgeColor: 'bg-rose-100 text-rose-700 border-rose-200' },
  { id: 'a7', label: '6-8 Years', range: '6-8Y', active: true, priority: 7, badgeColor: 'bg-indigo-100 text-indigo-700 border-indigo-200' }
];

export const initialProducts: Product[] = [
  {
    id: 'p1',
    name: 'Akshvik Pastel Floral Cotton Frock',
    slug: 'akshvik-pastel-floral-cotton-frock',
    sku: 'ATT-FRK-001',
    shortDescription: 'Delicate hand-printed pastel floral cotton dress with ruffle cap sleeves.',
    description: 'Crafted from 100% super combed breathable organic cotton. Features a full soft cotton lining, back zip closure for easy dressing, and a comfortable gentle elastic gather. Perfect for sunny outdoor birthday parties and summer picnics.',
    price: 1299,
    originalPrice: 1799,
    discountPercent: 28,
    isNew: true,
    isTrending: true,
    isBestSeller: true,
    isFeatured: true,
    isFlashDeal: true,
    flashEnd: new Date(Date.now() + 86400000 * 2).toISOString(),
    images: [
      'https://images.unsplash.com/photo-1519238263530-99bdd11df2ea?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1622290291468-a28f7a7dc6a8?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1518831959646-742c3a14ebf7?auto=format&fit=crop&w=800&q=80'
    ],
    ageGroups: ['6-12M', '1-2Y', '2-4Y', '4-6Y'],
    sizes: ['6-12M', '1Y', '2Y', '3Y', '4Y'],
    colors: [
      { name: 'Blush Pink', hex: '#fbcfe8' },
      { name: 'Sky Mint', hex: '#a7f3d0' },
      { name: 'Soft Cream', hex: '#fef3c7' }
    ],
    categories: ['summer-wear'],
    brand: 'Akshvik Tiny Trends',
    tags: ['Frock', 'Summer', 'Floral', '100% Cotton', 'Party'],
    stock: 24,
    rating: 4.9,
    reviewCount: 38,
    isBabySafe: true,
    fabricDetails: '100% Pure Premium Combed Cotton, OEKO-TEX Standard 100 certified non-toxic dyes.',
    careInstructions: 'Gentle hand wash or machine wash at 30°C in soft cycle. Line dry in shade. Warm iron.',
    createdAt: new Date().toISOString()
  },
  {
    id: 'p2',
    name: 'Little Prince Handcrafted Silk Kurta Pyjama & Vest',
    slug: 'little-prince-handcrafted-silk-kurta-pyjama',
    sku: 'ATT-ETH-002',
    shortDescription: '3-Piece royal jacquard weave waistcoat with soft cotton-slub kurta and pyjama.',
    description: 'Designed for weddings, Diwali, and festive milestones. Made with irritation-free inner cotton lining and soft elastic waistband pyjama. Features mandarin collar with metallic buttons and rich embroidery work.',
    price: 2499,
    originalPrice: 3499,
    discountPercent: 28,
    isNew: true,
    isTrending: true,
    isBestSeller: true,
    isFeatured: true,
    isFlashDeal: false,
    images: [
      'https://images.unsplash.com/photo-1622290291468-a28f7a7dc6a8?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1519238263530-99bdd11df2ea?auto=format&fit=crop&w=800&q=80'
    ],
    ageGroups: ['1-2Y', '2-4Y', '4-6Y', '6-8Y'],
    sizes: ['1Y', '2Y', '3Y', '4Y', '5Y', '6Y'],
    colors: [
      { name: 'Royal Gold & Beige', hex: '#fef08a' },
      { name: 'Maroon & Cream', hex: '#9f1239' },
      { name: 'Navy Blue & Gold', hex: '#1e3a8a' }
    ],
    categories: ['ethnic-wear'],
    brand: 'Akshvik Royal Heritage',
    tags: ['Kurta', 'Festive', 'Sherwani', 'Diwali', 'Weddings'],
    stock: 18,
    rating: 5.0,
    reviewCount: 42,
    isBabySafe: true,
    fabricDetails: 'Silk Blend exterior with 100% Breathable Cotton Inner Lining.',
    careInstructions: 'Dry clean recommended for first wash. Gentle cold hand wash subsequently.',
    createdAt: new Date().toISOString()
  },
  {
    id: 'p3',
    name: 'Organic Bamboo Cloud-Soft Onesie (Pack of 3)',
    slug: 'organic-bamboo-cloud-soft-onesie-pack-of-3',
    sku: 'ATT-ORG-003',
    shortDescription: 'Ultra-gentle envelope neck bodysuits with nickle-free crotch snap buttons.',
    description: 'Specially engineered for ultra-sensitive newborn skin. Made from thermo-regulating organic bamboo cotton that keeps baby cool in summer and warm in winter. Seamless tagless interior prevents neck scratchiness.',
    price: 1199,
    originalPrice: 1599,
    discountPercent: 25,
    isNew: false,
    isTrending: true,
    isBestSeller: true,
    isFeatured: true,
    isFlashDeal: true,
    flashEnd: new Date(Date.now() + 86400000 * 3).toISOString(),
    images: [
      'https://images.unsplash.com/photo-1518831959646-742c3a14ebf7?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1515488042361-ee00e0ddd4e4?auto=format&fit=crop&w=800&q=80'
    ],
    ageGroups: ['0-3M', '3-6M', '6-12M', '1-2Y'],
    sizes: ['NB', '3M', '6M', '12M', '18M'],
    colors: [
      { name: 'Pastel Trio (Sage/Cream/Peach)', hex: '#e2e8f0' }
    ],
    categories: ['organic-cotton', 'baby-essentials'],
    brand: 'Akshvik Pure Baby',
    tags: ['Onesie', 'Organic', 'Newborn', 'Tagless', 'Baby Safe'],
    stock: 45,
    rating: 4.9,
    reviewCount: 64,
    isBabySafe: true,
    fabricDetails: '70% Organic Bamboo, 30% GOTS Certified Organic Cotton.',
    careInstructions: 'Machine wash warm with mild baby laundry detergent. Tumble dry low.',
    createdAt: new Date().toISOString()
  },
  {
    id: 'p4',
    name: 'Tiny Explorer Denim Dungaree & Striped Tee Set',
    slug: 'tiny-explorer-denim-dungaree-striped-tee-set',
    sku: 'ATT-CAS-004',
    shortDescription: 'Adjustable strap soft stretch denim overalls paired with a 100% cotton tee.',
    description: 'Cute, trendy, and built for toddler adventures! The dungaree features buttoned sides, adjustable suspender straps, cute chest pocket embroidery, and crotch snaps for quick diaper changes in smaller sizes.',
    price: 1699,
    originalPrice: 2299,
    discountPercent: 26,
    isNew: true,
    isTrending: true,
    isBestSeller: false,
    isFeatured: true,
    isFlashDeal: false,
    images: [
      'https://images.unsplash.com/photo-1543852786-1cf6624b9987?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1519238263530-99bdd11df2ea?auto=format&fit=crop&w=800&q=80'
    ],
    ageGroups: ['6-12M', '1-2Y', '2-4Y', '4-6Y'],
    sizes: ['6M', '1Y', '2Y', '3Y', '4Y'],
    colors: [
      { name: 'Classic Indigo Denim', hex: '#2563eb' },
      { name: 'Washed Ice Blue', hex: '#60a5fa' }
    ],
    categories: ['summer-wear'],
    brand: 'Akshvik Tiny Trends',
    tags: ['Dungaree', 'Denim', 'Casual', 'Two-Piece', 'Toddler'],
    stock: 22,
    rating: 4.8,
    reviewCount: 29,
    isBabySafe: true,
    fabricDetails: 'Soft Stretch Denim (98% Cotton, 2% Elastane) + 100% Cotton Tee.',
    careInstructions: 'Wash inside out with similar colors. Warm iron on reverse side.',
    createdAt: new Date().toISOString()
  },
  {
    id: 'p5',
    name: 'Cozy Teddy Bear Padded Fleece Winter Jacket',
    slug: 'cozy-teddy-bear-padded-fleece-winter-jacket',
    sku: 'ATT-WIN-005',
    shortDescription: 'Plush sherpa fleece coat with cute bear ears hood and warm cotton lining.',
    description: 'Keep your little munchkin super snug and cozy in cold winter breezes. Includes easy zip front, elasticized wrist cuffs to lock in heat, and anti-pinch chin guard on top zipper.',
    price: 1899,
    originalPrice: 2699,
    discountPercent: 30,
    isNew: true,
    isTrending: false,
    isBestSeller: true,
    isFeatured: true,
    isFlashDeal: true,
    flashEnd: new Date(Date.now() + 86400000 * 1.5).toISOString(),
    images: [
      'https://images.unsplash.com/photo-1543852786-1cf6624b9987?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1518831959646-742c3a14ebf7?auto=format&fit=crop&w=800&q=80'
    ],
    ageGroups: ['3-6M', '6-12M', '1-2Y', '2-4Y'],
    sizes: ['3M', '6M', '1Y', '2Y', '3Y'],
    colors: [
      { name: 'Warm Cinnamon Caramel', hex: '#d97706' },
      { name: 'Soft Creamy Off-White', hex: '#fef3c7' },
      { name: 'Dusty Lavender', hex: '#e9d5ff' }
    ],
    categories: ['winter-wear'],
    brand: 'Akshvik Cozy Kids',
    tags: ['Jacket', 'Winter', 'Teddy Bear', 'Sherpa Fleece', 'Hoodie'],
    stock: 14,
    rating: 5.0,
    reviewCount: 51,
    isBabySafe: true,
    fabricDetails: 'Double-faced Sherpa Fleece with 100% Pure Cotton Lining.',
    careInstructions: 'Machine wash on delicate cold cycle. Hang to air dry.',
    createdAt: new Date().toISOString()
  },
  {
    id: 'p6',
    name: 'Rainbow Twirl Tulle Party Gown with Satin Bow',
    slug: 'rainbow-twirl-tulle-party-gown',
    sku: 'ATT-PAR-006',
    shortDescription: 'Layered rainbow pastel mesh flare dress with pearl embellished bodice.',
    description: 'A magical dream dress for little birthday princesses! Multi-layered soft tulle creates a enchanting twirl flare. 100% skin-safe inner satin & cotton lining guarantees zero itchiness or redness.',
    price: 2199,
    originalPrice: 2999,
    discountPercent: 27,
    isNew: true,
    isTrending: true,
    isBestSeller: true,
    isFeatured: true,
    isFlashDeal: false,
    images: [
      'https://images.unsplash.com/photo-1519238263530-99bdd11df2ea?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1622290291468-a28f7a7dc6a8?auto=format&fit=crop&w=800&q=80'
    ],
    ageGroups: ['1-2Y', '2-4Y', '4-6Y', '6-8Y'],
    sizes: ['1Y', '2Y', '3Y', '4Y', '5Y', '6Y'],
    colors: [
      { name: 'Pastel Rainbow Swirl', hex: '#fbcfe8' },
      { name: 'Frozen Sky Blue', hex: '#bae6fd' }
    ],
    categories: ['ethnic-wear', 'summer-wear'],
    brand: 'Akshvik Couture',
    tags: ['Gown', 'Party Dress', 'Rainbow', 'Birthday', 'Princess'],
    stock: 16,
    rating: 4.9,
    reviewCount: 33,
    isBabySafe: true,
    fabricDetails: 'Soft Nylon Mesh Tulle with 100% Cotton Underlining.',
    careInstructions: 'Dry clean or gentle hand wash. Do not wring or tumble dry.',
    createdAt: new Date().toISOString()
  },
  {
    id: 'p7',
    name: 'Dreamy Starry Night Printed Organic Pyjama Set',
    slug: 'dreamy-starry-night-printed-organic-pyjama-set',
    sku: 'ATT-NIG-007',
    shortDescription: 'Soft long-sleeve top and elastic waist bottoms printed with glow stars.',
    description: 'Ensure sweet dreams every night with our signature ultrasoft loungewear set. Crafted with ribbed cuffs at wrists and ankles so sleeves never ride up while baby sleeps.',
    price: 899,
    originalPrice: 1299,
    discountPercent: 30,
    isNew: false,
    isTrending: true,
    isBestSeller: true,
    isFeatured: false,
    isFlashDeal: true,
    flashEnd: new Date(Date.now() + 86400000 * 4).toISOString(),
    images: [
      'https://images.unsplash.com/photo-1596870230751-ebdfce98ec42?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1515488042361-ee00e0ddd4e4?auto=format&fit=crop&w=800&q=80'
    ],
    ageGroups: ['0-3M', '3-6M', '6-12M', '1-2Y', '2-4Y', '4-6Y'],
    sizes: ['3M', '6M', '1Y', '2Y', '3Y', '4Y'],
    colors: [
      { name: 'Midnight Navy Stars', hex: '#1e1b4b' },
      { name: 'Peach Moonbeams', hex: '#ffedd5' }
    ],
    categories: ['night-wear', 'organic-cotton'],
    brand: 'Akshvik Tiny Trends',
    tags: ['Pyjama', 'Sleepwear', 'Organic Cotton', 'Nightsuit'],
    stock: 38,
    rating: 4.8,
    reviewCount: 47,
    isBabySafe: true,
    fabricDetails: '100% Bio-Washed Organic Interlock Cotton.',
    careInstructions: 'Machine wash cold inside out. Tumble dry low.',
    createdAt: new Date().toISOString()
  },
  {
    id: 'p8',
    name: 'Newborn Welcome Home 7-Piece Gift Box Set',
    slug: 'newborn-welcome-home-7-piece-gift-box-set',
    sku: 'ATT-BOX-008',
    shortDescription: 'Includes onesie, footie pants, bib, cap, mittens, booties & plush security blanket.',
    description: 'The ultimate baby shower gift box! Packed elegantly in a gold foil luxury hardbox with ribbon. All items are crafted from chemical-free organic cotton and tested hypoallergenic.',
    price: 2299,
    originalPrice: 3299,
    discountPercent: 30,
    isNew: true,
    isTrending: true,
    isBestSeller: true,
    isFeatured: true,
    isFlashDeal: false,
    images: [
      'https://images.unsplash.com/photo-1515488042361-ee00e0ddd4e4?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1518831959646-742c3a14ebf7?auto=format&fit=crop&w=800&q=80'
    ],
    ageGroups: ['0-3M', '3-6M'],
    sizes: ['NB', '0-3M'],
    colors: [
      { name: 'Gender Neutral Oat Cream', hex: '#fef3c7' },
      { name: 'Soft Lavender Rose', hex: '#f3e8ff' },
      { name: 'Gentle Sky Mint', hex: '#ecfdf5' }
    ],
    categories: ['baby-essentials', 'organic-cotton'],
    brand: 'Akshvik Pure Baby',
    tags: ['Gift Set', 'Newborn Box', 'Baby Shower', 'Hospital Bag'],
    stock: 25,
    rating: 5.0,
    reviewCount: 78,
    isBabySafe: true,
    fabricDetails: '100% GOTS Certified Organic Combed Cotton.',
    careInstructions: 'Hand wash before first use with gentle baby soap.',
    createdAt: new Date().toISOString()
  }
];

export const initialCollections: Collection[] = [
  {
    id: 'col-1',
    name: 'Newborn Treasures',
    slug: 'newborn-treasures',
    description: 'Ultra-soft hypoallergenic essentials carefully picked for 0-12 months infants.',
    image: 'https://images.unsplash.com/photo-1518831959646-742c3a14ebf7?auto=format&fit=crop&w=800&q=80',
    isFeatured: true,
    productIds: ['p3', 'p7', 'p8']
  },
  {
    id: 'col-2',
    name: 'Royal Festive Lookbook 2026',
    slug: 'royal-festive',
    description: 'Traditional silks, vibrant lehengas, and embroidered sherwanis for grand functions.',
    image: 'https://images.unsplash.com/photo-1622290291468-a28f7a7dc6a8?auto=format&fit=crop&w=800&q=80',
    isFeatured: true,
    productIds: ['p1', 'p2', 'p6']
  },
  {
    id: 'col-3',
    name: 'Everyday Toddler Playwear',
    slug: 'everyday-playwear',
    description: 'Durable, breathable, quick-wash cotton outfits made for joyful everyday play.',
    image: 'https://images.unsplash.com/photo-1519238263530-99bdd11df2ea?auto=format&fit=crop&w=800&q=80',
    isFeatured: true,
    productIds: ['p1', 'p4', 'p7']
  }
];

export const initialCoupons: Coupon[] = [
  {
    id: 'c1',
    code: 'TINY20',
    discountType: 'percent',
    discountValue: 20,
    minSpend: 999,
    maxDiscount: 500,
    expiryDate: '2026-12-31',
    usageLimit: 1000,
    timesUsed: 142,
    active: true
  },
  {
    id: 'c2',
    code: 'WELCOME500',
    discountType: 'flat',
    discountValue: 500,
    minSpend: 1999,
    expiryDate: '2026-12-31',
    usageLimit: 500,
    timesUsed: 89,
    active: true
  },
  {
    id: 'c3',
    code: 'FESTIVE15',
    discountType: 'percent',
    discountValue: 15,
    minSpend: 1499,
    maxDiscount: 400,
    expiryDate: '2026-12-31',
    usageLimit: 800,
    timesUsed: 67,
    active: true
  }
];

export const initialOrders: Order[] = [
  {
    id: 'ord-1001',
    orderNumber: 'ATT-2026-8912',
    date: '2026-07-22T14:30:00Z',
    customer: {
      name: 'Priyanka Sharma',
      email: 'priyanka.s@gmail.com',
      phone: '+91 98765 43210',
      address: {
        street: 'Flat 402, Sunshine Heights, Jubilee Hills',
        city: 'Hyderabad',
        state: 'Telangana',
        zip: '500033',
        country: 'India'
      }
    },
    items: [
      {
        productId: 'p1',
        name: 'Akshvik Pastel Floral Cotton Frock',
        image: 'https://images.unsplash.com/photo-1519238263530-99bdd11df2ea?auto=format&fit=crop&w=400&q=80',
        color: 'Blush Pink',
        size: '2Y',
        ageGroup: '1-2Y',
        price: 1299,
        quantity: 1
      },
      {
        productId: 'p3',
        name: 'Organic Bamboo Cloud-Soft Onesie (Pack of 3)',
        image: 'https://images.unsplash.com/photo-1518831959646-742c3a14ebf7?auto=format&fit=crop&w=400&q=80',
        color: 'Pastel Trio',
        size: '12M',
        ageGroup: '6-12M',
        price: 1199,
        quantity: 1
      }
    ],
    subtotal: 2498,
    discount: 500,
    shipping: 0,
    tax: 125,
    total: 2123,
    status: 'Out for Delivery',
    paymentMethod: 'UPI',
    paymentStatus: 'Paid',
    trackingNumber: 'DEL-IND-902184',
    trackingCarrier: 'Delhivery Express',
    timeline: [
      { status: 'Pending', title: 'Order Placed', description: 'Order successfully received & verified.', date: '22 Jul 2026, 02:30 PM', completed: true },
      { status: 'Processing', title: 'Quality Checked & Packed', description: 'Items packed in eco-friendly gift wrap.', date: '22 Jul 2026, 05:15 PM', completed: true },
      { status: 'Shipped', title: 'Dispatched via Express Courier', description: 'Package departed Hyderabad hub.', date: '23 Jul 2026, 08:00 AM', completed: true },
      { status: 'Out for Delivery', title: 'Out for Delivery', description: 'Agent Ramesh (+91 9988776655) is enroute.', date: '23 Jul 2026, 11:45 AM', completed: true },
      { status: 'Delivered', title: 'Delivered', description: 'Expected by 04:00 PM today.', date: 'Expected Today', completed: false }
    ]
  },
  {
    id: 'ord-1002',
    orderNumber: 'ATT-2026-8913',
    date: '2026-07-21T10:15:00Z',
    customer: {
      name: 'Ananya Verma',
      email: 'ananya.v@yahoo.com',
      phone: '+91 98123 45678',
      address: {
        street: 'B-12, Sector 15, Vasundhara',
        city: 'Noida',
        state: 'Uttar Pradesh',
        zip: '201012',
        country: 'India'
      }
    },
    items: [
      {
        productId: 'p2',
        name: 'Little Prince Handcrafted Silk Kurta Pyjama & Vest',
        image: 'https://images.unsplash.com/photo-1622290291468-a28f7a7dc6a8?auto=format&fit=crop&w=400&q=80',
        color: 'Royal Gold & Beige',
        size: '3Y',
        ageGroup: '2-4Y',
        price: 2499,
        quantity: 1
      }
    ],
    subtotal: 2499,
    discount: 374,
    shipping: 0,
    tax: 125,
    total: 2250,
    status: 'Delivered',
    paymentMethod: 'Card',
    paymentStatus: 'Paid',
    trackingNumber: 'BLUDART-882103',
    trackingCarrier: 'BlueDart Express',
    timeline: [
      { status: 'Pending', title: 'Order Placed', description: 'Verified via Credit Card.', date: '21 Jul 2026, 10:15 AM', completed: true },
      { status: 'Processing', title: 'Packed', description: 'Sanitized & double boxed.', date: '21 Jul 2026, 01:20 PM', completed: true },
      { status: 'Shipped', title: 'In Transit', description: 'Transit from Delhi warehouse.', date: '22 Jul 2026, 09:00 AM', completed: true },
      { status: 'Delivered', title: 'Delivered to Customer', description: 'Delivered and signed by Ananya V.', date: '23 Jul 2026, 02:10 PM', completed: true }
    ]
  }
];

export const initialCustomers: Customer[] = [
  {
    id: 'cust-1',
    name: 'Priyanka Sharma',
    email: 'priyanka.s@gmail.com',
    phone: '+91 98765 43210',
    avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=200&q=80',
    registeredDate: '2026-03-15',
    totalOrders: 4,
    totalSpent: 8490,
    addresses: [
      {
        id: 'addr-1',
        type: 'Home',
        street: 'Flat 402, Sunshine Heights, Jubilee Hills',
        city: 'Hyderabad',
        state: 'Telangana',
        zip: '500033',
        isDefault: true
      }
    ],
    rewardPoints: 340,
    isBlocked: false
  },
  {
    id: 'cust-2',
    name: 'Ananya Verma',
    email: 'ananya.v@yahoo.com',
    phone: '+91 98123 45678',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80',
    registeredDate: '2026-05-10',
    totalOrders: 2,
    totalSpent: 4749,
    addresses: [
      {
        id: 'addr-2',
        type: 'Home',
        street: 'B-12, Sector 15, Vasundhara',
        city: 'Noida',
        state: 'Uttar Pradesh',
        zip: '201012',
        isDefault: true
      }
    ],
    rewardPoints: 190,
    isBlocked: false
  }
];

export const initialReviews: Review[] = [
  {
    id: 'rev-1',
    productId: 'p1',
    productName: 'Akshvik Pastel Floral Cotton Frock',
    customerName: 'Meera Deshmukh',
    customerAvatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=200&q=80',
    rating: 5,
    title: 'Absolute Perfection for my 2 year old daughter!',
    comment: 'The fabric quality is unreal! Super soft, breathable and no rough stitches inside. My daughter wore it for 6 hours straight at a birthday party and was so comfortable. Will buy in more colors!',
    verifiedPurchase: true,
    date: '2026-07-18',
    status: 'Approved',
    featured: true,
    adminReply: 'Thank you Meera! So happy your baby loved the dress! ❤️ - Akshvik Team'
  },
  {
    id: 'rev-2',
    productId: 'p2',
    productName: 'Little Prince Handcrafted Silk Kurta Pyjama & Vest',
    customerName: 'Rajesh Kulkarni',
    customerAvatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=200&q=80',
    rating: 5,
    title: 'Looks so rich for festival celebrations!',
    comment: 'Bought this for my 3 year old son for a family wedding function. The inner lining is pure cotton, so he did not complain of itching even once. Everyone complemented his royal look!',
    verifiedPurchase: true,
    date: '2026-07-15',
    status: 'Approved',
    featured: true
  },
  {
    id: 'rev-3',
    productId: 'p3',
    productName: 'Organic Bamboo Cloud-Soft Onesie (Pack of 3)',
    customerName: 'Sneha Patel',
    customerAvatar: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?auto=format&fit=crop&w=200&q=80',
    rating: 5,
    title: 'Lifesaver for newborn sensitive skin',
    comment: 'My 2-month baby had slight heat rashes from regular cotton onesies. Switched to Akshvik organic bamboo onesies and the redness went away in 2 days. So silky soft and tagless neck is a gamechanger.',
    verifiedPurchase: true,
    date: '2026-07-10',
    status: 'Approved',
    featured: true
  }
];

export const initialBlogs: BlogPost[] = [
  {
    id: 'blog-1',
    title: 'How to Choose Safe, Chemical-Free Fabrics for Sensitive Newborn Skin',
    slug: 'safe-fabrics-for-sensitive-newborn-skin',
    excerpt: 'Discover why GOTS certified organic cotton & bamboo fiber protect infant skin from heat rashes and synthetic dye allergies.',
    content: `When dressing your newborn, skin safety is priority #1. Infant skin is 30% thinner than adult skin and absorbs chemicals faster.

### Key Factors to Look For:
1. **OEKO-TEX & GOTS Certification**: Guarantees zero pesticides, phthalates or toxicazo dyes.
2. **Tagless Interiors**: Prevents scratchy friction against the back of baby's neck.
3. **Nickle-Free Snap Buttons**: Protects against metal contact skin redness.
4. **Breathable Weave**: Allows air circulation to prevent heat rashes in summer.

At Akshvik Tiny Trends, every newborn garment undergoes 12 strict safety tests before reaching your baby's closet.`,
    coverImage: 'https://images.unsplash.com/photo-1518831959646-742c3a14ebf7?auto=format&fit=crop&w=800&q=80',
    author: 'Dr. Kavita Reddy (Pediatric Skin Care Expert)',
    date: '2026-07-05',
    category: 'Baby Care & Health',
    tags: ['Newborn', 'Organic Cotton', 'Skin Care', 'Parenting Tips'],
    published: true
  },
  {
    id: 'blog-2',
    title: 'Top Kids Festive Fashion Trends for 2026: Silk Kurtas & Pastel Frocks',
    slug: 'kids-festive-fashion-trends-2026',
    excerpt: 'Explore this season’s trendiest kids ethnic wear styles blending traditional elegance with lightweight baby comfort.',
    content: `Festive dressing for kids has evolved! Gone are the days of heavy, prickly traditional wear. Today's parents want royal aesthetics with cloud-like comfort.

### Top Trends This Season:
- **Pastel Palette**: Soft blush pinks, sky mints, and sage greens are ruling festive celebrations over heavy dark colors.
- **Detachable Waistcoats**: Versatile 3-piece sets that can be dressed down for casual family dinners.
- **Handicraft Embroidery**: Subtle hand-embroidered motifs that add luxury without adding scratchy metallic threads.`,
    coverImage: 'https://images.unsplash.com/photo-1622290291468-a28f7a7dc6a8?auto=format&fit=crop&w=800&q=80',
    author: 'Sunita Kapur (Chief Fashion Curator)',
    date: '2026-07-12',
    category: 'Kids Fashion',
    tags: ['Festive', 'Ethnic Wear', 'Fashion Trends', 'Kids Styling'],
    published: true
  }
];

export const initialSiteSettings: SiteSettings = {
  storeName: 'Akshvik Tiny Trends',
  tagline: 'Premium Modern Kids Fashion & Baby Essentials',
  logoUrl: '',
  faviconUrl: '',
  primaryColor: '#e11d48', // rose-600
  secondaryColor: '#f43f5e',
  accentColor: '#fb7185',
  supportEmail: 'care@akshviktinytrends.com',
  supportPhone: '+91 98765 12345',
  address: 'Plot 42, Tiny Trends Fashion Hub, Jubilee Hills, Hyderabad - 500033',
  socialLinks: {
    instagram: 'https://instagram.com/akshvik_tinytrends',
    facebook: 'https://facebook.com/akshviktinytrends',
    pinterest: 'https://pinterest.com/akshviktinytrends',
    youtube: 'https://youtube.com/akshviktinytrends'
  },
  taxPercent: 5,
  shippingFee: 99,
  freeShippingThreshold: 999,
  maintenanceMode: false,
  currencySymbol: '₹',
  currencyCode: 'INR'
};

export const initialSections: HomepageSection[] = [
  { id: 'hero_slider', type: 'hero_slider', title: 'Hero Banner Slider', subtitle: 'Main interactive homepage hero slides', enabled: true, visible: true, order: 1, priority: 1 },
  { id: 'category_grid', type: 'category_grid', title: 'Shop by Category', subtitle: 'Curated fashion categories grid', enabled: true, visible: true, order: 2, priority: 2 },
  { id: 'age_filter', type: 'age_filter', title: 'Shop by Age Group', subtitle: 'Quick age group pill selector', enabled: true, visible: true, order: 3, priority: 3 },
  { id: 'flash_deals', type: 'flash_deals', title: 'Flash Deals & Today Offers', subtitle: 'Limited time discounted countdown items', enabled: true, visible: true, order: 4, priority: 4 },
  { id: 'new_arrivals', type: 'new_arrivals', title: 'New Arrivals & Best Sellers', subtitle: 'Freshly arrived kids outfits', enabled: true, visible: true, order: 5, priority: 5 },
  { id: 'featured', type: 'featured', title: 'Parent Favorites', subtitle: 'Trending Best Sellers', enabled: true, visible: true, order: 6, priority: 6 },
  { id: 'why_choose_us', type: 'why_choose_us', title: 'Why Parents Love Us', subtitle: 'Guarantees and quality standards', enabled: true, visible: true, order: 7, priority: 7 },
  { id: 'testimonials', type: 'testimonials', title: 'Happy Parents Reviews', subtitle: 'Verified buyer testimonials', enabled: true, visible: true, order: 8, priority: 8 },
  { id: 'instagram_gallery', type: 'instagram_gallery', title: 'Instagram Community Grid', subtitle: 'Photos of kids wearing Akshvik outfits', enabled: true, visible: true, order: 9, priority: 9 }
];
