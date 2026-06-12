import fs from 'fs';
import path from 'path';

export type LegacyPageMeta = {
  title: string;
  description: string;
  ldJson?: string;
};

export function extractMainContent(relativePath: string): string {
  const filePath = path.join(process.cwd(), relativePath);
  const html = fs.readFileSync(filePath, 'utf-8');
  const match = html.match(/<main[^>]*>([\s\S]*?)<\/main>/i);
  return match?.[1]?.trim() ?? '';
}

export function extractLegacyMeta(relativePath: string): LegacyPageMeta {
  const filePath = path.join(process.cwd(), relativePath);
  const html = fs.readFileSync(filePath, 'utf-8');
  const title = html.match(/<title>([^<]*)<\/title>/i)?.[1]?.trim() ?? 'Kraftin Entertainment';
  const description =
    html.match(/<meta\s+name="description"\s+content="([^"]*)"/i)?.[1]?.trim() ?? '';
  const ldJson = html.match(
    /<script\s+type="application\/ld\+json">([\s\S]*?)<\/script>/i
  )?.[1]?.trim();

  return { title, description, ldJson };
}

export function legacyPageExists(relativePath: string): boolean {
  return fs.existsSync(path.join(process.cwd(), relativePath));
}
