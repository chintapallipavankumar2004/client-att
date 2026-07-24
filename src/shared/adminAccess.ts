export type AdminRole = 'super_admin' | 'admin' | 'manager' | 'editor' | 'support';

export type AdminPermission =
  | 'view_dashboard'
  | 'manage_products'
  | 'manage_categories'
  | 'manage_orders'
  | 'manage_banners'
  | 'manage_offers'
  | 'manage_customers'
  | 'manage_reviews'
  | 'manage_settings'
  | 'manage_content';

export type AdminTab =
  | 'dashboard'
  | 'products'
  | 'categories'
  | 'orders'
  | 'banners'
  | 'announcements'
  | 'homepage_builder'
  | 'coupons'
  | 'customers'
  | 'reviews'
  | 'settings';

export interface AdminRouteDefinition {
  tab: AdminTab;
  path: string;
  aliases?: string[];
  permission: AdminPermission;
  title: string;
}

export const ADMIN_ROUTES: Record<AdminTab, AdminRouteDefinition> = {
  dashboard: {
    tab: 'dashboard',
    path: '/admin/dashboard',
    aliases: ['/admin'],
    permission: 'view_dashboard',
    title: 'Dashboard',
  },
  products: {
    tab: 'products',
    path: '/admin/products',
    permission: 'manage_products',
    title: 'Products',
  },
  categories: {
    tab: 'categories',
    path: '/admin/categories',
    permission: 'manage_categories',
    title: 'Categories',
  },
  orders: {
    tab: 'orders',
    path: '/admin/orders',
    permission: 'manage_orders',
    title: 'Orders',
  },
  banners: {
    tab: 'banners',
    path: '/admin/banners',
    aliases: ['/admin/media'],
    permission: 'manage_banners',
    title: 'Banners',
  },
  announcements: {
    tab: 'announcements',
    path: '/admin/announcements',
    permission: 'manage_content',
    title: 'Announcements',
  },
  homepage_builder: {
    tab: 'homepage_builder',
    path: '/admin/homepage-builder',
    aliases: ['/admin/content'],
    permission: 'manage_content',
    title: 'Homepage Builder',
  },
  coupons: {
    tab: 'coupons',
    path: '/admin/coupons',
    aliases: ['/admin/offers'],
    permission: 'manage_offers',
    title: 'Offers',
  },
  customers: {
    tab: 'customers',
    path: '/admin/customers',
    aliases: ['/admin/users'],
    permission: 'manage_customers',
    title: 'Customers',
  },
  reviews: {
    tab: 'reviews',
    path: '/admin/reviews',
    permission: 'manage_reviews',
    title: 'Reviews',
  },
  settings: {
    tab: 'settings',
    path: '/admin/settings',
    permission: 'manage_settings',
    title: 'Settings',
  },
};

export const ROLE_PERMISSIONS: Record<AdminRole, AdminPermission[]> = {
  super_admin: [
    'view_dashboard',
    'manage_products',
    'manage_categories',
    'manage_orders',
    'manage_banners',
    'manage_offers',
    'manage_customers',
    'manage_reviews',
    'manage_settings',
    'manage_content',
  ],
  admin: [
    'view_dashboard',
    'manage_products',
    'manage_categories',
    'manage_orders',
    'manage_banners',
    'manage_offers',
    'manage_customers',
    'manage_reviews',
    'manage_settings',
    'manage_content',
  ],
  manager: [
    'view_dashboard',
    'manage_products',
    'manage_categories',
    'manage_orders',
    'manage_banners',
    'manage_offers',
    'manage_customers',
    'manage_reviews',
  ],
  editor: ['view_dashboard', 'manage_banners', 'manage_reviews', 'manage_content'],
  support: ['manage_orders', 'manage_customers'],
};

export const ADMIN_COLLECTION_PERMISSIONS = {
  products: 'manage_products',
  categories: 'manage_categories',
  ageCategories: 'manage_categories',
  orders: 'manage_orders',
  banners: 'manage_banners',
  announcements: 'manage_content',
  sections: 'manage_content',
  coupons: 'manage_offers',
  customers: 'manage_customers',
  reviews: 'manage_reviews',
  settings: 'manage_settings',
} as const;

const ALL_ROUTE_DEFINITIONS = Object.values(ADMIN_ROUTES);

export function normalizeAdminPath(pathname: string): string {
  if (!pathname) {
    return ADMIN_ROUTES.dashboard.path;
  }

  const normalized = pathname.endsWith('/') && pathname !== '/' ? pathname.slice(0, -1) : pathname;
  return normalized || ADMIN_ROUTES.dashboard.path;
}

export function getAdminTabFromPath(pathname: string): AdminTab {
  const normalized = normalizeAdminPath(pathname);

  for (const route of ALL_ROUTE_DEFINITIONS) {
    if (route.path === normalized || route.aliases?.includes(normalized)) {
      return route.tab;
    }
  }

  return 'dashboard';
}

export function getAdminPath(tab: AdminTab): string {
  return ADMIN_ROUTES[tab].path;
}

export function getAdminPermissionForTab(tab: AdminTab): AdminPermission {
  return ADMIN_ROUTES[tab].permission;
}

export function hasAdminPermission(role: AdminRole, permission: AdminPermission): boolean {
  return ROLE_PERMISSIONS[role]?.includes(permission) ?? false;
}
