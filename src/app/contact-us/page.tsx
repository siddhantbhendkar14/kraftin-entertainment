import LegacySitePage from '@/components/site/LegacySitePage';
import { legacyLdJson, legacyMetadata } from '@/lib/legacy-metadata';

export const metadata = legacyMetadata('contact-us/index.html');

export default function ContactPage() {
  return (
    <LegacySitePage
      htmlPath="contact-us/index.html"
      ldJson={legacyLdJson('contact-us/index.html')}
    />
  );
}
