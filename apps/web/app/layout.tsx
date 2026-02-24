import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import Providers from "@/components/providers";
import { WebSocketProvider } from "@/components/websocket-provider";
import { Toaster, DonationNotificationListener, UserActivityNotifications } from "@/components/ui/toaster";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Altrue Global Dashboard",
  description: "Manage your impact with Altrue Global",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <Providers>
          <WebSocketProvider>
            {children}
            <Toaster />
            <DonationNotificationListener />
            <UserActivityNotifications />
          </WebSocketProvider>
        </Providers>
      </body>
    </html>
  );
}
