import React, { createContext, useContext, useEffect, useMemo, useState } from 'react';
import {
  type AdminTab,
  getAdminPath,
  getAdminTabFromPath,
} from '../shared/adminAccess';
import type {
  AgeCategory,
  AnnouncementItem,
  Category,
  Coupon,
  Customer,
  HeroBanner,
  HomepageSection,
  Order,
  OrderItem,
  Product,
  Review,
  SiteSettings,
} from '../types';
import {
  initialAgeCategories,
  initialAnnouncements,
  initialBanners,
  initialCategories,
  initialCoupons,
  initialProducts,
  initialReviews,
  initialSections,
  initialSiteSettings,
} from '../data/initialData';
import {
  createOrder,
  fetchAdminDashboardData,
  fetchStorefrontData,
  mutateAdminContent,
  submitReview,
  type PublicOrderPayload,
} from '../services/storefrontService';
import { useAdminAuth } from './AdminAuthContext';
import { navigateToPath } from '../lib/browserRouting';

interface CartItem extends OrderItem {
  product: Product;
}

type PublicView = 'home' | 'shop' | 'product' | 'cart' | 'checkout' | 'account' | 'about' | 'blog' | 'contact';

function getStored<T>(key: string, fallback: T): T {
  try {
    const stored = localStorage.getItem(`akshvik_${key}`);
    if (stored) {
      return JSON.parse(stored);
    }
  } catch (error) {
    console.error(`Unable to read akshvik_${key}`, error);
  }

  return fallback;
}

function setStored<T>(key: string, value: T) {
  try {
    localStorage.setItem(`akshvik_${key}`, JSON.stringify(value));
  } catch (error) {
    console.error(`Unable to write akshvik_${key}`, error);
  }
}

interface StoreContextType {
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
  setHomepageLayout: (layout: HomepageSection[]) => Promise<void>;
  loading: boolean;

  addProduct: (productData: Omit<Product, 'id'>) => Promise<Product>;
  updateProduct: (id: string, updates: Partial<Product>) => Promise<void>;
  deleteProduct: (id: string) => Promise<void>;

  addBanner: (bannerData: Omit<HeroBanner, 'id'>) => Promise<void>;
  updateBanner: (id: string, updates: Partial<HeroBanner>) => Promise<void>;
  deleteBanner: (id: string) => Promise<void>;

  updateAnnouncement: (id: string, updates: Partial<AnnouncementItem>) => Promise<void>;

  addCategory: (catData: Omit<Category, 'id'>) => Promise<void>;
  updateCategory: (id: string, updates: Partial<Category>) => Promise<void>;
  deleteCategory: (id: string) => Promise<void>;

  addOrder: (orderData: PublicOrderPayload) => Promise<Order>;
  updateOrderStatus: (id: string, status: string) => Promise<void>;
  updateOrderTracking: (id: string, trackingNumber: string, statusTimeline: any[]) => Promise<void>;

  addCoupon: (couponData: Omit<Coupon, 'id'>) => Promise<void>;
  deleteCoupon: (id: string) => Promise<void>;

  addReview: (reviewData: {
    productId: string;
    productName: string;
    customerName: string;
    rating: number;
    title: string;
    comment: string;
  }) => Promise<Review>;
  updateReviewStatus: (id: string, status: 'Approved' | 'Pending' | 'Rejected') => Promise<void>;
  updateReviewReply: (id: string, adminReply: string) => Promise<void>;
  deleteReview: (id: string) => Promise<void>;

  updateSiteSettings: (newSettings: Partial<SiteSettings>) => Promise<void>;

  cart: CartItem[];
  isCartOpen: boolean;
  setIsCartOpen: (open: boolean) => void;
  addToCart: (product: Product, size: string, color: string, ageGroup: string, quantity?: number) => void;
  removeFromCart: (index: number) => void;
  updateCartQuantity: (index: number, qty: number) => void;
  clearCart: () => void;
  cartSubtotal: number;
  cartDiscount: number;
  cartTotal: number;
  appliedCoupon: Coupon | null;
  applyCoupon: (code: string) => { success: boolean; message: string };
  removeCoupon: () => void;

