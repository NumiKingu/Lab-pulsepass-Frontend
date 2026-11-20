import { Outlet } from 'react-router'
import { Navbar } from './Navbar'
import { Footer } from './Footer'

/** Layout raíz: Navbar + <Outlet/> + Footer, presente en todas las páginas (9.2). */
export function Layout() {
  return (
    <div className="flex min-h-screen flex-col">
      <Navbar />
      <main id="contenido" className="mx-auto w-full max-w-6xl flex-1 px-4 py-8">
        <Outlet />
      </main>
      <Footer />
    </div>
  )
}
