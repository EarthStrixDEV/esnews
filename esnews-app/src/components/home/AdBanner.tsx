function AdBanner() {
  return (
    <section className="mx-auto max-w-7xl px-4 pb-12">
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-accent via-[#4338ca] to-[#7c3aed] px-8 py-10 text-white md:px-14">
        <div className="pointer-events-none absolute -top-10 -right-10 h-48 w-48 rounded-full bg-white/10" />
        <div className="pointer-events-none absolute -bottom-16 left-1/3 h-40 w-40 rotate-12 rounded-3xl bg-yellow-300/20" />
        <div className="relative flex flex-wrap items-center justify-between gap-6">
          <div>
            <div className="flex items-center gap-3">
              <h2 className="font-display text-3xl font-extrabold tracking-tight">
                NeuraCloud
              </h2>
              <span className="rounded border border-white/40 px-2 py-0.5 text-[10px] tracking-wider uppercase">
                GPU On-Demand
              </span>
            </div>
            <p className="mt-1 text-white/80">
              Train frontier models without owning a datacenter
            </p>
          </div>
          <div className="flex items-center gap-6">
            <div>
              <p className="text-xs text-white/70 uppercase">Price start only</p>
              <p className="font-display text-4xl font-extrabold">$1.99/hr</p>
            </div>
            <a
              href="#"
              className="rounded-lg bg-white px-6 py-3 font-display text-sm font-bold tracking-wider text-ink uppercase transition-transform hover:-translate-y-0.5"
            >
              Try Free
            </a>
          </div>
        </div>
      </div>
    </section>
  )
}

export default AdBanner
