export type ChallengeDay = {
  number: 1 | 2 | 3 | 4 | 5 | 6 | 7;
  slug: string;
  title: string;
  subtitle: string;
  estimatedTime: string;
  objective: string;
  lessonSections: { heading: string; body: string }[];
  tasks: string[];
  deliverable: { key: string; label: string; description: string };
  completionMessage: string;
  milestone: string;
};

export const TOTAL_DAYS = 7;

export const CHALLENGE_DAYS: ChallengeDay[] = [
  {
    number: 1,
    slug: "day-1",
    title: "Choose Your Money-Maker",
    subtitle: "Pick one service to focus on for the next 7 days.",
    estimatedTime: "45–60 min",
    objective: "Choose one local service to focus on based on demand, startup cost, and your ability to start quickly.",
    lessonSections: [
      {
        heading: "Why one service?",
        body: "Beginners lose momentum trying to do everything. One clear service makes your offer, pricing, and outreach simple. You can add services later — first, get customers for one thing.",
      },
      {
        heading: "How to evaluate a service",
        body: "Score each option on: startup cost, skill requirement, local demand, repeat potential, average job value, ease of getting customers, and how fast you can start. There is no perfect choice — pick the best fit for your budget, skills, and market.",
      },
      {
        heading: "What good looks like today",
        body: "By the end of today you will commit to ONE service. Not three ideas. Not “maybe detailing or pressure washing.” One focused money-maker you will build around this week.",
      },
    ],
    tasks: [
      "Review the service options below",
      "Compare startup cost, demand, and ease of getting customers",
      "Use the AI coach if you are stuck between two options",
      "Lock in your chosen service",
    ],
    deliverable: {
      key: "selectedService",
      label: "Selected Service",
      description: "The one local service you are building your business around.",
    },
    completionMessage: "Service locked in. Tomorrow you turn it into an offer people understand.",
    milestone: "Service chosen.",
  },
  {
    number: 2,
    slug: "day-2",
    title: "Build an Offer People Understand",
    subtitle: "Turn your service into a clear, buyable offer.",
    estimatedTime: "45–60 min",
    objective: "Define exactly what you are selling and why someone should buy from you.",
    lessonSections: [
      {
        heading: "Service vs. offer",
        body: "A service is what you do: “I do pressure washing.” An offer is what the customer gets: “We restore driveways and patios for homeowners who want their property to look new again — includes pre-treatment, full wash, and a satisfaction check.”",
      },
      {
        heading: "The offer formula",
        body: "We [core job] for [ideal customer] with [clear package/result]. The more specific you are, the easier it is to price, post, and sell.",
      },
      {
        heading: "Bad vs. better",
        body: "Bad: “I do auto detailing.” Better: “We bring showroom-level interior and exterior detailing to busy professionals who do not have time to drive to a shop.”",
      },
    ],
    tasks: [
      "Fill in the Offer Builder fields",
      "Generate your core offer statement",
      "Refine with the AI coach if needed",
      "Save your offer",
    ],
    deliverable: {
      key: "coreOffer",
      label: "My Core Offer",
      description: "Your one-sentence offer statement ready to use in posts and messages.",
    },
    completionMessage: "Offer built. Tomorrow you put a price on it.",
    milestone: "Offer built.",
  },
  {
    number: 3,
    slug: "day-3",
    title: "Price It",
    subtitle: "Create simple starter pricing without guessing.",
    estimatedTime: "45–60 min",
    objective: "Build three pricing tiers as starting estimates you can validate in your market.",
    lessonSections: [
      {
        heading: "Pricing is a starting point",
        body: "Your first prices are educated guesses. The goal today is to have numbers you can quote confidently — then adjust based on real customer feedback and local competition.",
      },
      {
        heading: "What goes into a price",
        body: "Consider labor time, supplies, travel, and the hourly value you want. A simple package structure (starter, standard, premium) helps customers choose and helps you upsell.",
      },
      {
        heading: "Validate in your market",
        body: "Check what others charge locally. Ask in community groups. Your first quote teaches you more than another hour of research.",
      },
    ],
    tasks: [
      "Enter your service details in the Pricing Builder",
      "Review generated starter, standard, and premium prices",
      "Adjust numbers to fit your market",
      "Save your 3-tier pricing",
    ],
    deliverable: {
      key: "pricingTiers",
      label: "3-Tier Pricing",
      description: "Starter, standard, and premium package prices.",
    },
    completionMessage: "Pricing locked. Tomorrow you make your business look legit.",
    milestone: "Pricing locked.",
  },
  {
    number: 4,
    slug: "day-4",
    title: "Look Legit",
    subtitle: "Create your basic brand and customer-facing presence.",
    estimatedTime: "60–90 min",
    objective: "Set up the essentials so customers trust you before they hire you.",
    lessonSections: [
      {
        heading: "Minimum viable professionalism",
        body: "You do not need an LLC today to look legitimate. You need a clear name, a way to contact you, a short description of what you do, and at least one place customers can find you online.",
      },
      {
        heading: "Legal basics (verify locally)",
        body: "Licensing, registration, taxes, insurance, and other requirements depend on your location and service type. Research what applies to you — do not skip this before taking paid jobs.",
      },
      {
        heading: "Before/after photos",
        body: "Even phone photos of your work build trust. Plan to capture before and after on every job — they become your best marketing asset.",
      },
    ],
    tasks: [
      "Complete the brand checklist",
      "Write your business description and bios",
      "Set up at least one online presence (Facebook, Instagram, or Google)",
      "Save your customer-facing profile",
    ],
    deliverable: {
      key: "businessProfile",
      label: "Customer-Facing Business Profile",
      description: "Your name, description, contact method, and online presence details.",
    },
    completionMessage: "You look legit. Tomorrow you build your prospect list.",
    milestone: "Looking legit.",
  },
  {
    number: 5,
    slug: "day-5",
    title: "Find Customers",
    subtitle: "Build a list of real people and places to reach out to.",
    estimatedTime: "60 min",
    objective: "Identify 25 prospects and plan how you will reach them.",
    lessonSections: [
      {
        heading: "Where customers actually come from",
        body: "Most beginners get early customers from people they know, local Facebook groups, neighborhood apps, referrals, and direct outreach — not fancy ads. Start where trust already exists.",
      },
      {
        heading: "Channels to consider",
        body: "Friends and family, Facebook community groups, Nextdoor-style platforms, Facebook Marketplace, door hangers, direct outreach, local businesses, property managers, realtors, HOAs, and past customers.",
      },
      {
        heading: "The 25-prospect rule",
        body: "Twenty-five names gives you enough volume to get conversations started. Some will say no. Some will ghost. That is normal. You need a list before you need perfect messaging.",
      },
    ],
    tasks: [
      "Brainstorm prospects from the channels above",
      "Add at least 25 names to your prospect list",
      "Set each prospect's status to Not Contacted",
      "Save your list",
    ],
    deliverable: {
      key: "prospectList",
      label: "25-Prospect List",
      description: "Your first list of potential customers with contact status.",
    },
    completionMessage: "Prospect list built. Tomorrow you start reaching out.",
    milestone: "Ready to prospect.",
  },
  {
    number: 6,
    slug: "day-6",
    title: "Start Selling",
    subtitle: "Use scripts and posts to begin customer outreach.",
    estimatedTime: "60–90 min",
    objective: "Send or post at least 10 customer-acquisition actions using your scripts.",
    lessonSections: [
      {
        heading: "Outreach beats perfection",
        body: "A good message sent today beats a perfect message never sent. Use the scripts below as starting points — personalize them for your service and market.",
      },
      {
        heading: "Daily outreach goal",
        body: "Aim for at least 10 actions today: DMs, posts, follow-ups, or warm contacts. Track each one. Consistency builds momentum.",
      },
      {
        heading: "Follow up",
        body: "Most people need a second touch. Use Follow-Up #1 and #2 scripts when someone does not reply. Stay friendly, not pushy.",
      },
    ],
    tasks: [
      "Copy and personalize your outreach scripts",
      "Complete at least 10 outreach actions",
      "Track each action in the Outreach Tracker",
      "Mark first outreach as complete",
    ],
    deliverable: {
      key: "firstOutreach",
      label: "First Outreach Completed",
      description: "At least 10 customer-acquisition actions logged.",
    },
    completionMessage: "Outreach started. Tomorrow you learn to close and deliver.",
    milestone: "Outreach started.",
  },
  {
    number: 7,
    slug: "day-7",
    title: "Close & Deliver",
    subtitle: "Quote jobs, deliver great work, and build repeat business.",
    estimatedTime: "60–90 min",
    objective: "Build your quoting and closing system so you can turn interest into booked jobs.",
    lessonSections: [
      {
        heading: "Speed wins early jobs",
        body: "Respond quickly. Ask simple qualifying questions. Give a clear quote. Confirm the appointment. Set expectations upfront.",
      },
      {
        heading: "The job flow",
        body: "Before photos → do the job → after photos → collect payment → request a review → ask for referrals → offer recurring service where it makes sense.",
      },
      {
        heading: "Avoid endless negotiation",
        body: "State your price confidently. Offer your packages. If someone wants to haggle endlessly, they may not be your ideal customer early on.",
      },
    ],
    tasks: [
      "Build a sample quote using the Quote Builder",
      "Review closing and follow-up scripts",
      "Save your customer closing system",
      "Complete the challenge",
    ],
    deliverable: {
      key: "closingSystem",
      label: "Customer Closing System",
      description: "Your quote template and closing scripts ready to use.",
    },
    completionMessage: "Challenge complete. You have a real system — now go execute.",
    milestone: "Challenge completed.",
  },
];

