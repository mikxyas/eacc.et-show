/** @type {import('next').NextConfig} */

import withSerwistInit from "@serwist/next";
const revision = crypto.randomUUID();
const withSerwist = withSerwistInit({
    // Note: This is only an example. If you use Pages Router,
    // use something else that works, such as "service-worker/index.ts".
    swSrc: "app/sw.ts",
    swDest: "public/sw.js",
    fallbacks: {
        entries: [
            {
                url: '/offline',
                revision: '1',
                matcher({ request }) {
                    return request.destination === 'document';
                },
            },
        ],
    },
});
const nextConfig = {
    transpilePackages: ['lucide-react'],
};

export default nextConfig;
