import Hero from "./_components/Hero";
import HowItWorks from "./_components/HowItWorks";
import Pricing from "./_components/Pricing";

export default function Home() {
  return (
    <main className="flex flex-1 flex-col">
      <Hero />
      <HowItWorks />
      <Pricing />
    </main>
  );
}
