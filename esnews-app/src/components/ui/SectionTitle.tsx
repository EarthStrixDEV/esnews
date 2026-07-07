interface Props {
  title: string
  children?: React.ReactNode
}

function SectionTitle({ title, children }: Props) {
  return (
    <div className="mb-8 flex flex-wrap items-center justify-between gap-4">
      <h2 className="font-display text-3xl font-bold tracking-tight">
        {title}
        <span className="ml-2 inline-block h-2.5 w-2.5 rounded-full bg-accent align-middle" />
      </h2>
      {children}
    </div>
  )
}

export default SectionTitle
