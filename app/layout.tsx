import type { Metadata, Viewport } from "next";
import type { ReactNode } from "react";
import "./globals.css";

export const metadata: Metadata = {
  metadataBase: new URL("https://www.metaconceptualart.com"),
  title: {
    default: "Metaconceptual Art",
    template: "%s | Metaconceptual Art",
  },
  description:
    "Metaconceptual Art is Art. Art about Art. A living proposition set, museum system, and conceptual archive.",
  icons: { icon: "/images/8sprocket.jpg" },
  openGraph: {
    type: "website",
    siteName: "Metaconceptual Art",
    url: "https://www.metaconceptualart.com",
    title: "Metaconceptual Art",
    description:
      "Metaconceptual Art is Art. Art about Art. A living proposition set, museum system, and conceptual archive.",
    images: [
      {
        url: "/images/artmarketreform.jpg",
        width: 2048,
        height: 1454,
        alt: "Art Market Reform",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Metaconceptual Art",
    description:
      "Metaconceptual Art is Art. Art about Art. A living proposition set, museum system, and conceptual archive.",
    images: ["/images/artmarketreform.jpg"],
  },
};

export const viewport: Viewport = {
  themeColor: "#11437e",
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
