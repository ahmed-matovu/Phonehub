type FeatureItem = {
  title: string;
  text: string;
};

export function FeatureGrid({ items }: { items: FeatureItem[] }) {
  return (
    <section className="section">
      <div className="card-grid three-up">
        {items.map((item) => (
          <article key={item.title} className="info-card">
            <h3>{item.title}</h3>
            <p>{item.text}</p>
          </article>
        ))}
      </div>
    </section>
  );
}
