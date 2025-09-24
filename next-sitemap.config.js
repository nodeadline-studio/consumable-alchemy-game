/** @type {import('next-sitemap').IConfig} */
module.exports = {
  siteUrl: process.env.SITE_URL || 'https://consumable-alchemy.vercel.app',
  generateRobotsTxt: true,
  generateIndexSitemap: false,
  exclude: ['/api/*', '/_next/*'],
  robotsTxtOptions: {
    policies: [
      {
        userAgent: '*',
        allow: '/',
        disallow: ['/api/', '/_next/'],
      },
    ],
  },
};
