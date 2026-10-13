'use client';

import { FormEvent, useState } from 'react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { Header } from '../../components/Header';
import { useStore } from '../../components/StoreProvider';
import { ProductSpecification } from '../../lib/products';

type SpecificationDraft = ProductSpecification;

export default function AdminPage() {
  const { addCategory, addProduct, categories, products, updateProduct } = useStore();
  const router = useRouter();
  const [newCategory, setNewCategory] = useState('');
  const [categoryMessage, setCategoryMessage] = useState('');
  const [formMessage, setFormMessage] = useState('');
  const [imageMessage, setImageMessage] = useState('');
  const [editingProductId, setEditingProductId] = useState<string | null>(null);
  const [imageDraft, setImageDraft] = useState({ url: '', alt: '' });
  const [specifications, setSpecifications] = useState<SpecificationDraft[]>([{ label: '', value: '' }]);
  const [form, setForm] = useState({
    name: '',
    brand: '',
    category: categories[0] ?? 'Phones',
    price: '',
    tag: '',
    description: '',
    image: '',
    imageAlt: '',
  });

  async function handleAddCategory(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const value = newCategory.trim();
    if (!value) {
      setCategoryMessage('Enter a category name first.');
      return;
    }
    if (categories.some((category) => category.toLowerCase() === value.toLowerCase())) {
      setCategoryMessage(`${value} is already in your categories.`);
      return;
    }
    try {
      await addCategory(value);
      setForm((current) => ({ ...current, category: value }));
      setNewCategory('');
      setCategoryMessage(`${value} category added. You can add devices to it now.`);
    } catch (error) {
      setCategoryMessage(error instanceof Error ? error.message : 'Unable to save this category.');
    }
  }

  async function handleAddProduct(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const price = Number(form.price);
    if (!Number.isFinite(price) || price <= 0) {
      setFormMessage('Enter a price greater than zero.');
      return;
    }
    const completedSpecifications = specifications
      .map(({ label, value }) => ({ label: label.trim(), value: value.trim() }))
      .filter((specification) => specification.label && specification.value);
    const imageUrl = form.image.trim();
    try {
      const parsedUrl = new URL(imageUrl);
      if (parsedUrl.protocol !== 'https:' && parsedUrl.protocol !== 'http:') throw new Error('Invalid image protocol');
    } catch {
      setFormMessage('Enter a valid http or https image URL.');
      return;
    }
    if (completedSpecifications.length === 0) {
      setFormMessage('Add at least one complete specification.');
      return;
    }

    const product = {
      id: `custom-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
      name: form.name.trim(),
      brand: form.brand.trim(),
      category: form.category,
      price,
      tag: form.tag.trim() || 'New arrival',
      description: form.description.trim(),
      image: imageUrl,
      imageAlt: form.imageAlt.trim() || `${form.name.trim()} product photo`,
      specifications: completedSpecifications,
    };
    try {
      await addProduct(product);
      setFormMessage(`${form.name.trim()} is now in ${form.category}.`);
      setForm((current) => ({ ...current, name: '', brand: '', price: '', tag: '', description: '', image: '', imageAlt: '' }));
      setSpecifications([{ label: '', value: '' }]);
    } catch (error) {
      setFormMessage(error instanceof Error ? error.message : 'Unable to save this product.');
    }
  }

  function updateSpecification(index: number, field: keyof SpecificationDraft, value: string) {
    setSpecifications((items) => items.map((item, itemIndex) => itemIndex === index ? { ...item, [field]: value } : item));
  }

  function saveProductImage(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!editingProductId) return;
    try {
      const imageUrl = new URL(imageDraft.url.trim());
      if (imageUrl.protocol !== 'https:' && imageUrl.protocol !== 'http:') throw new Error('Invalid image URL protocol');
    } catch {
      setImageMessage('Enter a valid http or https image URL.');
      return;
    }
    const existingProduct = products.find((product) => product.id === editingProductId);
    updateProduct(editingProductId, {
      image: imageDraft.url.trim(),
      imageAlt: imageDraft.alt.trim() || existingProduct?.imageAlt || 'Device product photo',
    });
    const productName = existingProduct?.name ?? 'Device';
    setEditingProductId(null);
    setImageMessage(`${productName} image updated.`);
  }

  return (
    <main>
      <Header />
      <section className="catalog-intro admin-intro">
        <div>
          <p className="eyebrow">Your catalog, your rules</p>
          <h1>Admin studio</h1>
          <p>Create your own device categories, add products, and publish detailed specifications to the storefront.</p>
        </div>
        <div className="admin-intro-mark" aria-hidden="true"><span>EDIT</span><strong>YOUR<br />HUB</strong></div>
        <button type="button" className="button secondary admin-sign-out" onClick={async () => {
          await fetch('/api/admin/session', { method: 'DELETE' });
          router.replace('/admin/login');
        }}>Sign out</button>
      </section>

      <section className="admin-workspace">
        <div className="admin-panel category-manager">
          <div className="admin-panel-heading">
            <span className="admin-step">01</span>
            <div><h2>Build your categories</h2><p>Create sections that fit your store.</p></div>
          </div>
          <div className="admin-category-list">
            {categories.map((category) => <span className="admin-category-pill" key={category}>{category}<b>{products.filter((product) => product.category === category).length}</b></span>)}
          </div>
          <form className="category-form" onSubmit={handleAddCategory}>
            <label htmlFor="new-category">Add a category</label>
            <div className="inline-form-row">
              <input id="new-category" value={newCategory} onChange={(event) => setNewCategory(event.target.value)} placeholder="e.g. Cameras, Gaming, Tablets" />
              <button type="submit" className="button primary">Add category</button>
            </div>
            {categoryMessage && <p className="admin-feedback" role="status">{categoryMessage}</p>}
          </form>
        </div>

        <div className="admin-panel product-manager">
          <div className="admin-panel-heading">
            <span className="admin-step">02</span>
            <div><h2>Add a device</h2><p>Include a description, a real product image, and the specs shoppers need.</p></div>
          </div>
          <form className="admin-product-form" onSubmit={handleAddProduct}>
            <div className="admin-form-grid">
              <label>Device name<input required maxLength={90} value={form.name} onChange={(event) => setForm({ ...form, name: event.target.value })} placeholder="e.g. Mirrorless X5" /></label>
              <label>Brand<input required maxLength={60} value={form.brand} onChange={(event) => setForm({ ...form, brand: event.target.value })} placeholder="e.g. Example brand" /></label>
              <label>Category<select value={form.category} onChange={(event) => setForm({ ...form, category: event.target.value })}>{categories.map((category) => <option key={category} value={category}>{category}</option>)}</select></label>
              <label>Price (USD)<input required type="number" min="0.01" step="0.01" value={form.price} onChange={(event) => setForm({ ...form, price: event.target.value })} placeholder="499" /></label>
              <label>Product badge<input maxLength={32} value={form.tag} onChange={(event) => setForm({ ...form, tag: event.target.value })} placeholder="Optional, e.g. New arrival" /></label>
              <label>Image URL<input required type="url" value={form.image} onChange={(event) => setForm({ ...form, image: event.target.value })} placeholder="https://..." /></label>
              <label className="admin-wide-field">Image description<input value={form.imageAlt} onChange={(event) => setForm({ ...form, imageAlt: event.target.value })} placeholder="A short description for screen readers" /></label>
              <label className="admin-wide-field">Product description<textarea required maxLength={500} rows={3} value={form.description} onChange={(event) => setForm({ ...form, description: event.target.value })} placeholder="What makes this device useful? Include its main features." /></label>
            </div>

            <div className="spec-editor">
              <div className="spec-editor-heading"><div><h3>Specifications</h3><p>Add details shown when shoppers open a device.</p></div><button type="button" className="button subtle small" onClick={() => setSpecifications((items) => [...items, { label: '', value: '' }])}>+ Add spec</button></div>
              {specifications.map((specification, index) => (
                <div className="spec-input-row" key={index}>
                  <label>Specification<input value={specification.label} onChange={(event) => updateSpecification(index, 'label', event.target.value)} placeholder="e.g. Display" /></label>
                  <label>Details<input value={specification.value} onChange={(event) => updateSpecification(index, 'value', event.target.value)} placeholder="e.g. 6.7-inch OLED, 120 Hz" /></label>
                  {specifications.length > 1 && <button type="button" className="remove-spec-button" aria-label={`Remove specification ${index + 1}`} onClick={() => setSpecifications((items) => items.filter((_, itemIndex) => itemIndex !== index))}>×</button>}
                </div>
              ))}
            </div>

            <div className="admin-submit-row">
              <button type="submit" className="button primary">Add device to catalog <span aria-hidden="true">→</span></button>
              {formMessage && <p className="admin-feedback" role="status">{formMessage}</p>}
            </div>
          </form>
        </div>
      </section>

      <section className="admin-catalog-section">
        <div className="section-header">
          <div><p className="eyebrow">Live catalog preview</p><h2>Your devices <span className="admin-total">{products.length}</span></h2></div>
          {imageMessage && <p className="admin-feedback" role="status">{imageMessage}</p>}
        </div>
        <div className="admin-device-grid">
          {products.map((product) => (
            <article className="admin-device-card" key={product.id}>
              <div className="admin-device-image">
                <Image src={product.image} alt={product.imageAlt} fill unoptimized sizes="(max-width: 760px) 100vw, 33vw" />
              </div>
              <div className="admin-device-card-content"><span>{product.brand} · {product.category}</span><h3>{product.name}</h3><small>{product.specifications.length} specifications</small>
                <button
                  type="button"
                  className="button subtle small"
                  onClick={() => {
                    setImageMessage('');
                    setEditingProductId(product.id);
                    setImageDraft({ url: product.image, alt: product.imageAlt });
                  }}
                >
                  Change image
                </button>
                {editingProductId === product.id && (
                  <form className="admin-image-form" onSubmit={saveProductImage}>
                    <label>Image URL<input required type="url" value={imageDraft.url} onChange={(event) => setImageDraft({ ...imageDraft, url: event.target.value })} /></label>
                    <label>Image description<input value={imageDraft.alt} onChange={(event) => setImageDraft({ ...imageDraft, alt: event.target.value })} /></label>
                    <div>
                      <button type="submit" className="button primary small">Save image</button>
                      <button type="button" className="button subtle small" onClick={() => setEditingProductId(null)}>Cancel</button>
                    </div>
                  </form>
                )}
              </div>
            </article>
          ))}
        </div>
      </section>
    </main>
  );
}
