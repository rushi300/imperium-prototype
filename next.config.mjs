const repoName = "imperium-prototype";

const nextConfig = {
  reactStrictMode: true,
  output: "export",
  basePath: `/${repoName}`,
  assetPrefix: `/${repoName}/`,
  images: { unoptimized: true },
};

export default nextConfig;
