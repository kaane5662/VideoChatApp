import type { Metadata } from "next";
import LandingNavbar from "../components/main/LandingNavbar";

export const metadata: Metadata = {
  title: "Create Next App",
  description: "Generated by create next app",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    // <html lang="en">
      <div className="">
        <LandingNavbar></LandingNavbar>
        <div>{children}</div>
        
      </div>
   
  );
}
