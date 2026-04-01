// Common types for the application

// User and Authentication Types
export type Role = 'ADMIN' | 'SUPER_ADMIN';

export interface User {
  id: string;
  email: string;
  name: string;
  role: Role;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface ActivityLog {
  id: string;
  userId: string;
  action: string;
  entityType: string;
  entityId: string;
  entityName: string;
  changes?: Record<string, unknown>;
  ipAddress?: string;
  userAgent?: string;
  createdAt: Date;
}

export interface NavItem {
  title: string;
  href: string;
  disabled?: boolean;
  external?: boolean;
}

export interface Feature {
  id: string;
  title: string;
  description: string;
  icon?: string;
}


export interface Testimonial {
  id: string;
  name: string;
  role: string;
  company?: string;
  content: string;
  avatar?: string;
  rating?: number;
}

export interface FAQItem {
  id: string;
  question: string;
  answer: string;
}

export interface Product {
  id: string;
  name: string;
  slug: string;
  catalog: string;
  catalogShortName?: string;
  category: string;
  shortDescription: string;
  description: string;
  features: string[];
  component?: string | null;
  shades?: string[];
  specs?: Record<string, string>;
  image: string;
  gallery?: string[];
  isBestSeller?: boolean;
  isNew?: boolean;
  brochureUrl?: string;
}

export interface Address {
  id: string;
  label: string;
  street: string;
  city: string;
  state?: string;
  postalCode: string;
  country: string;
  phone: string;
  email: string;
  mapEmbedUrl?: string;
  coordinates?: { lat: number; lng: number };
}
