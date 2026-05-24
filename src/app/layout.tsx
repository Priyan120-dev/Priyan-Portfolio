import type { Metadata } from "next";
import { Inter, Orbitron, Rajdhani } from "next/font/google";
import "./globals.css";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  display: "swap",
});

const orbitron = Orbitron({
  variable: "--font-orbitron",
  subsets: ["latin"],
  display: "swap",
});

const rajdhani = Rajdhani({
  variable: "--font-rajdhani",
  weight: ["400", "500", "600", "700"],
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "PRIYAN I | Shadow Monarch AI & Data Science Engineer",
  description: "AI & Data Science Engineer portfolio website styled as a futuristic Solo Leveling Shadow Monarch system interface. Explore abilities, dungeons cleared, and join the guild.",
  keywords: ["Priyan I", "AI Engineer", "Data Science", "Web Developer", "IoT Innovator", "Solo Leveling Portfolio", "Shadow Monarch UI"],
  authors: [{ name: "Priyan I" }],
  openGraph: {
    title: "PRIYAN I | Shadow Monarch AI Engineer",
    description: "Futuristic developer portfolio showcasing AI development, frontend engineering, IoT, and cybersecurity.",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${inter.variable} ${orbitron.variable} ${rajdhani.variable} dark scroll-smooth h-full`}
    >
      <body className="bg-monarch-darker text-slate-100 min-h-full font-sans antialiased selection:bg-monarch-purple selection:text-white">
        {children}
      </body>
    </html>
  );
}
