import Image from "next/image";
import Hero from "../components/Landing/Hero";
import Features from "../components/Landing/Features";
import CTA from "../components/Landing/CTA";
import UseCase from "../components/Landing/UseCase";
import UseCases from "../components/Landing/UseCases";

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col text-secondary bg-complementary">
      <Hero></Hero>
      <Features></Features>
      <UseCases></UseCases>
      <CTA></CTA>
    </main>
  );
}
