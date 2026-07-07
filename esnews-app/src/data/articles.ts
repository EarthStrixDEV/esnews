export type Category = 'AI' | 'Tech' | 'Cloud' | 'IT' | 'Security'

export interface Article {
  id: string
  title: string
  excerpt: string
  category: Category
  author: string
  date: string
  readTime: string
  image: string
  content: string[]
  trending?: boolean
  featured?: boolean
  /** ISO timestamp for reliable date filtering; live articles set it directly,
   *  mock articles fall back to parsing `date` via articleTime() */
  publishedAt?: string
  /** present on live articles fetched from NewsData.io — links to the original story */
  sourceUrl?: string
  sourceName?: string
}

/** epoch ms for an article, from publishedAt if present else the display date.
 *  Returns NaN when neither parses — callers must handle it. */
export function articleTime(a: Article): number {
  const raw = a.publishedAt ?? a.date
  return new Date(raw).getTime()
}

export const CATEGORY_COLORS: Record<Category, string> = {
  AI: 'bg-cat-ai',
  Tech: 'bg-cat-tech',
  Cloud: 'bg-cat-cloud',
  IT: 'bg-cat-it',
  Security: 'bg-cat-security',
}

export const CATEGORIES: Category[] = ['AI', 'Tech', 'Cloud', 'IT', 'Security']

