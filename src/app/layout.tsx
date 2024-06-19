import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import dynamic from "next/dynamic";
import { UserProvider } from "@/context/user";
// import { PostsProvider } from "@/context/posts";
const inter = Inter({ subsets: ["latin"] });
export const metadata: Metadata = {
  title: "show -> e/acc -> et",
  description: "a show of e/acc from et",
};


// const Navbar = dynamic(() => import("@/components/Navbar"), { ssr: true });

// import { QueryClientProvider } from '@tanstack/react-query'

import ReactQueryPvorider from "@/utils/queryClient";
import Navbar from "@/components/Navbar";
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
