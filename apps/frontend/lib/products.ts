export type ProductCategory = string;

export type ProductSpecification = {
  label: string;
  value: string;
};

export type Product = {
  id: string;
  name: string;
  brand: string;
  category: ProductCategory;
  price: number;
  tag: string;
  description: string;
  image: string;
  imageAlt: string;
  specifications: ProductSpecification[];
};

export const defaultCategories = ['Phones', 'Computers', 'Audio'];

export const products: Product[] = [
  {
    id: 'galaxy-s24-ultra',
    name: 'Galaxy S24 Ultra',
    brand: 'Samsung',
    category: 'Phones',
    price: 1299,
    tag: 'Flagship',
    description: 'Samsung flagship smartphone with a large display and advanced camera system.',
    image: 'https://images.unsplash.com/photo-1603891128711-11b4b03bb138?auto=format&fit=crop&w=1000&q=85',
    imageAlt: 'Close-up photograph of a smartphone',
    specifications: [
      { label: 'Display', value: '6.8-inch Dynamic AMOLED 2X' },
      { label: 'Processor', value: 'Snapdragon 8 Gen 3 for Galaxy' },
      { label: 'Memory', value: '12 GB RAM' },
      { label: 'Storage', value: '256 GB' },
      { label: 'Rear camera', value: '200 MP wide, 50 MP periscope, 12 MP ultrawide, 10 MP telephoto' },
      { label: 'Battery', value: '5,000 mAh' },
      { label: 'Operating system', value: 'Android' },
    ],
  },
  {
    id: 'iphone-15-pro',
    name: 'iPhone 15 Pro',
    brand: 'Apple',
    category: 'Phones',
    price: 999,
    tag: 'Popular',
    description: 'Apple smartphone with a titanium design and a pro camera system.',
    image: 'https://images.unsplash.com/photo-1580910051074-3eb694886505?auto=format&fit=crop&w=1000&q=85',
    imageAlt: 'Modern smartphone shown from the back',
    specifications: [
      { label: 'Display', value: '6.1-inch Super Retina XDR OLED' },
      { label: 'Processor', value: 'Apple A17 Pro' },
      { label: 'Storage', value: '128 GB' },
      { label: 'Rear camera', value: '48 MP main, 12 MP ultrawide, 12 MP telephoto' },
      { label: 'Connectivity', value: '5G, Wi-Fi 6E, Bluetooth 5.3, USB-C' },
      { label: 'Operating system', value: 'iOS' },
    ],
  },
  {
    id: 'pixel-8-pro',
    name: 'Pixel 8 Pro',
    brand: 'Google',
    category: 'Phones',
    price: 899,
    tag: 'Great camera',
    description: 'Google smartphone with a bright display and computational photography.',
    image: 'https://images.unsplash.com/photo-1605236453806-6ff36851218e?auto=format&fit=crop&w=1000&q=85',
    imageAlt: 'Smartphone with a multi-camera rear panel',
    specifications: [
      { label: 'Display', value: '6.7-inch LTPO OLED, 120 Hz' },
      { label: 'Processor', value: 'Google Tensor G3' },
      { label: 'Memory', value: '12 GB RAM' },
      { label: 'Storage', value: '128 GB' },
      { label: 'Rear camera', value: '50 MP wide, 48 MP ultrawide, 48 MP telephoto' },
      { label: 'Battery', value: '5,050 mAh' },
      { label: 'Operating system', value: 'Android' },
    ],
  },
  {
    id: 'xiaomi-14',
    name: 'Xiaomi 14',
    brand: 'Xiaomi',
    category: 'Phones',
    price: 799,
    tag: 'New arrival',
    description: 'Compact Xiaomi flagship with a high-resolution display and fast charging.',
    image: 'https://images.unsplash.com/photo-1598327105666-5b89351aff97?auto=format&fit=crop&w=1000&q=85',
    imageAlt: 'Smartphone on a clean light background',
    specifications: [
      { label: 'Display', value: '6.36-inch LTPO AMOLED, 120 Hz' },
      { label: 'Processor', value: 'Snapdragon 8 Gen 3' },
      { label: 'Memory', value: '12 GB RAM' },
      { label: 'Storage', value: '256 GB' },
      { label: 'Rear camera', value: '50 MP triple camera system' },
      { label: 'Battery', value: '4,610 mAh, 90 W wired charging' },
      { label: 'Operating system', value: 'Android' },
    ],
  },
  {
    id: 'macbook-air',
    name: 'MacBook Air 13-inch',
    brand: 'Apple',
    category: 'Computers',
    price: 1099,
    tag: 'Lightweight',
    description: 'Thin and light laptop for everyday work, study, and creative projects.',
    image: 'https://images.unsplash.com/photo-1496181133206-80ce9b88a853?auto=format&fit=crop&w=1000&q=85',
    imageAlt: 'Open laptop on a desk',
    specifications: [
      { label: 'Display', value: '13.6-inch Liquid Retina' },
      { label: 'Processor', value: 'Apple M3' },
      { label: 'Memory', value: '8 GB unified memory' },
      { label: 'Storage', value: '256 GB SSD' },
      { label: 'Battery life', value: 'Up to 18 hours (manufacturer estimate)' },
      { label: 'Operating system', value: 'macOS' },
    ],
  },
  {
    id: 'surface-laptop',
    name: 'Surface Laptop',
    brand: 'Microsoft',
    category: 'Computers',
    price: 999,
    tag: 'Work ready',
    description: 'Premium Windows laptop with a spacious keyboard and crisp display.',
    image: 'https://images.unsplash.com/photo-1517336714731-489689fd1ca8?auto=format&fit=crop&w=1000&q=85',
    imageAlt: 'Laptop computer viewed on a desk',
    specifications: [
      { label: 'Display', value: '13.8-inch PixelSense touchscreen' },
      { label: 'Processor', value: 'Snapdragon X Plus' },
      { label: 'Memory', value: '16 GB RAM' },
      { label: 'Storage', value: '512 GB SSD' },
      { label: 'Connectivity', value: 'Wi-Fi 7, Bluetooth 5.4, USB-C' },
      { label: 'Operating system', value: 'Windows 11' },
    ],
  },
  {
    id: 'airpods-pro',
    name: 'AirPods Pro',
    brand: 'Apple',
    category: 'Audio',
    price: 249,
    tag: 'Noise cancelling',
    description: 'Wireless earbuds with active noise cancellation and a compact charging case.',
    image: 'https://images.unsplash.com/photo-1606220945770-b5b6c2c55bf1?auto=format&fit=crop&w=1000&q=85',
    imageAlt: 'Wireless earbuds and charging case',
    specifications: [
      { label: 'Audio', value: 'Custom high-excursion Apple driver' },
      { label: 'Noise control', value: 'Active Noise Cancellation and Transparency mode' },
      { label: 'Connectivity', value: 'Bluetooth 5.3, Apple H2 chip' },
      { label: 'Charging', value: 'MagSafe and USB-C charging case' },
      { label: 'Water resistance', value: 'IP54 earbuds and case' },
    ],
  },
  {
    id: 'galaxy-buds',
    name: 'Galaxy Buds',
    brand: 'Samsung',
    category: 'Audio',
    price: 149,
    tag: 'Everyday audio',
    description: 'Compact wireless earbuds designed for music, calls, and commuting.',
    image: 'https://images.unsplash.com/photo-1608156639585-b3a032ef9689?auto=format&fit=crop&w=1000&q=85',
    imageAlt: 'Wireless earbuds displayed against a neutral background',
    specifications: [
      { label: 'Audio', value: 'Two-way speaker with enhanced bass' },
      { label: 'Noise control', value: 'Active Noise Cancellation and Ambient Sound' },
      { label: 'Connectivity', value: 'Bluetooth 5.4' },
      { label: 'Charging', value: 'USB-C wireless charging case' },
      { label: 'Water resistance', value: 'IPX7 earbuds' },
    ],
  },
];

export const formatPrice = (price: number) =>
  new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 }).format(price);
