import { useEffect } from 'react'
import { Outlet, useLocation } from 'react-router-dom'
import TopBar from './TopBar'
import Navbar from './Navbar'
import Footer from './Footer'
import CustomCursor from '../ui/CustomCursor'
import MiniPlayer from '../ui/MiniPlayer'

function Layout() {
  const { pathname } = useLocation()

  useEffect(() => {
    window.scrollTo(0, 0)
  }, [pathname])

  return (
    <div className="flex min-h-svh flex-col">
      <CustomCursor />
      <TopBar />
      <Navbar />
      <main className="flex-1">
        <Outlet />
      </main>
      <MiniPlayer />
      <Footer />
    </div>
  )
}

export default Layout
