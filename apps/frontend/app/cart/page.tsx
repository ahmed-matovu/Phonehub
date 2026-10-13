'use client';

import { useState } from 'react';
import Image from 'next/image';
import { Header } from '../../components/Header';
import { useStore } from '../../components/StoreProvider';
import { formatPrice } from '../../lib/products';

export default function CartPage() {
  const { cart, clearCart, products, removeFromCart, setCartQuantity } = useStore();
  const [checkoutMessage, setCheckoutMessage] = useState('');
  const cartProducts = products.filter((product) => (cart[product.id] ?? 0) > 0);
  const total = cartProducts.reduce((sum, product) => sum + product.price * cart[product.id], 0);

  return (
    <main>
      <Header />
      <section className="catalog-intro">
        <div><p className="eyebrow">Your shortlist</p><h1>Shopping cart</h1><p>Review your picks before continuing.</p></div>
      </section>
      {cartProducts.length ? (
        <div className="cart-layout">
          <div className="cart-items">
            {cartProducts.map((product) => (
              <article className="cart-item" key={product.id}>
                <Image src={product.image} alt={product.imageAlt} width={100} height={82} unoptimized sizes="100px" />
                <div><span className="product-brand">{product.brand} · {product.category}</span><h2>{product.name}</h2><strong>{formatPrice(product.price * cart[product.id])}</strong><span className="cart-unit-price">{formatPrice(product.price)} each</span></div>
                <label className="cart-quantity">Qty<input aria-label={`Quantity for ${product.name}`} type="number" min="1" max="99" value={cart[product.id]} onChange={(event) => setCartQuantity(product.id, Math.min(99, Math.max(1, Number(event.target.value) || 1)))} /></label>
                <button type="button" className="button subtle small" onClick={() => { removeFromCart(product.id); setCheckoutMessage(''); }}>Remove</button>
              </article>
            ))}
            <button type="button" className="text-button" onClick={() => { clearCart(); setCheckoutMessage(''); }}>Clear cart</button>
          </div>
          <aside className="cart-summary">
            <p>Order summary</p><div><span>Subtotal</span><strong>{formatPrice(total)}</strong></div>
            <div><span>Shipping</span><span>Calculated at checkout</span></div>
            <button type="button" className="button primary checkout-button" onClick={() => setCheckoutMessage('Checkout is a demo preview. No payment has been taken.')}>Continue to checkout</button>
            {checkoutMessage && <p className="checkout-message" role="status">{checkoutMessage}</p>}
            <small>Demo catalog only. Sample listings and prices are not live offers.</small>
          </aside>
        </div>
      ) : (
        <div className="empty-state">
          <span className="empty-icon" aria-hidden="true">▱</span>
          <h2>Your cart is taking a little break</h2>
          <p>Add something you like and it will show up here.</p>
          <a className="button primary" href="/phones">Explore devices</a>
        </div>
      )}
    </main>
  );
}
