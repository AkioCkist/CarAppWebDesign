// src/app/robots.txt/route.ts
import { NextResponse } from 'next/server';

export function GET() {
  const content = `
User-agent: *
Allow: /

Sitemap: https://car-app-web-design-git-main-akio-ckists-projects.vercel.app/sitemap.xml
  `.trim();

  return new NextResponse(content, {
    status: 200,
    headers: {
      'Content-Type': 'text/plain',
    },
  });
}
