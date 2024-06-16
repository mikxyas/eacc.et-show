import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import Navbar from "@/components/Navbar";
import { UserProvider } from "@/context/user";
import { PostsProvider } from "@/context/posts";
const inter = Inter({ subsets: ["latin"] });
export const metadata: Metadata = {
  title: "show -> e/acc -> et",
  description: "a show of e/acc from et",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <UserProvider>
          <PostsProvider>
            <Navbar />
            {children}
          </PostsProvider>

        </UserProvider>

      </body>
    </html>
  );
}
