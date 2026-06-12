import LegacySitePage from '@/components/site/LegacySitePage';
import { legacyLdJson, legacyMetadata } from '@/lib/legacy-metadata';

export const metadata = legacyMetadata('our-mentors/index.html');

export default function OurMentorsPage() {
  return (
    <LegacySitePage
      htmlPath="our-mentors/index.html"
      activeNav="our-mentors"
      ldJson={legacyLdJson('our-mentors/index.html')}
    />
  );
}
