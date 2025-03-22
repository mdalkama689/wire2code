import type { NextConfig } from "next";

const nextConfig: NextConfig = {
images: {
    remotePatterns: [
        {
            hostname: "res.cloudinary.com",
            port: "",
            pathname: "/**",
            protocol: 'https'
        }
    ]
}
};


export default nextConfig;
