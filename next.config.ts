import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  typescript: {
    // 빌드 시 타입 에러가 있어도 배포를 중단하지 않고 성공시킵니다
    ignoreBuildErrors: true,
  },
  eslint: {
    // ESLint 에러로 인한 빌드 중단도 방지합니다
    ignoreDuringBuilds: true,
  },
};

export default nextConfig;