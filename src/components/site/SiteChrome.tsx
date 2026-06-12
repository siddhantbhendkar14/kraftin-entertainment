import type { ReactNode } from 'react';

export type NavKey =
  | 'home'
  | 'about-us'
  | 'our-mentors'
  | 'our-artists'
  | 'blogs'
  | 'gallery';

type SiteChromeProps = {
  activeNav?: NavKey;
  children: ReactNode;
  showAmbient?: boolean;
  showInstagram?: boolean;
  showLightbox?: boolean;
  showWhatsApp?: boolean;
  ldJson?: string;
};

const NAV: { key: NavKey; href: string; label: string }[] = [
  { key: 'home', href: '/', label: 'Home' },
  { key: 'about-us', href: '/about-us/', label: 'About us' },
  { key: 'our-mentors', href: '/our-mentors/', label: 'Our Mentors' },
  { key: 'our-artists', href: '/our-artists/', label: 'Our Artists' },
  { key: 'blogs', href: '/blogs/', label: 'Blog' },
  { key: 'gallery', href: '/gallery/', label: 'Gallery' }
];

export default function SiteChrome({
  activeNav,
  children,
  showAmbient = false,
  showInstagram = false,
  showLightbox = false,
  showWhatsApp = false,
  ldJson
}: SiteChromeProps) {
  return (
    <>
      {ldJson ? (
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: ldJson }} />
      ) : null}

      {showAmbient ? <div className="ambient-light" aria-hidden="true" /> : null}

      <header className="header header--dark">
        <div className="container header-inner">
          <a href="/" className="logo site-logo" aria-label="Kraftin Entertainment Home">
            <img
              src="/assets/images/logo-Photoroom.png"
              alt="Kraftin Entertainment"
              width={48}
              height={48}
              loading="eager"
            />
          </a>
          <nav className="nav-desktop" aria-label="Main navigation">
            {NAV.map((item) => (
              <a
                key={item.key}
                href={item.href}
                className={activeNav === item.key ? 'active' : undefined}
              >
                {item.label}
              </a>
            ))}
          </nav>
          <div className="header-cta">
            <a href="/contact-us/" className="btn btn-primary btn-sm">
              Contact us
            </a>
            <button className="menu-toggle" aria-label="Open menu" aria-expanded="false">
              <span />
              <span />
              <span />
            </button>
          </div>
        </div>
      </header>

      <nav className="mobile-nav" aria-label="Mobile navigation">
        <button className="mobile-nav-close" aria-label="Close menu">
          &times;
        </button>
        {NAV.map((item) => (
          <a key={item.key} href={item.href}>
            {item.label}
          </a>
        ))}
        <a href="/contact-us/" className="btn btn-primary">
          Contact us
        </a>
      </nav>

      {children}

      <footer className="footer">
        <div className="container">
          <div className="footer-grid">
            <div className="footer-brand">
              <a href="/" className="footer-logo">
                <img
                  src="/assets/images/logo-Photoroom.png"
                  alt="Kraftin Entertainment"
                  width={64}
                  height={64}
                  loading="lazy"
                />
              </a>
              <p>
                Kraftin Entertainment — where we turn visions into unforgettable experiences.
                Premium event management across India.
              </p>
              <div className="footer-trust-metrics">
                <div className="footer-metric">
                  <strong>500+</strong>
                  <span>Events</span>
                </div>
                <div className="footer-metric">
                  <strong>25+</strong>
                  <span>Cities</span>
                </div>
                <div className="footer-metric">
                  <strong>50+</strong>
                  <span>Artists</span>
                </div>
                <div className="footer-metric">
                  <strong>Premium</strong>
                  <span>Event Solutions</span>
                </div>
              </div>
              <div className="footer-social">
                <a
                  href="https://www.facebook.com/profile.php?id=61560291329343"
                  target="_blank"
                  rel="noopener"
                  aria-label="Facebook"
                >
                  <svg width="18" height="18" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
                  </svg>
                </a>
                <a
                  href="https://www.instagram.com/kraftin.entertainment/"
                  target="_blank"
                  rel="noopener"
                  aria-label="Instagram"
                >
                  <svg width="18" height="18" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z" />
                  </svg>
                </a>
                <a
                  href="https://www.linkedin.com/company/kraftin-entertainment/about/?viewAsMember=true"
                  target="_blank"
                  rel="noopener"
                  aria-label="LinkedIn"
                >
                  <svg width="18" height="18" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 01-2.063-2.065 2.064 2.064 0 114.127 0 2.065 2.065 0 01-2.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
                  </svg>
                </a>
                <a
                  href="https://www.youtube.com/@Kraftin.Entertainment"
                  target="_blank"
                  rel="noopener"
                  aria-label="YouTube"
                >
                  <svg width="18" height="18" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M23.498 6.186a3.016 3.016 0 00-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 00.502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 002.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 002.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z" />
                  </svg>
                </a>
              </div>
            </div>
            <div>
              <h4>Services</h4>
              <ul className="footer-links">
                <li><a href="/#services">Corporate Events</a></li>
                <li><a href="/#services">Wedding Planning</a></li>
                <li><a href="/#services">Artist Management</a></li>
                <li><a href="/#services">Concerts</a></li>
                <li><a href="/#services">Exhibition Booth</a></li>
                <li><a href="/#services">Décor Services</a></li>
              </ul>
            </div>
            <div>
              <h4>Quick Links</h4>
              <ul className="footer-links">
                <li><a href="/about-us/">About Us</a></li>
                <li><a href="/our-mentors/">Our Mentors</a></li>
                <li><a href="/our-artists/">Our Artists</a></li>
                <li><a href="/blogs/">Blog</a></li>
                <li><a href="/gallery/">Gallery</a></li>
                <li><a href="/privacy-policy/">Privacy Policy</a></li>
                <li>
                  <a
                    href="https://linktr.ee/kraftinentertainment"
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label="Kraftin Entertainment Linktree"
                  >
                    Linktree
                  </a>
                </li>
              </ul>
            </div>
            <div>
              <h4>Contact</h4>
              <ul className="footer-links">
                <li><a href="mailto:ke@kraftinentertainment.com">ke@kraftinentertainment.com</a></li>
                <li><a href="tel:+919158314519">+91-9158314519</a></li>
                <li>
                  <a
                    href="https://www.instagram.com/kraftin.entertainment/"
                    target="_blank"
                    rel="noopener"
                  >
                    @kraftin.entertainment
                  </a>
                </li>
                <li><a href="/contact-us/">Contact Form</a></li>
              </ul>
            </div>
          </div>
          <div className="footer-bottom">
            <p>&copy; 2025 Kraftin Entertainment. All rights reserved.</p>
            <p>Where We Craft Moments</p>
          </div>
        </div>
      </footer>

      {showWhatsApp ? (
        <a
          href="#"
          className="whatsapp-float"
          target="_blank"
          rel="noopener"
          aria-label="Chat on WhatsApp"
        >
          <svg width="28" height="28" fill="white" viewBox="0 0 24 24">
            <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.435 9.884-9.881 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
          </svg>
        </a>
      ) : null}

      {showLightbox ? (
        <div id="lightbox" className="lightbox" role="dialog" aria-label="Media viewer">
          <button className="lightbox-close" aria-label="Close">
            &times;
          </button>
          <div className="lightbox-content" />
        </div>
      ) : null}

      {/* Legacy defer scripts — must match index.html load order (before DOMContentLoaded). */}
      <script src="https://cdnjs.cloudflare.com/ajax/libs/gsap/3.12.5/gsap.min.js" defer />
      <script src="https://cdnjs.cloudflare.com/ajax/libs/gsap/3.12.5/ScrollTrigger.min.js" defer />
      <script src="/assets/js/main.js" defer />
      {showInstagram ? <script src="/assets/js/instagram-feed.js" defer /> : null}
    </>
  );
}
