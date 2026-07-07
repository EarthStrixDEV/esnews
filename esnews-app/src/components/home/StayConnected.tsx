const SOCIALS = [
  { name: 'Facebook', count: '32K', label: 'Fans', color: 'bg-[#1877f2]', icon: 'f' },
  { name: 'X', count: '48K', label: 'Followers', color: 'bg-surface-dark', icon: '𝕏' },
  { name: 'Instagram', count: '21K', label: 'Followers', color: 'bg-gradient-to-r from-[#f09433] via-[#dc2743] to-[#bc1888]', icon: '◎' },
  { name: 'YouTube', count: '95K', label: 'Subscribers', color: 'bg-[#ff0000]', icon: '▶' },
  { name: 'LinkedIn', count: '17K', label: 'Followers', color: 'bg-[#0a66c2]', icon: 'in' },
]

function StayConnected() {
  return (
    <aside>
      <h2 className="mb-8 font-display text-xl font-bold tracking-wide uppercase">
        Stay Connected
        <span className="ml-2 inline-block h-2 w-2 rounded-full bg-accent align-middle" />
      </h2>
      <div className="flex flex-col gap-3">
        {SOCIALS.map((s) => (
          <a
            key={s.name}
            href="#"
            className={`flex items-center justify-between rounded-lg px-5 py-3.5 text-white transition-transform hover:-translate-y-0.5 ${s.color}`}
          >
            <span className="flex items-center gap-3">
              <span className="grid h-6 w-6 place-items-center font-display font-bold">
                {s.icon}
              </span>
              <span className="text-white/60">|</span>
              <span className="font-display text-sm font-bold">{s.count}</span>
            </span>
            <span className="text-xs tracking-wider uppercase">{s.label}</span>
          </a>
        ))}
      </div>

      <div className="mt-8 rounded-xl bg-surface-dark p-6 text-white">
        <h3 className="font-display text-lg font-bold">The Signal, Weekly</h3>
        <p className="mt-2 text-sm text-white/60">
          One email. The five stories in AI &amp; cloud that actually matter.
        </p>
        <form
          className="mt-4 flex gap-2"
          onSubmit={(e) => e.preventDefault()}
        >
          <input
            type="email"
            required
            placeholder="you@company.com"
            className="min-w-0 flex-1 rounded-lg bg-white/10 px-4 py-2.5 text-sm placeholder:text-white/40 focus:ring-2 focus:ring-accent focus:outline-none"
          />
          <button
            type="submit"
            className="rounded-lg bg-accent px-4 py-2.5 font-display text-sm font-bold transition-colors hover:bg-accent/80"
          >
            Join
          </button>
        </form>
      </div>
    </aside>
  )
}

export default StayConnected
