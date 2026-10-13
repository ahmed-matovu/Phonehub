'use client';

import { createContext, useContext, useEffect, useMemo, useState } from 'react';
import { defaultCategories, Product, products as initialProducts } from '../lib/products';

type StoreContextValue = {
  cart: Record<string, number>;
  favorites: string[];
  compared: string[];
  searchTerm: string;
  categories: string[];
  products: Product[];
  theme: string;
  setSearchTerm: (term: string) => void;
  setTheme: (theme: string) => void;
  addCategory: (category: string) => Promise<void>;
  addProduct: (product: Product) => Promise<void>;
  updateProduct: (productId: string, updates: Pick<Product, 'image' | 'imageAlt'>) => void;
  toggleFavorite: (productId: string) => void;
  toggleCompare: (productId: string) => void;
  addToCart: (productId: string, quantity?: number) => void;
  setCartQuantity: (productId: string, quantity: number) => void;
  removeFromCart: (productId: string) => void;
  clearCart: () => void;
};

const StoreContext = createContext<StoreContextValue | null>(null);
const STORAGE_KEY = 'electronic-hub-store';
const CATALOG_STORAGE_KEY = 'electronic-hub-catalog';
const themes = ['aurora', 'ocean', 'sunset', 'light', 'forest', 'rose', 'cyberpunk', 'graphite'];

