import { Header } from '../../components/Header';

const principles = [
  { number: '01', title: 'Useful choices', text: 'A focused range of phones, computers, and audio gear for work, study, and everyday life.' },
  { number: '02', title: 'Clear details', text: 'Product specifications and comparisons help you understand what you are choosing.' },
  { number: '03', title: 'People first', text: 'We aim to make finding the right device straightforward, whether you shop online or visit a store.' },
];

export default function AboutPage() {
  return (
    <main>
      <Header />
      <section className="about-intro">
        <p className="eyebrow">A little about Electronic Hub</p>
        <h1>Good technology should feel easier to find.</h1>
        <p>Electronic Hub brings everyday electronics together in one place, with useful product information and a simple way to compare your options.</p>
        <a className="button primary" href="/phones">Browse the collection <span aria-hidden="true">→</span></a>
      </section>
      <section className="about-principles" aria-label="What we care about">
        {principles.map((principle) => (
          <article key={principle.number}>
            <span>{principle.number}</span><h2>{principle.title}</h2><p>{principle.text}</p>
          </article>
        ))}
      </section>
      <section className="about-visit">
        <div><p className="eyebrow">Come by</p><h2>Meet us at an outlet</h2><p>Visit the outlets page for location details and opening hours.</p></div>
        <a href="/outlets" className="button secondary">See our outlets <span aria-hidden="true">↗</span></a>
      </section>
    </main>
  );
}