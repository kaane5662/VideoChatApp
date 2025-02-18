import type { Metadata } from "next";
import { Inter, Outfit,Rubik,Jost,Space_Grotesk, Ubuntu,DM_Sans,Poppins } from "next/font/google";

import "./globals.css";
import { UserProvider } from "./providers/UserContext";

const poppins = Poppins({ subsets: ["latin"],weight:"400" });


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
      <body className={` max-top bg-complementary text-primary ${poppins.className}`}>
        {/* <UserProvider> */}
          {children}
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
