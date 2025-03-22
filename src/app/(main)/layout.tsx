"use client";
import Footer from "@/components/Footer";
import Header from "@/components/Header";

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <div className="bg-[#080f1c]">
      <Header />
      <p className="w-full h-[1px] bg-white"></p>
      {children}
      <Footer />
    </div>
  );
}
