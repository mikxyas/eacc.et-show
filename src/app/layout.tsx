import type { Metadata, Viewport } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import dynamic from "next/dynamic";
import { UserProvider } from "@/context/user";
// import { PostsProvider } from "@/context/posts";
const inter = Inter({ subsets: ["latin"], weight: ['400', '500'] });
// export const metadata: Metadata = {
//   title: "Hacker News 🇪🇹",
//   description: "⚡⚡⚡",
// };
const APP_NAME = "Hacker News 🇪🇹";
const APP_DEFAULT_TITLE = "Hacker News 🇪🇹";
const APP_TITLE_TEMPLATE = "%s - Hacker News 🇪🇹";
const APP_DESCRIPTION = "⚡⚡⚡";

export const metadata: Metadata = {
  applicationName: APP_NAME,
  title: {
    default: APP_DEFAULT_TITLE,
    template: APP_TITLE_TEMPLATE,
  },
  description: APP_DESCRIPTION,
  appleWebApp: {
    capable: true,
    statusBarStyle: "default",
    title: APP_DEFAULT_TITLE,
    // startUpImage: [],
  },
  formatDetection: {
    telephone: false,
  },
  openGraph: {
    type: "website",
    siteName: APP_NAME,
    title: {
      default: APP_DEFAULT_TITLE,
      template: APP_TITLE_TEMPLATE,
    },
    description: APP_DESCRIPTION,
  },
  twitter: {
    card: "summary",
    title: {
      default: APP_DEFAULT_TITLE,
      template: APP_TITLE_TEMPLATE,
    },
    description: APP_DESCRIPTION,
  },
};

export const viewport: Viewport = {
  themeColor: "#1d1d1d",
}

const Navbar = dynamic(() => import("@/components/Navbar"), { ssr: true });

// import { QueryClientProvider } from '@tanstack/react-query'

import ReactQueryPvorider from "@/utils/queryClient";

// import Navbar from "@/components/Navbar";
export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>, pageProps: any) {
  return (

    <html lang="en">
      
      <body className={inter.className}>

        <UserProvider>
          {/* <PostsProvider> */}
          <ReactQueryPvorider >
 
            <Navbar />
            {children}
          </ReactQueryPvorider>
          {/* </PostsProvider> */}
        </UserProvider>
      </body>
    </html>

  );
}