export function StoreProvider({ children }: { children: React.ReactNode }) {
  const [cart, setCart] = useState<Record<string, number>>({});
  const [favorites, setFavorites] = useState<string[]>([]);
  const [compared, setCompared] = useState<string[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [categories, setCategories] = useState(defaultCategories);
  const [catalogProducts, setCatalogProducts] = useState(initialProducts);
  const [theme, setTheme] = useState('aurora');
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    try {
      const savedState = window.localStorage.getItem(STORAGE_KEY);
      if (savedState) {
        const parsed: unknown = JSON.parse(savedState);
        if (typeof parsed === 'object' && parsed !== null) {
          const state = parsed as Record<string, unknown>;
          if (Array.isArray(state.cart) && state.cart.every((id) => typeof id === 'string')) {
            setCart(Object.fromEntries(state.cart.map((id) => [id, 1])));
          } else if (isCart(state.cart)) {
            setCart(state.cart);
          }
          if (Array.isArray(state.favorites) && state.favorites.every((id) => typeof id === 'string')) setFavorites(state.favorites);
          if (Array.isArray(state.compared) && state.compared.every((id) => typeof id === 'string')) setCompared(state.compared);
        }
      }
      const savedCatalog = window.localStorage.getItem(CATALOG_STORAGE_KEY);
      if (savedCatalog) {
        const parsed: unknown = JSON.parse(savedCatalog);
        if (typeof parsed === 'object' && parsed !== null) {
          const catalog = parsed as Record<string, unknown>;
          if (Array.isArray(catalog.categories) && catalog.categories.every((item) => typeof item === 'string')) {
            setCategories(Array.from(new Set([...defaultCategories, ...catalog.categories])));
          }
          if (Array.isArray(catalog.products) && catalog.products.every(isProduct)) {
            const savedProducts = catalog.products as Product[];
            setCatalogProducts([
              ...initialProducts.map((initial) => savedProducts.find((saved) => saved.id === initial.id) ?? initial),
              ...savedProducts.filter((saved) => !initialProducts.some((initial) => initial.id === saved.id)),
            ]);
          }
          if (typeof catalog.theme === 'string' && themes.includes(catalog.theme)) setTheme(catalog.theme);
        }
      }
    } catch (error) {
      console.error('Unable to load saved Electronic Hub data.', error);
    } finally {
      setHydrated(true);
    }
    void Promise.all([
      fetch('/api/v1/catalog/categories').then((response) => response.ok ? response.json() : Promise.reject(new Error('Unable to load categories'))),
      fetch('/api/v1/catalog/products').then((response) => response.ok ? response.json() : Promise.reject(new Error('Unable to load products'))),
    ]).then(([categoryResult, productResult]) => {
      if (Array.isArray(categoryResult.data)) {
        setCategories((items) => Array.from(new Set([...items, ...categoryResult.data.filter((item: unknown): item is string => typeof item === 'string')])));
      }
      if (Array.isArray(productResult.data) && productResult.data.every(isProduct)) {
        setCatalogProducts((items) => mergeProducts(items, productResult.data));
      }
    }).catch((error: unknown) => {
      console.info('Database catalog is unavailable; using this browser\'s saved catalog.', error);
    });
  }, []);

  useEffect(() => {
    if (!hydrated) return;
    try {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify({ cart, favorites, compared }));
      window.localStorage.setItem(CATALOG_STORAGE_KEY, JSON.stringify({
        categories: categories.filter((category) => !defaultCategories.includes(category)),
        products: catalogProducts,
        theme,
      }));
    } catch (error) {
      console.error('Unable to save Electronic Hub data in this browser.', error);
    }
  }, [cart, favorites, compared, hydrated, categories, catalogProducts, theme]);

  useEffect(() => {
    document.documentElement.dataset.theme = theme;
  }, [theme]);

  const value = useMemo<StoreContextValue>(() => ({
    cart,
    favorites,
    compared,
    searchTerm,
    categories,
    products: catalogProducts,
    theme,
    setSearchTerm,
    setTheme: (nextTheme) => {
      if (themes.includes(nextTheme)) setTheme(nextTheme);
    },
    addCategory: async (category) => {
      const response = await fetch('/api/v1/catalog/categories', {
        method: 'POST',
        credentials: 'same-origin',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: category.trim() }),
      });
      const result = await response.json();
      if (!response.ok) throw new Error(result.error ?? 'Unable to save category');
      setCategories((items) => items.some((item) => item.toLowerCase() === result.data.toLowerCase()) ? items : [...items, result.data]);
    },
    addProduct: async (product) => {
      const response = await fetch('/api/v1/catalog/products', {
        method: 'POST',
        credentials: 'same-origin',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(product),
      });
      const result = await response.json();
      if (!response.ok) throw new Error(result.error ?? 'Unable to save product');
      setCatalogProducts((items) => mergeProducts(items, [result.data]));
    },
    updateProduct: (productId, updates) => setCatalogProducts((items) => items.map((product) => product.id === productId ? { ...product, ...updates } : product)),
    toggleFavorite: (id) => setFavorites((items) => items.includes(id) ? items.filter((item) => item !== id) : [...items, id]),
    toggleCompare: (id) => setCompared((items) => items.includes(id) ? items.filter((item) => item !== id) : items.length < 3 ? [...items, id] : items),
    addToCart: (id, quantity = 1) => setCart((items) => ({ ...items, [id]: (items[id] ?? 0) + Math.max(1, Math.floor(quantity)) })),
    setCartQuantity: (id, quantity) => setCart((items) => {
      if (quantity <= 0) {
        const next = { ...items };
        delete next[id];
        return next;
      }
      return { ...items, [id]: Math.floor(quantity) };
    }),
    removeFromCart: (id) => setCart((items) => {
      const next = { ...items };
      delete next[id];
      return next;
    }),
    clearCart: () => setCart({}),
  }), [cart, favorites, compared, searchTerm, categories, catalogProducts, theme]);

  return <StoreContext.Provider value={value}>{children}</StoreContext.Provider>;
}

function isProduct(value: unknown): value is Product {
  if (typeof value !== 'object' || value === null) return false;
  const product = value as Record<string, unknown>;
  return typeof product.id === 'string'
    && typeof product.name === 'string'
    && typeof product.brand === 'string'
    && typeof product.category === 'string'
    && typeof product.price === 'number'
    && typeof product.tag === 'string'
    && typeof product.description === 'string'
    && typeof product.image === 'string'
    && typeof product.imageAlt === 'string'
    && Array.isArray(product.specifications)
    && product.specifications.every((specification) =>
      typeof specification === 'object'
      && specification !== null
      && typeof (specification as Record<string, unknown>).label === 'string'
      && typeof (specification as Record<string, unknown>).value === 'string');
}

function isCart(value: unknown): value is Record<string, number> {
  return typeof value === 'object' && value !== null
    && Object.values(value).every((quantity) => Number.isInteger(quantity) && quantity > 0);
}

function mergeProducts(current: Product[], incoming: Product[]) {
  const byId = new Map(current.map((product) => [product.id, product]));
  incoming.forEach((product) => byId.set(product.id, product));
  return Array.from(byId.values());
}

export function useStore() {
  const value = useContext(StoreContext);
  if (!value) throw new Error('useStore must be used inside StoreProvider');
  return value;
}
