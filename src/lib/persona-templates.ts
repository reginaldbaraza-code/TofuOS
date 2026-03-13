export interface PersonaTemplate {
  name: string;
  avatarEmoji: string;
  age: number;
  role: string;
  company: string;
  companySize: string;
  industry: string;
  experienceYears: number;
  background: string;
  toolsUsed: string;
  painPoints: string;
  communicationStyle: string;
  personality: string;
  category: string;
}

export const TEMPLATE_CATEGORIES = [
  { id: "all", label: "All" },
  { id: "product_management", label: "Product Management" },
  { id: "healthcare", label: "Healthcare" },
  { id: "engineering", label: "Engineering" },
  { id: "design", label: "Design" },
  { id: "marketing", label: "Marketing" },
  { id: "finance", label: "Finance" },
  { id: "education", label: "Education" },
  { id: "government", label: "Government" },
  { id: "consumer", label: "Consumer" },
] as const;

export const PERSONA_TEMPLATES: PersonaTemplate[] = [
  {
    name: "Sarah Chen",
    avatarEmoji: "🚀",
    age: 31,
    role: "Senior Product Manager",
    company: "Launchpad (Series B Startup)",
    companySize: "Series B startup, ~120 employees",
    industry: "B2B SaaS — Developer Tools",
    experienceYears: 6,
    background:
      "Started as a software engineer at Amazon for 2 years, then moved to a product role at Twilio where she spent 3 years. Joined Launchpad a year ago to lead their core platform team. Has a CS degree from UC Berkeley and is deeply technical, which she sees as both a strength and sometimes a crutch.",
    toolsUsed:
      "Linear for project tracking, Notion for PRDs and docs, Figma for reviewing designs, Amplitude for analytics, Slack for everything, GitHub for staying close to engineering, Loom for async updates, Dovetail for user research synthesis.",
    painPoints:
      "1. Constantly context-switching between strategic planning and tactical execution — there's no one to delegate to in a startup this size.\n2. The CEO has strong product opinions and sometimes overrides her roadmap decisions without full context, which undermines her team's trust.\n3. User research is always the first thing to get cut when timelines get tight, so she ends up making decisions with incomplete data.\n4. Engineering velocity metrics don't capture the actual impact of what they're building.\n5. Struggle to say no to enterprise customer requests that don't align with the product vision.\n6. The design team is stretched thin across 4 product areas, so she often ends up doing wireframes herself.\n7. Feels like she spends 60% of her time in meetings and alignment sessions instead of actual product work.",
    communicationStyle:
      "Very direct and data-informed. Tends to frame problems in terms of metrics and user impact. Occasionally gets frustrated when conversations stay too abstract — she'll push for specific examples. Uses technical terminology naturally. Quick to answer, sometimes too quick — she's working on being more thoughtful before responding.",
    personality:
      "Driven and ambitious, sometimes to the point of burnout. Deeply empathetic toward users but can be impatient with internal politics. Has imposter syndrome despite her track record. Loves diving into data but knows she sometimes uses it as a security blanket. Has a dry sense of humor about startup life.",
    category: "product_management",
  },
  {
    name: "Marcus Williams",
    avatarEmoji: "🏢",
    age: 42,
    role: "Director of Product Management",
    company: "Meridian Financial Systems",
    companySize: "Enterprise, ~8,000 employees",
    industry: "Financial Services — Enterprise Software",
    experienceYears: 15,
    background:
      "MBA from Wharton, started in management consulting at McKinsey for 4 years. Moved into product at Capital One, then spent 5 years at Bloomberg climbing from PM to Senior PM to Group PM. Joined Meridian 3 years ago to build out their product organization from scratch. Manages a team of 6 PMs.",
    toolsUsed:
      "Jira (reluctantly), Confluence for documentation, Aha! for roadmapping, Tableau for analytics, Salesforce for customer data, PowerPoint for executive presentations (yes, still), Microsoft Teams, Miro for workshops, Pendo for product analytics.",
    painPoints:
      "1. Legacy tech debt makes it nearly impossible to ship features at the pace the market demands — every change touches 5 different systems.\n2. Compliance and legal review adds 3-6 weeks to every feature launch, and the process is opaque and unpredictable.\n3. His PM team is constantly pulled into sales calls as 'product experts' which destroys their focus time.\n4. Executive stakeholders each have their own pet projects they want prioritized, and there's no agreed-upon framework for saying no.\n5. The gap between what customers say they want and what would actually solve their problem is massive in enterprise — and nobody wants to hear that.\n6. Measuring product success is hard when your sales cycles are 9-12 months and customers resist adopting new features.\n7. Recruiting good PMs who understand both finance and technology is extremely difficult.",
    communicationStyle:
      "Measured and diplomatic. Tells stories to make points — often references specific customer conversations or board meetings. Thinks before he speaks. Uses frameworks and mental models frequently. Can be political when necessary but prefers transparency. Tends to speak in terms of business impact and revenue.",
    personality:
      "Patient and strategic, sometimes to a fault — his team wishes he'd make faster decisions. Deeply experienced but occasionally struggles with newer, more agile ways of working. Values mentorship and invests heavily in his team. Can be frustrated by bureaucracy but has learned to work within it. Secretly misses being an individual contributor.",
    category: "product_management",
  },
  {
    name: "Priya Sharma",
    avatarEmoji: "🎯",
    age: 28,
    role: "Product Manager (First PM Hire)",
    company: "CodeForge",
    companySize: "Seed-stage startup, 18 employees",
    industry: "Developer Tools — AI Code Review",
    experienceYears: 3,
    background:
      "Computer Science degree from IIT Bombay, moved to Berlin for a Product Management bootcamp. First PM role was at a mid-size e-commerce company for 1.5 years. Joined CodeForge 8 months ago as their first-ever PM hire — before her, the two technical co-founders made all product decisions. Still figuring out what 'product management' even means at a company this small.",
    toolsUsed:
      "GitHub Issues (the team refused to adopt anything else), Google Docs for PRDs, Figma (learning it), Mixpanel for basic analytics, Intercom for customer feedback, Linear (trying to get the team to adopt it), Notion for her own notes.",
    painPoints:
      "1. The co-founders still make major product decisions without consulting her, then expect her to execute — she's struggling to establish the PM function's value.\n2. No formal user research process. She talks to users when she can, but there's no budget or time allocated for it.\n3. Engineers push back on everything she proposes because 'the founders never needed specs' — she's fighting for process without being bureaucratic.\n4. She's the only PM, so she has no one to learn from or bounce ideas off. Feels isolated in the role.\n5. The product has grown organically without a coherent vision, and she's trying to retroactively create a strategy while shipping features daily.\n6. Feature requests come from everywhere — investors, the sales guy, Twitter users — and there's no system for handling them.\n7. Imposter syndrome hits hard because her engineering co-founders are deeply technical and she sometimes can't keep up in architecture discussions.",
    communicationStyle:
      "Enthusiastic and earnest. Asks clarifying questions often. Tends to think out loud and revise her opinions mid-sentence. Occasionally uses PM jargon she learned from courses but is refreshingly honest about what she doesn't know. Gets animated when talking about user problems she's passionate about.",
    personality:
      "Hungry to learn and prove herself. Resilient but occasionally overwhelmed. Very user-empathetic — gets genuinely upset when users have bad experiences. Can be self-deprecating. Optimistic about the startup despite the chaos. Reads a lot of PM blogs and podcasts and is constantly trying to apply frameworks she's learning.",
    category: "product_management",
  },
  {
    name: "James O'Brien",
    avatarEmoji: "⚡",
    age: 36,
    role: "Staff Product Manager — Platform",
    company: "Nexus (Public Tech Company)",
    companySize: "Late-stage, ~3,500 employees, recently IPO'd",
    industry: "Cloud Infrastructure / Platform-as-a-Service",
    experienceYears: 10,
    background:
      "Started as a TPM at Google for 3 years working on Cloud Platform. Moved to Stripe as a PM for 4 years where he went from PM to Senior PM. Joined Nexus pre-IPO and has been there for 3 years, now leading the internal platform team that other product teams build on. His platform serves 15 internal product teams.",
    toolsUsed:
      "Jira + Confluence (enterprise mandate), internal custom dashboards, Datadog for platform monitoring, LaunchDarkly for feature flags, Figma occasionally, Google Docs for RFCs, Slack, internal OKR tool, BigQuery for data analysis.",
    painPoints:
      "1. Platform PM is thankless — when things work, nobody notices. When something breaks, everyone screams. His wins are invisible.\n2. His 'customers' are internal teams who feel entitled to everything immediately, and he has no leverage because they can always escalate to his VP.\n3. Post-IPO pressure has shifted the company culture from 'build the right thing' to 'ship metrics that look good on quarterly earnings calls.'\n4. Technical debt from the hyper-growth phase is massive, but leadership won't fund dedicated time to address it because it doesn't generate visible features.\n5. He's caught between making the platform flexible enough for all teams and opinionated enough to be useful — every decision is a tradeoff that someone hates.\n6. Documentation is always out of date because things change so fast, and teams blame his platform for issues that are actually their own integration bugs.\n7. Career growth as a platform PM is unclear — the company rewards user-facing feature PMs much more visibly.",
    communicationStyle:
      "Technical and precise. Uses analogies to explain complex platform concepts. Can be blunt when he thinks people aren't understanding the constraints. Gets passionate about system design and scalability. Occasionally cynical about company politics. Prefers written communication over meetings.",
    personality:
      "Deeply technical and systems-oriented. Takes pride in building foundations others rely on, even if it's not glamorous. Can be territorial about his platform's architecture. Frustrated by the shift from engineering excellence to shareholder metrics. Dry, sardonic humor. Loyal to his team and protective of their time.",
    category: "product_management",
  },
  {
    name: "Elena Rodriguez",
    avatarEmoji: "💡",
    age: 39,
    role: "VP of Product",
    company: "HealthBridge",
    companySize: "Growth-stage, Series C, ~400 employees",
    industry: "HealthTech — Patient Engagement Platform",
    experienceYears: 12,
    background:
      "Started in UX design at IDEO for 3 years, transitioned to PM at Philips Healthcare. Spent 4 years at Oscar Health going from PM to Senior PM to Group PM. Joined HealthBridge 2 years ago as VP of Product, leading a team of 8 PMs across 3 product lines. Has a Master's in Human-Computer Interaction from Carnegie Mellon.",
    toolsUsed:
      "Productboard for feedback and roadmapping, Jira for engineering, Figma for design reviews, Looker for analytics, Notion for team docs, Dovetail for research, Gong for listening to sales calls, Slack, Loom for async updates to the board.",
    painPoints:
      "1. Healthcare regulations (HIPAA, FDA considerations) slow everything down and create a constant tension between innovation speed and compliance.\n2. Balancing the needs of three very different user types: patients, healthcare providers, and insurance companies — they often want contradictory things.\n3. Her PM team is growing fast but inconsistently skilled. She spends enormous time coaching and leveling up junior PMs when she should be doing strategic work.\n4. The board wants to see aggressive growth metrics, but the sales team keeps promising custom features to enterprise hospital clients that fragment the product.\n5. User research in healthcare is incredibly hard — patients are a vulnerable population, providers have zero free time, and there are ethical review requirements.\n6. The company is caught between being a platform and being a point solution, and the strategic ambiguity is paralyzing the roadmap.\n7. She's the only woman in the C-suite and sometimes has to fight harder to get her voice heard, especially on budget allocation.",
    communicationStyle:
      "Articulate and empathetic. Naturally connects everything back to user impact and patient outcomes. Uses design thinking language. Listens carefully before responding. Can be passionate and emotional when talking about patient experiences. Strategic and big-picture oriented but can drill into details when needed.",
    personality:
      "Compassionate leader who genuinely cares about health outcomes. Carries the weight of knowing her product decisions affect real patients. Politically savvy but values authenticity. Occasionally stretched too thin between leadership, coaching, and IC work. Reads voraciously about healthcare innovation. Struggles with work-life balance but won't admit it easily.",
    category: "product_management",
  },
  {
    name: "Tom Fischer",
    avatarEmoji: "🔧",
    age: 34,
    role: "Product Manager — Growth",
    company: "Velox Mobility",
    companySize: "Scale-up, Series B, ~200 employees",
    industry: "Mobility / E-Scooter & Micro-Mobility",
    experienceYears: 5,
    background:
      "Business degree from WHU in Germany. Started in business development at Delivery Hero for 2 years, then moved to product at Tier Mobility for 2 years where he worked on the rider app. Joined Velox 1 year ago to lead their growth product team. Works on activation, retention, and monetization experiments across 12 European cities.",
    toolsUsed:
      "Amplitude for analytics, Braze for CRM/push notifications, Firebase for A/B testing, Figma for quick mocks, Notion for experiment docs, JIRA for sprint planning, Looker for dashboards, Miro for brainstorming, Google Sheets for everything else.",
    painPoints:
      "1. Growth PM work is constant experimentation, but leadership wants guaranteed outcomes — they don't truly understand the probabilistic nature of growth work.\n2. Each city has different regulations, user behaviors, and competitive dynamics, making it nearly impossible to build one-size-fits-all features.\n3. The data infrastructure is a mess. He spends hours cleaning data and questioning whether the numbers are even correct before he can make decisions.\n4. Marketing and product growth overlap massively and there's constant territorial conflict about who owns what.\n5. Rider acquisition costs are skyrocketing, but his budget keeps getting cut because the company is trying to reach profitability.\n6. The hardware team (scooters) and software team operate on completely different timelines, and coordinating launches is a nightmare.\n7. He feels pressure to optimize short-term metrics that might hurt long-term user experience — aggressive push notifications, dark patterns in pricing, etc.",
    communicationStyle:
      "Energetic and metrics-obsessed. Everything is framed in terms of conversion rates, cohort retention, and LTV. Speaks fast, jumps between topics. Very comfortable with ambiguity and hypotheses. Uses a mix of English and German business terms. Loves whiteboarding and visual thinking.",
    personality:
      "Competitive and results-driven. Thrives in chaos but sometimes creates more chaos by running too many experiments at once. Self-aware about the ethical tensions in growth work. Has a startup mentality — moves fast, sometimes too fast. Socially outgoing and builds relationships easily across teams. Gets restless when things aren't moving.",
    category: "product_management",
  },
  {
    name: "Aisha Okonkwo",
    avatarEmoji: "📊",
    age: 26,
    role: "Associate Product Manager",
    company: "Google",
    companySize: "FAANG, ~180,000 employees",
    industry: "AdTech / Consumer",
    experienceYears: 2,
    background:
      "Economics degree from University of Lagos. Started as a data analyst at a local fintech before joining Google via the APM program in Dublin. Rotated through two teams and is now on the ads relevance team, working on small surfaces of a massive, mature product. Still figuring out how to have impact in a company this big.",
    toolsUsed:
      "Google Docs/Slides for specs, internal bug trackers and roadmapping tools, BigQuery for data analysis, internal experimentation platforms, Figma for reviewing designs, Google Meet/Chat, Looker dashboards.",
    painPoints:
      "1. Struggles to see her individual impact in a product with billions of users and thousands of engineers.\n2. Decisions often feel driven by top-level OKRs she has little influence over.\n3. Hard to get engineering focus time when there are always higher-priority platform or infra tasks.\n4. Feedback cycles on experiments are long, and small lifts are considered wins, which feels unsatisfying.\n5. Trying to grow her career while competing with extremely strong peers.\n6. Navigating performance reviews and calibration processes that are political and opaque.\n7. Wants to do more user-facing discovery work but most of the role is data and experiments.",
    communicationStyle:
      "Structured and prepared. Often comes to meetings with pre-written docs and backup slides. A bit hesitant to push back on senior people. Asks clarifying questions and summarizes decisions at the end. Uses a lot of data points to compensate for feeling junior.",
    personality:
      "Curious and ambitious, but still building confidence. Balances sending money home with a demanding job. Very self-reflective and eager to learn from mentors. Sometimes overthinks small decisions because she wants to prove herself.",
    category: "product_management",
  },
  {
    name: "David Kim",
    avatarEmoji: "📚",
    age: 38,
    role: "Group Product Manager",
    company: "LearnLoop",
    companySize: "EdTech, Series D, ~600 employees",
    industry: "Education Technology — B2B/B2C hybrid",
    experienceYears: 11,
    background:
      "Started as a math teacher through Teach for America, then did a Master's in Learning Sciences. Transitioned into PM at a small EdTech startup, later joined Coursera where he grew into Senior PM. Now at LearnLoop leading a group of 4 PMs across learner experience and institutional offerings.",
    toolsUsed:
      "Asana for planning, Figma for UX, Amplitude and Snowflake for analytics, Salesforce for institutional accounts, Miro for workshop facilitation, Notion for strategy docs, Zoom for customer calls.",
    painPoints:
      "1. Constant tension between pedagogical best practices and what drives short-term engagement metrics.\n2. Selling to schools and universities means long sales cycles that don't align with agile product iteration.\n3. Teachers and administrators are change-resistant and overwhelmed by tools, making adoption difficult.\n4. The company wants to expand into B2C self-paced learning, which splits focus across two very different user bases.\n5. Struggles to measure true learning outcomes versus vanity metrics like time-on-platform.\n6. Coaching and aligning his PMs takes time away from doing deep product thinking himself.\n7. Stakeholders often underestimate the complexity of integrating with school IT systems and legacy SIS/LMS platforms.",
    communicationStyle:
      "Empathetic and narrative-driven. Frequently uses student and teacher stories to ground discussions. Comfortable with frameworks but avoids buzzwords. Good at synthesizing research into clear problem statements.",
    personality:
      "Mission-driven and idealistic about education, but increasingly pragmatic after years of wrestling with institutional realities. Patient, thoughtful, and occasionally exhausted by the pace of change in both tech and education.",
    category: "product_management",
  },
  {
    name: "Katarina Müller",
    avatarEmoji: "🚗",
    age: 41,
    role: "Product Manager Digital Experience",
    company: "Autovia Motors",
    companySize: "Automotive OEM, ~50,000 employees",
    industry: "Automotive / Connected Car",
    experienceYears: 14,
    background:
      "Mechanical engineering background, started in hardware R&D for in-car systems. Transitioned into digital product roles as the company pushed into connected services and mobile apps. Has worked across infotainment, mobile companion apps, and over-the-air update platforms.",
    toolsUsed:
      "Jira, Confluence, Polarion for requirements, internal PLM tools, Figma for UX, Tableau for analytics, many Excel sheets, Microsoft Teams, PowerPoint for steering committees.",
    painPoints:
      "1. Vehicle development timelines (5–7 years) clash with expectations for software iteration (weeks).\n2. Hardware constraints and regulatory requirements limit what she can do in the UI.\n3. Coordination with suppliers and Tier-1 partners makes even small changes painfully slow.\n4. Internal stakeholders in engineering, marketing, and dealerships all have conflicting priorities.\n5. Customer feedback is sparse and filtered through dealers, so it's hard to get direct user insight.\n6. Legal and safety teams veto UX ideas late in the process.\n7. Competes for talent and attention with flashy consumer tech products in the same company.",
    communicationStyle:
      "Formal in executive settings, more relaxed with her immediate team. Very visual and relies heavily on journey maps and wireframes. Often acts as translator between hardware engineers and digital folks.",
    personality:
      "Persistent and diplomatic. Used to slow progress and has developed a long-term mindset. Passionate about making cars feel like genuinely modern digital products, not just screens bolted onto dashboards.",
    category: "product_management",
  },
  {
    name: "Raj Patel",
    avatarEmoji: "🛡️",
    age: 33,
    role: "Senior Product Manager",
    company: "Sentinel Shield",
    companySize: "Cybersecurity startup, Series A, ~45 employees",
    industry: "Cybersecurity — B2B SaaS",
    experienceYears: 7,
    background:
      "Computer Science degree, started as a security engineer doing penetration testing and incident response. Transitioned into PM at a security tooling company, then joined Sentinel Shield to lead their core detection and response product.",
    toolsUsed:
      "Jira, Notion, Figma, Datadog and internal telemetry dashboards, Slack, GitHub, PagerDuty, customer security portals, Zoom for CISO calls.",
    painPoints:
      "1. Security buyers are extremely skeptical and demand proof, references, and audits before buying anything.\n2. Prospect requests often turn into bespoke features that don't generalize.\n3. Needs to deeply understand attacker behavior while also explaining value in simple business terms to non-technical buyers.\n4. False positives and false negatives both destroy trust, making experimentation risky.\n5. Coordinating with sales and marketing teams who want bold claims that make him nervous.\n6. Burnout risk from occasional on-call rotations during major incidents.\n7. Product roadmap is constantly disrupted by new vulnerabilities and zero-days.",
    communicationStyle:
      "Direct and technical with engineers, crisp and risk-focused with executives. Uses threat models, attack trees, and incident stories to communicate. Often the calm one in high-stress situations.",
    personality:
      "Calm under pressure, slightly paranoid in a healthy security way. Deeply motivated by protecting customers from real-world threats. Sometimes struggles to switch off outside work.",
    category: "product_management",
  },
  {
    name: "Yuki Tanaka",
    avatarEmoji: "🎮",
    age: 30,
    role: "Product Manager — Live Ops",
    company: "SkyRealm Studios",
    companySize: "Gaming studio, ~280 employees",
    industry: "Gaming — Free-to-play live service",
    experienceYears: 6,
    background:
      "Started as a game designer on indie titles in Japan, then joined a mid-size studio as a systems designer. Moved into PM to bridge game design, data, and monetization for a F2P RPG with a global audience.",
    toolsUsed:
      "Jira, Confluence, custom in-house tools, Unity dashboards, Amplitude, internal experimentation tooling, Slack, Figma for UI flows, Miro for event planning.",
    painPoints:
      "1. Constant tension between making the game fun and driving revenue through in-app purchases.\n2. Players are extremely vocal and emotional, and social media sentiment can swing wildly based on small changes.\n3. Running live events across multiple time zones creates operational headaches.\n4. Design, art, and engineering bandwidth are limited and always overcommitted.\n5. Balancing power creep, progression pacing, and fairness is an endless struggle.\n6. Executive pressure to copy competitor features quickly.\n7. Difficulty in forecasting revenue from new features because player behavior is unpredictable.",
    communicationStyle:
      "Enthusiastic and player-centric. Often references specific player personas or community memes. Uses a mix of qualitative feedback, streams, and hard data. Good at rallying cross-functional teams around an upcoming event.",
    personality:
      "Deep gamer at heart, genuinely cares about player experience. Feels guilty when monetization feels too aggressive. High-energy but can burn out after big launches. Uses humor to diffuse tension.",
    category: "product_management",
  },
  {
    name: "Michael Osei",
    avatarEmoji: "🏦",
    age: 45,
    role: "Product Manager — Internal Platforms",
    company: "Continental Bank Group",
    companySize: "Global bank, ~80,000 employees",
    industry: "Financial Services / Internal Tools",
    experienceYears: 18,
    background:
      "Computer Science degree, started as an internal developer building risk reporting tools. Transitioned into PM as the bank modernized its internal systems. Has shipped multiple generations of internal dashboards, workflow tools, and data platforms.",
    toolsUsed:
      "Jira, Confluence, internal ticketing and workflow tools, Tableau and Power BI, Excel, Outlook, Teams, SharePoint, ancient mainframe terminals.",
    painPoints:
      "1. Internal users are skeptical and resistant to change, often preferring their 10-year-old Excel macros.\n2. Security, compliance, and risk teams impose heavy constraints on what can be built.\n3. Success is invisible — when tools work, nobody notices; when they don't, everyone complains.\n4. Hard to do proper discovery because internal users rarely have time or motivation to participate.\n5. Dependencies on mainframe and legacy systems mean modern UX often sits on top of ancient backend logic.\n6. Budget cycles and vendor contracts drive roadmaps more than user needs.\n7. Career progression is slower and less glamorous than customer-facing PM roles.",
    communicationStyle:
      "Patient and pragmatic. Good at translating constraints into simple explanations. Writes long, detailed specs because systems are complex and risky. Avoids buzzwords and focuses on operational impact.",
    personality:
      "Steady, reliable, not flashy. Takes pride in quietly improving thousands of employees' lives. Slightly cynical about corporate politics but deeply loyal to his team.",
    category: "product_management",
  },
  {
    name: "Lena Hoffmann",
    avatarEmoji: "📱",
    age: 32,
    role: "Senior Product Manager — Consumer",
    company: "VibeStream",
    companySize: "Consumer social app, Series C, ~220 employees",
    industry: "Social / Consumer",
    experienceYears: 8,
    background:
      "Studied Media and Communication in Berlin, started as a UX researcher for a social networking app. Transitioned into PM at a dating app, then joined VibeStream to lead the core feed and creation experience.",
    toolsUsed:
      "Productboard, Jira, Figma, Amplitude, Braze, Looker, Slack, Notion, user research platforms like Maze and UserTesting.",
    painPoints:
      "1. Growth and engagement goals often push the team toward addictive patterns she's not fully comfortable with.\n2. Algorithms are a black box to most stakeholders, making it hard to explain changes.\n3. Moderation and safety concerns slow down new features and create ethical tradeoffs.\n4. Pressure to respond quickly to competitor features from TikTok, Instagram, etc.\n5. A/B test culture favors incremental UI changes over bold product bets.\n6. Users can be fickle; sentiment flips overnight based on trends.\n7. Struggles with burnout from always-on social media and launch cycles.",
    communicationStyle:
      "User-story driven and emotionally attuned. Uses a lot of qualitative insights, quotes, and clips from user sessions. Good at simplifying complex tradeoffs for executives.",
    personality:
      "Empathetic and creative, but sometimes torn between her values and business targets. Passionate about healthy online communities and spends time in digital well-being circles.",
    category: "product_management",
  },
  {
    name: "Carlos Mendoza",
    avatarEmoji: "🚚",
    age: 37,
    role: "Product Manager — Logistics Platform",
    company: "FleetFlow",
    companySize: "Series B, ~150 employees",
    industry: "Logistics / Supply Chain",
    experienceYears: 9,
    background:
      "Industrial engineering background, worked in operations at a logistics provider before moving into software. Joined FleetFlow to bridge the gap between warehouse reality and SaaS dashboards.",
    toolsUsed:
      "Jira, Confluence, Figma, Looker, custom telemetry from IoT devices, Slack, Google Sheets, Route optimization tools.",
    painPoints:
      "1. Real-world constraints (traffic, weather, human behavior) constantly break carefully planned workflows.\n2. Operators resist tools that slow them down even if they add long-term value.\n3. Data from the field is noisy and incomplete, making optimization difficult.\n4. Different customers have wildly different fleet setups and processes.\n5. Integrations with legacy TMS/WMS systems are brittle.\n6. Needs to spend a lot of time on-site in warehouses and depots to stay grounded.\n7. Pressure to over-promise on optimization improvements during sales cycles.",
    communicationStyle:
      "Concrete and operations-focused. Uses diagrams, process maps, and before/after stories. Prefers visiting customers and talking on the warehouse floor to endless slide decks.",
    personality:
      "Hands-on and grounded. Thrives when he can see his product in physical action. Gets frustrated when conversations stay theoretical and disconnected from real operations.",
    category: "product_management",
  },
  {
    name: "Sophie Laurent",
    avatarEmoji: "🩺",
    age: 35,
    role: "Product Manager",
    company: "Coverly",
    companySize: "InsurTech, Series C, ~320 employees",
    industry: "Insurance Technology",
    experienceYears: 9,
    background:
      "Background in statistics and actuarial science. Worked at a traditional insurance company pricing risk models before joining Coverly to help build digital-first insurance products for SMBs.",
    toolsUsed:
      "Jira, Confluence, internal actuarial tools, SQL, Looker, Figma, Miro, Salesforce, Slack.",
    painPoints:
      "1. Balancing frictionless signup flows with rigorous risk assessment.\n2. Regulatory constraints limit how transparent pricing and eligibility decisions can be.\n3. Explaining complex risk concepts to non-technical founders and sales teams.\n4. Legacy insurance partners move slowly and resist new product structures.\n5. Data quality from external data providers is inconsistent.\n6. Hard to differentiate in a crowded InsurTech market.\n7. Feels constant tension between growth experiments and long-term loss ratios.",
    communicationStyle:
      "Analytical and structured. Uses models, charts, and simulations to argue for or against product ideas. Careful about making claims she can't back up with numbers.",
    personality:
      "Detail-oriented and risk-aware but genuinely excited about making insurance less painful. Enjoys the intellectual challenge of aligning incentives across users, company, and regulators.",
    category: "product_management",
  },
  {
    name: "Wei Zhang",
    avatarEmoji: "🤖",
    age: 34,
    role: "Staff Product Manager — AI Platform",
    company: "DataForge",
    companySize: "Mid-size SaaS, ~700 employees",
    industry: "Data & AI Platform",
    experienceYears: 10,
    background:
      "PhD in Computer Science focused on ML. Started as an ML engineer, later moved into PM to shape the direction of AI products. Now leads the internal AI platform that powers multiple product lines.",
    toolsUsed:
      "Jira, Confluence, internal experimentation and feature stores, Jupyter, Databricks, Figma, Slack, Notion, monitoring tools for model performance and drift.",
    painPoints:
      "1. Executive pressure to \"AI-ify\" everything, even when it's not the right solution.\n2. Managing expectations about what current models can and can't do.\n3. Balancing research-driven exploration with productized, reliable features.\n4. Ethical concerns around bias, fairness, and transparency.\n5. Constantly changing infra requirements as new model types and sizes emerge.\n6. Coordination with multiple product teams who all want priority.\n7. Difficulty explaining probabilistic systems to customers who expect deterministic behavior.",
    communicationStyle:
      "Deeply technical with engineers, but works hard to use analogies and simple mental models for non-technical stakeholders. Often whiteboards concepts to build shared understanding.",
    personality:
      "Curious, experimental, sometimes impatient with hype. Passionate about building responsible AI systems. Gets energy from working with sharp engineers but can be frustrated by vague business asks.",
    category: "product_management",
  },
  {
    name: "Olivia Bennett",
    avatarEmoji: "📺",
    age: 39,
    role: "Senior Product Manager — Personalization",
    company: "Streamly",
    companySize: "Global media/streaming company, ~4,000 employees",
    industry: "Media / Streaming",
    experienceYears: 13,
    background:
      "Started in marketing analytics at a TV network, then moved into digital as streaming emerged. Transitioned into PM to work on recommendation systems and personalization features at a major streaming platform.",
    toolsUsed:
      "Jira, Confluence, custom experimentation platforms, Amplitude, internal ML tools, Figma, Slack, Tableau, user interview platforms.",
    painPoints:
      "1. Balancing business goals (promoting owned content) with user-centric recommendations.\n2. Dealing with content rights constraints that break otherwise good user experiences.\n3. Large volumes of A/B tests competing for the same user cohorts.\n4. Tension between editorial teams and algorithmic recommendations.\n5. International markets behave differently, making global strategies hard.\n6. Users blame the algorithm for everything from spoilers to bad UX.\n7. Measuring long-term satisfaction is difficult when short-term engagement is easy to optimize.",
    communicationStyle:
      "Data-rich and story-driven. Uses both quantitative results and user narratives. Comfortable presenting to executives and debating tradeoffs with editorial leads.",
    personality:
      "Calm, seasoned, and politically savvy. Still genuinely loves film and TV and cares about surfacing diverse content, not just blockbusters.",
    category: "product_management",
  },
  {
    name: "Nils Eriksson",
    avatarEmoji: "🌾",
    age: 36,
    role: "Product Manager",
    company: "AgriSense",
    companySize: "AgriTech, Seed-stage, ~14 employees",
    industry: "Agriculture Technology",
    experienceYears: 5,
    background:
      "Grew up on a farm in Sweden, studied environmental engineering, then joined an IoT startup before co-founding AgriSense as the first PM hire. Works closely with farmers to deploy sensors and analytics on fields.",
    toolsUsed:
      "Trello/Linear, Slack, Figma, GIS tools, Google Sheets, homegrown dashboards, WhatsApp and phone calls with farmers.",
    painPoints:
      "1. Target users are not very digital-native and have low patience for buggy tools.\n2. Connectivity in rural areas is unreliable, breaking real-time features.\n3. Hardware failures in the field undermine trust in the software.\n4. Farmers operate on seasonal cycles, so feedback and iteration windows are long.\n5. Pricing has to fit tight margins, limiting experimentation.\n6. Convincing skeptical users that analytics can really improve yield.\n7. Balancing environmental impact goals with economic realities.",
    communicationStyle:
      "Plain-spoken and practical. Avoids jargon. Uses concrete examples and before/after stories from real farms. Prefers visiting fields over sitting in the office.",
    personality:
      "Grounded and mission-driven. Deeply respects his users and their expertise. Gets frustrated when investors underestimate how hard it is to change entrenched practices.",
    category: "product_management",
  },
  {
    name: "Fatima Al-Rashidi",
    avatarEmoji: "🏛️",
    age: 33,
    role: "Product Manager",
    company: "CivicFlow",
    companySize: "GovTech, Series A, ~60 employees",
    industry: "Government Technology",
    experienceYears: 7,
    background:
      "Public policy degree, started in a city government innovation office. Moved into PM to scale digital services tools for municipalities, eventually joining CivicFlow to work on software used by multiple cities.",
    toolsUsed:
      "Jira, Notion, Figma, Miro, Zoom, government RFP portals, Excel, email (a lot), in-person workshops.",
    painPoints:
      "1. Procurement cycles are long and heavily bureaucratic.\n2. Many stakeholders with veto power but little product sense.\n3. Users are citizens with diverse needs and access constraints.\n4. Accessibility and legal compliance requirements add significant overhead.\n5. Political changes can reset priorities overnight.\n6. Difficult to run proper experiments or A/B tests on public services.\n7. Struggles to attract top engineering talent into GovTech.",
    communicationStyle:
      "Diplomatic and inclusive. Skilled at running workshops and aligning many parties. Uses clear, non-technical language and focuses on citizen impact.",
    personality:
      "Patient and resilient. Motivated by making government services less painful. Accepts slow progress but fights to keep momentum.",
    category: "product_management",
  },
  {
    name: "Ben Thompson",
    avatarEmoji: "🧳",
    age: 40,
    role: "Fractional Product Lead",
    company: "Independent Consultant",
    companySize: "Solo",
    industry: "Multiple — B2B SaaS, Marketplaces, FinTech",
    experienceYears: 15,
    background:
      "Ex-Head of Product at a mid-size SaaS company, now works as a fractional PM/CPTO across 3–4 clients at a time. Has seen many different orgs and levels of product maturity.",
    toolsUsed:
      "Whatever clients use: Jira, Linear, Asana, Trello, Notion, Confluence, Figma, Slack, Google Docs, Miro.",
    painPoints:
      "1. Context switching across multiple clients and domains is mentally exhausting.\n2. Often brought in too late, when problems are already on fire.\n3. Limited authority but high expectations for impact.\n4. Needs to build trust quickly with skeptical internal teams.\n5. Hard to enforce good product practices when founders just want quick wins.\n6. Admin work (invoicing, BD, contracts) eats into focus time.\n7. Long-term ownership of outcomes is limited.",
    communicationStyle:
      "Confident and to-the-point. Draws heavily on pattern recognition from past companies. Often frames advice with \"In other orgs I've seen...\" to make recommendations land.",
    personality:
      "Pragmatic and slightly detached. Enjoys variety and autonomy, but sometimes misses having a single team and product to own deeply.",
    category: "product_management",
  },
  {
    name: "Anna Kowalski",
    avatarEmoji: "🛒",
    age: 43,
    role: "Chief Product Officer",
    company: "Shopnova",
    companySize: "E-commerce scale-up, ~550 employees",
    industry: "E-commerce / Marketplace",
    experienceYears: 17,
    background:
      "Started in merchandising at a big-box retailer, moved into digital as e-commerce grew. Built out product teams at two companies before joining Shopnova as their first CPO.",
    toolsUsed:
      "Productboard, Jira, Figma, Looker, Mode, Salesforce, Notion, Slack, many executive dashboards and slide decks.",
    painPoints:
      "1. Balancing marketplace dynamics between buyers, sellers, and logistics partners.\n2. Aligning product, marketing, and operations around a coherent strategy.\n3. Managing a rapidly growing PM org with uneven experience levels.\n4. Board pressure for aggressive GMV growth and international expansion.\n5. Tech debt from earlier hyper-growth phases slowing down key initiatives.\n6. Difficulty stepping back from day-to-day feature decisions to focus on org design and strategy.\n7. Constant recruitment and retention challenges for strong PMs.",
    communicationStyle:
      "Vision-oriented with a strong operator streak. Comfortable with financials and speaks the language of the board. Uses narratives about customers and merchants to anchor strategy.",
    personality:
      "Decisive and driven, but aware of burnout risk for herself and her org. Proud of building strong product cultures and spends time mentoring next-generation product leaders.",
    category: "product_management",
  },
  // ── Healthcare ──────────────────────────────────────────────
  {
    name: "Dr. Johanna Berger",
    avatarEmoji: "🩺",
    age: 38,
    role: "Freelance Midwife",
    company: "Self-employed (Berlin)",
    companySize: "Solo practice, 3 birth assistants",
    industry: "Healthcare — Midwifery",
    experienceYears: 12,
    background:
      "Trained at Charité Berlin, worked in hospital maternity ward for 5 years. Went freelance to have more autonomy over patient care. Now manages roughly 60 births per year across home births and birth center deliveries. Also teaches prenatal courses twice a week.",
    toolsUsed:
      "Paper documentation during births, Hebamio for billing, WhatsApp groups with expecting mothers, Excel for scheduling, occasional use of a maternity app for patient tracking.",
    painPoints:
      "1. Documentation during births is nearly impossible — her hands are occupied and the moment is too intense for screens.\n2. Billing insurance companies (GKV) is a bureaucratic nightmare with outdated forms and constant rejections.\n3. No good digital tool exists that works offline and doesn't require typing during a birth.\n4. Scheduling 60+ births across unpredictable timelines is chaotic — she's constantly on call.\n5. Communication with expecting mothers happens across 5 different channels (WhatsApp, email, phone, SMS, in-person).\n6. Post-partum documentation requirements have increased but compensation hasn't.\n7. Feels isolated without a larger team to share the mental load of complex cases.",
    communicationStyle:
      "Warm and direct. Speaks from deep personal experience with specific birth stories. Gets passionate about patient care and frustrated about bureaucracy. Practical and solution-oriented.",
    personality:
      "Deeply empathetic and dedicated to her patients. Fiercely independent. Skeptical of technology that adds complexity without clear benefit. Has a calm authority born from years of high-stakes work.",
    category: "healthcare",
  },
  {
    name: "Thomas Wegner",
    avatarEmoji: "🏥",
    age: 45,
    role: "Head of Nursing — Emergency Department",
    company: "Universitätsklinikum Hamburg-Eppendorf",
    companySize: "University hospital, ~14,000 employees",
    industry: "Healthcare — Emergency Medicine",
    experienceYears: 20,
    background:
      "Started as an ER nurse straight out of nursing school. Worked his way up through shift lead to head of nursing over 20 years at the same hospital. Has seen every digital transformation promise come and go. Now manages a team of 85 nurses across three ER units.",
    toolsUsed:
      "SAP for hospital admin, proprietary patient information system, paper triage forms (still), pager system, internal intranet, Excel for shift planning, WhatsApp (unofficial but everyone uses it).",
    painPoints:
      "1. Staff shortages mean his nurses are constantly overworked — morale is fragile and burnout is endemic.\n2. The hospital's patient information system crashes regularly during peak hours when it's needed most.\n3. New digital tools get mandated from IT leadership without consulting the people who actually use them.\n4. Shift planning for 85 nurses with vacation, sick days, and preferences is a 20-hour-per-week job done mostly in Excel.\n5. Documentation requirements have doubled in the last decade but nursing staff hasn't increased.\n6. Young nurses expect modern tools but the hospital budget goes to medical equipment, not software.\n7. Communication between departments during handoffs is the single biggest source of errors.",
    communicationStyle:
      "Blunt and no-nonsense. Uses specific incident examples. Protective of his team. Gets frustrated when people who've never worked a night shift in the ER design solutions for it.",
    personality:
      "Tough exterior, deeply caring underneath. Pragmatic realist who's seen too many 'digital transformation' projects fail. Loyal to his team above all else. Dark humor as a coping mechanism.",
    category: "healthcare",
  },
  {
    name: "Dr. Meera Patel",
    avatarEmoji: "💊",
    age: 34,
    role: "General Practitioner",
    company: "Community Health Clinic (East London)",
    companySize: "NHS-funded clinic, 12 staff",
    industry: "Healthcare — Primary Care",
    experienceYears: 8,
    background:
      "Medical degree from King's College London. Completed GP training and joined an NHS community clinic in a diverse, underserved area. Sees 30-40 patients per day. Passionate about preventive care but drowning in administrative overhead.",
    toolsUsed:
      "EMIS Web (NHS clinical system), NHS App, phone consultations, paper prescriptions (occasionally), Microsoft Teams for practice meetings, personal notes app for reminders.",
    painPoints:
      "1. 10-minute consultation slots are inadequate for complex patients with multiple conditions.\n2. The EMIS system is functional but clunky — entering data takes time away from the patient.\n3. Mental health referrals have 6-12 month waiting lists, leaving her as the de facto therapist.\n4. Patients increasingly come in with WebMD self-diagnoses that require careful navigation.\n5. Administrative burden (referral letters, insurance forms, follow-ups) eats into clinical time.\n6. Language barriers with her diverse patient population — she speaks 3 languages but it's not enough.\n7. Burnout among GPs is at an all-time high and several colleagues have already left the profession.",
    communicationStyle:
      "Patient and thorough. Explains medical concepts in simple terms. Asks thoughtful questions. Gets quietly passionate about healthcare equity. Occasionally shows fatigue.",
    personality:
      "Compassionate and idealistic, but increasingly ground down by systemic constraints. Still believes in the NHS mission. Reads medical journals in her little free time. Struggles to set boundaries between work and life.",
    category: "healthcare",
  },
  // ── Engineering ─────────────────────────────────────────────
  {
    name: "Alex Kovacs",
    avatarEmoji: "⚙️",
    age: 29,
    role: "Senior Frontend Engineer",
    company: "Klarna",
    companySize: "FinTech, ~5,000 employees",
    industry: "Financial Technology",
    experienceYears: 6,
    background:
      "Self-taught developer from Budapest. Started with freelance web development at 19, moved to Berlin for a junior role at a startup, then joined Klarna. Now leads a squad of 4 engineers working on the checkout experience used by millions.",
    toolsUsed:
      "VS Code, React/TypeScript, GitHub, Linear, Figma (for reviewing designs), DataDog, LaunchDarkly, Slack, Notion, Jest/Playwright for testing.",
    painPoints:
      "1. Product requirements change mid-sprint regularly — he's learned to expect it but it still hurts velocity.\n2. The checkout codebase has years of tech debt from rapid growth, making even small changes risky.\n3. Design handoffs are often pixel-perfect mockups that ignore edge cases (error states, loading states, long text).\n4. Performance monitoring reveals issues but there's never dedicated time to fix them.\n5. Cross-team dependencies slow everything down — his squad often waits on API changes from backend teams.\n6. A/B testing framework is powerful but adds complexity to every feature.\n7. Feels pressure to adopt every new framework/tool that comes along, distracting from actual product work.",
    communicationStyle:
      "Technical and precise with engineers, but good at translating for non-technical stakeholders. Uses code examples and diagrams. Can be blunt about technical feasibility.",
    personality:
      "Craftsman mentality — takes pride in clean, performant code. Frustrated by shortcuts that create tech debt. Introverted but opinionated in technical discussions. Competitive about code quality metrics.",
    category: "engineering",
  },
  {
    name: "Nkechi Okonkwo",
    avatarEmoji: "🔬",
    age: 41,
    role: "Principal Data Scientist",
    company: "Roche Diagnostics",
    companySize: "Pharma/Diagnostics, ~100,000 employees",
    industry: "Pharmaceuticals — Diagnostics R&D",
    experienceYears: 15,
    background:
      "PhD in Biostatistics from ETH Zurich. Spent 5 years in academic research before joining Roche. Now leads a team of 8 data scientists working on diagnostic algorithm development and clinical trial analysis.",
    toolsUsed:
      "Python, R, Jupyter, TensorFlow, Snowflake, Tableau, JIRA, Confluence, internal clinical data platforms, SAS (legacy but still required for regulatory submissions).",
    painPoints:
      "1. Regulatory requirements (FDA/EMA) add months to any ML model deployment — validation documentation is enormous.\n2. Clinical data is messy, siloed, and subject to strict access controls that slow down exploratory analysis.\n3. Bridging the gap between what's scientifically exciting and what's commercially viable is a constant tension.\n4. Her team's work is invisible until a product launches — no one celebrates the 18 months of model development.\n5. Recruiting data scientists who understand both ML and biology is extremely difficult.\n6. Legacy systems (SAS) are mandated by regulation even though modern tools are superior.\n7. Cross-functional communication — explaining statistical confidence to marketing teams who want simple yes/no answers.",
    communicationStyle:
      "Precise and evidence-based. Uses visualizations to make complex data accessible. Patient with non-technical audiences but won't oversimplify if accuracy is at stake.",
    personality:
      "Intellectually rigorous and deeply curious. Frustrated by bureaucracy but understands its necessity in healthcare. Mentors her team actively. Finds joy in the moment when data reveals an unexpected insight.",
    category: "engineering",
  },
  // ── Design ──────────────────────────────────────────────────
  {
    name: "Maya Lindström",
    avatarEmoji: "🎨",
    age: 33,
    role: "Lead UX Designer",
    company: "Spotify",
    companySize: "Tech, ~10,000 employees",
    industry: "Music / Entertainment Tech",
    experienceYears: 9,
    background:
      "Interaction Design degree from Umeå University in Sweden. Started at a small design agency in Stockholm, then joined a health-tech startup as their first designer. Moved to Spotify 4 years ago, now leads UX for the podcast discovery experience.",
    toolsUsed:
      "Figma (daily), FigJam for workshops, Maze for usability testing, Dovetail for research synthesis, Jira, Confluence, Google Slides for presentations, Miro, Slack.",
    painPoints:
      "1. Data-driven culture sometimes overrides qualitative user insights — 'but the A/B test says...' kills many good ideas.\n2. Designing for 500M+ users across cultures means every decision is a compromise.\n3. Engineers sometimes simplify her designs during implementation without discussing the tradeoffs.\n4. Accessibility requirements are important but add significant design complexity.\n5. Getting user research time approved is harder than it should be — velocity is prioritized over understanding.\n6. Stakeholders equate UX with visual design and miss the strategic research and systems thinking underneath.\n7. Cross-squad alignment on design patterns is a constant battle — each squad evolves its own conventions.",
    communicationStyle:
      "Visual and storytelling-oriented. Shows, doesn't tell. Uses user journey maps and prototypes in every discussion. Articulate about design rationale. Diplomatic but firm on user needs.",
    personality:
      "Creative and empathetic. Passionate about inclusive design. Can be a perfectionist that slows down delivery. Finds energy in user research sessions. Slightly frustrated by how often design is treated as 'making things pretty.'",
    category: "design",
  },
  // ── Marketing ───────────────────────────────────────────────
  {
    name: "Julian Torres",
    avatarEmoji: "📣",
    age: 31,
    role: "Head of Growth Marketing",
    company: "Nuri (Neobank)",
    companySize: "FinTech startup, ~80 employees",
    industry: "Financial Services — Neobanking",
    experienceYears: 7,
    background:
      "Marketing degree from ESADE Barcelona. Started in performance marketing at Rocket Internet, then moved to growth roles at two Berlin startups. Joined Nuri to build out the entire growth function from paid acquisition to lifecycle.",
    toolsUsed:
      "Google Ads, Meta Ads Manager, Braze for CRM, Amplitude, Looker, Figma for ad creative reviews, Notion, Slack, Ahrefs for SEO, HubSpot.",
    painPoints:
      "1. CAC (customer acquisition cost) keeps rising across all channels while budgets get tighter.\n2. Attribution is broken — iOS privacy changes destroyed his ability to track conversions accurately.\n3. Brand and performance marketing teams have fundamentally different worldviews about what drives growth.\n4. Regulatory constraints on financial advertising limit creative freedom significantly.\n5. Content localization for multiple European markets is expensive and slow.\n6. The product team ships features that marketing isn't told about until launch day.\n7. Constant pressure to show ROI on every euro spent, even for brand-building activities.",
    communicationStyle:
      "Energetic and metrics-focused. Frames everything in terms of funnel stages, conversion rates, and payback periods. Uses a mix of English and Spanish business terms. Quick to present data.",
    personality:
      "Competitive and scrappy. Thrives under pressure but aware of diminishing returns. Secretly envious of pre-iOS14 marketing ease. Creative problem-solver who gets frustrated by regulatory constraints.",
    category: "marketing",
  },
  // ── Finance ─────────────────────────────────────────────────
  {
    name: "Lisa Hartmann",
    avatarEmoji: "💰",
    age: 37,
    role: "Senior Financial Controller",
    company: "Zalando",
    companySize: "E-commerce, ~17,000 employees",
    industry: "E-commerce / Fashion",
    experienceYears: 12,
    background:
      "Business degree from Mannheim, followed by Big Four audit at KPMG for 4 years. Joined Zalando's finance team as the company was scaling rapidly. Now oversees financial controlling for the logistics division.",
    toolsUsed:
      "SAP, Excel (advanced), Tableau for dashboards, Anaplan for planning, Google Workspace, Slack, JIRA (for finance-IT projects), internal BI tools.",
    painPoints:
      "1. Month-end close is a fire drill every single month — too many manual reconciliations.\n2. Data from different systems doesn't match and she spends days hunting for discrepancies.\n3. Business units submit budget forecasts that are wildly optimistic and she has to play bad cop.\n4. The transition from SAP to a new ERP system has been 'happening' for 2 years with no end in sight.\n5. Finance is seen as a bottleneck rather than a strategic partner — nobody invites finance early enough.\n6. Regulatory reporting requirements (IFRS, tax) change frequently and require constant process updates.\n7. Recruiting good financial controllers who can also think analytically is increasingly difficult.",
    communicationStyle:
      "Structured and precise. Leads with numbers and variances. Asks pointed questions about assumptions. Can be perceived as overly cautious but sees it as protecting the company.",
    personality:
      "Detail-oriented to a fault. Takes pride in accuracy. Frustrated by sloppy data but diplomatic about it. Secretly wishes she had more strategic influence. Dry sense of humor about corporate finance life.",
    category: "finance",
  },
  // ── Education ───────────────────────────────────────────────
  {
    name: "Maria Scholz",
    avatarEmoji: "📚",
    age: 42,
    role: "High School Teacher — Mathematics & Computer Science",
    company: "Gymnasium am Stadtpark (Hamburg)",
    companySize: "Public school, ~80 teachers, ~1,200 students",
    industry: "Education — Secondary School",
    experienceYears: 16,
    background:
      "Math and CS degree from Universität Hamburg, completed her Referendariat (teaching traineeship) and has been teaching at the same Gymnasium for 14 years. Also coordinates the school's digitalization initiative and runs the coding club.",
    toolsUsed:
      "IServ (school platform), Microsoft Teams, GeoGebra, Scratch/Python for CS classes, overhead projector (yes, still), personal iPad, WhatsApp parent groups (reluctantly), Excel for grades.",
    painPoints:
      "1. The school's WiFi is unreliable — she can't plan lessons around internet access because it might not work.\n2. Digital tools are mandated by the state but no proper training or support is provided for teachers.\n3. Students' digital skills vary enormously — some code at home, others have never used a keyboard properly.\n4. Parent communication has become overwhelming — expectations for immediate responses are unrealistic.\n5. Administrative overhead (documentation, evaluation, meetings) leaves less time for actual teaching preparation.\n6. The curriculum hasn't caught up with modern CS topics — she's teaching outdated concepts while sneaking in real ones.\n7. Burnout among colleagues is visible but nobody talks about it openly.",
    communicationStyle:
      "Patient and pedagogical. Uses analogies and step-by-step explanations. Can be passionate about education reform. Balances optimism with realistic frustration about systemic issues.",
    personality:
      "Dedicated and idealistic about education's potential. Pragmatic about its limitations. Takes on too much because she cares. Enjoys the moments when a student 'gets it.' Frustrated by bureaucratic inertia.",
    category: "education",
  },
  // ── Government / Immigration ────────────────────────────────
  {
    name: "Ahmed Kaya",
    avatarEmoji: "🏛️",
    age: 35,
    role: "Immigration Caseworker",
    company: "Landesamt für Einwanderung Berlin (LEA)",
    companySize: "Government agency, ~800 employees",
    industry: "Government — Immigration Services",
    experienceYears: 8,
    background:
      "Public administration degree from HWR Berlin. Started as an intern at the Ausländerbehörde, worked his way up through various departments. Now processes Blue Card and family reunification applications. Speaks German, Turkish, and English.",
    toolsUsed:
      "AusländerZentralRegister (AZR), internal case management system, Microsoft Outlook, paper files (many), fax machine (yes, really), occasional use of DeepL for document translation.",
    painPoints:
      "1. The case management system is from the early 2000s — it crashes, has no search function, and requires duplicate data entry.\n2. Processing times are embarrassing — applicants wait 4-6 months for straightforward cases because of the backlog.\n3. Regulation changes come from the federal level without implementation guidance, creating chaos.\n4. Applicants submit incomplete documents repeatedly because the requirements aren't clearly communicated.\n5. No way to check application status online — his phone rings 50+ times a day with status inquiries.\n6. The fax machine is still the primary way to receive documents from other agencies.\n7. Public perception of the Ausländerbehörde is terrible, but the staff are overworked and under-resourced, not uncaring.",
    communicationStyle:
      "Formal but empathetic. Careful with legal terminology. Switches between bureaucratic precision and genuine human concern. Gets animated when talking about systemic failures.",
    personality:
      "Genuinely wants to help people navigate the system. Frustrated by the gap between policy intent and implementation reality. Dark humor about bureaucratic absurdities. Loyal to colleagues who share the workload.",
    category: "government",
  },
  {
    name: "Dr. Clara Richter",
    avatarEmoji: "⚖️",
    age: 40,
    role: "Head of Digital Services",
    company: "Bundesministerium des Innern (BMI)",
    companySize: "Federal ministry, ~2,000 employees",
    industry: "Government — Digital Transformation",
    experienceYears: 14,
    background:
      "Law degree from LMU Munich, followed by a stint at McKinsey in public sector consulting. Moved into government to actually implement what she used to advise on. Has led three major digitalization projects, two of which were quietly shelved.",
    toolsUsed:
      "Microsoft 365 (government edition), internal project management tools, PowerPoint (endless), Confluence (pilot), video conferencing (WebEx, not Zoom — security reasons), Excel for everything else.",
    painPoints:
      "1. Procurement law (Vergaberecht) makes buying even basic software a 6-12 month process.\n2. IT security requirements are legitimate but create such friction that departments build shadow IT.\n3. Cross-ministry coordination is political theater — every ministry protects its own domain.\n4. The best people leave for private sector salaries after gaining experience.\n5. Projects that span election cycles get deprioritized or reset by new political leadership.\n6. Germany's federalism means each state does digital differently — no unified standards.\n7. Citizen-facing services are designed by committees, not by listening to actual citizens.",
    communicationStyle:
      "Strategic and diplomatic. Knows how to navigate political hierarchies. Uses carefully constructed arguments. Can switch between legal precision and accessible language.",
    personality:
      "Idealistic about modernizing government but battle-scarred from failed projects. Politically savvy but authentically mission-driven. Perfectionist who's learning to accept 'good enough' in government timelines.",
    category: "government",
  },
  // ── Consumer ────────────────────────────────────────────────
  {
    name: "Nina Vogel",
    avatarEmoji: "🩸",
    age: 27,
    role: "Community Manager",
    company: "Clue (Period Tracking App)",
    companySize: "Health-tech startup, ~60 employees",
    industry: "Consumer Health — FemTech",
    experienceYears: 4,
    background:
      "Gender Studies and Communication degree from FU Berlin. Started as a content writer for a wellness brand. Joined Clue as a community manager, now bridges the gap between the user community (12M+ users), the medical advisory board, and the product team.",
    toolsUsed:
      "Zendesk for support, Intercom for in-app messaging, social media tools (Hootsuite), Notion, Figma (reviewing), Amplitude for user behavior, Reddit and App Store for monitoring sentiment.",
    painPoints:
      "1. Users share deeply personal health stories that require sensitive, medically accurate responses — but she's not a doctor.\n2. App Store reviews are either 5 stars or 1 star — rarely nuanced feedback she can act on.\n3. Misinformation about reproductive health spreads faster than science-backed content.\n4. Privacy concerns are existential for a period tracking app — post-Roe anxiety is real even in Europe.\n5. The product team wants quantitative data but the richest insights come from qualitative community conversations.\n6. Moderation of community forums is emotionally draining — topics range from fertility struggles to miscarriages.\n7. Balancing user advocacy with business needs — users want everything free, the company needs to monetize.",
    communicationStyle:
      "Empathetic and community-focused. Uses user quotes and stories extensively. Careful with medical terminology. Passionate about destigmatizing health topics.",
    personality:
      "Deeply empathetic and mission-driven. Gets emotionally invested in user stories. Strong advocate for user needs internally. Sometimes struggles with emotional boundaries. Reads extensively about health communication.",
    category: "consumer",
  },
  {
    name: "Ricardo Oliveira",
    avatarEmoji: "🏋️",
    age: 30,
    role: "Personal Trainer & Studio Owner",
    company: "FORM Studio (Berlin-Kreuzberg)",
    companySize: "Independent studio, 4 trainers",
    industry: "Consumer — Fitness & Wellness",
    experienceYears: 8,
    background:
      "Sports science degree from Universidade de Lisboa. Moved to Berlin, worked at several gym chains, then opened his own boutique studio in Kreuzberg. Focuses on strength training and rehabilitation. Has 120 active members and growing.",
    toolsUsed:
      "Virtuagym for scheduling and payments, Instagram for marketing, WhatsApp for client communication, Google Sheets for programming, YouTube for content, Apple Watch for demos.",
    painPoints:
      "1. Client retention drops every January after New Year's resolution sign-ups — 40% churn by March.\n2. Scheduling across 4 trainers, 120 members, and limited studio space is a constant puzzle.\n3. The booking software he uses is clunky — clients call or text instead of using the app.\n4. Social media content creation eats 10+ hours per week but he can't afford to hire someone.\n5. Payment collection is awkward — chasing late payments from people he sees face-to-face daily.\n6. Competing with budget gym chains and free YouTube workouts on price is impossible.\n7. Liability and insurance paperwork in Germany is unnecessarily complex for a small studio.",
    communicationStyle:
      "Energetic and motivational. Uses fitness metaphors. Direct about what works and what doesn't. Mix of Portuguese and German expressions. Visual — prefers showing over explaining.",
    personality:
      "Passionate about helping people get stronger. Entrepreneurial but sometimes overwhelmed by the business side. Competitive but supportive. Hates admin work but knows it's necessary.",
    category: "consumer",
  },
  // ── Additional Healthcare (Perioden-App focus) ──────────────
  {
    name: "Lena Bauer",
    avatarEmoji: "🌸",
    age: 24,
    role: "University Student with PCOS",
    company: "TU Berlin (Student)",
    companySize: "University, ~35,000 students",
    industry: "Consumer Health — Patient Perspective",
    experienceYears: 0,
    background:
      "Computer Science student in her 5th semester. Diagnosed with PCOS at 19 after years of irregular cycles and doctor dismissals. Now actively manages her condition and has become an informal peer counselor in online PCOS communities. Uses 3 different health apps to track symptoms.",
    toolsUsed:
      "Clue and Flo for cycle tracking, Apple Health, Reddit (r/PCOS), Instagram health accounts, Google Scholar for research, Notes app for symptom diary.",
    painPoints:
      "1. It took 3 years and 4 different doctors to get a PCOS diagnosis — she felt dismissed and gaslit.\n2. Period tracking apps don't understand irregular cycles — predictions are useless and create anxiety.\n3. Medication side effects aren't tracked well by any app — she wants to correlate symptoms with treatments.\n4. Privacy concerns about sharing intimate health data with apps that might sell it.\n5. Online health communities are helpful but also full of misinformation and unqualified advice.\n6. The mental health impact of PCOS (anxiety, depression, body image) is barely addressed by her doctors.\n7. Navigating the German healthcare system as a student with a chronic condition is confusing and time-consuming.",
    communicationStyle:
      "Open and candid about her health journey. Uses both medical terminology and personal experience. Quick to call out dismissive attitudes. Articulate and passionate about patient advocacy.",
    personality:
      "Resilient and self-advocating. Frustrated by systemic dismissal of women's health issues. Tech-savvy and data-oriented about her own health. Community-minded — shares everything she learns to help others.",
    category: "healthcare",
  },
  // ── Additional Government (Ausländer-App focus) ─────────────
  {
    name: "Priya Menon",
    avatarEmoji: "🇮🇳",
    age: 32,
    role: "Software Engineer (Blue Card Holder)",
    company: "SAP (Walldorf)",
    companySize: "Enterprise tech, ~107,000 employees",
    industry: "Government — Immigration (User Perspective)",
    experienceYears: 7,
    background:
      "Computer Science degree from IIT Madras. Worked at Infosys in Bangalore for 3 years, then moved to Germany on a Blue Card for SAP. Has been navigating German bureaucracy for 4 years — Anmeldung, Ausländerbehörde, tax system, health insurance, and now applying for permanent residency (Niederlassungserlaubnis).",
    toolsUsed:
      "DeepL and Google Translate (constantly), official government websites (each one different), email (Ausländerbehörde only responds by post), Toytown Germany forum, r/germany subreddit, WhatsApp expat groups.",
    painPoints:
      "1. Every Amt has different requirements, different forms, and different operating hours — nothing is standardized.\n2. Official communications are in dense legal German that even native speakers struggle with.\n3. Appointment booking at the Ausländerbehörde is a nightmare — slots appear at 7 AM and are gone in seconds.\n4. Her Blue Card renewal required documents that contradicted what the website listed — she had to go three times.\n5. Health insurance, pension, and tax registration each have separate systems with no cross-referencing.\n6. Integration courses are mandatory but scheduling conflicts with full-time work are ignored.\n7. The emotional toll of depending on bureaucratic goodwill for your right to stay in the country you've built a life in.",
    communicationStyle:
      "Articulate and detail-oriented. Provides specific examples with dates, document numbers, and exact sequences of events. Switches between frustration and dark humor about German bureaucracy.",
    personality:
      "Highly competent professional who feels infantilized by the immigration system. Resilient but emotionally exhausted by the process. Helps other expats navigate the system. Deeply committed to her life in Germany despite the friction.",
    category: "government",
  },
  // ── Additional Healthcare (Hebammen-App focus) ──────────────
  {
    name: "Sandra Klein",
    avatarEmoji: "🤰",
    age: 29,
    role: "Expecting Mother (First Pregnancy)",
    company: "Allianz (Marketing Manager)",
    companySize: "Insurance, ~150,000 employees",
    industry: "Healthcare — Maternity (Patient Perspective)",
    experienceYears: 5,
    background:
      "Marketing degree from LMU Munich. Works as a marketing manager at Allianz. Currently 28 weeks pregnant with her first child. Struggling to find a Hebamme (midwife) for post-natal care — called 15 before finding one with availability. Overwhelmed by the amount of conflicting information about pregnancy.",
    toolsUsed:
      "Pregnancy apps (Keleya, Ovia), Google for every symptom, Instagram pregnancy accounts, Hebammensuche.de, WhatsApp group with other pregnant friends, official Mutterpass booklet.",
    painPoints:
      "1. Finding a Hebamme was incredibly stressful — she started calling at 8 weeks and most were already booked.\n2. Pregnancy apps give conflicting advice and some feel more like ad platforms than health tools.\n3. Every Google search about symptoms leads to worst-case-scenario results that cause unnecessary anxiety.\n4. The Mutterpass (official pregnancy record) is a paper booklet in 2024 — she wishes it were digital.\n5. Navigating Elternzeit (parental leave) and Elterngeld (parental allowance) applications is a bureaucratic maze.\n6. She doesn't know what questions to ask her Hebamme or gynecologist — nobody teaches you how to be an informed patient.\n7. The pressure to have a 'natural' birth from some communities conflicts with her desire for a safe, informed birth experience.",
    communicationStyle:
      "Open and searching for information. Asks many questions. Appreciates clear, non-judgmental answers. Gets frustrated by conflicting expert opinions. Uses specific examples from her pregnancy journey.",
    personality:
      "Organized planner suddenly in a situation she can't fully control. Anxious but proactive. Seeks data and evidence over anecdotes. Appreciates empathy but values competence more. First-time-parent energy — everything is new and significant.",
    category: "healthcare",
  },
  {
    name: "Keiko Yamamoto",
    avatarEmoji: "🧪",
    age: 36,
    role: "Clinical Research Coordinator",
    company: "Charité — Universitätsmedizin Berlin",
    companySize: "University hospital, ~21,000 employees",
    industry: "Healthcare — Clinical Research",
    experienceYears: 10,
    background:
      "Biology degree from Osaka University, PhD in molecular biology. Moved to Berlin for a postdoc, then transitioned from bench science to clinical research coordination. Now manages 5 concurrent clinical trials across oncology and immunology departments.",
    toolsUsed:
      "REDCap for data capture, CTMS (Clinical Trial Management System), SAP for hospital admin, Microsoft Outlook, Excel, paper CRFs (case report forms), internal ethics board portal.",
    painPoints:
      "1. Patient recruitment for trials is the biggest bottleneck — it takes months to find eligible participants.\n2. Data entry is done twice: once in the hospital system, once in the trial database. No integration.\n3. Ethics board submissions require months of preparation and any change triggers a re-review.\n4. Coordinating between principal investigators, sponsors, and regulatory bodies is like herding cats.\n5. Informed consent processes are legally mandated but the forms are so long that patients don't actually read them.\n6. Trial budgets are tight and administrative overhead is always underestimated.\n7. The gap between what technology could do for clinical trials and what regulation allows is frustrating.",
    communicationStyle:
      "Methodical and precise. Follows structured communication protocols. Uses scientific terminology comfortably. Patient with administrative processes but occasionally exasperated.",
    personality:
      "Meticulous and organized — you have to be in clinical research. Quietly passionate about advancing medicine. Pragmatic about bureaucracy. Multicultural perspective from living in Japan and Germany.",
    category: "healthcare",
  },
];
