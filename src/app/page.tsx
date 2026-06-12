import LegacySitePage from '@/components/site/LegacySitePage';
import { legacyLdJson, legacyMetadata } from '@/lib/legacy-metadata';

export const metadata = legacyMetadata('index.html');

export default function HomePage() {
  return (
    <LegacySitePage
      htmlPath="index.html"
      activeNav="home"
      ldJson={legacyLdJson('index.html')}
      showAmbient
      showInstagram
      showLightbox
      showWhatsApp
    />
  );
}
