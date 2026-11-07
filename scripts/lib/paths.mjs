import path from 'node:path';
import { fileURLToPath } from 'node:url';

// The folder that contains package.json, config/, content/ and so on.
export const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..', '..');

export const CONTENT_DIR = path.join(ROOT, 'content');
export const PUBLIC_DIR = path.join(ROOT, 'public');
export const DEFAULT_OUT = path.join(ROOT, 'dist');

export const toPosix = (p) => p.split(path.sep).join('/');
export const relative = (p) => toPosix(path.relative(ROOT, p));
