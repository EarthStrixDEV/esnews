import TrendingStrip from '../components/home/TrendingStrip'
import HeroCarousel from '../components/home/HeroCarousel'
import ListenButton from '../components/ui/ListenButton'
import RefreshButton from '../components/ui/RefreshButton'
import { useNews } from '../context/NewsContext'
import AdBanner from '../components/home/AdBanner'
import TopStories from '../components/home/TopStories'
import HackerNewsTrending from '../components/home/HackerNewsTrending'
import WhatsNew from '../components/home/WhatsNew'

function Home() {
  const { articles } = useNews()

  return (
    <>
      <TrendingStrip />
      <div className="mx-auto flex max-w-7xl flex-wrap items-center justify-end gap-3 px-4 pt-6">
        <RefreshButton />
        <ListenButton
          articles={articles}
          label={`Listen to this page · ${articles.length} stories`}
        />
      </div>
      <HeroCarousel />
      <AdBanner />
      <TopStories />
      <HackerNewsTrending />
      <WhatsNew />
    </>
  )
}

export default Home
