import { randomUUID } from 'crypto';
import { adminDb } from './firebaseAdmin.js';
import {
  initialAgeCategories,
  initialAnnouncements,
  initialBanners,
  initialCategories,
  initialCoupons,
  initialCustomers,
  initialOrders,
  initialProducts,
  initialReviews,
  initialSections,
  initialSiteSettings,
} from '../../src/data/initialData.js';
import type {
  AdminDashboardData,
  Coupon,
  Customer,
  Order,
  Review,
  SiteSettings,
  StorefrontData,
} from '../../src/types.js';

const SETTINGS_DOC_ID = 'storefront';

async function getCollectionOrFallback<T extends { id: string }>(collectionName: string, fallback: T[]) {
  const snapshot = await adminDb.collection(collectionName).get();
  if (snapshot.empty) {
    return fallback;
  }

  return snapshot.docs.map((doc) => ({ id: doc.id, ...(doc.data() as Omit<T, 'id'>) }));
}

async function getSettingsOrFallback() {
  const snapshot = await adminDb.collection('settings').doc(SETTINGS_DOC_ID).get();
  if (!snapshot.exists) {
    return initialSiteSettings;
  }

  return {
    ...initialSiteSettings,
    ...(snapshot.data() as Partial<SiteSettings>),
  };
}

function sortByPriority<T extends { priority?: number; order?: number }>(items: T[]) {
  return [...items].sort((a, b) => {
    const aOrder = a.order ?? a.priority ?? 0;
    const bOrder = b.order ?? b.priority ?? 0;
    return aOrder - bOrder;
  });
}

export async function getStorefrontData(): Promise<StorefrontData> {
  const [products, categories, ageCategories, banners, announcements, coupons, reviews, sections, siteSettings] =
    await Promise.all([
      getCollectionOrFallback('products', initialProducts),
      getCollectionOrFallback('categories', initialCategories),
      getCollectionOrFallback('ageCategories', initialAgeCategories),
      getCollectionOrFallback('banners', initialBanners),
      getCollectionOrFallback('announcements', initialAnnouncements),
      getCollectionOrFallback('coupons', initialCoupons),
      getCollectionOrFallback('reviews', initialReviews),
      getCollectionOrFallback('sections', initialSections),
      getSettingsOrFallback(),
    ]);

  return {
    products,
    categories: sortByPriority(categories),
    ageCategories: sortByPriority(ageCategories),
    banners: sortByPriority(banners),
    announcements,
    coupons: coupons.filter((coupon) => coupon.active),
    reviews: reviews.filter((review) => review.status === 'Approved'),
    sections: sortByPriority(sections),
    siteSettings,
  };
}

export async function getAdminData(): Promise<AdminDashboardData> {
  const [orders, customers, coupons, reviews] = await Promise.all([
    getCollectionOrFallback('orders', initialOrders),
    getCollectionOrFallback('customers', initialCustomers),
    getCollectionOrFallback('coupons', initialCoupons),
    getCollectionOrFallback('reviews', initialReviews),
  ]);

  return {
    orders,
    customers,
    coupons,
    reviews,
  };
}

export async function upsertCollectionDocument<T extends { id: string }>(
  collectionName: string,
  documentId: string,
  data: Record<string, unknown>,
) {
  const now = new Date().toISOString();
  const payload = {
    ...data,
    updatedAt: now,
  };

  const documentRef = adminDb.collection(collectionName).doc(documentId);
  const existing = await documentRef.get();

  if (!existing.exists) {
    await documentRef.set({
      ...payload,
      createdAt: now,
    });
  } else {
    await documentRef.set(payload, { merge: true });
  }

  const next = await documentRef.get();
  return {
    id: next.id,
    ...(next.data() as Omit<T, 'id'>),
  };
}

export async function createCollectionDocument<T extends { id: string }>(
  collectionName: string,
  data: Record<string, unknown>,
  preferredId?: string,
) {
  const documentId = preferredId || String(data.id || randomUUID());
  return upsertCollectionDocument<T>(collectionName, documentId, { ...data, id: documentId });
}

export async function deleteCollectionDocument(collectionName: string, documentId: string) {
  await adminDb.collection(collectionName).doc(documentId).delete();
}

export async function replaceCollectionDocuments<T extends { id: string; priority?: number; order?: number }>(
  collectionName: string,
  documents: T[],
) {
  const batch = adminDb.batch();
  const collectionRef = adminDb.collection(collectionName);
  const existing = await collectionRef.get();
  const nextIds = new Set(documents.map((document) => document.id));

  existing.docs.forEach((doc) => {
    if (!nextIds.has(doc.id)) {
      batch.delete(doc.ref);
    }
  });

  documents.forEach((document, index) => {
    const docRef = collectionRef.doc(document.id);
    batch.set(
      docRef,
      {
        ...document,
        id: document.id,
        order: index + 1,
        priority: index + 1,
        updatedAt: new Date().toISOString(),
      },
      { merge: true },
    );
  });

  await batch.commit();
  return sortByPriority(documents);
}

