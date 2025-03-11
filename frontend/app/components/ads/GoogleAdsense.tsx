"use client"
import Router from "next/router";
import { useEffect, useRef } from "react";
declare global {
 interface Window {
  adsbygoogle: unknown[];
 }
}

interface AdsBannerProps {
 "data-ad-slot": string;
 "data-ad-format": string;
 "data-full-width-responsive": string;
 "data-ad-layout"?: string;
}

const AdBanner = (props: AdsBannerProps) => {
    const adLoaded = useRef(false);

    useEffect(() => {
      if (typeof window !== "undefined" && window.adsbygoogle && !adLoaded.current) {
        window.adsbygoogle.push({
            google_adtest: "on", // Enables test mode (prevents invalid clicks)

        });
        
        adLoaded.current = true; // Prevent multiple ad pushes
      }
    }, []); 

 return (
  <ins
   className=" adbanner-customize mt-2 border-2 h-[500px] w-[400px] fixed self-center top-0 z-[10000000]"
   style={{ display: "block", textAlign: "center", margin: "20px 0" }}

   data-adtest="on"
   data-ad-client={"ca-pub-3940256099942544"}
   {...props}
  />
 );
};
export default AdBanner;