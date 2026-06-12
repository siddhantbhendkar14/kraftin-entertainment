import LegacySitePage from '@/components/site/LegacySitePage';
import { legacyMetadata } from '@/lib/legacy-metadata';

export const metadata = legacyMetadata('case-studies/varmala/index.html');

export default function VarmalaCaseStudyPage() {
  return (
    <LegacySitePage
      htmlPath="case-studies/varmala/index.html"
      showLightbox
      showWhatsApp
    />
  );
}
