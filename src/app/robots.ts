import { MetadataRoute } from 'next';

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: '*',
      allow: '/',
      disallow: ['/admin/', '/tai-khoan/', '/api/'],
    },
    sitemap: 'https://winkey.vn/sitemap.xml',
  };
}
