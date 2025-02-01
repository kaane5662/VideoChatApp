import { Metadata } from "next";
import PlatformNavbar from "../components/main/PlatformNavbar";

  
export default function PlatformLayout({
    children,
  }: Readonly<{
    children: React.ReactNode;
  }>) {
    return (
      
          
        <div className="flex max-h-screen">
            <PlatformNavbar/>
            <main className="main-content w-full h-screen overflow-y-scroll ">
                {children}
            </main>
        </div>
        
    );
  }