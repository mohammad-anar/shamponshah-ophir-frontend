import ScrollToTopButton from "@/components/ui/ScrollToTopButton/ScrollToTopButton";
import { NextUiProvider } from "@/lib/providers/NextUIProvider";
import ReduxProvider from "@/redux/ReduxProvider";
import type { Metadata } from "next";
import { Inter, Plus_Jakarta_Sans, Cinzel, Cormorant_Garamond } from "next/font/google";
import { Toaster } from "sonner";
import { constructMetadata } from "@/lib/seo";
import "./globals.css";

import { ConfigProvider, theme as antdTheme } from "antd";
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

const cinzel = Cinzel({
  weight: ["400", "500", "600", "700", "800", "900"],
  subsets: ["latin"],
  display: "swap",
  variable: "--font-cinzel",
});

const cormorant = Cormorant_Garamond({
  weight: ["300", "400", "500", "600", "700"],
  subsets: ["latin"],
  display: "swap",
  variable: "--font-serif",
});

export const metadata: Metadata = constructMetadata();

export const viewport = {
  themeColor: "#0B0C0E",
  colorScheme: "dark" as const,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${jakarta.variable} ${inter.variable} ${cinzel.variable} ${cormorant.variable}`}>
      <body
        suppressHydrationWarning={true}
        className="font-sans antialiased bg-background text-foreground selection:bg-brand/30 selection:text-brand"
      >
        <NextUiProvider>
          <ReduxProvider>
            <ConfigProvider
              theme={{
                algorithm: antdTheme.darkAlgorithm,
                token: {
                  colorPrimary: "#DFB76C",
                  colorInfo: "#DFB76C",
                  colorSuccess: "#10B981",
                  colorWarning: "#F59E0B",
                  colorError: "#EF4444",
                  colorTextBase: "#F3F4F6",
                  colorBgBase: "#0B0C0E",
                  borderRadius: 0,
                  fontSize: 14,
                  lineHeight: 1.5,
                  controlHeight: 42,
                  fontFamily: "var(--font-jakarta), var(--font-inter), sans-serif",
                },
                components: {
                  Button: {
                    colorPrimary: "#DFB76C",
                    colorPrimaryHover: "#ECC870",
                    colorPrimaryActive: "#B8934A",
                    colorTextLightSolid: "#0B0C0E",
                    borderRadius: 0,
                    controlHeight: 42,
                  },
                  Input: {
                    colorBorder: "#262930",
                    hoverBorderColor: "#DFB76C",
                    activeBorderColor: "#DFB76C",
                    colorBgContainer: "#121418",
                    colorText: "#F3F4F6",
                    borderRadius: 0,
                  },
                  Select: {
                    colorBorder: "#262930",
                    hoverBorderColor: "#DFB76C",
                    colorBgContainer: "#121418",
                    colorText: "#F3F4F6",
                    borderRadius: 0,
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


