import type { Metadata } from "next";
import { Inter, Outfit,Rubik,Jost,Space_Grotesk, Ubuntu,DM_Sans,Poppins } from "next/font/google";
import "./globals.css";
import { UserProvider } from "./providers/UserContext";
import { ToastContainer } from "react-toastify";
import 'react-toastify/dist/ReactToastify.css';
import './utils/toast.css'
import Script from "next/script";
import dynamic from "next/dynamic";
import AdBanner from "./components/ads/GoogleAdsense";
// const AdBanner = dynamic(() => import("./components/ads/GoogleAdsense"), {
//   ssr: false,
//  });

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
      <head>
        <Script
          async
          src={`https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-4540090412686189`}
          strategy="lazyOnload"
          crossOrigin="anonymous"
          data-first-party-cookies="true"

        />
      </head>
      <body className={` max-top bg-complementary text-primary ${poppins.className}`}>
        {/* <AdBanner data-full-width-responsive="true" data-ad-format="display"  data-ad-slot="0000000000"></AdBanner> */}
      
        <ToastContainer></ToastContainer>
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
