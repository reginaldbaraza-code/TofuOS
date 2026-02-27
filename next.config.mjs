/** @type {import('next').NextConfig} */
const nextConfig = {
  /* config options here */
  experimental: {
    // This allows development from origins other than localhost if needed, 
    // and addresses the warning in the issue description.
    allowedDevOrigins: ["localhost:3000"] 
  }
};

export default nextConfig;