  wishlist: Product[];
  toggleWishlist: (product: Product) => void;
  isInWishlist: (productId: string) => boolean;

  quickViewProduct: Product | null;
  setQuickViewProduct: (product: Product | null) => void;
  isTrackOrderOpen: boolean;
  setIsTrackOrderOpen: (open: boolean) => void;

  adminTab: AdminTab;
  setAdminTab: (tab: AdminTab) => void;

  currentView: PublicView;
  setCurrentView: (view: PublicView) => void;
  selectedProductSlug: string | null;
  setSelectedProductSlug: (slug: string | null) => void;
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  activeCategoryFilter: string | null;
  setActiveCategoryFilter: (category: string | null) => void;
  activeAgeFilter: string | null;
  setActiveAgeFilter: (age: string | null) => void;

  refetchAllData: () => Promise<void>;
}

const StoreContext = createContext<StoreContextType | undefined>(undefined);

function normalizeProduct(productData: Omit<Product, 'id'>): Omit<Product, 'id'> {
  const baseName = productData.name || 'New Product';
  return {
    shortDescription: productData.shortDescription || productData.description?.slice(0, 140) || baseName,
    slug: productData.slug || baseName.toLowerCase().replace(/[^a-z0-9]+/g, '-'),
    discountPercent:
      typeof productData.discountPercent === 'number'
        ? productData.discountPercent
        : Math.max(
            0,
            Math.round(
              ((productData.originalPrice - productData.price) / Math.max(productData.originalPrice, 1)) * 100,
            ),
          ),
    isNew: productData.isNew ?? Boolean(productData.isNewArrival),
    isNewArrival: productData.isNewArrival ?? productData.isNew ?? false,
    isTrending: productData.isTrending ?? false,
    isBestSeller: productData.isBestSeller ?? false,
    isFeatured: productData.isFeatured ?? true,
    isFlashDeal: productData.isFlashDeal ?? false,
    reviewCount: productData.reviewCount ?? 0,
    rating: productData.rating ?? 5,
    isBabySafe: productData.isBabySafe ?? true,
    tags: productData.tags ?? [],
    createdAt: productData.createdAt || new Date().toISOString(),
    ...productData,
  };
}

function normalizeCategory(categoryData: Omit<Category, 'id'>): Omit<Category, 'id'> {
  return {
    description: categoryData.description || `${categoryData.name} collection`,
    slug: categoryData.slug || categoryData.name.toLowerCase().replace(/[^a-z0-9]+/g, '-'),
    active: categoryData.active ?? true,
    isFeatured: categoryData.isFeatured ?? true,
    priority: categoryData.priority ?? 1,
    productCount: categoryData.productCount ?? categoryData.itemCount ?? 0,
    ...categoryData,
  };
}

function normalizeCoupon(couponData: Omit<Coupon, 'id'>): Omit<Coupon, 'id'> {
  return {
    code: couponData.code.trim().toUpperCase(),
    discountType:
      couponData.discountType === 'percent' || couponData.discountType === 'flat'
        ? couponData.discountType
        : 'percent',
    expiryDate: couponData.expiryDate || '2027-12-31',
    timesUsed: couponData.timesUsed ?? 0,
    active: couponData.active ?? true,
    ...couponData,
  };
}