function buildOrderNumber() {
  const year = new Date().getFullYear();
  const suffix = Math.floor(100000 + Math.random() * 900000);
  return `ATT-${year}-${suffix}`;
}

function buildTrackingNumber() {
  return `ATT-${Math.floor(10000000 + Math.random() * 90000000)}`;
}

export async function createPublicOrder(payload: {
  customer: Order['customer'];
  items: Order['items'];
  subtotal: number;
  discount: number;
  shipping: number;
  tax: number;
  total: number;
  paymentMethod: Order['paymentMethod'];
  couponCode?: string | null;
}) {
  const now = new Date();
  const orderId = `ord-${Date.now()}`;
  const order: Order = {
    id: orderId,
    orderNumber: buildOrderNumber(),
    date: now.toISOString(),
    customer: payload.customer,
    items: payload.items,
    subtotal: payload.subtotal,
    discount: payload.discount,
    shipping: payload.shipping,
    tax: payload.tax,
    total: payload.total,
    status: 'Processing',
    paymentMethod: payload.paymentMethod,
    paymentStatus: payload.paymentMethod === 'COD' ? 'Pending' : 'Paid',
    trackingNumber: buildTrackingNumber(),
    trackingCarrier: 'Delhivery Express',
    timeline: [
      {
        status: 'Placed',
        title: 'Order Placed',
        description: 'Your order was received and queued for packing.',
        date: now.toLocaleString('en-IN'),
        completed: true,
      },
      {
        status: 'Processing',
        title: 'Preparing Shipment',
        description: 'Our team is preparing your items for dispatch.',
        date: 'In Progress',
        completed: false,
      },
    ],
  };

  await adminDb.collection('orders').doc(order.id).set(order);

  const email = payload.customer.email.trim().toLowerCase();
  const existingCustomer = await adminDb.collection('customers').where('email', '==', email).limit(1).get();

  if (existingCustomer.empty) {
    const customerId = `cust-${Date.now()}`;
    const customer: Customer = {
      id: customerId,
      name: payload.customer.name,
      email,
      phone: payload.customer.phone,
      registeredDate: now.toISOString().split('T')[0],
      totalOrders: 1,
      totalSpent: payload.total,
      rewardPoints: Math.max(0, Math.round(payload.total / 25)),
      isBlocked: false,
      addresses: [
        {
          id: `addr-${Date.now()}`,
          type: 'Home',
          street: payload.customer.address.street,
          city: payload.customer.address.city,
          state: payload.customer.address.state,
          zip: payload.customer.address.zip,
          isDefault: true,
        },
      ],
    };

    await adminDb.collection('customers').doc(customer.id).set(customer);
  } else {
    const existingDoc = existingCustomer.docs[0];
    const current = existingDoc.data() as Customer;
    await existingDoc.ref.set(
      {
        totalOrders: (current.totalOrders || 0) + 1,
        totalSpent: (current.totalSpent || 0) + payload.total,
        phone: payload.customer.phone,
        updatedAt: now.toISOString(),
      },
      { merge: true },
    );
  }

  return order;
}

async function findOrderInCollection(query: string) {
  const ordersRef = adminDb.collection('orders');
  const checks = await Promise.all([
    ordersRef.where('orderNumber', '==', query).limit(1).get(),
    ordersRef.where('trackingNumber', '==', query).limit(1).get(),
    ordersRef.doc(query).get(),
  ]);

  const [byOrderNumber, byTrackingNumber, byId] = checks;
  if (!byOrderNumber.empty) {
    const doc = byOrderNumber.docs[0];
    return { id: doc.id, ...(doc.data() as Omit<Order, 'id'>) };
  }

  if (!byTrackingNumber.empty) {
    const doc = byTrackingNumber.docs[0];
    return { id: doc.id, ...(doc.data() as Omit<Order, 'id'>) };
  }

  if (byId.exists) {
    return { id: byId.id, ...(byId.data() as Omit<Order, 'id'>) };
  }

  return null;
}

export async function findTrackableOrder(query: string) {
  const match = await findOrderInCollection(query);
  if (match) {
    return match;
  }

  const fallback = initialOrders.find(
    (order) =>
      order.orderNumber.toLowerCase() === query.toLowerCase() ||
      order.trackingNumber.toLowerCase() === query.toLowerCase() ||
      order.id.toLowerCase() === query.toLowerCase(),
  );

  return fallback || null;
}

export async function createPublicReview(payload: {
  productId: string;
  productName: string;
  customerName: string;
  rating: number;
  title: string;
  comment: string;
}) {
  const review: Review = {
    id: `rev-${Date.now()}`,
    productId: payload.productId,
    productName: payload.productName,
    customerName: payload.customerName,
    rating: payload.rating,
    title: payload.title,
    comment: payload.comment,
    verifiedPurchase: false,
    date: new Date().toISOString().split('T')[0],
    status: 'Pending',
    featured: false,
  };

  await adminDb.collection('reviews').doc(review.id).set(review);
  return review;
}
