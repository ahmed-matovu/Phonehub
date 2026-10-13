'use client';

import { useMemo, useState } from 'react';
import Image from 'next/image';
import { useStore } from './StoreProvider';

const knownBrands = ['Apple', 'Samsung', 'Google', 'Xiaomi', 'Microsoft', 'OnePlus', 'Sony', 'Oppo', 'Vivo', 'Huawei', 'Nokia', 'Motorola'];

export function BrandExplorer() {
  const { products } = useStore();
  const [activeBrand, setActiveBrand] = useState('All brands');
  const brands = ['All brands', ...Array.from(new Set([...knownBrands, ...products.map((product) => product.brand)]))];
  const brandProducts = useMemo(
    () => products.filter((product) => activeBrand === 'All brands' || product.brand === activeBrand),
    [activeBrand, products],
  );

  return (
    <>
      <div className="brand-filters brand-explorer-filters" aria-label="Select a brand">
        {brands.map((brand) => (
          <button
            type="button"
            className={`filter-chip${activeBrand === brand ? ' active' : ''}`}
            key={brand}
            onClick={() => setActiveBrand(brand)}
            aria-pressed={activeBrand === brand}
          >
            {brand}
          </button>
        ))}
      </div>
      <div className="brand-showcase-grid">
        {brandProducts.map((product) => (
          <a className="brand-showcase-card" href={product.category === 'Phones' || product.category === 'Computers' || product.category === 'Audio' ? categoryPath(product.category) : `/category/${encodeURIComponent(slugify(product.category))}`} key={product.id}>
            <Image src={product.image} alt={product.imageAlt} fill unoptimized sizes="(max-width: 760px) 100vw, 33vw" />
            <div><span>{product.brand}</span><strong>{product.name}</strong><small>Explore {product.category.toLowerCase()} →</small></div>
          </a>
        ))}
        {brandProducts.length === 0 && (
          <div className="empty-state brand-empty">
            <h2>{activeBrand} picks are on the way</h2>
            <p>Choose another brand to explore the products currently in our demo catalog.</p>
          </div>
        )}
      </div>
    </>
  );
}

function categoryPath(category: string) {
  if (category === 'Computers') return '/computers';
  if (category === 'Audio') return '/audio';
  return '/phones';
}

function slugify(value: string) {
  return value.toLowerCase().trim().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
}
