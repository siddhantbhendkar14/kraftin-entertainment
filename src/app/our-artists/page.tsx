import LegacySitePage from '@/components/site/LegacySitePage';
import { legacyMetadata } from '@/lib/legacy-metadata';

export const metadata = legacyMetadata('our-artists/index.html');

export default function OurArtistsPage() {
  return (
    <LegacySitePage htmlPath="our-artists/index.html" activeNav="our-artists" />
  );
}
