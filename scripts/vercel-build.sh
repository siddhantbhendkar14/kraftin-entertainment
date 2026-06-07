#!/usr/bin/env bash
set -euo pipefail

# Replace Git LFS pointer files with actual video binaries before deploy.
if ! command -v git-lfs >/dev/null 2>&1; then
  echo "Error: git-lfs is required to deploy video assets." >&2
  exit 1
fi

git lfs install --local
git lfs pull

# Fail the build if any referenced MP4 is still an LFS pointer.
python3 << 'PY'
from pathlib import Path
bad = []
for path in Path('assets').rglob('*.mp4'):
    head = path.read_bytes()[:20]
    if head.startswith(b'version https://git-'):
        bad.append(str(path))
if bad:
    print('Error: LFS pointers remain after git lfs pull:', bad[:5], file=__import__('sys').stderr)
    raise SystemExit(1)
print(f'Verified {sum(1 for _ in Path("assets").rglob("*.mp4"))} MP4 files are binary-ready.')
PY