export const articles: Article[] = [
  {
    id: 'gpt-6-reasoning-breakthrough',
    title: 'Frontier Models Cross the Reasoning Threshold — What It Means for Enterprise',
    excerpt:
      'The latest generation of frontier AI models can now sustain multi-step reasoning across hour-long tasks, and enterprises are racing to rebuild workflows around them.',
    category: 'AI',
    author: 'Nara Wongsawat',
    date: 'July 2, 2026',
    readTime: '8 min read',
    image: 'https://picsum.photos/seed/aihero1/1200/800',
    featured: true,
    trending: true,
    content: [
      'For years, the promise of AI agents that could handle genuinely complex work remained just out of reach. Models could draft an email or summarize a report, but ask them to own a task end-to-end — plan it, execute it, verify it — and the cracks showed quickly.',
      'That era appears to be ending. The newest generation of frontier models sustains coherent multi-step reasoning across tasks that take hours, not minutes. Early enterprise adopters report agents that triage support queues, reconcile financial statements, and refactor legacy codebases with minimal supervision.',
      'The shift is forcing a rethink of enterprise software itself. Instead of dashboards designed for humans to read, companies are building "agent-first" interfaces: structured APIs, audit trails, and permission systems designed for machine operators with human oversight.',
      'Analysts caution that the gap between demo and deployment remains real. Reliability at the 99.9% level — the threshold most enterprises demand — still requires careful scaffolding, evaluation suites, and fallback paths. But the direction of travel is no longer in question.',
    ],
  },
  {
    id: 'quantum-cloud-ga',
    title: 'Quantum Computing Goes GA on the Big Three Clouds',
    excerpt:
      'AWS, Azure and Google Cloud all moved managed quantum services to general availability within the same quarter — a milestone a decade in the making.',
    category: 'Cloud',
    author: 'Krit Anuwat',
    date: 'June 30, 2026',
    readTime: '6 min read',
    image: 'https://picsum.photos/seed/quantum2/1200/800',
    featured: true,
    trending: true,
    content: [
      'It took ten years of research previews, error-correction milestones, and skeptical analyst notes, but managed quantum computing is now a general-availability product on all three major clouds.',
      'The workloads are narrow but real: molecular simulation for pharma, portfolio optimization for finance, and materials discovery for battery manufacturers. None of it replaces classical compute — all of it augments specific bottlenecks where quantum advantage has been demonstrated.',
      'Pricing remains eye-watering, with per-shot costs that make GPU clusters look cheap. Cloud providers are betting that, as with early GPUs, volume and hardware iteration will drive costs down an order of magnitude within three years.',
      'For CTOs, the practical advice is unchanged: identify whether your problem class has proven quantum speedup, and if not, wait. But for the first time, "wait" comes with a concrete product roadmap instead of a research paper.',
    ],
  },
  {
    id: 'edge-ai-chips-2026',
    title: 'The Edge AI Chip War Heats Up as On-Device Models Hit 100B Parameters',
    excerpt:
      'New NPU architectures let flagship phones and laptops run 100-billion-parameter models locally, redrawing the line between edge and cloud inference.',
    category: 'Tech',
    author: 'Mika Srisuwan',
    date: 'June 28, 2026',
    readTime: '7 min read',
    image: 'https://picsum.photos/seed/chips3/1200/800',
    featured: true,
    trending: true,
    content: [
      'Two years ago, running a 7-billion-parameter model on a phone was a party trick. This quarter, three chipmakers announced NPUs that run quantized 100-billion-parameter models at interactive speeds — on battery.',
      'The implications ripple through the entire stack. App developers can now assume a capable local model exists on-device, enabling private-by-default assistants, offline translation, and instant multimodal search without a network round-trip.',
      'Cloud providers are not standing still. Their counter-pitch is that frontier capability will always live in the datacenter, and the winning architecture is hybrid: local models for latency-sensitive and private tasks, cloud models for heavy reasoning.',
      'The real winner may be the memory industry. On-device models are gated less by compute than by memory bandwidth, and every flagship device spec sheet now leads with LPDDR6 numbers that would have described a workstation in 2024.',
    ],
  },
  {
    id: 'zero-trust-mandate',
    title: 'Zero-Trust Becomes Law: New Compliance Rules Hit Every Federal Contractor',
    excerpt:
      'Sweeping new cybersecurity regulation makes zero-trust architecture mandatory for anyone selling software to government — and the private sector is following.',
    category: 'Security',
    author: 'Preecha Malai',
    date: 'June 25, 2026',
    readTime: '5 min read',
    image: 'https://picsum.photos/seed/security4/1200/800',
    trending: true,
    content: [
      'The regulation that security teams have anticipated for two years is now final: federal contractors must demonstrate zero-trust architecture compliance by fiscal year end, with continuous verification replacing perimeter-based controls.',
      'The market response was immediate. Identity providers, micro-segmentation vendors, and policy-as-code startups saw enterprise pipelines double as compliance deadlines turned "nice to have" into "must have."',
      'Implementation pain is real. Legacy systems that assume flat internal networks need proxies, wrappers, or replacement. CISOs describe the work as "re-plumbing the building while people are working in it."',
      'Still, most security leaders privately welcome the mandate. Zero-trust budgets that stalled in committee for years were approved in weeks once auditors started asking for roadmaps.',
    ],
  },
  {
    id: 'kubernetes-simplification',
    title: 'Kubernetes at 12: The Great Simplification Finally Arrives',
    excerpt:
      'A new generation of opinionated platforms is hiding Kubernetes complexity behind clean developer experiences — and adoption is exploding.',
    category: 'Cloud',
    author: 'Fah Rattanaporn',
    date: 'June 22, 2026',
    readTime: '6 min read',
    image: 'https://picsum.photos/seed/k8s5/1200/800',
    content: [
      'Kubernetes won the orchestration war years ago, but the complexity complaints never stopped. Twelve years in, the ecosystem has finally responded with a wave of opinionated platforms that make the cluster invisible.',
      'The pattern is consistent: developers push code, the platform handles scheduling, scaling, networking, and security policy. Platform engineering teams configure golden paths once; product teams never write YAML again.',
      'Survey data backs the shift. Internal developer platform adoption doubled year over year, and "time to first deploy" for new engineers dropped from days to under an hour at organizations that made the leap.',
      'Purists worry about abstraction leaks, and they are not wrong — debugging still occasionally requires descending into the cluster. But the industry has clearly voted: Kubernetes is becoming infrastructure plumbing, not a developer-facing product.',
    ],
  },
  {
    id: 'ai-code-review-standard',
    title: 'AI Code Review Becomes the Industry Default — Human Reviewers Shift Roles',
    excerpt:
      'With AI reviewers catching the majority of defects pre-merge, senior engineers are redefining what human code review is actually for.',
    category: 'AI',
    author: 'Nara Wongsawat',
    date: 'June 20, 2026',
    readTime: '6 min read',
    image: 'https://picsum.photos/seed/codereview6/1200/800',
    content: [
      'The numbers are hard to argue with: organizations running AI-first code review report most defects caught before a human ever looks at the diff, with review turnaround dropping from hours to minutes.',
      'Human review has not disappeared — it has moved up the stack. Senior engineers now focus on architecture fit, product intent, and long-term maintainability, while machines handle correctness, style, and security scanning.',
      'Junior engineers are the surprising beneficiaries. Instead of waiting a day for feedback, they iterate with an AI reviewer in real time, and mentors report faster skill growth when human review time goes to teaching rather than typo-hunting.',
      'The open question is calibration: teams that rubber-stamp AI findings without judgment risk a monoculture of machine-preferred patterns. The best teams treat the AI as a strong junior reviewer — thorough, fast, and occasionally confidently wrong.',
    ],
  },
  {
    id: 'datacenter-power-crunch',
    title: 'The Datacenter Power Crunch: Why Grid Capacity Is the New GPU Shortage',
    excerpt:
      'AI buildout has shifted the bottleneck from silicon supply to electrical capacity, and hyperscalers are becoming energy companies.',
    category: 'IT',
    author: 'Krit Anuwat',
    date: 'June 18, 2026',
    readTime: '9 min read',
    image: 'https://picsum.photos/seed/power7/1200/800',
    content: [
      'Ask a datacenter operator what keeps them up at night and the answer has changed. Two years ago it was GPU allocation. Today it is megawatts.',
      'AI training and inference demand has collided with grid interconnection queues that stretch years. In response, hyperscalers are signing direct power purchase agreements, restarting nuclear plants, and building on-site generation at a scale that makes them de facto energy companies.',
      'The geography of compute is shifting accordingly. New builds cluster around stranded power assets — hydroelectric surplus regions, decommissioned industrial sites with grid connections, and jurisdictions that fast-track nuclear.',
      'For enterprises, the practical impact is pricing and placement: inference costs increasingly reflect local electricity markets, and data residency decisions now weigh power availability alongside compliance.',
    ],
  },
  {
    id: 'passwordless-tipping-point',
    title: 'Passkeys Hit the Tipping Point: Half of Consumer Logins Now Passwordless',
    excerpt:
      'A decade of FIDO evangelism finally pays off as passkey adoption crosses 50% of consumer authentications on major platforms.',
    category: 'Security',
    author: 'Preecha Malai',
    date: 'June 15, 2026',
    readTime: '4 min read',
    image: 'https://picsum.photos/seed/passkey8/1200/800',
    content: [
      'The password is not dead, but it is officially in decline. Major platforms report that passkeys now handle more than half of consumer sign-ins, up from single digits just two years ago.',
      'The inflection came from defaults, not evangelism. When the biggest identity providers made passkey creation the default enrollment path, adoption curves went vertical.',
      'Phishing statistics tell the impact story: credential phishing losses dropped measurably in cohorts that switched, because there is simply no secret to steal.',
      'Enterprise adoption lags consumer, held back by legacy systems and shared-workstation scenarios. Identity teams say the roadmap is clear but the long tail is long.',
    ],
  },
  {
    id: 'serverless-databases-2026',
    title: 'Serverless Databases Grow Up: The End of Capacity Planning',
    excerpt:
      'True scale-to-zero relational databases with single-digit-millisecond cold starts are changing how startups architect from day one.',
    category: 'Cloud',
    author: 'Fah Rattanaporn',
    date: 'June 12, 2026',
    readTime: '5 min read',
    image: 'https://picsum.photos/seed/database9/1200/800',
    content: [
      'The dream of a relational database that scales to zero and wakes in milliseconds used to come with asterisks. The latest generation of serverless Postgres offerings has removed most of them.',
      'Cold starts measured in single-digit milliseconds, connection pooling handled at the platform layer, and branching workflows that treat databases like git repositories have made the developer experience genuinely new.',
      'The economics reshape startup architecture. Side projects and early products pay near zero at rest, and the same database scales through product-market fit without a migration.',
      'Traditional capacity planning is quietly disappearing from job descriptions. As one platform engineer put it: "I used to size instances. Now I set a budget alert and ship."',
    ],
  },
  {
    id: 'agentic-devops',
    title: 'Agentic DevOps: When the On-Call Engineer Is a Model',
    excerpt:
      'AI agents now handle first-line incident response at scale — triaging alerts, rolling back deploys, and paging humans only when novel.',
    category: 'IT',
    author: 'Mika Srisuwan',
    date: 'June 10, 2026',
    readTime: '7 min read',
    image: 'https://picsum.photos/seed/devops10/1200/800',
    content: [
      'The 3 a.m. page is becoming a story senior engineers tell juniors about the old days. At a growing number of companies, the first responder to a production alert is an AI agent with runbook access and rollback permissions.',
      'The agents excel at the known-unknown: symptoms that match documented patterns get diagnosed and remediated in minutes, with a full audit trail. Genuinely novel failures still page a human — but with a pre-assembled investigation summary.',
      'Mean time to resolution numbers dropped sharply at early adopters, but leaders emphasize the human impact more: on-call burnout, long the silent killer of infrastructure teams, is measurably down.',
      'Trust was built incrementally. Most teams started agents in read-only observe mode, graduated to supervised actions, and only granted autonomous remediation for well-rehearsed scenarios with instant rollback.',
    ],
  },
  {
    id: 'spatial-computing-enterprise',
    title: 'Spatial Computing Finds Its Killer App — And It Is Not Entertainment',
    excerpt:
      'Industrial training, remote assistance and 3D design review are quietly driving headset deployments while consumer adoption plateaus.',
    category: 'Tech',
    author: 'Nara Wongsawat',
    date: 'June 8, 2026',
    readTime: '6 min read',
    image: 'https://picsum.photos/seed/spatial11/1200/800',
    content: [
      'While consumer headset sales flatten, a quieter story is unfolding on factory floors and in design studios: enterprise spatial computing deployments have tripled.',
      'The use cases are unglamorous and valuable. Aircraft technicians train on virtual engines before touching real ones. Field engineers stream their view to remote experts who annotate reality. Automotive designers review full-scale models without building clay.',
      'ROI math is what changed. Training programs report faster certification with lower error rates, and one manufacturer attributes a measurable scrap-rate reduction to AR-guided assembly.',
      'The lesson echoes every enterprise technology wave: the killer app is rarely the demo. It is the boring workflow where the new medium removes a real constraint.',
    ],
  },
  {
    id: 'open-weight-models-enterprise',
    title: 'Open-Weight Models Take a Third of Enterprise AI Workloads',
    excerpt:
      'Cost control, data sovereignty and fine-tuning freedom drive a surge in self-hosted open-weight model deployments.',
    category: 'AI',
    author: 'Krit Anuwat',
    date: 'June 5, 2026',
    readTime: '5 min read',
    image: 'https://picsum.photos/seed/openweight12/1200/800',
    content: [
      'The enterprise AI stack is settling into a portfolio pattern: frontier APIs for the hardest reasoning, open-weight models for everything else. New survey data puts open-weight share of enterprise inference at roughly a third and climbing.',
      'The drivers are pragmatic. Predictable unit economics at volume, deployment inside sovereign boundaries, and the freedom to fine-tune on proprietary data without sending it anywhere.',
      'Tooling maturity closed the operational gap. Inference servers, evaluation harnesses, and fine-tuning pipelines that required a research team two years ago are now managed products.',
      'Model providers have responded by competing on the whole portfolio: the same vendors selling frontier APIs now publish capable open-weight families, betting that owning both ends of the spectrum beats defending one.',
    ],
  },
]

export const getArticle = (id: string) => articles.find((a) => a.id === id)

export const getByCategory = (cat: Category) =>
  articles.filter((a) => a.category === cat)

export const featuredArticles = articles.filter((a) => a.featured)
export const trendingArticles = articles.filter((a) => a.trending)
