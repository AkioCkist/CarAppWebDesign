import { Geist, Geist_Mono } from "next/font/google";
import "../../styles/globals.css";
import ClientLayout from "../../components/ClientLayout";
import Script from "next/script";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata = {
  title: "Whale Xe",
  description: "Chúng tôi là Whale Xe, một dịch vụ cho thuê xe tự lái tại Đà Nẵng",
  icons: {
    icon: "/favicon.ico",
  },
  // Cập nhật mã xác minh Google Search Console tại đây
  verification: {
    google: "MÃ_XÁC_MINH_CỦA_BẠN", // THAY THẾ CHÍNH XÁC MÃ XÁC MINH TỪ GOOGLE SEARCH CONSOLE
  },
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <head>
        {/* Google Tag Script */}
        <Script
          src="https://www.googletagmanager.com/gtag/js?id=G-M6FED393ST"
          strategy="afterInteractive"
        />
        <Script id="google-analytics" strategy="afterInteractive">
          {`
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', 'G-M6FED393ST');
          `}
        </Script>
      </head>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
        suppressHydrationWarning
      >
        <ClientLayout>
          {children}
        </ClientLayout>
      </body>
    </html>
  );
}