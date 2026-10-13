'use client';

import { Header } from '../../components/Header';
import { useStore } from '../../components/StoreProvider';
import { formatPrice } from '../../lib/products';
import Image from 'next/image';

export default function ComparePage() {
  const { compared, products, toggleCompare } = useStore();
  const selected = products.filter((product) => compared.includes(product.id));

  return (
    <main>
      <Header />
      <section className="catalog-intro">
        <div><p className="eyebrow">Make a confident choice</p><h1>Compare devices</h1><p>Select up to three devices in a catalog to compare them side by side.</p></div>
      </section>
      {selected.length ? (
        <div className="compare-cards">
          {selected.map((product) => (
            <article className="compare-product" key={product.id}>
              <Image src={product.image} alt={product.imageAlt} width={400} height={300} unoptimized sizes="(max-width: 760px) 100vw, 33vw" />
              <span className="product-brand">{product.brand} · {product.category}</span>
              <h2>{product.name}</h2>
              <strong className="product-price">{formatPrice(product.price)}</strong>
              <p>{product.description}</p>
              <button type="button" className="button subtle small" onClick={() => toggleCompare(product.id)}>Remove from comparison</button>
            </article>
          ))}
          <div className="compare-table">
            <div className="compare-row"><span>Brand</span>{selected.map((product) => <strong key={product.id}>{product.brand}</strong>)}</div>
            <div className="compare-row"><span>Category</span>{selected.map((product) => <strong key={product.id}>{product.category}</strong>)}</div>
            <div className="compare-row"><span>Sample price</span>{selected.map((product) => <strong key={product.id}>{formatPrice(product.price)}</strong>)}</div>
          </div>
        </div>
      ) : (
        <div className="empty-state">
          <span className="empty-icon" aria-hidden="true">⇄</span>
          <h2>Your comparison is ready when you are</h2>
          <p>Pick up to three items from the catalog using the Compare button.</p>
          <a className="button primary" href="/phones">Browse devices</a>
        </div>
      )}
    </main>
  );
}
