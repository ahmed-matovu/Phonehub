'use client';

import { useEffect, useState } from 'react';
import Image from 'next/image';
import { formatPrice } from '../lib/products';
import { useStore } from './StoreProvider';

export function PhoneAdSlideshow() {
  const { products } = useStore();
  const phones = products.filter((product) => product.category === 'Phones');
  const [activeIndex, setActiveIndex] = useState(0);
  const [paused, setPaused] = useState(false);
  const activePhone = phones[activeIndex % Math.max(phones.length, 1)];

  useEffect(() => {
    if (paused || phones.length < 2) return;
    const timer = window.setInterval(() => setActiveIndex((index) => (index + 1) % phones.length), 5500);
    return () => window.clearInterval(timer);
  }, [paused, phones.length]);

  if (!activePhone) return null;

  function moveSlide(direction: number) {
    setActiveIndex((index) => (index + direction + phones.length) % phones.length);
  }

  return (
    <section
      className="phone-slideshow"
      aria-label="Featured phone promotions"
      aria-roledescription="carousel"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
      onFocusCapture={() => setPaused(true)}
      onBlurCapture={(event) => {
        if (!event.currentTarget.contains(event.relatedTarget as Node | null)) setPaused(false);
      }}
    >
      <div className="phone-slide-copy" key={activePhone.id}>
        <p className="eyebrow">Phone spotlight · {activePhone.brand}</p>
        <span className="phone-slide-tag">{activePhone.tag}</span>
        <h2>{activePhone.name}</h2>
        <p>{activePhone.description}</p>
        <div className="phone-slide-footer">
          <strong>{formatPrice(activePhone.price)} <small>sample price</small></strong>
          <a className="button primary" href="/phones">Explore phones <span aria-hidden="true">→</span></a>
        </div>
      </div>
      <div className="phone-slide-image" key={`${activePhone.id}-image`}>
        <Image src={activePhone.image} alt={activePhone.imageAlt} fill unoptimized sizes="(max-width: 760px) 100vw, 56vw" />
      </div>
      <div className="phone-slide-controls">
        <span>{String(activeIndex + 1).padStart(2, '0')} <i>/</i> {String(phones.length).padStart(2, '0')}</span>
        <div className="phone-slide-dots" aria-label="Choose a featured phone">
          {phones.map((phone, index) => <button key={phone.id} type="button" aria-label={`Show ${phone.name}`} aria-pressed={index === activeIndex} onClick={() => setActiveIndex(index)} />)}
        </div>
        <button className="phone-slide-arrow" type="button" aria-label="Previous phone promotion" onClick={() => moveSlide(-1)}>←</button>
        <button className="phone-slide-arrow" type="button" aria-label="Next phone promotion" onClick={() => moveSlide(1)}>→</button>
      </div>
    </section>
  );
}