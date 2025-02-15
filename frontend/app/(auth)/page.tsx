import Image from "next/image";
import Hero from "../components/Landing/Hero";
import Features from "../components/Landing/Features";
import CTA from "../components/Landing/CTA";
import UseCase from "../components/Landing/UseCase";
import UseCases from "../components/Landing/UseCases";
import FAQ from "../components/Landing/FAQ";
import Pricing from "../components/Landing/Pricing";

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col ">
      <Hero></Hero>
      <Features></Features>
      <UseCases></UseCases>
      <Pricing></Pricing>
      <FAQ></FAQ>
      <CTA></CTA>
    </main>
  );
}
