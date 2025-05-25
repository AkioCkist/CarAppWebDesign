import { Geist, Geist_Mono } from "next/font/google";
import "../../styles/globals.css";
import 'bootstrap-icons/font/bootstrap-icons.css';

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
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        {children}
      </body>
    </html>
  );
}
