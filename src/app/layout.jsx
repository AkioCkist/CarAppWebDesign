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
  title: "Whale Xe - More than rentals, We deliver happiness",
  description: "Whale Xe là dịch vụ cho thuê xe tự lái tại Hà Nội, Đà Nẵng, Hồ Chí Minh với hơn 500 xe các loại. More than rentals, We deliver happiness.",
  icons: {
    icon: "/favicon.ico",
  },
  // Open Graph metadata for social media sharing
  openGraph: {
    title: "Whale Xe - Thuê xe tự lái tại Hà Nội, Đà Nẵng, Hồ Chí Minh",
    description: "Whale Xe là dịch vụ cho thuê xe tự lái hàng đầu tại Hà Nội, Đà Nẵng, Hồ Chí Minh với hơn 500 xe các loại. More than rentals, We deliver happiness.",
    url: "https://car-ap-web-design.vercel.app/", // URL thực tế của trang web của bạn
    siteName: "Whale Xe",
    images: [
      {
        url: "https://car-ap-web-design.vercel.app/logo/logo.webp", // Đường dẫn tuyệt đối đến logo của bạn
        width: 1200, // Kích thước khuyến nghị cho Open Graph image
        height: 630, // Kích thước khuyến nghị cho Open Graph image
        alt: "Whale Xe Logo - Cho thuê xe tự lái Hà Nội, Đà Nẵng, Hồ Chí Minh",
      },
    ],
    locale: "vi_VN",
    type: "website",
  },
  // Twitter Card metadata for Twitter sharing
  twitter: {
    card: "summary_large_image",
    title: "Whale Xe - Thuê xe tự lái tại Hà Nội, Đà Nẵng, Hồ Chí Minh",
    description: "Whale Xe là dịch vụ cho thuê xe tự lái hàng đầu tại Hà Nội, Đà Nẵng, Hồ Chí Minh với hơn 500 xe các loại. More than rentals, We deliver happiness.",
    creator: "@your_twitter_handle", // (Tùy chọn) Twitter handle của bạn
    images: ["https://car-ap-web-design.vercel.app/logo/logo.webp"], // Đường dẫn tuyệt đối đến logo của bạn
  },
};

export default function RootLayout({ children }) {
  return (
    <html lang="vi">
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
        <AuthProvider>
          <ClientLayout>
            {children}
          </ClientLayout>
        </AuthProvider>
      </body>
    </html>
  );
}