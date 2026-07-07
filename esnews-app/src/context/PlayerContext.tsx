/* eslint-disable react-refresh/only-export-components */
import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
  type ReactNode,
} from 'react'
import type { Article } from '../data/articles'

export interface Track {
  articleId: string
  title: string
  text: string
}

type Status = 'idle' | 'playing' | 'paused'

interface PlayerContextValue {
  supported: boolean
  status: Status
  tracks: Track[]
  index: number
  rate: number
  playArticles: (articles: Article[], startIndex?: number) => void
  toggle: () => void
  next: () => void
  prev: () => void
  cycleRate: () => void
  stop: () => void
}

const PlayerContext = createContext<PlayerContextValue | null>(null)

const RATES = [1, 1.2, 1.5]

function toTrack(a: Article): Track {
  return {
    articleId: a.id,
    title: a.title,
    text: `${a.title}. ${a.content.join(' ')}`,
  }
}

/**
 * Speak sentence-by-sentence instead of one giant utterance — Chrome silently
 * kills long utterances, and short chunks make pause/skip/rate-change reliable.
 */
function splitSentences(text: string): string[] {
  return (
    text
      .match(/[^.!?]+[.!?]+["')\]]?|[^.!?]+$/g)
      ?.map((s) => s.trim())
      .filter(Boolean) ?? [text]
  )
}

export function PlayerProvider({ children }: { children: ReactNode }) {
  const supported =
    typeof window !== 'undefined' && 'speechSynthesis' in window

  const [status, setStatus] = useState<Status>('idle')
  const [tracks, setTracks] = useState<Track[]>([])
  const [index, setIndex] = useState(0)
  const [rate, setRate] = useState(1)

  // playback engine lives in a ref: utterance callbacks must always see the
  // latest position without re-creating closures. `gen` invalidates stale
  // onend/onerror handlers after any cancel (skip, stop, rate change).
  const engine = useRef({
    tracks: [] as Track[],
    trackIdx: 0,
    sentences: [] as string[],
    sentenceIdx: 0,
    rate: 1,
    gen: 0,
    // strong reference to the in-flight utterance — Chrome GCs it otherwise
    // and onend/onerror silently never fire, stalling the playlist
    utterance: null as SpeechSynthesisUtterance | null,
  })

  const speakCurrent = useCallback(() => {
    const e = engine.current
    const synth = window.speechSynthesis

    if (e.sentenceIdx >= e.sentences.length) {
      // track finished → next track or end of playlist
      if (e.trackIdx + 1 < e.tracks.length) {
        e.trackIdx += 1
        e.sentenceIdx = 0
        e.sentences = splitSentences(e.tracks[e.trackIdx].text)
        setIndex(e.trackIdx)
      } else {
        setStatus('idle')
        return
      }
    }

    const gen = e.gen
    const utterance = new SpeechSynthesisUtterance(e.sentences[e.sentenceIdx])
    utterance.rate = e.rate
    const voice =
      synth.getVoices().find((v) => v.lang.startsWith('en') && v.default) ??
      synth.getVoices().find((v) => v.lang.startsWith('en'))
    if (voice) utterance.voice = voice

    const advance = () => {
      if (engine.current.gen !== gen) return // superseded by cancel
      engine.current.sentenceIdx += 1
      speakCurrent()
    }
    utterance.onend = advance
    utterance.onerror = advance

    e.utterance = utterance
    synth.speak(utterance)
  }, [])

  const startTrack = useCallback(
    (trackIdx: number) => {
      const e = engine.current
      e.gen += 1
      window.speechSynthesis.cancel()
      e.trackIdx = trackIdx
      e.sentenceIdx = 0
      e.sentences = splitSentences(e.tracks[trackIdx].text)
      setIndex(trackIdx)
      setStatus('playing')
      speakCurrent()
    },
    [speakCurrent],
  )

  const playArticles = useCallback(
    (articles: Article[], startIndex = 0) => {
      if (!supported || articles.length === 0) return
      engine.current.tracks = articles.map(toTrack)
      setTracks(engine.current.tracks)
      startTrack(startIndex)
    },
    [supported, startTrack],
  )

  // pause = cancel + remember position; resume = re-speak from that sentence.
  // speechSynthesis.pause()/resume() is unreliable across browsers.
  const toggle = useCallback(() => {
    const e = engine.current
    if (status === 'playing') {
      e.gen += 1
      window.speechSynthesis.cancel()
      setStatus('paused')
    } else if (status === 'paused') {
      setStatus('playing')
      speakCurrent()
    }
  }, [status, speakCurrent])

  const next = useCallback(() => {
    const e = engine.current
    if (e.trackIdx + 1 < e.tracks.length) startTrack(e.trackIdx + 1)
  }, [startTrack])

  const prev = useCallback(() => {
    startTrack(Math.max(0, engine.current.trackIdx - 1))
  }, [startTrack])

  const cycleRate = useCallback(() => {
    const e = engine.current
    const nextRate = RATES[(RATES.indexOf(e.rate) + 1) % RATES.length]
    e.rate = nextRate
    setRate(nextRate)
    if (status === 'playing') {
      // restart current sentence at the new rate
      e.gen += 1
      window.speechSynthesis.cancel()
      speakCurrent()
    }
  }, [status, speakCurrent])

  const stop = useCallback(() => {
    engine.current.gen += 1
    window.speechSynthesis.cancel()
    setStatus('idle')
  }, [])

  useEffect(() => {
    if (!supported) return
    // warm up the async voice list so the first utterance gets a proper voice
    window.speechSynthesis.getVoices()
    return () => window.speechSynthesis.cancel()
  }, [supported])

  const value = useMemo<PlayerContextValue>(
    () => ({
      supported,
      status,
      tracks,
      index,
      rate,
      playArticles,
      toggle,
      next,
      prev,
      cycleRate,
      stop,
    }),
    [supported, status, tracks, index, rate, playArticles, toggle, next, prev, cycleRate, stop],
  )

  return <PlayerContext.Provider value={value}>{children}</PlayerContext.Provider>
}

export function usePlayer(): PlayerContextValue {
  const ctx = useContext(PlayerContext)
  if (!ctx) throw new Error('usePlayer must be used inside <PlayerProvider>')
  return ctx
}
