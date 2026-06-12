#!/usr/bin/env node
const fs = require('fs');
const path = require('path');

const root = path.join(__dirname, '..');
const assetsSrc = path.join(root, 'assets');
const publicDir = path.join(root, 'public');
const linkTarget = path.join(publicDir, 'assets');
// Vercel does not serve symlinked public/ files — copy real assets after LFS pull.
const useCopy = Boolean(process.env.VERCEL || process.env.CI);

if (!fs.existsSync(assetsSrc)) {
  console.warn('assets/ not found — skip public link');
  process.exit(0);
}

if (!fs.existsSync(publicDir)) {
  fs.mkdirSync(publicDir, { recursive: true });
}

function removeTarget() {
  if (fs.existsSync(linkTarget)) {
    fs.rmSync(linkTarget, { recursive: true, force: true });
  }
}

if (useCopy) {
  removeTarget();
  fs.cpSync(assetsSrc, linkTarget, { recursive: true });
  console.log('Copied assets/ → public/assets/ (production)');
} else if (fs.existsSync(linkTarget)) {
  process.exit(0);
} else {
  try {
    fs.symlinkSync(path.relative(publicDir, assetsSrc), linkTarget, 'dir');
    console.log('Linked public/assets → assets/');
  } catch {
    fs.cpSync(assetsSrc, linkTarget, { recursive: true });
    console.log('Copied assets/ → public/assets/');
  }
}
