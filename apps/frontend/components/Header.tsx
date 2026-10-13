'use client';

import { FormEvent } from 'react';
import Image from 'next/image';
import { usePathname, useRouter } from 'next/navigation';
import { useStore } from './StoreProvider';

const navigation = [
  { href: '/', label: 'Home' },
  { href: '/phones', label: 'Shop' },
  { href: '/outlets', label: 'Outlets' },
  { href: '/about', label: 'About' },
];

export function Header() {
  const pathname = usePathname();
  const router = useRouter();
  const { cart, searchTerm, setSearchTerm, compared } = useStore();

  function submitSearch(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    router.push('/phones');
  }

  return (
    <header className="topbar">
      <a className="brand-wrap" href="/" aria-label="Electronic Hub home">
        <Image className="brand-logo" src="/electronic-hub-logo.svg" alt="" width={40} height={40} />
        <span className="brand-name">Electronic Hub</span>
      </a>
      <nav className="nav" aria-label="Main navigation">
        {navigation.map((item) => (
          <a className={(pathname === item.href || (item.href === '/phones' && ['/computers', '/audio'].includes(pathname))) ? 'current' : ''} href={item.href} key={item.href} aria-current={pathname === item.href ? 'page' : undefined}>
            {item.label}
          </a>
        ))}
        <details className="nav-more"><summary>More</summary><div className="nav-more-menu"><a href="/brands">Brands</a><a href="/theme">Theme</a><a href="/seller">Sell with us</a></div></details>
      </nav>
      <div className="header-actions">
        <form className="search-form" role="search" onSubmit={submitSearch}>
          <label className="visually-hidden" htmlFor="site-search">Search devices</label>
          <input id="site-search" type="search" value={searchTerm} onChange={(event) => setSearchTerm(event.target.value)} placeholder="Search devices" />
          <button type="submit" aria-label="Search">⌕</button>
        </form>
        <a className="header-icon-link" href="/compare" aria-label={`Compare items${compared.length ? `, ${compared.length} selected` : ''}`}>
          <span aria-hidden="true">⇄</span>{compared.length > 0 && <b>{compared.length}</b>}
        </a>
        <a className="header-icon-link" href="/cart" aria-label={`Shopping cart, ${Object.values(cart).reduce((total, quantity) => total + quantity, 0)} items`}>
          <span aria-hidden="true">▱</span><b>{Object.values(cart).reduce((total, quantity) => total + quantity, 0)}</b>
        </a>
      </div>
    </header>
  );
}
