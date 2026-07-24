import React, { createContext, useContext, useState, useEffect } from 'react';
import {
  Product,
  Category,
  AgeCategory,
  HeroBanner,
  AnnouncementItem,
  Order,
  Coupon,
  Review,
  Customer,
  SiteSettings,
  HomepageSection,
  OrderItem
} from '../types';
import {
  initialBanners,
  initialAnnouncements,
  initialCategories,
  initialAgeCategories,
  initialProducts,
  initialCoupons,
  initialOrders,
  initialCustomers,
  initialReviews,
  initialSiteSettings,
  initialSections
} from '../data/initialData';

interface CartItem extends OrderItem {
  product: Product;
}

// LocalStorage Helper
function getStored<T>(key: string, fallback: T): T {
  try {
    const stored = localStorage.getItem(`akshvik_${key}`);
    if (stored) {
      return JSON.parse(stored);
    }
  } catch (e) {
    console.error(`Error loading localStorage key akshvik_${key}`, e);
  }
  return fallback;
}

function setStored<T>(key: string, value: T): void {
  try {
    localStorage.setItem(`akshvik_${key}`, JSON.stringify(value));
  } catch (e) {
    console.error(`Error writing localStorage key akshvik_${key}`, e);
  }
}

interface StoreContextType {
  // Store state
  products: Product[];
  categories: Category[];
  ageCategories: AgeCategory[];
  banners: HeroBanner[];
  announcements: AnnouncementItem[];
  orders: Order[];
  coupons: Coupon[];
  reviews: Review[];
  customers: Customer[];
  siteSettings: SiteSettings;
  sections: HomepageSection[];
  homepageLayout: HomepageSection[];
  setHomepageLayout: (layout: HomepageSection[]) => void;
  loading: boolean;

  // CRUD actions (Frontend local state persistence)
  addProduct: (productData: Omit<Product, 'id'>) => Product;
  updateProduct: (id: string, updates: Partial<Product>) => void;
  deleteProduct: (id: string) => void;

  addBanner: (bannerData: Omit<HeroBanner, 'id'>) => void;
  updateBanner: (id: string, updates: Partial<HeroBanner>) => void;
  deleteBanner: (id: string) => void;

  updateAnnouncement: (id: string, updates: Partial<AnnouncementItem>) => void;

  addCategory: (catData: Omit<Category, 'id'>) => void;
  updateCategory: (id: string, updates: Partial<Category>) => void;
  deleteCategory: (id: string) => void;

  addOrder: (orderData: any) => Order;
  updateOrderStatus: (id: string, status: string) => void;
  updateOrderTracking: (id: string, trackingNumber: string, statusTimeline: any[]) => void;

  addCoupon: (couponData: Omit<Coupon, 'id'>) => void;
  deleteCoupon: (id: string) => void;

  addReview: (reviewData: any) => Review;
  updateReviewStatus: (id: string, status: 'Approved' | 'Pending' | 'Rejected') => void;
  deleteReview: (id: string) => void;

  updateSiteSettingsState: (newSettings: Partial<SiteSettings>) => void;

  // Cart
  cart: CartItem[];
  isCartOpen: boolean;
  setIsCartOpen: (open: boolean) => void;
  addToCart: (product: Product, size: string, color: string, ageGroup: string, quantity?: number) => void;
  removeFromCart: (index: number) => void;
  updateCartQuantity: (index: number, qty: number) => void;
  clearCart: () => void;
  cartSubtotal: number;
  cartTotal: number;
  appliedCoupon: Coupon | null;
  applyCoupon: (code: string) => { success: boolean; message: string };
  removeCoupon: () => void;

  // Wishlist
  wishlist: Product[];
  toggleWishlist: (product: Product) => void;
  isInWishlist: (productId: string) => boolean;

  // Quick View & Modals
  quickViewProduct: Product | null;
  setQuickViewProduct: (product: Product | null) => void;
  isTrackOrderOpen: boolean;
  setIsTrackOrderOpen: (open: boolean) => void;

