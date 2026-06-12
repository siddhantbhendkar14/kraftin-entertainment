import LegacySitePage from '@/components/site/LegacySitePage';
import { legacyLdJson, legacyMetadata } from '@/lib/legacy-metadata';

export const metadata = legacyMetadata('about-us/index.html');

export default function AboutPage() {
  return (
    <LegacySitePage
      htmlPath="about-us/index.html"
      activeNav="about-us"
      ldJson={legacyLdJson('about-us/index.html')}
    />
  );
}
