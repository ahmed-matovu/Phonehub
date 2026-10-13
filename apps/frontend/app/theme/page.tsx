'use client';

import { useEffect, useState } from 'react';
import { Header } from '../../components/Header';
import { useStore } from '../../components/StoreProvider';

const themes = [
  { id: 'aurora', name: 'Aurora', description: 'Deep midnight with mint and violet glow.', colors: ['#0a1022', '#83f2d0', '#a6a2ff'] },
  { id: 'ocean', name: 'Ocean', description: 'Cool blue depths with bright aqua accents.', colors: ['#071a2d', '#65d9ff', '#9cb5ff'] },
  { id: 'sunset', name: 'Sunset', description: 'Warm dark plum with coral and golden highlights.', colors: ['#211326', '#ffad8a', '#ffd27e'] },
  { id: 'light', name: 'Daylight', description: 'A crisp light canvas with vivid blue and teal.', colors: ['#f2f6ff', '#087f8c', '#455bd6'] },
  { id: 'forest', name: 'Forest', description: 'Rich evergreen shades with fresh lime and jade.', colors: ['#0b211c', '#9ce36b', '#4cd6ac'] },
  { id: 'rose', name: 'Rose', description: 'Soft berry darkness with rose and lilac accents.', colors: ['#241522', '#ff91bb', '#c5a0ff'] },
  { id: 'cyberpunk', name: 'Cyberpunk', description: 'Electric neon cyan and hot pink on deep ink.', colors: ['#100c24', '#4dfcff', '#ff59c7'] },
  { id: 'graphite', name: 'Graphite', description: 'Minimal charcoal with vivid amber highlights.', colors: ['#17191e', '#ffc857', '#f2f4f8'] },
];

export default function ThemePage() {
  const { theme, setTheme } = useStore();
  const [previewTheme, setPreviewTheme] = useState<string | null>(null);

  useEffect(() => {
    document.documentElement.dataset.theme = previewTheme ?? theme;
    return () => {
      document.documentElement.dataset.theme = theme;
    };
  }, [previewTheme, theme]);

  function applyTheme(themeId: string) {
    setTheme(themeId);
    setPreviewTheme(null);
  }

  return (
    <main>
      <Header />
      <section className="catalog-intro">
        <div><p className="eyebrow">Make it feel like yours</p><h1>Choose your theme</h1><p>Preview a color mood across the whole site, then apply it when you are ready. Your saved theme follows you around this browser.</p></div>
      </section>
      {previewTheme && (
        <div className="theme-preview-notice" role="status">
          <span>Previewing {themes.find((option) => option.id === previewTheme)?.name}</span>
          <button className="button primary small" type="button" onClick={() => applyTheme(previewTheme)}>Apply theme</button>
          <button className="button subtle small" type="button" onClick={() => setPreviewTheme(null)}>Discard preview</button>
        </div>
      )}
      <section className="theme-grid" aria-label="Available page themes">
        {themes.map((option) => (
          <article
            className={`theme-card theme-preview-${option.id}${theme === option.id ? ' selected' : ''}${previewTheme === option.id ? ' previewing' : ''}`}
            key={option.id}
          >
            <span className="theme-preview" aria-hidden="true">
              <span className="theme-preview-bar"><i /><i /><i /></span>
              <span className="theme-preview-content"><i /><i /><i /></span>
              <span className="theme-preview-glow" />
            </span>
            <span className="theme-card-copy"><strong>{option.name}</strong><small>{option.description}</small></span>
            <span className="theme-swatches" aria-hidden="true">{option.colors.map((color) => <i key={color} style={{ backgroundColor: color }} />)}</span>
            <span className="theme-selected-label">{theme === option.id ? 'Applied ✓' : previewTheme === option.id ? 'Previewing' : 'Ready to preview'}</span>
            <span className="theme-card-actions">
              <button type="button" className="button subtle small" onClick={() => setPreviewTheme(previewTheme === option.id ? null : option.id)}>
                {previewTheme === option.id ? 'Stop preview' : 'Preview'}
              </button>
              <button type="button" className="button primary small" onClick={() => applyTheme(option.id)} disabled={theme === option.id}>
                {theme === option.id ? 'Applied' : 'Apply'}
              </button>
            </span>
          </article>
        ))}
      </section>
    </main>
  );
}
