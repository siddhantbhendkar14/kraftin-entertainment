#!/usr/bin/env bash
set -euo pipefail

# Pull Git LFS media for public/assets videos
if command -v git-lfs >/dev/null 2>&1; then
  git lfs install --local
  git lfs pull
fi

VERCEL=1 node scripts/link-public-assets.js

if [ ! -f public/assets/css/main.css ] || [ ! -f public/assets/js/main.js ]; then
  echo "Error: public/assets missing CSS/JS after copy" >&2
  exit 1
fi

# Verify MP4 binaries if LFS pull ran
if command -v git-lfs >/dev/null 2>&1; then
  python3 << 'PY'
from pathlib import Path
bad = []
for path in Path('assets').rglob('*.mp4'):
    head = path.read_bytes()[:20]
    if head.startswith(b'version https://git-'):
        bad.append(str(path))
if bad:
    print('Error: LFS pointers remain:', bad[:3], file=__import__('sys').stderr)
    raise SystemExit(1)
PY
fi

npm run build
