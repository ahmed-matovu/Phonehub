'use client';

import { FormEvent, useState } from 'react';
import { Header } from '../../components/Header';

export default function SellerPage() {
  const [submitted, setSubmitted] = useState(false);

  function submitApplication(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setSubmitted(true);
  }

  return (
    <main>
      <Header />
      <section className="catalog-intro">
        <div><p className="eyebrow">Built for independent shops</p><h1>Sell with us</h1><p>Introduce your shop to people looking for their next device. This demo form previews a seller application without sending or storing personal details.</p></div>
      </section>
      <form className="seller-form" onSubmit={submitApplication}>
        <h2>Start your seller application</h2>
        <label>Shop name<input name="shopName" autoComplete="organization" required placeholder="Your business name" /></label>
        <label>Contact email<input name="email" type="email" autoComplete="email" required placeholder="you@example.com" /></label>
        <button className="button primary" type="submit">Preview application</button>
        {submitted && <p className="seller-message" role="status">Application preview complete. This demo has not submitted your details.</p>}
      </form>
      <section className="section">
        <div className="section-header"><div><p className="eyebrow">Seller workspace preview</p><h2>Everything in one place</h2></div></div>
        <div className="dashboard-grid">
          <div className="dashboard-card"><h3>Inventory</h3><p>Preview product listing management.</p></div>
          <div className="dashboard-card"><h3>Orders</h3><p>Preview order fulfillment tools.</p></div>
          <div className="dashboard-card"><h3>Promotions</h3><p>Preview sponsored product options.</p></div>
        </div>
      </section>
    </main>
  );
}
