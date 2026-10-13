import pg from 'pg';

const { Pool } = pg;
const pool = new Pool({
  connectionString: process.env.DATABASE_URL ?? 'postgresql://phonehub:phonehub@localhost:5432/phonehub',
});

export type CatalogProduct = {
  id: string;
  name: string;
  brand: string;
  category: string;
  price: number;
  tag: string;
  description: string;
  image: string;
  imageAlt: string;
  specifications: { label: string; value: string }[];
};

export async function initializeDatabase() {
  await pool.query(`
    CREATE TABLE IF NOT EXISTS catalog_categories (
      name TEXT PRIMARY KEY,
      created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
    );
    CREATE TABLE IF NOT EXISTS catalog_products (
      id TEXT PRIMARY KEY,
      name TEXT NOT NULL,
      brand TEXT NOT NULL,
      category TEXT NOT NULL REFERENCES catalog_categories(name),
      price NUMERIC(12, 2) NOT NULL CHECK (price > 0),
      tag TEXT NOT NULL,
      description TEXT NOT NULL,
      image TEXT NOT NULL,
      image_alt TEXT NOT NULL,
      specifications JSONB NOT NULL DEFAULT '[]'::jsonb,
      created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
    );
    INSERT INTO catalog_categories (name)
    VALUES ('Phones'), ('Computers'), ('Audio')
    ON CONFLICT (name) DO NOTHING;
  `);
}

export async function getCatalogCategories() {
  const result = await pool.query('SELECT name FROM catalog_categories ORDER BY name');
  return result.rows.map((row: { name: string }) => row.name);
}

export async function createCatalogCategory(name: string) {
  await pool.query('INSERT INTO catalog_categories (name) VALUES ($1)', [name]);
}

export async function getCatalogProducts(): Promise<CatalogProduct[]> {
  const result = await pool.query(`
    SELECT id, name, brand, category, price, tag, description, image,
           image_alt AS "imageAlt", specifications
    FROM catalog_products
    ORDER BY created_at DESC
  `);
  return result.rows.map((row) => ({ ...row, price: Number(row.price) }));
}

export async function createCatalogProduct(product: CatalogProduct) {
  await pool.query('INSERT INTO catalog_categories (name) VALUES ($1) ON CONFLICT (name) DO NOTHING', [product.category]);
  await pool.query(`
    INSERT INTO catalog_products
      (id, name, brand, category, price, tag, description, image, image_alt, specifications)
    VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10::jsonb)
  `, [
    product.id,
    product.name,
    product.brand,
    product.category,
    product.price,
    product.tag,
    product.description,
    product.image,
    product.imageAlt,
    JSON.stringify(product.specifications),
  ]);
}