import { Route, Routes } from 'react-router-dom'
import { ThemeProvider } from './context/ThemeContext'
import { NewsProvider } from './context/NewsContext'
import { PlayerProvider } from './context/PlayerContext'
import Layout from './components/layout/Layout'
import Home from './pages/Home'
import CategoryPage from './pages/CategoryPage'
import ArticlePage from './pages/ArticlePage'
import TopNewsPage from './pages/TopNewsPage'
import SearchPage from './pages/SearchPage'
import ContactPage from './pages/ContactPage'
import NotFound from './pages/NotFound'

function App() {
  return (
    <ThemeProvider>
      <NewsProvider>
        <PlayerProvider>
          <Routes>
            <Route element={<Layout />}>
              <Route path="/" element={<Home />} />
              <Route path="/news" element={<TopNewsPage />} />
              <Route path="/category/:slug" element={<CategoryPage />} />
              <Route path="/article/:id" element={<ArticlePage />} />
              <Route path="/search" element={<SearchPage />} />
              <Route path="/contact" element={<ContactPage />} />
              <Route path="*" element={<NotFound />} />
            </Route>
          </Routes>
        </PlayerProvider>
      </NewsProvider>
    </ThemeProvider>
  )
}

export default App
