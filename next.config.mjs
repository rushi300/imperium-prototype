const repoName = "imperium-prototype";
const basePath = `/${repoName}`;

const nextConfig = {
  reactStrictMode: true,
  output: "export",
  basePath,
  assetPrefix: `${basePath}/`,
  images: { unoptimized: true },
  env: { NEXT_PUBLIC_BASE_PATH: basePath },
};

export default nextConfig;
