import { MotionConfig } from 'motion/react'
import { AppProvider } from './context/AppContext'
import { Navbar } from './components/sections/Navbar'
import { Hero } from './components/sections/Hero'
import { Workshop } from './components/sections/Workshop'
import { Services } from './components/sections/Services'
import { Diagnostic } from './components/diagnostic/Diagnostic'
import { Process } from './components/sections/Process'
import { BeforeAfter } from './components/sections/BeforeAfter'
import { Trust } from './components/sections/Trust'
import { Booking } from './components/sections/Booking'
import { Faq } from './components/sections/Faq'
import { Contact } from './components/sections/Contact'
import { Footer } from './components/sections/Footer'

export default function App() {
  return (
    <MotionConfig reducedMotion="user">
      <AppProvider>
        <Navbar />
        <main id="conteudo" tabIndex={-1}>
          <Hero />
          <Workshop />
          <Services />
          <Diagnostic />
          <Process />
          <BeforeAfter />
          <Trust />
          <Booking />
          <Faq />
          <Contact />
        </main>
        <Footer />
      </AppProvider>
    </MotionConfig>
  )
}
