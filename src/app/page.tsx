import Nav from "@/components/Nav";
import Hero from "@/components/Hero";
import Work from "@/components/Work";
import About from "@/components/About";
import Skills from "@/components/Skills";
import Contact from "@/components/Contact";
import Footer from "@/components/Footer";
import ScrollReveal from "@/components/ScrollReveal";
import ScrollHUD from "@/components/ScrollHUD";
import SmoothScroll from "@/components/SmoothScroll";

export default function HomePage() {
  return (
    <>
      <SmoothScroll />
      <Nav />
      <ScrollHUD />
      <main className="flex-1">
        <Hero />
        <Work />
        <About />
        <Skills />
        <Contact />
      </main>
      <Footer />
      <ScrollReveal />
    </>
  );
}
