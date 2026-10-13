import { Header } from '../../components/Header';
import { BrandExplorer } from '../../components/BrandExplorer';

export default function BrandsPage() {
  return (
    <main>
      <Header />
      <section className="catalog-intro">
        <div>
          <p className="eyebrow">The names you know</p>
          <h1>Meet the brands</h1>
          <p>Browse devices from leading phone, computer, and audio makers.</p>
        </div>
        <div className="brand-orbit" aria-hidden="true"><span>Samsung</span><span>Apple</span><span>Google</span><b>EH</b></div>
      </section>
      <BrandExplorer />
    </main>
  );
}
