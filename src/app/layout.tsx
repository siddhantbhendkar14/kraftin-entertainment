import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL ?? 'https://www.kraftinentertainment.com'),
  robots: 'max-image-preview:large, index, follow'
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" dir="ltr">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Cormorant+Garamond:wght@500;600;700&family=Inter:wght@400;500;600;700;800&display=swap"
          rel="stylesheet"
        />
        <link rel="stylesheet" href="/assets/css/main.css" />
        <link rel="stylesheet" href="/assets/css/icons.css" />
        <link rel="icon" href="/assets/favicon/favicon-32x32.png?v=3" type="image/png" sizes="32x32" />
        <link rel="icon" href="/assets/favicon/favicon-16x16.png?v=3" type="image/png" sizes="16x16" />
        <link rel="icon" href="/assets/favicon/favicon-48x48.png?v=3" type="image/png" sizes="48x48" />
        <link rel="apple-touch-icon" href="/assets/favicon/apple-touch-icon.png?v=3" sizes="180x180" />
        <link rel="manifest" href="/assets/favicon/site.webmanifest?v=3" />
      </head>
      <body>{children}</body>
    </html>
  );
}
