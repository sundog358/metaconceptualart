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

// Set the theme before first paint so there is no light/dark flash. Reads a
// saved choice, else the OS preference.
const themeInit = `(function(){try{var t=localStorage.getItem('theme');if(t!=='light'&&t!=='dark'){t=window.matchMedia('(prefers-color-scheme: dark)').matches?'dark':'light';}document.documentElement.setAttribute('data-theme',t);}catch(e){}})();`;

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{ __html: themeInit }} />
      </head>
      <body>
        <a className="skip-link" href="#main-content">
          Skip to content
        </a>
        {children}
      </body>
    </html>
  );
}
