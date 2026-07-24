import type {
  AdminDashboardData,
  AnnouncementItem,
  Category,
  Coupon,
  Customer,
  HeroBanner,
  HomepageSection,
  Order,
  Product,
  Review,
  SiteSettings,
  StorefrontData,
} from '../types';
import { fetchJson } from './api';

export function fetchStorefrontData() {
  return fetchJson<StorefrontData>('/api/storefront');
}

export function fetchAdminDashboardData() {
  return fetchJson<AdminDashboardData>('/api/admin/data');
}

export interface AdminMutationPayload {
  collection:
    | 'products'
    | 'categories'
    | 'banners'
    | 'announcements'
    | 'sections'
    | 'orders'
    | 'coupons'
    | 'customers'
    | 'reviews'
    | 'settings';
  action: 'create' | 'update' | 'delete' | 'replaceCollection';
  documentId?: string;
  data?: Record<string, unknown>;
  documents?: Array<Record<string, unknown>>;
}

export function mutateAdminContent<T>(payload: AdminMutationPayload) {
  return fetchJson<{ document?: T; documents?: T[]; message: string }>('/api/admin/content', {
    method: 'POST',
    body: JSON.stringify(payload),
  });
}

export interface PublicOrderPayload {
  customer: Order['customer'];
  items: Order['items'];
  subtotal: number;
  discount: number;
  shipping: number;
  tax: number;
  total: number;
  paymentMethod: Order['paymentMethod'];
  couponCode?: string | null;
}

export function createOrder(payload: PublicOrderPayload) {
  return fetchJson<{ order: Order; message: string }>('/api/orders', {
    method: 'POST',
    body: JSON.stringify(payload),
  });
}

export function trackOrder(query: string) {
  return fetchJson<{ order: Order | null; message?: string }>(
    `/api/orders/track?q=${encodeURIComponent(query)}`,
  );
}

export interface PublicReviewPayload {
  productId: string;
  productName: string;
  customerName: string;
  rating: number;
  title: string;
  comment: string;
}

export function submitReview(payload: PublicReviewPayload) {
  return fetchJson<{ review: Review; message: string }>('/api/reviews', {
    method: 'POST',
    body: JSON.stringify(payload),
  });
}
