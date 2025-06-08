import { Geist, Geist_Mono } from "next/font/google";
import "../../styles/globals.css";
import ClientLayout from "../../components/ClientLayout";
import Script from "next/script";
import AuthProvider from "../../components/AuthProvider"; // Import the AuthProvider

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
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <head>
        <meta name="google-site-verification" content="SCx4W1SgYOB--s-ZGHDB69wRC-SghAPXpiEQZv2l-kc" />
        
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
        <AuthProvider> {/* Wrap your ClientLayout with AuthProvider */}
          <ClientLayout>
            {children}
          </ClientLayout>
        </AuthProvider>
      </body>
    </html>
  );
}