import type { Metadata } from "next";
import { Inter, Outfit,Rubik,Jost,Space_Grotesk } from "next/font/google";

import "./globals.css";
import Navbar from "./components/main/Navbar";
import { UserProvider } from "./providers/UserContext";

const space_grotesk = Space_Grotesk({ subsets: ["latin"] });


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
    <html>
      <body className={space_grotesk.className}>
        {/* <UserProvider> */}
          <div className="flex max-h-screen">
            <Navbar />
            <main className="main-content w-full h-screen overflow-y-scroll">
              {children}
            </main>
          </div>
      {/* </UserProvider> */}

      </body>
    </html>
    // <html lang="en">
    //     <body className={outfit.className}>
    //       {children}
    //       {/* <main className="flex bg-slate-100 ">
    //         <Navbar></Navbar>
    //         <main className="max-h-screen">
    //           {children}  

    //         </main>
    //       </main> */}
    //     </body>

      
    // </html>
  );
}
