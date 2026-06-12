#!/usr/bin/env node
const fs = require('fs');
const path = require('path');

const root = path.join(__dirname, '..');
const assetsSrc = path.join(root, 'assets');
const publicDir = path.join(root, 'public');
const linkTarget = path.join(publicDir, 'assets');

if (!fs.existsSync(assetsSrc)) {
  console.warn('assets/ not found — skip public link');
  process.exit(0);
}

if (!fs.existsSync(publicDir)) {
  fs.mkdirSync(publicDir, { recursive: true });
}

if (fs.existsSync(linkTarget)) {
  process.exit(0);
}

try {
  fs.symlinkSync(path.relative(publicDir, assetsSrc), linkTarget, 'dir');
  console.log('Linked public/assets → assets/');
} catch {
  fs.cpSync(assetsSrc, linkTarget, { recursive: true });
  console.log('Copied assets/ → public/assets/');
}
