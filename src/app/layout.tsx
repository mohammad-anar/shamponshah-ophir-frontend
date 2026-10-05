import ScrollToTopButton from "@/components/ui/ScrollToTopButton/ScrollToTopButton";
import { NextUiProvider } from "@/lib/providers/NextUIProvider";
import ReduxProvider from "@/redux/ReduxProvider";
import type { Metadata } from "next";
import { Inter, Plus_Jakarta_Sans } from "next/font/google";
import { Toaster } from "sonner";
import { constructMetadata } from "@/lib/seo";
import "./globals.css";

import { ConfigProvider } from "antd";
import "antd/dist/reset.css";

const jakarta = Plus_Jakarta_Sans({
  subsets: ["latin"],
  variable: "--font-jakarta",
  display: "swap",
  weight: ["300", "400", "500", "600", "700", "800"],
});

const inter = Inter({
  weight: ["300", "400", "500", "600", "700"],
  subsets: ["latin"],
  display: "swap",
  variable: "--font-inter",
});

export const metadata: Metadata = constructMetadata();

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${jakarta.variable} ${inter.variable}`}>
      <body
        suppressHydrationWarning={true}
        className="font-sans antialiased bg-[#F8F9FD] text-[#0F0C3B] selection:bg-[#EDE9FE] selection:text-[#0F0C3B]"
      >
        <NextUiProvider>
          <ReduxProvider>
            <ConfigProvider
              theme={{
                token: {
                  colorPrimary: "#0F0C3B",
                  colorInfo: "#4F46E5",
                  colorSuccess: "#059669",
                  colorWarning: "#F59E0B",
                  colorError: "#DC2626",
                  colorTextBase: "#0F0C3B",
                  colorBgBase: "#FFFFFF",
                  borderRadius: 10,
                  fontSize: 14,
                  lineHeight: 1.5,
                  controlHeight: 42,
                  fontFamily: "var(--font-jakarta), var(--font-inter), sans-serif",
                },
                components: {
                  Button: {
                    colorPrimary: "#0F0C3B",
                    colorPrimaryHover: "#18124E",
                    colorPrimaryActive: "#0A0826",
                    borderRadius: 10,
                    controlHeight: 42,
                  },
                  Input: {
                    colorBorder: "#E2E8F0",
                    hoverBorderColor: "#4F46E5",
                    activeBorderColor: "#0F0C3B",
                    borderRadius: 10,
                  },
                  Select: {
                    colorBorder: "#E2E8F0",
                    hoverBorderColor: "#4F46E5",
                    borderRadius: 10,
                  }
                },
              }}
            >
              <>
                <div className="min-h-screen flex flex-col max-w-[100vw] overflow-x-hidden">
                  {children}
                </div>
                <ScrollToTopButton />
                <Toaster position="top-right" richColors />
              </>
            </ConfigProvider>
          </ReduxProvider>
        </NextUiProvider>
      </body>
    </html>
  );
}


