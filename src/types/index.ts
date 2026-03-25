// Common types for the application

export interface NavItem {
  title: string;
  href: string;
  disabled?: boolean;
  external?: boolean;
}

export interface SiteMetadata {
  title: string;
  description: string;
  keywords?: string[];
}

export interface Feature {
  id: string;
  title: string;
  description: string;
  icon?: string;
}

export interface Service {
  id: string;
  name: string;
  description: string;
  features: string[];
  price?: string;
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
  category: string;
  shortDescription: string;
  description: string;
  features: string[];
  specs?: Record<string, string>;
  image: string;
  gallery?: string[];
  badge?: string;
  featured?: boolean;
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

export interface ContactFormData {
  name: string;
  email: string;
  phone?: string;
  subject: string;
  message: string;
}