export const SERVICE_OPTIONS = [
  {
    id: "auto-detailing",
    name: "Auto Detailing",
    startupCost: "Low–Medium",
    skillLevel: "Medium",
    demand: "High",
    repeatPotential: "High",
    avgJobValue: "$75–$250",
    easeOfCustomers: "Medium",
    startSpeed: "Fast",
  },
  {
    id: "pressure-washing",
    name: "Pressure Washing",
    startupCost: "Medium",
    skillLevel: "Low–Medium",
    demand: "High",
    repeatPotential: "Medium",
    avgJobValue: "$150–$400",
    easeOfCustomers: "Medium",
    startSpeed: "Medium",
  },
  {
    id: "window-cleaning",
    name: "Window Cleaning",
    startupCost: "Low",
    skillLevel: "Low",
    demand: "Medium–High",
    repeatPotential: "High",
    avgJobValue: "$100–$300",
    easeOfCustomers: "Medium",
    startSpeed: "Fast",
  },
  {
    id: "residential-cleaning",
    name: "Residential Cleaning",
    startupCost: "Low",
    skillLevel: "Low–Medium",
    demand: "High",
    repeatPotential: "Very High",
    avgJobValue: "$100–$250",
    easeOfCustomers: "Medium",
    startSpeed: "Fast",
  },
  {
    id: "lawn-care",
    name: "Lawn Care",
    startupCost: "Medium",
    skillLevel: "Low–Medium",
    demand: "High",
    repeatPotential: "Very High",
    avgJobValue: "$40–$150",
    easeOfCustomers: "Medium",
    startSpeed: "Medium",
  },
  {
    id: "junk-removal",
    name: "Junk Removal",
    startupCost: "Medium–High",
    skillLevel: "Low",
    demand: "Medium–High",
    repeatPotential: "Low–Medium",
    avgJobValue: "$150–$500",
    easeOfCustomers: "Medium",
    startSpeed: "Medium",
  },
  {
    id: "handyman",
    name: "Handyman Services",
    startupCost: "Low–Medium",
    skillLevel: "Medium–High",
    demand: "High",
    repeatPotential: "High",
    avgJobValue: "$75–$300",
    easeOfCustomers: "Medium",
    startSpeed: "Fast",
  },
  {
    id: "pet-services",
    name: "Pet Services",
    startupCost: "Low",
    skillLevel: "Low",
    demand: "High",
    repeatPotential: "Very High",
    avgJobValue: "$25–$75",
    easeOfCustomers: "High",
    startSpeed: "Fast",
  },
];

export const ONBOARDING_SERVICES = [
  "Auto Detailing",
  "Pressure Washing",
  "Window Cleaning",
  "Residential Cleaning",
  "Lawn Care",
  "Junk Removal",
  "Handyman Services",
  "Pet Services",
  "Other / Help Me Choose",
];
