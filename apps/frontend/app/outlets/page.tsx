import { Header } from '../../components/Header';

const outlets = [
  { name: 'Central Kampala', area: 'Kampala Central', hours: 'Mon–Sat · 9:00 am–6:00 pm', coordinates: '0.3136, 32.5811' },
  { name: 'Ntinda', area: 'Ntinda, Kampala', hours: 'Mon–Sat · 9:00 am–6:00 pm', coordinates: '0.3547, 32.6136' },
  { name: 'Entebbe Road', area: 'Entebbe Road, Kampala', hours: 'Mon–Sat · 9:00 am–6:00 pm', coordinates: '0.2878, 32.5601' },
];

export default function OutletsPage() {
  return (
    <main>
      <Header />
      <section className="catalog-intro">
        <div><p className="eyebrow">Visit us in person</p><h1>Our outlets</h1><p>Explore our example outlet areas and opening hours. Confirmed shop addresses and map pins should replace these placeholders before launch.</p></div>
      </section>
      <section className="outlets-layout">
        <div className="outlet-list">
          {outlets.map((outlet, index) => (
            <article className="outlet-row" key={outlet.name}>
              <span className="outlet-index">0{index + 1}</span>
              <div><h2>{outlet.name}</h2><p>{outlet.area}</p><span>{outlet.hours}</span><small>Example coordinates: {outlet.coordinates}</small></div>
              <a href={`https://www.openstreetmap.org/?mlat=${outlet.coordinates.split(', ')[0]}&mlon=${outlet.coordinates.split(', ')[1]}#map=16/${outlet.coordinates.replace(', ', '/')}`} target="_blank" rel="noreferrer" aria-label={`Open ${outlet.name} example location in OpenStreetMap`}>↗</a>
            </article>
          ))}
        </div>
        <div className="outlet-map-wrap">
          <iframe title="Map centered on Kampala" src="https://www.openstreetmap.org/export/embed.html?bbox=32.49%2C0.24%2C32.68%2C0.40&layer=mapnik&marker=0.3136%2C32.5811" loading="lazy" />
          <span className="map-caption">Kampala area · example map marker</span>
        </div>
      </section>
      <p className="outlet-disclaimer">These locations and hours are sample content, not verified PhoneHub shop details.</p>
    </main>
  );
}