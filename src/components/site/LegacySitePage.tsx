import SiteChrome, { type NavKey } from './SiteChrome';
import { extractMainContent } from '@/lib/legacy-html';

type LegacySitePageProps = {
  htmlPath: string;
  activeNav?: NavKey;
  ldJson?: string;
  showAmbient?: boolean;
  showInstagram?: boolean;
  showLightbox?: boolean;
  showWhatsApp?: boolean;
};

export default function LegacySitePage({
  htmlPath,
  activeNav,
  ldJson,
  showAmbient,
  showInstagram,
  showLightbox,
  showWhatsApp
}: LegacySitePageProps) {
  const mainHtml = extractMainContent(htmlPath);

  return (
    <SiteChrome
      activeNav={activeNav}
      ldJson={ldJson}
      showAmbient={showAmbient}
      showInstagram={showInstagram}
      showLightbox={showLightbox}
      showWhatsApp={showWhatsApp}
    >
      <main dangerouslySetInnerHTML={{ __html: mainHtml }} />
    </SiteChrome>
  );
}
