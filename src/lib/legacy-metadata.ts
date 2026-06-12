import type { Metadata } from 'next';
import { extractLegacyMeta } from './legacy-html';

export function legacyMetadata(htmlPath: string): Metadata {
  const meta = extractLegacyMeta(htmlPath);
  return {
    title: meta.title,
    description: meta.description
  };
}

export function legacyLdJson(htmlPath: string): string | undefined {
  return extractLegacyMeta(htmlPath).ldJson;
}