  // Admin Mode
  isAdminOpen: boolean;
  setIsAdminOpen: (open: boolean) => void;
  adminTab: string;
  setAdminTab: (tab: string) => void;

  // Navigation & Filters
  currentView: 'home' | 'shop' | 'product' | 'cart' | 'checkout' | 'account' | 'about' | 'blog' | 'contact' | 'admin';
  setCurrentView: (view: any) => void;
  selectedProductSlug: string | null;
  setSelectedProductSlug: (slug: string | null) => void;
  searchQuery: string;
  setSearchQuery: (q: string) => void;
  activeCategoryFilter: string | null;
  setActiveCategoryFilter: (cat: string | null) => void;
  activeAgeFilter: string | null;
  setActiveAgeFilter: (age: string | null) => void;

  // Refetch
  refetchAllData: () => Promise<void>;
}

const StoreContext = createContext<StoreContextType | undefined>(undefined);

export const StoreProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [products, setProducts] = useState<Product[]>(() => getStored('products', initialProducts));
  const [categories, setCategories] = useState<Category[]>(() => getStored('categories', initialCategories));
  const [ageCategories] = useState<AgeCategory[]>(() => getStored('ageCategories', initialAgeCategories));
  const [banners, setBanners] = useState<HeroBanner[]>(() => getStored('banners', initialBanners));
  const [announcements, setAnnouncements] = useState<AnnouncementItem[]>(() => getStored('announcements', initialAnnouncements));
  const [orders, setOrders] = useState<Order[]>(() => getStored('orders', initialOrders));
  const [coupons, setCoupons] = useState<Coupon[]>(() => getStored('coupons', initialCoupons));
  const [reviews, setReviews] = useState<Review[]>(() => getStored('reviews', initialReviews));
  const [customers] = useState<Customer[]>(() => getStored('customers', initialCustomers));
  const [sections, setSections] = useState<HomepageSection[]>(() => getStored('sections', initialSections));
  const [homepageLayout, setHomepageLayoutState] = useState<HomepageSection[]>(() => getStored('sections', initialSections));
  const [siteSettings, setSiteSettings] = useState<SiteSettings>(() => getStored('siteSettings', initialSiteSettings));

  const [loading, setLoading] = useState<boolean>(false);

  // Local interactive state
  const [cart, setCart] = useState<CartItem[]>(() => getStored('cart', []));
  const [isCartOpen, setIsCartOpen] = useState<boolean>(false);
  const [wishlist, setWishlist] = useState<Product[]>(() => getStored('wishlist', []));
  const [appliedCoupon, setAppliedCoupon] = useState<Coupon | null>(null);

  const [quickViewProduct, setQuickViewProduct] = useState<Product | null>(null);
  const [isTrackOrderOpen, setIsTrackOrderOpen] = useState<boolean>(false);

  // Navigation
  const [currentView, setCurrentView] = useState<'home' | 'shop' | 'product' | 'cart' | 'checkout' | 'account' | 'about' | 'blog' | 'contact' | 'admin'>('home');
  const [selectedProductSlug, setSelectedProductSlug] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [activeCategoryFilter, setActiveCategoryFilter] = useState<string | null>(null);
  const [activeAgeFilter, setActiveAgeFilter] = useState<string | null>(null);

  // Admin
  const [isAdminOpen, setIsAdminOpen] = useState<boolean>(false);
  const [adminTab, setAdminTab] = useState<string>('dashboard');

  // Persistence triggers
  useEffect(() => { setStored('products', products); }, [products]);
  useEffect(() => { setStored('categories', categories); }, [categories]);
  useEffect(() => { setStored('banners', banners); }, [banners]);
  useEffect(() => { setStored('announcements', announcements); }, [announcements]);
  useEffect(() => { setStored('orders', orders); }, [orders]);
  useEffect(() => { setStored('coupons', coupons); }, [coupons]);
  useEffect(() => { setStored('reviews', reviews); }, [reviews]);
  useEffect(() => { setStored('sections', homepageLayout); }, [homepageLayout]);
  useEffect(() => { setStored('siteSettings', siteSettings); }, [siteSettings]);
  useEffect(() => { setStored('cart', cart); }, [cart]);
  useEffect(() => { setStored('wishlist', wishlist); }, [wishlist]);

  // Apply dynamic theme colors to root
  useEffect(() => {
    if (siteSettings.primaryColor) {
      document.documentElement.style.setProperty('--color-primary', siteSettings.primaryColor);
    }
  }, [siteSettings]);

  const setHomepageLayout = (layout: HomepageSection[]) => {
    setHomepageLayoutState(layout);
    setSections(layout);
  };

  // CRUD Implementations for frontend-only
  const addProduct = (productData: Omit<Product, 'id'>): Product => {
    const newProd: Product = {
      ...productData,
      id: `p-${Date.now()}`,
      slug: productData.slug || productData.name.toLowerCase().replace(/[^a-z0-9]+/g, '-'),
      createdAt: new Date().toISOString()
    };
    setProducts(prev => [newProd, ...prev]);
    return newProd;
  };

  const updateProduct = (id: string, updates: Partial<Product>) => {
    setProducts(prev => prev.map(p => p.id === id ? { ...p, ...updates } : p));
  };

  const deleteProduct = (id: string) => {
    setProducts(prev => prev.filter(p => p.id !== id));
  };

  const addBanner = (bannerData: Omit<HeroBanner, 'id'>) => {
    const newBanner: HeroBanner = {
      ...bannerData,
      id: `b-${Date.now()}`
    };
    setBanners(prev => [...prev, newBanner]);
  };

  const updateBanner = (id: string, updates: Partial<HeroBanner>) => {
    setBanners(prev => prev.map(b => b.id === id ? { ...b, ...updates } : b));
  };

  const deleteBanner = (id: string) => {
    setBanners(prev => prev.filter(b => b.id !== id));
  };

  const updateAnnouncement = (id: string, updates: Partial<AnnouncementItem>) => {
    setAnnouncements(prev => prev.map(a => a.id === id ? { ...a, ...updates } : a));
  };

  const addCategory = (catData: Omit<Category, 'id'>) => {
    const newCat: Category = {
      ...catData,
      id: `c-${Date.now()}`,
      slug: catData.slug || catData.name.toLowerCase().replace(/[^a-z0-9]+/g, '-')
    };
    setCategories(prev => [...prev, newCat]);
  };

  const updateCategory = (id: string, updates: Partial<Category>) => {
    setCategories(prev => prev.map(c => c.id === id ? { ...c, ...updates } : c));
  };

  const deleteCategory = (id: string) => {
    setCategories(prev => prev.filter(c => c.id !== id));
  };

  const addOrder = (orderData: any): Order => {
    const newOrder: Order = {
      id: `ord-${Date.now()}`,
      orderNumber: `ATT-${Math.floor(100000 + Math.random() * 900000)}`,
      date: new Date().toISOString(),
      customer: {
        name: orderData.customer?.name || `${orderData.customer?.firstName || 'Customer'} ${orderData.customer?.lastName || ''}`.trim(),
        email: orderData.customer?.email || 'customer@example.com',
        phone: orderData.customer?.phone || '+91 9876543210',
        address: {
          street: orderData.customer?.address || orderData.customer?.street || '123 Fashion Lane',
          city: orderData.customer?.city || 'Hyderabad',
          state: orderData.customer?.state || 'Telangana',
          zip: orderData.customer?.zip || orderData.customer?.pincode || '500033',
          country: 'India'
        }
      },
      items: orderData.items || [],
      subtotal: orderData.subtotal || 0,
      discount: orderData.discount || 0,
      shipping: orderData.shippingFee || orderData.shipping || 0,
      tax: orderData.tax || 0,
      total: orderData.total || 0,
      status: 'Processing',
      paymentMethod: orderData.paymentMethod || 'COD',
      paymentStatus: orderData.paymentMethod === 'Online' ? 'Paid' : 'Pending',
      trackingNumber: `EXP${Math.floor(10000000 + Math.random() * 90000000)}IN`,
      trackingCarrier: 'Delhivery Express',
      timeline: [
        { status: 'Placed', title: 'Order Placed', description: 'Your order was received', date: new Date().toLocaleDateString(), completed: true }
      ]
    };
    setOrders(prev => [newOrder, ...prev]);
    return newOrder;
  };

  const updateOrderStatus = (id: string, status: string) => {
    setOrders(prev => prev.map(o => {
      if (o.id === id) {
        const timeline = [...(o.timeline || [])];
        timeline.push({ status, title: `Order ${status}`, description: `Status updated to ${status}`, date: new Date().toLocaleDateString(), completed: true });
        return { ...o, status: status as any, timeline };
      }
      return o;
    }));
  };

  const updateOrderTracking = (id: string, trackingNumber: string, statusTimeline: any[]) => {
    setOrders(prev => prev.map(o => {
      if (o.id === id) {
        const timeline = [...(o.timeline || [])];
        if (statusTimeline && statusTimeline[0]) {
          timeline.push({ status: 'Shipped', title: 'Carrier Updated', description: statusTimeline[0].status || 'In Transit', date: new Date().toLocaleDateString(), completed: true });
        }
        return { ...o, trackingNumber, timeline };
      }
      return o;
    }));
  };

  const addCoupon = (couponData: Omit<Coupon, 'id'>) => {
    const newCoupon: Coupon = {
      ...couponData,
      id: `cp-${Date.now()}`
    };
    setCoupons(prev => [...prev, newCoupon]);
  };

  const deleteCoupon = (id: string) => {
    setCoupons(prev => prev.filter(c => c.id !== id));
  };

  const addReview = (reviewData: any): Review => {
    const newRev: Review = {
      id: `rev-${Date.now()}`,
      productId: reviewData.productId,
      productName: reviewData.productName || 'Kids Item',
      customerName: reviewData.customerName || 'Happy Parent',
      rating: reviewData.rating || 5,
      title: reviewData.title || 'Great Quality!',
      comment: reviewData.comment || '',
      verifiedPurchase: true,
      date: new Date().toISOString().split('T')[0],
      status: 'Approved',
      featured: false
    };
    setReviews(prev => [newRev, ...prev]);
    return newRev;
  };

  const updateReviewStatus = (id: string, status: 'Approved' | 'Pending' | 'Rejected') => {
    setReviews(prev => prev.map(r => r.id === id ? { ...r, status } : r));
  };

  const deleteReview = (id: string) => {
    setReviews(prev => prev.filter(r => r.id !== id));
  };

  const updateSiteSettingsState = (newSettings: Partial<SiteSettings>) => {
    setSiteSettings(prev => ({ ...prev, ...newSettings }));
  };

  const refetchAllData = async () => {
    // Pure frontend refresh if needed
    setLoading(false);
  };

  // Cart helper functions
  const addToCart = (product: Product, size: string, color: string, ageGroup: string, quantity = 1) => {
    setCart(prev => {
      const existingIdx = prev.findIndex(item => item.productId === product.id && item.size === size && item.color === color);
      if (existingIdx !== -1) {
        const copy = [...prev];
        copy[existingIdx].quantity += quantity;
        return copy;
      } else {
        const newItem: CartItem = {
          productId: product.id,
          name: product.name,
          image: product.images[0] || '',
          color: color || (product.colors[0]?.name || 'Standard'),
          size: size || (product.sizes[0] || '1Y'),
          ageGroup: ageGroup || (product.ageGroups[0] || '1-2Y'),
          price: product.price,
          quantity,
          product
        };
        return [...prev, newItem];
      }
    });
    setIsCartOpen(true);
  };

  const removeFromCart = (index: number) => {
    setCart(prev => prev.filter((_, i) => i !== index));
  };

  const updateCartQuantity = (index: number, qty: number) => {
    if (qty <= 0) {
      removeFromCart(index);
      return;
    }
    setCart(prev => {
      const copy = [...prev];
      copy[index].quantity = qty;
      return copy;
    });
  };

  const clearCart = () => {
    setCart([]);
    setAppliedCoupon(null);
  };

  const cartSubtotal = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);

  let discountAmount = 0;
  if (appliedCoupon) {
    if (appliedCoupon.discountType === 'percent') {
      discountAmount = Math.round((cartSubtotal * appliedCoupon.discountValue) / 100);
      if (appliedCoupon.maxDiscount && discountAmount > appliedCoupon.maxDiscount) {
        discountAmount = appliedCoupon.maxDiscount;
      }
    } else {
      discountAmount = appliedCoupon.discountValue;
    }
  }

  const shippingFee = cartSubtotal >= siteSettings.freeShippingThreshold || cartSubtotal === 0 ? 0 : siteSettings.shippingFee;
  const taxAmount = Math.round(((cartSubtotal - discountAmount) * siteSettings.taxPercent) / 100);
  const cartTotal = Math.max(0, cartSubtotal - discountAmount + shippingFee + taxAmount);

  const applyCoupon = (code: string) => {
    const cleanCode = code.trim().toUpperCase();
    const found = coupons.find(c => c.code === cleanCode && c.active);
    if (!found) {
      return { success: false, message: 'Invalid or expired coupon code.' };
    }
    if (cartSubtotal < found.minSpend) {
      return { success: false, message: `Minimum purchase of ${siteSettings.currencySymbol}${found.minSpend} required for code ${found.code}.` };
    }
    setAppliedCoupon(found);
    return { success: true, message: `Coupon ${found.code} applied successfully!` };
  };

  const removeCoupon = () => {
    setAppliedCoupon(null);
  };

  // Wishlist
  const toggleWishlist = (product: Product) => {
    setWishlist(prev => {
      const exists = prev.some(p => p.id === product.id);
      if (exists) {
        return prev.filter(p => p.id !== product.id);
      } else {
        return [...prev, product];
      }
    });
  };

  const isInWishlist = (productId: string) => wishlist.some(p => p.id === productId);

  return (
    <StoreContext.Provider
      value={{
        products,
        categories,
        ageCategories,
        banners,
        announcements,
        orders,
        coupons,
        reviews,
        customers,
        siteSettings,
        sections,
        homepageLayout,
        setHomepageLayout,
        loading,

        addProduct,
        updateProduct,
        deleteProduct,
        addBanner,
        updateBanner,
        deleteBanner,
        updateAnnouncement,
        addCategory,
        updateCategory,
        deleteCategory,
        addOrder,
        updateOrderStatus,
        updateOrderTracking,
        addCoupon,
        deleteCoupon,
        addReview,
        updateReviewStatus,
        deleteReview,
        updateSiteSettingsState,

        cart,
        isCartOpen,
        setIsCartOpen,
        addToCart,
        removeFromCart,
        updateCartQuantity,
        clearCart,
        cartSubtotal,
        cartTotal,
        appliedCoupon,
        applyCoupon,
        removeCoupon,
        wishlist,
        toggleWishlist,
        isInWishlist,
        quickViewProduct,
        setQuickViewProduct,
        isTrackOrderOpen,
        setIsTrackOrderOpen,
        isAdminOpen,
        setIsAdminOpen,
        adminTab,
        setAdminTab,
        currentView,
        setCurrentView,
        selectedProductSlug,
        setSelectedProductSlug,
        searchQuery,
        setSearchQuery,
        activeCategoryFilter,
        setActiveCategoryFilter,
        activeAgeFilter,
        setActiveAgeFilter,
        refetchAllData
      }}
    >
      {children}
    </StoreContext.Provider>
  );
};

export const useStore = () => {
  const context = useContext(StoreContext);
  if (!context) {
    throw new Error('useStore must be used within a StoreProvider');
  }
  return context;
};
