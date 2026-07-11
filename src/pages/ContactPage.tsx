import { useState } from 'react'

const CONTACT_INFO = [
  { icon: '📍', label: 'Office', value: '99 Sukhumvit Rd, Bangkok 10110' },
  { icon: '✉️', label: 'Email', value: 'newsroom@esnews.io' },
  { icon: '📞', label: 'Phone', value: '+66 2 123 4567' },
]

function ContactPage() {
  const [sent, setSent] = useState(false)

  return (
    <div className="mx-auto max-w-7xl px-4 py-12">
      <header className="mb-12 max-w-2xl">
        <p className="font-display text-xs font-bold tracking-[0.3em] text-accent uppercase">
          Contact
        </p>
        <h1 className="mt-2 font-display text-4xl font-extrabold tracking-tight md:text-5xl">
          Talk to the newsroom
        </h1>
        <p className="mt-4 text-lg text-ink/60">
          Story tips, press releases, partnership ideas, or corrections — we
          read everything and reply within one business day.
        </p>
      </header>

      <div className="grid gap-12 lg:grid-cols-5">
        {/* Form */}
        <div className="lg:col-span-3">
          {sent ? (
            <div className="rounded-2xl bg-cream p-12 text-center">
              <p className="text-5xl">✅</p>
              <h2 className="mt-4 font-display text-2xl font-bold">
                Message sent
              </h2>
              <p className="mt-2 text-ink/60">
                Thanks for reaching out — we'll get back to you shortly.
              </p>
              <button
                type="button"
                onClick={() => setSent(false)}
                className="mt-6 font-display text-sm font-bold text-accent hover:underline"
              >
                Send another message
              </button>
            </div>
          ) : (
            <form
              className="grid gap-5 sm:grid-cols-2"
              onSubmit={(e) => {
                e.preventDefault()
                setSent(true)
              }}
            >
              <label className="block">
                <span className="font-display text-sm font-semibold">Name</span>
                <input
                  type="text"
                  required
                  placeholder="Your name"
                  className="mt-2 w-full rounded-xl border-2 border-ink/10 bg-cream px-4 py-3 transition-colors placeholder:text-ink/30 focus:border-accent focus:outline-none"
                />
              </label>
              <label className="block">
                <span className="font-display text-sm font-semibold">Email</span>
                <input
                  type="email"
                  required
                  placeholder="you@company.com"
                  className="mt-2 w-full rounded-xl border-2 border-ink/10 bg-cream px-4 py-3 transition-colors placeholder:text-ink/30 focus:border-accent focus:outline-none"
                />
              </label>
              <label className="block sm:col-span-2">
                <span className="font-display text-sm font-semibold">Subject</span>
                <select
                  className="mt-2 w-full rounded-xl border-2 border-ink/10 bg-cream px-4 py-3 transition-colors focus:border-accent focus:outline-none"
                  defaultValue="tip"
                >
                  <option value="tip">Story tip</option>
                  <option value="press">Press release</option>
                  <option value="partnership">Partnership / advertising</option>
                  <option value="correction">Correction</option>
                  <option value="other">Something else</option>
                </select>
              </label>
              <label className="block sm:col-span-2">
                <span className="font-display text-sm font-semibold">Message</span>
                <textarea
                  required
                  rows={6}
                  placeholder="Tell us more…"
                  className="mt-2 w-full resize-y rounded-xl border-2 border-ink/10 bg-cream px-4 py-3 transition-colors placeholder:text-ink/30 focus:border-accent focus:outline-none"
                />
              </label>
              <div className="sm:col-span-2">
                <button
                  type="submit"
                  className="rounded-xl bg-accent px-8 py-3.5 font-display text-sm font-bold tracking-wider text-white uppercase transition-transform hover:-translate-y-0.5"
                >
                  Send Message
                </button>
              </div>
            </form>
          )}
        </div>

        {/* Info */}
        <aside className="lg:col-span-2">
          <div className="rounded-2xl bg-surface-dark p-8 text-white">
            <h2 className="font-display text-xl font-bold">Newsroom</h2>
            <ul className="mt-6 space-y-5">
              {CONTACT_INFO.map((c) => (
                <li key={c.label} className="flex items-start gap-4">
                  <span className="grid h-10 w-10 shrink-0 place-items-center rounded-lg bg-white/10">
                    {c.icon}
                  </span>
                  <div>
                    <p className="text-xs tracking-wider text-white/50 uppercase">
                      {c.label}
                    </p>
                    <p className="mt-0.5 font-display font-semibold">{c.value}</p>
                  </div>
                </li>
              ))}
            </ul>
            <div className="mt-8 border-t border-white/10 pt-6">
              <p className="text-xs tracking-wider text-white/50 uppercase">
                Follow us
              </p>
              <div className="mt-3 flex gap-3">
                {['𝕏', 'in', 'f', '▶'].map((s) => (
                  <a
                    key={s}
                    href="#"
                    className="grid h-10 w-10 place-items-center rounded-lg bg-white/10 font-display font-bold transition-colors hover:bg-accent"
                  >
                    {s}
                  </a>
                ))}
              </div>
            </div>
          </div>
        </aside>
      </div>
    </div>
  )
}

export default ContactPage