export const StoreProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { adminUser } = useAdminAuth();

  const [products, setProducts] = useState<Product[]>(initialProducts);
  const [categories, setCategories] = useState<Category[]>(initialCategories);
  const [ageCategories, setAgeCategories] = useState<AgeCategory[]>(initialAgeCategories);
  const [banners, setBanners] = useState<HeroBanner[]>(initialBanners);
  const [announcements, setAnnouncements] = useState<AnnouncementItem[]>(initialAnnouncements);
  const [orders, setOrders] = useState<Order[]>([]);
  const [coupons, setCoupons] = useState<Coupon[]>(initialCoupons);
  const [reviews, setReviews] = useState<Review[]>(initialReviews.filter((review) => review.status === 'Approved'));
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [sections, setSections] = useState<HomepageSection[]>(initialSections);
  const [homepageLayout, setHomepageLayoutState] = useState<HomepageSection[]>(initialSections);
  const [siteSettings, setSiteSettings] = useState<SiteSettings>(initialSiteSettings);

  const [loading, setLoading] = useState(true);

  const [cart, setCart] = useState<CartItem[]>(() => getStored('cart', []));
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [wishlist, setWishlist] = useState<Product[]>(() => getStored('wishlist', []));
  const [appliedCoupon, setAppliedCoupon] = useState<Coupon | null>(null);

  const [quickViewProduct, setQuickViewProduct] = useState<Product | null>(null);
  const [isTrackOrderOpen, setIsTrackOrderOpen] = useState(false);

  const [currentView, setCurrentView] = useState<PublicView>('home');
  const [selectedProductSlug, setSelectedProductSlug] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [activeCategoryFilter, setActiveCategoryFilter] = useState<string | null>(null);
  const [activeAgeFilter, setActiveAgeFilter] = useState<string | null>(null);
  const [adminTab, setAdminTabState] = useState<AdminTab>(() => getAdminTabFromPath(window.location.pathname));

  useEffect(() => {
    setStored('cart', cart);
  }, [cart]);

  useEffect(() => {
    setStored('wishlist', wishlist);
  }, [wishlist]);

  useEffect(() => {
    if (siteSettings.primaryColor) {
      document.documentElement.style.setProperty('--color-primary', siteSettings.primaryColor);
    }
  }, [siteSettings]);

  useEffect(() => {
    const syncAdminTabFromLocation = () => {
      if (window.location.pathname.startsWith('/admin')) {
        setAdminTabState(getAdminTabFromPath(window.location.pathname));
      }
    };

    syncAdminTabFromLocation();
    window.addEventListener('popstate', syncAdminTabFromLocation);
    return () => window.removeEventListener('popstate', syncAdminTabFromLocation);
  }, []);

  const loadStorefrontData = async () => {
    const data = await fetchStorefrontData();
    setProducts(data.products);
    setCategories(data.categories);
    setAgeCategories(data.ageCategories);
    setBanners(data.banners);
    setAnnouncements(data.announcements);
    setCoupons(data.coupons);
    setReviews(data.reviews);
    setSections(data.sections);
    setHomepageLayoutState(data.sections);
    setSiteSettings(data.siteSettings);
  };

  const loadAdminData = async () => {
    if (!adminUser) {
      setOrders([]);
      setCustomers([]);
      return;
    }

    const data = await fetchAdminDashboardData();
    setOrders(data.orders);
    setCustomers(data.customers);
    setCoupons(data.coupons);
    setReviews(data.reviews);
  };

  const refetchAllData = async () => {
    setLoading(true);
    try {
      await loadStorefrontData();
      await loadAdminData();
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    void refetchAllData();
  }, [adminUser?.uid]);

  const setHomepageLayout = async (layout: HomepageSection[]) => {
    const response = await mutateAdminContent<HomepageSection>({
      collection: 'sections',
      action: 'replaceCollection',
      documents: layout.map((section, index) => ({
        ...section,
        enabled:
          section.enabled !== undefined
            ? section.enabled
            : section.visible !== undefined
              ? section.visible
              : true,
        visible:
          section.visible !== undefined
            ? section.visible
            : section.enabled !== undefined
              ? section.enabled
              : true,
        order: index + 1,
        priority: index + 1,
      })),
    });

    const nextSections = response.documents || layout;
    setSections(nextSections);
    setHomepageLayoutState(nextSections);
  };

  const addProduct = async (productData: Omit<Product, 'id'>) => {
    const response = await mutateAdminContent<Product>({
      collection: 'products',
      action: 'create',
      data: normalizeProduct(productData),
    });

    const created = response.document as Product;
    setProducts((previous) => [created, ...previous]);
    return created;
  };

  const updateProduct = async (id: string, updates: Partial<Product>) => {
    const response = await mutateAdminContent<Product>({
      collection: 'products',
      action: 'update',
      documentId: id,
      data: updates,
    });

    if (response.document) {
      setProducts((previous) =>
        previous.map((product) => (product.id === id ? (response.document as Product) : product)),
      );
    }
  };

  const deleteProduct = async (id: string) => {
    await mutateAdminContent({
      collection: 'products',
      action: 'delete',
      documentId: id,
    });

    setProducts((previous) => previous.filter((product) => product.id !== id));
  };

  const addBanner = async (bannerData: Omit<HeroBanner, 'id'>) => {
    const response = await mutateAdminContent<HeroBanner>({
      collection: 'banners',
      action: 'create',
      data: bannerData,
    });

    if (response.document) {
      setBanners((previous) => [...previous, response.document as HeroBanner]);
    }
  };

  const updateBanner = async (id: string, updates: Partial<HeroBanner>) => {
    const response = await mutateAdminContent<HeroBanner>({
      collection: 'banners',
      action: 'update',
      documentId: id,
      data: updates,
    });

    if (response.document) {
      setBanners((previous) =>
        previous
          .map((banner) => (banner.id === id ? (response.document as HeroBanner) : banner))
          .sort((a, b) => a.priority - b.priority),
      );
    }
  };

  const deleteBanner = async (id: string) => {
    await mutateAdminContent({
      collection: 'banners',
      action: 'delete',
      documentId: id,
    });

    setBanners((previous) => previous.filter((banner) => banner.id !== id));
  };

  const updateAnnouncement = async (id: string, updates: Partial<AnnouncementItem>) => {
    const response = await mutateAdminContent<AnnouncementItem>({
      collection: 'announcements',
      action: 'update',
      documentId: id,
      data: updates,
    });

    if (response.document) {
      setAnnouncements((previous) =>
        previous.map((announcement) =>
          announcement.id === id ? (response.document as AnnouncementItem) : announcement,
        ),
      );
    }
  };

  const addCategory = async (catData: Omit<Category, 'id'>) => {
    const response = await mutateAdminContent<Category>({
      collection: 'categories',
      action: 'create',
      data: normalizeCategory(catData),
    });

    if (response.document) {
      setCategories((previous) =>
        [...previous, response.document as Category].sort((a, b) => a.priority - b.priority),
      );
    }
  };

  const updateCategory = async (id: string, updates: Partial<Category>) => {
    const response = await mutateAdminContent<Category>({
      collection: 'categories',
      action: 'update',
      documentId: id,
      data: updates,
    });

    if (response.document) {
      setCategories((previous) =>
        previous
          .map((category) => (category.id === id ? (response.document as Category) : category))
          .sort((a, b) => a.priority - b.priority),
      );
    }
  };

  const deleteCategory = async (id: string) => {
    await mutateAdminContent({
      collection: 'categories',
      action: 'delete',
      documentId: id,
    });

    setCategories((previous) => previous.filter((category) => category.id !== id));
  };

  const addOrder = async (orderData: PublicOrderPayload) => {
    const response = await createOrder({
      ...orderData,
      couponCode: appliedCoupon?.code || null,
    });

    const createdOrder = response.order;
    if (adminUser) {
      setOrders((previous) => [createdOrder, ...previous]);
    }

    clearCart();
    return createdOrder;
  };

  const updateOrderStatus = async (id: string, status: string) => {
    const current = orders.find((order) => order.id === id);
    if (!current) {
      return;
    }

    const timeline = [
      ...(current.timeline || []),
      {
        status,
        title: `Order ${status}`,
        description: `Status updated to ${status}`,
        date: new Date().toLocaleString('en-IN'),
        completed: true,
      },
    ];

    const response = await mutateAdminContent<Order>({
      collection: 'orders',
      action: 'update',
      documentId: id,
      data: {
        status,
        timeline,
      },
    });

    if (response.document) {
      setOrders((previous) =>
        previous.map((order) => (order.id === id ? (response.document as Order) : order)),
      );
    }
  };

  const updateOrderTracking = async (id: string, trackingNumber: string, statusTimeline: any[]) => {
    const current = orders.find((order) => order.id === id);
    if (!current) {
      return;
    }

    const nextTimeline = [
      ...(current.timeline || []),
      {
        status: 'Shipped',
        title: 'Carrier Updated',
        description: statusTimeline?.[0]?.status || 'Shipment status updated.',
        date: new Date().toLocaleString('en-IN'),
        completed: true,
      },
    ];

    const response = await mutateAdminContent<Order>({
      collection: 'orders',
      action: 'update',
      documentId: id,
      data: {
        trackingNumber,
        timeline: nextTimeline,
      },
    });

    if (response.document) {
      setOrders((previous) =>
        previous.map((order) => (order.id === id ? (response.document as Order) : order)),
      );
    }
  };

  const addCoupon = async (couponData: Omit<Coupon, 'id'>) => {
    const response = await mutateAdminContent<Coupon>({
      collection: 'coupons',
      action: 'create',
      data: normalizeCoupon(couponData),
    });

    if (response.document) {
      setCoupons((previous) => [...previous, response.document as Coupon]);
    }
  };

  const deleteCoupon = async (id: string) => {
    await mutateAdminContent({
      collection: 'coupons',
      action: 'delete',
      documentId: id,
    });

    setCoupons((previous) => previous.filter((coupon) => coupon.id !== id));
    if (appliedCoupon?.id === id) {
      setAppliedCoupon(null);
    }
  };

  const addReview = async (reviewData: {
    productId: string;
    productName: string;
    customerName: string;
    rating: number;
    title: string;
    comment: string;
  }) => {
    const response = await submitReview(reviewData);
    const created = response.review;
    setReviews((previous) => [created, ...previous]);
    return created;
  };

  const updateReviewStatus = async (id: string, status: 'Approved' | 'Pending' | 'Rejected') => {
    const response = await mutateAdminContent<Review>({
      collection: 'reviews',
      action: 'update',
      documentId: id,
      data: {
        status,
      },
    });

    if (response.document) {
      setReviews((previous) =>
        previous.map((review) => (review.id === id ? (response.document as Review) : review)),
      );
    }
  };

  const updateReviewReply = async (id: string, adminReply: string) => {
    const response = await mutateAdminContent<Review>({
      collection: 'reviews',
      action: 'update',
      documentId: id,
      data: {
        adminReply,
      },
    });

    if (response.document) {
      setReviews((previous) =>
        previous.map((review) => (review.id === id ? (response.document as Review) : review)),
      );
    }
  };

  const deleteReview = async (id: string) => {
    await mutateAdminContent({
      collection: 'reviews',
      action: 'delete',
      documentId: id,
    });

    setReviews((previous) => previous.filter((review) => review.id !== id));
  };

  const updateSiteSettings = async (newSettings: Partial<SiteSettings>) => {
    const response = await mutateAdminContent<SiteSettings>({
      collection: 'settings',
      action: 'update',
      documentId: 'storefront',
      data: newSettings,
    });

    if (response.document) {
      setSiteSettings((response.document as SiteSettings) || siteSettings);
    } else {
      setSiteSettings((previous) => ({ ...previous, ...newSettings }));
    }
  };

  const addToCart = (product: Product, size: string, color: string, ageGroup: string, quantity = 1) => {
    setCart((previous) => {
      const existingIndex = previous.findIndex(
        (item) => item.productId === product.id && item.size === size && item.color === color,
      );

      if (existingIndex !== -1) {
        const next = [...previous];
        next[existingIndex].quantity += quantity;
        return next;
      }

      return [
        ...previous,
        {
          productId: product.id,
          name: product.name,
          image: product.images[0] || '',
          color: color || product.colors[0]?.name || 'Standard',
          size: size || product.sizes[0] || '1Y',
          ageGroup: ageGroup || product.ageGroups[0] || '1-2Y',
          price: product.price,
          quantity,
          product,
        },
      ];
    });

    setIsCartOpen(true);
  };

  const removeFromCart = (index: number) => {
    setCart((previous) => previous.filter((_, itemIndex) => itemIndex !== index));
  };

  const updateCartQuantity = (index: number, qty: number) => {
    if (qty <= 0) {
      removeFromCart(index);
      return;
    }

    setCart((previous) => {
      const next = [...previous];
      next[index].quantity = qty;
      return next;
    });
  };

  const clearCart = () => {
    setCart([]);
    setAppliedCoupon(null);
  };

  const cartSubtotal = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);

  let cartDiscount = 0;
  if (appliedCoupon) {
    if (appliedCoupon.discountType === 'percent') {
      cartDiscount = Math.round((cartSubtotal * appliedCoupon.discountValue) / 100);
      if (appliedCoupon.maxDiscount && cartDiscount > appliedCoupon.maxDiscount) {
        cartDiscount = appliedCoupon.maxDiscount;
      }
    } else {
      cartDiscount = appliedCoupon.discountValue;
    }
  }

  const shippingFee =
    cartSubtotal >= siteSettings.freeShippingThreshold || cartSubtotal === 0 ? 0 : siteSettings.shippingFee;
  const taxAmount = Math.round(((cartSubtotal - cartDiscount) * siteSettings.taxPercent) / 100);
  const cartTotal = Math.max(0, cartSubtotal - cartDiscount + shippingFee + taxAmount);

  const applyCoupon = (code: string) => {
    const normalizedCode = code.trim().toUpperCase();
    const found = coupons.find((coupon) => coupon.code === normalizedCode && coupon.active);

    if (!found) {
      return {
        success: false,
        message: 'Invalid or expired coupon code.',
      };
    }

    if (cartSubtotal < found.minSpend) {
      return {
        success: false,
        message: `Minimum purchase of ${siteSettings.currencySymbol}${found.minSpend} required for code ${found.code}.`,
      };
    }

    setAppliedCoupon(found);
    return {
      success: true,
      message: `Coupon ${found.code} applied successfully.`,
    };
  };

  const removeCoupon = () => {
    setAppliedCoupon(null);
  };

  const toggleWishlist = (product: Product) => {
    setWishlist((previous) => {
      const exists = previous.some((wishlistProduct) => wishlistProduct.id === product.id);
      return exists
        ? previous.filter((wishlistProduct) => wishlistProduct.id !== product.id)
        : [...previous, product];
    });
  };

  const isInWishlist = (productId: string) => wishlist.some((product) => product.id === productId);

  const setAdminTab = (tab: AdminTab) => {
    setAdminTabState(tab);
    navigateToPath(getAdminPath(tab));
  };

  const value = useMemo<StoreContextType>(
    () => ({
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
      updateReviewReply,
      deleteReview,
      updateSiteSettings,
      cart,
      isCartOpen,
      setIsCartOpen,
      addToCart,
      removeFromCart,
      updateCartQuantity,
      clearCart,
      cartSubtotal,
      cartDiscount,
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
      refetchAllData,
    }),
    [
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
      loading,
      cart,
      isCartOpen,
      cartSubtotal,
      cartDiscount,
      cartTotal,
      appliedCoupon,
      wishlist,
      quickViewProduct,
      isTrackOrderOpen,
      adminTab,
      currentView,
      selectedProductSlug,
      searchQuery,
      activeCategoryFilter,
      activeAgeFilter,
    ],
  );

  return <StoreContext.Provider value={value}>{children}</StoreContext.Provider>;
};

export const useStore = () => {
  const context = useContext(StoreContext);
  if (!context) {
    throw new Error('useStore must be used within a StoreProvider.');
  }

  return context;
};
