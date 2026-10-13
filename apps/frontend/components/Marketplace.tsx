'use client';

import { KeyboardEvent as ReactKeyboardEvent, useEffect, useMemo, useState } from 'react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { formatPrice, Product, ProductCategory } from '../lib/products';
import { useStore } from './StoreProvider';

export function Marketplace({ category }: { category: ProductCategory }) {
  const { addToCart, cart, categories, compared, favorites, products, searchTerm, toggleCompare, toggleFavorite } = useStore();
  const router = useRouter();
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [selectedBrand, setSelectedBrand] = useState('All brands');
  const [quantity, setQuantity] = useState(1);

  const categoryProducts = useMemo(() => products.filter((product) => product.category === category), [category, products]);
  const brands = ['All brands', ...Array.from(new Set(categoryProducts.map((product) => product.brand)))];
  const visibleProducts = useMemo(() => categoryProducts.filter((product) => {
    const matchesSearch = `${product.name} ${product.brand}`.toLowerCase().includes(searchTerm.trim().toLowerCase());
    return matchesSearch && (selectedBrand === 'All brands' || product.brand === selectedBrand);
  }), [categoryProducts, searchTerm, selectedBrand]);

  useEffect(() => {
    if (!selectedProduct) return;
    setQuantity(1);
    function closeOnEscape(event: globalThis.KeyboardEvent) {
      if (event.key === 'Escape') setSelectedProduct(null);
    }
    window.addEventListener('keydown', closeOnEscape);
    return () => window.removeEventListener('keydown', closeOnEscape);
  }, [selectedProduct]);

  function openProductWithKeyboard(event: ReactKeyboardEvent<HTMLElement>, product: Product) {
    if (event.target !== event.currentTarget) return;
    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault();
      setSelectedProduct(product);
    }
  }

  return (
    <>
      <section className="catalog-intro">
        <div>
          <p className="eyebrow">Curated tech, easy to compare</p>
          <h1>{category}</h1>
          <p>Explore our demo selection. Product photos are real Unsplash photography and illustrate the device category.</p>
        </div>
        <div className="catalog-count">{visibleProducts.length}<span> items shown</span></div>
      </section>

      <div className="catalog-toolbar">
        <label className="category-picker">Category
          <select value={category} onChange={(event) => router.push(categoryPath(event.target.value))}>
            {categories.map((item) => <option key={item} value={item}>{item}</option>)}
          </select>
        </label>
        <div className="brand-filters" aria-label="Filter by brand">
          {brands.map((brand) => (
            <button
              className={`filter-chip${selectedBrand === brand ? ' active' : ''}`}
              type="button"
              key={brand}
              onClick={() => setSelectedBrand(brand)}
              aria-pressed={selectedBrand === brand}
            >
              {brand}
            </button>
          ))}
        </div>
      </div>

      {visibleProducts.length ? (
        <div className="product-grid">
          {visibleProducts.map((product) => {
            const isCompared = compared.includes(product.id);
            const isFavorite = favorites.includes(product.id);
            const isInCart = Boolean(cart[product.id]);
            return (
              <article
                className={`product-card${selectedProduct?.id === product.id ? ' selected' : ''}`}
                key={product.id}
                onClick={() => setSelectedProduct(product)}
                onKeyDown={(event) => openProductWithKeyboard(event, product)}
                tabIndex={0}
                role="group"
                aria-label={`${product.name}, ${formatPrice(product.price)}`}
              >
                <div className="product-image-wrap">
                  <Image className="product-image" src={product.image} alt={product.imageAlt} fill unoptimized sizes="(max-width: 460px) 50vw, (max-width: 760px) 50vw, (max-width: 1050px) 33vw, 25vw" />
                  <span className="product-tag">{product.tag}</span>
                  <button
                    type="button"
                    className={`icon-button favorite-button${isFavorite ? ' selected' : ''}`}
                    aria-label={isFavorite ? `Remove ${product.name} from saved items` : `Save ${product.name}`}
                    aria-pressed={isFavorite}
                    onClick={(event) => {
                      event.stopPropagation();
                      toggleFavorite(product.id);
                    }}
                  >
                    {isFavorite ? '♥' : '♡'}
                  </button>
                </div>
                <div className="product-card-content">
                  <div className="product-brand">{product.brand}</div>
                  <h2>{product.name}</h2>
                  <p className="product-price">{formatPrice(product.price)} <span>sample price</span></p>
                  <div className="product-actions">
                    <button type="button" className="button subtle small" onClick={(event) => { event.stopPropagation(); setSelectedProduct(product); }}>
                      Details
                    </button>
                    <button
                      type="button"
                      className="button primary small"
                      onClick={(event) => {
                        event.stopPropagation();
                        addToCart(product.id);
                      }}
                    >
                      {isInCart ? 'Added ✓' : 'Add to cart'}
                    </button>
                    <button
                      type="button"
                      className={`button subtle small${isCompared ? ' chosen' : ''}`}
                      onClick={(event) => {
                        event.stopPropagation();
                        toggleCompare(product.id);
                      }}
                      aria-pressed={isCompared}
                      disabled={!isCompared && compared.length >= 3}
                    >
                      {isCompared ? 'Comparing ✓' : 'Compare'}
                    </button>
                  </div>
                </div>
              </article>
            );
          })}
        </div>
      ) : (
        <div className="empty-state">
          <h2>No matching {category.toLowerCase()} found</h2>
          <p>Try another search or reset the brand filter.</p>
          <button type="button" className="button secondary" onClick={() => { setSelectedBrand('All brands'); }}>
            Reset brand filter
          </button>
        </div>
      )}

      {selectedProduct && (
        <div className="modal-backdrop" role="presentation" onClick={() => setSelectedProduct(null)}>
          <section
            className="product-modal"
            role="dialog"
            aria-modal="true"
            aria-labelledby="product-dialog-title"
            onClick={(event) => event.stopPropagation()}
          >
            <button type="button" className="icon-button modal-close" aria-label="Close details" onClick={() => setSelectedProduct(null)}>×</button>
            <div className="modal-image-wrap">
              <Image src={selectedProduct.image} alt={selectedProduct.imageAlt} fill unoptimized sizes="(max-width: 760px) 100vw, 50vw" />
            </div>
            <div className="modal-content">
              <span className="product-brand">{selectedProduct.brand} · {selectedProduct.category}</span>
              <h2 id="product-dialog-title">{selectedProduct.name}</h2>
              <p>{selectedProduct.description}</p>
              <strong className="product-price">{formatPrice(selectedProduct.price)} <span>sample price</span></strong>
              <label className="quantity-picker" htmlFor="product-quantity">Quantity
                <input id="product-quantity" type="number" min="1" max="99" value={quantity} onChange={(event) => setQuantity(Math.min(99, Math.max(1, Number(event.target.value) || 1)))} />
              </label>
              <h3 className="specifications-heading">Specifications</h3>
              {selectedProduct.specifications.length > 0 ? (
                <dl className="specifications-list">
                  {selectedProduct.specifications.map((specification) => (
                    <div key={`${specification.label}-${specification.value}`}>
                      <dt>{specification.label}</dt><dd>{specification.value}</dd>
                    </div>
                  ))}
                </dl>
              ) : <p className="specification-empty">No specifications have been added yet.</p>}
              <button type="button" className="button primary" onClick={() => { addToCart(selectedProduct.id, quantity); setSelectedProduct(null); setQuantity(1); }}>
                Add {quantity} to cart
              </button>
            </div>
          </section>
        </div>
      )}
    </>
  );
}

function categoryPath(category: ProductCategory) {
  if (category === 'Computers') return '/computers';
  if (category === 'Audio') return '/audio';
  if (category === 'Phones') return '/phones';
  return `/category/${encodeURIComponent(category.toLowerCase().trim().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, ''))}`;
}
