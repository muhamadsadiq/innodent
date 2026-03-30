"use client";

import { usePathname } from "next/navigation";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import TopBar from "@/components/TopBar";

export default function LayoutWrapper({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const isAdmin = pathname?.startsWith("/admin");

  if (isAdmin) {
    return <>{children}</>;
  }

  return (
    <>
      <TopBar
        leftText="innodent.korea@gmail.com"
        rightText="5F 514, 15, Haeyang 3-ro, Sangnok-gu, Ansan-si, Gyeonggi-do, Korea"
      />
      <Navbar />
      <main className="min-h-screen">{children}</main>
      <Footer />
      <TopBar
        leftText={
          <>
            &copy; <span className="font-bold">2026</span> Innodent • Developed by Neovaly
          </>
        }
      />
    </>
  );
}

