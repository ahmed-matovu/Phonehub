export type Brand = {
  id: string;
  name: string;
  slug: string;
  isActive: boolean;
};

export type Phone = {
  id: string;
  brandId: string;
  modelName: string;
  slug: string;
  status: 'PUBLISHED' | 'DRAFT';
  price: number;
  rating: number;
};

export const brands: Brand[] = [
  { id: 'brand-samsung', name: 'Samsung', slug: 'samsung', isActive: true },
  { id: 'brand-apple', name: 'Apple', slug: 'apple', isActive: true },
  { id: 'brand-xiaomi', name: 'Xiaomi', slug: 'xiaomi', isActive: true },
  { id: 'brand-oneplus', name: 'OnePlus', slug: 'oneplus', isActive: true },
];

export const phones: Phone[] = [
  { id: 'phone-s24', brandId: 'brand-samsung', modelName: 'Galaxy S24 Ultra', slug: 'galaxy-s24-ultra', status: 'PUBLISHED', price: 1299, rating: 4.8 },
  { id: 'phone-15p', brandId: 'brand-apple', modelName: 'iPhone 15 Pro Max', slug: 'iphone-15-pro-max', status: 'PUBLISHED', price: 1199, rating: 4.9 },
  { id: 'phone-mi14', brandId: 'brand-xiaomi', modelName: 'Xiaomi 14', slug: 'xiaomi-14', status: 'PUBLISHED', price: 699, rating: 4.6 },
  { id: 'phone-op12', brandId: 'brand-oneplus', modelName: 'OnePlus 12', slug: 'oneplus-12', status: 'PUBLISHED', price: 749, rating: 4.7 },
];

export const sellers = [
  {
    id: 'seller-1',
    userId: 'user-1',
    businessName: 'Nova Mobile',
    status: 'APPROVED',
    ratingAvg: 4.8,
  },
  {
    id: 'seller-2',
    userId: 'user-2',
    businessName: 'Peak Tech',
    status: 'APPROVED',
    ratingAvg: 4.7,
  },
];

export const orders = [
  {
    id: 'ord-1001',
    userId: 'user-100',
    orderNumber: 'PH-1001',
    status: 'CONFIRMED',
    totalAmount: 1299,
    currency: 'USD',
  },
];

export const adCampaigns = [
  {
    id: 'campaign-1',
    sellerId: 'seller-1',
    brandId: 'brand-samsung',
    phoneId: 'phone-s24',
    campaignName: 'Galaxy launch boost',
    status: 'ACTIVE',
    budgetTotal: 2000,
  },
];
