/**
 * Kraftin Instagram Feed — masonry, motion-first
 * Priority: Live API → Cached JSON → Local fallback
 */
(function () {
  const CONFIG = {
    profile: 'https://www.instagram.com/kraftin.entertainment/',
    jsonPath: '/assets/data/instagram-feed.json',
    apiEndpoint: '/api/instagram',
    minPosts: 8,
    maxPosts: 12,
    refreshMs: 30 * 60 * 1000,
    skeletonCount: 10
  };

  const TYPE_PRIORITY = { reel: 0, video: 1, carousel: 2, image: 3 };

  const FALLBACK_POSTS = [
    { id: 'fb-reel-01', type: 'reel', video: '/assets/extracted/videos/ring/78597.mp4', thumbnail: '/assets/extracted/photos/77817.jpg', link: CONFIG.profile },
    { id: 'fb-reel-02', type: 'reel', video: '/assets/extracted/videos/ring/78599.mp4', thumbnail: '/assets/extracted/photos/77820.jpg', link: CONFIG.profile },
    { id: 'fb-reel-03', type: 'reel', video: '/assets/extracted/videos/mayra/78603.mp4', thumbnail: '/assets/extracted/photos/77821.jpg', link: CONFIG.profile },
    { id: 'fb-video-01', type: 'video', video: '/assets/extracted/videos/mayra/78612.mp4', thumbnail: '/assets/extracted/photos/77836.jpg', link: CONFIG.profile },
    { id: 'fb-photo-01', type: 'image', image: '/assets/images/social/whatsapp-image-2026-06-05-at-7.12.56-pm.jpeg', link: CONFIG.profile },
    { id: 'fb-photo-02', type: 'image', image: '/assets/images/social/whatsapp-image-2026-06-05-at-7.12.58-pm.jpeg', link: CONFIG.profile },
    { id: 'fb-photo-03', type: 'image', image: '/assets/images/social/whatsapp-image-2026-06-05-at-7.13.00-pm.jpeg', link: CONFIG.profile },
    { id: 'fb-photo-04', type: 'image', image: '/assets/images/social/whatsapp-image-2026-06-05-at-7.14.16-pm.jpeg', link: CONFIG.profile },
    { id: 'fb-photo-05', type: 'image', image: '/assets/images/social/whatsapp-image-2026-06-05-at-7.14.26-pm.jpeg', link: CONFIG.profile },
    { id: 'fb-photo-06', type: 'image', image: '/assets/images/social/whatsapp-image-2026-06-05-at-7.14.58-pm.jpeg', link: CONFIG.profile }
  ];

  const IG_ICON = '<svg class="insta-icon" width="28" height="28" fill="white" viewBox="0 0 24 24" aria-hidden="true"><path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z"/></svg>';

  let isLoading = false;
  let refreshTimer = null;

  function escapeHtml(str) {
    return String(str)
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;');
  }

  function normalizePost(post) {
    const type = (post.type || post.media_type || 'image').toLowerCase();
    const mappedType = type === 'reels' ? 'reel' : type === 'carousel_album' ? 'carousel' : type;
    const resolvedType = ['reel', 'video', 'carousel', 'image'].includes(mappedType) ? mappedType : 'image';
    const isMotion = resolvedType === 'reel' || resolvedType === 'video';

    return {
      id: post.id || post.pk || '',
      type: resolvedType,
      video: isMotion ? (post.video || post.media_url || '') : (post.video || ''),
      image: post.image || post.thumbnail || post.thumbnail_url || (!isMotion ? post.media_url || '' : ''),
      thumbnail: post.thumbnail || post.thumbnail_url || post.image || '',
      link: post.link || post.permalink || CONFIG.profile
    };
  }

  function mediaKey(post) {
    return post.id || post.video || post.image || post.thumbnail;
  }

  function dedupePosts(posts) {
    const seen = new Set();
    return posts.filter(post => {
      const key = mediaKey(post);
      if (!key || seen.has(key)) return false;
      seen.add(key);
      return Boolean(post.video || post.image);
    });
  }

  function sortByPriority(posts) {
    return [...posts].sort((a, b) => {
      const pa = TYPE_PRIORITY[a.type] ?? 9;
      const pb = TYPE_PRIORITY[b.type] ?? 9;
      return pa - pb;
    });
  }

  function renderSkeleton(count) {
    return Array.from({ length: count }, (_, i) => {
      const tall = i % 3 === 1 ? ' insta-skeleton--reel' : '';
      return `<div class="insta-skeleton${tall}" aria-hidden="true"><div class="insta-skeleton-shimmer"></div></div>`;
    }).join('');
  }

  function renderMedia(post, index) {
    const isMotion = post.type === 'reel' || post.type === 'video';
    if (isMotion && post.video) {
      const poster = escapeHtml(post.thumbnail || post.image);
      const src = escapeHtml(post.video);
      const preload = index < 2 ? 'auto' : 'none';
      const dataSrc = index < 2 ? '' : ` data-src="${src}"`;
      const videoSrc = index < 2 ? ` src="${src}"` : '';
      return `<video${videoSrc}${dataSrc} poster="${poster}" muted loop playsinline preload="${preload}" width="400" height="711" data-insta-video aria-hidden="true"></video>`;
    }

    const src = escapeHtml(post.image || post.thumbnail);
    const eager = index < 4 ? 'eager' : 'lazy';
    return `<img src="${src}" alt="" width="400" height="400" loading="${eager}" decoding="async" data-insta-img>`;
  }

  function renderInstagramFeed(posts) {
    return posts.map((raw, index) => {
      const post = normalizePost(raw);
      const href = escapeHtml(post.link);
      const isReel = post.type === 'reel' || post.type === 'video';
      const reelClass = isReel ? ' insta-item--reel' : '';
      const tallClass = index % 3 === 1 && !isReel ? ' insta-item--tall' : '';

      return `<a href="${href}" target="_blank" rel="noopener noreferrer" class="insta-item insta-item--masonry${reelClass}${tallClass}" aria-label="View @kraftin.entertainment on Instagram">
        ${renderMedia(post, index)}
        <div class="insta-item-border" aria-hidden="true"></div>
        <div class="insta-item-overlay">${IG_ICON}</div>
      </a>`;
    }).join('');
  }

  function loadFallbackFeed() {
    return FALLBACK_POSTS.map(normalizePost);
  }

  function mapApiPosts(data) {
    if (Array.isArray(data)) return data.map(normalizePost);
    if (data?.data) {
      return data.data.map(p => {
        const type = (p.media_type || '').toLowerCase();
        if (type === 'video' || type === 'reels') {
          return normalizePost({
            id: p.id,
            type: type === 'reels' ? 'reel' : 'video',
            video: p.media_url,
            thumbnail: p.thumbnail_url,
            link: p.permalink
          });
        }
        if (type === 'carousel_album') {
          return normalizePost({
            id: p.id,
            type: 'carousel',
            image: p.media_url || p.thumbnail_url,
            thumbnail: p.thumbnail_url,
            link: p.permalink
          });
        }
        return normalizePost({
          id: p.id,
          type: 'image',
          image: p.media_url,
          thumbnail: p.thumbnail_url,
          link: p.permalink
        });
      });
    }
    return (data.posts || []).map(normalizePost);
  }

  async function fetchApiFeed() {
    const res = await fetch(CONFIG.apiEndpoint, { headers: { Accept: 'application/json' } });
    if (!res.ok) throw new Error('API unavailable');
    const data = await res.json();
    return mapApiPosts(data).filter(p => p.video || p.image);
  }

  async function fetchJsonFeed() {
    const res = await fetch(`${CONFIG.jsonPath}?t=${Date.now()}`, {
      headers: { Accept: 'application/json' }
    });
    if (!res.ok) throw new Error('JSON unavailable');
    const data = await res.json();
    const posts = Array.isArray(data) ? data : (data.posts || []);
    return posts.map(normalizePost).filter(p => p.video || p.image);
  }

  async function resolveFeedPosts() {
    let posts = [];

    try {
      posts = await fetchApiFeed();
    } catch {
      posts = [];
    }

    if (posts.length < CONFIG.minPosts) {
      try {
        const jsonPosts = await fetchJsonFeed();
        if (jsonPosts.length) {
          posts = dedupePosts([...posts, ...jsonPosts]);
        }
      } catch {
        /* silent */
      }
    }

    if (!posts.length) posts = loadFallbackFeed();

    return sortByPriority(dedupePosts(posts)).slice(0, CONFIG.maxPosts);
  }

  function hydrateLazyVideos(container) {
    const videos = container.querySelectorAll('video[data-src]');
    if (!videos.length || !('IntersectionObserver' in window)) {
      videos.forEach(v => {
        if (v.dataset.src) {
          v.src = v.dataset.src;
          v.removeAttribute('data-src');
        }
      });
      return;
    }

    const observer = new IntersectionObserver((entries, obs) => {
      entries.forEach(entry => {
        if (!entry.isIntersecting) return;
        const video = entry.target;
        if (video.dataset.src) {
          video.src = video.dataset.src;
          video.removeAttribute('data-src');
          video.load();
        }
        obs.unobserve(video);
      });
    }, { rootMargin: '160px' });

    videos.forEach(video => observer.observe(video));
  }

  async function paintFeed(container) {
    if (isLoading) return;
    isLoading = true;

    try {
      const posts = await resolveFeedPosts();
      container.classList.remove('instagram-masonry--loading');
      container.innerHTML = renderInstagramFeed(posts);
      container.setAttribute('aria-busy', 'false');
      hydrateLazyVideos(container);

      if (typeof window.registerViewportVideos === 'function') {
        window.registerViewportVideos(container.querySelectorAll('.insta-item video'));
      }
    } finally {
      isLoading = false;
    }
  }

  function initInstagramFeed() {
    const container = document.getElementById('instagram-feed-grid');
    if (!container) return;

    if (!container.children.length) {
      container.classList.add('instagram-masonry--loading');
      container.setAttribute('aria-busy', 'true');
      container.innerHTML = renderSkeleton(CONFIG.skeletonCount);
    }

    paintFeed(container);

    if (!refreshTimer) {
      refreshTimer = setInterval(() => paintFeed(container), CONFIG.refreshMs);
    }
  }

  window.initInstagramFeed = initInstagramFeed;
  window.renderInstagramFeed = renderInstagramFeed;
  window.loadFallbackFeed = loadFallbackFeed;

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initInstagramFeed);
  } else {
    initInstagramFeed();
  }
})();
