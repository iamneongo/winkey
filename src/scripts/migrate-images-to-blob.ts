import 'dotenv/config';
import { db } from '../lib/db';
import { put } from '@vercel/blob';
import fs from 'fs';
import path from 'path';

async function main() {
  if (!process.env.BLOB_READ_WRITE_TOKEN) {
    console.error('BLOB_READ_WRITE_TOKEN is not set');
    process.exit(1);
  }

  console.log('Migrating product images...');
  const { rows: products } = await db.query('SELECT id, photo_url FROM products WHERE photo_url LIKE \'/uploads/%\'');
  
  for (const product of products) {
    const localPath = path.join(process.cwd(), 'public', product.photo_url);
    if (fs.existsSync(localPath)) {
      console.log(`Uploading ${product.photo_url}...`);
      const fileBuffer = fs.readFileSync(localPath);
      const filename = path.basename(product.photo_url);
      const blob = await put(`products/${filename}`, fileBuffer, {
        access: 'public',
        addRandomSuffix: false,
      });
      await db.query('UPDATE products SET photo_url = $1 WHERE id = $2', [blob.url, product.id]);
      console.log(`Updated product ${product.id} -> ${blob.url}`);
    } else {
      console.warn(`File not found locally: ${localPath}`);
    }
  }

  console.log('Migrating blog covers...');
  const { rows: blogs } = await db.query('SELECT id, cover_url FROM blogs WHERE cover_url LIKE \'/uploads/%\'');
  
  for (const blog of blogs) {
    const localPath = path.join(process.cwd(), 'public', blog.cover_url);
    if (fs.existsSync(localPath)) {
      console.log(`Uploading ${blog.cover_url}...`);
      const fileBuffer = fs.readFileSync(localPath);
      const filename = path.basename(blog.cover_url);
      const blob = await put(`blogs/${filename}`, fileBuffer, {
        access: 'public',
        addRandomSuffix: false,
      });
      await db.query('UPDATE blogs SET cover_url = $1 WHERE id = $2', [blob.url, blog.id]);
      console.log(`Updated blog ${blog.id} -> ${blob.url}`);
    } else {
      console.warn(`File not found locally: ${localPath}`);
    }
  }

  console.log('Done!');
}

main().catch(console.error);
