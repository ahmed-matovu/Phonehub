import 'dotenv/config';
import cors from 'cors';
import express, { Request, Response } from 'express';
import { adCampaigns, brands, orders, phones, sellers } from './data/mockData.js';
import { createCatalogCategory, createCatalogProduct, getCatalogCategories, getCatalogProducts, initializeDatabase } from './data/database.js';
import { requireAdmin } from './adminSession.js';
import { z } from 'zod';

const app = express();
const port = Number(process.env.PORT ?? 4000);

app.use(cors({ origin: process.env.FRONTEND_ORIGIN ?? 'http://localhost:3000', credentials: true }));
app.use(express.json());

const catalogProductSchema = z.object({
  id: z.string().min(1).max(120),
  name: z.string().min(1).max(90),
  brand: z.string().min(1).max(60),
  category: z.string().min(1).max(60),
  price: z.number().positive(),
  tag: z.string().max(32),
  description: z.string().max(500),
  image: z.string().url(),
  imageAlt: z.string().max(300),
  specifications: z.array(z.object({ label: z.string(), value: z.string() })),
});

const categorySchema = z.object({ name: z.string().trim().min(1).max(60) });

app.get('/health', (_req: Request, res: Response) => {
  res.json({ ok: true, service: 'phonehub-backend', timestamp: new Date().toISOString() });
});

app.get('/api/v1/auth/me', (_req, res) => {
  res.json({
    id: 'user-1',
    email: 'demo@phonehub.test',
    displayName: 'Demo buyer',
    role: 'CUSTOMER',
  });
});

app.post('/api/v1/auth/login', (req, res) => {
  const { email } = req.body ?? {};
  if (!email) {
    return res.status(400).json({ error: 'email is required' });
  }
  return res.json({ token: 'demo-token', user: { email, role: 'CUSTOMER' } });
});

app.get('/api/v1/brands', (_req, res) => {
  res.json({ data: brands });
});

app.get('/api/v1/phones', (_req, res) => {
  res.json({
    data: phones,
    pagination: { page: 1, limit: 20, total: phones.length },
  });
});

app.get('/api/v1/phones/:phoneId', (req, res) => {
  const phone = phones.find((item) => item.slug === req.params.phoneId || item.id === req.params.phoneId);
  if (!phone) {
    return res.status(404).json({ error: 'Phone not found' });
  }
  return res.json({ data: phone });
});

app.get('/api/v1/sellers', (_req, res) => {
  res.json({ data: sellers });
});

app.get('/api/v1/orders', (_req, res) => {
  res.json({ data: orders });
});

app.get('/api/v1/ads/campaigns', (_req, res) => {
  res.json({ data: adCampaigns });
});

app.get('/api/v1/catalog/categories', async (_req, res, next) => {
  try {
    res.json({ data: await getCatalogCategories() });
  } catch (error) {
    next(error);
  }
});

app.post('/api/v1/catalog/categories', requireAdmin, async (req, res, next) => {
  const parsed = categorySchema.safeParse(req.body);
  if (!parsed.success) return res.status(400).json({ error: 'A valid category name is required' });
  try {
    await createCatalogCategory(parsed.data.name);
    return res.status(201).json({ data: parsed.data.name });
  } catch (error) {
    if ((error as { code?: string }).code === '23505') return res.status(409).json({ error: 'Category already exists' });
    return next(error);
  }
});

app.get('/api/v1/catalog/products', async (_req, res, next) => {
  try {
    res.json({ data: await getCatalogProducts() });
  } catch (error) {
    next(error);
  }
});

app.post('/api/v1/catalog/products', requireAdmin, async (req, res, next) => {
  const parsed = catalogProductSchema.safeParse(req.body);
  if (!parsed.success) return res.status(400).json({ error: 'Invalid product data', details: parsed.error.flatten() });
  try {
    await createCatalogProduct(parsed.data);
    return res.status(201).json({ data: parsed.data });
  } catch (error) {
    if ((error as { code?: string }).code === '23503') return res.status(400).json({ error: 'Create the product category first' });
    if ((error as { code?: string }).code === '23505') return res.status(409).json({ error: 'Product ID already exists' });
    return next(error);
  }
});

app.get('/api/v1/me/watchlist', (_req, res) => {
  res.json({ data: ['phone-s24', 'phone-15p'] });
});

app.post('/api/v1/payments/checkout', (_req, res) => {
  res.json({
    status: 'pending',
    redirectUrl: 'https://example.com/payment/checkout',
    orderId: 'ord-1001',
  });
});

initializeDatabase()
  .then(() => app.listen(port, () => {
    console.log(`PhoneHub backend running on http://localhost:${port}`);
  }))
  .catch((error: unknown) => {
    console.error('Unable to connect to PostgreSQL or initialize the catalog schema.', error);
    process.exitCode = 1;
  });
