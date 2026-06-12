import LegacySitePage from '@/components/site/LegacySitePage';
import { legacyMetadata } from '@/lib/legacy-metadata';

export const metadata = legacyMetadata('privacy-policy/index.html');

export default function PrivacyPage() {
  return <LegacySitePage htmlPath="privacy-policy/index.html" />;
}
