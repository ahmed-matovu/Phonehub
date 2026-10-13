'use client';

import { useParams } from 'next/navigation';
import { Header } from '../../../components/Header';
import { Marketplace } from '../../../components/Marketplace';
import { useStore } from '../../../components/StoreProvider';

export default function CustomCategoryPage() {
  const params = useParams<{ slug: string }>();
  const { categories } = useStore();
  const category = categories.find((item) => slugify(item) === params.slug);

  return (
    <main>
      <Header />
      {category ? (
        <Marketplace category={category} />
      ) : (
        <section className="empty-state category-not-found">
          <h1>Category not found</h1>
          <p>This category may have been removed or its link may be out of date.</p>
          <a className="button primary" href="/admin">Open catalog admin</a>
        </section>
      )}
    </main>
  );
}

function slugify(value: string) {
  return value.toLowerCase().trim().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
}
