import React from 'react';
import { useStore } from '../context/StoreContext';
import { AdminLayout } from './admin/AdminLayout';
import { AdminDashboardOverview } from './admin/AdminDashboardOverview';
import { AdminBannerManager } from './admin/AdminBannerManager';
import { AdminAnnouncementManager } from './admin/AdminAnnouncementManager';
import { AdminHomepageBuilder } from './admin/AdminHomepageBuilder';
import { AdminProductManager } from './admin/AdminProductManager';
import { AdminCategoryManager } from './admin/AdminCategoryManager';
import { AdminOrderManager } from './admin/AdminOrderManager';
import { AdminCouponManager } from './admin/AdminCouponManager';
import { AdminCustomerManager } from './admin/AdminCustomerManager';
import { AdminReviewsManager } from './admin/AdminReviewsManager';
import { AdminSiteSettings } from './admin/AdminSiteSettings';

export const AdminView: React.FC = () => {
  const { adminTab } = useStore();

  const renderTabContent = () => {
    switch (adminTab) {
      case 'dashboard':
        return <AdminDashboardOverview />;
      case 'banners':
        return <AdminBannerManager />;
      case 'announcements':
        return <AdminAnnouncementManager />;
      case 'homepage_builder':
        return <AdminHomepageBuilder />;
      case 'products':
        return <AdminProductManager />;
      case 'categories':
        return <AdminCategoryManager />;
      case 'orders':
        return <AdminOrderManager />;
      case 'coupons':
        return <AdminCouponManager />;
      case 'customers':
        return <AdminCustomerManager />;
      case 'reviews':
        return <AdminReviewsManager />;
      case 'settings':
        return <AdminSiteSettings />;
      default:
        return <AdminDashboardOverview />;
    }
  };

  return (
    <AdminLayout>
      {renderTabContent()}
    </AdminLayout>
  );
};
