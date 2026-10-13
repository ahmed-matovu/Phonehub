import { Header } from '../components/Header';
import { Marketplace } from '../components/Marketplace';
import Image from 'next/image';
import { PhoneAdSlideshow } from '../components/PhoneAdSlideshow';

const categories = [
  { name: 'Phones', href: '/phones', image: 'https://images.unsplash.com/photo-1592750475338-74b7b21085ab?auto=format&fit=crop&w=900&q=85', detail: 'Everyday devices and flagships' },
  { name: 'Computers', href: '/computers', image: 'https://images.unsplash.com/photo-1496181133206-80ce9b88a853?auto=format&fit=crop&w=900&q=85', detail: 'Laptops for work and play' },
  { name: 'Audio', href: '/audio', image: 'https://images.unsplash.com/photo-1606220945770-b5b6c2c55bf1?auto=format&fit=crop&w=900&q=85', detail: 'Wireless earbuds and headphones' },
];

export default function HomePage() {
  return (
    <main>
      <Header />
      <section className="hero">
        <div className="hero__content">
          <p className="eyebrow">Your next favorite device lives here</p>
          <h1>Good tech.<br /><span>Good energy.</span></h1>
          <p>Explore phones, computers, and audio from the brands you love. Find your next everyday essential in one lively place.</p>
          <div className="cta-row">
            <a href="/phones" className="button primary">Explore devices <span aria-hidden="true">→</span></a>
            <a href="/seller" className="button secondary">Open a seller shop</a>
          </div>
          <div className="trust-note"><span>●</span> Carefully curated device picks <span>·</span> Easy side-by-side comparisons</div>
        </div>
        <div className="hero__visual">
          <Image src="https://images.unsplash.com/photo-1512499617640-c74ae3a79d37?auto=format&fit=crop&w=1200&q=90" alt="A collection of everyday electronic devices on a desk" fill priority sizes="(max-width: 760px) 100vw, 50vw" />
          <div className="hero-sticker"><span>TECH</span><strong>that fits<br />your life</strong></div>
          <div className="hero-caption">A little something for every setup</div>
        </div>
      </section>

      <section className="section phone-promotions">
        <PhoneAdSlideshow />
      </section>

      <section className="section category-section">
        <div className="section-header">
          <div><p className="eyebrow">Shop by category</p><h2>Find your kind of tech</h2></div>
          <a href="/phones">Browse all devices <span aria-hidden="true">→</span></a>
        </div>
        <div className="category-grid">
          {categories.map((category) => (
            <a className="category-card" href={category.href} key={category.name}>
              <Image src={category.image} alt={`${category.name} product photography`} fill sizes="(max-width: 760px) 100vw, 33vw" />
              <span className="category-card-label"><strong>{category.name}</strong><span>{category.detail}</span></span>
              <span className="category-arrow" aria-hidden="true">↗</span>
            </a>
          ))}
        </div>
      </section>

      <section className="section home-catalog">
        <div className="section-header">
          <div><p className="eyebrow">The crowd favorites</p><h2>Popular phones</h2></div>
          <a href="/phones">Shop phones <span aria-hidden="true">→</span></a>
        </div>
        <Marketplace category="Phones" />
      </section>

      <footer className="site-footer">
        <a className="brand-wrap" href="/" aria-label="Electronic Hub home">
          <Image className="brand-logo" src="/electronic-hub-logo.svg" alt="" width={40} height={40} />
          <span className="brand-name">Electronic Hub</span>
        </a>
        <span>Product photos by <a href="https://unsplash.com/" target="_blank" rel="noreferrer">Unsplash photographers</a>. Listings and prices are demo examples.</span>
      </footer>
    </main>
  );
}
