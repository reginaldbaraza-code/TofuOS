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
}

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
  },
];
