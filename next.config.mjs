/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  env: {
    // Expose a public flag so client components know whether Claude is wired up.
    // Value is "1" when ANTHROPIC_API_KEY is present, else "0".
    NEXT_PUBLIC_CLAUDE_ACTIVE: process.env.ANTHROPIC_API_KEY ? "1" : "0",
  },
};

export default nextConfig;
