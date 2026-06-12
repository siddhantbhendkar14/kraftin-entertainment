import SiteChrome from '@/components/site/SiteChrome';
import GalleryWall from '@/components/gallery/GalleryWall';
import { getVisibleGalleryItems } from '@/lib/cms/gallery';
import { SITE_URL } from '@/lib/cms/constants';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Gallery » Kraftin Entertainment',
  description:
    "Explore Kraftin Entertainment's event gallery — weddings, corporate events, concerts, exhibitions, and celebrations across India.",
  alternates: { canonical: `${SITE_URL}/gallery/` },
  openGraph: {
    title: 'Gallery » Kraftin Entertainment',
    description:
      "Explore Kraftin Entertainment's event gallery — weddings, corporate events, concerts, exhibitions, and celebrations across India.",
    url: `${SITE_URL}/gallery/`,
    images: [`${SITE_URL}/assets/images/hero-wedding.jpg`]
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Gallery » Kraftin Entertainment',
    description:
      "Explore Kraftin Entertainment's event gallery — weddings, corporate events, concerts, exhibitions, and celebrations across India.",
    images: [`${SITE_URL}/assets/images/hero-wedding.jpg`]
  }
};

export default async function GalleryPage() {
  const items = await getVisibleGalleryItems();

  return (
    <SiteChrome activeNav="gallery" showAmbient showLightbox showWhatsApp>
      <main>
        <GalleryWall items={items} />
      </main>
    </SiteChrome>
  );
}
