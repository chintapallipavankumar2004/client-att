import type { AdminPermission, AdminRole } from './shared/adminAccess';

export interface HeroBanner {
  id: string;
  desktopImage: string;
  mobileImage: string;
  title: string;
  subtitle: string;
  badgeText?: string;
  buttonText: string;
  buttonLink: string;
  bgColor?: string;
  textColor?: string;
  priority: number;
  active: boolean;
  scheduleStart?: string;
  scheduleEnd?: string;
}

export interface AnnouncementItem {
  id: string;
  text: string;
  icon?: string;
  active: boolean;
  speed?: number;
  link?: string;
}

export interface Category {
  id: string;
  name: string;
  slug: string;
  image: string;
  icon?: string;
  banner?: string;
  description: string;
  priority: number;
  active: boolean;
  discountPercent?: number;
  discountBadge?: string;
  itemCount?: number;
  isFeatured: boolean;
  productCount?: number;
}

export interface AgeCategory {
  id: string;
  label: string; // e.g. "0-6 Months", "1-2 Years"
  range: string; // e.g. "0-6M", "1-2Y"
  active: boolean;
  priority: number;
  icon?: string;
  badgeColor?: string;
}

export interface ProductVariant {
  id: string;
  color: string;
  colorCode: string;
  size: string;
  age: string;
  sku: string;
  price: number;
  originalPrice: number;
  stock: number;
}

export interface Review {
  id: string;
  productId: string;
  productName: string;
  customerName: string;
  customerAvatar?: string;
  rating: number;
  title: string;
  comment: string;
  verifiedPurchase: boolean;
  date: string;
  status: 'Approved' | 'Pending' | 'Rejected';
  featured?: boolean;
  adminReply?: string;
}

export interface Product {
  id: string;
  name: string;
  slug: string;
  sku: string;
  description: string;
  shortDescription: string;
  price: number;
  originalPrice: number;
  discountPercent: number;
  isNew: boolean;
  isNewArrival?: boolean;
  isTrending: boolean;
  isBestSeller: boolean;
  isFeatured: boolean;
  isFlashDeal: boolean;
  flashEnd?: string; // ISO date string
  images: string[];
  videoUrl?: string;
  ageGroups: string[]; // e.g. ["Newborn", "0-6M", "6-12M"]
  sizes: string[]; // e.g. ["NB", "3M", "6M", "1Y", "2Y"]
  colors: { name: string; hex: string }[];
  categories: string[]; // category IDs or slugs
  brand: string;
  tags: string[];
  stock: number;
  rating: number;
  reviewCount: number;
  isBabySafe: boolean;
  fabricDetails: string;
  careInstructions: string;
  variants?: ProductVariant[];
  seoTitle?: string;
  seoDescription?: string;
  createdAt: string;
}

export interface Collection {
  id: string;
  name: string;
  slug: string;
  description: string;
  image: string;
  isFeatured: boolean;
  productIds: string[];
}

export interface Coupon {
  id: string;
  code: string;
  discountType: 'percent' | 'flat';
  discountValue: number;
  minSpend: number;
  maxDiscount?: number;
  expiryDate: string;
  usageLimit: number;
  timesUsed: number;
  active: boolean;
}

export interface OrderItem {
  productId: string;
  name: string;
  image: string;
  color: string;
  size: string;
  ageGroup: string;
  price: number;
  quantity: number;
}

export interface OrderTimelineEvent {
  status: string;
  title: string;
  description: string;
  date: string;
  completed: boolean;
}

export interface Order {
  id: string;
  orderNumber: string;
  date: string;
  customer: {
    name: string;
    email: string;
    phone: string;
    address: {
      street: string;
      city: string;
      state: string;
      zip: string;
      country: string;
    };
  };
  items: OrderItem[];
  subtotal: number;
  discount: number;
  shipping: number;
  tax: number;
  total: number;
  status: 'Pending' | 'Processing' | 'Shipped' | 'Out for Delivery' | 'Delivered' | 'Cancelled';
  paymentMethod: 'UPI' | 'Card' | 'COD' | 'NetBanking';
  paymentStatus: 'Paid' | 'Pending' | 'Refunded';
  trackingNumber: string;
  trackingCarrier: string;
  timeline: OrderTimelineEvent[];
}

export interface Customer {
  id: string;
  name: string;
  email: string;
  phone: string;
  avatar?: string;
  registeredDate: string;
  totalOrders: number;
  totalSpent: number;
  addresses: {
    id: string;
    type: 'Home' | 'Work';
    street: string;
    city: string;
    state: string;
    zip: string;
    isDefault: boolean;
  }[];
  rewardPoints: number;
  isBlocked: boolean;
}

export interface BlogPost {
  id: string;
  title: string;
  slug: string;
  excerpt: string;
  content: string;
  coverImage: string;
  author: string;
  date: string;
  category: string;
  tags: string[];
  published: boolean;
}

export interface SiteSettings {
  storeName: string;
  tagline: string;
  logoUrl?: string;
  faviconUrl?: string;
  primaryColor: string;
  secondaryColor: string;
  accentColor: string;
  supportEmail: string;
  supportPhone: string;
  address: string;
  socialLinks: {
    instagram: string;
    facebook: string;
    pinterest: string;
    youtube: string;
  };
  taxPercent: number;
  shippingFee: number;
  freeShippingThreshold: number;
  maintenanceMode: boolean;
  currencySymbol: string;
  currencyCode: string;
}

export interface HomepageSection {
  id: string;
  type: 'hero_slider' | 'offer_strip' | 'category_grid' | 'age_filter' | 'flash_deals' | 'new_arrivals' | 'featured_collections' | 'featured' | 'why_choose_us' | 'testimonials' | 'instagram_gallery' | 'newsletter' | 'blogs';
  title: string;
  subtitle: string;
  enabled?: boolean;
  visible?: boolean;
  order?: number;
  priority?: number;
}

export interface AdminSessionUser {
  uid: string;
  email: string;
  name: string;
  role: AdminRole;
  permissions: AdminPermission[];
  expiresAt: number;
  rememberMe: boolean;
  lastLogin?: string | null;
}

export interface StorefrontData {
  products: Product[];
  categories: Category[];
  ageCategories: AgeCategory[];
  banners: HeroBanner[];
  announcements: AnnouncementItem[];
  coupons: Coupon[];
  reviews: Review[];
  siteSettings: SiteSettings;
  sections: HomepageSection[];
}

export interface AdminDashboardData {
  orders: Order[];
  customers: Customer[];
  coupons: Coupon[];
  reviews: Review[];
}
