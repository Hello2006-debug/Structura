import Navbar from "@/components/Navbar";
import Hero from '@/components/landing/Hero'
import StructureGrid from '@/components/landing/StructuresGrid'
import About from '@/components/landing/About'
import Footer from '@/components/landing/Footer'


export default function Home() {
  return (
    <main>
      <Navbar />
      <Hero />
      <div id="about">
        <About />
      </div>
      <div id="structures">
        <StructureGrid />
      </div>
      <Footer />
    </main>
  )
}