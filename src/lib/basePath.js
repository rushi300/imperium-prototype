// Next's `images.unoptimized` mode (required for static export — GitHub Pages
// has no server to run the image optimizer) does not apply `basePath` to
// <img> src itself, only to scripts/styles. So local image paths are prefixed
// by hand here, from the same value next.config.mjs sets as basePath.
export const BASE_PATH = process.env.NEXT_PUBLIC_BASE_PATH || "";
export const withBase = (path) => `${BASE_PATH}${path}`;
